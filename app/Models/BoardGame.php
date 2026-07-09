<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'kode',
    'box',
    'nama',
    'penerbit',
    'jumlah',
    'available_copies',
    'satuan',
    'link_foto',
    'komponen',
    'barang_hilang',
    'lantai',
])]
class BoardGame extends Model
{
    use HasFactory;

    public function isTersedia(): bool
    {
        return $this->available_copies > 0;
    }

    protected function casts(): array
    {
        return [
            'link_foto' => 'array',
            'komponen' => 'array',
            'barang_hilang' => 'array',
            'populer' => 'boolean',
        ];
    }
}