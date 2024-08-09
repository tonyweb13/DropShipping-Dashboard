<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Mail\AppMail;
use App\Models\User;
use App\Models\Stores;
use App\Models\CustomerSettings;
use App\Lib\Helper;

class CustomersController extends Controller
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
     * Fetch all customer
     * @param None
     * @return JSON customers
     * */
    public function index(Request $request)
    {
        $customers = User::where('is_admin', 0)->get();
        // ->paginate(5, ['*'], 'page', $request->page);
        return response()->json([
            'success' => true,
            'customers' => $customers
        ]);
    }

    /**
     * Add new customer
     * @param Request customer data
     * @return Success
     * */
    public function addCustomer(Request $request)
    {
        $validation = $request->validate([
            'first_name' => ['required'],
            'email' => ['required', 'email', 'unique:users']
        ]);

        $randomstring = $this->helper->generateRandomString(12);
        $password = Hash::make($randomstring);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email'     => $request->email,
            'password'  => $password,
            'is_admin' => 0
        ]);

        // Add customer settings
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'invoice',
        //     'option_value' => $request->invoice
        // ]);
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'storage_cost',
        //     'option_value' => $request->storage_cost
        // ]);
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'storage_calculator',
        //     'option_value' => $request->storage_calculator
        // ]);
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'held',
        //     'option_value' => $request->held
        // ]);
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'delayed',
        //     'option_value' => $request->delayed
        // ]);
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'intransit',
        //     'option_value' => $request->intransit
        // ]);
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'returns',
        //     'option_value' => $request->returns
        // ]);
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'receiving',
        //     'option_value' => $request->receiving
        // ]);
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'low_stock',
        //     'option_value' => $request->low_stock
        // ]);
        // CustomerSettings::create([
        //     'user_id' => $user->id,
        //     'option_name' => 'no_stock',
        //     'option_value' => $request->no_stock
        // ]);

        // Send email
        $details = array(
            'subject' => 'Account fully setup!',
            'heading' => 'Greetings ' . $user->first_name . ' ' . $user->last_name . ' and welcome!',
            'message' => 'To login refer details below:',
            'url' => url('/login'),
            'email' => $user->email,
            'password' => $randomstring,
            'template' => 'newclient'
        );
        Mail::to($user->email)->send(new AppMail($details));

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Get single customer
     * @param Request Customer id
     * @return JSON Customer
     * */
    public function getCustomer(Request $request)
    {
        $id = $request->id;
        $data = User::whereId($id)->first();

        $invoice = CustomerSettings::where('user_id', $id)->where('option_name', 'invoice')->first();
        $invoice_on = (!empty($invoice)) ? intval($invoice->option_value) : 0;

        $storage_cost = CustomerSettings::where('user_id', $id)->where('option_name', 'storage_cost')->first();
        $storage_cost_on = (!empty($storage_cost)) ? intval($storage_cost->option_value) : 0;

        $storage_calculator = CustomerSettings::where('user_id', $id)->where('option_name', 'storage_calculator')->first();
        $storage_calculator_on = (!empty($storage_calculator)) ? intval($storage_calculator->option_value) : 0;

        $openorders = CustomerSettings::where('user_id', $id)->where('option_name', 'openorders')->first();
        $openorders_on = (!empty($openorders)) ? intval($openorders->option_value) : 0;

        $intransit = CustomerSettings::where('user_id', $id)->where('option_name', 'intransit')->first();
        $intransit_on = (!empty($intransit)) ? intval($intransit->option_value) : 0;

        $delayed = CustomerSettings::where('user_id', $id)->where('option_name', 'delayed')->first();
        $delayed_on = (!empty($delayed)) ? intval($delayed->option_value) : 0;

        $returns = CustomerSettings::where('user_id', $id)->where('option_name', 'returns')->first();
        $returns_on = (!empty($returns)) ? intval($returns->option_value) : 0;

        $receiving = CustomerSettings::where('user_id', $id)->where('option_name', 'receiving')->first();
        $receiving_on = (!empty($receiving)) ? intval($receiving->option_value) : 0;

        $low_stock = CustomerSettings::where('user_id', $id)->where('option_name', 'low_stock')->first();
        $low_stock_on = (!empty($low_stock)) ? intval($low_stock->option_value) : 0;

        $no_stock = CustomerSettings::where('user_id', $id)->where('option_name', 'no_stock')->first();
        $no_stock_on = (!empty($no_stock)) ? intval($no_stock->option_value) : 0;

        return response()->json([
            'user' => $data,
            'settings' => [
                'invoice' => $invoice_on,
                'storage_cost' => $storage_cost_on,
                'storage_calculator' => $storage_calculator_on,
                'openorders' => $openorders_on,
                'intransit' => $intransit_on,
                'delayed' => $delayed_on,
                'returns' => $returns_on,
                'receiving' => $receiving_on,
                'low_stock' => $low_stock_on,
                'no_stock' => $no_stock_on
            ]
        ]);
    }

    /**
     * Edit single customer
     * @param Request Customer data
     * @return JSON Success
     * */
    public function editCustomer(Request $request)
    {
        $validation = $request->validate([
            'first_name' => ['required'],
            'last_name' => ['required'],
            'email' => ['required', 'email']
        ]);

        User::whereId($request->customer_id)->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email'     => $request->email
        ]);

        // Update customer settings
        // $invoice = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'invoice')->first();
        // if(!empty($invoice)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'invoice')->update([
        //         'option_value' => $request->invoice
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'invoice',
        //         'option_value' => $request->invoice
        //     ]);
        // }

        // $storage_cost = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'storage_cost')->first();
        // if(!empty($storage_cost)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'storage_cost')->update([
        //         'option_value' => $request->storage_cost
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'storage_cost',
        //         'option_value' => $request->storage_cost
        //     ]);
        // }

        // $storage_calculator = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'storage_calculator')->first();
        // if(!empty($storage_calculator)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'storage_calculator')->update([
        //         'option_value' => $request->storage_calculator
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'storage_calculator',
        //         'option_value' => $request->storage_calculator
        //     ]);
        // }

        // $held = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'held')->first();
        // if(!empty($held)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'held')->update([
        //         'option_value' => $request->held
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'held',
        //         'option_value' => $request->held
        //     ]);
        // }

        // $delayed = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'delayed')->first();
        // if(!empty($delayed)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'delayed')->update([
        //         'option_value' => $request->delayed
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'delayed',
        //         'option_value' => $request->delayed
        //     ]);
        // }

        // $intransit = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'intransit')->first();
        // if(!empty($intransit)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'intransit')->update([
        //         'option_value' => $request->intransit
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'intransit',
        //         'option_value' => $request->intransit
        //     ]);
        // }

        // $returns = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'returns')->first();
        // if(!empty($returns)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'returns')->update([
        //         'option_value' => $request->returns
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'returns',
        //         'option_value' => $request->returns
        //     ]);
        // }

        // $receiving = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'receiving')->first();
        // if(!empty($receiving)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'receiving')->update([
        //         'option_value' => $request->receiving
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'receiving',
        //         'option_value' => $request->receiving
        //     ]);
        // }

        // $low_stock = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'low_stock')->first();
        // if(!empty($low_stock)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'low_stock')->update([
        //         'option_value' => $request->low_stock
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'low_stock',
        //         'option_value' => $request->low_stock
        //     ]);
        // }

        // $no_stock = CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'no_stock')->first();
        // if(!empty($no_stock)) {
        //     CustomerSettings::where('user_id', $request->customer_id)->where('option_name', 'no_stock')->update([
        //         'option_value' => $request->no_stock
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer_id,
        //         'option_name' => 'no_stock',
        //         'option_value' => $request->no_stock
        //     ]);
        // }

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Delete customer
     * @param Request Customer id
     * @return JSON success
     * */
    public function deleteCustomer(Request $request)
    {
        User::whereId($request->customer_id)->delete();

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Login as client
     * @param Request client id
     * @return JSON success
     * */
    public function loginAsClient(Request $request)
    {
        $user = Auth::user();

        $storeinfo = Stores::where('user_id', $request->customer_id)->where('country', 'US')->first();
        $storeid = $storeinfo->id;

        $storeUKinfo = Stores::where('user_id', $request->customer_id)->where('country', 'UK')->first();
        $withUK = 0;
        if (!empty($storeUKinfo->id)) {
            $withUK = 1;
        }

        $request->session()->put('user_store_id', $storeid);
        $request->session()->put('customer_id', $request->customer_id);


        $customer_id = $request->customer_id;
        if (!empty($customer_id)) {
            $login_as = true;
            $id = $customer_id;
        }

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
            'success' => 1,
            'member_menu' => $member_menu,
            'withuk' => $withUK,
            'access_level' => $user->access_level
        ]);
    }

    /**
     * Update a admin profile
     * @param Request userid
     * @return JSON success
     * */
    public function updateadminprofile(Request $request)
    {
        $user = Auth::user();

        $currentpassword = $user->password;
        $post_old_password = $request->old_password;
        $post_new_password = $request->new_password;
        $post_confirm_password = $request->confirm_password;
        if (!Hash::check($post_old_password, $currentpassword) && $post_old_password != '') {
            return response()->json([
                'errormsg' => "oldpasserror"
            ]);
            exit;
        } else {
            $post_new_password = str_replace(' ', '', $post_new_password);
            $post_confirm_password = str_replace(' ', '', $post_confirm_password);
            $verifynewpass = ($post_new_password != '' && $post_confirm_password != '' && ($post_new_password == $post_confirm_password)) ? true : false;

            if ($post_old_password != '' && $verifynewpass == true) {
                $password = Hash::make($request->new_password);
                $user->password = $password;
            }
        }


        $user->first_name = $request->first_name;

        $validator = Validator::make(['email' => $request->email], [
            'email' => 'required|exists:users'
        ]);

        if ($validator->fails() && $user->email != $request->email) {
            $user->email = $request->email;
            $user->save();
            return response()->json([
                'success' => 'ChangeEmail'
            ]);
        } else {
            if ($user->email == $request->email) {
                $user->save();
                return response()->json([
                    'success' => 1
                ]);
            } else {
                return response()->json([
                    'success' => "EmailTaken"
                ]);
            }
        }
    }
}
