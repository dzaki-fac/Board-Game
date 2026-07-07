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
            $table->integer('box');
            $table->string('nama');
            $table->string('penerbit')->nullable();
            $table->integer('jumlah');
            $table->string('satuan');
            $table->string('link_foto')->nullable();
            $table->text('komponen');
            $table->integer('lantai');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('board_games');
    }
};
