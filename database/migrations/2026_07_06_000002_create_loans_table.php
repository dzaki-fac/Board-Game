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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('boardgame_id')
                ->constrained('board_games')
                ->cascadeOnDelete();

            $table->string('borrower_name');
            $table->string('borrower_nim')->nullable();

            $table->dateTime('borrowed_at');
            $table->dateTime('returned_at')->nullable();

            $table->string('status', 20)
                ->default('borrowed');

            $table->string('approved_by')->nullable();
            $table->string('received_by')->nullable();

            $table->string('return_condition')->nullable();
            $table->text('missing_components')->nullable();
            $table->decimal('fine_amount', 10, 2)->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};