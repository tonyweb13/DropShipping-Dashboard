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
        Schema::table('inventory_counts', function (Blueprint $table) {
            $table->string('order_qty')->nullable()->after('count');
            $table->string('status')->nullable()->after('order_qty');
            $table->longText('notes')->nullable()->after('status');
            $table->string('upload')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
