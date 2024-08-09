<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReadNotification extends Model
{
    use HasFactory;

    protected $table = 'read_notification';

    protected $fillable = [
        'notification_id',
        'user_id',
        'notify_status'
    ];
}
