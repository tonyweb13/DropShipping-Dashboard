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
        Schema::create('inventory_counts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inventorydate_id');
            $table->integer('product_id')->default(0)->nullable();
            $table->string('count')->default(0)->nullable();
            $table->timestamps();
        });

        Schema::table('inventory_counts', function($table) {
           $table->foreign('inventorydate_id')->references('id')->on('inventory_dates')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventory_counts');
    }
};
