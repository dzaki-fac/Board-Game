<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'kode',
    'box',
    'lantai',
    'nama',
    'penerbit',
    'kategori',
    'jumlah',
    'available_copies',
    'satuan',
    'tingkat_kesulitan',
    'usia_minimum',
    'jumlah_pemain',
    'durasi',
    'link_foto',
    'komponen',
    'barang_hilang',
    'deskripsi',
    'link_tutorial',
    'link_panduan',
])]
class BoardGame extends Model
{
    use HasFactory;

    public function isTersedia(): bool
    {
        return $this->available_copies > 0;
    }

    public function reviews()
    {
        return $this->hasMany(BoardGameReview::class, 'boardgame_id');
    }

    public function loans()
    {
        return $this->hasMany(Loan::class, 'boardgame_id');
    }

    protected function casts(): array
    {
        return [
            'link_foto' => 'array',
            'komponen' => 'array',
            'kategori' => 'array',
            'barang_hilang' => 'array',
        ];
    }
}