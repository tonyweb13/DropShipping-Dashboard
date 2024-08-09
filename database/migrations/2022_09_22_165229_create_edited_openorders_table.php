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
        Schema::create('edited_openorders', function (Blueprint $table) {
            $table->id();
            $table->integer('StoreID')->nullable();
            $table->string('StoreName')->nullable();
            $table->string('OrderNumber')->nullable();
            $table->date('OrderDate')->nullable();
            $table->string('FirstName')->nullable();
            $table->string('LastName')->nullable();
            $table->string('Address')->nullable();
            $table->string('ShipCity')->nullable();
            $table->string('Zipcode')->nullable();
            $table->string('Country')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('edited_openorders');
    }
};
