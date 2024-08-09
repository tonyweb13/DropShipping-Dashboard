<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $table = 'orders';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'store_id',
        'order_number',
        'order_age',
        'order_date',
        'customer_name',
        'first_name',
        'last_name',
        'email',
        'address',
        'status',
        'amount',
        'order_type',
        'return_store_id',
        'tracking_number',
        'shipping_country',
        'buyer_name',
        'buyer_street_number',
        'buyer_postal_code',
        'packing_condition',
        'item_condition',
        'photo_upload',
        'return_notes',
        'no_items_returned',
        'postage_due',
        'billed_return',
        'archive_return',
        'returned_age',
        'notes_conqueror_only',
        'shipping_date',
        'carrier',
        'service_used',
        'delivery_status',
        'tracking_link',
        'days_since_shipdate',
        'store_name',
    ];
}
