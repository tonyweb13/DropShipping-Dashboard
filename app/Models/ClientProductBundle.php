<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientProductBundle extends Model
{
    protected $table = 'ClientProductBundle';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'BundleSKU',
        'SKUIncluded',
        'Qty',
        'ProdBundleStatus'
    ];
}
