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
        Schema::create('receiving_notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_count_id');
            $table->text('notes')->nullable();
            $table->string('upload')->nullable();
            $table->dateTime('note_added')->nullable();
            $table->timestamps();
        });

        Schema::table('receiving_notes', function($table) {
           $table->foreign('product_count_id')->references('id')->on('product_counts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('receiving_notes');
    }
};
