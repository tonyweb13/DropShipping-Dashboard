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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('user_id');
            $table->string('title')->nullable();
            $table->string('sku')->nullable();
            $table->string('description')->nullable();
            $table->string('quantity')->nullable();
            $table->double('amount', 8, 2);
            $table->timestamps();
        });

        Schema::table('products', function($table) {
           $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
           $table->foreign('store_id')->references('id')->on('customers_store')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
