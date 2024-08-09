<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Lib\Helper;
use App\Models\OpenOrders;
use App\Models\Orders;
use App\Models\InTransit;
use App\Models\DelayedOrders;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Stores;
use App\Models\Inventory;
use App\Models\InventoryDates;
use App\Models\InventoryCount;
use App\Models\ProductCounts;
use App\Models\Shipments;
use App\Models\SafeLists;
use App\Models\EditOpenOrders;
use App\Models\ClientProducts;
use App\Models\ClientOrders;

class GlobalController extends Controller
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

    public function search(Request $request)
    {

        $storeids = $this->helper->getuser_storeid(true);
        $searchval = $request->searchtext;

        $openorders = $returnorders = $intransitcount = $delayedcount = $receivingcount = $shipmentcount = $nostockcount =  $safelistcount = $edithistorycount = $inventorycount = $masterinventorycount = $allOrders =  0;

        if ($searchval != "") {
            $openorders = $this->openordersCount($searchval);
            $returnorders = $this->returnordersCount($searchval);
            $intransitcount = $this->intransitordersCount($searchval);
            $delayedcount = $this->delayedordersCount($searchval);
            $receivingcount = $this->inventoryreceivingCount($searchval);
            $shipmentcount = $this->inventoryshipmentCount($searchval);
            $nostockcount = $this->inventorynostockCount($searchval);
            $safelistcount = $this->safelistsCount($searchval);
            $edithistorycount = $this->editedhistoryCount($searchval);
            $inventorycount = $this->inventoryTrackerCount($searchval);
            $masterinventorycount = $this->masterInventoryTrackerCount($searchval);
            $allOrders = $this->allOrders($searchval);
        }

        return response()->json([
            'success' => true,
            'receiving' => $receivingcount,
            'shipment' => $shipmentcount,
            'nostocks' => $nostockcount,
            'safelist' => $safelistcount,
            'editedhistory' => $edithistorycount,
            'inventorytracker' => $inventorycount,
            'masterinventorytracker' => $masterinventorycount,
            'allOrders' => $allOrders
        ]);
    }

    public function allOrders($searchtext)
    {
        $storeids = $this->helper->getuser_storeid(true);
        $orders = ClientOrders::leftJoin(
            "ClientShipmentsV2",
            "ClientShipmentsV2.ordernumber",
            "=",
            "ClientOrders.ordernumber"
        )->whereIn('Storeid', explode(',', $storeids));


        $orders->where('ClientOrders.ordernumber', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientOrders.OrderDate', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientOrders.ShipStreet1', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientOrders.ShipStreet2', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientOrders.ShipStreet3', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientOrders.ShipCity', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientOrders.ShipPostalCode', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientOrders.ShipStateProvCode', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientOrders.ShipCountryCode', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientShipmentsV2.TrackingNumber', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientShipmentsV2.ProcessedDate', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientShipmentsV2.Carrier', "LIKE", "%" . $searchtext . "%");
        $orders->orWhere('ClientShipmentsV2.ShippingService', "LIKE", "%" . $searchtext . "%");


        $orders->orderBy('ClientOrders.ordernumber', 'DESC');
        return $orders->count();
    }

    public function openordersCount($searchtext)
    {
        $storeids = $this->helper->getuser_storeid(true);

        $datefilter = '30';

        $filterqry = $this->helper->getfilter_query($datefilter, 'OrderDate');
        $wherestr = $filterqry['wherestr'];

        $orders = OpenOrders::whereIn('StoreID', explode(',', $storeids));
        $orders->$wherestr('OrderDate', $filterqry['wheremonthval']);

        $orders->whereNull('CancelOrder');

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereRaw('(isnull(isUKdata) = 1 or isUKdata = 0)');
        } else {
            $orders->where('isUKdata', 1);
        }

        $orders->whereRaw("(OrderNumber like '%" . $searchtext . "%' or FirstName like '%" . $searchtext . "%' or LastName like '%" . $searchtext . "%' or Address like '%" . $searchtext . "%' )");
        // $orders->whereRaw('RunDate=(select max(RunDate) FROM OpenOrders)');
        $ordercount = $orders->count();

        return $ordercount;
    }
    public function returnordersCount($searchtext)
    {
        $storeid = $this->helper->getuser_storeid();

        $wherearray = ['order_type' => 'Returns'];
        $wherearray['status'] = NULL;

        $datefilter = '30';
        $filterqry = $this->helper->getfilter_query($datefilter, 'order_date');
        $wherestr = $filterqry['wherestr'];

        $orders = Orders::where($wherearray);
        $orders->where('store_id', $storeid);
        // $orders->where('order_number', 'like', '%'.$searchtext.'%');              
        $orders->whereRaw("(order_number like '%" . $searchtext . "%' or buyer_name like '%" . $searchtext . "%' or tracking_number like '%" . $searchtext . "%')");
        // $orders->distinct();
        $orders->$wherestr('order_date', $filterqry['wheremonthval']);
        $ordercount = $orders->count();

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'UK') {
            $ordercount = 0;
        }
        return $ordercount;
    }
    public function intransitordersCount($searchtext)
    {
        $storeids = $this->helper->getuser_storeid(true);

        $datefilter = '30';
        $filterqry = $this->helper->getfilter_query($datefilter, 'ShipDate');
        $wherestr = $filterqry['wherestr'];

        $orders = InTransit::whereIn('StoreID', explode(',', $storeids));
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('Source');
        } else {
            $orders->where('Source', 'sheet');
        }

        $orders->whereRaw('RunDate=(select max(RunDate) FROM InTransit)');
        // $orders->where('OrderNumber', 'like', '%'.$searchtext.'%');
        $orders->whereRaw("(OrderNumber like '%" . $searchtext . "%' or CustomerEmail like '%" . $searchtext . "%' or TrackingNumber like '%" . $searchtext . "%')");
        $orders->$wherestr('ShipDate', $filterqry['wheremonthval']);
        $ordercount = $orders->count();
        return $ordercount;
    }
    public function delayedordersCount($searchtext)
    {
        $storeids = $this->helper->getuser_storeid(true);

        $datefilter = '30';
        $filterqry = $this->helper->getfilter_query($datefilter, 'ShipDate');
        $wherestr = $filterqry['wherestr'];

        $orders = DelayedOrders::whereIn('StoreID', explode(',', $storeids));
        $orders->whereIn('DeliveryStatus', ['Delayed', 'Exception']);
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('Source');
        } else {
            $orders->where('Source', 'sheet');
        }

        $orders->whereRaw('RunDate=(select max(RunDate) FROM DelayedShipments)');
        // $orders->where('OrderNumber', 'like', '%'.$searchtext.'%');
        $orders->whereRaw("(OrderNumber like '%" . $searchtext . "%' or CustomerEmail like '%" . $searchtext . "%' or TrackingNumber like '%" . $searchtext . "%')");
        $orders->$wherestr('ShipDate', $filterqry['wheremonthval']);
        $orders->distinct();
        $ordercount = $orders->count('OrderNumber');
        return $ordercount;
    }
    public function inventoryreceivingCount($searchtext)
    {
        $user = Auth::user();
        $userid = $user->id;
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($user->is_admin == 2) {
            $userid = $user->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
        $storename = $storeinfo->store_name;
        $storeid = $storeinfo->id;

        $datefilter = '30';
        $filterqry = $this->helper->getfilter_query($datefilter, 'OrderDate');
        $wheremonth = 'product_counts.date';
        $wherestr = $filterqry['wherestr'];


        $inventory = ProductCounts::join('products', 'products.id', '=', 'product_counts.product_id')->where('products.product_type', 'receiving');
        $inventory->select('product_counts.id as inventory_id', 'product_counts.date as inventory_date', 'products.title as title', 'products.sku as sku', 'product_counts.product_id as id', 'product_counts.count as inventory_count', 'product_counts.status as inventory_status', 'product_counts.notes as inventory_notes');

        $inventory->whereDate('product_counts.date', '>=', '2022-06-18');
        $inventory->whereNull('product_counts.status');
        $inventory->$wherestr($wheremonth, $filterqry['wheremonthval']);
        $inventory->where('products.title', '<>', '');
        $inventory->where('product_counts.count', '>', 0);
        $inventory->where('products.store_id', $storeid);
        $inventory->whereRaw("(products.title like '%" . $searchtext . "%' or products.sku like '%" . $searchtext . "%')");
        $productscount = $inventory->count();

        return $productscount;
    }
    public function inventoryshipmentCount($searchtext)
    {
        $user = Auth::user();
        $userid = $user->id;
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($user->is_admin == 2) {
            $userid = $user->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
        $storename = $storeinfo->store_name;
        $storeid = $storeinfo->id;

        $shipment = Shipments::where('shipment_title', '!=', '');
        $shipment->where('user_id', $userid);
        $shipment->where('archived', 0);
        $shipment->whereRaw("shipment_title like '%" . $searchtext . "%'");
        $shipmentcounts = $shipment->count();

        return $shipmentcounts;
    }
    public function inventorynostockCount($searchtext)
    {
        $user = Auth::user();
        $userid = $user->id;
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($user->is_admin == 2) {
            $userid = $user->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $storeids = $this->helper->getuser_storeid(true);

        $datefilter = '30';
        $filterqry = $this->helper->getfilter_query($datefilter, 'OrderDate');
        $wherestr = $filterqry['wherestr'];

        $masterinventory = Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')->whereIn('ClientProducts.StoreID', explode(',', $storeids));
        $masterinventory->select('ClientProducts.ProductName as item_name', 'ClientMasterInventory.SKU as sku', 'ClientMasterInventory.ClientProductinventoryID as master_inventory_id', 'ClientMasterInventory.Qty_onHand as qty_onhand', 'ClientProducts.Location as location', 'ClientProducts.CountryOfOrigin as origin', 'ClientProducts.Length as length', 'ClientProducts.Width as width', 'ClientProducts.Height as height', 'ClientProducts.Weight as weight');
        $masterinventory->where('qty_onhand', 0);
        // $masterinventory->groupBy('ClientProducts.sku');
        $masterinventory->whereRaw("(ClientProducts.ProductName like '%" . $searchtext . "%' or ClientProducts.sku like '%" . $searchtext . "%')");
        $masterinventory->distinct();
        $nostockcount = $masterinventory->count('ClientProducts.sku');

        return $nostockcount;
    }
    public function safelistsCount($searchtext)
    {
        $sortfield = 'Email';
        $sortascdesc = 'ASC';

        $lists = SafeLists::orderBy($sortfield, $sortascdesc);
        $lists->whereRaw("Email like '%" . $searchtext . "%'");
        $safelistcount = $lists->count();

        return $safelistcount;
    }
    public function editedhistoryCount($searchtext)
    {
        $storeids = $this->helper->getuser_storeid(true);

        $orders = EditOpenOrders::whereIn('StoreID', explode(',', $storeids));

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('isUKdata');
        } else {
            $orders->where('isUKdata', 1);
        }

        $orders->whereRaw("(OrderNumber like '%" . $searchtext . "%' or FirstName like '%" . $searchtext . "%' or LastName like '%" . $searchtext . "%' or Address like '%" . $searchtext . "%' or Address2 like '%" . $searchtext . "%' or Address3 like '%" . $searchtext . "%' or ShipCity like '%" . $searchtext . "%' or ShipState like '%" . $searchtext . "%' or Zipcode like '%" . $searchtext . "%' or Country like '%" . $searchtext . "%' or Reason like '%" . $searchtext . "%')");

        $editopenorders = $orders->count();


        return $editopenorders;
    }
    public function inventoryTrackerCount($searchtext)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $storeids = $this->helper->getuser_storeid(true);

        $products = ClientProducts::whereIn('StoreID', explode(',', $storeids));
        $products->whereRaw("(ProductName like '%" . $searchtext . "%' or SKU like '%" . $searchtext . "%')");
        //$products->where('isBundle', 'N');
        $inventorycount = $products->count();

        return $inventorycount;
    }
    public function masterInventoryTrackerCount($searchtext)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }

        $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
        $storename = $storeinfo->store_name;
        $storeids = explode(',', $storeinfo->store_ids);

        $masterinventory = Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')->whereIn('ClientProducts.StoreID', $storeids);
        $masterinventory->select('ClientMasterInventory.ClientProductinventoryID as ID', 'ClientProducts.ProductName as item_name', 'ClientMasterInventory.Inventory_Date as inventory_date', 'ClientMasterInventory.SKU as sku', 'ClientProducts.AliasSKU as aliassku', 'ClientMasterInventory.Qty_onHand as qtyonhand', 'ClientMasterInventory.Qty_Allocated as qtyallocated', 'ClientMasterInventory.Qty_toSell as qtytosell', 'ClientMasterInventory.Cumm_Shipment as cumm_shipment', 'ClientMasterInventory.DateManualCount as datemanualcount', 'ClientMasterInventory.ManualCount as manualcount');
        $masterinventory->whereRaw('ClientMasterInventory.Inventory_Date=(select max(ClientMasterInventory.Inventory_Date) FROM ClientMasterInventory)');
        $masterinventory->whereRaw("(ClientProducts.ProductName like '%" . $searchtext . "%' or ClientProducts.SKU like '%" . $searchtext . "%')");
        $inventorycount = $masterinventory->count();

        return $inventorycount;
    }
    public function getProductBySKU(Request $request)
    {

        $products = ClientProducts::where('SKU', $request->prodsku);
        $proddetails = $products->get();

        return response()->json([
            'success' => true,
            'productDetails' => $proddetails
        ]);
    }
}
