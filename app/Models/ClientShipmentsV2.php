<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientShipmentsV2 extends Model
{
    use HasFactory;

    protected $table = 'ClientShipmentsV2';

    protected $fillable = [
        'ShipmentID',
        'Orderid',
        'TrackingNumber',
        'OrderNumberComplete',
        'OrderDate',
        'Carrier',
        'ProcessedDate',
        'ShippingService',
        'ModifiedData',
        'InsertDate',
        'TrackingStatus'
    ];
}
