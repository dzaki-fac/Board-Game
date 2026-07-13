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
        Schema::create('rules', function (Blueprint $table) {
            $table->id();
            $table->string('section_title');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('rule_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rule_id')->constrained('rules')->cascadeOnDelete();
            $table->text('content');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rule_items');
        Schema::dropIfExists('rules');
    }
};
