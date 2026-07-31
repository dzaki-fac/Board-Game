<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Permohonan;
use Illuminate\Support\Facades\Auth;

class LoanController extends Controller
{
    public function index()
    {
        $loans = Loan::with('game')
            ->where('status', 'borrowed')
            ->orderBy('borrowed_at', 'desc')
            ->paginate(10);

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

    public function print(Loan $loan)
    {
        $loan->load('game');

        return inertia('Loans/Print', ['loan' => $loan]);
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

        Permohonan::where('boardgame_id', $loan->boardgame_id)
            ->where('status', 'approved')
            ->oldest()
            ->limit(1)
            ->update(['status' => 'returned']);

        return to_route('loans.index');
    }
}
