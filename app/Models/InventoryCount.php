<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryCount extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventorydate_id',
        'product_id',
        'count'
    ];

    public function products()
    {
        return $this->hasMany(Inventory::class);
    }
}
