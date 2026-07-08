<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        Game::truncate();

        $filePath = __DIR__ . '/board_games_data.json';

        if (! file_exists($filePath)) {
            $this->command->error('board_games_data.json not found. Run "php artisan db:seed --class=BoardGameExportSeeder" first.');
            return;
        }

        $boardGames = json_decode(file_get_contents($filePath));

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
