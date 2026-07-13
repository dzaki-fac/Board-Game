<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BoardGameReview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReviewController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:255',
            'rating' => 'nullable|integer|in:1,2,3,4,5',
            'date_filter' => 'nullable|string|in:today,7_days,30_days,custom',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'sort' => 'nullable|string|in:newest,oldest,highest_rating,lowest_rating,name_asc,name_desc',
        ]);

        $query = BoardGameReview::with(['boardGame:id,nama', 'loan:id,borrower_name,borrower_nim']);

        if ($search = $request->search) {
            $query->whereHas('boardGame', fn ($q) => $q->where('nama', 'like', "%{$search}%"));
        }

        if ($rating = $request->rating) {
            $query->where('rating', $rating);
        }

        match ($request->date_filter) {
            'today' => $query->whereDate('created_at', today()),
            '7_days' => $query->where('created_at', '>=', now()->subDays(7)),
            '30_days' => $query->where('created_at', '>=', now()->subDays(30)),
            'custom' => $query->when($request->date_from, fn ($q, $v) => $q->whereDate('created_at', '>=', $v))
                ->when($request->date_to, fn ($q, $v) => $q->whereDate('created_at', '<=', $v)),
            default => null,
        };

        match ($request->sort) {
            'oldest' => $query->oldest(),
            'highest_rating' => $query->orderByDesc('rating'),
            'lowest_rating' => $query->orderBy('rating'),
            'name_asc' => $query->select('board_game_reviews.*')->join('board_games', 'board_game_reviews.boardgame_id', '=', 'board_games.id')->orderBy('board_games.nama'),
            'name_desc' => $query->select('board_game_reviews.*')->join('board_games', 'board_game_reviews.boardgame_id', '=', 'board_games.id')->orderByDesc('board_games.nama'),
            default => $query->latest(),
        };

        $reviews = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Reviews', [
            'reviews' => $reviews,
            'filters' => array_merge([
                'search' => null,
                'rating' => null,
                'date_filter' => null,
                'date_from' => null,
                'date_to' => null,
                'sort' => null,
            ], $request->only(['search', 'rating', 'date_filter', 'date_from', 'date_to', 'sort'])),
        ]);
    }

    public function destroy(BoardGameReview $boardGameReview)
    {
        try {
            $boardGameReview->delete();

            return redirect()->back()->with('flash', 'Review deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete the review. Please try again.');
        }
    }
}
