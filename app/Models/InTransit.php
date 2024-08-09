<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InTransit extends Model
{
    use HasFactory;

    protected $table = 'InTransit';

    protected $fillable = [
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
