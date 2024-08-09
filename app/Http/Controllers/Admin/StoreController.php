<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\Stores;
use App\Models\User;
use App\Lib\Helper;
use App\Models\CustomerSettings;
use DateTime;

class StoreController extends Controller
{
    protected $helper;

    /**
     * Initialize
     * */
    public function __construct()
    {
        $this->helper = new Helper();
    }

    /**
     * Fetch all Stores
     * @param Request
     * @return JSON Stores and Customers
     * */
    public function index(Request $request)
    {
        $stores = Stores::with(['User'])->get();
        // ->paginate(4, ['*'], 'page', $request->page);
        $customers = User::where('is_admin', 0)->get();

        $storestatus = [];
        foreach ($stores as $store) {
            $storeid = $store->id;
            $storestatus[$storeid][] = $this->helper->checkdisableopenorder($storeid);
        }

        return response()->json([
            'success' => true,
            'stores' => $stores,
            'customers' => $customers,
            'storestatus' => $storestatus
        ]);
    }

    /**
     * Add Store
     * @param Request Store data
     * @return JSON Success
     * */
    public function addStore(Request $request)
    {
        $validation = $request->validate([
            'store_ids' => ['required'],
            'store_name' => ['required'],
            'customer' => ['required'],
            'country' => ['required']
        ]);

        $newstore = Stores::create([
            'user_id' => $request->customer,
            'store_ids' => $request->store_ids,
            'customer_quickbooks_id' => $request->quickbooksid,
            'country' => $request->country,
            'store_name' => $request->store_name,
            'store_slug' => str_replace(' ', '-', strtolower($request->store_name))
        ]);

        $userrequest = $request->user;

        // Add customer settings
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'invoice',
            'option_value' => $userrequest['invoice']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'storage_cost',
            'option_value' => $userrequest['storage_cost']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'storage_calculator',
            'option_value' => $userrequest['storage_calculator']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'openorders',
            'option_value' => $userrequest['openorders']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'delayed',
            'option_value' => $userrequest['delayed']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'intransit',
            'option_value' => $userrequest['intransit']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'returns',
            'option_value' => $userrequest['returns']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'receiving',
            'option_value' => $userrequest['receiving']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'low_stock',
            'option_value' => $userrequest['low_stock']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'no_stock',
            'option_value' => $userrequest['no_stock']
        ]);

        // sidebar nav options            
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'open_orders',
            'option_value' => $userrequest['open_orders']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'in_transit',
            'option_value' => $userrequest['in_transit']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'delay_transit',
            'option_value' => $userrequest['delay_transit']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'invoicing',
            'option_value' => $userrequest['invoicing']
        ]);
        // CustomerSettings::create([
        //     'user_id' => $request->customer,
        //     'store_id' => $newstore->id,
        //     'option_name' => 'held_orders',
        //     'option_value' => $userrequest['held_orders']
        // ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'return_orders',
            'option_value' => $userrequest['return_orders']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'receiving_inventory',
            'option_value' => $userrequest['receiving_inventory']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'addshipment_inventory',
            'option_value' => $userrequest['addshipment_inventory']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'no_stock_inventory',
            'option_value' => $userrequest['no_stock_inventory']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'product_inventory',
            'option_value' => $userrequest['product_inventory']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'ustous_pricing',
            'option_value' => $userrequest['ustous_pricing']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'ustononus_pricing',
            'option_value' => $userrequest['ustononus_pricing']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'uktouk_pricing',
            'option_value' => $userrequest['uktouk_pricing']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'uktoeu_pricing',
            'option_value' => $userrequest['uktoeu_pricing']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'safelist',
            'option_value' => $userrequest['safelist']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'edithistory',
            'option_value' => $userrequest['edithistory']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'reports',
            'option_value' => $userrequest['reports']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'safelistshipments',
            'option_value' => $userrequest['safelistshipments']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'uspsdelayedshipments',
            'option_value' => $userrequest['uspsdelayedshipments']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'product_bundles',
            'option_value' => $userrequest['product_bundles']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'inventory_manager',
            'option_value' => $userrequest['inventory_manager']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'add_receiving_button',
            'option_value' => $userrequest['add_receiving_button']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'add_receiving_wholesale_button',
            'option_value' => $userrequest['add_receiving_wholesale_button']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'add_shipments_button',
            'option_value' => $userrequest['add_shipments_button']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'add_product_button',
            'option_value' => $userrequest['add_product_button']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'add_bundle_button',
            'option_value' => $userrequest['add_bundle_button']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'wrongitemssent',
            'option_value' => $userrequest['wrongitemssent']
        ]);
        CustomerSettings::create([
            'user_id' => $request->customer,
            'store_id' => $newstore->id,
            'option_name' => 'dailyitemsdelivered',
            'option_value' => $userrequest['dailyitemsdelivered']
        ]);
        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Get stores
     * @param Request Store $id
     * @return JSON Store 
     * */
    public function getStores(Request $request)
    {
        $stores = Stores::where('country', $request->country)->get();

        return response()->json([
            'success' => 1,
            'stores' => $stores
        ]);
    }

    /**
     * Get single store
     * @param Request Store $id
     * @return JSON Store 
     * */
    public function getStore(Request $request)
    {
        $id = $request->id;
        $data = Stores::with(['User'])->whereId($id)->first();

        $invoice = CustomerSettings::where('store_id', $id)->where('option_name', 'invoice')->first();
        $invoice_on = (!empty($invoice)) ? intval($invoice->option_value) : 0;

        $storage_cost = CustomerSettings::where('store_id', $id)->where('option_name', 'storage_cost')->first();
        $storage_cost_on = (!empty($storage_cost)) ? intval($storage_cost->option_value) : 0;

        $storage_calculator = CustomerSettings::where('store_id', $id)->where('option_name', 'storage_calculator')->first();
        $storage_calculator_on = (!empty($storage_calculator)) ? intval($storage_calculator->option_value) : 0;

        $openorders = CustomerSettings::where('store_id', $id)->where('option_name', 'openorders')->first();
        $openorders_on = (!empty($openorders)) ? intval($openorders->option_value) : 0;

        $intransit = CustomerSettings::where('store_id', $id)->where('option_name', 'intransit')->first();
        $intransit_on = (!empty($intransit)) ? intval($intransit->option_value) : 0;

        $delayed = CustomerSettings::where('store_id', $id)->where('option_name', 'delayed')->first();
        $delayed_on = (!empty($delayed)) ? intval($delayed->option_value) : 0;

        $returns = CustomerSettings::where('store_id', $id)->where('option_name', 'returns')->first();
        $returns_on = (!empty($returns)) ? intval($returns->option_value) : 0;

        $receiving = CustomerSettings::where('store_id', $id)->where('option_name', 'receiving')->first();
        $receiving_on = (!empty($receiving)) ? intval($receiving->option_value) : 0;

        $low_stock = CustomerSettings::where('store_id', $id)->where('option_name', 'low_stock')->first();
        $low_stock_on = (!empty($low_stock)) ? intval($low_stock->option_value) : 0;

        $no_stock = CustomerSettings::where('store_id', $id)->where('option_name', 'no_stock')->first();
        $no_stock_on = (!empty($no_stock)) ? intval($no_stock->option_value) : 0;

        $open_orders = CustomerSettings::where('store_id', $id)->where('option_name', 'open_orders')->first();
        $open_orders_on = (!empty($open_orders)) ? intval($open_orders->option_value) : 0;

        $in_transit = CustomerSettings::where('store_id', $id)->where('option_name', 'in_transit')->first();
        $in_transit_on = (!empty($in_transit)) ? intval($in_transit->option_value) : 0;

        $delay_transit = CustomerSettings::where('store_id', $id)->where('option_name', 'delay_transit')->first();
        $delay_transit_on = (!empty($delay_transit)) ? intval($delay_transit->option_value) : 0;

        $invoicing = CustomerSettings::where('store_id', $id)->where('option_name', 'invoicing')->first();
        $invoicing_on = (!empty($invoicing)) ? intval($invoicing->option_value) : 0;

        // $held_orders = CustomerSettings::where('store_id', $id)->where('option_name', 'held_orders')->first();
        // $held_orders_on = (!empty($held_orders))?intval($held_orders->option_value):0;

        $return_orders = CustomerSettings::where('store_id', $id)->where('option_name', 'return_orders')->first();
        $return_orders_on = (!empty($return_orders)) ? intval($return_orders->option_value) : 0;

        $receiving_inventory = CustomerSettings::where('store_id', $id)->where('option_name', 'receiving_inventory')->first();
        $receiving_inventory_on = (!empty($receiving_inventory)) ? intval($receiving_inventory->option_value) : 0;

        $addshipment_inventory = CustomerSettings::where('store_id', $id)->where('option_name', 'addshipment_inventory')->first();
        $addshipment_inventory_on = (!empty($addshipment_inventory)) ? intval($addshipment_inventory->option_value) : 0;

        $no_stock_inventory = CustomerSettings::where('store_id', $id)->where('option_name', 'no_stock_inventory')->first();
        $no_stock_inventory_on = (!empty($no_stock_inventory)) ? intval($no_stock_inventory->option_value) : 0;

        $product_inventory = CustomerSettings::where('store_id', $id)->where('option_name', 'product_inventory')->first();
        $product_inventory_on = (!empty($product_inventory)) ? intval($product_inventory->option_value) : 0;

        $ustous_pricing = CustomerSettings::where('store_id', $id)->where('option_name', 'ustous_pricing')->first();
        $ustous_pricing_on = (!empty($ustous_pricing)) ? intval($ustous_pricing->option_value) : 0;

        $ustononus_pricing = CustomerSettings::where('store_id', $id)->where('option_name', 'ustononus_pricing')->first();
        $ustononus_pricing_on = (!empty($ustononus_pricing)) ? intval($ustononus_pricing->option_value) : 0;

        $uktouk_pricing = CustomerSettings::where('store_id', $id)->where('option_name', 'uktouk_pricing')->first();
        $uktouk_pricing_on = (!empty($uktouk_pricing)) ? intval($uktouk_pricing->option_value) : 0;

        $uktoeu_pricing = CustomerSettings::where('store_id', $id)->where('option_name', 'uktoeu_pricing')->first();
        $uktoeu_pricing_on = (!empty($uktoeu_pricing)) ? intval($uktoeu_pricing->option_value) : 0;

        $safelist = CustomerSettings::where('store_id', $id)->where('option_name', 'safelist')->first();
        $safelist_on = (!empty($safelist)) ? intval($safelist->option_value) : 0;

        $edithistory = CustomerSettings::where('store_id', $id)->where('option_name', 'edithistory')->first();
        $edithistory_on = (!empty($edithistory)) ? intval($edithistory->option_value) : 0;

        $reports = CustomerSettings::where('store_id', $id)->where('option_name', 'reports')->first();
        $reports_on = (!empty($reports)) ? intval($reports->option_value) : 0;

        $safelistshipments = CustomerSettings::where('store_id', $id)->where('option_name', 'safelistshipments')->first();
        $safelistshipments_on = (!empty($safelistshipments)) ? intval($safelistshipments->option_value) : 0;

        $uspsdelayedshipments = CustomerSettings::where('store_id', $id)->where('option_name', 'uspsdelayedshipments')->first();
        $uspsdelayedshipments_on = (!empty($uspsdelayedshipments)) ? intval($uspsdelayedshipments->option_value) : 0;

        $product_bundles = CustomerSettings::where('store_id', $id)->where('option_name', 'product_bundles')->first();
        $product_bundles_on = (!empty($product_bundles)) ? intval($product_bundles->option_value) : 0;

        $inventory_manager = CustomerSettings::where('store_id', $id)->where('option_name', 'inventory_manager')->first();
        $inventory_manager_on = (!empty($inventory_manager)) ? intval($inventory_manager->option_value) : 0;

        $add_receiving_button = CustomerSettings::where('store_id', $id)->where('option_name', 'add_receiving_button')->first();
        $add_receiving_button_on = (!empty($add_receiving_button)) ? intval($add_receiving_button->option_value) : 0;

        $add_receiving_wholesale_button = CustomerSettings::where('store_id', $id)->where('option_name', 'add_receiving_wholesale_button')->first();
        $add_receiving_wholesale_button_on = (!empty($add_receiving_wholesale_button)) ? intval($add_receiving_wholesale_button->option_value) : 0;

        $add_shipments_button = CustomerSettings::where('store_id', $id)->where('option_name', 'add_shipments_button')->first();
        $add_shipments_button_on = (!empty($add_shipments_button)) ? intval($add_shipments_button->option_value) : 0;

        $add_product_button = CustomerSettings::where('store_id', $id)->where('option_name', 'add_product_button')->first();
        $add_product_button_on = (!empty($add_product_button)) ? intval($add_product_button->option_value) : 0;

        $add_bundle_button = CustomerSettings::where('store_id', $id)->where('option_name', 'add_bundle_button')->first();
        $add_bundle_button_on = (!empty($add_bundle_button)) ? intval($add_bundle_button->option_value) : 0;

        $wrongitemssent = CustomerSettings::where('store_id', $id)->where('option_name', 'wrongitemssent')->first();
        $wrongitemssent_on = (!empty($wrongitemssent)) ? intval($wrongitemssent->option_value) : 0;

        $dailyitemsdelivered = CustomerSettings::where('store_id', $id)->where('option_name', 'dailyitemsdelivered')->first();
        $dailyitemsdelivered_on = (!empty($dailyitemsdelivered)) ? intval($dailyitemsdelivered->option_value) : 0;
        // return response()->json($data);

        $checkdisable = $this->helper->checkdisableopenorder($id);
        // echo date("Y-m-d H:i:s");exit;
        return response()->json([
            'store' => $data,
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
                'no_stock' => $no_stock_on,
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
            ],
            'editstatus' => $checkdisable['editstatus']
        ]);
    }

    /**
     * Edit single store
     * @param Request Store data
     * @return JSON Success
     * */
    public function editStore(Request $request)
    {
        $validation = $request->validate([
            // 'store_ids' => ['required'],
            'store_name' => ['required'],
            'customer' => ['required']
        ]);

        Stores::whereId($request->store_id)->update([
            'user_id' => $request->customer,
            'store_ids' => $request->store_ids,
            'customer_quickbooks_id' => $request->quickbooksid,
            'country' => $request->country,
            'store_name' => $request->store_name
        ]);

        $userrequest = $request->user;

        // Update customer settings
        $invoice = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'invoice')->first();
        if (!empty($invoice)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'invoice')->update([
                'option_value' => $userrequest['invoice']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'invoice',
                'option_value' => $userrequest['invoice']
            ]);
        }

        $storage_cost = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'storage_cost')->first();
        if (!empty($storage_cost)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'storage_cost')->update([
                'option_value' => $userrequest['storage_cost']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'storage_cost',
                'option_value' => $userrequest['storage_cost']
            ]);
        }

        $storage_calculator = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'storage_calculator')->first();
        if (!empty($storage_calculator)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'storage_calculator')->update([
                'option_value' => $userrequest['storage_calculator']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'storage_calculator',
                'option_value' => $userrequest['storage_calculator']
            ]);
        }

        $openorders = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'openorders')->first();
        if (!empty($openorders)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'openorders')->update([
                'option_value' => $userrequest['openorders']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'openorders',
                'option_value' => $userrequest['openorders']
            ]);
        }

        $delayed = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'delayed')->first();
        if (!empty($delayed)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'delayed')->update([
                'option_value' => $userrequest['delayed']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'delayed',
                'option_value' => $userrequest['delayed']
            ]);
        }

        $intransit = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'intransit')->first();
        if (!empty($intransit)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'intransit')->update([
                'option_value' => $userrequest['intransit']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'intransit',
                'option_value' => $userrequest['intransit']
            ]);
        }

        $returns = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'returns')->first();
        if (!empty($returns)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'returns')->update([
                'option_value' => $userrequest['returns']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'returns',
                'option_value' => $userrequest['returns']
            ]);
        }

        $receiving = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'receiving')->first();
        if (!empty($receiving)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'receiving')->update([
                'option_value' => $userrequest['receiving']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'receiving',
                'option_value' => $userrequest['receiving']
            ]);
        }

        $low_stock = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'low_stock')->first();
        if (!empty($low_stock)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'low_stock')->update([
                'option_value' => $userrequest['low_stock']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'low_stock',
                'option_value' => $userrequest['low_stock']
            ]);
        }

        $no_stock = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'no_stock')->first();
        if (!empty($no_stock)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'no_stock')->update([
                'option_value' => $userrequest['no_stock']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'no_stock',
                'option_value' => $userrequest['no_stock']
            ]);
        }

        // sidebar settings
        $open_orders = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'open_orders')->first();
        if (!empty($open_orders)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'open_orders')->update([
                'option_value' => $userrequest['open_orders']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'open_orders',
                'option_value' => $userrequest['open_orders']
            ]);
        }

        $in_transit = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'in_transit')->first();
        if (!empty($in_transit)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'in_transit')->update([
                'option_value' => $userrequest['in_transit']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'in_transit',
                'option_value' => $userrequest['in_transit']
            ]);
        }

        $delay_transit = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'delay_transit')->first();
        if (!empty($delay_transit)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'delay_transit')->update([
                'option_value' => $userrequest['delay_transit']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'delay_transit',
                'option_value' => $userrequest['delay_transit']
            ]);
        }

        $invoicing = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'invoicing')->first();
        if (!empty($invoicing)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'invoicing')->update([
                'option_value' => $userrequest['invoicing']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'invoicing',
                'option_value' => $userrequest['invoicing']
            ]);
        }

        // $held_orders = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'held_orders')->first();
        // if(!empty($held_orders)) {
        //     CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'held_orders')->update([
        //         'option_value' => $userrequest['held_orders']
        //     ]);
        // } else {
        //     CustomerSettings::create([
        //         'user_id' => $request->customer,
        //         'store_id' => $request->store_id,
        //         'option_name' => 'held_orders',
        //         'option_value' => $userrequest['held_orders']
        //     ]);
        // }

        $return_orders = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'return_orders')->first();
        if (!empty($return_orders)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'return_orders')->update([
                'option_value' => $userrequest['return_orders']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'return_orders',
                'option_value' => $userrequest['return_orders']
            ]);
        }

        $receiving_inventory = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'receiving_inventory')->first();
        if (!empty($receiving_inventory)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'receiving_inventory')->update([
                'option_value' => $userrequest['receiving_inventory']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'receiving_inventory',
                'option_value' => $userrequest['receiving_inventory']
            ]);
        }

        $addshipment_inventory = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'addshipment_inventory')->first();
        if (!empty($addshipment_inventory)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'addshipment_inventory')->update([
                'option_value' => $userrequest['addshipment_inventory']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'addshipment_inventory',
                'option_value' => $userrequest['addshipment_inventory']
            ]);
        }

        $no_stock_inventory = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'no_stock_inventory')->first();
        if (!empty($no_stock_inventory)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'no_stock_inventory')->update([
                'option_value' => $userrequest['no_stock_inventory']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'no_stock_inventory',
                'option_value' => $userrequest['no_stock_inventory']
            ]);
        }

        $product_inventory = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'product_inventory')->first();
        if (!empty($product_inventory)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'product_inventory')->update([
                'option_value' => $userrequest['product_inventory']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'product_inventory',
                'option_value' => $userrequest['product_inventory']
            ]);
        }

        $ustous_pricing = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'ustous_pricing')->first();
        if (!empty($ustous_pricing)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'ustous_pricing')->update([
                'option_value' => $userrequest['ustous_pricing']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'ustous_pricing',
                'option_value' => $userrequest['ustous_pricing']
            ]);
        }

        $ustononus_pricing = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'ustononus_pricing')->first();
        if (!empty($ustononus_pricing)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'ustononus_pricing')->update([
                'option_value' => $userrequest['ustononus_pricing']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'ustononus_pricing',
                'option_value' => $userrequest['ustononus_pricing']
            ]);
        }

        $uktouk_pricing = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'uktouk_pricing')->first();
        if (!empty($uktouk_pricing)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'uktouk_pricing')->update([
                'option_value' => $userrequest['uktouk_pricing']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'uktouk_pricing',
                'option_value' => $userrequest['uktouk_pricing']
            ]);
        }

        $uktoeu_pricing = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'uktoeu_pricing')->first();
        if (!empty($uktoeu_pricing)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'uktoeu_pricing')->update([
                'option_value' => $userrequest['uktoeu_pricing']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'uktoeu_pricing',
                'option_value' => $userrequest['uktoeu_pricing']
            ]);
        }

        $safelist = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'safelist')->first();
        if (!empty($safelist)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'safelist')->update([
                'option_value' => $userrequest['safelist']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'safelist',
                'option_value' => $userrequest['safelist']
            ]);
        }

        $edithistory = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'edithistory')->first();
        if (!empty($edithistory)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'edithistory')->update([
                'option_value' => $userrequest['edithistory']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'edithistory',
                'option_value' => $userrequest['edithistory']
            ]);
        }

        $reports = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'reports')->first();
        if (!empty($reports)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'reports')->update([
                'option_value' => $userrequest['reports']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'reports',
                'option_value' => $userrequest['reports']
            ]);
        }

        $safelistshipments = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'safelistshipments')->first();
        if (!empty($safelistshipments)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'safelistshipments')->update([
                'option_value' => $userrequest['safelistshipments']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'safelistshipments',
                'option_value' => $userrequest['safelistshipments']
            ]);
        }

        $uspsdelayedshipments = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'uspsdelayedshipments')->first();
        if (!empty($uspsdelayedshipments)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'uspsdelayedshipments')->update([
                'option_value' => $userrequest['uspsdelayedshipments']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'uspsdelayedshipments',
                'option_value' => $userrequest['uspsdelayedshipments']
            ]);
        }

        $product_bundles = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'product_bundles')->first();
        if (!empty($product_bundles)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'product_bundles')->update([
                'option_value' => $userrequest['product_bundles']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'product_bundles',
                'option_value' => $userrequest['product_bundles']
            ]);
        }

        $inventory_manager = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'inventory_manager')->first();
        if (!empty($inventory_manager)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'inventory_manager')->update([
                'option_value' => $userrequest['inventory_manager']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'inventory_manager',
                'option_value' => $userrequest['inventory_manager']
            ]);
        }

        $add_receiving_button = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_receiving_button')->first();
        if (!empty($add_receiving_button)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_receiving_button')->update([
                'option_value' => $userrequest['add_receiving_button']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'add_receiving_button',
                'option_value' => $userrequest['add_receiving_button']
            ]);
        }

        $add_receiving_wholesale_button = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_receiving_wholesale_button')->first();
        if (!empty($add_receiving_wholesale_button)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_receiving_wholesale_button')->update([
                'option_value' => $userrequest['add_receiving_wholesale_button']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'add_receiving_wholesale_button',
                'option_value' => $userrequest['add_receiving_wholesale_button']
            ]);
        }

        $add_shipments_button = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_shipments_button')->first();
        if (!empty($add_shipments_button)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_shipments_button')->update([
                'option_value' => $userrequest['add_shipments_button']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'add_shipments_button',
                'option_value' => $userrequest['add_shipments_button']
            ]);
        }

        $add_product_button = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_product_button')->first();
        if (!empty($add_product_button)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_product_button')->update([
                'option_value' => $userrequest['add_product_button']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'add_product_button',
                'option_value' => $userrequest['add_product_button']
            ]);
        }

        $add_bundle_button = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_bundle_button')->first();
        if (!empty($add_bundle_button)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'add_bundle_button')->update([
                'option_value' => $userrequest['add_bundle_button']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'add_bundle_button',
                'option_value' => $userrequest['add_bundle_button']
            ]);
        }

        $wrongitemssent = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'wrongitemssent')->first();
        if (!empty($wrongitemssent)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'wrongitemssent')->update([
                'option_value' => $userrequest['wrongitemssent']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'wrongitemssent',
                'option_value' => $userrequest['wrongitemssent']
            ]);
        }

        $dailyitemsdelivered = CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'dailyitemsdelivered')->first();
        if (!empty($dailyitemsdelivered)) {
            CustomerSettings::where('store_id', $request->store_id)->where('option_name', 'dailyitemsdelivered')->update([
                'option_value' => $userrequest['dailyitemsdelivered']
            ]);
        } else {
            CustomerSettings::create([
                'user_id' => $request->customer,
                'store_id' => $request->store_id,
                'option_name' => 'dailyitemsdelivered',
                'option_value' => $userrequest['dailyitemsdelivered']
            ]);
        }

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Delete store
     * @param Request Store id
     * @return JSON success
     * */
    public function deleteStore(Request $request)
    {
        Stores::whereId($request->store_id)->delete();

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Disable editing store
     * @param Request Store id
     * @return JSON success
     * */
    public function disableenablestore(Request $request)
    {
        $storeid = $request->store_id;
        $editstatus = ($request->editing_status == 'Disable') ? 'Enable' : 'Disable';
        $force_enable_datetime = '';
        if ($editstatus == 'Enable') {
            $checkdisable = $this->helper->checkdisableopenorder($storeid);
            if ($checkdisable['editstatus'] == 'Disable' && $checkdisable['disabletype'] == 'auto') {
                $editstatus = 'Forced Enable';
                $force_enable_datetime = date('Y-m-d H:i:s');
            }
            // print_r($checkdisable);
        }

        Stores::whereId($storeid)->update([
            'editing_status' => $editstatus,
            'force_enable_datetime' => $force_enable_datetime
        ]);

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Disable settings store
     * @param Request Store id
     * @return JSON success
     * */
    public function disablesettingstore(Request $request)
    {

        Stores::whereId($request->store_id)->update([
            'disable_date' => $request->disable_date,
            'disable_enddate' => $request->disable_enddate,
            'disable_time' => $request->disable_time,
            'disable_endtime' => $request->disable_endtime,
            'disable_type' => $request->disable_type,
            'disable_stime_field' => $request->disable_stime_field,
            'disable_etime_field' => $request->disable_etime_field,
            'disable_date2' => $request->disable_date2,
            'disable_enddate2' => $request->disable_enddate2,
            'disable_time2' => $request->disable_time2,
            'disable_endtime2' => $request->disable_endtime2,
            'disable_stime_field2' => $request->disable_stime_field2,
            'disable_etime_field2' => $request->disable_etime_field2
        ]);

        return response()->json([
            'success' => 1
        ]);
    }
}
