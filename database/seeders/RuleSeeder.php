<?php

namespace Database\Seeders;

use App\Models\Rule;
use Illuminate\Database\Seeder;

class RuleSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            ['Ketentuan Peminjaman', [
                'Peminjaman board game hanya diperuntukkan bagi mahasiswa/i aktif Universitas Diponegoro yang memiliki KTM valid.',
                'Setiap peminjam wajib menunjukkan KTM asli pada saat peminjaman.',
                'Maksimal peminjaman 1 (satu) box board game per orang per hari.',
                'Durasi peminjaman maksimal 2x24 jam dan harus dikembalikan tepat waktu.',
            ]],
            ['Ketentuan Pengembalian', [
                'Board game wajib dikembalikan dalam kondisi lengkap dan tidak rusak.',
                'Keterlambatan pengembalian akan dikenakan denda sebesar Rp5.000,- per hari.',
                'Kerusakan atau kehilangan komponen board game akan dikenakan biaya penggantian sesuai harga komponen.',
                'Pengembalian dilakukan di meja sirkulasi UPT Perpustakaan Undip.',
            ]],
            ['Larangan', [
                'Dilarang meminjamkan board game yang dipinjam kepada pihak lain.',
                'Dilarang membawa board game keluar area UPT Perpustakaan Undip tanpa prosedur yang sah.',
                'Dilarang merusak, mencoret-coret, atau memodifikasi komponen board game.',
                'Dilarang membawa makanan dan minuman di area peminjaman board game.',
            ]],
            ['Sanksi', [
                'Pelanggaran terhadap tata tertib akan dikenakan sanksi sesuai tingkat pelanggaran.',
                'Pelanggaran berat dapat menyebabkan pencabutan hak peminjaman board game.',
                'Peminjam yang tidak mengembalikan board game selama 7 hari setelah batas waktu akan dilaporkan ke pihak berwenang.',
            ]],
        ];

        foreach ($sections as $i => $sec) {
            $rule = Rule::create(['section_title' => $sec[0], 'sort_order' => $i]);
            foreach ($sec[1] as $j => $content) {
                $rule->items()->create(['content' => $content, 'sort_order' => $j]);
            }
        }
    }
}
