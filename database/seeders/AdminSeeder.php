<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'name' => 'Suwondo, S.Hum., M.Kom.',
            'email' => 'suwondo@perpus.undip',
            'nip' => '197607182001121001',
            'password' => Hash::make('12345678s'),
            'role' => 'admin',
        ]);

        Admin::create([
            'name' => 'Linda Wahyuningsih, S.I.Kom., M.I.Kom.',
            'email' => 'linda@perpus.undip',
            'nip' => 'H.7.198408092021042001',
            'password' => Hash::make('12345678l'),
            'role' => 'admin',
        ]);
    }
}
