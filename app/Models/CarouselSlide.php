<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarouselSlide extends Model
{
    protected $fillable = [
        'title',
        'description',
        'detail_title',
        'detail_description',
        'points',
        'theme',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'array',
            'sort_order' => 'integer',
        ];
    }
}
