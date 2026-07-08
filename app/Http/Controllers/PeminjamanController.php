<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePeminjamanRequest;
use App\Models\BoardGame;
use App\Models\Game;
use App\Models\Loan;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PeminjamanController extends Controller
{
    public function create()
    {
        return inertia('Peminjaman/Form', [
            'boardgames' => BoardGame::where('jumlah', '>', 0)
                ->orderBy('nama')
                ->get(['id', 'nama', 'kode', 'jumlah']),
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
        $peminjaman->update(['status' => 'dipinjam']);
        $peminjaman->boardgame()->decrement('jumlah');

        $borrowedAt = "{$peminjaman->tanggal_pinjam} {$peminjaman->jam_pinjam}";

        Loan::create([
            'game_id' => $peminjaman->boardgame_id,
            'borrower_name' => $peminjaman->nama,
            'borrower_nim' => $peminjaman->nim,
            'borrowed_at' => $borrowedAt,
            'status' => 'borrowed',
            'notes' => $peminjaman->catatan,
        ]);

        Game::where('id', $peminjaman->boardgame_id)->decrement('available_copies');

        return back()->with('success', 'Permohonan disetujui.');
    }

    public function tolak(Peminjaman $peminjaman)
    {
        $peminjaman->update(['status' => 'ditolak']);

        return back()->with('success', 'Permohonan ditolak.');
    }
}
