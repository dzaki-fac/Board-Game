<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use App\Models\Loan;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'board_game_id' => ['nullable', 'integer', 'exists:board_games,id'],
        ]);

        $search = $request->input('search');
        $statusFilter = $request->input('status');
        $period = $request->input('period', 'all');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $month = $request->input('month');
        $year = $request->input('year');
        $boardGameId = $request->input('board_game_id');

        $query = Loan::with('game')->where('status', '!=', 'borrowed');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('game', fn ($q) => $q->where('nama', 'like', "%{$search}%"))
                  ->orWhere('list_peminjam', 'like', "%{$search}%");
            });
        }

        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        if ($boardGameId) {
            $query->where('boardgame_id', $boardGameId);
        }

        match ($period) {
            'today' => $query->whereDate('borrowed_at', today()),
            'this_week' => $query->whereBetween('borrowed_at', [now()->startOfWeek(), now()->endOfWeek()]),
            'this_month' => $query->whereMonth('borrowed_at', (int) ($month ?: now()->month))
                                  ->whereYear('borrowed_at', (int) ($year ?: now()->year)),
            'this_year' => $query->whereYear('borrowed_at', (int) ($year ?: now()->year)),
            'custom' => $query->when($dateFrom, fn ($q) => $q->whereDate('borrowed_at', '>=', $dateFrom))
                              ->when($dateTo, fn ($q) => $q->whereDate('borrowed_at', '<=', $dateTo)),
            default => null,
        };

        $histories = $query->latest('returned_at')->paginate(10)->withQueryString();

        $statsQuery = (clone $query)->whereIn('status', ['returned', 'lost']);

        $boardGameOptions = BoardGame::select('id', 'nama')->orderBy('nama')->get()->map(fn ($bg) => [
            'id' => $bg->id,
            'name' => $bg->nama,
        ]);

        return inertia('History/Index', [
            'histories' => $histories,
            'filters' => [
                'search' => $search,
                'status' => $statusFilter,
                'period' => $period,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'month' => $month,
                'year' => $year,
                'board_game_id' => $boardGameId,
            ],
            'stats' => [
                'total' => (clone $statsQuery)->count(),
                'returned' => (clone $statsQuery)->where('status', 'returned')->count(),
                'lost' => (clone $statsQuery)->where('status', 'lost')->count(),
            ],
            'boardGameOptions' => $boardGameOptions,
        ]);
    }
}
