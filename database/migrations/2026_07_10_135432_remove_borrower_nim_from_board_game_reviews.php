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
        Schema::table('board_game_reviews', function (Blueprint $table) {
            $table->dropColumn('borrower_nim');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('board_game_reviews', function (Blueprint $table) {
            $table->string('borrower_nim')->after('loan_id');
        });
    }
};
