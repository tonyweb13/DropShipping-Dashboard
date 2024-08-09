<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reports extends Model
{
    use HasFactory;

    protected $table = 'ClientReports';

    protected $fillable = [
        'ReportID',
        'StoreID',
        'ReportName',
        'isVisible',
        'ReportCategoryID'
    ];
}
