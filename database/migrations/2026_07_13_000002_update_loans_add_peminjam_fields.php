<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->string('jenis_jaminan', 10)->nullable()->after('notes');
            $table->text('nomor_identitas')->nullable()->after('jenis_jaminan');
        });

        DB::table('loans')->whereNotNull('borrower_nim')->orderBy('id')->each(function ($row) {
            DB::table('loans')
                ->where('id', $row->id)
                ->update([
                    'nomor_identitas' => json_encode([$row->borrower_nim]),
                ]);
        });

        DB::table('loans')->whereNotNull('borrower_name')->orderBy('id')->each(function ($row) {
            $name = $row->borrower_name;
            if ($name && !str_starts_with($name, '[')) {
                DB::table('loans')
                    ->where('id', $row->id)
                    ->update(['borrower_name' => json_encode([$name])]);
            }
        });

        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn('borrower_nim');
        });
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->string('borrower_nim', 50)->nullable()->after('borrower_name');
        });

        DB::table('loans')->whereNotNull('nomor_identitas')->orderBy('id')->each(function ($row) {
            $ids = json_decode($row->nomor_identitas, true);
            $firstId = is_array($ids) ? ($ids[0] ?? null) : null;
            if ($firstId) {
                DB::table('loans')
                    ->where('id', $row->id)
                    ->update(['borrower_nim' => $firstId]);
            }
        });

        DB::table('loans')->whereNotNull('borrower_name')->orderBy('id')->each(function ($row) {
            $names = json_decode($row->borrower_name, true);
            $firstName = is_array($names) ? ($names[0] ?? '') : $row->borrower_name;
            DB::table('loans')
                ->where('id', $row->id)
                ->update(['borrower_name' => $firstName]);
        });

        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn(['jenis_jaminan', 'nomor_identitas']);
        });
    }
};
