<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Lib\Helper;
use Revolution\Google\Sheets\Facades\Sheets;
use Illuminate\Http\ResponseTrait;
use App\Models\Orders;
use App\Models\HeldOrders;
use App\Models\OpenOrders;
use App\Models\Stores;
use App\Models\Inventory;
use App\Models\InventoryDates;
use App\Models\InventoryCount;
use App\Models\GeneralSettings;
use App\Models\Pricing;
use App\Models\ProductCounts;
use App\Models\CustomerSettings;

class UserDashboardController extends Controller
{
    use ResponseTrait;

    public $helper;

    public function __construct()
    {
        $this->helper = new Helper();
    }

    public function getOpenOrdersData(Request $request)
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;
            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;
            $store_ids = $storeinfo->store_ids;

            $openorders = GeneralSettings::where('option_name', 'openorders_googlesheet_id')->first();
            $openorders_option_value = !empty($openorders) ? $openorders->option_value : '1Pjr8zKoI21kgmBNr68W0MS49QLeW_jp1grUJvehiI5o';

            $data = Sheets::spreadsheet($openorders_option_value)->sheet($storename)->all();

            $storeids = explode(',', $store_ids);
            OpenOrders::where('Source', 'sheet')
                ->whereIn('StoreID', $storeids)
                ->delete();

            foreach ($data as $key => $sheetdata) :
                if ($key >= 2) :
                    $explodedate = explode('/', $sheetdata[2]);
                    $year = $explodedate[2];
                    $month = $explodedate[0];
                    $day = $explodedate[1];

                    $dateformat = $year . '-' . $month . '-' . $day;
                    $order_date = date('Y-m-d', strtotime($dateformat));

                    // Check if exist then remove
                    OpenOrders::where('OrderNumber', $sheetdata[0])->whereIn('StoreID', $storeids)->delete();
                    $orders = HeldOrders::create([
                        'Rundate' => date('Y-m-d H:i:s'),
                        'StoreID' => $storeids[0],
                        'StoreName' => $storename,
                        'OrderNumber' => $sheetdata[0],
                        'OrderDate' => $order_date,
                        'OrderAge' => $sheetdata[1],
                        'CustomerName' => $sheetdata[7],
                        'Status' => 'Bad Address',
                        'Source' => 'sheet'
                    ]);
                endif;
            endforeach;

            // Save last sync date and time
            $key_per_country = 'openorders_' . $country_store . '_sync_date';
            $held_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();
            if (!empty($held_sync_date)) {
                CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->update([
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $userid,
                    'option_name' => $key_per_country,
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            }
        } else {
            echo 'Please login';
        }
    }

    public function getHeldData(Request $request)
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;
            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;
            $store_ids = $storeinfo->store_ids;

            $held = GeneralSettings::where('option_name', 'held_googlesheet_id')->first();
            $held_option_value = !empty($held) ? $held->option_value : '1Z0Fpjt0ud5tJI8XF_PFPXg7M36bIAEXRRc3MR1U7rqg';
            if ($country_store == 'UK') {
                $held_option_value = '1KD_udzkOqL5OnP-9jf3xihYEF_SMkfukJic5Wx6GFY8';
            }

            $data = Sheets::spreadsheet($held_option_value)->sheet($storename)->all();

            $storeids = explode(',', $store_ids);
            HeldOrders::where('Source', 'sheet')
                ->whereIn('StoreID', $storeids)
                ->delete();

            foreach ($data as $key => $sheetdata) :
                if ($key != 0) :
                    $explodedate = explode('/', $sheetdata[2]);
                    $year = $explodedate[2];
                    $month = $explodedate[0];
                    $day = $explodedate[1];

                    $dateformat = $year . '-' . $month . '-' . $day;
                    $order_date = date('Y-m-d', strtotime($dateformat));

                    // Check if exist then remove
                    HeldOrders::where('OrderNumber', $sheetdata[0])->whereIn('StoreID', $storeids)->delete();
                    $orders = HeldOrders::create([
                        'Rundate' => date('Y-m-d H:i:s'),
                        'StoreID' => $storeids[0],
                        'StoreName' => $storename,
                        'OrderNumber' => $sheetdata[0],
                        'OrderDate' => $order_date,
                        'OrderAge' => $sheetdata[1],
                        'CustomerName' => $sheetdata[7],
                        'Status' => 'Bad Address',
                        'Source' => 'sheet'
                    ]);
                endif;
            endforeach;

