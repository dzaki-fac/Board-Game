<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'komponen',
        'total_copies',
        'available_copies',
    ];

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }
}
