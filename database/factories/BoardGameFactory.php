<?php

namespace Database\Factories;

use App\Models\BoardGame;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BoardGame>
 */
class BoardGameFactory extends Factory
{
    protected $model = BoardGame::class;

    public function definition(): array
    {
        $penerbit = fake()->randomElement([
            'PLAN 8 GAMES', 'KOSMOS', 'BLUE ORANGE GAMES', 'AMIGO/SWAN',
            'Z-MAN GAMES', 'ASMODEE', 'LOOK OUT GAMES', 'REPOS PRODUCTION',
            'CATAN STUDIO', 'SPACE COWBOYS', 'GOLIATS GAMES', 'ZYGOMATIC',
            'MIXLORE', 'INDIE BOARD & GAMES', 'UNSTABLE GAMES', 'BRG/LBI',
        ]);

        $games = [
            'Catan', 'Carcassonne', 'Pandemic', 'Ticket to Ride', 'Azul',
            'Splendor', 'Wingspan', 'Terraforming Mars', '7 Wonders',
            'Dominion', 'Everdell', 'Root', 'Dune: Imperium', 'Brass',
            'Gloomhaven', 'Scythe', 'Terra Mystica', 'Agricola', 'Puerto Rico',
        ];

        return [
            'kode' => fake()->unique()->bothify('##/???/PK/#'),
            'box' => fake()->numberBetween(1, 7),
            'nama' => fake()->randomElement($games),
            'penerbit' => $penerbit,
            'jumlah' => 1,
            'total_copies' => 1,
            'satuan' => 'set',
            'link_foto' => null,
            'komponen' => fake()->sentence(20),
            'lantai' => fake()->numberBetween(1, 3),
        ];
    }
}
