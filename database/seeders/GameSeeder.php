<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $games = [
            ['name' => 'Catan', 'description' => 'Bangun peradaban di pulau Catan', 'total_copies' => 5, 'available_copies' => 3],
            ['name' => 'Codenames', 'description' => 'Permainan tebak kata tim', 'total_copies' => 4, 'available_copies' => 4],
            ['name' => 'Ticket to Ride', 'description' => 'Bangun jalur kereta api Eropa', 'total_copies' => 3, 'available_copies' => 1],
            ['name' => 'Monopoly', 'description' => 'Game properti klasik', 'total_copies' => 6, 'available_copies' => 2],
            ['name' => 'Scrabble', 'description' => 'Permainan menyusun kata', 'total_copies' => 3, 'available_copies' => 3],
            ['name' => 'Jenga', 'description' => 'Menara balok keseimbangan', 'total_copies' => 4, 'available_copies' => 2],
            ['name' => 'Uno', 'description' => 'Kartu keluarga klasik', 'total_copies' => 8, 'available_copies' => 5],
            ['name' => 'Dixit', 'description' => 'Permainan imajinasi dan asosiasi', 'total_copies' => 2, 'available_copies' => 0],
            ['name' => '7 Wonders', 'description' => 'Bangun keajaiban dunia', 'total_copies' => 3, 'available_copies' => 1],
            ['name' => 'Risk', 'description' => 'Game strategi global', 'total_copies' => 2, 'available_copies' => 2],
        ];

        foreach ($games as $game) {
            \App\Models\Game::create($game);
        }

        $this->command->info('10 board games seeded successfully.');
    }
}
