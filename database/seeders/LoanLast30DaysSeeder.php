<?php

namespace Database\Seeders;

use App\Models\BoardGame;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class LoanLast30DaysSeeder extends Seeder
{
    public function run(): void
    {
        $boardgameIds = BoardGame::pluck('id')->toArray();

        if (empty($boardgameIds)) {
            $this->command?->warn('Tidak ada board game. Jalankan BoardGameSeeder terlebih dahulu.');

            return;
        }

        $totalCreated = 0;

        for ($day = 29; $day >= 0; $day--) {
            $date = today()->subDays($day);

            $dailyLoans = fake()->numberBetween(1, 6);

            for ($i = 0; $i < $dailyLoans; $i++) {
                $borrowedAt = fake()->dateTimeBetween(
                    "{$date->toDateString()} {$this->randomWorkingHour()}",
                    "{$date->toDateString()} {$this->randomLateHour()}",
                );

                $statusRoll = fake()->randomFloat(2, 0, 1);

                $status = $statusRoll < 0.2 ? 'lost' : ($statusRoll < 0.55 ? 'borrowed' : 'returned');

                $returnedAt = null;
                if ($status === 'returned') {
                    $returnedAt = Carbon::instance($borrowedAt)->modify('+'.fake()->numberBetween(1, 3).' hours');
                    if ($returnedAt->gt($date->copy()->endOfDay())) {
                        $returnedAt = $date->copy()->endOfDay()->subHour();
                    }
                }

                $returnCondition = in_array($status, ['returned', 'lost'])
                    ? fake()->randomElement(['Baik', 'Rusak Ringan', 'Rusak Sedang'])
                    : null;

                $jenisJaminan = fake()->randomElement(['ktm', 'ktp']);

                Loan::create([
                    'boardgame_id' => fake()->randomElement($boardgameIds),
                    'list_peminjam' => [
                        [
                            'nama' => fake()->name(),
                            'jenis_jaminan' => $jenisJaminan,
                            'nomor_identitas' => $jenisJaminan === 'ktm'
                                ? fake()->numerify('24########')
                                : fake()->numerify('################'),
                        ],
                    ],
                    'borrowed_at' => $borrowedAt,
                    'returned_at' => $returnedAt,
                    'status' => $status,
                    'return_condition' => $returnCondition,
                    'missing_components' => $status === 'lost' ? fake()->words(3, true) : null,
                    'fine_amount' => $status === 'lost'
                        ? fake()->randomFloat(2, 25000, 150000)
                        : null,
                    'notes' => fake()->optional()->sentence(),
                ]);

                $totalCreated++;
            }
        }

        $this->command?->info("{$totalCreated} data pinjaman 30 hari terakhir berhasil dibuat.");
    }

    private function randomWorkingHour(): string
    {
        return fake()->dateTimeBetween('today 08:00:00', 'today 11:00:00')->format('H:i:s');
    }

    private function randomLateHour(): string
    {
        return fake()->dateTimeBetween('today 13:00:00', 'today 17:00:00')->format('H:i:s');
    }
}