<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'boardgame_id',
        'borrower_name',
        'borrower_nim',
        'borrowed_at',
        'returned_at',
        'status',
        'notes',
        'return_condition',
        'missing_components',
        'fine_amount',
        'approved_by',
        'received_by',
    ];

    protected function casts(): array
    {
        return [
            'borrowed_at' => 'datetime',
            'returned_at' => 'datetime',
            'fine_amount' => 'decimal:2',
        ];
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(BoardGame::class, 'boardgame_id');
    }

    
}
