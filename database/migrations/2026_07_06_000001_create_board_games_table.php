<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('board_games', function (Blueprint $table) {
            $table->id();

            $table->string('kode')->unique();
            $table->string('box');
            $table->unsignedTinyInteger('lantai');

            $table->string('nama');
            $table->string('penerbit')->nullable();

            $table->unsignedInteger('jumlah')->default(1);
            $table->string('satuan')->default('set');

            $table->text('deskripsi_isi')->nullable();

            $table->string('kategori')->nullable();
            $table->decimal('tingkat_kesulitan', 2, 1)->nullable(); // 1.0 - 5.0
            $table->string('usia_minimum')->nullable(); // contoh: 12+

            $table->string('jumlah_pemain')->nullable();
            $table->string('durasi')->nullable();

            $table->string('gambar')->nullable();
            $table->string('gambar_hover')->nullable();

            $table->enum('status', ['tersedia', 'dipinjam'])->default('tersedia');
            $table->boolean('populer')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('board_games');
    }
};