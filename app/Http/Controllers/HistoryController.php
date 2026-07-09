<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        $isSuperAdmin = $admin->isSuperAdmin();

        $search = $request->input('search');
        $statusFilter = $request->input('status');

        $query = Loan::with('game')->where('status', '!=', 'borrowed');

        if (!$isSuperAdmin) {
            $query->whereHas('game', fn ($q) => $q->where('lantai', $admin->lantai));
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('game', fn ($q) => $q->where('nama', 'like', "%{$search}%"))
                  ->orWhere('borrower_name', 'like', "%{$search}%");
            });
        }

        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        $histories = $query->latest('returned_at')->paginate(10)->withQueryString();

        $statsQuery = Loan::whereIn('status', ['returned', 'not_returned', 'lost']);
        if (!$isSuperAdmin) {
            $statsQuery->whereHas('game', fn ($q) => $q->where('lantai', $admin->lantai));
        }

        return inertia('History/Index', [
            'histories' => $histories,
            'filters' => [
                'search' => $search,
                'status' => $statusFilter,
            ],
            'stats' => [
                'total' => (clone $statsQuery)->count(),
                'returned' => (clone $statsQuery)->where('status', 'returned')->count(),
                'not_returned' => (clone $statsQuery)->where('status', 'not_returned')->count(),
                'lost' => (clone $statsQuery)->where('status', 'lost')->count(),
            ],
        ]);
    }
}
