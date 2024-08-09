<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientOrders extends Model
{
    use HasFactory;

    protected $table = 'ClientOrders';

    public $timestamps = false;

    protected $fillable = [
        'orderid',
        'Storeid',
        'ordernumber',
        'OrderNumberComplete',
        'OrderDate',
        'ShipFirstName',
        'ShipLastName',
        'ShipEmail',
        'LocalStatus',
        'onlinestatus',
        'ShipStreet1',
        'ShipStreet2',
        'ShipStreet3',
        'ShipCity',
        'ShipPostalCode',
        'ShipStateProvCode',
        'ShipCountryCode',
        'shipaddressvalidationerror',
        'RequestedShipping',
        'InsertDate',
        'ModifiedDate',
        'Source',
    ];
}
