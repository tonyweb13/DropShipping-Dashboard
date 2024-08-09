<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Mail\AppMail;
use App\Models\User;
use App\Models\Stores;
use App\Models\CustomerSettings;
use App\Models\GeneralSettings;
use App\Lib\Helper;

class CustomerController extends Controller
{
    public $helper;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->helper = new Helper();
    }

    /**
     * Get customer stores
     * @param user id
     * @return JSON stores
     * */
    public function customerStores(Request $request)
    {
        $stores = Stores::where('user_id', $request->ref)->get();
        if (!empty($stores)) {
            return response()->json([
                'success' => 1,
                'stores' => $stores
            ]);
        }
        return response()->json([
            'success' => 0
        ]);
    }

    /**
     * Get customer active blocks
     * @param NULL
     * @return JSON blocks
     * */
    public function customerBlocks()
    {
        $user = Auth::user();
        $id = $user->id;
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $id = $customer_id;
        }
        $wherefield = 'user_id';
        $whereid = $id;
        if ($user->is_admin != 2 && session('user_store_id') > 0) {
            $wherefield = 'store_id';
            $whereid = session('user_store_id');
        }
        $invoice = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'invoice')->first();
        $invoice_on = (!empty($invoice)) ? intval($invoice->option_value) : 0;

        $storage_cost = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'storage_cost')->first();
        $storage_cost_on = (!empty($storage_cost)) ? intval($storage_cost->option_value) : 0;

        $storage_calculator = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'storage_calculator')->first();
        $storage_calculator_on = (!empty($storage_calculator)) ? intval($storage_calculator->option_value) : 0;

        $openorders = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'openorders')->first();
        $openorders_on = (!empty($openorders)) ? intval($openorders->option_value) : 0;

        $delayed = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'delayed')->first();
        $delayed_on = (!empty($delayed)) ? intval($delayed->option_value) : 0;

        $returns = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'returns')->first();
        $returns_on = (!empty($returns)) ? intval($returns->option_value) : 0;

        $receiving = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'receiving')->first();
        $receiving_on = (!empty($receiving)) ? intval($receiving->option_value) : 0;

        $low_stock = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'low_stock')->first();
        $low_stock_on = (!empty($low_stock)) ? intval($low_stock->option_value) : 0;

        $no_stock = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'no_stock')->first();
        $no_stock_on = (!empty($no_stock)) ? intval($no_stock->option_value) : 0;

        $intransit = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'intransit')->first();
        $intransit_on = (!empty($intransit)) ? intval($intransit->option_value) : 0;

        return response()->json([
            'success' => 0,
            'invoice' => (!empty($invoice_on)) ? 'block' : 'none',
            'storage_cost' => (!empty($storage_cost_on)) ? 'block' : 'none',
            'storage_calculator' => (!empty($storage_calculator_on)) ? 'block' : 'none',
            'openorders' => (!empty($openorders_on)) ? 'block' : 'none',
            'delayed' => (!empty($delayed_on)) ? 'block' : 'none',
            'return' => (!empty($returns_on)) ? 'block' : 'none',
            'receiving' => (!empty($receiving_on)) ? 'block' : 'none',
            'low_stock' => (!empty($low_stock_on)) ? 'block' : 'none',
            'no_stock' => (!empty($no_stock_on)) ? 'block' : 'none',
            'intransit' => (!empty($intransit_on)) ? 'block' : 'none'
        ]);
    }

    /**
     * Set and select store
     * @param country
     * @return store information
     * */
    public function selectStore(Request $request)
    {
        $user = Auth::user();
        $country = $request->country;
        $request->session()->put('country_store', $country);
        $customer_id = session('customer_id');
        $userid = $user->id;
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        if ($user->is_admin == 2) {
            $storeinfo = Stores::where('user_id', $user->client_user_id)->where('country', $country)->first();
            $storeid = $storeinfo->id;
        } else {
            $storeinfo = Stores::where('user_id', $userid)->where('country', $country)->first();
            $storeid = $storeinfo->id;
        }
        $request->session()->put('user_store_id', $storeid);
        // quickbooks credentials
        $clientid = config('quickbooks.dynamic.client_id_us');
        $clientsecret = config('quickbooks.dynamic.client_secret_us');
        if ($country == 'UK') {
            $clientid = config('quickbooks.dynamic.client_id_uk');
            $clientsecret = config('quickbooks.dynamic.client_secret_uk');
        }

        $quickbooks_creds = array(
            'QUICKBOOKS_CLIENT_ID' => array(
                'configkey' => 'quickbooks.data_service.client_id',
                'newval' => $clientid
            ),
            'QUICKBOOKS_CLIENT_SECRET' => array(
                'configkey' => 'quickbooks.data_service.client_secret',
                'newval' => $clientsecret
            )
        );
        $wherefield = 'store_id';
        $whereid = $storeid;

        $open_orders = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'open_orders')->first();
        $open_orders_on = (!empty($open_orders)) ? intval($open_orders->option_value) : 0;

        $in_transit = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'in_transit')->first();
        $in_transit_on = (!empty($in_transit)) ? intval($in_transit->option_value) : 0;

        $delay_transit = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'delay_transit')->first();
        $delay_transit_on = (!empty($delay_transit)) ? intval($delay_transit->option_value) : 0;

        $invoicing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'invoicing')->first();
        $invoicing_on = (!empty($invoicing)) ? intval($invoicing->option_value) : 0;

        // $held_orders = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'held_orders')->first();
        // $held_orders_on = (!empty($held_orders))?intval($held_orders->option_value):0;

        $return_orders = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'return_orders')->first();
        $return_orders_on = (!empty($return_orders)) ? intval($return_orders->option_value) : 0;

        $receiving_inventory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'receiving_inventory')->first();
        $receiving_inventory_on = (!empty($receiving_inventory)) ? intval($receiving_inventory->option_value) : 0;

        $addshipment_inventory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'addshipment_inventory')->first();
        $addshipment_inventory_on = (!empty($addshipment_inventory)) ? intval($addshipment_inventory->option_value) : 0;

        $no_stock_inventory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'no_stock_inventory')->first();
        $no_stock_inventory_on = (!empty($no_stock_inventory)) ? intval($no_stock_inventory->option_value) : 0;

        $product_inventory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'product_inventory')->first();
        $product_inventory_on = (!empty($product_inventory)) ? intval($product_inventory->option_value) : 0;

        $ustous_pricing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'ustous_pricing')->first();
        $ustous_pricing_on = (!empty($ustous_pricing)) ? intval($ustous_pricing->option_value) : 0;

        $ustononus_pricing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'ustononus_pricing')->first();
        $ustononus_pricing_on = (!empty($ustononus_pricing)) ? intval($ustononus_pricing->option_value) : 0;

        $uktouk_pricing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'uktouk_pricing')->first();
        $uktouk_pricing_on = (!empty($uktouk_pricing)) ? intval($uktouk_pricing->option_value) : 0;

        $uktoeu_pricing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'uktoeu_pricing')->first();
        $uktoeu_pricing_on = (!empty($uktoeu_pricing)) ? intval($uktoeu_pricing->option_value) : 0;

        $safelist = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'safelist')->first();
        $safelist_on = (!empty($safelist)) ? intval($safelist->option_value) : 0;

        $edithistory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'edithistory')->first();
        $edithistory_on = (!empty($edithistory)) ? intval($edithistory->option_value) : 0;

        $reports = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'reports')->first();
        $reports_on = (!empty($reports)) ? intval($reports->option_value) : 0;

        $safelistshipments = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'safelistshipments')->first();
        $safelistshipments_on = (!empty($safelistshipments)) ? intval($safelistshipments->option_value) : 0;

        $uspsdelayedshipments = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'uspsdelayedshipments')->first();
        $uspsdelayedshipments_on = (!empty($uspsdelayedshipments)) ? intval($uspsdelayedshipments->option_value) : 0;

        $product_bundles = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'product_bundles')->first();
        $product_bundles_on = (!empty($product_bundles)) ? intval($product_bundles->option_value) : 0;

        $inventory_manager = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'inventory_manager')->first();
        $inventory_manager_on = (!empty($inventory_manager)) ? intval($inventory_manager->option_value) : 0;

        $add_receiving_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_receiving_button')->first();
        $add_receiving_button_on = (!empty($add_receiving_button)) ? intval($add_receiving_button->option_value) : 0;

        $add_shipments_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_shipments_button')->first();
        $add_shipments_button_on = (!empty($add_shipments_button)) ? intval($add_shipments_button->option_value) : 0;

        $add_product_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_product_button')->first();
        $add_product_button_on = (!empty($add_product_button)) ? intval($add_product_button->option_value) : 0;

        $add_bundle_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_bundle_button')->first();
        $add_bundle_button_on = (!empty($add_bundle_button)) ? intval($add_bundle_button->option_value) : 0;

        $wrongitemssent = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'wrongitemssent')->first();
        $wrongitemssent_on = (!empty($wrongitemssent)) ? intval($wrongitemssent->option_value) : 0;

        $dailyitemsdelivered = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'dailyitemsdelivered')->first();
        $dailyitemsdelivered_on = (!empty($dailyitemsdelivered)) ? intval($dailyitemsdelivered->option_value) : 0;

        $member_menu = array(
            'open_orders' => $open_orders_on,
            'in_transit' => $in_transit_on,
            'delay_transit' => $delay_transit_on,
            'invoicing' => $invoicing_on,
            // 'held_orders' => $held_orders_on,
            'return_orders' => $return_orders_on,
            'receiving_inventory' => $receiving_inventory_on,
            'addshipment_inventory' => $addshipment_inventory_on,
            'no_stock_inventory' => $no_stock_inventory_on,
            'product_inventory' => $product_inventory_on,
            'ustous_pricing' => $ustous_pricing_on,
            'ustononus_pricing' => $ustononus_pricing_on,
            'uktouk_pricing' => $uktouk_pricing_on,
            'uktoeu_pricing' => $uktoeu_pricing_on,
            'safelist' => $safelist_on,
            'edithistory' => $edithistory_on,
            'reports' => $reports_on,
            'safelistshipments' => $safelistshipments_on,
            'uspsdelayedshipments' => $uspsdelayedshipments_on,
            'product_bundles' => $product_bundles_on,
            'inventory_manager' => $inventory_manager_on,
            'add_receiving_button' => $add_receiving_button_on,
            'add_shipments_button' => $add_shipments_button_on,
            'add_product_button' => $add_product_button_on,
            'add_bundle_button' => $add_bundle_button_on,
            'wrongitemssent' => $wrongitemssent_on,
            'dailyitemsdelivered' => $dailyitemsdelivered_on
        );

        return response()->json([
            'success' => 1,
            'member_menu' => $member_menu
        ]);
        // $this->helper->updateDotEnv($quickbooks_creds);
    }

    /**
     * Get system information
     * @return JSON
     * */
    public function getSystemInfo()
    {
        $user = Auth::user();
        $store = 'Company';
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $memberClient = User::whereId($customer_id)->first();
            if (!empty($memberClient->store)) {
                $store = $memberClient->store->store_name;
            }
            if (!empty($memberClient->company_name)) {
                $store = $memberClient->company_name;
            }
        } else {
            if (!empty($user->is_admin) && $user->is_admin == 2) {
                $memberClient = User::whereId($user->client_user_id)->first();
                if (!empty($memberClient->store)) {
                    $store = $memberClient->store->store_name;
                }
                if (!empty($memberClient->company_name)) {
                    $store = $memberClient->company_name;
                }
            } else {
                if (!empty($user->store)) {
                    $store = $user->store->store_name;
                }
                if (!empty($user->company_name)) {
                    $store = $user->company_name;
                }
            }
        }

        // Ger maintenance mode
        $mode = GeneralSettings::where('option_name', 'maintenance_mode')->first();
        $mode_on = (!empty($mode)) ? intval($mode->option_value) : 0;

        return response()->json([
            'store' => $store,
            'mode'  => $mode_on
        ]);
    }
    /**
     * Get customer active sidebarmenu
     * @param NULL
     * @return JSON sidebarmenu
     * */
    public function storeSidebarMenu()
    {
        $user = Auth::user();
        $id = $user->id;
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $id = $customer_id;
        }
        $wherefield = 'user_id';
        $whereid = $id;
        if ($user->is_admin != 2 && session('user_store_id') > 0) {
            $wherefield = 'store_id';
            $whereid = session('user_store_id');
        }

        $open_orders = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'open_orders')->first();
        $open_orders_on = (!empty($open_orders)) ? intval($open_orders->option_value) : 0;

        $in_transit = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'in_transit')->first();
        $in_transit_on = (!empty($in_transit)) ? intval($in_transit->option_value) : 0;

        $delay_transit = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'delay_transit')->first();
        $delay_transit_on = (!empty($delay_transit)) ? intval($delay_transit->option_value) : 0;

        $invoicing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'invoicing')->first();
        $invoicing_on = (!empty($invoicing)) ? intval($invoicing->option_value) : 0;

        // $held_orders = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'held_orders')->first();
        // $held_orders_on = (!empty($held_orders))?intval($held_orders->option_value):0;

        $return_orders = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'return_orders')->first();
        $return_orders_on = (!empty($return_orders)) ? intval($return_orders->option_value) : 0;

        $receiving_inventory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'receiving_inventory')->first();
        $receiving_inventory_on = (!empty($receiving_inventory)) ? intval($receiving_inventory->option_value) : 0;

        $addshipment_inventory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'addshipment_inventory')->first();
        $addshipment_inventory_on = (!empty($addshipment_inventory)) ? intval($addshipment_inventory->option_value) : 0;

        $no_stock_inventory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'no_stock_inventory')->first();
        $no_stock_inventory_on = (!empty($no_stock_inventory)) ? intval($no_stock_inventory->option_value) : 0;

        $product_inventory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'product_inventory')->first();
        $product_inventory_on = (!empty($product_inventory)) ? intval($product_inventory->option_value) : 0;

        $ustous_pricing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'ustous_pricing')->first();
        $ustous_pricing_on = (!empty($ustous_pricing)) ? intval($ustous_pricing->option_value) : 0;

        $ustononus_pricing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'ustononus_pricing')->first();
        $ustononus_pricing_on = (!empty($ustononus_pricing)) ? intval($ustononus_pricing->option_value) : 0;

        $uktouk_pricing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'uktouk_pricing')->first();
        $uktouk_pricing_on = (!empty($uktouk_pricing)) ? intval($uktouk_pricing->option_value) : 0;

        $uktoeu_pricing = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'uktoeu_pricing')->first();
        $uktoeu_pricing_on = (!empty($uktoeu_pricing)) ? intval($uktoeu_pricing->option_value) : 0;

        $safelist = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'safelist')->first();
        $safelist_on = (!empty($safelist)) ? intval($safelist->option_value) : 0;

        $edithistory = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'edithistory')->first();
        $edithistory_on = (!empty($edithistory)) ? intval($edithistory->option_value) : 0;

        $reports = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'reports')->first();
        $reports_on = (!empty($reports)) ? intval($reports->option_value) : 0;

        $safelistshipments = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'safelistshipments')->first();
        $safelistshipments_on = (!empty($safelistshipments)) ? intval($safelistshipments->option_value) : 0;

        $uspsdelayedshipments = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'uspsdelayedshipments')->first();
        $uspsdelayedshipments_on = (!empty($uspsdelayedshipments)) ? intval($uspsdelayedshipments->option_value) : 0;

        $product_bundles = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'product_bundles')->first();
        $product_bundles_on = (!empty($product_bundles)) ? intval($product_bundles->option_value) : 0;

        $inventory_manager = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'inventory_manager')->first();
        $inventory_manager_on = (!empty($inventory_manager)) ? intval($inventory_manager->option_value) : 0;

        $add_receiving_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_receiving_button')->first();
        $add_receiving_button_on = (!empty($add_receiving_button)) ? intval($add_receiving_button->option_value) : 0;

        $add_shipments_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_shipments_button')->first();
        $add_shipments_button_on = (!empty($add_shipments_button)) ? intval($add_shipments_button->option_value) : 0;

        $add_product_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_product_button')->first();
        $add_product_button_on = (!empty($add_product_button)) ? intval($add_product_button->option_value) : 0;

        $add_bundle_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_bundle_button')->first();
        $add_bundle_button_on = (!empty($add_bundle_button)) ? intval($add_bundle_button->option_value) : 0;

        $wrongitemssent = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'wrongitemssent')->first();
        $wrongitemssent_on = (!empty($wrongitemssent)) ? intval($wrongitemssent->option_value) : 0;

        $dailyitemsdelivered = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'dailyitemsdelivered')->first();
        $dailyitemsdelivered_on = (!empty($dailyitemsdelivered)) ? intval($dailyitemsdelivered->option_value) : 0;

        return response()->json([
            'open_orders' => $open_orders_on,
            'in_transit' => $in_transit_on,
            'delay_transit' => $delay_transit_on,
            'invoicing' => $invoicing_on,
            // 'held_orders' => $held_orders_on,
            'return_orders' => $return_orders_on,
            'receiving_inventory' => $receiving_inventory_on,
            'addshipment_inventory' => $addshipment_inventory_on,
            'no_stock_inventory' => $no_stock_inventory_on,
            'product_inventory' => $product_inventory_on,
            'ustous_pricing' => $ustous_pricing_on,
            'ustononus_pricing' => $ustononus_pricing_on,
            'uktouk_pricing' => $uktouk_pricing_on,
            'uktoeu_pricing' => $uktoeu_pricing_on,
            'safelist' => $safelist_on,
            'edithistory' => $edithistory_on,
            'reports' => $reports_on,
            'safelistshipments' => $safelistshipments_on,
            'uspsdelayedshipments' => $uspsdelayedshipments_on,
            'product_bundles' => $product_bundles_on,
            'inventory_manager' => $inventory_manager_on,
            'add_receiving_button' => $add_receiving_button_on,
            'add_shipments_button' => $add_shipments_button_on,
            'add_product_button' => $add_product_button_on,
            'add_bundle_button' => $add_bundle_button_on,
            'wrongitemssent' => $wrongitemssent_on,
            'dailyitemsdelivered' => $dailyitemsdelivered_on
        ]);
    }
}
