<?php

namespace App\Models;

use Database\Factories\BoardGameFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['kode', 'box', 'nama', 'penerbit', 'jumlah', 'satuan', 'link_foto', 'komponen', 'lantai'])]
class BoardGame extends Model
{
    /** @use HasFactory<BoardGameFactory> */
    use HasFactory;
}
