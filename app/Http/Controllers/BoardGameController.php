<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
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
    public function katalog()
    {
        $games = BoardGame::orderBy('available_copies', 'desc')
            ->orderBy('nama')
            ->get([
                'id',
                'kode',
                'nama',
                'penerbit',
                'kategori',
                'jumlah_pemain',
                'durasi',
                'lantai',
                'link_foto',
                'available_copies',
                'populer'
            ]);

        return Inertia::render('Katalog', [
            'games' => $games,
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

        return Inertia::render('Detail', [
            'game' => $boardGame,
            'gameSerupa' => $gameSerupa,
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
            'kode' => 'required|string|max:255',
            'box' => 'required|integer',
            'nama' => 'required|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'jumlah' => 'required|integer',
            'satuan' => 'required|string|max:255',
            'tingkat_kesulitan' => 'nullable|numeric|min:1|max:5',
            'usia_minimum' => 'nullable|string|max:255',
            'jumlah_pemain' => 'nullable|string|max:255',
            'durasi' => 'nullable|string|max:255',
            'link_foto' => 'nullable|array',
            'link_foto.*' => 'nullable|string|max:255',
            'komponen' => 'required|array',
            'komponen.*.jumlah' => 'nullable|integer|min:1',
            'komponen.*.nama' => 'nullable|string|max:255',
            'barang_hilang' => 'nullable|array',
            'barang_hilang.*.jumlah' => 'nullable|integer|min:1',
            'barang_hilang.*.nama' => 'nullable|string|max:255',
            'lantai' => 'required|integer',
            'populer' => 'boolean',
        ]);

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
            'kode' => 'required|string|max:255',
            'box' => 'required|integer',
            'nama' => 'required|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'jumlah' => 'required|integer',
            'satuan' => 'required|string|max:255',
            'tingkat_kesulitan' => 'nullable|numeric|min:1|max:5',
            'usia_minimum' => 'nullable|string|max:255',
            'jumlah_pemain' => 'nullable|string|max:255',
            'durasi' => 'nullable|string|max:255',
            'link_foto' => 'nullable|array',
            'link_foto.*' => 'nullable|string|max:255',
            'komponen' => 'required|array',
            'komponen.*.jumlah' => 'nullable|integer|min:1',
            'komponen.*.nama' => 'nullable|string|max:255',
            'barang_hilang' => 'nullable|array',
            'barang_hilang.*.jumlah' => 'nullable|integer|min:1',
            'barang_hilang.*.nama' => 'nullable|string|max:255',
            'lantai' => 'required|integer',
            'populer' => 'boolean',
            'available_copies' => 'required|integer',
        ]);

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