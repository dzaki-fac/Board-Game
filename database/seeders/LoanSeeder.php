<?php

namespace Database\Seeders;

use App\Models\BoardGame;
use App\Models\Loan;
use Illuminate\Database\Seeder;

class LoanSeeder extends Seeder
{
    public function run(): void
    {
        $boardgameIds = BoardGame::pluck('id')->toArray();

        for ($i = 0; $i < 10; $i++) {
            $borrowedAt = fake()->dateTimeBetween('-30 days', 'now');
            $returned = fake()->boolean(40);

            $isMahasiswa = fake()->boolean();

            Loan::create([
                'boardgame_id' => fake()->randomElement($boardgameIds),
                'borrower_name' => [fake()->name()],
                'borrowed_at' => $borrowedAt,
                'returned_at' => $returned
                    ? fake()->dateTimeBetween($borrowedAt, 'now')
                    : null,
                'status' => $returned ? 'returned' : 'borrowed',
                'jenis_jaminan' => fake()->randomElement(['ktm', 'ktp', 'kartu_anggota']),
                'nomor_identitas' => [$isMahasiswa ? fake()->numerify('24########') : fake()->numerify('################')],
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
