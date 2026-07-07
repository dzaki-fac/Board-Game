<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        Game::truncate();

        $boardGames = DB::table('board_games')->orderBy('id')->get();

        foreach ($boardGames as $boardGame) {
            Game::create([
                'name' => $boardGame->nama,
                'description' => 'Publisher: ' . ($boardGame->penerbit ?: '-') . ' | Code: ' . $boardGame->kode . ' | Floor: ' . $boardGame->lantai,
                'komponen' => $boardGame->komponen,
                'total_copies' => $boardGame->jumlah,
                'available_copies' => $boardGame->jumlah,
            ]);
        }

        $this->command->info(count($boardGames) . ' board games seeded successfully.');
    }
}
