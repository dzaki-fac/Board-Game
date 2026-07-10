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

            // Identitas
            $table->string('kode')->unique();
            $table->integer('box');
            $table->integer('lantai');

            // Informasi board game
            $table->string('nama');
            $table->string('penerbit')->nullable();
            $table->json('kategori')->nullable();

            // Stok
            $table->integer('jumlah');
            $table->integer('available_copies');
            $table->string('satuan');

            // Detail permainan
            $table->decimal('tingkat_kesulitan', 2, 1)->nullable();
            $table->string('usia_minimum')->nullable();
            $table->string('jumlah_pemain')->nullable();
            $table->string('durasi')->nullable();

            // Foto (array URL)
            $table->json('link_foto')->nullable();

            // Daftar komponen
            // [
            //     { "nama": "Kartu", "jumlah": 120 },
            //     { "nama": "Dadu", "jumlah": 2 }
            // ]
            $table->json('komponen');

            // Komponen yang sedang hilang
            // [
            //     { "nama": "Kartu", "jumlah": 2 }
            // ]
            $table->json('barang_hilang')->nullable();

            $table->boolean('populer')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('board_games');
    }
};