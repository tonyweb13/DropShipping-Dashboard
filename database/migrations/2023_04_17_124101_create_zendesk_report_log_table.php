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
        Schema::create('ZendeskReportLog', function (Blueprint $table) {
            $table->id();
            $table->string('log_title')->nullable();
            $table->integer('user_id')->nullable()->default(0);
            $table->integer('store_id')->nullable()->default(0);
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
        Schema::dropIfExists('ZendeskReportLog');
    }
};
