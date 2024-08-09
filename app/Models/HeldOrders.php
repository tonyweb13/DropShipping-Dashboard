<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeldOrders extends Model
{
    use HasFactory;

    protected $table = 'HeldOrder';

    protected $fillable = [
        'StoreID',
        'StoreName',
        'OrderNumber',
        'OrderDate',
        'OrderAge',
        'CustomerName',
        'Status',
        'Source'
    ];
}
