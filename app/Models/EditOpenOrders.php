<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EditOpenOrders extends Model
{
    use HasFactory;

    protected $table = 'edited_openorders';

    protected $fillable = [
        'OpenorderID',
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
        'Address2',
        'Address3',
        'ShipState',
        'Reason',
        'isUKdata',
        'edit_with',
        'approved'
    ];
}
