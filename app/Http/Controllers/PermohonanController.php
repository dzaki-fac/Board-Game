<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermohonanRequest;
use App\Models\BoardGame;
use App\Models\Loan;
use App\Models\Permohonan;
use Illuminate\Support\Facades\DB;

class PermohonanController extends Controller
{
    public function create()
    {
        $boardgames = BoardGame::orderBy('nama')
            ->select(['board_games.id', 'board_games.nama', 'board_games.kode', 'board_games.total_copies'])
            ->selectSub(function ($query) {
                $query->from('permohonan')
                    ->whereColumn('permohonan.boardgame_id', 'board_games.id')
                    ->where('permohonan.status', Permohonan::STATUS_APPROVED)
                    ->select(DB::raw('COUNT(*)'));
            }, 'active_borrowings_count')
            ->get()
            ->map(function ($bg) {
                $availableCopies = max($bg->total_copies - (int) $bg->active_borrowings_count, 0);
                return [
                    'id' => $bg->id,
                    'nama' => $bg->nama,
                    'kode' => $bg->kode,
                    'total_copies' => $bg->total_copies,
                    'active_borrowings_count' => (int) $bg->active_borrowings_count,
                    'available_copies' => $availableCopies,
                    'is_available' => $availableCopies > 0,
                    'availability_label' => $availableCopies > 0 ? 'Tersedia' : 'Sedang dipinjam',
                ];
            });

        return inertia('Peminjaman/Form', [
            'boardgames' => $boardgames,
        ]);
    }

    public function store(StorePermohonanRequest $request)
    {
        Permohonan::create([
            'nama' => $request->nama,
            'nim' => $request->nim,
            'boardgame_id' => $request->boardgame_id,
            'status' => Permohonan::STATUS_PENDING,
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'jam_pinjam' => $request->jam_pinjam,
            'catatan' => $request->catatan,
        ]);

        return redirect()->route('admin.permohonan.index')->with('success', 'Permohonan peminjaman berhasil dikirim.');
    }

    public function permohonan()
    {
        $pending = Permohonan::where('status', Permohonan::STATUS_PENDING)->count();
        $approved = Permohonan::where('status', Permohonan::STATUS_APPROVED)->count();
        $rejected = Permohonan::where('status', Permohonan::STATUS_REJECTED)->count();

        return inertia('Peminjaman/Permohonan', [
            'permohonan' => Permohonan::with('boardgame')
                ->where('status', '!=', Permohonan::STATUS_RETURNED)
                ->latest('created_at')
                ->paginate(10),
            'total' => $pending + $approved + $rejected,
            'total_pending' => $pending,
            'total_approved' => $approved,
            'total_rejected' => $rejected,
        ]);
    }

    public function approve(Permohonan $permohonan)
    {
        return DB::transaction(function () use ($permohonan) {
            $boardGame = BoardGame::where('id', $permohonan->boardgame_id)
                ->lockForUpdate()
                ->firstOrFail();

            $activeBorrowings = Permohonan::where('boardgame_id', $permohonan->boardgame_id)
                ->where('status', Permohonan::STATUS_APPROVED)
                ->count();

            if ($activeBorrowings >= $boardGame->total_copies) {
                return back()->withErrors(['error' => 'Gagal menyetujui. Stok board game sudah tidak tersedia.']);
            }

            $permohonan->update(['status' => Permohonan::STATUS_APPROVED]);

            $borrowedAt = $permohonan->getRawOriginal('tanggal_pinjam') . ' ' . $permohonan->jam_pinjam;

            Loan::create([
                'boardgame_id' => $permohonan->boardgame_id,
                'borrower_name' => $permohonan->nama,
                'borrower_nim' => $permohonan->nim,
                'borrowed_at' => $borrowedAt,
                'status' => 'borrowed',
                'notes' => $permohonan->catatan,
            ]);

            $activeBorrowingsAfter = Permohonan::where('boardgame_id', $permohonan->boardgame_id)
                ->where('status', Permohonan::STATUS_APPROVED)
                ->count();

            if ($activeBorrowingsAfter >= $boardGame->total_copies) {
                Permohonan::where('boardgame_id', $permohonan->boardgame_id)
                    ->where('id', '!=', $permohonan->id)
                    ->where('status', Permohonan::STATUS_PENDING)
                    ->update(['status' => Permohonan::STATUS_REJECTED]);
            }

            return back()->with('success', 'Permohonan disetujui.');
        });
    }

    public function reject(Permohonan $permohonan)
    {
        $permohonan->update(['status' => Permohonan::STATUS_REJECTED]);

        return back()->with('success', 'Permohonan ditolak.');
    }
}
