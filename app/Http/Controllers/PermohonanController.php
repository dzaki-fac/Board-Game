<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermohonanRequest;
use App\Models\BoardGame;
use App\Models\Loan;
use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PermohonanController extends Controller
{
    public function create()
    {
        $boardgames = BoardGame::orderBy('nama')
            ->get()
            ->map(function ($bg) {
                return [
                    'id' => $bg->id,
                    'nama' => $bg->nama,
                    'kode' => $bg->kode,
                    'available_copies' => $bg->available_copies,
                    'is_available' => $bg->available_copies > 0,
                    'availability_label' => $bg->available_copies > 0 ? 'Tersedia' : 'Sedang dipinjam',
                ];
            });

        return inertia('Peminjaman/Form', [
            'boardgames' => $boardgames,
        ]);
    }

    public function store(StorePermohonanRequest $request)
    {
        $peminjams = $request->peminjams;
        $nomorIdentitas = collect($peminjams)->pluck('nomor_identitas')->filter()->values()->toArray();

        if (!empty($nomorIdentitas)) {
            $existing = Loan::where('status', 'borrowed')->get()->first(function ($loan) use ($nomorIdentitas) {
                $loanPeminjams = $loan->list_peminjam ?? [];
                $loanIds = collect($loanPeminjams)->pluck('nomor_identitas')->filter()->values()->toArray();
                return !empty(array_intersect($loanIds, $nomorIdentitas));
            });

            if ($existing) {
                $loanPeminjams = $existing->list_peminjam ?? [];
                $loanIds = collect($loanPeminjams)->pluck('nomor_identitas')->filter()->values()->toArray();
                $common = array_intersect($loanIds, $nomorIdentitas);
                $boardgame = \App\Models\BoardGame::find($request->boardgame_id);

                return redirect()->route('peminjaman.gagal')->with([
                    'error' => 'Peminjam dengan nomor identitas ' . implode(', ', $common) . ' masih memiliki pinjaman aktif yang belum dikembalikan.',
                    'peminjams' => $peminjams,
                    'boardgame_nama' => $boardgame?->nama,
                ]);
            }
        }

        $permohonan = Permohonan::create([
            'list_peminjam' => $peminjams,
            'boardgame_id' => $request->boardgame_id,
            'status' => Permohonan::STATUS_PENDING,
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

    public function konfirmasiGagal()
    {
        return inertia('Peminjaman/Konfirmasi', [
            'gagal' => true,
            'error' => session('error'),
            'peminjams' => session('peminjams'),
            'boardgame_nama' => session('boardgame_nama'),
        ]);
    }

    public function permohonan(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $lantai = $request->input('lantai');

        $base = Permohonan::with('boardgame')
            ->where('status', '!=', Permohonan::STATUS_RETURNED);

        $pending = (clone $base)->where('status', Permohonan::STATUS_PENDING)->count();
        $approved = (clone $base)->where('status', Permohonan::STATUS_APPROVED)->count();
        $rejected = (clone $base)->where('status', Permohonan::STATUS_REJECTED)->count();

        $query = clone $base;
        $query->when($status, fn ($q) => $q->where('status', $status))
            ->when($search, fn ($q) => $q->where(function ($q2) use ($search) {
                $q2->where('list_peminjam', 'like', "%{$search}%")
                    ->orWhereHas('boardgame', fn ($q3) => $q3->where('nama', 'like', "%{$search}%"));
            }))
            ->when($lantai, fn ($q) => $q->whereHas('boardgame', fn ($q3) => $q3->where('lantai', $lantai)));

        return inertia('Peminjaman/Permohonan', [
            'permohonan' => $query->orderByRaw("CASE WHEN status = 'menunggu' THEN 0 ELSE 1 END")->latest('created_at')->paginate(10)->withQueryString(),
            'total' => $pending + $approved + $rejected,
            'total_pending' => $pending,
            'total_approved' => $approved,
            'total_rejected' => $rejected,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'lantai' => $lantai,
            ],
        ]);
    }

    public function approve(Permohonan $permohonan)
    {
        $admin = Auth::guard('admin')->user();

        return DB::transaction(function () use ($permohonan, $admin) {
            $boardGame = BoardGame::where('id', $permohonan->boardgame_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($boardGame->available_copies <= 0) {
                return back()->withErrors(['error' => 'Gagal menyetujui. Stok board game sudah tidak tersedia.']);
            }

            $list_peminjam = $permohonan->list_peminjam ?? [];
            $nomorIdentitas = collect($list_peminjam)->pluck('nomor_identitas')->filter()->values()->toArray();

            if (!empty($nomorIdentitas)) {
                $existing = Loan::where('status', 'borrowed')
                    ->where('id', '!=', $permohonan->id)
                    ->get()
                    ->filter(function ($loan) use ($nomorIdentitas) {
                        $loanPeminjams = $loan->list_peminjam ?? [];
                        $loanIds = collect($loanPeminjams)->pluck('nomor_identitas')->filter()->values()->toArray();
                        return !empty(array_intersect($loanIds, $nomorIdentitas));
                    })
                    ->first();

                if ($existing) {
                    $loanPeminjams = $existing->list_peminjam ?? [];
                    $loanIds = collect($loanPeminjams)->pluck('nomor_identitas')->filter()->values()->toArray();
                    $common = array_intersect($loanIds, $nomorIdentitas);
                    $namaTersangkut = collect($loanPeminjams)->pluck('nama')->implode(', ');
                    return back()->withErrors([
                        'error' => 'Gagal menyetujui. Peminjam dengan nomor identitas ' . implode(', ', $common) . ' masih memiliki pinjaman aktif yang belum dikembalikan.',
                    ]);
                }
            }

            $permohonan->update(['status' => Permohonan::STATUS_APPROVED]);

            $boardGame->decrement('available_copies');

            $borrowedAt = $permohonan->getRawOriginal('tanggal_pinjam') . ' ' . $permohonan->jam_pinjam;

            Loan::create([
                'boardgame_id' => $permohonan->boardgame_id,
                'list_peminjam' => $list_peminjam,
                'borrowed_at' => $borrowedAt,
                'status' => 'borrowed',
                'notes' => $permohonan->catatan,
                'approved_by' => $admin->name,
            ]);

            if ($boardGame->fresh()->available_copies <= 0) {
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
        $admin = Auth::guard('admin')->user();
        if (!$admin->isSuperAdmin() && $permohonan->boardgame->lantai != $admin->lantai) {
            abort(403, 'Anda tidak memiliki akses ke board game di lantai ini.');
        }

        $permohonan->update(['status' => Permohonan::STATUS_REJECTED]);

        return back()->with('success', 'Permohonan ditolak.');
    }
}
