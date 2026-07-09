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
        Schema::create('permohonan', function (Blueprint $table) {
            $table->id();

            $table->foreignId('boardgame_id')
                ->constrained('board_games')
                ->cascadeOnDelete();

            $table->string('nama');
            $table->string('nim');

            $table->string('status', 20)
                ->default('pending');

            $table->date('tanggal_pinjam');
            $table->time('jam_pinjam');

            $table->date('tanggal_rencana_kembali')->nullable();
            $table->time('jam_rencana_kembali')->nullable();

            $table->time('jam_kembali')->nullable();

            $table->text('catatan')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permohonan');
    }
};