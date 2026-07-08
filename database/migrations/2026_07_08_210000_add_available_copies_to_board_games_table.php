<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('board_games', function (Blueprint $table) {
            $table->integer('available_copies')->default(0)->after('jumlah');
        });

        DB::statement('UPDATE board_games SET available_copies = jumlah');
    }

    public function down(): void
    {
        Schema::table('board_games', function (Blueprint $table) {
            $table->dropColumn('available_copies');
        });
    }
};
