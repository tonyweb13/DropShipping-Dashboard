<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReceivingNotes extends Model
{
    use HasFactory;

    protected $table = 'receiving_notes';

    protected $fillable = [
        'note_added',
        'product_count_id',
        'notes',
        'upload',
        'notes_title',
        'added_by',
        'added_by_name'
    ];
}
