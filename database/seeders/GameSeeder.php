<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Game::truncate();

        $boardGames = DB::table('board_games')->get();

        foreach ($boardGames as $boardGame) {
            \App\Models\Game::create([
                'name' => $boardGame->nama,
                'description' => 'Publisher: ' . ($boardGame->penerbit ?: '-') . ' | Code: ' . $boardGame->kode . ' | Floor: ' . $boardGame->lantai,
                'komponen' => $boardGame->komponen,
                'total_copies' => $boardGame->jumlah,
                'available_copies' => $boardGame->jumlah,
            ]);
        }

        $this->command->info(count($boardGames) . ' board games seeded successfully from board_games table.');
    }
}
