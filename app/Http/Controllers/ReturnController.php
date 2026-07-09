<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReturnController extends Controller
{
    public function create()
    {
        $admin = Auth::guard('admin')->user();
        $isSuperAdmin = $admin->isSuperAdmin();

        $loans = Loan::with('game')
            ->where('status', 'borrowed')
            ->when(!$isSuperAdmin, fn ($q) => $q->whereHas('game', fn ($q2) => $q2->where('lantai', $admin->lantai)))
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
            'missing_components.*.nama' => ['required', 'string'],
            'missing_components.*.jumlah' => ['required', 'integer', 'min:1'],
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

        $admin = Auth::guard('admin')->user();
        if (!$admin->isSuperAdmin() && $loan->game->lantai != $admin->lantai) {
            abort(403, 'Anda tidak memiliki akses ke board game di lantai ini.');
        }

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
            BoardGame::where('id', $loan->boardgame_id)->increment('available_copies');
        }

        // Simpan ke barang_hilang boardgame
        if (! empty($validated['missing_components'])) {
            $boardgame = BoardGame::findOrFail($loan->boardgame_id);
            $existing = $boardgame->barang_hilang ?? [];

            foreach ($validated['missing_components'] as $mc) {
                $found = false;
                foreach ($existing as &$item) {
                    if ($item['nama'] === $mc['nama']) {
                        $item['jumlah'] += $mc['jumlah'];
                        $found = true;
                        break;
                    }
                }
                if (! $found) {
                    $existing[] = ['nama' => $mc['nama'], 'jumlah' => $mc['jumlah']];
                }
            }

            $boardgame->barang_hilang = $existing;
            $boardgame->save();
        }

        return to_route('loans.index');
    }
}
