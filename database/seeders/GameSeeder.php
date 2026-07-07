<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        Game::truncate();

        $games = [
            [
                'name' => 'Blockness',
                'description' => 'A strategic board game about building and blocking.',
                'komponen' => '1 Board, 4 Player Pieces, 20 Blocking Cards, 50 Tokens, Instructions',
                'total_copies' => 1,
                'available_copies' => 1,
            ],
            [
                'name' => 'Catan',
                'description' => 'Trade, build, and settle on the island of Catan.',
                'komponen' => '1 Game Board, 6 Dice, 4 Settlements, 4 Cities, 15 Roads, Development Cards, Resource Cards',
                'total_copies' => 1,
                'available_copies' => 1,
            ],
            [
                'name' => 'Codenames',
                'description' => 'A word-based party game for spies.',
                'komponen' => '200 Word Cards, 40 Key Cards, 16 Agent Tokens, 1 Timer',
                'total_copies' => 1,
                'available_copies' => 1,
            ],
            [
                'name' => 'Monopoly',
                'description' => 'The classic property trading game.',
                'komponen' => '1 Board, 2 Dice, 8 Tokens, 32 Houses, 12 Hotels, 16 Chance Cards, 16 Community Chest Cards, Money',
                'total_copies' => 1,
                'available_copies' => 1,
            ],
            [
                'name' => 'Uno',
                'description' => 'The classic card matching game.',
                'komponen' => '108 Cards, Instructions',
                'total_copies' => 1,
                'available_copies' => 1,
            ],
        ];

        foreach ($games as $game) {
            Game::create($game);
        }

        $this->command->info(count($games) . ' board games seeded successfully.');
    }
}
