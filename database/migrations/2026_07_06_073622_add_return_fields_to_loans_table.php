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
        Schema::table('loans', function (Blueprint $table) {
            $table->string('return_condition')->nullable()->after('status');
            $table->text('missing_components')->nullable()->after('return_condition');
            $table->decimal('fine_amount', 10, 2)->nullable()->after('missing_components');
        });
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn(['return_condition', 'missing_components', 'fine_amount']);
        });
    }
};
