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
            'name' => 'Super Admin',
            'email' => 'superadmin@perpus.ac.id',
            'password' => Hash::make('superadmin123'),
            'role' => 'superadmin',
        ]);

        Admin::create([
            'name' => 'Siti Rahmawati',
            'email' => 'siti.rahmawati@perpus.ac.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        Admin::create([
            'name' => 'Bambang Suprapto',
            'email' => 'bambang.suprapto@perpus.ac.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        Admin::create([
            'name' => 'Dewi Sartika',
            'email' => 'dewi.sartika@perpus.ac.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);
    }
}
