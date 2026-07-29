<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rule extends Model
{
    protected $fillable = ['title', 'items', 'sort_order'];

    protected function casts(): array
    {
        return [
            'items' => 'array',
        ];
    }
}
