<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customers_store', function (Blueprint $table) {
            $table->string('disable_date2')->nullable();
            $table->string('disable_enddate2')->nullable();
            $table->string('disable_time2')->nullable();
            $table->string('disable_endtime2')->nullable();
            $table->string('disable_stime_field2')->nullable();
            $table->string('disable_etime_field2')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('customers_store', function (Blueprint $table) {
            //
        });
    }
};
