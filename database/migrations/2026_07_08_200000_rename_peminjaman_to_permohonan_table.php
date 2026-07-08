<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('peminjaman', 'permohonan');
    }

    public function down(): void
    {
        Schema::rename('permohonan', 'peminjaman');
    }
};
