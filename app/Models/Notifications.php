<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'notification_title',
        'notification_content',
        'notification_upload',
        'notification_type',
        'store_id',
        'added_by'
    ];
}
