<?php

namespace Database\Seeders;

use App\Models\BoardGame;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BoardGameSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $games = [];

        foreach ($games as $game) {
            BoardGame::create($game);
        }
    }
}
