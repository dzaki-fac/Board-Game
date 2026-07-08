<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'kode', 'box', 'lantai', 'nama', 'penerbit', 'jumlah', 'satuan',
    'deskripsi_isi', 'kategori', 'jumlah_pemain', 'durasi', 'gambar', 'gambar_hover',
    'status', 'populer', 'tingkat_kesulitan', 'usia_minimum'
])]
class BoardGame extends Model
{
    use HasFactory;

    public function isTersedia(): bool
    {
        return $this->status === 'tersedia';
    }
}