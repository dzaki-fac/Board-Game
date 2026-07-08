<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use Illuminate\Http\Request;

class BoardGameController extends Controller
{
    /**
     * Display a listing of the resource.
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

        return inertia('Boardgame/Games', [
            'boardgames' => $query->paginate(20)->withQueryString(),
            'query' => $request->only(['search', 'sortField', 'sortDir', 'filterLantai', 'filterBox']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(BoardGame $boardGame)
    {
        return inertia('Boardgame/Show', ['boardgame' => $boardGame]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Boardgame/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:255',
            'box' => 'required|integer',
            'nama' => 'required|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'jumlah' => 'required|integer',
            'satuan' => 'required|string|max:255',
            'link_foto' => 'nullable|array',
            'link_foto.*' => 'nullable|string|max:255',
            'komponen' => 'required|string',
            'barang_hilang' => 'nullable|array',
            'barang_hilang.*.jumlah' => 'nullable|integer|min:1',
            'barang_hilang.*.nama' => 'nullable|string|max:255',
            'lantai' => 'required|integer',
        ]);

        BoardGame::create($validated);

        return redirect('/admin/games')->with('success', 'Board game berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BoardGame $boardGame)
    {
        return inertia('Boardgame/Edit', ['boardgame' => $boardGame]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BoardGame $boardGame)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:255',
            'box' => 'required|integer',
            'nama' => 'required|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'jumlah' => 'required|integer',
            'satuan' => 'required|string|max:255',
            'link_foto' => 'nullable|array',
            'link_foto.*' => 'nullable|string|max:255',
            'komponen' => 'required|string',
            'barang_hilang' => 'nullable|array',
            'barang_hilang.*.jumlah' => 'nullable|integer|min:1',
            'barang_hilang.*.nama' => 'nullable|string|max:255',
            'lantai' => 'required|integer',
        ]);

        $boardGame->update($validated);

        return redirect('/admin/games')->with('success', 'Board game berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BoardGame $boardGame)
    {
        $boardGame->delete();

        return redirect('/admin/games')->with('success', 'Board game berhasil dihapus.');
    }
}
