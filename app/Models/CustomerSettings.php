<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerSettings extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'option_name',
        'option_value',
        'store_id'
    ];
}
