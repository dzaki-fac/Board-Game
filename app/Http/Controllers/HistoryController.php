<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $statusFilter = $request->input('status');

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

        $histories = $query->latest('returned_at')->paginate(10)->withQueryString();

        return inertia('History/Index', [
            'histories' => $histories,
            'filters' => [
                'search' => $search,
                'status' => $statusFilter,
            ],
            'stats' => [
                'total' => Loan::whereIn('status', ['returned', 'lost'])->count(),
                'returned' => Loan::where('status', 'returned')->count(),
                'lost' => Loan::where('status', 'lost')->count(),
            ],
        ]);
    }
}