            // Save last sync date and time
            $key_per_country = 'held_' . $country_store . '_sync_date';
            $held_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();
            if (!empty($held_sync_date)) {
                CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->update([
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $userid,
                    'option_name' => $key_per_country,
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            }
        } else {
            echo 'Please login';
        }
    }

    public function authCallback()
    {
        $data = Sheets::spreadsheet('1O_GcHt1-EAElKfEv8PIVkHm8QpvQf71qXbtVtuGTJdo')->sheet('The Conqueror')->all();

        echo "<pre> ";
        print_r($data);
        echo "</pre>";
    }
    public function getReturnsData(Request $request)
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;

            $getstartkey = !empty($request->startkey) ? $request->startkey : 1;
            $getendkey = !empty($request->endkey) ? $request->endkey : 10000;

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;

            $return = GeneralSettings::where('option_name', 'return_googlesheet_id')->first();
            $return_option_value = !empty($return) ? $return->option_value : '1O_GcHt1-EAElKfEv8PIVkHm8QpvQf71qXbtVtuGTJdo';

            $data = Sheets::spreadsheet($return_option_value)->sheet($storename)->all();
            $sheetdatares = [];

            Orders::where('order_type', 'Returns')
                ->where('store_id', $storeid)
                ->whereNull('status')
                ->delete();

            if ($getendkey > count($data)) {
                $getendkey = count($data);
            }
            for ($x = $getstartkey; $x < $getendkey; $x++) {
                $sheetdata = $data[$x];

                $sheetdatares[] = $sheetdata;

                $order_date = date('Y-m-d H:i:s', strtotime($sheetdata[0]));
                $postage_due = (!empty($sheetdata[13])) ? $sheetdata[13] : '';
                $billed_return = (!empty($sheetdata[14])) ? $sheetdata[14] : '';
                $archive_return = (!empty($sheetdata[15])) ? $sheetdata[15] : '';
                $returned_age = (!empty($sheetdata[16])) ? $sheetdata[16] : '';
                $notes_conqueror_only = (!empty($sheetdata[17])) ? $sheetdata[17] : '';
                $order_number = (!empty($sheetdata[2]) && $sheetdata[2] != '') ? $sheetdata[2] : 0;

                $orders = Orders::create([
                    'order_date' => $order_date,
                    'store_id' => $storeid,
                    'return_store_id' => $sheetdata[1],
                    'order_number' => $order_number,
                    'tracking_number' => $sheetdata[3],
                    'shipping_country' => $sheetdata[4],
                    'buyer_name' => $sheetdata[5],
                    'buyer_street_number' => $sheetdata[6],
                    'buyer_postal_code' => $sheetdata[7],
                    'packing_condition' => $sheetdata[8],
                    'item_condition' => $sheetdata[9],
                    'photo_upload' => $sheetdata[10],
                    'return_notes' => $sheetdata[11],
                    'no_items_returned' => $sheetdata[12],
                    'postage_due' => $postage_due,
                    'billed_return' => $billed_return,
                    'archive_return' => $archive_return,
                    'returned_age' => $returned_age,
                    'notes_conqueror_only' => $notes_conqueror_only,
                    'order_type' => 'Returns'
                ]);
            }

            // Save last sync date and time
            $key_per_country = 'return_' . $country_store . '_sync_date';
            $return_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();
            if (!empty($return_sync_date)) {
                CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->update([
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $userid,
                    'option_name' => $key_per_country,
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            }
        } else {
            echo 'Please login';
        }
    }
    public function getMasterInventoryData()
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;

            $inventory_googlesheet = GeneralSettings::where('option_name', 'inventory_googlesheet_id')->first();
            $inventory_option_value = !empty($inventory_googlesheet) ? $inventory_googlesheet->option_value : '1Tidlg17fnYX-r0R_cjrSr0loO8PzFikHbPqVV3lngs4';
            if ($country_store == 'UK') {
                $inventory_option_value = '19mqbrDFLV0IuqxkrblAZT__I3m2DZPsilL3xY9fuk7I';
            }

