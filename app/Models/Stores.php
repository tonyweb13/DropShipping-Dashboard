<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stores extends Model
{
    use HasFactory;

    protected $table = 'customers_store';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'customer_quickbooks_id',
        'country',
        'store_name',
        'store_slug',
        'store_ids',
        'editing_status',
        'disable_date',
        'disable_enddate',
        'disable_time',
        'disable_type',
        'disable_endtime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
