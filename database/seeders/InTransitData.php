<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\InTransit;

class InTransitData extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 2317211,
            'OrderDate' => '2023-04-25',
            'ShipDate' => '2023-04-30',
            'CustomerEmail' => "vonej77633@themesw.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "9400511108296742375725",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-30",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 2317222,
            'OrderDate' => '2023-04-25',
            'ShipDate' => '2023-04-30',
            'CustomerEmail' => "mixeevsergey@asifboot.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "9066666323446778892322",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-30",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 2317233,
            'OrderDate' => '2023-04-26',
            'ShipDate' => '2023-04-31',
            'CustomerEmail' => "jpahlmann@luddo.me",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "long-estrada-real-medal",
            'TrackingNumber' => "9400511108296742375725",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 9,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-31",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 2317244,
            'OrderDate' => '2023-04-26',
            'ShipDate' => '2023-04-31',
            'CustomerEmail' => "olegluniv@waitloek.fun",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "long-estrada-real-medal",
            'TrackingNumber' => "234444555567345341111100",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 9,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-31",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 2317255,
            'OrderDate' => '2023-04-26',
            'ShipDate' => '2023-04-31',
            'CustomerEmail' => "vonej77633@themesw.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "80004566634232235677889",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 9,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-31",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 2317066,
            'OrderDate' => '2023-04-27',
            'ShipDate' => '2023-05-05',
            'CustomerEmail' => "bobabong@koin-qq.top",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "cut-wat-medal",
            'TrackingNumber' => "565666633453452770000",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 8,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-05",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 2317077,
            'OrderDate' => '2023-04-27',
            'ShipDate' => '2023-05-05',
            'CustomerEmail' => "marishkaa@herbalsumbersehat.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "well-medal",
            'TrackingNumber' => "45345454777899989000",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 8,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-05",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 2317088,
            'OrderDate' => '2023-04-27',
            'ShipDate' => '2023-05-05',
            'CustomerEmail' => "saint82@54.mk",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "676768885675673334",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 8,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-05",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 2317099,
            'OrderDate' => '2023-04-25',
            'ShipDate' => '2023-05-05',
            'CustomerEmail' => "caula@isartegiovagnoli.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "345345345678888880005",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 8,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-05",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23171050,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "alegotina@hotmail.red",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "real-medal",
            'TrackingNumber' => "09886789000023331044",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23171111,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "vladislawvladimirov@pickuplanet.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "real-medal",
            'TrackingNumber' => "4545454333404304398",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23170404,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "wintur@bentsgolf.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-medal",
            'TrackingNumber' => "20009382174599006066655",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23171313,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "shanecarty@uapemail.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-medal",
            'TrackingNumber' => "666354333256600002315",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23171414,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "poligrafist88@gasss.us",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-real-medal",
            'TrackingNumber' => "444555645645645622111",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23171515,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "lostduck@ikanchana.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-real-medal",
            'TrackingNumber' => "1104220009574888222",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23171616,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "olegshirejko@tipsehat.click",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "long-real-medal",
            'TrackingNumber' => "444333566676767889000005",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23171717,
            'OrderDate' => '2023-04-29',
            'ShipDate' => '2023-05-03',
            'CustomerEmail' => "mariagirll@yt-google.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "long-real-medal",
            'TrackingNumber' => "555667676700877711",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-03",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23171818,
            'OrderDate' => '2023-04-29',
            'ShipDate' => '2023-05-03',
            'CustomerEmail' => "bartyx@crossfitcoastal.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "you-wat-medal",
            'TrackingNumber' => "9990006215684447",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-03",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23171919,
            'OrderDate' => '2023-04-29',
            'ShipDate' => '2023-05-03',
            'CustomerEmail' => "crakrjax@saxlift.us",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "you-wat-medal",
            'TrackingNumber' => "850002614888600533",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-03",
            'Source' => NULL
        ]);
        InTransit::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 23172020,
            'OrderDate' => '2023-04-29',
            'ShipDate' => '2023-05-03',
            'CustomerEmail' => "koketkaolia@myxl.live",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "you-wat-medal",
            'TrackingNumber' => "7895246300000435",
            'DeliveryStatus' => "In Transit",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-03",
            'Source' => NULL
        ]
        );
    }
}
