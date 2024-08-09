<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryDates extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_key',
        'date_type',
        'date'
    ];

    public function productcounts() {
        return $this->hasMany(InventoryCount::class);
    }
}
