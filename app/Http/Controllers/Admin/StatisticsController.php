<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BoardGame;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $all = $this->baseQuery($request)
            ->orderByDesc('peminjaman')
            ->orderBy('nama')
            ->get(['id', 'nama']);

        $top = $all->sortByDesc('peminjaman')->first();

        $boardGames = $this->baseQuery($request)
            ->orderByDesc('peminjaman')
            ->orderBy('nama')
            ->paginate($this->perPage($request))
            ->withQueryString();

        return Inertia::render('Statistics/Index', [
            'boardGames' => $boardGames,
            'summary' => [
                'total_peminjaman' => $all->sum('peminjaman'),
                'total_game' => $all->count(),
                'terpopuler' => $top && $top->peminjaman > 0 ? $top->nama : null,
            ],
            'filters' => $this->filters($request),
            'period_label' => $this->periodLabel($request),
        ]);
    }

    public function export(Request $request)
    {
        $boardGames = $this->boardGames($request);
        $label = $this->periodLabel($request);

        return response()->streamDownload(function () use ($boardGames, $label) {
            $handle = fopen('php://output', 'w');

            $write = fn (array $fields) => fputcsv($handle, $fields, ',', '"', '\\');

            $write(['Laporan Statistik Peminjaman Board Game']);
            $write(['Periode: '.$label]);
            $write(['Diekspor: '.now()->format('d-m-Y H:i:s')]);
            $write([]);
            $write(['Nama Board Game', 'Lantai', 'Box', 'Jumlah Dipinjam']);

            foreach ($boardGames as $game) {
                $write([
                    $game->nama,
                    $game->lantai,
                    $game->box,
                    $game->peminjaman,
                ]);
            }

            $write([]);
            $write(['Total Peminjaman', $boardGames->sum('peminjaman')]);

            fclose($handle);
        }, 'statistik-peminjaman-'.now()->format('Y-m-d').'.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function baseQuery(Request $request): Builder
    {
        return BoardGame::query()
            ->when($request->input('search'), fn ($q, $search) => $q->where('nama', 'like', "%{$search}%"))
            ->withCount(['loans as peminjaman' => fn (Builder $q) => $this->applyPeriodFilter($q, $request)]);
    }

    private function boardGames(Request $request)
    {
        return $this->baseQuery($request)
            ->orderByDesc('peminjaman')
            ->orderBy('nama')
            ->get(['id', 'nama', 'lantai', 'box']);
    }

    private function perPage(Request $request): int
    {
        $value = $request->input('per_page', 10);

        if ($value === 'all') {
            return 100000;
        }

        return in_array((int) $value, [10, 20, 50, 100], true) ? (int) $value : 10;
    }

    private function applyPeriodFilter(Builder $query, Request $request): Builder
    {
        $period = $request->input('period', 'all');
        $month = $request->input('month');
        $year = $request->input('year');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        match ($period) {
            'today' => $query->whereDate('borrowed_at', today()),
            'this_week' => $query->whereBetween('borrowed_at', [now()->startOfWeek(), now()->endOfWeek()]),
            'this_month' => $query->whereMonth('borrowed_at', (int) ($month ?: now()->month))
                ->whereYear('borrowed_at', (int) ($year ?: now()->year)),
            'this_year' => $query->whereYear('borrowed_at', (int) ($year ?: now()->year)),
            'custom' => $query->when($dateFrom, fn ($q) => $q->whereDate('borrowed_at', '>=', $dateFrom))
                ->when($dateTo, fn ($q) => $q->whereDate('borrowed_at', '<=', $dateTo)),
            default => null,
        };

        return $query;
    }

    private function filters(Request $request): array
    {
        return [
            'search' => $request->input('search'),
            'period' => $request->input('period', 'all'),
            'month' => $request->input('month'),
            'year' => $request->input('year'),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
            'per_page' => $request->input('per_page', 10),
        ];
    }

    private function periodLabel(Request $request): string
    {
        $period = $request->input('period', 'all');
        $month = $request->input('month');
        $year = $request->input('year');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        return match ($period) {
            'today' => 'Hari Ini ('.today()->format('d-m-Y').')',
            'this_week' => 'Minggu Ini ('.now()->startOfWeek()->format('d-m-Y').' s.d. '.now()->endOfWeek()->format('d-m-Y').')',
            'this_month' => ($monthNames[(int) ($month ?: now()->month)] ?? now()->format('F')).' '.($year ?: now()->year),
            'this_year' => (string) ($year ?: now()->year),
            'custom' => ($dateFrom ?: '…').' s.d. '.($dateTo ?: '…'),
            default => 'Semua Waktu',
        };
    }
}
