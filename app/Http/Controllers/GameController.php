<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;

class GameController extends Controller
{
    public function index()
    {
        $games = BoardGame::orderBy('nama')->paginate(10);

        return inertia('Games/Index', [
            'games' => $games,
        ]);
    }
}
