<?php

namespace Database\Seeders;

use App\Models\BoardGame;
use App\Models\Permohonan;
use App\Models\User;
use Illuminate\Database\Seeder;

class PermohonanSeeder extends Seeder
{
    public function run(): void
    {
        $boardgameIds = BoardGame::pluck('id')->toArray();

        for ($i = 0; $i < 30; $i++) {
            $status = fake()->randomElement([
                Permohonan::STATUS_PENDING,
                Permohonan::STATUS_APPROVED,
                Permohonan::STATUS_RETURNED,
                Permohonan::STATUS_REJECTED,
            ]);

            Permohonan::create([
                'boardgame_id' => fake()->randomElement($boardgameIds),
                'nama' => fake()->name(),
                'nim' => fake()->numerify('24########'),
                'status' => fake()->randomElement([
                    Permohonan::STATUS_PENDING,
                    Permohonan::STATUS_APPROVED,
                    Permohonan::STATUS_REJECTED,
                ]),
                'tanggal_pinjam' => fake()->date(),
                'jam_pinjam' => fake()->time(),
                'tanggal_rencana_kembali' => fake()->date(),
                'jam_rencana_kembali' => fake()->time(),
                'jam_kembali' => fake()->optional()->time(),
                'catatan' => fake()->optional()->sentence(),
            ]);
        }
    }
}
