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
        // Admin::truncate();
        $this->call([
            AdminSeeder::class,

            BoardGameSeeder::class,
            // LoanSeeder::class,
            PermohonanSeeder::class,
            RuleSeeder::class,
            CarouselSlideSeeder::class,
        ]);

        // Loan::truncate();
        // $this->call(LoanSeeder::class);

    }
}