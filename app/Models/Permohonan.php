<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permohonan extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_RETURNED = 'returned';

    protected $table = 'permohonan';

    protected $fillable = [
        'nama',
        'nim',
        'boardgame_id',
        'status',
        'tanggal_pinjam',
        'jam_pinjam',
        'tanggal_rencana_kembali',
        'jam_rencana_kembali',
        'jam_kembali',
        'catatan',
    ];

    protected $casts = [
        'tanggal_pinjam' => 'date:Y-m-d',
        'tanggal_rencana_kembali' => 'date:Y-m-d',
    ];

    public function boardgame()
    {
        return $this->belongsTo(BoardGame::class, 'boardgame_id');
    }
}