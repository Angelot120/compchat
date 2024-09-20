<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Chat extends Model
{
    use HasFactory;
    protected $fillable = [
        'chat',
        'group_id',
        'user_id',
    ];

    public function group(): HasOne
    {
        return $this->hasOne(Group::class);
    }
}
