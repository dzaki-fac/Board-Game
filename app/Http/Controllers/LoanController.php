<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use App\Models\Loan;
use App\Models\Permohonan;

class LoanController extends Controller
{
    public function index()
    {
        $loans = Loan::with('game')->where('status', 'borrowed')->orderBy('borrowed_at', 'desc')->paginate(10);

        return inertia('Loans/Index', [
            'loans' => $loans,
            'stats' => [
                'total' => Loan::where('status', 'borrowed')->count(),
            ],
        ]);
    }

    public function show(Loan $loan)
    {
        $loan->load('game');

        return inertia('Loans/Show', ['loan' => $loan]);
    }

    public function return(Loan $loan)
    {
        if ($loan->status === 'returned') {
            return back()->withErrors(['loan' => 'Already returned']);
        }

        $loan->update([
            'returned_at' => now(),
            'status' => 'returned',
        ]);

        BoardGame::where('id', $loan->game_id)->increment('available_copies');

        Permohonan::where('boardgame_id', $loan->game_id)
            ->where('status', 'dipinjam')
            ->update(['status' => 'dikembalikan']);

        return to_route('loans.index');
    }
}
