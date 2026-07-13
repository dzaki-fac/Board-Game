<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RuleItem extends Model
{
    protected $fillable = ['rule_id', 'content', 'sort_order'];

    public function rule()
    {
        return $this->belongsTo(Rule::class);
    }
}
