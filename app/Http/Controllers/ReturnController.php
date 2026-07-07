<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;

class ReturnController extends Controller
{
    public function create()
    {
        $loans = Loan::with('game')
            ->where('status', 'borrowed')
            ->latest()
            ->get();

        return inertia('Returns/Create', [
            'loans' => $loans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'loan_id' => ['required', 'exists:loans,id'],
            'returned_at' => ['required', 'date'],
            'return_condition' => ['required', 'string', 'in:good,minor_damage,damaged,missing_parts,lost'],
            'missing_components' => ['nullable', 'string'],
            'fine_amount' => ['nullable', 'numeric', 'min:0'],
            'return_notes' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:returned,not_returned,damaged,lost'],
        ]);

        $loan = Loan::findOrFail($validated['loan_id']);

        $updateData = [
            'returned_at' => $validated['returned_at'],
            'status' => $validated['status'],
            'return_condition' => $validated['return_condition'],
            'missing_components' => $validated['missing_components'],
            'fine_amount' => $validated['fine_amount'],
            'notes' => $validated['return_notes'],
        ];

        $loan->update($updateData);

        if (in_array($validated['status'], ['returned', 'not_returned'])) {
            $loan->game->increment('available_copies');
        }

        return to_route('loans.index');
    }
}
