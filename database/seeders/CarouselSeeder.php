<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CarouselSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Carousel::insert([
            [
                'title' => "Selamat Datang di\nUPT Perpustakaan dan UNDIP Press",
                'description' => 'Temukan, pilih, dan pinjam board game favoritmu melalui katalog digital UPT Perpustakaan Universitas Diponegoro.',
                'detail_title' => "Selamat Datang di Board Game\nUPT Perpustakaan Undip",
                'detail_description' => 'Katalog board game ini membantu pemustaka mencari informasi permainan, melihat detail board game, dan mengajukan peminjaman secara online.',
                'points' => json_encode([
                    'Cari board game berdasarkan nama, kategori, lantai, dan status.',
                    'Lihat detail board game sebelum mengajukan peminjaman.',
                    'Ajukan peminjaman melalui tombol Pinjam.',
                    'Gunakan board game hanya di area perpustakaan.',
                ]),
                'theme' => 'welcome',
                'bg_image' => 'https://images.pexels.com/photos/37983585/pexels-photo-37983585.jpeg',
                'sort_order' => 1,
            ],
            [
                'title' => 'Tata Cara Peminjaman',
                'description' => 'Ikuti prosedur peminjaman sebelum mengambil board game.',
                'detail_title' => 'Tata Cara Peminjaman Board Game',
                'detail_description' => 'Pemustaka wajib mengikuti prosedur peminjaman board game di UPT Perpustakaan Universitas Diponegoro.',
                'points' => json_encode([
                    'Peminjam melakukan peminjaman langsung di meja layanan kepada petugas yang bertugas',
                    'Peminjam memilih board game yang ingin dipinjam, lalu melengkapi form peminjaman sebelum mengambil barangnya',
                    'Peminjam menyerahkan satu kartu identitas (KTM/KTP/Kartu Anggota Perpustakaan) kepada petugas sebagai jaminan',
                    'Peminjam bersama petugas memeriksa kelengkapan komponen (kartu, dadu, pion, papan, dan lain-lain) sesuai lembar daftar isi pada kotak, sebelum board game dibawa ke meja permainan',
                    'Peminjam hanya boleh memainkan board game di lantai tempat board game tersebut dipinjam, tidak membawanya ke lantai lain maupun membawanya pulang',
                    'Peminjam menjaga kelengkapan komponen permainan selama masa peminjaman berlangsung, dan tidak memindahtangankan board game ke kelompok lain secara sepihak.',
                    'Peminjam meminjam dan mengembalikan board game pada hari yang sama, paling lambat sebelum jam operasional perpustakaan berakhir',
                    'Peminjam menerima kembali kartu identitasnya setelah board game diperiksa petugas dan dinyatakan lengkap',
                ]),
                'theme' => 'procedure',
                'bg_image' => 'https://images.pexels.com/photos/6333905/pexels-photo-6333905.jpeg?_gl=1*1dwbmw3*_ga*NzkwNzYzNjA5LjE3ODQwMTI3MDg.*_ga_8JE65Q40S6*czE3ODQ2MjAwOTckbzYkZzEkdDE3ODQ2MjAwOTgkajU5JGwwJGgw',
                'sort_order' => 2,
            ],
            [
                'title' => 'Ketentuan Penggunaan',
                'description' => 'Jaga kelengkapan dan kondisi board game selama masa peminjaman.',
                'detail_title' => 'Ketentuan Penggunaan Board Game',
                'detail_description' => 'Peminjam bertanggung jawab menjaga kondisi dan kelengkapan board game selama digunakan.',
                'points' => json_encode([
                    'Peminjam bertanggung jawab penuh atas keutuhan fisik board game yang digunakannya selama masa peminjaman',
                    'Jika ada komponen yang hilang atau rusak, peminjam wajib menggantinya dengan board game yang judul dan penerbitnya sama persis',
                    'Peminjam wajib mengganti board game yang hilang dengan unit baru yang sama',
                    'Peminjam wajib mengganti komponen yang hilang dengan jenis komponen yang sesuai',
                ]),
                'theme' => 'rules',
                'bg_image' => 'https://images.pexels.com/photos/33152331/pexels-photo-33152331.jpeg?_gl=1*1wmu6ve*_ga*NzkwNzYzNjA5LjE3ODQwMTI3MDg.*_ga_8JE65Q40S6*czE3ODQ2MTc0OTckbzUkZzEkdDE3ODQ2MTc1NzgkajU5JGwwJGgw',
                'sort_order' => 3,
            ],
            [
                'title' => 'Sanksi Kerusakan / Kehilangan',
                'description' => 'Konsekuensi jika komponen atau board game rusak atau hilang.',
                'detail_title' => 'Sanksi Kerusakan / Kehilangan Board Game',
                'detail_description' => 'Peminjam wajib mengganti sesuai ketentuan jika komponen atau board game rusak atau hilang.',
                'points' => json_encode([
                    'Komponen hilang: wajib ganti sesuai jenis komponen',
                    'Board game rusak: wajib ganti unit yang sama',
                    'Board game hilang: ganti unit baru atau denda sesuai ketentuan',
                ]),
                'theme' => 'sanksi',
                'bg_image' => 'https://images.pexels.com/photos/8899971/pexels-photo-8899971.jpeg?_gl=1*g5dap3*_ga*NzkwNzYzNjA5LjE3ODQwMTI3MDg.*_ga_8JE65Q40S6*czE3ODQ2MjAwOTckbzYkZzEkdDE3ODQ2MjA5MDgkajU5JGwwJGgw',
                'sort_order' => 4,
            ],
        ]);
    }
}
