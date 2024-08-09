<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Lib\Helper;
use App\Models\User;
use App\Models\CustomerSettings;
use App\Models\Stores;
use App\Models\GeneralSettings;
use Illuminate\Support\Facades\Route;
use Illuminate\Routing\Redirector;
use App\Models\Notifications;
use App\Models\ReadNotification;

class LoginController extends Controller
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
     * Authenticate user
     * @param Request credentials
     * @return JSON Error / Success
     * */
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            $storeuserid = $user->id;

            // Check number of stores
            $country = 'US';
            $store = 'Company';
            $storeid = 0;
            if ($user->is_admin == 2) {
                $memberClient = User::whereId($user->client_user_id)->first();
                if (!empty($memberClient->store)) {
                    $store = $memberClient->store->store_name;
                }
                if (!empty($memberClient->company_name)) {
                    $store = $memberClient->company_name;
                }
                $storeinfo = Stores::where('user_id', $user->client_user_id)->where('country', $country)->first();
                $storeid = $storeinfo->id;
                $storeuserid = $user->client_user_id;
            } else {
                if (!empty($user->store)) {
                    $store = $user->store->store_name;
                }
                if (!empty($user->company_name)) {
                    $store = $user->company_name;
                }
                if ($user->is_admin != 1) {
                    $storeinfo = Stores::where('user_id', $user->id)->where('country', $country)->first();
                    $storeid = $storeinfo->id;
                }
            }


            $request->session()->put('country_store', $country);
            $request->session()->put('user_store_id', $storeid);

            $quickbooks_creds = array(
                'QUICKBOOKS_CLIENT_ID' => array(
                    'configkey' => 'quickbooks.data_service.client_id',
                    'newval' => config('quickbooks.dynamic.client_id_us')
                ),
                'QUICKBOOKS_CLIENT_SECRET' => array(
                    'configkey' => 'quickbooks.data_service.client_secret',
                    'newval' => config('quickbooks.dynamic.client_secret_us')
                )
            );
            $this->helper->updateDotEnv($quickbooks_creds);

            $wherefield = 'user_id';
            $whereid = $user->id;
            if ($user->is_admin != 2 && $storeid > 0) {
                $wherefield = 'store_id';
                $whereid = $storeid;
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

            $add_receiving_wholesale_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_receiving_wholesale_button')->first();
            $add_receiving_wholesale_button_on = (!empty($add_receiving_wholesale_button)) ? intval($add_receiving_wholesale_button->option_value) : 0;

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

            $mode = GeneralSettings::where('option_name', 'maintenance_mode')->first();
            $mode_on = (!empty($mode)) ? intval($mode->option_value) : 0;

            if ($user->is_admin == 1) {
                $mode_on = 0;
            }

            $storeUKinfo = Stores::where('user_id', $storeuserid)->where('country', 'UK')->first();
            $withUK = 0;
            if (!empty($storeUKinfo->id)) {
                $withUK = 1;
            }

            $notifications = Notifications::whereRaw("store_id='" . $storeid . "' or store_id='0'")->orderByDesc("id")->first();
            $notifyid = (!empty($notifications)) ? $notifications->id : 0;

            $readnotification = ReadNotification::where('notification_id', $notifyid)->where('user_id', $user->id)->first();
            $readnotify = (!empty($readnotification)) ? $readnotification->id : 0;

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
                'add_receiving_wholesale_button' => $add_receiving_wholesale_button_on,
                'add_shipments_button' => $add_shipments_button_on,
                'add_product_button' => $add_product_button_on,
                'add_bundle_button' => $add_bundle_button_on,
                'wrongitemssent' => $wrongitemssent_on,
                'dailyitemsdelivered' => $dailyitemsdelivered_on
            );

            return response()->json([
                'success' => true,
                'id' => $user->id,
                'name' => $user->first_name,
                'email' => $user->email,
                'role' => ($user->is_admin == 1) ? 'Admin' : (($user->is_admin == 0) ? 'Client' : 'Member'),
                'store' => $store,
                'mode' => $mode_on,
                'country' => $country,
                'storeid' => $storeid,
                'base' => url('/'),
                'member_menu' => $member_menu,
                'withuk' => $withUK,
                'notifyid' => $notifyid,
                'readnotify' => $readnotify,
                'access_level' => $user->access_level
            ]);
        }

        return response()->json([
            'errors' => [
                'email' => 'The provided credentials do not match our records.',
            ]
        ]);
    }

    /**
     * Check if user is logged in
     * @param Request sessions
     * @return JSON success
     * */
    public function loginuser()
    {
        $user = Auth::user();

        $loggedin = false;
        if (!empty($user)) {
            $loggedin = true;
        }

        $login_as = false;
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $login_as = true;
        }

        return response()->json([
            'success' => $loggedin,
            'login_as' => $login_as
        ]);
    }

    /**
     * Check if user is logged in as
     * @param Request sessions
     * @return JSON success
     * */
    public function loginAsUser()
    {
        $user = Auth::user();
        $login_as = false;
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $login_as = true;
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

        $add_receiving_wholesale_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_receiving_wholesale_button')->first();
        $add_receiving_wholesale_button_on = (!empty($add_receiving_wholesale_button)) ? intval($add_receiving_wholesale_button->option_value) : 0;

        $add_shipments_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_shipments_button')->first();
        $add_shipments_button_on = (!empty($add_shipments_button)) ? intval($add_shipments_button->option_value) : 0;

        $add_product_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_product_button')->first();
        $add_product_button_on = (!empty($add_product_button)) ? intval($add_product_button->option_value) : 0;

        $add_bundle_button = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'add_bundle_button')->first();
        $add_bundle_button_on = (!empty($add_bundle_button)) ? intval($add_bundle_button->option_value) : 0;

        $wrongitemssent = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'wrongitemssent')->first();
        $wrongitemssent_on = (!empty($wrongitemssent)) ? intval($wrongitemssent->option_value) : 0;

        $dailyitemsdlivered = CustomerSettings::where($wherefield, $whereid)->where('option_name', 'dailyitemsdlivered')->first();
        $dailyitemsdlivered_on = (!empty($dailyitemsdlivered)) ? intval($dailyitemsdlivered->option_value) : 0;

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
            'add_receiving_wholesale_button' => $add_receiving_wholesale_button_on,
            'add_shipments_button' => $add_shipments_button_on,
            'add_product_button' => $add_product_button_on,
            'add_bundle_button' => $add_bundle_button_on,
            'wrongitemssent' => $wrongitemssent_on,
            'dailyitemsdlivered' => $dailyitemsdlivered_on
        );

        return response()->json([
            'login_as' => $login_as,
            'member_menu' => $member_menu
        ]);
    }

    /**
     * Logout user
     * @param Request sessions
     * @return JSON success
     * */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Check if user is loggedin
     * @param Auth user info
     * @return userid on success
     * */
    public function checkuser_iflogin()
    {
        $user = Auth::user();
        // Auth::logout(); // uncomment to logout user and remove their session data
        if (!empty($user)) {
            $mode = GeneralSettings::where('option_name', 'maintenance_mode')->first();
            $mode_on = (!empty($mode)) ? intval($mode->option_value) : 0;

            if ($user->is_admin == 1) {
                $mode_on = 0;
            } else {
                if ($mode_on != 0) {
                    Auth::logout();
                }
            }

            return response()->json([
                'userid' => $user->id,
                'mode' => $mode_on,
            ]);
        } else {
            Auth::logout();
            return response()->json([
                'userid' => 0,
                'mode' => 0
            ]);
        }
    }
    /**
     * Check if maintenance mode is on
     * @param Auth user info
     * @return modeon on success
     * */
    public function check_maintenance_mode()
    {
        $mode = GeneralSettings::where('option_name', 'maintenance_mode')->first();
        $mode_on = (!empty($mode)) ? intval($mode->option_value) : 0;
        return response()->json([
            'mode' => $mode_on,
        ]);
    }
}
