<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('permohonan');

        Schema::create('permohonan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('boardgame_id')->constrained('board_games')->cascadeOnDelete();
            $table->enum('status', ['menunggu', 'dipinjam', 'dikembalikan', 'ditolak'])->default('menunggu');
            $table->date('tanggal_pinjam');
            $table->date('jam_pinjam');
            $table->date('jam_rencana_kembali')->nullable();
            $table->date('jam_kembali')->nullable();
            $table->text('catatan')->nullable();
            $table->string('nama')->nullable();
            $table->string('nim')->nullable();
            $table->date('tanggal_rencana_kembali')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('permohonan');

        Schema::create('permohonan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('boardgame_id')->constrained('board_games')->cascadeOnDelete();
            $table->enum('status', ['menunggu', 'dipinjam', 'dikembalikan', 'ditolak'])->default('menunggu');
            $table->date('tanggal_pinjam');
            $table->date('jam_pinjam');
            $table->date('jam_rencana_kembali')->nullable();
            $table->date('jam_kembali')->nullable();
            $table->text('catatan')->nullable();
            $table->string('nama')->nullable();
            $table->string('nim')->nullable();
            $table->date('tanggal_rencana_kembali')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }
};
