<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'name',
        'description',
        'user_id',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function chat(): HasMany
    {
        return $this->hasMany(Chat::class);
    }
}
