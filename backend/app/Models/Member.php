<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'group_id',
    ];

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }

    public function group(): HasMany
    {
        return $this->hasMany(Group::class);
    }
}
