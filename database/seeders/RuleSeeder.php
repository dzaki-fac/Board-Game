<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RuleSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Rule::insert([
            [
                'title' => 'Ketentuan Peminjaman',
                'items' => json_encode([
                    'Peminjaman board game hanya diperuntukkan bagi mahasiswa/i aktif Universitas Diponegoro yang memiliki KTM valid.',
                    'Setiap peminjam wajib menunjukkan KTM asli pada saat peminjaman.',
                    'Maksimal peminjaman 1 (satu) box board game per orang per hari.',
                    'Durasi peminjaman maksimal 2x24 jam dan harus dikembalikan tepat waktu.',
                ]),
                'sort_order' => 1,
            ],
            [
                'title' => 'Ketentuan Pengembalian',
                'items' => json_encode([
                    'Board game wajib dikembalikan dalam kondisi lengkap dan tidak rusak.',
                    'Keterlambatan pengembalian akan dikenakan denda sebesar Rp5.000,- per hari.',
                    'Kerusakan atau kehilangan komponen board game akan dikenakan biaya penggantian sesuai harga komponen.',
                    'Pengembalian dilakukan di meja sirkulasi UPT Perpustakaan Undip.',
                ]),
                'sort_order' => 2,
            ],
            [
                'title' => 'Larangan',
                'items' => json_encode([
                    'Dilarang meminjamkan board game yang dipinjam kepada pihak lain.',
                    'Dilarang membawa board game keluar area UPT Perpustakaan Undip tanpa prosedur yang sah.',
                    'Dilarang merusak, mencoret-coret, atau memodifikasi komponen board game.',
                    'Dilarang membawa makanan dan minuman di area peminjaman board game.',
                ]),
                'sort_order' => 3,
            ],
            [
                'title' => 'Sanksi',
                'items' => json_encode([
                    'Pelanggaran terhadap tata tertib akan dikenakan sanksi sesuai tingkat pelanggaran.',
                    'Pelanggaran berat dapat menyebabkan pencabutan hak peminjaman board game.',
                    'Peminjam yang tidak mengembalikan board game selama 7 hari setelah batas waktu akan dilaporkan ke pihak berwenang.',
                ]),
                'sort_order' => 4,
            ],
        ]);
    }
}
