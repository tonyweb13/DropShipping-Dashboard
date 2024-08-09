<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Lib\Helper;
use App\Mail\AppMail;
use App\Models\ClientProductBundle;
use App\Models\ClientProducts;
use App\Models\ClientShipmentWholesale;
use App\Models\CustomerSettings;
use App\Models\Inventory;
use App\Models\InventoryCount;
use App\Models\InventoryDates;
use App\Models\ProductCounts;
use App\Models\ReceivingNotes;
use App\Models\Stores;
use App\Models\User;
use Carbon\Carbon;
use DB;
use File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

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
        $products = $inventorydate->get();

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }

    public function getReceivingProductsAdmin(Request $request)
    {
        $country_store = 'US';
        $storeinfo  = Stores::where('country', $country_store)->first();
        $storename = $storeinfo->store_name;
        $storeid = $storeinfo->id;
        $storeids = explode(',', $storeinfo->store_ids);

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

        if (empty($request->statusfilter)) {
            if ($request->history == 'old') {
                $inventory->whereDate('product_counts.date', '<=', '2022-06-17');
            } else {
                $inventory->whereDate('product_counts.date', '>=', '2022-06-18');
            }
        }

        if (!empty($request->statusfilter)) {
            $inventory->where('product_counts.status', $request->statusfilter);
        } else {
            $inventory->whereNull('product_counts.status');
        }

        $inventory->where('product_counts.count', '>', 0);
        $inventory->whereIn('ClientProducts.StoreID', $storeids);
        $inventory->orderBy($sortfield, $sortascdesc);
        $products = $inventory->get();

        $key_per_country = 'receiving_' . $country_store . '_sync_date';
        $receiving_sync_date = CustomerSettings::where('option_name', $key_per_country)->first();

        return response()->json([
            'success' => true,
            'syncdatetime' => !empty($receiving_sync_date) ? date('F d, Y h:i:s A', strtotime($receiving_sync_date->option_value)) : 'No Data',
            'products' => $products
        ]);
    }

    public function addNewReceivingItemAdmin(Request $request)
    {
        $validation = $request->validate([
            'checkindate' => ['required'],
            'product' => ['required'],
            'quantity' => ['required']
        ]);

        ProductCounts::create([
            'product_id' => $request->product,
            'date' => $request->checkindate,
            'count' => $request->quantity
        ]);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Add Receiving product
     * @param Request product data
     * @return Success
     * */
    public function addReceivingAdmin(Request $request)
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
                'added_by' => $userid,
                'added_by_name' => $userinfo->first_name
            ]);
        }

        // Send email
        $details = array(
            'subject' => 'Receiving updated.',
            'heading' => 'Receiving updated.',
            'template' => 'receiving'
        );

        $details['checkin'] = $productcounts->date;
        $details['title'] = $inventory->ProductName;
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
    public function addReceivingItemsAdmin(Request $request)
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
                    'title' => $inventory->ProductName,
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
     * Change Direct Status product
     * @param Request product data
     * @return Success
     * */
    public function changeReceivingStatusAdmin(Request $request)
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

        ProductCounts::where('id', $request->inventory_id)->update([
            'status' => $request->status,
        ]);

        if ($request->status == 'Approved') {
            // Send email
            $details = array(
                'subject' => 'Receiving updated.',
                'heading' => 'Receiving updated.',
                'template' => 'receiving'
            );

            $details['checkin'] = $productcounts->date;
            $details['title'] = $inventory->ProductName;
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

    public function getProductAdmin(Request $request)
    {
        $country_store = 'US';
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        $inventoryid = $request->inventoryid;

        $receivingnotes = ReceivingNotes::where('product_count_id', $inventoryid)->get();
        return response()->json([
            'success' => true,
            'storageurl' => asset('storage/uploads') . '/' . $userid . '/',
            'notes' => $receivingnotes
        ]);
    }

    public function productslistAdmin(Request $request)
    {
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }

        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }

        $lists = ClientProducts::select(['ProductVariantID', 'AliasSKU1'])->get();

        $editedproduct = [];
        if (!empty($request->edit)) {
            $allskus = ClientProductBundle::select('SKUIncluded', 'Qty')->where('BundleSKU', $request->edit)->get();
            $skus = [];
            $quantity = 0;
            foreach ($allskus as $allsku) {
                $quantity = $allsku->Qty;
                $skus[] = [
                    'sku' => $allsku->SKUIncluded,
                    'qty' => $allsku->Qty
                ];
            }
            $bundle = ClientProducts::where('SKU', $request->edit)->first();

            $editedproduct = [
                'skus' => $skus,
                'bundle_sku' => $bundle->SKU,
                'quantity' => $quantity,
                'name' => $bundle->ProductName,
                'location' => $bundle->Location,
                'weight' => $bundle->Weight,
                'length' => $bundle->Length,
                'height' => $bundle->Height,
                'width' => $bundle->Width,
                'alias' => $bundle->AliasSKU1,
                'origin' => $bundle->CountryOfOrigin,
                'alias_sku' => $bundle->AliasSKU
            ];
        }

        return response()->json([
            'success' => true,
            'syncdatetime' => !empty($masterinventory_sync_date) ? date('F d, Y h:i:s A', strtotime($masterinventory_sync_date->option_value)) : 'No Data',
            'products' => $lists,
            'product' => $editedproduct
        ]);
    }

    public function addReceivingNotesAdmin(Request $request)
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
}