            $data = Sheets::spreadsheet($inventory_option_value)->sheet($storename)->all();
            // Save Inventory
            if (!empty($data)) {
                // get year var
                $yeararray = [];
                foreach ($data[0] as $key => $yeardata) :
                    if (trim($yeardata) != '')
                        $yeararray[$key] = $yeardata;
                endforeach;
                // get month day var
                $mon_days_array = [];
                foreach ($data[1] as $key => $daymondata) :
                    if (trim($daymondata) != '')
                        $mon_days_array[$key] = $daymondata;
                endforeach;

                //combine date arrays
                // Get list of dates
                $dates = [];
                $fulldatesarray = [];
                foreach ($yeararray as $key => $ydata) :
                    if (trim($ydata) != '') :
                        $datestring = $mon_days_array[$key] . ' ' . $ydata;
                        $fdateformat = date('Y-m-d', strtotime($datestring));
                        $inventorydate = InventoryDates::where('date', $fdateformat)->where('date_key', $key)->where('date_type', 'stock')->first();
                        if (empty($inventorydate)) {
                            $inventorydate = InventoryDates::create([
                                'date_key' => $key,
                                'date_type' => 'stock',
                                'date' => $fdateformat,
                            ]);
                        }
                        $dates[$key] = $inventorydate->id;
                        $fulldatesarray[$key] = $fdateformat;
                    endif;
                endforeach;

                foreach ($data as $key => $sheetdata) :
                    if ($key >= 3) :
                        // end here for empty row
                        if (count($data[$key]) <= 0) {
                            break;
                        }

                        $ship_order_data = [];
                        $ship_order_datafeb28 = [];
                        foreach ($fulldatesarray as $dkey => $fdateformat) :
                            if (isset($sheetdata[$dkey]) && $sheetdata[$dkey] > 0) :
                                $ship_order_data[$fdateformat] = $sheetdata[$dkey];
                                if ($fdateformat > '2022-02-28') :
                                    $ship_order_datafeb28[$fdateformat] = $sheetdata[$dkey];
                                endif;
                            endif;
                        endforeach;

                        $inventory = Inventory::where('store_id', $storeid)->where('sku', $sheetdata[3])->first();
                        $inventory_count = !empty($sheetdata[9]) ? $sheetdata[9] : 0;
                        if (!empty($inventory)) {
                            Inventory::where('store_id', $storeid)->where('sku', $sheetdata[3])->update([
                                'title' => $sheetdata[1],
                                'code_alias' => $sheetdata[4],
                                'amount' => 0,
                                'inventory_count' => $inventory_count,
                                'ship_order_data' => ''
                            ]);
                        } else {
                            $inventory = Inventory::create([
                                'store_id' => $storeid,
                                'user_id' => $userid,
                                'product_type' => 'stock',
                                'title' => $sheetdata[1],
                                'code_alias' => $sheetdata[4],
                                'sku' => $sheetdata[3],
                                'amount' => 0,
                                'inventory_count' => $inventory_count,
                                'ship_order_data' => serialize($ship_order_data)
                            ]);
                        }

                        if (!empty($sheetdata)) :
                            foreach ($sheetdata as $shkey => $sheet) :
                                if ($shkey >= 10) :
                                    $inventorycount = InventoryCount::where('inventorydate_id', $dates[$shkey])->where('product_id', $inventory->id)->first();
                                    if (!empty($inventorycount)) {
                                        InventoryCount::whereId($inventorycount->id)->update([
                                            'count' => $sheet
                                        ]);
                                    } else {
                                        InventoryCount::create([
                                            'inventorydate_id' => $dates[$shkey],
                                            'product_id' => $inventory->id,
                                            'count' => $sheet
                                        ]);
                                    }
                                endif;
                            endforeach;
                        endif;

                    endif;
                endforeach;
            }

            // Save last sync date and time
            $key_per_country = 'masterinventory_' . $country_store . '_sync_date';
            $held_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();
            if (!empty($held_sync_date)) {
                CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->update([
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $userid,
                    'option_name' => $key_per_country,
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            }
        } else {
            echo 'Please login';
        }
    }

    public function getReceivingInventoryData()
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;

            $receiving_googlesheet = GeneralSettings::where('option_name', 'receiving_googlesheet_id')->first();
            $receiving_option_value = !empty($receiving_googlesheet) ? $receiving_googlesheet->option_value : '1v4duwzTNa3SXrmeMYfWwSaTdn0vTjPoI2GwjSvpu-1M';
            if ($country_store == 'UK') {
                $receiving_option_value = '1Be_DTE029t6NGdpZcPf1SJ7wX5dNsBFrR23AjRojL18';
            }

