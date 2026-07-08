<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Loan;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::orderBy('name')->paginate(20);

        return inertia('Games/Index', [
            'games' => $games,
        ]);
    }
}
