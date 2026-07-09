<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermohonanRequest;
use App\Models\BoardGame;
use App\Models\Loan;
use App\Models\Permohonan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PermohonanController extends Controller
{
    public function create()
    {
        $boardgames = BoardGame::orderBy('nama')
            ->select(['board_games.id', 'board_games.nama', 'board_games.kode'])
            ->selectSub(function ($query) {
                $query->from('loans')
                    ->whereColumn('loans.boardgame_id', 'board_games.id')
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

    public function store(StorePermohonanRequest $request)
    {
        $permohonan = Permohonan::create([
            'nama' => $request->nama,
            'nim' => $request->nim,
            'boardgame_id' => $request->boardgame_id,
            'status' => 'menunggu',
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'jam_pinjam' => $request->jam_pinjam,
            'catatan' => $request->catatan,
        ]);

        return redirect()->route('peminjaman.konfirmasi', $permohonan);
    }

    public function konfirmasi(Permohonan $permohonan)
    {
        $permohonan->load('boardgame');

        return inertia('Peminjaman/Konfirmasi', [
            'permohonan' => $permohonan,
        ]);
    }

    public function permohonan()
    {
        $admin = Auth::guard('admin')->user();
        $isSuperAdmin = $admin->isSuperAdmin();

        $query = Permohonan::query();

        if (!$isSuperAdmin) {
            $query->whereHas('boardgame', fn ($q) => $q->where('lantai', $admin->lantai));
        }

        $menunggu = (clone $query)->where('status', 'menunggu')->count();
        $disetujui = (clone $query)->where('status', 'dipinjam')->count();
        $ditolak = (clone $query)->where('status', 'ditolak')->count();

        $permohonan = (clone $query)->with('boardgame')
            ->orderByRaw("CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END")
            ->latest('created_at')
            ->paginate(10);

        return inertia('Peminjaman/Permohonan', [
            'permohonan' => $permohonan,
            'total' => $menunggu + $disetujui + $ditolak,
            'total_menunggu' => $menunggu,
            'total_disetujui' => $disetujui,
            'total_ditolak' => $ditolak,
        ]);
    }

    public function setujui(Permohonan $permohonan)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin->isSuperAdmin() && $permohonan->boardgame->lantai != $admin->lantai) {
            abort(403, 'Anda tidak memiliki akses ke board game di lantai ini.');
        }

        $permohonan->update(['status' => 'dipinjam']);

        $borrowedAt = $permohonan->getRawOriginal('tanggal_pinjam') . ' ' . $permohonan->jam_pinjam;

        Loan::create([
            'boardgame_id' => $permohonan->boardgame_id,
            'borrower_name' => $permohonan->nama,
            'borrower_nim' => $permohonan->nim,
            'borrowed_at' => $borrowedAt,
            'status' => 'borrowed',
            'notes' => $permohonan->catatan,
        ]);

        $permohonan->boardgame->decrement('available_copies');

        // return redirect()->route('loans.index')->with('success', 'Permohonan disetujui.');
    }

    public function tolak(Permohonan $permohonan)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin->isSuperAdmin() && $permohonan->boardgame->lantai != $admin->lantai) {
            abort(403, 'Anda tidak memiliki akses ke board game di lantai ini.');
        }

        $permohonan->update(['status' => 'ditolak']);

        return back()->with('success', 'Permohonan ditolak.');
    }
}
