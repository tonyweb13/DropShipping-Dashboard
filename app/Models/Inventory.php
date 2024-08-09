<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $table = 'ClientMasterInventory';

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'Inventory_Date',
        'SKU',
        'Qty_onHand',
        'Qty_Allocated',
        'Qty_toSell',
        'Cumm_Shipment',
        'DateManualCount',
        'ManualCount',
        'Qty_Pending',
    ];
}