            $data = Sheets::spreadsheet($receiving_option_value)->sheet($storename)->all();

            // Save Inventory
            if (!empty($data)) {

                // Get list of dates
                $dates = [];
                foreach ($data[1] as $key => $label) {
                    // Save inventory dates
                    if ($key >= 9) :
                        $fdateformat = date('Y-m-d', strtotime($label));
                        $dates[$key] = $fdateformat;
                    endif;
                }

                foreach ($data as $key => $sheetdata) {
                    if ($key >= 2) :
                        if (count($data[$key]) <= 0) {
                            break;
                        }

                        $inventory = Inventory::where('store_id', $storeid)->where('product_type', 'receiving')->where('sku', $sheetdata[3])->first();
                        if (!empty($inventory)) {
                            Inventory::where('store_id', $storeid)->where('product_type', 'receiving')->where('sku', $sheetdata[3])->update([
                                'title' => $sheetdata[1]
                            ]);
                        } else {
                            $inventory = Inventory::create([
                                'store_id' => $storeid,
                                'user_id' => $userid,
                                'product_type' => 'receiving',
                                'title' => $sheetdata[1],
                                'code_alias' => '',
                                'sku' => $sheetdata[3],
                                'amount' => 0,
                                'inventory_count' => 0,
                                'ship_order_data' => ''
                            ]);
                        }

                        if (!empty($sheetdata)) :
                            foreach ($sheetdata as $shkey => $sheet) :
                                if ($shkey >= 9 && !empty($sheetdata[$shkey])) :
                                    $productcount = ProductCounts::where('date', $dates[$shkey])->where('product_id', $inventory->id)->first();

                                    // Get status per date
                                    $status = NULL;
                                    if (strtotime($dates[$shkey]) <= strtotime('2022-06-17')) {
                                        $status = 'Approved';
                                    }

                                    if (!empty($productcount)) {
                                        $status = $productcount->status;
                                        ProductCounts::whereId($productcount->id)->update([
                                            'count' => $sheet,
                                            'status' => $status
                                        ]);
                                    } else {
                                        ProductCounts::create([
                                            'product_id' => $inventory->id,
                                            'date' => $dates[$shkey],
                                            'status' => $status,
                                            'count' => $sheet
                                        ]);
                                    }
                                endif;
                            endforeach;
                        endif;
                    endif;
                }
            }

