<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminStores extends Model
{
    use HasFactory;

    protected $table = 'Stores';

    protected $fillable = [
        'StoreID',
        'StoreName',
    ];
}
