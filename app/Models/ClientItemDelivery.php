<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientItemDelivery extends Model
{
    protected $table = 'ClientItemDelivery';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'OrderNumber',
        'CustomerEmail',
        'OrderDateEST',
        'ShipDateEST',
        'ActualDeliveryDateEST',
        'ShipCountryCode',
        'Carrier',
        'RollupItemSKU',
        'trackingnumber',
        'Delivery_Status',
        'OrderAge'
    ];
}
