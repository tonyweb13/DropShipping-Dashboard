<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Stores;
use App\Models\Inventory;
use App\Models\InventoryDates;
use App\Models\InventoryCount;
use App\Models\ReceivingNotes;
use App\Models\ProductCounts;
use App\Models\ClientShipmentWholesale;
use App\Models\CustomerSettings;
use App\Models\ClientProducts;
use App\Models\ClientProductBundle;
use Carbon\Carbon;
use App\Lib\Helper;
use App\Mail\AppMail;
use DB;
use File;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Models\GeneralSettings;

class InventoryController extends Controller
{
    public $helper;
    public $emailrecipient;
    public function __construct()
    {
        $this->helper = new Helper();

        $this->emailrecipient = env("PK_SUPPORT_EMAIL", "support@prepkanga.com");
    }

    /**
     * Fetch all inventory
     * @param None
     * @return JSON inventories
     * */
    public function index(Request $request)
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

        $date = ($request->date != '') ? date('Y-m-d', strtotime($request->date)) : date('Y-m-d');
        $perpage = ($request->perpage != '') ? $request->perpage : 10;
        $producttype = ($request->producttype != '') ? $request->producttype : 'stock';
        // if($producttype != 'receiving') {
        //     $date = date('Y-m-d', strtotime($date));

        // }
        if (isset($request->sortfield) != '') {
            switch ($request->sortfield) {
                case "inventory_date":
                    $sortfield = 'inventory_dates.date';
                    break;
                case "title":
                    $sortfield = 'products.title';
                    break;
                case "sku":
                    $sortfield = 'products.sku';
                    break;
                case "inventory_count":
                    $sortfield = 'inventory_counts.count';
                    break;
            }

            $sortascdesc = $request->sorting;
        } else {
            $sortfield = 'inventory_date';
            $sortascdesc = 'DESC';
        }
        $inventorydate = InventoryDates::join('inventory_counts', 'inventory_counts.inventorydate_id', '=', 'inventory_dates.id')->join('products', 'products.id', '=', 'inventory_counts.product_id')->where('inventory_dates.date_type', $producttype);

        if ($request->stocktype == 'no-stock') {
            $inventorydate->select('inventory_dates.date as inventory_date', 'products.title as title', 'products.sku as sku', 'inventory_counts.product_id as id', 'products.inventory_count as inventory_count');
        } elseif ($request->stocktype == 'low-stock') {
        } elseif ($request->stocktype == 'stock') {
            $inventorydate->select('inventory_dates.date as inventory_date', 'products.title as title', 'products.sku as sku', 'inventory_counts.product_id as id', 'products.inventory_count as inventory_count', 'inventory_counts.count as ship_count');
        } else {
            $inventorydate->select('inventory_counts.id as inventory_id', 'inventory_dates.date as inventory_date', 'products.title as title', 'products.sku as sku', 'inventory_counts.product_id as id', 'inventory_counts.count as inventory_count', 'inventory_counts.status as inventory_status', 'inventory_counts.notes as inventory_notes');

            if (empty($request->statusfilter)) {
                if ($request->history == 'old') {
                    $inventorydate->whereDate('inventory_dates.date', '<=', '2022-06-17');
                } else {
                    $inventorydate->whereDate('inventory_dates.date', '>=', '2022-06-18');
                }
            }
        }

        // Filter by status
        if (!empty($request->statusfilter)) {
            $inventorydate->where('inventory_counts.status', $request->statusfilter);
        } else {
            if ($request->stocktype == 'receiving') {
                $inventorydate->whereNull('inventory_counts.status');
            }
        }

