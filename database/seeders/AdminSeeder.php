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
            'lantai' => '',
        ]);

        Admin::create([
            'name' => 'Admin 1',
            'email' => 'admin1@perpus.ac.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'lantai' => '1',
        ]);

        Admin::create([
            'name' => 'Admin 2',
            'email' => 'admin2@perpus.ac.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'lantai' => '2',
        ]);

        Admin::create([
            'name' => 'Admin 3',
            'email' => 'admin3@perpus.ac.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'lantai' => '3',
        ]);
    }
}
