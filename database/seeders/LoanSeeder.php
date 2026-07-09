<?php

namespace Database\Seeders;

use App\Models\BoardGame;
use App\Models\Loan;
use Illuminate\Database\Seeder;

class LoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $boardgameIds = BoardGame::pluck('id')->toArray();

        for ($i = 0; $i < 10; $i++) {
            $borrowedAt = fake()->dateTimeBetween('-30 days', 'now');
            $returned = fake()->boolean(40);

            Loan::create([
                'boardgame_id' => fake()->randomElement($boardgameIds),
                'borrower_name' => fake()->name(),
                'borrower_nim' => fake()->numerify('24########'),
                'borrowed_at' => $borrowedAt,
                'returned_at' => $returned
                    ? fake()->dateTimeBetween($borrowedAt, 'now')
                    : null,
                'status' => $returned ? 'returned' : 'borrowed',
                'return_condition' => $returned
                    ? fake()->randomElement(['Baik', 'Rusak Ringan'])
                    : null,
                'missing_components' => $returned && fake()->boolean(20)
                    ? fake()->words(3, true)
                    : null,
                'fine_amount' => $returned && fake()->boolean(30)
                    ? fake()->randomFloat(2, 5000, 50000)
                    : null,
                'notes' => fake()->optional()->sentence(),
            ]);
        }
    }
}