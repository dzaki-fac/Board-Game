<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use Inertia\Inertia;

class BoardGameController extends Controller
{
    public function index()
    {
        $games = BoardGame::orderBy('available_copies', 'desc')
            ->orderBy('nama')
            ->get([
                'id', 'kode', 'nama', 'penerbit', 'kategori',
                'jumlah_pemain', 'durasi', 'lantai', 'link_foto', 'available_copies', 'populer'
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
            ->get(['id', 'nama', 'kategori', 'link_foto']);

        return Inertia::render('Detail', [
            'game' => $boardGame,
            'gameSerupa' => $gameSerupa,
        ]);
    }
}