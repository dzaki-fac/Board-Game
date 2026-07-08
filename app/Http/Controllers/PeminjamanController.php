<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePeminjamanRequest;
use App\Models\BoardGame;
use App\Models\Game;
use App\Models\Loan;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PeminjamanController extends Controller
{
    public function create()
    {
        $boardgames = BoardGame::orderBy('nama')
            ->select(['board_games.id', 'board_games.nama', 'board_games.kode'])
            ->selectSub(function ($query) {
                $query->from('loans')
                    ->whereColumn('loans.game_id', 'board_games.id')
                    ->whereNull('loans.returned_at')
                    ->where('loans.status', '!=', 'returned')
                    ->select(DB::raw('COUNT(*)'));
            }, 'active_loans_count')
            ->get()
            ->map(function ($bg) {
                $isBorrowed = $bg->active_loans_count > 0;
                return [
                    'id' => $bg->id,
                    'nama' => $bg->nama,
                    'kode' => $bg->kode,
                    'availability_status' => $isBorrowed ? 'borrowed' : 'available',
                    'availability_label' => $isBorrowed ? 'Sedang dipinjam' : 'Tersedia',
                ];
            });

        return inertia('Peminjaman/Form', [
            'boardgames' => $boardgames,
        ]);
    }

    public function store(StorePeminjamanRequest $request)
    {
        $user = Auth::user() ?? User::first() ?? User::factory()->create(['name' => $request->nama, 'email' => $request->nim . '@guest.com']);

        Peminjaman::create([
            'user_id' => $user->id,
            'nama' => $request->nama,
            'nim' => $request->nim,
            'boardgame_id' => $request->boardgame_id,
            'status' => 'menunggu',
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'jam_pinjam' => $request->jam_pinjam,
            'catatan' => $request->catatan,
        ]);

        return redirect()->route('admin.permohonan.index')->with('success', 'Permohonan peminjaman berhasil dikirim.');
    }

    public function permohonan()
    {
        $menunggu = Peminjaman::where('status', 'menunggu')->count();
        $disetujui = Peminjaman::where('status', 'dipinjam')->count();
        $ditolak = Peminjaman::where('status', 'ditolak')->count();

        return inertia('Peminjaman/Permohonan', [
            'permohonan' => Peminjaman::with(['user', 'boardgame'])
                ->orderByRaw("CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END")
                ->latest('created_at')
                ->paginate(10),
            'total' => $menunggu + $disetujui + $ditolak,
            'total_menunggu' => $menunggu,
            'total_disetujui' => $disetujui,
            'total_ditolak' => $ditolak,
        ]);
    }

    public function setujui(Peminjaman $peminjaman)
    {
        try {
            DB::transaction(function () use ($peminjaman) {
                $peminjaman = Peminjaman::lockForUpdate()->findOrFail($peminjaman->id);

                $boardGame = BoardGame::where('id', $peminjaman->boardgame_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $activeBorrowed = Loan::where('game_id', $boardGame->id)
                    ->whereNull('returned_at')
                    ->where('status', '!=', 'returned')
                    ->count();

                $availableCopies = $boardGame->jumlah - $activeBorrowed;

                if ($availableCopies <= 0) {
                    throw new \Exception('Tidak ada salinan tersedia untuk board game ini.');
                }

                $peminjaman->update(['status' => 'dipinjam']);

                $borrowedAt = $peminjaman->getRawOriginal('tanggal_pinjam') . ' ' . $peminjaman->jam_pinjam;

                Loan::create([
                    'game_id' => $peminjaman->boardgame_id,
                    'borrower_name' => $peminjaman->nama,
                    'borrower_nim' => $peminjaman->nim,
                    'borrowed_at' => $borrowedAt,
                    'status' => 'borrowed',
                    'notes' => $peminjaman->catatan,
                ]);

                $remainingCopies = $availableCopies - 1;

                if ($remainingCopies <= 0) {
                    Peminjaman::where('boardgame_id', $boardGame->id)
                        ->where('id', '!=', $peminjaman->id)
                        ->where('status', 'menunggu')
                        ->update(['status' => 'ditolak']);
                }
            });
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }

        return redirect()->route('loans.index')->with('success', 'Permohonan disetujui.');
    }

    public function tolak(Peminjaman $peminjaman)
    {
        $peminjaman->update(['status' => 'ditolak']);

        return back()->with('success', 'Permohonan ditolak.');
    }
}
