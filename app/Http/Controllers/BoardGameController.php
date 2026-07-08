<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use Inertia\Inertia;

class BoardGameController extends Controller
{
    public function index()
    {
        $games = BoardGame::orderByRaw("status = 'dipinjam'") // tersedia duluan
            ->orderBy('nama')
            ->get([
                'id', 'kode', 'nama', 'penerbit', 'kategori',
                'jumlah_pemain', 'durasi', 'lantai', 'gambar', 'gambar_hover', 'status', 'populer'
            ]);
        return Inertia::render('Katalog', [
            'games' => $games,
        ]);
    }

    public function show(BoardGame $boardGame)
    {
        $gameSerupa = BoardGame::where('kategori', $boardGame->kategori)
            ->where('id', '!=', $boardGame->id)
            ->inRandomOrder()
            ->limit(8)
            ->get(['id', 'nama', 'kategori', 'gambar']);

        return Inertia::render('Detail', [
            'game' => $boardGame,
            'gameSerupa' => $gameSerupa,
        ]);
    }
}