<?php

namespace App\Http\Controllers;

use App\Models\Loan;

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

    public function return(Loan $loan)
    {
        if ($loan->status === 'returned') {
            return back()->withErrors(['loan' => 'Already returned']);
        }

        $loan->update([
            'returned_at' => now(),
            'status' => 'returned',
        ]);

        $loan->game->increment('available_copies');

        return to_route('loans.index');
    }
}
