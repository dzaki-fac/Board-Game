<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('board_games', function (Blueprint $table) {
            $table->decimal('tingkat_kesulitan', 2, 1)->nullable()->after('kategori'); // 1.0 - 5.0
            $table->string('usia_minimum')->nullable()->after('tingkat_kesulitan'); // contoh: "12+"
        });
    }

    public function down(): void
    {
        Schema::table('board_games', function (Blueprint $table) {
            $table->dropColumn(['tingkat_kesulitan', 'usia_minimum']);
        });
    }
};