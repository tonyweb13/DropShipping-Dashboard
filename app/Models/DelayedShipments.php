<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DelayedShipments extends Model
{
    use HasFactory;

    protected $table = 'USPSDelayedShipments';
}
