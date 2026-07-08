<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('boardgame_id')->constrained('board_games')->cascadeOnDelete();
            $table->enum('status', ['menunggu', 'dipinjam', 'dikembalikan', 'ditolak'])->default('menunggu');
            $table->date('tanggal_pinjam');
            $table->date('jam_pinjam');
            $table->date('jam_rencana_kembali');
            $table->date('jam_kembali')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjaman');
    }
};
