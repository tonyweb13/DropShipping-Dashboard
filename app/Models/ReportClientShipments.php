<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportClientShipments extends Model
{
    use HasFactory;

    protected $table = 'ClientShipments';

    protected $fillable = [
        'ordernumber',
        'ShipCountry',
        'ProcessedDate',
        'DeliveryStatus',
        'TrackingNumber',
        'SKU',
        'Region',
        'ShipDate'
    ];
}
