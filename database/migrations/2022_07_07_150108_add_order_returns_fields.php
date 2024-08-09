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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('return_store_id')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('shipping_country')->nullable();
            $table->string('buyer_name')->nullable();
            $table->string('buyer_street_number')->nullable();
            $table->string('buyer_postal_code')->nullable();
            $table->string('packing_condition')->nullable();
            $table->string('item_condition')->nullable();
            $table->mediumText('photo_upload')->nullable();
            $table->mediumText('return_notes')->nullable();
            $table->integer('no_items_returned')->nullable()->default(0);
            $table->string('postage_due')->nullable();
            $table->string('billed_return')->nullable();
            $table->string('archive_return')->nullable();
            $table->string('returned_age')->nullable();
            $table->mediumText('notes_conqueror_only')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
};
