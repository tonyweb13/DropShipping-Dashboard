<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentNotes extends Model
{
    use HasFactory;

    protected $table = 'shipment_notes';

    protected $fillable = [
        'user_name',
        'shipment_id',
        'notes',
        'upload'
    ];
}