        $inventorydate->where('products.title', '<>', '');
        $inventorydate->where('products.store_id', $storeid);
        if ($request->stocktype == 'no-stock') {
            $inventorydate->where('products.inventory_count', 0);
        }
        $inventorydate->orderBy($sortfield, $sortascdesc);
        // $inventorydate->distinct('products.sku');
        $products = $inventorydate->get();

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }

    public function getReceivingProducts(Request $request)
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
        $storeids = explode(',', $storeinfo->store_ids);

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';

        // get all query for filters
        if ($datefilter == 'custom') {
            $filterqry = $this->helper->getfilter_query($datefilter, 'product_counts.date', $request->start_date, $request->end_date);
        } else {
            $filterqry = $this->helper->getfilter_query($datefilter, 'product_counts.date');
        }

        $wherestr = $filterqry['wherestr'];

        $date = ($request->date != '') ? date('Y-m-d', strtotime($request->date)) : date('Y-m-d');
        $perpage = ($request->perpage != '') ? $request->perpage : 10;

        if (isset($request->sortfield) != '') {
            switch ($request->sortfield) {
                case "inventory_date":
                    $sortfield = 'product_counts.date';
                    break;
                case "title":
                    $sortfield = 'products.title';
                    break;
                case "sku":
                    $sortfield = 'products.sku';
                    break;
                case "inventory_count":
                    $sortfield = 'product_counts.count';
                    break;
            }

            $sortascdesc = $request->sorting;
        } else {
            $sortfield = 'inventory_date';
            $sortascdesc = 'DESC';
        }

        $inventory = ProductCounts::join('ClientProducts', 'ClientProducts.ProductVariantID', '=', 'product_counts.product_id');
        $inventory->select('product_counts.id as inventory_id', 'product_counts.date as inventory_date', 'ClientProducts.ProductName as title', 'ClientProducts.SKU as sku', 'product_counts.product_id as id', 'product_counts.count as inventory_count', 'product_counts.status as inventory_status', 'product_counts.notes as inventory_notes');

        if ($filterqry['wheretype'] == 'days') :
            $inventory->$wherestr($filterqry['whereclause']);
        else :
            $inventory->$wherestr('product_counts.date', $filterqry['wheremonthval']);
        endif;

        if (!empty($request->statusfilter)) {
            $inventory->where('product_counts.status', $request->statusfilter);
        } else {
            $inventory->whereNull('product_counts.status');
        }

        if ($country_store !== 'UK') {
            $inventory->whereRaw('(product_counts.country is null or product_counts.country <> "UK")');
        } else {
            $inventory->where('product_counts.country', 'UK');
        }
        $inventory->whereIn('ClientProducts.StoreID', $storeids);
        $inventory->orderBy($sortfield, $sortascdesc);
        $products = $inventory->get();

        $key_per_country = 'receiving_' . $country_store . '_sync_date';
        $receiving_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();

        return response()->json([
            'success' => true,
            'syncdatetime' => !empty($receiving_sync_date) ? date('F d, Y h:i:s A', strtotime($receiving_sync_date->option_value)) : 'No Data',
            'products' => $products,
            'date_range' => $filterqry['wheremonthval']
        ]);
    }

    public function getWholesaleReceivingProducts(Request $request)
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

        $inventory = ClientShipmentWholesale::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientShipmentWholesale.SKU')
            ->whereIn('ClientShipmentWholesale.StoreID', $storeids);
        $inventory->select('ClientShipmentWholesale.ShipmentWholesaleID as inventory_id', 'ClientShipmentWholesale.theDate as inventory_date', 'ClientProducts.ProductName as title', 'ClientProducts.SKU as sku', 'ClientShipmentWholesale.Qty as inventory_count', 'ClientShipmentWholesale.Destination as destination');
        $inventory->orderBy('ClientShipmentWholesale.theDate', 'ASC');
        $products = $inventory->get();

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }

    public function addNewReceivingItem(Request $request)
    {
        $validation = $request->validate([
            'checkindate' => ['required'],
            'product' => ['required', 'not_in:0'],
            'quantity' => ['required', 'numeric']
        ]);

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

        ProductCounts::create([
            'product_id' => $request->product,
            'date' => $request->checkindate,
            'store_id' => $storeids[0],
            'country' => $country_store,
            'count' => $request->quantity
        ]);

        $this->updateInventoryQtyPending($storeinfo->store_ids, $storeids, $request->product);

        return response()->json([
            'success' => true
        ]);
    }

    public function editReceivingItem(Request $request)
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

        $validation = $request->validate([
            'checkindate' => ['required'],
            'product' => ['required'],
            'quantity' => ['required']
        ]);

        ProductCounts::where('id', $request->inventory_id)->update([
            'product_id' => $request->product,
            'date' => $request->checkindate,
            'count' => $request->quantity
        ]);

        $this->updateInventoryQtyPending($storeinfo->store_ids, $storeids, $request->product);

        return response()->json([
            'success' => true
        ]);
    }

    private function updateInventoryQtyPending($storeinfo_ids, $stores, $product_id)
    {
        $getExistQtyPending = Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')
            ->whereIn('ClientProducts.StoreID', $stores)
            ->where('ClientProducts.ProductVariantID', $product_id)
            ->whereRaw('ClientMasterInventory.Inventory_Date=(select max(ClientMasterInventory.Inventory_Date) FROM ClientMasterInventory WHERE ClientMasterInventory.StoreID IN (' . $storeinfo_ids . ')
            AND (ClientMasterInventory.isUKdata is null or ClientMasterInventory.isUKdata = 0))')
            ->whereRaw('(ClientMasterInventory.isUKdata is null or ClientMasterInventory.isUKdata = 0)')
            ->get(['ProductVariantID', 'QTY_Pending', 'Inventory_Date']);

        $quantity = ProductCounts::join('ClientProducts', 'ClientProducts.ProductVariantID', '=', 'product_counts.product_id')
            ->where('product_counts.status', NULL)
            ->whereRaw('(product_counts.country is null or product_counts.country <> "UK")')
            ->whereIn('ClientProducts.StoreID', $stores)
            ->where('product_counts.product_id', $product_id)
            ->sum('product_counts.count');
        $quantity == 0 ? NULL : $quantity;

        if (count($getExistQtyPending) > 0) {
            Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')
                ->whereIn('ClientProducts.StoreID', $stores)
                ->where('ClientProducts.ProductVariantID', $product_id)
                ->where('Inventory_Date', $getExistQtyPending[0]['Inventory_Date'])
                ->update(['Qty_Pending' => $quantity]);
        } else {
            Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')
                ->whereIn('ClientProducts.StoreID', $stores)
                ->where('ClientProducts.ProductVariantID', $product_id)
                ->update(['Qty_Pending' => $quantity]);
        }
    }

    public function getReceivingItem(Request $request)
    {
        $storeids = $this->getuser_storeid(true);
        $products = ClientProducts::whereIn('StoreID', explode(',', $storeids));
        $products->where('isBundle', 'N');
        $products->whereRaw("(status is Null or status !='Pending')");
        $products->orderBy("AliasSKU1", 'ASC');
        $lists = $products->get();

        $productcounts = ProductCounts::where('id', $request->inventoryid)->first();
        $selectedproduct = ClientProducts::where('ProductVariantID', $productcounts->product_id)->first();

        return response()->json([
            'success'   => true,
            'receiving' => $productcounts,
            'selectedproduct' => $selectedproduct,
            'products'  => $lists
        ]);
    }

    public function addNewWholesaleReceivingItem(Request $request)
    {
        $validation = $request->validate([
            'checkindate' => ['required'],
            'product' => ['required'],
            'quantity' => ['required', 'not_in:0'],
            'destination' => ['required'],
        ]);

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
        $storeids = explode(',', $storeinfo->store_ids);

        ClientShipmentWholesale::create([
            'theDate' => $request->checkindate,
            'SKU' => $request->product,
            'Qty' => $request->quantity,
            'Destination' => $request->destination,
            'StoreID' => $storeids[0]
        ]);

        return response()->json([
            'success' => true
        ]);
    }

    public function nostockResults(Request $request)
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
        $storeids = $this->getuser_storeid(true);

        $masterinventory = Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')->whereIn('ClientProducts.StoreID', explode(',', $storeids));
        $masterinventory->select('ClientProducts.AliasSKU1 as item_name', 'ClientMasterInventory.SKU as sku', 'ClientMasterInventory.ClientProductinventoryID as master_inventory_id', 'ClientMasterInventory.Qty_onHand as qty_onhand', 'ClientProducts.Location as location', 'ClientProducts.CountryOfOrigin as origin', 'ClientProducts.Length as length', 'ClientProducts.Width as width', 'ClientProducts.Height as height', 'ClientProducts.Weight as weight');
        $masterinventory->where('qty_onhand', 0);
        $masterinventory->whereRaw('ClientMasterInventory.Inventory_Date=(select max(ClientMasterInventory.Inventory_Date) FROM ClientMasterInventory)');
        $masterinventory->groupBy('sku');
        $products = $masterinventory->get();

        $key_per_country = 'masterinventory_' . $country_store . '_sync_date';
        $masterinventory_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();

        return response()->json([
            'success' => true,
            'syncdatetime' => !empty($masterinventory_sync_date) ? date('F d, Y h:i:s A', strtotime($masterinventory_sync_date->option_value)) : 'No Data',
            'products' => $products
        ]);
    }

    /**
     * Return chart data
     * @param Request filterdate
     * @return JSON array
     **/
    public function inventoryChatData(Request $request)
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

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '7days';
        $defaultlabels = $this->helper->getLabelStr($datefilter, true);

        $filterqry = $this->helper->getFilterQuery($datefilter, 'date');
        $wherestr = $filterqry['wherestr'];

        $startdate = date('Y-m-d', strtotime($defaultlabels['start']));
        $enddate = date('Y-m-d', strtotime($defaultlabels['end']));
        if ($filterqry['wheretype'] == 'months') {
            $startdate = date('Y-m-d', strtotime($filterqry['wheremonthval'][0]));
            $enddate = date('Y-m-d', strtotime($filterqry['wheremonthval'][1]));
        }

        $all_productdates = InventoryDates::where('date_type', 'stock')
            ->whereBetween('date', [$startdate, $enddate])
            ->get();

        $labelarray = [];
        $datasetarray = [];
        if (!empty($all_productdates)) {
            foreach ($all_productdates as $productdate) :
                $orderdate = date('Y-m-d', strtotime($productdate->date));
                $receivecount = InventoryCount::join('products', 'products.id', '=', 'inventory_counts.product_id')->where('inventory_counts.inventorydate_id', $productdate->id)->where('products.title', '<>', '')->where('products.store_id', $storeid)->sum('inventory_counts.count');
                $datasetarray[$orderdate] = $receivecount;
            endforeach;
        }

        $datachart = [];
        $bymonthar = [];
        if ($datefilter == 'thisweek' || $datefilter == '7days' || $datefilter == '30days' || $datefilter == 'thismonth' || $datefilter == 'lastmonth') :
            // labels and data for single dates
            foreach ($defaultlabels['betweendates'] as $datelabels) :
                $labelarray[] = $datelabels;
                $datachart[] = (array_key_exists($datelabels, $datasetarray)) ? $datasetarray[$datelabels] : 0;
            endforeach;
        else :
            // labels and data for months
            foreach ($defaultlabels['betweendates'] as $datelabels) :
                $ymonth_key = date('Y-m', strtotime($datelabels));
                $bymonthar[$ymonth_key][] = (array_key_exists($datelabels, $datasetarray)) ? $datasetarray[$datelabels] : 0;
            endforeach;
            foreach ($bymonthar as $key => $val) :
                $ymon_today = date("Y-m");
                if ($datefilter == 'last12months') :
                    // if last 12 months don't include current month
                    if ($ymon_today != $key) :
                        $labelarray[] = date('F', strtotime($key));
                        $datachart[] = array_sum($bymonthar[$key]);
                    endif;
                else :
                    $labelarray[] = date('F', strtotime($key));
                    $datachart[] = array_sum($bymonthar[$key]);
                endif;
            endforeach;
        endif;

        $labels = $labelarray;

        $dataset = [
            'type' => 'line',
            'label' => 'ORDERS SHIPPED',
            'borderColor' => '#AA5539',
            'backgroundColor' => '#AA5539',
            'fill' => true,
            'data' => $datachart,
            'lineTension' => 0.1,
            'borderWidth' => 2,
            'pointRadius' => 5
        ];
        return response()->json([
            'chartlabel' => $labels,
            'chartdataset' => $dataset
        ]);
    }

    /**
     * Add Receiving product
     * @param Request product data
     * @return Success
     * */
    public function addReceiving(Request $request)
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
        $user = User::where('id', $userid)->first();

        $validation = $request->validate([
            'status' => ['required']
        ]);

        $productcounts = ProductCounts::where('id', $request->inventory_id)->first();
        $inventory = ClientProducts::where('ProductVariantID', $productcounts->product_id)->first();

        ProductCounts::where('id', $request->inventory_id)->update([
            'status' => $request->status,
            'notes' => !empty($request->notes) ? $request->notes : $productcounts->notes,
        ]);

        $filename = '';
        if ($request->hasFile('files')) {
            $file = $request->file('files');

            $path = public_path('storage/uploads') . '/' . $userid;
            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0777, true, true);
            }

            $extension = $file->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            $file->move($path, $filename);
        }

        if (!empty($request->notes) || !empty($filename)) {
            ReceivingNotes::create([
                'note_added' => date('Y-m-d H:i:s'),
                'product_count_id' => $request->inventory_id,
                'notes' => $request->notes,
                'upload'   => $filename,
                'added_by' => $userinfo->id,
                'added_by_name' => $userinfo->first_name
            ]);
        }

        $storeinfo = Stores::where('user_id', $userid)
            ->where('country', $country_store)->first();
        $storeids = explode(',', $storeinfo->store_ids);

        $this->updateInventoryQtyPending($storeinfo->store_ids, $storeids, $productcounts->product_id);

        // Send email
        $details = array(
            'subject' => 'Receiving updated.',
            'heading' => 'Receiving updated.',
            'template' => 'receiving'
        );

        $details['checkin'] = $productcounts->date;
        $details['title'] = $inventory->AliasSKU1;
        $details['sku'] = $inventory->SKU;
        $details['count'] = $productcounts->count;

        if (!empty($request->status)) {
            $details['status'] = $request->status;
        }
        if (!empty($request->notes)) {
            $details['notes'] = $request->notes;
        }
        if (!empty($filename)) {
            $filepath = public_path('storage/uploads') . '/' . $userid . '/' . $filename;
            $details['filename'] = $filepath;
        }
        Mail::to($this->emailrecipient)->send(new AppMail($details));

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Add Receiving Items product
     * @param Request product data
     * @return Success
     * */
    public function addReceivingItems(Request $request)
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
        $user = User::where('id', $userid)->first();

        if (!empty($request->inventory_ids)) {
            // Send email
            $details = array(
                'subject' => 'Receiving items updated.',
                'heading' => 'Receiving items updated.',
                'template' => 'receivingitems'
            );

            $inventory_ids = json_decode($request->inventory_ids, true);
            $receivingitems = [];
            $receivingids = [];
            foreach ($inventory_ids as $inventory_id) {
                $receivingids[] = $inventory_id['inventory_id'];

                $productcounts = ProductCounts::where('id', $inventory_id['inventory_id'])->first();
                $inventory = ClientProducts::where('ProductVariantID', $productcounts->product_id)->first();

                $receivingitems[] = array(
                    'checkin' => $productcounts->date,
                    'title' => $inventory->AliasSKU1,
                    'sku' => $inventory->SKU,
                    'count' => $productcounts->count
                );
            }

            $details['receivingitems'] = $receivingitems;

            $status = ($request->status == 'Restore') ? NULL : $request->status;

            if (!empty($receivingids)) {
                ProductCounts::whereIn('id', $receivingids)->update([
                    'status' => $status
                ]);
            }

            if (!empty($status)) {
                $details['status'] = $status;

                Mail::to($this->emailrecipient)->send(new AppMail($details));
            }
        }

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Add Bundle Items product
     * @param Request product data
     * @return Success
     * */
    public function addNewBundleItem(Request $request)
    {

        $validation = $request->validate([
            'skus' => ['required'],
            'bundle_sku' => ['required'],
            'quantity' => ['required'],
            'name' => ['required'],
            'alias' => ['required'],
        ], [
            'skus.required' => 'Please select products.',
            'name.required' => 'Bundle Name is required.',
            'bundle_sku.required' => 'Bundle SKU is required.',
            'alias.required' => 'Bundle Alias is required.',
        ]);

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

        if (!empty($request->skus)) {

            // Save bundle
            $product = ClientProducts::create([
                'SKU' => $request->bundle_sku,
                'ProductName' => $request->name,
                'Location' => $request->location,
                'Weight' => $request->weight,
                'Length' => $request->length,
                'Height' => $request->height,
                'Width' => $request->width,
                'CountryOfOrigin' => $request->origin,
                'AliasSKU1' => $request->alias_sku,
                'StoreID' => $storeids[0],
                'status' => 'Hold',
                'isBundle' => 'Y',
                'created_by' => $userid
            ]);

            $bundle_skus = json_decode($request->skus, true);
            foreach ($bundle_skus as $bundle_sku) {
                ClientProductBundle::create([
                    'BundleSKU' => $request->bundle_sku,
                    'SKUIncluded' => $bundle_sku['sku'],
                    'Qty' => $bundle_sku['qty'],
                    'ProdBundleStatus' => 'Pending'
                ]);
            }
        }

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Edit Bundle Items product
     * @param Request product data
     * @return Success
     * */
    public function editBundleItem(Request $request)
    {

        $validation = $request->validate([
            'skus' => ['required'],
            'bundle_sku' => ['required'],
            'quantity' => ['required'],
            'name' => ['required'],
            'alias' => ['required'],
        ]);

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

        if (!empty($request->skus)) {

            // Delete assign skus
            ClientProductBundle::where('BundleSKU', $request->editsku)->delete();

            // Update bundle
            $product = ClientProducts::where('SKU', $request->editsku)->update([
                'SKU' => $request->bundle_sku,
                'ProductName' => $request->name,
                'Location' => $request->location,
                'Weight' => $request->weight,
                'Length' => $request->length,
                'Height' => $request->height,
                'Width' => $request->width,
                'AliasSKU1' => $request->alias,
                'CountryOfOrigin' => $request->origin,
                'AliasSKU' => $request->alias_sku
            ]);

            $bundle_skus = json_decode($request->skus, true);
            foreach ($bundle_skus as $bundle_sku) {
                ClientProductBundle::create([
                    'BundleSKU' => $request->bundle_sku,
                    'SKUIncluded' => $bundle_sku['sku'],
                    'Qty' => $bundle_sku['qty'],
                    'ProdBundleStatus' => 'Pending'
                ]);
            }
        }

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Delete Bundle Items product
     * @param Request product data
     * @return Success
     * */
    public function deleteBundleItem(Request $request)
    {
        $sku = $request->sku;
        ClientProductBundle::where('BundleSKU', $sku)->delete();
        ClientProducts::where('SKU', $sku)->delete();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Delete Receiving Item
     * @param Request data
     * @return Success
     * */
    public function deleteReceivingItem(Request $request)
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
        $storeinfo = Stores::where('user_id', $userid)
            ->where('country', $country_store)->first();
        $storeids = explode(',', $storeinfo->store_ids);

        $this->updateInventoryQtyPending($storeinfo->store_ids, $storeids, $request->product);

        $id = $request->inventory_id;
        ProductCounts::where('id', $id)->delete();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Change Direct Status product
     * @param Request product data
     * @return Success
     * */
    public function changeReceivingStatus(Request $request)
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
        $user = User::where('id', $userid)->first();

        $productcounts = ProductCounts::where('id', $request->inventory_id)->first();
        $inventory = ClientProducts::where('ProductVariantID', $productcounts->product_id)->first();

        ProductCounts::where('id', $request->inventory_id)
            ->update([
                'status' => $request->status,
            ]);

        if ($request->status == 'Approved') {
            /*Remove  Inventory Qty Pending */
            $storeinfo  = Stores::where('user_id', $userid)
                ->where('country', $country_store)->first();
            $storeids = explode(',', $storeinfo->store_ids);

            $this->updateInventoryQtyPending($storeinfo->store_ids, $storeids, $productcounts->product_id);

            // Send email
            $details = array(
                'subject' => 'Receiving updated.',
                'heading' => 'Receiving updated.',
                'template' => 'receiving'
            );

            $details['checkin'] = $productcounts->date;
            $details['title'] = $inventory->AliasSKU1;
            $details['sku'] = $inventory->SKU;
            $details['count'] = $productcounts->count;

            if (!empty($request->status)) {
                $details['status'] = $request->status;
            }

            Mail::to($this->emailrecipient)->send(new AppMail($details));
        }

        return response()->json([
            'success' => true
        ]);
    }

    public function receivingCounts(Request $request)
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
        $storeids = explode(',', $storeinfo->store_ids);

        $datefilter = ($request->receivecount != '') ? $request->receivecount : '30days';
        $wheremonth = 'product_counts.date';
        $filterqry = $this->helper->getfilter_query($datefilter, $wheremonth);
        $wherestr = $filterqry['wherestr'];



        $inventory = ProductCounts::join('ClientProducts', 'ClientProducts.ProductVariantID', '=', 'product_counts.product_id');
        $inventory->select('product_counts.id as inventory_id', 'product_counts.date as inventory_date', 'ClientProducts.AliasSKU1 as title', 'ClientProducts.SKU as sku', 'product_counts.product_id as id', 'product_counts.count as inventory_count', 'product_counts.status as inventory_status', 'product_counts.notes as inventory_notes');

        $inventory->whereNull('product_counts.status');

        if ($country_store !== 'UK') {
            $inventory->whereRaw('(product_counts.country is null or product_counts.country <> "UK")');
        } else {
            $inventory->where('product_counts.country', 'UK');
        }

        $inventory->where('product_counts.count', '>', 0);
        $inventory->whereIn('ClientProducts.StoreID', $storeids);

        if ($filterqry['wheretype'] == 'days') :
            $inventory->$wherestr($filterqry['whereclause']);
        else :
            $inventory->$wherestr($wheremonth, $filterqry['wheremonthval']);
        endif;

        $receivecounts = $inventory->count();

        return response()->json([
            'success' => true,
            'countreceive' => $receivecounts
        ]);
    }

    public function nostockCount(Request $request)
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
        $storeids = $this->getuser_storeid(true);

        $getcountrange = ($request->nostockrange != '') ? $request->nostockrange : 30;

        $datefrom = ($getcountrange == 30) ? date('Y-m-d', strtotime('-30 days')) : date('Y-m-d', strtotime('-' . $getcountrange . ' days'));
        $dateto = date('Y-m-d', strtotime('+1 days'));

        $masterinventory = Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')->whereIn('ClientProducts.StoreID', explode(',', $storeids));
        $masterinventory->where('ClientMasterInventory.Qty_onHand', 0);
        $masterinventory->whereRaw('ClientMasterInventory.Inventory_Date=(select max(ClientMasterInventory.Inventory_Date) FROM ClientMasterInventory)');
        $masterinventory->whereBetween('ClientMasterInventory.Inventory_Date', [$datefrom, $dateto]);
        $masterinventory->groupBy('ClientMasterInventory.SKU');
        $outstockcount = $masterinventory->count();

        return response()->json([
            'success' => true,
            'countnostock' => $outstockcount
        ]);
    }

    public function lowstockCount(Request $request)
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
        $getcountrange = ($request->lowstockrange != '') ? $request->lowstockrange : 30;

        $all_products = Inventory::get()->all();
        $outstockcount = 0;
        $datefrom = ($getcountrange == 30) ? date('Y-m-d', strtotime('-30 days')) : date('Y-m-d', strtotime('-' . $getcountrange . ' month'));

        foreach ($all_products as $products) :
            $ship_data = \unserialize($products->ship_order_data);
            $hasstock = 0;

            foreach ($ship_data as $datekey => $dataval) :
                if ($datekey >= $datefrom) :
                    if ($dataval > 0) :
                        $hasstock++;
                        break;
                    endif;
                endif;
            endforeach;
            if ($hasstock == 0) :
                $outstockcount++;
            endif;

        // break;
        endforeach;

        return response()->json([
            'success' => true,
            'countlowstock' => $outstockcount
        ]);
    }

    public function getProduct(Request $request)
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
        $inventoryid = $request->inventoryid;

        $receivingnotes = ReceivingNotes::where('product_count_id', $inventoryid)->get();
        return response()->json([
            'success' => true,
            'storageurl' => asset('storage/uploads') . '/' . $userid . '/',
            'notes' => $receivingnotes
        ]);
    }

    public function storeProductCatalog(Request $request)
    {

        $formID = $request->formID;
        $formSKU = $request->formSKU;
        $formItemTitle = $request->formItemTitle;
        $formAliasSKU1 = $request->formAliasSKU1;
        $formAliasSKU2 = $request->formAliasSKU2;
        $formAliasSKU3 = $request->formAliasSKU3;
        $formAliasSKU4 = $request->formAliasSKU4;
        $formAliasSKU5 = $request->formAliasSKU5;
        $formTariffCode = $request->formTariffCode;
        $formCountryOfOrigin = $request->formCountryOfOrigin;
        $formDeclaredValue = $request->formDeclaredValue;
        $formWidth = $request->formWidth;
        $formLength = $request->formLength;
        $formHeight = $request->formHeight;
        $formWeight = $request->formWeight;
        $formSKUOldValue = $request->formSKUOldValue;
        $formStatus = $request->formStatus;
        $storeids = $this->getuser_storeid(true);
        $exploded = explode(',', $storeids);
        try {
            if (!$formID) {
                $checkSku = ClientProducts::where('SKU', $formSKU)->first();

                if ($checkSku) {
                    throw new HttpResponseException(response("SKU already exists", 422));
                } else {
                    ClientProducts::insert([
                        'SKU' => $formSKU,
                        'ProductName' => $formItemTitle,
                        'AliasSKU1' => $formAliasSKU1,
                        'AliasSKU2' => $formAliasSKU2,
                        'AliasSKU3' => $formAliasSKU3,
                        'AliasSKU4' => $formAliasSKU4,
                        'AliasSKU5' => $formAliasSKU5,
                        'TariffCode' => $formTariffCode,
                        'CountryOrigin' => $formCountryOfOrigin,
                        'DeclaredValue' => $formDeclaredValue,
                        'Width' => $formWidth,
                        'Length' => $formLength,
                        'Height' => $formHeight,
                        'Weight' => $formWeight,
                        'status' => 'Hold',
                        'StoreID' => $exploded[1]
                    ]);
                }
            } else {
                if ($formSKUOldValue !== $formSKU) {
                    $checkSku = ClientProducts::where('SKU', $formSKU)->first();

                    if ($checkSku) {
                        throw new HttpResponseException(response("SKU already exists", 422));
                    } else {
                        ClientProducts::where('ProductVariantID', $formID)
                            ->update([
                                'SKU' => $formSKU,
                                'ProductName' => $formItemTitle,
                                'AliasSKU1' => $formAliasSKU1,
                                'AliasSKU2' => $formAliasSKU2,
                                'AliasSKU3' => $formAliasSKU3,
                                'AliasSKU4' => $formAliasSKU4,
                                'AliasSKU5' => $formAliasSKU5,
                                'TariffCode' => $formTariffCode,
                                'CountryOrigin' => $formCountryOfOrigin,
                                'DeclaredValue' => $formDeclaredValue,
                                'Width' => $formWidth,
                                'Length' => $formLength,
                                'Height' => $formHeight,
                                'Weight' => $formWeight,
                                'status' => $formStatus,
                            ]);
                    }
                } else {
                    ClientProducts::where('ProductVariantID', $formID)
                        ->update([
                            'SKU' => $formSKU,
                            'ProductName' => $formItemTitle,
                            'AliasSKU1' => $formAliasSKU1,
                            'AliasSKU2' => $formAliasSKU2,
                            'AliasSKU3' => $formAliasSKU3,
                            'AliasSKU4' => $formAliasSKU4,
                            'AliasSKU5' => $formAliasSKU5,
                            'TariffCode' => $formTariffCode,
                            'CountryOrigin' => $formCountryOfOrigin,
                            'DeclaredValue' => $formDeclaredValue,
                            'Width' => $formWidth,
                            'Length' => $formLength,
                            'Height' => $formHeight,
                            'Weight' => $formWeight,
                            'status' => $formStatus,
                        ]);
                }
            }
        } catch (\Exception $e) {
            throw ($e);
        }
    }

    public function productslist(Request $request)
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
        $storeids = $this->getuser_storeid(true);

        $products = ClientProducts::whereIn('StoreID', explode(',', $storeids));
        $bundleStatus = $request->bundleStatus;
        
        $lists = "";
        if ($bundleStatus != 'Both' && $bundleStatus != null) {
            
            if ($request->search == 'null') {
                $products->orderBy("ProductName", 'ASC')->get();
                $lists = ClientProducts::whereIn('StoreID', explode(',', $storeids))
                    ->where('status', $request->show_pending)
                    ->where(function ($query) use ($bundleStatus) {
                        if ($bundleStatus === 'N') {
                            $query->where('isBundle', $bundleStatus)
                                ->orWhereNull('isBundle');
                        } else {
                            $query->where('isBundle', $bundleStatus);
                        }
                    })
                    ->orderBy("ProductName", 'ASC')
                    ->get();
            } else {
                
                $products->orderBy("ProductName", 'ASC')->get();
                $lists = ClientProducts::whereIn('StoreID', explode(',', $storeids))
                    ->whereRaw("(ProductName like '%" . $request->search . "%' or SKU like '%" . $request->search . "%')")
                    ->get();
            }
        } else {
            if ($request->search == 'null') {
                $products->orderBy("ProductName", 'ASC')->get();
                $lists = ClientProducts::whereIn('StoreID', explode(',', $storeids))
                    ->where('status', $request->show_pending)
                    ->orderBy("ProductName", 'ASC')
                    ->get();
            } else {
                $products->orderBy("ProductName", 'ASC')->get();
                $lists = ClientProducts::whereIn('StoreID', explode(',', $storeids))
                    ->whereRaw("(ProductName like '%" . $request->search . "%' or SKU like '%" . $request->search . "%')")
                    ->get();
            }
        }



        $getIsBundleInfo = $this->getIsBundleInfo();
        return response()->json([
            'success' => true,
            'products' => $lists,
            'product' => [],
            'isBundleAllowed' => $getIsBundleInfo,

        ]);
    }

    // public function productslist(Request $request)
    // {
    //     $userinfo = Auth::user();
    //     $userid = $userinfo->id;
    //     $country_store = session('country_store');
    //     if (empty($country_store)) {
    //         $country_store = 'US';
    //     }
    //     if ($userinfo->is_admin == 2) {
    //         $userid = $userinfo->client_user_id;
    //     }
    //     $customer_id = session('customer_id');
    //     if (!empty($customer_id)) {
    //         $userid = $customer_id;
    //     }
    //     $storeids = $this->getuser_storeid(true);

    //     $products = ClientProducts::whereIn('StoreID', explode(',', $storeids));
    //     if (!empty($request->producttype) && $request->producttype == 'bundle') {
    //         $products->where('isBundle', 'Y');
    //     } else {
    //         $products->where('isBundle', 'N');
    //     }
    //     if ($request->show_pending != '') {
    //         $products->where("status", 'Pending');
    //     } else {
    //         $products->whereRaw("(status is Null or status !='Pending')");
    //     }
    //     $products->orderBy("ProductAlias", 'ASC');
    //     $lists = $products->get();

    //     $editedproduct = [];
    //     if (!empty($request->edit)) {
    //         $allskus = ClientProductBundle::select('SKUIncluded', 'Qty')->where('BundleSKU', $request->edit)->get();
    //         $skus = [];
    //         $quantity = 0;
    //         foreach ($allskus as $allsku) {
    //             $quantity = $allsku->Qty;
    //             $skus[] = [
    //                 'sku' => $allsku->SKUIncluded,
    //                 'qty' => $allsku->Qty
    //             ];
    //         }
    //         $bundle = ClientProducts::where('SKU', $request->edit)->first();

    //         $editedproduct = [
    //             'skus' => $skus,
    //             'bundle_sku' => $bundle->SKU,
    //             'quantity' => $quantity,
    //             'name' => $bundle->ProductName,
    //             'location' => $bundle->Location,
    //             'weight' => $bundle->Weight,
    //             'length' => $bundle->Length,
    //             'height' => $bundle->Height,
    //             'width' => $bundle->Width,
    //             'alias' => $bundle->ProductAlias,
    //             'origin' => $bundle->CountryOfOrigin,
    //             'alias_sku' => $bundle->AliasSKU
    //         ];
    //     }


    //     $key_per_country = 'masterinventory_' . $country_store . '_sync_date';
    //     $masterinventory_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();
    //     //dd($lists);
    //     return response()->json([
    //         'success' => true,
    //         'syncdatetime' => !empty($masterinventory_sync_date) ? date('F d, Y h:i:s A', strtotime($masterinventory_sync_date->option_value)) : 'No Data',
    //         'products' => $lists,
    //         'product' => $editedproduct
    //     ]);
    // }

    public function addReceivingNotes(Request $request)
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
        $user = User::where('id', $userid)->first();



        $filename = '';
        if ($request->hasFile('files')) {
            $file = $request->file('files');

            $path = public_path('storage/uploads') . '/' . $userid;
            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0777, true, true);
            }

            $extension = $file->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            $file->move($path, $filename);
        }
        if ($request->notes != '') {
            ProductCounts::where('id', $request->inventory_id)->update([
                'notes' => $request->notes,
            ]);
        }
        if ($request->notes != '' || $request->notes_title || $filename != '') {
            ReceivingNotes::create([
                'note_added' => date('Y-m-d H:i:s'),
                'product_count_id' => $request->inventory_id,
                'notes' => $request->notes,
                'upload'   => $filename,
                'notes_title' => $request->notes_title,
                'added_by' => $userinfo->id,
                'added_by_name' => $userinfo->first_name
            ]);
        }

        return response()->json([
            'success' => true
        ]);
    }

    public function getStoreProducts(Request $request)
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

        $type = $request->producttype;

        $inventory = DB::table('products')->where('products.title', '<>', '');
        $inventory->where('product_type', $type);
        $inventory->where('store_id', $storeid);
        $products = $inventory->get();

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }

    public function getStoreClientProducts(Request $request)
    {
    }

    public function getIsBundleInfo()
    {
        $user = Auth::user();
        $customer_id = session('customer_id');
        $isBundleAllowed = 0;
        if (!empty($customer_id)) {
            $memberClient = User::whereId($customer_id)->first();
            if (!empty($memberClient->store)) {
                $isBundleAllowed = $memberClient->store->isBundleAllowed;
            }
        } else {
            if (!empty($user->is_admin) && $user->is_admin == 2) {
                $memberClient = User::whereId($user->client_user_id)->first();
                if (!empty($memberClient->store)) {
                    $isBundleAllowed = $memberClient->store->isBundleAllowed;
                }
            } else {
                if (!empty($user->store)) {

                    $isBundleAllowed = $user->store->isBundleAllowed;
                }
            }
        }

        return $isBundleAllowed;
    }

    public function getStoreMasterLists(Request $request)
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
        $bundleStatus = $request->bundleStatus;
        $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
        $storename = $storeinfo->store_name;
        $storeids = explode(',', $storeinfo->store_ids);

        $date = ($request->date != '') ? date('Y-m-d', strtotime($request->date)) : date('Y-m-d');
        $perpage = ($request->perpage != '') ? $request->perpage : 10;

        $sortfield = 'ClientProducts.AliasSKU1';
        $sortascdesc = 'ASC';


        $isUK_condition = 'ClientMasterInventory.isUKdata = 1';
        if ($country_store == 'US') {
            $isUK_condition = '(ClientMasterInventory.isUKdata is null or ClientMasterInventory.isUKdata = 0)';
        }

        $masterinventory = Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')->whereIn('ClientProducts.StoreID', $storeids);
        $masterinventory->select(
            'ClientMasterInventory.ClientProductinventoryID as ID',
            'ClientProducts.ProductName as item_name',
            'ClientMasterInventory.Inventory_Date as inventory_date',
            'ClientMasterInventory.SKU as sku',
            'ClientProducts.AliasSKU1 as AliasSKU1',
            'ClientProducts.AliasSKU2 as AliasSKU2',
            'ClientProducts.AliasSKU3 as AliasSKU3',
            'ClientProducts.AliasSKU4 as AliasSKU4',
            'ClientProducts.AliasSKU5 as AliasSKU5',
            'ClientMasterInventory.Qty_onHand as qtyonhand',
            'ClientMasterInventory.Qty_Allocated as qtyallocated',
            'ClientMasterInventory.Qty_toSell as qtytosell',
            'ClientMasterInventory.Cumm_Shipment as cumm_shipment',
            'ClientMasterInventory.DateManualCount as datemanualcount',
            'ClientMasterInventory.ManualCount as manualcount',
            'ClientMasterInventory.Qty_Pending as Qty_Pending'
        );
        $masterinventory->whereRaw('ClientMasterInventory.Inventory_Date=(select max(ClientMasterInventory.Inventory_Date) FROM ClientMasterInventory WHERE ClientMasterInventory.StoreID IN (' . $storeinfo->store_ids . ') AND ' . $isUK_condition . ')');

        if ($country_store == 'US') {
            $masterinventory->whereRaw('(ClientMasterInventory.isUKdata is null or ClientMasterInventory.isUKdata = 0)');
        } else {
            $masterinventory->where('ClientMasterInventory.isUKdata', 1);
        }
        if ($bundleStatus != 'Both') {
            $masterinventory->where(function ($query) use ($bundleStatus) {
                if ($bundleStatus === 'N') {
                    $query->where('ClientProducts.isBundle', $bundleStatus)
                        ->orWhereNull('ClientProducts.isBundle');
                } else {
                    $query->where('ClientProducts.isBundle', $bundleStatus);
                }
            });
        }

        $masterinventory->orderBy($sortfield, $sortascdesc);
        $inventory = $masterinventory->get();
        $getIsBundleInfo = $this->getIsBundleInfo();
        return response()->json([
            'success' => true,
            'inventory' => $inventory,
            'isBundleAllowed' => $getIsBundleInfo,
        ]);
    }

    public function productInventoryList(Request $request)
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
        $storeids = explode(',', $storeinfo->store_ids);

        $date = ($request->date != '') ? date('Y-m-d', strtotime($request->date)) : date('Y-m-d');
        $perpage = ($request->perpage != '') ? $request->perpage : 10;

        $sortfield = 'Inventory_Date';
        $sortascdesc = 'DESC';


        $masterinventory = Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')->whereIn('ClientProducts.StoreID', $storeids);
        $masterinventory->select('ClientProducts.AliasSKU1 as item_name', 'ClientMasterInventory.Inventory_Date as inventory_date', 'ClientMasterInventory.SKU as sku', 'ClientMasterInventory.ClientProductinventoryID as master_inventory_id', 'ClientMasterInventory.Qty_onHand as qty_onhand', 'ClientMasterInventory.Qty_Allocated as qty_allocated', 'ClientMasterInventory.Qty_toSell as qty_tosell');

        $masterinventory->orderBy($sortfield, $sortascdesc);
        $inventory = $masterinventory->get();

        return response()->json([
            'success' => true,
            'inventory' => $inventory
        ]);
    }

    public function getuser_storeid($serverstore = false)
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
        $storeid = $storeinfo->id;
        if ($serverstore) {
            $storeid = $storeinfo->store_ids;
        }
        return $storeid;
    }
    public function addNewProduct(Request $request)
    {

        $request->SKU = str_replace(' ', '_', $request->SKU);
        $validation = $request->validate([
            'SKU' => ['required', 'unique:clientproducts'],
            'AliasSKU1' => ['required']
        ]);
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

        $cproducts = ClientProducts::whereRaw('ProductVariantID = (select max(`ProductVariantID`) from ClientProducts)')->first();
        $countotalproducts = $cproducts->ProductVariantID;
        $countotalproducts++;
        ClientProducts::create([
            'SKU' => $request->SKU,
            'ProductName' => $request->ProductName,
            'Location' => $request->Location,
            'Weight' => $request->Weight,
            'Length' => $request->Length,
            'Height' => $request->Height,
            'Width' => $request->Width,
            'AliasSKU1' => $request->AliasSKU1,
            'CountryOfOrigin' => $request->CountryOfOrigin,
            'StoreID' => $storeids[0],
            'ProductVariantID' => $countotalproducts,
            'status' => 'Pending',
            'isBundle' => 'N',
            'created_by' => $userinfo->id
        ]);

        return response()->json([
            'success' => true
        ]);
    }
    public function changeProductStatus(Request $request)
    {
        ClientProducts::where('SKU', $request->sku)->update([
            'status' => $request->status,
        ]);
        if ($request->type == 'bundle') {
            ClientProductBundle::where('BundleSKU', $request->sku)->update([
                'ProdBundleStatus' => $request->status,
            ]);
        }
        return response()->json([
            'success' => true
        ]);
    }
    public function changeProductStatusItems(Request $request)
    {
        if (!empty($request->productinfo)) {


            $productinfo = json_decode($request->productinfo, true);
            $productsku = [];
            foreach ($productinfo as $prodinfo) {
                $productsku[] = $prodinfo['sku'];
            }
            if (!empty($productsku)) {
                ClientProducts::whereIn('SKU', $productsku)->update([
                    'status' => 'Approved'
                ]);
            }
        }
        return response()->json([
            'success' => true
        ]);
    }
}
