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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('tracking_no')->nullable();
            $table->string('buyer_name')->nullable();
            $table->string('ship_country')->nullable();
            $table->string('buyer_street_no')->nullable();
            $table->string('buyer_postal')->nullable();
            $table->string('package_condition')->nullable();
            $table->string('item_condition')->nullable();
            $table->text('notes')->nullable();
            $table->integer('item_return')->nullable()->default(0);
            $table->integer('billed')->nullable()->default(0);
            $table->timestamps();
        });

        Schema::table('reports', function($table) {
           $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });

        Schema::create('report_assets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('report_id');
            $table->string('photo')->nullable();
            $table->integer('status')->nullable()->default(0);
            $table->timestamps();
        });

        Schema::table('report_assets', function($table) {
           $table->foreign('report_id')->references('id')->on('reports')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reports');
        Schema::dropIfExists('report_assets');
    }
};
