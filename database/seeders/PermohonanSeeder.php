<?php

namespace Database\Seeders;

use App\Models\BoardGame;
use App\Models\Permohonan;
use App\Models\User;
use Illuminate\Database\Seeder;

class PermohonanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $boardgameIds = BoardGame::pluck('id')->toArray();

        for ($i = 0; $i < 30; $i++) {
            $tanggalPinjam = fake()->dateTimeBetween('-30 days', '+7 days');
            $status = fake()->randomElement([
                'menunggu',
                'dipinjam',
                'dikembalikan',
                'ditolak',
            ]);

            Permohonan::create([
                'boardgame_id' => fake()->randomElement($boardgameIds),
                'nama' => fake()->name(),
                'nim' => fake()->numerify('24########'),
                'status' => fake()->randomElement([
                    'menunggu',
                    'dipinjam',
                    'ditolak',
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