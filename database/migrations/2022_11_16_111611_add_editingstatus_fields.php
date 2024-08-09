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
            $table->string('editing_status')->nullable();
            $table->date('disable_date')->nullable();
            $table->time('disable_time')->nullable();
            $table->string('disable_type')->nullable();
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