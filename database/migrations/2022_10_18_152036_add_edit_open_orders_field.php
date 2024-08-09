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
        Schema::table('edited_openorders', function (Blueprint $table) {
           $table->string('Address2')->nullable()->after('Address');
           $table->string('Address3')->nullable()->after('Address2');
           $table->string('ShipState')->nullable()->after('ShipCity');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('edited_openorders', function (Blueprint $table) {
            //
        });
    }
};
