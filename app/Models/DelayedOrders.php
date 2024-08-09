<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DelayedOrders extends Model
{
    use HasFactory;

    protected $table = 'DelayedShipments';

    protected $fillable = [
        'RunDate',
        'StoreID',
        'StoreName',
        'OrderNumber',
        'OrderDate',
        'ShipDate',
        'CustomerEmail',
        'ShipCountry',
        'Carrier',
        'SKU',
        'TrackingNumber',
        'DeliveryStatus',
        'OrderAge',
        'LocalStatus',
        'OnlineStatus',
        'ProcessedDate',
        'Source'
    ];
}
