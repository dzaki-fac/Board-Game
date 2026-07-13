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
            $table->longText('list_peminjam')->nullable()->after('catatan');
        });

        DB::table('permohonan')->orderBy('id')->each(function ($row) {
            $names = json_decode($row->nama ?? '[]', true);
            $ids = json_decode($row->nomor_identitas ?? '[]', true);
            $jaminan = $row->jenis_jaminan ?? 'ktm';

            $list_peminjam = [];
            foreach ($names as $i => $name) {
                $list_peminjam[] = [
                    'nama' => $name,
                    'jenis_jaminan' => $jaminan,
                    'nomor_identitas' => $ids[$i] ?? '',
                ];
            }

            DB::table('permohonan')
                ->where('id', $row->id)
                ->update(['list_peminjam' => json_encode($list_peminjam, JSON_UNESCAPED_UNICODE)]);
        });

        Schema::table('permohonan', function (Blueprint $table) {
            $table->dropColumn(['nama', 'jenis_jaminan', 'nomor_identitas']);
        });
    }

    public function down(): void
    {
        Schema::table('permohonan', function (Blueprint $table) {
            $table->text('nama')->nullable()->after('catatan');
            $table->string('jenis_jaminan', 10)->nullable()->after('nama');
            $table->text('nomor_identitas')->nullable()->after('jenis_jaminan');
        });

        DB::table('permohonan')->orderBy('id')->each(function ($row) {
            $list_peminjam = json_decode($row->list_peminjam ?? '[]', true);
            $names = collect($list_peminjam)->pluck('nama')->toArray();
            $jaminan = $list_peminjam[0]['jenis_jaminan'] ?? null;
            $ids = collect($list_peminjam)->pluck('nomor_identitas')->toArray();

            DB::table('permohonan')
                ->where('id', $row->id)
                ->update([
                    'nama' => json_encode($names, JSON_UNESCAPED_UNICODE),
                    'jenis_jaminan' => $jaminan,
                    'nomor_identitas' => json_encode($ids, JSON_UNESCAPED_UNICODE),
                ]);
        });

        Schema::table('permohonan', function (Blueprint $table) {
            $table->dropColumn('list_peminjam');
        });
    }
};
