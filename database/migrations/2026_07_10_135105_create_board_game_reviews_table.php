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
        Schema::create('board_game_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('boardgame_id')->constrained('board_games')->cascadeOnDelete();
            $table->foreignId('loan_id')->nullable()->constrained('loans')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->unique('loan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('board_game_reviews');
    }
};
