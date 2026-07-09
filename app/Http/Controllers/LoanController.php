<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use App\Models\Loan;
use App\Models\Permohonan;
use Illuminate\Support\Facades\Auth;

class LoanController extends Controller
{
    public function index()
    {
        $admin = Auth::guard('admin')->user();
        $isSuperAdmin = $admin->isSuperAdmin();

        $loans = Loan::with('game')
            ->where('status', 'borrowed')
            ->when(!$isSuperAdmin, fn ($q) => $q->whereHas('game', fn ($q2) => $q2->where('lantai', $admin->lantai)))
            ->orderBy('borrowed_at', 'desc')
            ->paginate(10);

        $totalQuery = Loan::where('status', 'borrowed');
        if (!$isSuperAdmin) {
            $totalQuery->whereHas('game', fn ($q) => $q->where('lantai', $admin->lantai));
        }

        return inertia('Loans/Index', [
            'loans' => $loans,
            'stats' => [
                'total' => $totalQuery->count(),
            ],
        ]);
    }

    public function show(Loan $loan)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin->isSuperAdmin() && $loan->game->lantai != $admin->lantai) {
            abort(403, 'Anda tidak memiliki akses ke board game di lantai ini.');
        }

        $loan->load('game');

        return inertia('Loans/Show', ['loan' => $loan]);
    }

    public function return(Loan $loan)
    {
        if ($loan->status === 'returned') {
            return back()->withErrors(['loan' => 'Already returned']);
        }

        $admin = Auth::guard('admin')->user();
        if (!$admin->isSuperAdmin() && $loan->game->lantai != $admin->lantai) {
            abort(403, 'Anda tidak memiliki akses ke board game di lantai ini.');
        }

        $loan->update([
            'returned_at' => now(),
            'status' => 'returned',
        ]);

        BoardGame::where('id', $loan->boardgame_id)->increment('available_copies');

        Permohonan::where('boardgame_id', $loan->boardgame_id)
            ->where('status', 'dipinjam')
            ->update(['status' => 'dikembalikan']);

        return to_route('loans.index');
    }
}
