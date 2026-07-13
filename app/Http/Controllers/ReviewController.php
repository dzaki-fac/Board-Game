<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use App\Models\BoardGameReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, BoardGame $boardGame)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        BoardGameReview::create([
            'boardgame_id' => $boardGame->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return redirect()->route('katalog.show', $boardGame)
            ->with('success', 'Review berhasil dikirim.');
    }
}
