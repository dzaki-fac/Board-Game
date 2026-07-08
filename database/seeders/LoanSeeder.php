<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LoanSeeder extends Seeder
{
    public function run(): void
    {
        $games = Game::all();

        if ($games->isEmpty()) {
            $this->command->warn('No games found. Skipping LoanSeeder.');
            return;
        }

        $today = Carbon::parse('2026-07-07');
        $borrowerNames = [
            'Ahmad Fauzi', 'Budi Santoso', 'Citra Dewi', 'Dian Permata', 'Eko Prasetyo',
            'Fitri Handayani', 'Gilang Ramadhan', 'Hana Safitri', 'Indra Wijaya', 'Joko Susilo',
            'Kartika Sari', 'Lukman Hakim', 'Mega Putri', 'Nugroho Adi', 'Olivia Tan',
            'Putra Nugraha', 'Rina Marlina', 'Sigit Purnomo', 'Tari Utami', 'Umar Said',
        ];

        $shuffled = $games->shuffle();
        $totalGames = $shuffled->count();

        $borrowedCount = 15;
        $historyCount = $totalGames - $borrowedCount;

        $historyStatuses = collect();
        for ($i = 0; $i < $historyCount; $i++) {
            if ($i < $historyCount - 6) {
                $historyStatuses->push('returned');
            } elseif ($i < $historyCount - 2) {
                $historyStatuses->push('not_returned');
            } else {
                $historyStatuses->push('lost');
            }
        }
        $historyStatuses = $historyStatuses->shuffle();

        $conditions = ['good', 'minor_damage', 'damaged', 'missing_parts'];
        $borrowedGameIds = [];

        foreach ($shuffled as $i => $game) {
            $isBorrowed = $i < $borrowedCount;
            $status = $isBorrowed ? 'borrowed' : $historyStatuses->pop();

            $borrowerName = $borrowerNames[array_rand($borrowerNames)];
            $borrowedAt = $today->copy()->subDays(rand(1, 30))->setTime(rand(8, 16), rand(0, 59), rand(0, 59));

            $loanData = [
                'game_id' => $game->id,
                'borrower_name' => $borrowerName,
                'borrowed_at' => $borrowedAt,
                'returned_at' => null,
                'status' => $status,
                'notes' => null,
                'return_condition' => null,
                'missing_components' => null,
                'fine_amount' => null,
            ];

            if (!$isBorrowed) {
                $maxReturn = $borrowedAt->copy()->addHours(3);
                $cap = $borrowedAt->copy()->setTime(20, 0, 0);
                if ($maxReturn->gt($cap)) $maxReturn = $cap;
                $returnedAt = fake()->dateTimeBetween($borrowedAt->toDateTimeString(), $maxReturn->toDateTimeString());

                $loanData['returned_at'] = Carbon::instance($returnedAt);
                if ($status === 'returned') {
                    $loanData['return_condition'] = fake()->randomElement($conditions);
                }
                $loanData['missing_components'] = fake()->boolean(20) ? 'some components missing' : null;
                $loanData['fine_amount'] = fake()->boolean(25) ? fake()->randomFloat(2, 5000, 100000) : null;
                $loanData['notes'] = fake()->boolean(40) ? fake()->sentence() : null;
            }

            Loan::create($loanData);

            if ($isBorrowed) {
                $game->decrement('available_copies');
                $borrowedGameIds[] = $game->id;
            }
        }

        $this->command->info("61 loan records seeded — {$borrowedCount} borrowed, {$historyCount} history.");
    }
}
