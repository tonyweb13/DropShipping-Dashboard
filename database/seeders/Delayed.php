<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DelayedOrders;

class Delayed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231741,
            'OrderDate' => '2023-04-25',
            'ShipDate' => '2023-04-30',
            'CustomerEmail' => "vonej@themesw.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "9999723108296742375725",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-30",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231742,
            'OrderDate' => '2023-04-25',
            'ShipDate' => '2023-04-30',
            'CustomerEmail' => "sergey@asifbooting.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "999723323446778892322",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-30",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231743,
            'OrderDate' => '2023-04-26',
            'ShipDate' => '2023-04-31',
            'CustomerEmail' => "jpahl4414@luddo.me",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "long-estrada-real-medal",
            'TrackingNumber' => "99972308296742375725",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 9,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-31",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231744,
            'OrderDate' => '2023-04-26',
            'ShipDate' => '2023-04-31',
            'CustomerEmail' => "oluniv525@waitloek.fun",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "long-estrada-real-medal",
            'TrackingNumber' => "999723555567345341111100",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 9,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-31",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231745,
            'OrderDate' => '2023-04-26',
            'ShipDate' => '2023-04-31',
            'CustomerEmail' => "vone7633@theme.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "99972366634232235677889",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 9,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-04-31",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231746,
            'OrderDate' => '2023-04-27',
            'ShipDate' => '2023-05-01',
            'CustomerEmail' => "bbong7877@koin-qq.top",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "cut-wat-medal",
            'TrackingNumber' => "999723633453452770000",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 8,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-01",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231747,
            'OrderDate' => '2023-04-27',
            'ShipDate' => '2023-05-01',
            'CustomerEmail' => "mari1332kaa@sumbersehat.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "well-medal",
            'TrackingNumber' => "9997234777899989000",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 8,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-01",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231748,
            'OrderDate' => '2023-04-27',
            'ShipDate' => '2023-05-01',
            'CustomerEmail' => "saint82@5yuo4.mkami",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "999723885675673334",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 8,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-01",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231749,
            'OrderDate' => '2023-04-25',
            'ShipDate' => '2023-05-01',
            'CustomerEmail' => "caula@4456giovagnoli.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-estrada-real-medal",
            'TrackingNumber' => "99972345678888880001",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 8,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-01",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231750,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "alegotina000@099mail.red",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "real-medal",
            'TrackingNumber' => "99972389000023331124",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231751,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "vladislaw3113v@pplanet.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "real-medal",
            'TrackingNumber' => "9997234333412312398",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231752,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "wintulopor@bents.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-medal",
            'TrackingNumber' => "99972382174599006066655",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231753,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "carty@poppemail.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-medal",
            'TrackingNumber' => "99972333256600002315",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231754,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "poligare4@gasssess.us",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-real-medal",
            'TrackingNumber' => "9997235645645622111",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231755,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "duck9898@ukchana.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "short-real-medal",
            'TrackingNumber' => "99972309574888222",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-01-02",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231756,
            'OrderDate' => '2023-04-28',
            'ShipDate' => '2023-05-02',
            'CustomerEmail' => "olegshi32665o@bunksehat.click",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "long-real-medal",
            'TrackingNumber' => "99972366676767889000001",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-02",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231757,
            'OrderDate' => '2023-04-29',
            'ShipDate' => '2023-05-03',
            'CustomerEmail' => "mariagir288@piu.google.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "long-real-medal",
            'TrackingNumber' => "99972376700877711",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 6,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-03",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231758,
            'OrderDate' => '2023-04-29',
            'ShipDate' => '2023-05-03',
            'CustomerEmail' => "bartyxy7@regcoastal.com",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "you-wat-medal",
            'TrackingNumber' => "99972306215684447",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-03",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231759,
            'OrderDate' => '2023-04-29',
            'ShipDate' => '2023-05-03',
            'CustomerEmail' => "cocsax@speellift.us",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "you-wat-medal",
            'TrackingNumber' => "99972314888600133",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-03",
            'Source' => NULL
        ]);
        DelayedOrders::create([
            'RunDate' => date('Y-m-d H:i:s'),
            'StoreID' => 999723,
            'StoreName' => 'The Company ABC',
            'OrderNumber' => 231760,
            'OrderDate' => '2023-04-29',
            'ShipDate' => '2023-05-03',
            'CustomerEmail' => "koketka777a@myxlym.live",
            'ShipCountry' => "US",
            'Carrier' => "USPS",
            'SKU' => "you-wat-medal",
            'TrackingNumber' => "9997236300001235",
            'DeliveryStatus' => "Delayed",
            'OrderAge' => 10,
            'LocalStatus' => "Shipped",
            'OnlineStatus' => "completed",
            'ProcessedDate' => "2023-05-03",
            'Source' => NULL
        ]
        );
    }
}
