<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\BoardGame;
use App\Models\Loan;
use App\Models\Post;
use Database\Seeders\BoardGameSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        Admin::truncate();
        $this->call([
            AdminSeeder::class,
        ]);

        // Post::factory(30)->create();

        BoardGame::truncate();
        $this->call(BoardGameSeeder::class);

        Loan::truncate();

        $this->call([
            GameSeeder::class,
            LoanSeeder::class,
        ]);
    }
}
