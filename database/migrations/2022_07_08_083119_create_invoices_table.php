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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->integer('store_id')->default(0)->nullable();
            $table->integer('invoicenum')->default(0)->nullable();
            $table->string('invoicedate')->nullable();
            $table->string('duedate')->nullable();
            $table->double('balance', 8, 2);
            $table->double('total', 8, 2);
            $table->timestamps();
        });

        Schema::table('invoices', function($table) {
           $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invoices');
    }
};
