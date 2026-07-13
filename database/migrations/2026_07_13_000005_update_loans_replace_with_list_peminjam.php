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
            $table->longText('list_peminjam')->nullable()->after('boardgame_id');
        });

        DB::table('loans')->orderBy('id')->each(function ($row) {
            $names = json_decode($row->borrower_name ?? '[]', true);
            $ids = json_decode($row->nomor_identitas ?? '[]', true);
            $jaminans = json_decode($row->jenis_jaminan ?? '[]', true);
            if (!is_array($names)) $names = [$row->borrower_name];
            if (!is_array($ids)) $ids = [$row->nomor_identitas];
            if (!is_array($jaminans)) $jaminans = [$row->jenis_jaminan];

            $list = [];
            foreach ($names as $i => $name) {
                $list[] = [
                    'nama' => $name,
                    'jenis_jaminan' => $jaminans[$i] ?? ($jaminans[0] ?? 'ktm'),
                    'nomor_identitas' => $ids[$i] ?? '',
                ];
            }

            DB::table('loans')
                ->where('id', $row->id)
                ->update(['list_peminjam' => json_encode($list, JSON_UNESCAPED_UNICODE)]);
        });

        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn(['borrower_name', 'jenis_jaminan', 'nomor_identitas']);
        });
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->text('borrower_name')->nullable()->after('boardgame_id');
            $table->string('jenis_jaminan', 50)->nullable()->after('notes');
            $table->text('nomor_identitas')->nullable()->after('jenis_jaminan');
        });

        DB::table('loans')->orderBy('id')->each(function ($row) {
            $list = json_decode($row->list_peminjam ?? '[]', true);
            $names = collect($list)->pluck('nama')->toArray();
            $jaminans = collect($list)->pluck('jenis_jaminan')->toArray();
            $ids = collect($list)->pluck('nomor_identitas')->toArray();

            DB::table('loans')
                ->where('id', $row->id)
                ->update([
                    'borrower_name' => json_encode($names, JSON_UNESCAPED_UNICODE),
                    'jenis_jaminan' => json_encode($jaminans, JSON_UNESCAPED_UNICODE),
                    'nomor_identitas' => json_encode($ids, JSON_UNESCAPED_UNICODE),
                ]);
        });

        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn('list_peminjam');
        });
    }
};
