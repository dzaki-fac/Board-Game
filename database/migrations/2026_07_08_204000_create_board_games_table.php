<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('board_games')) {
            Schema::create('board_games', function (Blueprint $table) {
                $table->id();
                $table->string('kode')->unique();
                $table->integer('box');
                $table->string('nama');
                $table->string('penerbit')->nullable();
                $table->integer('jumlah');
                $table->integer('available_copies')->default(0);
                $table->string('satuan');
                $table->text('link_foto')->nullable();
                $table->text('komponen');
                $table->text('barang_hilang')->nullable();
                $table->integer('lantai');
                $table->timestamps();
            });

            DB::statement('UPDATE board_games SET available_copies = jumlah');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('board_games');
    }
};
