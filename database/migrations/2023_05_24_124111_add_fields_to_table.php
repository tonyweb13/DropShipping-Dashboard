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

        // Schema::table('clientproducts', function (Blueprint $table) {
        //     $table->string('AliasSKU4', 100)->nullable();
        //     $table->string('AliasSKU5', 100)->nullable();
        //     $table->decimal('DeclaredValue', 8, 2)->nullable()->default(0.00);
        //     $table->string('CountryOrigin', 45)->nullable();
        //     $table->string('TariffCode', 45)->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::table('clientproducts', function (Blueprint $table) {
        //     //
        //     $table->dropColumn('AliasSKU4');
        //     $table->dropColumn('AliasSKU5');
        //     $table->dropColumn('DeclaredValue');
        //     $table->dropColumn('CountryOrigin');
        //     $table->dropColumn('TariffCode');
        // });
    }
};
