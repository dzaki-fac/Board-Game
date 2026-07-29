<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    public function getBgImageUrlAttribute(): string
    {
        if (!$this->bg_image) {
            return '';
        }
        if (filter_var($this->bg_image, FILTER_VALIDATE_URL)) {
            return $this->bg_image;
        }
        return Storage::url($this->bg_image);
    }
}
