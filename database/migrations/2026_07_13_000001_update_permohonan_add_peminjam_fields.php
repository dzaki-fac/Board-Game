<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permohonan', function (Blueprint $table) {
            $table->string('jenis_jaminan', 10)->nullable()->after('catatan');
            $table->text('nomor_identitas')->nullable()->after('jenis_jaminan');
        });

        DB::table('permohonan')->whereNotNull('nim')->orderBy('id')->each(function ($row) {
            DB::table('permohonan')
                ->where('id', $row->id)
                ->update([
                    'nomor_identitas' => json_encode([$row->nim]),
                ]);
        });

        DB::table('permohonan')->whereNotNull('nama')->orderBy('id')->each(function ($row) {
            $nama = $row->nama;
            if ($nama && !str_starts_with($nama, '[')) {
                DB::table('permohonan')
                    ->where('id', $row->id)
                    ->update(['nama' => json_encode([$nama])]);
            }
        });

        Schema::table('permohonan', function (Blueprint $table) {
            $table->dropColumn('nim');
        });
    }

    public function down(): void
    {
        Schema::table('permohonan', function (Blueprint $table) {
            $table->string('nim', 50)->nullable()->after('nama');
        });

        DB::table('permohonan')->whereNotNull('nomor_identitas')->orderBy('id')->each(function ($row) {
            $ids = json_decode($row->nomor_identitas, true);
            $firstId = is_array($ids) ? ($ids[0] ?? null) : null;
            if ($firstId) {
                DB::table('permohonan')
                    ->where('id', $row->id)
                    ->update(['nim' => $firstId]);
            }
        });

        DB::table('permohonan')->whereNotNull('nama')->orderBy('id')->each(function ($row) {
            $names = json_decode($row->nama, true);
            $firstName = is_array($names) ? ($names[0] ?? '') : $row->nama;
            DB::table('permohonan')
                ->where('id', $row->id)
                ->update(['nama' => $firstName]);
        });

        Schema::table('permohonan', function (Blueprint $table) {
            $table->dropColumn(['jenis_jaminan', 'nomor_identitas']);
        });
    }
};
