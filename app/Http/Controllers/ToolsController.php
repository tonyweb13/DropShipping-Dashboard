<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Stores;
use App\Models\SafeLists;
use App\Models\DelayedShipments;
use App\Models\ClientItemDelivery;
use Carbon\Carbon;
use App\Lib\Helper;
use App\Mail\AppMail;
use DB;

class ToolsController extends Controller
{
    /**
     * Fetch all safelists
     * @param None
     * @return JSON Orders
     * */
    public $helper;
    public function __construct()
    {
        $this->helper = new Helper();
    }

    public function safeLists(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $sortfield = 'Email';
        $sortascdesc = 'ASC';

        $lists = SafeLists::orderBy($sortfield, $sortascdesc);
        $safelists = $lists->get();

        return response()->json([
            'success' => true,
            'lists' => $safelists
        ]);
    }

    public function getSafeLists(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $safelist = SafeLists::where('ID', $request->safeid)->first();
        return response()->json([
            'success' => true,
            'safelist' => $safelist
        ]);
    }

    public function safeListsShipments(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $startdate = !empty($request->startdate) ? date('Y-m-d', strtotime($request->startdate)) : '';
        $enddate = !empty($request->enddate) ? date('Y-m-d', strtotime($request->enddate)) : '';

        $safelists = [];
        $safelistsquery = '';

        if (!empty($startdate) && !empty($enddate)) {
            $sortfield = 'ClientShipments.ordernumber';
            $sortascdesc = 'ASC';

            $lists = SafeLists::select('ClientShipments.RunDate as RunDate', 'ClientShipments.ordernumber as OrderNumber', 'ClientShipments.ShipEmail as ShipEmail', 'ClientShipments.ShipDate as ShipDate', 'ClientShipments.ID as ID');
            $lists->join('ClientShipments', 'Safe_List.Email', '=', 'ClientShipments.ShipEmail');
            $lists->whereBetween('ClientShipments.ProcessedDate', [$startdate, $enddate]);
            $lists->whereIn('ClientShipments.Storeid', explode(',', $storeids));
            $lists->groupBy('ClientShipments.ordernumber');
            $lists->orderBy($sortfield, $sortascdesc);
            $safelists = $lists->get();
        }

        return response()->json([
            'success' => true,
            'lists' => $safelists
        ]);
    }

    public function delayedShipments(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $startdate = !empty($request->startdate) ? date('Y-m-d', strtotime($request->startdate)) : '';
        $enddate = !empty($request->enddate) ? date('Y-m-d', strtotime($request->enddate)) : '';

        $shipments = [];

        if (!empty($startdate) && !empty($enddate)) {
            $sortfield = 'OrderNumber';
            $sortascdesc = 'ASC';

            $lists = DelayedShipments::whereIn('StoreID', explode(',', $storeids));
            $lists->whereBetween('ProcessedDate', [$startdate, $enddate]);
            $lists->groupBy('OrderNumber');
            $lists->orderBy($sortfield, $sortascdesc);
            $shipments = $lists->get();
        }

        return response()->json([
            'success' => true,
            'lists' => $shipments
        ]);
    }

    /**
     * Add Safelist
     * @param Requests
     * @return JSON
     * */
    public function addSafeList(Request $request)
    {
        $user = Auth::user();
        $userid = $user->id;
        if ($user->is_admin == 2) {
            $userid = $user->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }

        $request->validate([
            'email' => ['required']
        ]);

        SafeLists::create([
            'Email' => $request->email
        ]);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Edit Safelist
     * @param Requests
     * @return JSON
     * */
    public function editSafeList(Request $request)
    {
        $user = Auth::user();
        $userid = $user->id;
        if ($user->is_admin == 2) {
            $userid = $user->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }

        $request->validate([
            'email' => ['required']
        ]);

        SafeLists::where('ID', $request->safeid)->update([
            'Email' => $request->email
        ]);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Delete Safe list
     * @param Requests
     * @return JSON
     * */
    public function deleteSafeList(Request $request)
    {
        SafeLists::whereId($request->safeid)->delete();

        return response()->json([
            'success' => 1
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

    public function getItemDeliveries(Request $request)
    {
        $storeids = $this->getuser_storeid(true);
        $itemdeliveries = ClientItemDelivery::whereIn('StoreID', explode(',', $storeids))->get();

        return response()->json([
            'success' => true,
            'lists' => $itemdeliveries
        ]);
    }
}
