<?php

namespace Database\Seeders;

use App\Models\CarouselSlide;
use Illuminate\Database\Seeder;

class CarouselSlideSeeder extends Seeder
{
    public function run(): void
    {
        $slides = [
            [
                'title' => 'Selamat Datang di UPT Perpustakaan Universitas Diponegoro',
                'description' => 'Temukan, pilih, dan pinjam board game favoritmu melalui katalog digital UPT Perpustakaan Universitas Diponegoro.',
                'detail_title' => 'Selamat Datang di Board Game UPT Perpustakaan Undip',
                'detail_description' => 'Katalog board game ini membantu pemustaka mencari informasi permainan, melihat detail board game, dan mengajukan peminjaman secara online.',
                'points' => [
                    'Cari board game berdasarkan nama, kategori, lantai, dan status.',
                    'Lihat detail board game sebelum mengajukan peminjaman.',
                    'Ajukan peminjaman melalui tombol Pinjam.',
                    'Gunakan board game hanya di area perpustakaan.',
                ],
                'theme' => 'welcome',
                'sort_order' => 0,
            ],
            [
                'title' => 'Tata Cara Peminjaman',
                'description' => 'Ikuti prosedur peminjaman sebelum mengambil board game.',
                'detail_title' => 'Tata Cara Peminjaman Board Game',
                'detail_description' => 'Pemustaka wajib mengikuti prosedur peminjaman board game di UPT Perpustakaan Universitas Diponegoro.',
                'points' => [
                    'Peminjam melakukan peminjaman langsung di meja layanan kepada petugas yang bertugas',
                    'Peminjam memilih board game yang ingin dipinjam, lalu melengkapi form peminjaman sebelum mengambil barangnya',
                    'Peminjam menyerahkan satu kartu identitas (KTM/KTP/Kartu Anggota Perpustakaan) kepada petugas sebagai jaminan',
                    'Peminjam bersama petugas memeriksa kelengkapan komponen (kartu, dadu, pion, papan, dan lain-lain) sesuai lembar daftar isi pada kotak, sebelum board game dibawa ke meja permainan',
                    'Peminjam hanya boleh memainkan board game di lantai tempat board game tersebut dipinjam, tidak membawanya ke lantai lain maupun membawanya pulang',
                    'Peminjam menjaga kelengkapan komponen permainan selama masa peminjaman berlangsung, dan tidak memindahtangankan board game ke kelompok lain secara sepihak.',
                    'Peminjam meminjam dan mengembalikan board game pada hari yang sama, paling lambat sebelum jam operasional perpustakaan berakhir',
                    'Peminjam menerima kembali kartu identitasnya setelah board game diperiksa petugas dan dinyatakan lengkap',
                ],
                'theme' => 'procedure',
                'sort_order' => 1,
            ],
            [
                'title' => 'Ketentuan Penggunaan',
                'description' => 'Jaga kelengkapan dan kondisi board game selama masa peminjaman.',
                'detail_title' => 'Ketentuan Penggunaan Board Game',
                'detail_description' => 'Peminjam bertanggung jawab menjaga kondisi dan kelengkapan board game selama digunakan.',
                'points' => [
                    'Peminjam bertanggung jawab penuh atas keutuhan fisik board game yang digunakannya selama masa peminjaman',
                    'Jika ada komponen yang hilang atau rusak, peminjam wajib menggantinya dengan board game yang judul dan penerbitnya sama persis',
                    'Kerusakan yang dimaksud mencakup antara lain kartu yang sobek, kotak yang penyok cukup parah, atau komponen permainan yang hilang sebagian, bukan hanya kehilangan seluruh set',
                    'Apabila board game tersebut sudah tidak beredar lagi di pasaran, peminjam dapat menggantinya dengan board game lain yang setara, baik dari segi jenis permainan maupun harga, bukan dalam bentuk uang tunai.',
                    'Peminjam diberi waktu paling lama empat belas hari kerja sejak kehilangan atau kerusakan dilaporkan untuk menyelesaikan penggantian',
                    'Selama proses penggantian belum diselesaikan, kartu identitas peminjam ditahan oleh petugas layanan',
                    'Selama kasus penggantian ini belum terselesaikan, peminjam belum diperkenankan meminjam board game lain',
                ],
                'theme' => 'rules',
                'sort_order' => 2,
            ],
        ];

        foreach ($slides as $slide) {
            CarouselSlide::create($slide);
        }
    }
}
