<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Reports;
use App\Models\ReportCategory;
use App\Models\ReportClientShipments;
use App\Models\CustomerSettings;
use App\Models\Stores;
use Carbon\Carbon;
use App\Lib\Helper;
use App\Mail\AppMail;
use DateTime;
use DB;

class ReportController extends Controller
{

    /**
     * Fetch all orders
     * @param None
     * @return JSON Orders
     * */
    public $helper;
    public $emailrecipient;
    public function __construct()
    {
        $this->helper = new Helper();

        $this->emailrecipient = env("PK_SUPPORT_EMAIL", "support@prepkanga.com");
    }

    /**
     * Fetch all reports
     * @param None
     * @return JSON Reports
     * */
    public function index(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $report = $request->report;
        $startdate = !empty($request->startdate) ? date('Y-m-d', strtotime($request->startdate)) : '';
        $enddate = !empty($request->enddate) ? date('Y-m-d', strtotime($request->enddate)) : '';
        $allreports = [];
        if (!empty($report) && !empty($startdate) && !empty($enddate)) {

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }

            $isukcondition = 'isukdata = 1';
            if ($country_store == 'US') {
                $isukcondition = 'isukdata = 0 or isukdata = 0 is null';
            }

            switch ($report) {
                case 'country':
                    $allreports = DB::select("select a.ID, a.sku, a.shipcountry, a.shipments, b.Resends from ( select ID, sku, shipcountry, count(ordernumber) as Shipments, Storeid From ClientShipments where (" . $isukcondition . ") and shipdate between '" . $startdate . "' and '" . $enddate . "' and ResendNew is null and Storeid IN (" . $storeids . ") group by shipcountry ) a inner join  ( select shipcountry, count(ordernumber) as Resends From ClientShipments where (" . $isukcondition . ") and shipdate between '" . $startdate . "' and '" . $enddate . "' and ResendNew is not null and Storeid IN (" . $storeids . ") group by shipcountry ) b on a.shipcountry = b.shipcountry WHERE a.Storeid IN (" . $storeids . ")");
                    break;

                case 'sku':
                    $allreports = DB::select("select a.ID, a.sku, a.shipcountry, a.shipments, b.Resends from ( select ID, sku, shipcountry, count(ordernumber) as Shipments, Storeid From ClientShipments where (" . $isukcondition . ") and shipdate between '" . $startdate . "' and '" . $enddate . "' and ResendNew is null and Storeid IN (" . $storeids . ") group by sku ) a inner join ( select sku, count(ordernumber) as Resends From ClientShipments where (" . $isukcondition . ") and shipdate between '" . $startdate . "' and '" . $enddate . "' and ResendNew is not null and Storeid IN (" . $storeids . ") group by sku ) b on a.sku = b.sku WHERE a.Storeid IN (" . $storeids . ")");
                    break;

                case 'delivery':
                    $allreports = DB::select("select * FROM ClientItemDelivery WHERE ActualDeliveryDateEST BETWEEN '" . $startdate . "' and '" . $enddate . "' AND StoreID IN (" . $storeids . ") ORDER BY ActualDeliveryDateEST DESC");
                    break;
            }
        }

        $storeidonly = $this->getuser_storeid();
        $checkdisable = $this->helper->checkdisableopenorder($storeidonly);
        $editing_status = $checkdisable['editstatus'];

        return response()->json([
            'success' => true,
            'lists' => $allreports,
            'editing_status' => $editing_status
        ]);
    }

    public function getCategories()
    {
        $categories = ReportCategory::get();

        return response()->json([
            'success' => true,
            'categories' => $categories
        ]);
    }

    public function getReports(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $category = $request->category;

        $reports = Reports::where('isVisible', 1);
        if ($category != 1) {
            $reports->where('ReportCategoryID', $category);
        }
        $reportlists = $reports->get();

        return response()->json([
            'success' => true,
            'reports' => $reportlists
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
}
