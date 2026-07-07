<?php

namespace App\Http\Controllers;

use App\Models\Loan;

class HistoryController extends Controller
{
    public function index()
    {
        $histories = Loan::with('game')
            ->where('status', '!=', 'borrowed')
            ->latest()
            ->paginate(10);

        return inertia('History/Index', [
            'histories' => $histories,
            'stats' => [
                'total' => Loan::where('status', '!=', 'borrowed')->count(),
                'returned' => Loan::whereIn('status', ['returned', 'not_returned'])->count(),
                'not_returned' => Loan::where('status', 'not_returned')->count(),
                'damaged_lost' => Loan::whereIn('status', ['damaged', 'lost'])->count(),
            ],
        ]);
    }
}
