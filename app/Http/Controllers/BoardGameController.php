<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use App\Models\BoardGameReview;
use App\Models\Carousel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoardGameController extends Controller
{
    /**
     * Katalog admin
     */
    public function index(Request $request)
    {
        $query = BoardGame::query();

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode', 'like', "%{$search}%")
                    ->orWhere('penerbit', 'like', "%{$search}%");
            });
        }

        if ($lantai = $request->filterLantai) {
            $query->where('lantai', $lantai);
        }

        if ($box = $request->filterBox) {
            $query->where('box', $box);
        }

        $sortField = $request->sortField ?? 'nama';
        $sortDir = $request->sortDir === 'desc' ? 'desc' : 'asc';

        $query->orderBy($sortField, $sortDir);

        return Inertia::render('Boardgame/Games', [
            'boardgames' => $query->paginate(20)->withQueryString(),
            'query' => $request->only([
                'search',
                'sortField',
                'sortDir',
                'filterLantai',
                'filterBox'
            ]),
        ]);
    }

    /**
     * Katalog user
     */
    public function katalog(Request $request)
    {
        $allowedSorts = ['popular', 'rating', 'name_asc', 'name_desc'];
        $sort = in_array($request->input('sort'), $allowedSorts, true)
            ? $request->input('sort')
            : 'popular';

        $query = BoardGame::withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->withCount(['loans as loans_count' => function ($q) {
                $q->whereNotIn('status', ['ditolak', 'dibatalkan', 'draft', 'pending', 'menunggu']);
            }]);

        switch ($sort) {
            case 'rating':
                $query->orderByRaw('CASE WHEN reviews_count = 0 THEN 1 ELSE 0 END')
                      ->orderByDesc('reviews_avg_rating')
                      ->orderByDesc('reviews_count')
                      ->orderBy('nama');
                break;
            case 'name_asc':
                $query->orderBy('nama', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('nama', 'desc');
                break;
            case 'popular':
            default:
                $query->orderByDesc('loans_count')
                      ->orderBy('nama');
                break;
        }

        $games = $query->get([
            'id', 'kode', 'nama', 'penerbit', 'kategori',
            'jumlah_pemain', 'durasi', 'lantai', 'link_foto',
            'available_copies', 'populer', 'created_at',
        ])->map(function ($game) {
            $game->reviews_avg_rating = $game->reviews_avg_rating
                ? round($game->reviews_avg_rating, 1)
                : 0;
            return $game;
        })->values();

        $carousels = Carousel::orderBy('sort_order')->get()->map(fn ($c) => [
            'id' => $c->id,
            'title' => $c->title,
            'description' => $c->description,
            'detailTitle' => $c->detail_title,
            'detailDescription' => $c->detail_description,
            'points' => $c->points ?? [],
            'theme' => $c->theme,
            'bgImage' => $c->bg_image_url,
        ]);

        return Inertia::render('Katalog', [
            'games' => $games,
            'carousels' => $carousels,
            'filters' => [
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Detail board game untuk user
     */
    public function detail(BoardGame $boardGame)
    {
        $gameSerupa = BoardGame::where('kategori', $boardGame->kategori)
            ->where('id', '!=', $boardGame->id)
            ->inRandomOrder()
            ->limit(8)
            ->get([
                'id',
                'nama',
                'kategori',
                'link_foto'
            ]);

        $selectedRating = request('review_rating', 'all');

        $allReviews = BoardGameReview::where('boardgame_id', $boardGame->id)
            ->get(['rating']);

        $totalReviews = $allReviews->count();
        $avgRating = $allReviews->avg('rating');

        $ratingDistribution = [];
        for ($star = 5; $star >= 1; $star--) {
            $count = $allReviews->where('rating', $star)->count();
            $percentage = $totalReviews > 0 ? round(($count / $totalReviews) * 100) : 0;
            $ratingDistribution[] = [
                'star' => $star,
                'count' => $count,
                'percentage' => $percentage,
            ];
        }

        $reviewsQuery = BoardGameReview::where('boardgame_id', $boardGame->id)
            ->select('id', 'rating', 'comment', 'created_at')
            ->latest();

        if ($selectedRating !== 'all') {
            $reviewsQuery->where('rating', (int) $selectedRating);
        }

        $reviews = $reviewsQuery->paginate(5, ['*'], 'review_page')->withQueryString();

        return Inertia::render('Detail', [
            'game' => $boardGame,
            'gameSerupa' => $gameSerupa,
            'reviews' => $reviews,
            'avgRating' => $totalReviews > 0 ? round($avgRating, 1) : 0,
            'totalReviews' => $totalReviews,
            'ratingDistribution' => $ratingDistribution,
            'selectedReviewRating' => $selectedRating,
        ]);
    }

    /**
     * Detail admin
     */
    public function show(BoardGame $boardGame)
    {
        return Inertia::render('Boardgame/Show', [
            'boardgame' => $boardGame
        ]);
    }

    public function create()
    {
        return Inertia::render('Boardgame/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:255|unique:board_games,kode',
            'box' => 'required|integer',
            'nama' => 'required|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'kategori' => 'nullable|array',
            'kategori.*' => 'string|max:255',
            'jumlah' => 'required|integer',
            'satuan' => 'required|string|max:255',
            'tingkat_kesulitan' => 'nullable|numeric|min:1|max:5',
            'usia_minimum' => 'nullable|string|max:255',
            'jumlah_pemain' => 'nullable|string|max:255',
            'durasi' => 'nullable|string|max:255',
            'link_foto' => 'nullable|array',
            'link_foto.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'komponen' => 'required|array',
            'komponen.*.jumlah' => 'nullable|integer|min:1',
            'komponen.*.nama' => 'nullable|string|max:255',
            'barang_hilang' => 'nullable|array',
            'barang_hilang.*.jumlah' => 'nullable|integer|min:1',
            'barang_hilang.*.nama' => 'nullable|string|max:255',
            'lantai' => 'required|integer',
            'deskripsi' => 'nullable|string',
            'link_tutorial' => 'nullable|string|max:255',
            'populer' => 'boolean',
        ]);

        $fotoPaths = [];
        if ($request->hasFile('link_foto')) {
            foreach ($request->file('link_foto') as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('boardgames', 'public');
                    $fotoPaths[] = '/storage/' . $path;
                }
            }
        }
        $validated['link_foto'] = $fotoPaths;
        $validated['available_copies'] = $validated['jumlah'];

        BoardGame::create($validated);

        return redirect('/admin/games')
            ->with('success', 'Board game berhasil ditambahkan.');
    }

    public function edit(BoardGame $boardGame)
    {
        return Inertia::render('Boardgame/Edit', [
            'boardgame' => $boardGame
        ]);
    }

    public function update(Request $request, BoardGame $boardGame)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:255|unique:board_games,kode,' . $boardGame->id,
            'box' => 'required|integer',
            'nama' => 'required|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'kategori' => 'nullable|array',
            'kategori.*' => 'string|max:255',
            'jumlah' => 'required|integer',
            'satuan' => 'required|string|max:255',
            'tingkat_kesulitan' => 'nullable|numeric|min:1|max:5',
            'usia_minimum' => 'nullable|string|max:255',
            'jumlah_pemain' => 'nullable|string|max:255',
            'durasi' => 'nullable|string|max:255',
            'link_foto' => 'nullable|array',
            'komponen' => 'required|array',
            'komponen.*.jumlah' => 'nullable|integer|min:1',
            'komponen.*.nama' => 'nullable|string|max:255',
            'barang_hilang' => 'nullable|array',
            'barang_hilang.*.jumlah' => 'nullable|integer|min:1',
            'barang_hilang.*.nama' => 'nullable|string|max:255',
            'lantai' => 'required|integer',
            'deskripsi' => 'nullable|string',
            'link_tutorial' => 'nullable|string|max:255',
            'populer' => 'boolean',
            'available_copies' => 'required|integer|max:' . $boardGame->jumlah,
        ]);

        $existingFotos = array_filter($request->input('existing_fotos', []), fn($url) => !empty($url));
        $fotoPaths = array_values($existingFotos);

        if ($request->hasFile('new_fotos')) {
            foreach ($request->file('new_fotos') as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('boardgames', 'public');
                    $fotoPaths[] = '/storage/' . $path;
                }
            }
        }

        $validated['link_foto'] = $fotoPaths;
        unset($validated['existing_fotos'], $validated['new_fotos']);

        $boardGame->update($validated);

        return redirect('/admin/games')
            ->with('success', 'Board game berhasil diperbarui.');
    }

    public function destroy(BoardGame $boardGame)
    {
        $boardGame->delete();

        return redirect('/admin/games')
            ->with('success', 'Board game berhasil dihapus.');
    }
}