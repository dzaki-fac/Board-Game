<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rule extends Model
{
    protected $fillable = ['section_title', 'sort_order'];

    public function items()
    {
        return $this->hasMany(RuleItem::class)->orderBy('sort_order');
    }

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }
}
