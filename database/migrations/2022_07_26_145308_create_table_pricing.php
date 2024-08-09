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
        Schema::create('pricing', function (Blueprint $table) {
            $table->id();
            $table->integer('store_id')->nullable()->default(0);
            $table->string('sku')->nullable();
            $table->string('pricing_type')->nullable();
            $table->string('pricing_shipping')->nullable();
            $table->string('pricing_delivery')->nullable();
            $table->double('pricing_weight')->nullable()->default(0);
            $table->string('pricing_units')->nullable();
            $table->double('price')->nullable()->default(0);
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
        Schema::dropIfExists('pricing');
    }
};
