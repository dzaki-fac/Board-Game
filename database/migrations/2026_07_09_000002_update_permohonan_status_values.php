<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permohonan', function (Blueprint $table) {
            $table->string('status', 20)->default('pending')->change();
        });

        DB::table('permohonan')->where('status', 'menunggu')->update(['status' => 'pending']);
        DB::table('permohonan')->where('status', 'dipinjam')->update(['status' => 'approved']);
        DB::table('permohonan')->where('status', 'dikembalikan')->update(['status' => 'returned']);
        DB::table('permohonan')->where('status', 'ditolak')->update(['status' => 'rejected']);
    }

    public function down(): void
    {
        DB::table('permohonan')->where('status', 'pending')->update(['status' => 'menunggu']);
        DB::table('permohonan')->where('status', 'approved')->update(['status' => 'dipinjam']);
        DB::table('permohonan')->where('status', 'returned')->update(['status' => 'dikembalikan']);
        DB::table('permohonan')->where('status', 'rejected')->update(['status' => 'ditolak']);

        Schema::table('permohonan', function (Blueprint $table) {
            $table->string('status', 20)->default('menunggu')->change();
        });
    }
};
