<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpenOrders extends Model
{
    use HasFactory;

    protected $table = 'OpenOrders';

    protected $fillable = [
        'RunDate',
        'StoreID',
        'StoreName',
        'OrderNumber',
        'OrderDate',
        'FirstName',
        'LastName',
        'Address',
        'ShipCity',
        'Zipcode',
        'Country',
        'LocalStatus',
        'OnlineStatus',
        'Source',
        'Address2',
        'Address3',
        'ShipState',
        'OrderID',
        'Type',
        'approved'
    ];
}
