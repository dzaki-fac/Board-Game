<?php

namespace App\Http\Controllers;

use App\Models\BoardGame;
use App\Models\BoardGameReview;
use App\Models\Loan;
use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'period' => ['nullable', 'in:all,today,7_days,30_days'],
            'range' => ['nullable', 'in:year,6m,3m,month,week'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        $range = $request->input('range', 'year');
        $period = $request->input('period', 'all');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $dateFrom = match ($period) {
            'today' => today()->toDateString(),
            '7_days' => today()->subDays(6)->toDateString(),
            '30_days' => today()->subDays(29)->toDateString(),
            default => $dateFrom,
        };
        $dateTo = in_array($period, ['today', '7_days', '30_days']) ? today()->toDateString() : $dateTo;

        $statsQuery = fn () => Loan::query()
            ->when($dateFrom, fn ($q) => $q->whereDate('borrowed_at', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('borrowed_at', '<=', $dateTo));

        return inertia('Statistics/Index', [
            'filters' => [
                'period' => $period,
                'range' => $range,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'summary' => [
                'total_games' => BoardGame::count(),
                'available_copies' => (int) BoardGame::sum('available_copies'),
                'total_loans' => $statsQuery()->count(),
                'active' => $statsQuery()->where('status', 'borrowed')->count(),
                'returned' => $statsQuery()->where('status', 'returned')->count(),
                'lost' => $statsQuery()->where('status', 'lost')->count(),
                'total_fine' => (float) $statsQuery()->where('status', 'lost')->sum('fine_amount'),
                'total_reviews' => BoardGameReview::count(),
                'pending_requests' => Permohonan::where('status', '!=', Permohonan::STATUS_RETURNED)
                    ->where('status', Permohonan::STATUS_PENDING)
                    ->count(),
            ],
            'topGames' => $this->topGames($dateFrom, $dateTo),
            'trend' => $this->trend($range, $dateFrom, $dateTo),
            'statusDistribution' => $this->statusDistribution($dateFrom, $dateTo),
        ]);
    }

    private function topGames(?string $dateFrom, ?string $dateTo, int $limit = 8): array
    {
        return BoardGame::select('id', 'nama', 'kode', 'kategori')
            ->withCount(['loans as total' => fn ($q) => $q->where('status', '!=', 'pending')
                ->when($dateFrom, fn ($sub) => $sub->whereDate('borrowed_at', '>=', $dateFrom))
                ->when($dateTo, fn ($sub) => $sub->whereDate('borrowed_at', '<=', $dateTo))])
            ->orderByDesc('total')
            ->get()
            ->filter(fn (BoardGame $game) => $game->total > 0)
            ->map(fn (BoardGame $game) => [
                'id' => $game->id,
                'nama' => $game->nama,
                'kode' => $game->kode,
                'total' => $game->total,
            ])
            ->take($limit)
            ->values()
            ->toArray();
    }

    private function trend(string $range, ?string $dateFrom, ?string $dateTo): array
    {
        $driver = DB::connection()->getDriverName();
        $monthExpr = $driver === 'mysql' ? 'DATE_FORMAT(borrowed_at, "%Y-%m")' : "strftime('%Y-%m', borrowed_at)";
        $dayExpr = $driver === 'mysql' ? 'DATE_FORMAT(borrowed_at, "%Y-%m-%d")' : "strftime('%Y-%m-%d', borrowed_at)";

        $daily = in_array($range, ['month', 'week']);
        $expr = $daily ? $dayExpr : $monthExpr;

        if ($daily) {
            $days = $range === 'week' ? 7 : 30;
            $since = now()->subDays($days - 1)->startOfDay();

            $rows = Loan::selectRaw("{$expr} as bucket")
                ->selectRaw('COUNT(*) as total')
                ->where('borrowed_at', '>=', $since)
                ->when($dateFrom, fn ($q) => $q->whereDate('borrowed_at', '>=', $dateFrom))
                ->when($dateTo, fn ($q) => $q->whereDate('borrowed_at', '<=', $dateTo))
                ->groupBy('bucket')
                ->pluck('total', 'bucket');

            return collect(range($days - 1, 0))->map(function ($i) use ($rows) {
                $date = now()->subDays($i);
                $key = $date->format('Y-m-d');

                return [
                    'key' => $key,
                    'label' => $date->translatedFormat('d M'),
                    'total' => (int) ($rows[$key] ?? 0),
                ];
            })->values()->toArray();
        }

        $months = match ($range) {
            '6m' => 6,
            '3m' => 3,
            default => 12,
        };
        $since = now()->subMonths($months - 1)->startOfMonth();

        $rows = Loan::selectRaw("{$monthExpr} as bucket")
            ->selectRaw('COUNT(*) as total')
            ->where('borrowed_at', '>=', $since)
            ->when($dateFrom, fn ($q) => $q->whereDate('borrowed_at', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('borrowed_at', '<=', $dateTo))
            ->groupBy('bucket')
            ->pluck('total', 'bucket');

        return collect(range($months - 1, 0))->map(function ($i) use ($rows) {
            $date = now()->subMonths($i);
            $key = $date->format('Y-m');

            return [
                'key' => $key,
                'label' => $date->translatedFormat('M Y'),
                'total' => (int) ($rows[$key] ?? 0),
            ];
        })->values()->toArray();
    }

    private function statusDistribution(?string $dateFrom, ?string $dateTo): array
    {
        $rows = Loan::select('status', DB::raw('COUNT(*) as total'))
            ->whereIn('status', ['borrowed', 'returned', 'lost'])
            ->when($dateFrom, fn ($q) => $q->whereDate('borrowed_at', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('borrowed_at', '<=', $dateTo))
            ->groupBy('status')
            ->pluck('total', 'status');

        $labels = [
            'borrowed' => ['name' => 'Dipinjam', 'color' => '#0E4A73'],
            'returned' => ['name' => 'Dikembalikan', 'color' => '#10B981'],
            'lost' => ['name' => 'Hilang', 'color' => '#EF4444'],
        ];

        return collect($labels)->map(function ($meta, $key) use ($rows) {
            return [
                'name' => $meta['name'],
                'value' => (int) ($rows[$key] ?? 0),
                'color' => $meta['color'],
            ];
        })->values()->toArray();
    }
}