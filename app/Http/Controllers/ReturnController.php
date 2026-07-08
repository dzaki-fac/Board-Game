<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
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
            'return_condition' => ['nullable', 'string', 'in:good,minor_damage,damaged,missing_parts'],
            'missing_components' => ['nullable', 'array'],
            'missing_components.*' => ['string'],
            'fine_amount' => ['nullable', 'numeric', 'min:0'],
            'return_notes' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:returned,not_returned,lost'],
        ]);

        if ($validated['status'] === 'returned' && empty($validated['return_condition'])) {
            return back()->withErrors(['return_condition' => 'Condition is required when status is Returned.'])->withInput();
        }

        if (in_array($validated['status'], ['not_returned', 'lost'])) {
            $validated['return_condition'] = null;
        }

        $loan = Loan::findOrFail($validated['loan_id']);

        $missingComponents = ! empty($validated['missing_components'])
            ? json_encode($validated['missing_components'], JSON_UNESCAPED_UNICODE)
            : null;

        $updateData = [
            'returned_at' => now(),
            'status' => $validated['status'],
            'return_condition' => $validated['return_condition'],
            'missing_components' => $missingComponents,
            'fine_amount' => $validated['fine_amount'],
            'notes' => $validated['return_notes'],
        ];

        $loan->update($updateData);

        if (in_array($validated['status'], ['returned', 'not_returned'])) {
            BoardGame::where('id', $loan->game_id)->increment('available_copies');
        }

        return to_route('loans.index');
    }
}
