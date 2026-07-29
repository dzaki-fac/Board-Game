<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    protected $fillable = [
        'title',
        'description',
        'detail_title',
        'detail_description',
        'points',
        'theme',
        'bg_image',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'array',
        ];
    }
}
