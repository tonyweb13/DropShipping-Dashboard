<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\OrderController as ClientOrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Orders;
use App\Models\HeldOrders;
use App\Models\OpenOrders;
use App\Models\EditOpenOrders;
use App\Models\InTransit;
use App\Models\DelayedOrders;
use App\Models\Stores;
use App\Models\CustomerSettings;
use App\Models\AdminStores;
use Carbon\Carbon;
use App\Lib\Helper;
use App\Mail\AppMail;
use DateTime;


class OrderController extends Controller
{

    /**
     * Fetch all orders
     * @param NoneordersReturns
     * @return JSON Orders
     * */
    public $helper;
    public $emailrecipient;
    public function __construct()
    {
        $this->helper = new Helper();

        $this->emailrecipient = env("PK_SUPPORT_EMAIL", "support@prepkanga.com");
    }

    public function editedadminhistory(Request $request)
    {
        $country_store = $request->country;
        $storeids = $this->getuser_storeid($request->store, $country_store);

        $sortfield = 'created_at';
        $sortascdesc = 'DESC';

        $orders = EditOpenOrders::whereIn('StoreID', explode(',', $storeids));
        if ($country_store == 'US') {
            $orders->whereNull('isUKdata');
        } else {
            $orders->where('isUKdata', 1);
        }
        $orders->whereNull('approved');

        $orders->orderBy($sortfield, $sortascdesc);
        $orders->orderBy('id', 'DESC');
        $openorders = $orders->get();

        return response()->json([
            'success' => true,
            'orders' => $openorders
        ]);
    }

    public function approved_order(Request $request)
    {
        OpenOrders::where('OrderNumber', $request->orderNumber)->update([
            'approved' => 1
        ]);
        EditOpenOrders::where('OrderNumber', $request->orderNumber)->update([
            'approved' => 1
        ]);

        return response()->json([
            'success' => true
        ]);
    }

    public function getuser_storeid($storeid, $country_store)
    {
        $storeinfo  = Stores::where('id', $storeid)->where('country', $country_store)->first();
        $storename = $storeinfo->store_name;
        $storeids = $storeinfo->store_ids;
        return $storeids;
    }

    public function ordersReturnsAdmin(Request $request)
    {
        $userid = ClientOrderController::getuser_id();

        $perpage = ($request->perpage != '') ? $request->perpage : 10;
        $wherearray = ['order_type' => 'Returns'];
        if (isset($request->statusfilter) != '') {
            $wherearray['item_condition'] = $request->statusfilter;
        }
        if (isset($request->sortfield) != '') {
            $sortfield = $request->sortfield;
            $sortascdesc = $request->sorting;
        } else {
            $sortfield = 'order_date';
            $sortascdesc = 'DESC';
        }

        if (isset($request->statusfield) != '') {
            $wherearray['status'] = $request->statusfield;
        } else {
            $wherearray['status'] = NULL;
        }

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'UK') {
            $returnorders = [];
        }

        $orders = Orders::where($wherearray);
        $orders->orderBy($sortfield, $sortascdesc);
        $returnorders = $orders->get();

        $key_per_country = 'return_' . $country_store . '_sync_date';
        $return_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();

        // $storeidonly = $this->getuser_storeid($request->store, $country_store);
        $checkdisable = $this->helper->checkdisableopenorder($request->store_id);
        $editing_status = $checkdisable['editstatus'];

