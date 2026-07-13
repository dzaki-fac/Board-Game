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
            Permohonan::create([
                'boardgame_id' => fake()->randomElement($boardgameIds),
                'list_peminjam' => [
                    [
                        'nama' => fake()->name(),
                        'jenis_jaminan' => fake()->randomElement(['ktp', 'ktm']),
                        'nomor_identitas' => fake()->numerify('################'),
                    ],
                ],
                'status' => fake()->randomElement([
                    Permohonan::STATUS_PENDING,
                    // Permohonan::STATUS_APPROVED,
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
