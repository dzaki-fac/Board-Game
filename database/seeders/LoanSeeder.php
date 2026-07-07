<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Loan;
use Database\Factories\LoanFactory;
use Illuminate\Database\Seeder;

class LoanSeeder extends Seeder
{
    public function run(): void
    {
        LoanFactory::resetCopyCounts();

        Loan::factory(50)->create();

        $borrowedCounts = Loan::where('status', 'borrowed')
            ->selectRaw('game_id, COUNT(*) as count')
            ->groupBy('game_id')
            ->pluck('count', 'game_id');

        foreach ($borrowedCounts as $gameId => $count) {
            Game::where('id', $gameId)->decrement('available_copies', $count);
        }

        $this->command->info('50 dummy loan records seeded successfully.');
    }
}