            // Save last sync date and time
            $key_per_country = 'receiving_' . $country_store . '_sync_date';
            $held_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();
            if (!empty($held_sync_date)) {
                CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->update([
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $userid,
                    'option_name' => $key_per_country,
                    'option_value' => date('Y-m-d H:i:s')
                ]);
            }
        } else {
            echo 'Please login';
        }
    }

    public function getDelayedData()
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;

            $delayed = GeneralSettings::where('option_name', 'delayed_googlesheet_id')->first();
            $delayed_option_value = !empty($delayed) ? $delayed->option_value : '1-vLn8bI4_0oVhqtkeKDhvVK2wb0vaG43WLXICHIOFpQ';

            Orders::where('order_type', 'Delayed')
                ->where('store_id', $storeid)
                ->delete();

            $data = Sheets::spreadsheet($delayed_option_value)->sheet($storename)->all();
            foreach ($data as $key => $sheetdata) :
                if ($key >= 7) :

                    $order_number = $sheetdata[0];
                    $shipping_date = date('Y-m-d H:i:s', strtotime($sheetdata[3]));

                    $orders = Orders::create([
                        'order_number' => $order_number,
                        'store_id' => $storeid,
                        'email' => $sheetdata[1],
                        'shipping_date' => $shipping_date,
                        'shipping_country' => $sheetdata[4],
                        'carrier' => $sheetdata[5],
                        'service_used' => $sheetdata[6],
                        'tracking_number' => $sheetdata[8],
                        'delivery_status' => $sheetdata[9],
                        'order_age' => intval($sheetdata[10]),
                        'tracking_link' => $sheetdata[12],
                        'skus' => $sheetdata[7],
                        'order_type' => 'Delayed'
                    ]);
                endif;
            endforeach;
        } else {
            echo 'Please login';
        }
    }

    public function getPricingUStoUS()
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;

            $pricing_array = [];
            // $data = Sheets::spreadsheet('1Du_zLlxoVroZXcB7c8dV57XoposbhHqHM6DhWubHIBU')->sheet($storename)->all(); old spreadsheet
            $data = Sheets::spreadsheet('1vxHdfDTL8fIvXOebv9T73IIrTKONcPavSNPWCgNToPw')->sheet($storename)->all();

            foreach ($data as $key => $sheetdata) :
                $delivery1 =  $data[2][1];
                $delivery2 =  $data[2][5];
                $delivery3 =  $data[2][9];
                $delivery4 =  $data[2][13];

                if ($key >= 4) {
                    // Next day Shipping
                    if (!empty($sheetdata[1])) {
                        $pricing_array['Economy_Shipping']['weight'][] = $sheetdata[1];
                        $pricing_array['Economy_Shipping']['units'][] = $sheetdata[2];
                        $filterprice = filter_var($sheetdata[3], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Economy_Shipping']['price'][] = $filterprice;
                    }

                    // Expedited Shipping
                    if (!empty($sheetdata[5])) {
                        $pricing_array['Standard_Shipping']['weight'][] = $sheetdata[5];
                        $pricing_array['Standard_Shipping']['units'][] = $sheetdata[6];
                        $filterprice = filter_var($sheetdata[7], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Standard_Shipping']['price'][] = $filterprice;
                    }

                    // Standard Shipping
                    if (!empty($sheetdata[9])) :
                        $pricing_array['Expedited_Shipping']['weight'][] = $sheetdata[9];
                        $pricing_array['Expedited_Shipping']['units'][] = $sheetdata[10];
                        $filterprice = filter_var($sheetdata[11], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Expedited_Shipping']['price'][] = $filterprice;
                    endif;

                    // Economy Shipping
                    if (!empty($sheetdata[13])) :
                        $pricing_array['Next_Day_Shipping']['weight'][] = $sheetdata[13];
                        $pricing_array['Next_Day_Shipping']['units'][] = $sheetdata[14];
                        $filterprice = filter_var($sheetdata[15], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Next_Day_Shipping']['price'][] = $filterprice;
                    endif;
                }
            endforeach;
            // echo "<pre> Economy_Shipping";
            // print_r($pricing_array['Economy_Shipping']);
            // echo "</pre>";
            // exit;
            $pricing_type = "US to US Pricing";
            Pricing::where('pricing_type', $pricing_type)
                ->where('store_id', $storeid)
                ->delete();

            foreach ($pricing_array as $key => $byshipping) :
                $pricing_shipping = str_replace('_', ' ', $key);
                for ($i = 0; $i < count($byshipping['weight']); $i++) {
                    $weight = $byshipping['weight'][$i];
                    $units = $byshipping['units'][$i];
                    $price = $byshipping['price'][$i];
                    $pricing = Pricing::create([
                        'store_id' => $storeid,
                        'pricing_type' => $pricing_type,
                        'pricing_shipping' => $pricing_shipping,
                        'pricing_delivery' => '',
                        'pricing_weight' => $weight,
                        'pricing_units' => $units,
                        'price' => $price
                    ]);
                }
            endforeach;
        } else {
            echo 'Please login';
        }
    }

    public function getPricingUStoNonUS()
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;

            $pricing_array = [];
            // $data = Sheets::spreadsheet('1Du_zLlxoVroZXcB7c8dV57XoposbhHqHM6DhWubHIBU')->sheet($storename)->all();
            $data = Sheets::spreadsheet('1vxHdfDTL8fIvXOebv9T73IIrTKONcPavSNPWCgNToPw')->sheet($storename)->all();

            foreach ($data as $key => $sheetdata) :
                $delivery1 =  $data[2][17];
                $delivery2 =  $data[2][21];
                $delivery3 =  $data[2][25];
                $delivery4 =  $data[2][29];
                // $delivery5 =  $data[2][33];
                if ($key >= 4) :

                    // store data by array pero shipping column                        
                    // for us to us Economy shipping
                    if (!empty($sheetdata[17])) :
                        $pricing_array['Economy']['weight'][] = $sheetdata[17];
                        $pricing_array['Economy']['units'][] = $sheetdata[18];
                        $filterprice = filter_var($sheetdata[19], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Economy']['price'][] = $filterprice;
                    endif;

                    // for us to us Standard shipping
                    if (!empty($sheetdata[21])) :
                        $pricing_array['Standard']['weight'][] = $sheetdata[21];
                        $pricing_array['Standard']['units'][] = $sheetdata[22];
                        $filterprice = filter_var($sheetdata[23], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Standard']['price'][] = $filterprice;
                    endif;

                    // for us to us expedited shipping
                    if (!empty($sheetdata[25])) :
                        $pricing_array['Expedited']['weight'][] = $sheetdata[25];
                        $pricing_array['Expedited']['units'][] = $sheetdata[26];
                        $filterprice = filter_var($sheetdata[27], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Expedited']['price'][] = $filterprice;
                    endif;

                    // for us to us Canada shipping
                    if (!empty($sheetdata[29])) :
                        $pricing_array['Canada']['weight'][] = $sheetdata[29];
                        $pricing_array['Canada']['units'][] = $sheetdata[30];
                        $filterprice = filter_var($sheetdata[31], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Canada']['price'][] = $filterprice;
                    endif;

                // for us to us Mexico shipping
                // if(!empty($sheetdata[33])):
                //     $pricing_array['Mexico']['weight'][] = $sheetdata[33];
                //     $pricing_array['Mexico']['units'][] = $sheetdata[34];
                //     $filterprice = filter_var($sheetdata[35], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                //     $pricing_array['Mexico']['price'][] = $filterprice;
                // endif;
                endif;
            endforeach;
            // echo "<pre> Economy";
            // print_r($pricing_array['Economy']);
            // echo "</pre>";
            // exit;
            $pricing_type = "US to Non-US Pricing";
            Pricing::where('pricing_type', $pricing_type)
                ->where('store_id', $storeid)
                ->delete();

            foreach ($pricing_array as $key => $byshipping) :
                if ($key != 'Canada' && $key != "Mexico") {
                    $pricing_shipping = $key . ' Shipping';
                } else {
                    // $pricing_shipping = ($key=='Canada')?$delivery1:$delivery2;
                    $pricing_shipping = ($key == 'Canada') ? $delivery4 : '';
                }

                for ($i = 0; $i < count($byshipping['weight']); $i++) {
                    $weight = $byshipping['weight'][$i];
                    $units = $byshipping['units'][$i];
                    $price = $byshipping['price'][$i];

                    $pricing = Pricing::create([
                        'store_id' => $storeid,
                        'pricing_type' => $pricing_type,
                        'pricing_shipping' => $pricing_shipping,
                        'pricing_delivery' => '',
                        'pricing_weight' => $weight,
                        'pricing_units' => $units,
                        'price' => $price
                    ]);
                }
            endforeach;
        } else {
            echo 'Please login';
        }
    }
    public function getPricingUKtoUK()
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;

            // $return = GeneralSettings::where('option_name', 'return_googlesheet_id')->first();
            // $return_option_value = !empty($return)?$return->option_value:'1O_GcHt1-EAElKfEv8PIVkHm8QpvQf71qXbtVtuGTJdo';

            $pricing_array = [];
            $data = Sheets::spreadsheet('1iHXwBJxRXIr53PkSc00jaeG45IVvY7J0ImanPxXaybM')->sheet('UK to UK Pricing')->all();
            foreach ($data as $key => $sheetdata) :
                $delivery1 =  $data[1][1];
                $delivery2 =  $data[1][5];
                $shippingtext1 =  $data[0][1];
                $shippingtext2 =  $data[0][5];
                if ($key >= 3) :

                    // store data by array pero shipping column                        
                    // for uk to uk shipping1
                    if (!empty($sheetdata[1])) :
                        $pricing_array['Uk1']['weight'][] = $sheetdata[1];
                        $pricing_array['Uk1']['units'][] = $sheetdata[2];
                        $filterprice = filter_var($sheetdata[3], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Uk1']['price'][] = $filterprice;
                    endif;

                    // for uk to uk shipping2
                    if (!empty($sheetdata[5])) :
                        $pricing_array['Uk2']['weight'][] = $sheetdata[5];
                        $pricing_array['Uk2']['units'][] = $sheetdata[6];
                        $filterprice = filter_var($sheetdata[7], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['Uk2']['price'][] = $filterprice;
                    endif;
                endif;
            endforeach;

            $pricing_type = "UK to UK Pricing";
            Pricing::where('pricing_type', $pricing_type)
                ->where('store_id', $storeid)
                ->delete();
            foreach ($pricing_array as $key => $byshipping) :

                $pricing_shipping = ($key == 'Uk1') ? $shippingtext1 : $shippingtext2;
                $pricing_delivery = ($key == 'Uk1') ? $delivery1 : $delivery2;

                for ($i = 0; $i < count($byshipping['weight']); $i++) {
                    $weight = $byshipping['weight'][$i];
                    $units = $byshipping['units'][$i];
                    $price = $byshipping['price'][$i];

                    $pricing = Pricing::create([
                        'store_id' => $storeid,
                        'pricing_type' => $pricing_type,
                        'pricing_shipping' => $pricing_shipping,
                        'pricing_delivery' => $pricing_delivery,
                        'pricing_weight' => $weight,
                        'pricing_units' => $units,
                        'price' => $price
                    ]);
                }
            endforeach;

            echo "<pre> ";
            print_r($data);
            echo "</pre>";
        } else {
            echo 'Please login';
        }
    }
    public function getPricingUKtoEU()
    {
        $userinfo = Auth::user();
        if (!empty($userinfo)) {
            $userid = $userinfo->id;

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }
            $customer_id = session('customer_id');
            if (!empty($customer_id)) {
                $userid = $customer_id;
            }
            $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
            $storename = $storeinfo->store_name;
            $storeid = $storeinfo->id;

            // $return = GeneralSettings::where('option_name', 'return_googlesheet_id')->first();
            // $return_option_value = !empty($return)?$return->option_value:'1O_GcHt1-EAElKfEv8PIVkHm8QpvQf71qXbtVtuGTJdo';

            $pricing_array = [];
            $data = Sheets::spreadsheet('1iHXwBJxRXIr53PkSc00jaeG45IVvY7J0ImanPxXaybM')->sheet('UK to EU Pricing')->all();
            foreach ($data as $key => $sheetdata) :
                $delivery1 =  $data[1][1];
                $delivery2 =  $data[1][5];
                $shippingtext1 =  $data[0][1];
                $shippingtext2 =  $data[0][5];
                if ($key >= 3) :

                    // store data by array pero shipping column                        
                    // for uk to eu shipping1
                    if (!empty($sheetdata[1])) :
                        $pricing_array['UkEu1']['weight'][] = $sheetdata[1];
                        $pricing_array['UkEu1']['units'][] = $sheetdata[2];
                        $filterprice = filter_var($sheetdata[3], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['UkEu1']['price'][] = $filterprice;
                    endif;

                    // for uk to eu shipping2
                    if (!empty($sheetdata[5])) :
                        $pricing_array['UkEu2']['weight'][] = $sheetdata[5];
                        $pricing_array['UkEu2']['units'][] = $sheetdata[6];
                        $filterprice = filter_var($sheetdata[7], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        $pricing_array['UkEu2']['price'][] = $filterprice;
                    endif;
                endif;
            endforeach;


            echo "<pre> ";
            print_r($pricing_array);
            echo "</pre>";
            // saving data after storing all data to array
            $pricing_type = "UK to EU Pricing";
            Pricing::where('pricing_type', $pricing_type)
                ->where('store_id', $storeid)
                ->delete();
            foreach ($pricing_array as $key => $byshipping) :

                $pricing_shipping = ($key == 'UkEu1') ? $shippingtext1 : $shippingtext2;
                $pricing_delivery = ($key == 'UkEu1') ? $delivery1 : $delivery2;

                for ($i = 0; $i < count($byshipping['weight']); $i++) {
                    $weight = $byshipping['weight'][$i];
                    $units = $byshipping['units'][$i];
                    $price = $byshipping['price'][$i];
                    // echo "<pre> ";
                    // print_r($pricing_shipping);
                    // print_r($pricing_delivery);
                    // print_r($weight);
                    // print_r($units);
                    // print_r($price);
                    // echo "</pre>";

                    $pricing = Pricing::create([
                        'store_id' => $storeid,
                        'pricing_type' => $pricing_type,
                        'pricing_shipping' => $pricing_shipping,
                        'pricing_delivery' => $pricing_delivery,
                        'pricing_weight' => $weight,
                        'pricing_units' => $units,
                        'price' => $price
                    ]);
                }
            endforeach;

            echo "<pre> ";
            print_r($data);
            echo "</pre>";
        } else {
            echo 'Please login';
        }
    }
}
