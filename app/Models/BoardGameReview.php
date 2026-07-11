<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoardGameReview extends Model
{
    protected $fillable = [
        'boardgame_id',
        'loan_id',
        'rating',
        'comment',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }

    public function boardGame()
    {
        return $this->belongsTo(BoardGame::class, 'boardgame_id');
    }

    public function loan()
    {
        return $this->belongsTo(Loan::class, 'loan_id');
    }
}
