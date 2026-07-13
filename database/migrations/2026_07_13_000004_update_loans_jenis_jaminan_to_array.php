<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('loans')->whereNotNull('jenis_jaminan')
            ->where('jenis_jaminan', 'not like', '[%')
            ->orderBy('id')
            ->each(function ($row) {
                DB::table('loans')
                    ->where('id', $row->id)
                    ->update(['jenis_jaminan' => json_encode([$row->jenis_jaminan])]);
            });
    }

    public function down(): void
    {
        DB::table('loans')->whereNotNull('jenis_jaminan')
            ->orderBy('id')
            ->each(function ($row) {
                $val = json_decode($row->jenis_jaminan, true);
                $first = is_array($val) ? ($val[0] ?? 'ktm') : $row->jenis_jaminan;
                DB::table('loans')
                    ->where('id', $row->id)
                    ->update(['jenis_jaminan' => $first]);
            });
    }
};
