<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class LoanSeeder extends Seeder
{
    public function run(): void
    {
        Loan::truncate();
        Game::query()->update(['available_copies' => Game::raw('total_copies')]);

        $games = Game::all();
        $today = Carbon::parse('2026-07-07');

        $borrowedCount = 0;
        $returnedCount = 0;

        foreach ($games as $game) {
            $borrowedAt = $today->copy()->subDays(rand(1, 30));

            $isReturned = rand(1, 100) <= 60;
            $returnedAt = $isReturned
                ? $borrowedAt->copy()->addHours(rand(1, 3))
                : null;

            $conditions = ['good', 'minor_damage', 'damaged', 'missing_parts', 'lost'];

            Loan::create([
                'game_id' => $game->id,
                'borrower_name' => fake()->name(),
                'borrowed_at' => $borrowedAt,
                'returned_at' => $returnedAt,
                'status' => $isReturned ? (rand(1, 100) <= 80 ? 'returned' : 'not_returned') : 'borrowed',
                'notes' => rand(1, 10) <= 4 ? fake()->sentence() : null,
                'return_condition' => $isReturned ? fake()->randomElement($conditions) : null,
                'missing_components' => $isReturned && rand(1, 100) <= 20 ? fake()->sentence(3) : null,
                'fine_amount' => $isReturned && rand(1, 100) <= 25 ? fake()->randomFloat(2, 5000, 100000) : null,
            ]);

            if ($isReturned) {
                $returnedCount++;
            } else {
                $game->decrement('available_copies');
                $borrowedCount++;
            }
        }

        $this->command->info("{$games->count()} loans seeded ({$borrowedCount} borrowed, {$returnedCount} returned).");
    }
}
