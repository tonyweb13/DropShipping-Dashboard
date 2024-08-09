<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipments extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'shipment_title',
        'user_id',
        'delivery_date',
        'title',
        'sku',
        'qty',
        'country',
        'contact_person',
        'contact_number',
        'notes',
        'upload',
        'status'
    ];
}
