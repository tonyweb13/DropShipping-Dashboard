<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zendesk extends Model
{
    use HasFactory;

    protected $table = 'ZendeskReportLog';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'log_title',
        'user_id',
        'reporter',
        'store_id'
    ];
}
