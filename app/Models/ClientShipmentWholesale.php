<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientShipmentWholesale extends Model
{
    protected $table = 'ClientShipmentWholesale';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'theDate',
        'SKU',
        'Qty',
        'Destination',
        'StoreID'
    ];
}
