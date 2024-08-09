<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientProducts extends Model
{
    protected $table = 'ClientProducts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'SKU',
        'ProductName',
        'Location',
        'Weight',
        'Length',
        'Height',
        'Width',
        'ProductAlias',
        'CountryOfOrigin',
        'AliasSKU',
        'StoreID',
        'ProductVariantID',
        'status',
        'created_by',
        'isBundle',
    ];

    public function store()
    {
        return $this->belongsTo(Stores::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
