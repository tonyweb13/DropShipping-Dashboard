<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ClientProducts;

class Products extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ClientProducts::create([
            'SKU' => 'short-estrada-real-medal',
            'ProductAlias' => 'SERM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Short Estrada Real Medal',
            'Location'=> '919 Wild Rose Street',
            'Weight' => 23,
            'Length' => 100,
            'Height' => 23,
            'Width' => 25,
            'ProductAlias' => 'Short Estrada Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'short-real-medal',
            'ProductAlias' => 'SRM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Short Real Medal',
            'Location'=> '4927 Goodwin Avenue',
            'Weight' => 43,
            'Length' => 190,
            'Height' => 39,
            'Width' => 39,
            'ProductAlias' => 'Short Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'long-estrada-real-medal',
            'ProductAlias' => 'LERM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Long Estrada Real Medal',
            'Location'=> '4323 Green Street',
            'Weight' => 24,
            'Length' => 101,
            'Height' => 38,
            'Width' => 38,
            'ProductAlias' => 'Long Estrada Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'long-real-medal',
            'ProductAlias' => 'LRM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Long Real Medal',
            'Location'=> '3176 Davis Court',
            'Weight' => 25,
            'Length' => 102,
            'Height' => 37,
            'Width' => 37,
            'ProductAlias' => 25456,
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'selected-estrada-real-medal',
            'ProductAlias' => 'SERM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Selected Estrada Real Medal',
            'Location'=> '3440 May Street',
            'Weight' => 26,
            'Length' => 103,
            'Height' => 36,
            'Width' => 36,
            'ProductAlias' => 'Selected Estrada Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'cut-wat-medal',
            'ProductAlias' => 'CWM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Cut Wat Medal',
            'Location'=> '2886 Garrett Street',
            'Weight' => 27,
            'Length' => 104,
            'Height' => 35,
            'Width' => 35,
            'ProductAlias' => '2886 Garrett Street',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'well-medal',
            'ProductAlias' => 'WM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Well Medal',
            'Location'=> '2006 Garrett Street',
            'Weight' => 28,
            'Length' => 105,
            'Height' => 34,
            'Width' => 34,
            'ProductAlias' => 'Well Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'short-medal',
            'ProductAlias' => 'SM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Short Medal',
            'Location'=> '0886 Garretting Street',
            'Weight' => 29,
            'Length' => 106,
            'Height' => 33,
            'Width' => 33,
            'ProductAlias' => 'Short Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'you-wat-medal',
            'ProductAlias' => 'YWM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'You Wat Medal',
            'Location'=> '2195 Tecumsah Lane',
            'Weight' => 30,
            'Length' => 107,
            'Height' => 32,
            'Width' => 32,
            'ProductAlias' => 'You Wat Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'most-estrada-real-medal',
            'ProductAlias' => 'MERM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Most Estrada Real Medal',
            'Location'=> '654 Wexford Way',
            'Weight' => 31,
            'Length' => 108,
            'Height' => 31,
            'Width' => 31,
            'ProductAlias' => 'Most Estrada Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'short-socorro-medal',
            'ProductAlias' => 'SSM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Short Socorro Medal',
            'Location'=> '1327 Roosevelt Road',
            'Weight' => 32,
            'Length' => 109,
            'Height' => 30,
            'Width' => 30,
            'ProductAlias' => 'Short Socorro Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'ambiance-real-medal',
            'ProductAlias' => 'ARM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Ambiance Real Medal',
            'Location'=> '2867 Simpson Street',
            'Weight' => 33,
            'Length' => 110,
            'Height' => 29,
            'Width' => 29,
            'ProductAlias' => 'Ambiance Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'medium-gonzae-real-medal',
            'ProductAlias' => 'MGRM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Medium Gonza Real Medal',
            'Location'=> '261 Ocello Street',
            'Weight' => 34,
            'Length' => 111,
            'Height' => 28,
            'Width' => 28,
            'ProductAlias' => 'Medium Gonza Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'light-cut-medal',
            'ProductAlias' => 'LCM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Light Cut Medal',
            'Location'=> '3746 Reynolds Alley',
            'Weight' => 35,
            'Length' => 112,
            'Height' => 27,
            'Width' => 27,
            'ProductAlias' => 'Light Cut Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'way-real-medal',
            'ProductAlias' => 'WRM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Way Real Medal',
            'Location'=> '4537 Tree Top Lane',
            'Weight' => 36,
            'Length' => 113,
            'Height' => 26,
            'Width' => 26,
            'ProductAlias' => 'Way Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'jumbor-moa-medal',
            'ProductAlias' => 'JMM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Jumbo Moa Medal',
            'Location'=> '261 Ocello Street',
            'Weight' => 37,
            'Length' => 114,
            'Height' => 25,
            'Width' => 25,
            'ProductAlias' => 'Jumbo Moa Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'light-copper-medal',
            'ProductAlias' => 'LCM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Light Copper Medal',
            'Location'=> '119 Heavner Court',
            'Weight' => 38,
            'Length' => 115,
            'Height' => 24,
            'Width' => 24,
            'ProductAlias' => 'Light Copper Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'upper-real-medal',
            'ProductAlias' => 'URM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Upper Real Medal',
            'Location'=> '652 Hidden Valley Road',
            'Weight' => 39,
            'Length' => 116,
            'Height' => 23,
            'Width' => 23,
            'ProductAlias' => 'Upper Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'down-estrada-real-medal',
            'ProductAlias' => 'DERM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'Down Estrada Real Medal',
            'Location'=> '1921 Airplane Avenue',
            'Weight' => 40,
            'Length' => 117,
            'Height' => 22,
            'Width' => 22,
            'ProductAlias' => 'Down Estrada Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
        ClientProducts::create([
            'SKU' => 'up-real-medal',
            'ProductAlias' => 'URM',
            'ProductGroup' => 'Standard',
            'ProductName' => 'up Real Medal',
            'Location'=> '2052 Liberty Street',
            'Weight' => 41,
            'Length' => 118,
            'Height' => 21,
            'Width' => 21,
            'ProductAlias' => 'up Real Medal',
            'CountryOfOrigin' => 'US',
            'StoreID' => 999723,
        ]);
    }
}
