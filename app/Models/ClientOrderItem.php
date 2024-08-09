<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientOrderItem extends Model
{
    use HasFactory;

    protected $table = 'ClientOrderItem';

    protected $fillable = [
        'OrderID',
        'SKU',
        'Quantity',
        'TotalWeight',
        'UnitPrice',
        'InsertDate',
        'ModifiedDate',
        'OrderItemID',
        'Name',
        'Weight',
    ];
}