        return response()->json([
            'success' => true,
            'syncdatetime' => !empty($return_sync_date) ? date('F d, Y h:i:s A', strtotime($return_sync_date->option_value)) : 'No Data',
            'orders' => $returnorders,
            'editing_status' => $editing_status
        ]);
    }

    public function packingConditionList()
    {
        $packing = Orders::select('packing_condition')
            ->where('packing_condition', '!=', '')
            ->distinct()
            ->get();

        return response()->json([
            'success' => true,
            'packing' => $packing,
        ]);
    }

    public function itemConditionList()
    {
        $item = Orders::select('item_condition')
            ->where('item_condition', '!=', '')
            ->distinct()
            ->get();

        return response()->json([
            'success' => true,
            'item' => $item,
        ]);
    }

    public function AdminStoreList()
    {
        $stores = AdminStores::orderBy('StoreID')->get();

        return response()->json([
            'success' => true,
            'stores' => $stores,
        ]);
    }

    public function ShippingCountryList()
    {
        $shipping = Orders::select('shipping_country')
            ->where('shipping_country', '!=', '')
            ->where('shipping_country', '<=', 0)
            ->orderBy('shipping_country')
            ->distinct()
            ->get();

        return response()->json([
            'success' => true,
            'shipping' => $shipping,
        ]);
    }

    /**
     * Add New Order Returns in Admin Page
     * @param Request customer data
     * @return Success
     * */
    public function addUpdateOrderReturn(Request $request)
    {
        $request->validate([
            'return_store_id' => ['required'],
            'shipping_country' => ['required'],
            'order_date' => ['required'],
            'order_number' => ['required'],
            'buyer_name' => ['required'],
            'buyer_street_number' => ['required'],
            'buyer_postal_code' => ['required'],
            'tracking_number' => ['required'],
            'packing_condition' => ['required'],
            'item_condition' => ['required'],
            'no_items_returned' => ['required'],
            'postage_due' => ['required'],
            'billed_return' => ['required'],
        ]);

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'UK') {
            $country_store = 'UK';
        }

        $storeinfo  = Stores::where('country', $country_store)->first();
        $date =  date_create($request->order_date);
        $order_date = date_format($date, 'Y-m-d H:i:s');
        $getStoreName = AdminStores::where('StoreID', $request->return_store_id)->first();

        if ($request->return_order_id && $request->return_store_id) {
            Orders::where('id', $request->return_order_id)
                ->where('order_type', 'Returns')
                ->update([
                    'store_id' => $storeinfo->id,
                    'store_name' => $getStoreName->StoreName,
                    'return_store_id' => $request->return_store_id,
                    'order_date' => $order_date,
                    'order_number' => $request->order_number,
                    'tracking_number' => $request->tracking_number,
                    'shipping_country' => $request->shipping_country,
                    'buyer_name' => $request->buyer_name,
                    'buyer_street_number' => $request->buyer_street_number,
                    'buyer_postal_code' => $request->buyer_postal_code,
                    'packing_condition' => $request->packing_condition,
                    'item_condition' => $request->item_condition,
                    'return_notes' => $request->return_notes,
                    'no_items_returned' => $request->no_items_returned,
                    'postage_due' => $request->postage_due,
                    'billed_return' => $request->billed_return,
                ]);
        } else {
            Orders::create([
                'store_id' => $storeinfo->id,
                'store_name' => $getStoreName->StoreName,
                'return_store_id' => $request->return_store_id,
                'order_date' => $order_date,
                'order_number' => $request->order_number,
                'tracking_number' => $request->tracking_number,
                'shipping_country' => $request->shipping_country,
                'buyer_name' => $request->buyer_name,
                'buyer_street_number' => $request->buyer_street_number,
                'buyer_postal_code' => $request->buyer_postal_code,
                'packing_condition' => $request->packing_condition,
                'item_condition' => $request->item_condition,
                'return_notes' => $request->return_notes,
                'no_items_returned' => $request->no_items_returned,
                'postage_due' => $request->postage_due,
                'billed_return' => $request->billed_return,
                'order_type' => 'Returns'
            ]);
        }

        return response()->json([
            'success' => true
        ]);
    }

    public function showReturnOrderAdmin($id)
    {
        $order = Orders::where('order_type', 'Returns')
            ->leftJoin("Stores", "Stores.StoreID", "=", "orders.return_store_id")
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }
}
