<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\Stores;
use App\Models\User;
use App\Models\Notifications;
use App\Lib\Helper;
use App\Models\CustomerSettings;
use App\Models\ReadNotification;
use App\Models\Inventory;
use DateTime;
use File;

class NotificationController extends Controller
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
     * Fetch all Notifications
     * @param Request
     * @return JSON Notification
     * */
    public function index(Request $request)
    {

        $notify = Notifications::leftJoin('customers_store', 'customers_store.id', '=', 'notifications.store_id');
        $notify->select('notifications.id as id', 'notifications.notification_title as notification_title', 'notifications.notification_content as notification_content', 'notifications.notification_upload as notification_upload', 'notifications.notification_type as notification_type', 'customers_store.store_name as store');
        $notify->orderByDesc("id");
        $notifications = $notify->get();

        return response()->json([
            'success' => true,
            'notify' => $notifications,
            'storageurl' => asset('storage/uploads') . '/notification/',
        ]);
    }

    /**
     * Add Notification
     * @param Requests
     * @return JSON
     * */
    public function addNotification(Request $request)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;

        $request->validate([
            'files' => 'nullable|mimes:pdf'
        ]);
        $filename = $errors = '';
        if ($request->hasFile('files')) {
            $file = $request->file('files');

            $path = public_path('storage/uploads') . '/notification';
            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0777, true, true);
            }

            $extension = $file->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            $file->move($path, $filename);

            $notification_type = ($filename != "") ? 'uploads' : 'standard';
            $notification = Notifications::create([
                'added_by' => $userid,
                'notification_title' => $request->notification_title,
                'notification_content' => $request->notification_content,
                'notification_upload'   => $filename,
                'notification_type' => $notification_type,
                'store_id' => $request->store_id
            ]);
        } else {
            $errors = "You must upload a file.";
        }



        return response()->json([
            'success' => true,
            'errors' => $errors
        ]);
    }

    /**
     * get all stores
     * @param Requests
     * @return JSON
     * */
    public function getAllStores(Request $request)
    {
        $storeinfo  = Stores::get();

        return response()->json([
            'success' => true,
            'stores' => $storeinfo
        ]);
    }

    /**
     * get notification information
     * @param Requests
     * @return JSON
     * */
    public function getNotification(Request $request)
    {
        $notify = Notifications::where('id', $request->id)->first();

        return response()->json([
            'success' => true,
            'notifydata' => $notify
        ]);
    }

    /**
     * update Notifications
     * @param Requests
     * @return JSON
     * */
    public function updateNotification(Request $request)
    {
        $user = Auth::user();
        $userid = $user->id;

        $notify = Notifications::where('id', $request->nid)->first();


        $filename = $notify->notification_upload;

        $newuploadfile = '';
        if ($request->hasFile('files')) {
            $request->validate([
                'files' => 'nullable|mimes:pdf'
            ]);
            $file = $request->file('files');

            $path = public_path('storage/uploads') . '/notification';
            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0777, true, true);
            }

            $extension = $file->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            $newuploadfile = $filename;
            $file->move($path, $filename);
        }

        Notifications::where('id', $request->nid)->update([
            'notification_title' => $request->notification_title,
            'notification_content' => $request->notification_content,
            'notification_upload'   => $filename,
            'store_id' => $request->store_id
        ]);

        return response()->json([
            'success' => true
        ]);
    }
    /**
     * Delete Notification
     * @param Requests
     * @return JSON
     * */
    public function deleteNotification(Request $request)
    {
        Notifications::whereId($request->id)->delete();

        return response()->json([
            'success' => 1
        ]);
    }
    /**
     * Read Notification
     * @param Requests
     * @return JSON
     * */
    public function readNotification(Request $request)
    {
        $user = Auth::user();
        $userid = $user->id;

        $isunread = false;
        $notifyread = ReadNotification::where('notification_id', $request->notifyid)->where('user_id', $userid)->first();
        if (!$notifyread) {
            $notification = ReadNotification::create([
                'notification_id' => $request->notifyid,
                'user_id' => $userid,
                'notify_status' => 'Read'
            ]);
            $isunread = true;
        }

        $notify = Notifications::where('id', $request->notifyid)->first();
        return response()->json([
            'success' => 1,
            'filename' => $notify->notification_upload,
            'file_url' => asset('storage/uploads') . '/notification/' . $notify->notification_upload,
            'isunread' => $isunread
        ]);
    }

    /**
     * Get all Notification
     * @param Requests
     * @return JSON
     * */
    public function getAllNotification(Request $request)
    {
        $user = Auth::user();
        $userid = $user->id;
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }

        $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
        $storeid = $storeinfo->id;

        $notifications = Notifications::whereRaw("store_id ='" . $storeid . "' or store_id='0'")
            ->orderByDesc("id")
            ->limit(5)
            ->get();
        // foreach($notifications as $notify){
        //     echo $notify->id;
        // }
        return response()->json([
            'success' => 1,
            'notifydata' => $notifications,
            'file_url' => asset('storage/uploads') . '/notification/'
        ]);
    }

    /**
     * Get all Read Unread Notifications
     * @param Requests
     * @return JSON
     * */
    public function getAllReadUnread(Request $request)
    {
        $user = Auth::user();
        $userid = $user->id;
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }

        $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
        $storeid = $storeinfo->id;

        $notifyids = $readnotifyids = $user_unreadnotify = [];

        $notifications = Notifications::whereRaw("store_id ='" . $storeid . "' or store_id='0'")->orderByDesc("id")->get();
        if (!empty($notifications)) {
            foreach ($notifications as $notify) {
                $notifyids[] = $notify->id;
            }
        }

        $readnotifications = ReadNotification::whereRaw("user_id ='" . $userid . "'")->orderByDesc("id")->get();
        if (!empty($readnotifications)) {
            foreach ($readnotifications as $readnotify) {
                $readnotifyids[] = $readnotify->notification_id;
            }
        }
        $countunread = 0;
        if (!empty($readnotifyids)) {
            for ($i = 0; $i < count($notifyids); $i++) {
                if (!in_array($notifyids[$i], $readnotifyids)) {
                    $user_unreadnotify[] = $notifyids[$i];
                    $countunread++;
                }
            }
        } else {
            $countunread = count($notifyids);
            $user_unreadnotify = $notifyids;
        }

        return response()->json([
            'success' => 1,
            'countread' => count($readnotifyids),
            'countunread' => $countunread,
            'notify_readids' => $readnotifyids,
            'notify_unreadids' => $user_unreadnotify
        ]);
    }
    /**
     * Fetch all Users Notifications
     * @param Request
     * @return JSON Notification
     * */
    public function userNotifications(Request $request)
    {
        $user = Auth::user();
        $userid = $user->id;
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }

        $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
        $storeid = $storeinfo->id;

        $notify = Notifications::leftJoin('customers_store', 'customers_store.id', '=', 'notifications.store_id');
        $notify->select('notifications.id as id', 'notifications.notification_title as notification_title', 'notifications.notification_content as notification_content', 'notifications.notification_upload as notification_upload', 'notifications.notification_type as notification_type', 'customers_store.store_name as store');
        $notify->whereRaw("store_id ='" . $storeid . "' or store_id='0'");
        $notify->orderByDesc("id");
        $notifications = $notify->get();

        $readnotifyids = [];
        $readnotifications = ReadNotification::whereRaw("user_id ='" . $userid . "'")->orderByDesc("id")->get();
        if (!empty($readnotifications)) {
            foreach ($readnotifications as $readnotify) {
                $readnotifyids[] = $readnotify->notification_id;
            }
        }
        return response()->json([
            'success' => true,
            'notify' => $notifications,
            'storageurl' => asset('storage/uploads') . '/notification/',
            'notify_readids' => $readnotifyids
        ]);
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

    public function getInventoryAllocatedNotification(Request $request)
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

        $sortfield = 'ClientMasterInventory.Qty_Allocated';
        $sortascdesc = 'DESC';

        $masterinventory = Inventory::join('ClientProducts', 'ClientProducts.SKU', '=', 'ClientMasterInventory.SKU')->whereIn('ClientProducts.StoreID', $storeids);
        $masterinventory->select('ClientMasterInventory.ClientProductinventoryID as ID', 'ClientProducts.ProductName as item_name', 'ClientMasterInventory.Inventory_Date as inventory_date', 'ClientMasterInventory.SKU as sku', 'ClientProducts.AliasSKU1 as aliassku', 'ClientProducts.AliasSKU2 as aliassku2', 'ClientMasterInventory.Qty_onHand as qtyonhand', 'ClientMasterInventory.Qty_Allocated as qtyallocated', 'ClientMasterInventory.Qty_toSell as qtytosell', 'ClientMasterInventory.Cumm_Shipment as cumm_shipment', 'ClientMasterInventory.DateManualCount as datemanualcount', 'ClientMasterInventory.ManualCount as manualcount');
        $masterinventory->whereRaw('ClientMasterInventory.Inventory_Date=(select max(ClientMasterInventory.Inventory_Date) FROM ClientMasterInventory WHERE ClientMasterInventory.StoreID IN (' . $storeinfo->store_ids . '))');
        $masterinventory->whereRaw('CAST(ClientMasterInventory.Qty_Allocated  AS UNSIGNED) > CAST(ClientMasterInventory.Qty_onHand  AS UNSIGNED)');
        $masterinventory->orderBy($sortfield, $sortascdesc);

        $bundleStatus = $request->bundleStatus;

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

        $inventory = $masterinventory->get();
        $inventory_count = $masterinventory->count();
        $getIsBundleInfo = $this->getIsBundleInfo();

        return response()->json([
            'count' => $inventory_count,
            'inventory' => $inventory,
            'isBundleAllowed' => $getIsBundleInfo,
        ]);
    }
}
