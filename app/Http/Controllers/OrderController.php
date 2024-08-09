<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Orders;
use App\Models\HeldOrders;
use App\Models\ClientOrders;
use App\Models\ClientOrderItem;
use App\Models\OpenOrders;
use App\Models\EditOpenOrders;
use App\Models\InTransit;
use App\Models\DelayedOrders;
use App\Models\Stores;
use App\Models\CustomerSettings;
use Carbon\Carbon;
use App\Lib\Helper;
use App\Mail\AppMail;
use App\Models\AdminStores;
use App\Models\Cities;
use App\Models\Countries;
use App\Models\States;
use DateTime;
use Ramsey\Uuid\Type\Integer;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Response;



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
    public function index(Request $request)
    {
        $storeid = $this->getuser_storeid();

        $perpage = ($request->perpage != '') ? $request->perpage : 10;
        $orders = Orders::where('store_id', $storeid)->paginate($perpage, ['*'], 'page', $request->page);
        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }
    public function orderCount(Request $request)
    {
        $storeid = $this->getuser_storeid();
        $postcountheld = ($request->monthcount != '') ? $request->monthcount : 1;
        // $helddaterange = Carbon::now()->subDays($postcountheld);
        $endMonth = Carbon::now()->startOfMonth()->subMonth($postcountheld);
        $startMonth = Carbon::now()->startOfMonth();
        $emonthF = date('Y-m-d H:i:s', strtotime($endMonth));
        $smonthF = date('Y-m-d H:i:s', strtotime($startMonth));

        $ordercount = Orders::where('order_type', 'Held')
            ->whereBetween('order_date', [$emonthF, $smonthF])
            ->where('store_id', $storeid)
            ->count();

        $postcountreturn = ($request->daycountreturn != '') ? (int)$request->daycountreturn : 7;
        $returndaterange = Carbon::now()->subDays($postcountreturn);
        $returndaterange = date('Y-m-d H:i:s', strtotime($returndaterange));

        $returnscount = Orders::where('order_date', '>=', $returndaterange)
            ->where('order_type', 'Returns')
            ->where('store_id', $storeid)
            ->count();

        return response()->json([
            'ordercount' => $ordercount,
            'returnscount' => $returnscount
        ]);
    }
    public function heldCount(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        $wheremonth = 'OrderDate';
        $filterqry = $this->getfilter_query($datefilter, $wheremonth);

        $wherestr = $filterqry['wherestr'];

        $orders = HeldOrders::whereIn('StoreID', explode(',', $storeids));
        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr($wheremonth, $filterqry['wheremonthval']);
        endif;

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('Source');
            $orders->whereRaw('RunDate=(select max(RunDate) FROM HeldOrder WHERE StoreID IN (' . $storeids . '))');
        } else {
            $orders->where('Source', 'sheet');
        }

        $ordercount = $orders->count();

        return response()->json([
            'ordercount' => $ordercount
        ]);
    }


    public function openordersCount(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        $wheremonth = 'OrderDate';
        $filterqry = $this->getfilter_query($datefilter, $wheremonth);
        $country_store = session('country_store');

        if ($country_store == 'UK') {
            return response()->json([
                'ordercount' => 0
            ]);
        } else {
            $wherestr = $filterqry['wherestr'];

            $orders = ClientOrders::leftJoin(
                "ClientShipmentsV2",
                "ClientShipmentsV2.ordernumber",
                "=",
                "ClientOrders.ordernumber"
            )->whereIn('Storeid', explode(',', $storeids));

            $orders->where('LocalStatus', 'HOLD - Bad Address');

            return response()->json([
                'ordercount' => $orders->count()
            ]);
        }
    }

    public function shippedFilter(Request $request)
    {
        $datefilter = ($request->datefilter != '') ? $request->datefilter : '';
        $shippedCount = $this->shippedAllOrders($datefilter, "Shipped");
        return response()->json([
            'shipped' => $shippedCount
        ]);
    }


    public function shippedAllOrders($filteredDate = '', $status)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($filteredDate != '') ? $filteredDate : '30days';
        $wheremonth = 'OrderDate';
        $filterqry = $this->getfilter_query($datefilter, $wheremonth);
        $country_store = session('country_store');
        $today = Carbon::now();
        if ($country_store == 'UK') {
            return response()->json([
                'ordercount' => 0
            ]);
        } else {
            $wherestr = $filterqry['wherestr'];

            if ($filteredDate != '') {

                $orders = ClientOrders::leftJoin(
                    "ClientShipmentsV2",
                    "ClientShipmentsV2.ordernumber",
                    "=",
                    "ClientOrders.ordernumber"
                )
                    ->whereBetween('ClientShipmentsV2.ProcessedDate', [Carbon::now()->subDays($filteredDate), Carbon::now()])
                    ->whereIn('Storeid', explode(',', $storeids));
            } else {
                if ($status == "Shipped") {
                    $orders = ClientOrders::leftJoin(
                        "ClientShipmentsV2",
                        "ClientShipmentsV2.ordernumber",
                        "=",
                        "ClientOrders.ordernumber"
                    )
                        ->whereDate('ClientShipmentsV2.ProcessedDate', $today)
                        ->whereIn('Storeid', explode(',', $storeids));
                } else {
                    $orders = ClientOrders::join(
                        "ClientShipmentsV2",
                        "ClientShipmentsV2.ordernumber",
                        "=",
                        "ClientOrders.ordernumber"
                    )->whereIn('Storeid', explode(',', $storeids));
                }
            }

            $orders->where('LocalStatus', $status);

            return $orders->count();
        }
    }

    public function allOrderStatusCount()
    {
        $shipped = $this->shippedAllOrders('', "Shipped");
        $postalHold = $this->shippedAllOrders('', "Postal Hold");
        $holdBrazilCPF = $this->shippedAllOrders('', "HOLD Brazil CPF");
        $awaitingShipments = $this->shippedAllOrders('', "Awaiting Shipment");
        $delayed = $this->badStatusAllOrders('', 'Delayed');

        return response()->json([
            'shipped' => $shipped,
            'postalHold' => $postalHold,
            'holdBrazilCPF' => $holdBrazilCPF,
            'awaitingShipments' => $awaitingShipments,
            'delayed' => $delayed
        ]);
    }

    public function returnCount(Request $request)
    {
        $storeid = $this->getuser_storeid();
        $storeids = $this->getuser_storeid(true);

        $store_ids = $storeid . ',' . $storeids;

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        $wheremonth = 'order_date';
        $filterqry = $this->getfilter_query($datefilter, $wheremonth);

        $wherestr = $filterqry['wherestr'];
        if ($filterqry['wheretype'] == 'days') :
            $ordercount = Orders::where('order_type', 'Returns')
                ->$wherestr($filterqry['whereclause'])
                ->whereIn('store_id', explode(',', $store_ids))
                ->count();
        else :
            $ordercount = Orders::where('order_type', 'Returns')
                ->$wherestr($wheremonth, $filterqry['wheremonthval'])
                ->whereIn('store_id', explode(',', $store_ids))
                ->count();
        endif;

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'UK') {
            $ordercount = 0;
        }

        return response()->json([
            'ordercount' => $ordercount
        ]);
    }
    public function intransitCount(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        $wheremonth = 'ShipDate';
        $filterqry = $this->getfilter_query($datefilter, $wheremonth);

        $wherestr = $filterqry['wherestr'];

        $orders = InTransit::whereIn('StoreID', explode(',', $storeids));
        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr($wheremonth, $filterqry['wheremonthval']);
        endif;

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('Source');
        } else {
            $orders->where('Source', 'sheet');
        }

        $orders->whereRaw('RunDate=(select max(RunDate) FROM InTransit WHERE StoreID IN (' . $storeids . '))');
        $ordercount = $orders->count();

        return response()->json([
            'ordercount' => $ordercount
        ]);
    }

    public function badStatusAllOrders($filteredDate = '', $status)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($filteredDate != '') ? $filteredDate : '30days';
        $wheremonth = 'OrderDate';
        $filterqry = $this->getfilter_query($datefilter, $wheremonth);
        $country_store = session('country_store');

        if ($country_store == 'UK') {
            return response()->json([
                'ordercount' => 0
            ]);
        } else {
            $wherestr = $filterqry['wherestr'];

            $orders = ClientOrders::join(
                "ClientShipmentsV2",
                "ClientShipmentsV2.ordernumber",
                "=",
                "ClientOrders.ordernumber"
            )->whereIn('Storeid', explode(',', $storeids));

            $startDate = Carbon::today()->subDays(5)->toDateString();

            $orders->whereNotIn('ClientShipmentsV2.TrackingStatus', ['Delivered'])
                ->where('ClientOrders.LocalStatus', "=", "Shipped")
                ->where('ClientShipmentsV2.Carrier', '=', "USPS")
                ->whereDate('ClientShipmentsV2.ProcessedDate', '<=', $startDate)
                ->orderBy('ClientShipmentsV2.ProcessedDate', 'desc');

            return $orders->count();
        }
    }

    public function delayedCount(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        $wheremonth = 'ShipDate';
        $filterqry = $this->getfilter_query($datefilter, $wheremonth);

        $wherestr = $filterqry['wherestr'];

        $orders = DelayedOrders::whereIn('StoreID', explode(',', $storeids));
        $orders->whereIn('DeliveryStatus', ['Delayed', 'Exception']);

        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr($wheremonth, $filterqry['wheremonthval']);
        endif;

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('Source');
        } else {
            $orders->where('Source', 'sheet');
        }

        $orders->whereRaw('RunDate=(select max(RunDate) FROM DelayedShipments WHERE StoreID IN (' . $storeids . '))');
        $ordercount = $orders->count();
        $delayed = $this->badStatusAllOrders('', 'Delayed');
        return response()->json([
            'ordercount' => $delayed
        ]);
    }

    public function ordersHeld(Request $request)
    {
        $userid = $this->getuser_id();
        $storeids = $this->getuser_storeid(true);

        $perpage = ($request->perpage != '') ? $request->perpage : 10;
        if (isset($request->sortfield) != '') {
            $sortfield = $request->sortfield;
            $sortascdesc = $request->sorting;
        } else {
            $sortfield = 'OrderDate';
            $sortascdesc = 'DESC';
        }

        $orders = HeldOrders::whereIn('StoreID', explode(',', $storeids));
        if (isset($request->statusfilter) != '') {
            $orders->where('Status', $request->statusfilter);
        }

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('Source');
            $orders->whereRaw('RunDate=(select max(RunDate) FROM HeldOrder WHERE StoreID IN (' . $storeids . '))');
        } else {
            $orders->where('Source', 'sheet');
        }

        // $orders->where('EditStatus', 0);

        $orders->orderBy($sortfield, $sortascdesc);
        // $orders->groupBy('OrderNumber');
        $heldorders = $orders->get();

        $key_per_country = 'held_' . $country_store . '_sync_date';
        $held_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();

        return response()->json([
            'success' => true,
            'syncdatetime' => !empty($held_sync_date) ? date('F d, Y h:i:s A', strtotime($held_sync_date->option_value)) : '',
            'orders' => $heldorders
        ]);
    }

    public function ordersReturns(Request $request)
    {
        $userid = $this->getuser_id();
        $storeid = $this->getuser_storeid();

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

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';

        // get all query for filters
        if ($datefilter == 'custom') {
            $filterqry = $this->getfilter_query($datefilter, 'order_date', $request->start_date, $request->end_date);
        } else {
            $filterqry = $this->getfilter_query($datefilter, 'order_date');
        }

        $wherestr = $filterqry['wherestr'];

        $orders = Orders::where($wherearray);
        $orders->where('store_id', $storeid);

        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr('order_date', $filterqry['wheremonthval']);
        endif;

        $orders->orderBy($sortfield, $sortascdesc);
        // $orders->groupBy('tracking_number');
        $returnorders = $orders->get();

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'UK') {
            $returnorders = [];
        }

        $key_per_country = 'return_' . $country_store . '_sync_date';
        $return_sync_date = CustomerSettings::where('user_id', $userid)->where('option_name', $key_per_country)->first();

        return response()->json([
            'success' => true,
            'syncdatetime' => !empty($return_sync_date) ? date('F d, Y h:i:s A', strtotime($return_sync_date->option_value)) : 'No Data',
            'orders' => $returnorders
        ]);
    }

    public function ordersDelayed(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $perpage = ($request->perpage != '') ? $request->perpage : 10;
        if (isset($request->sortfield) != '') {
            $sortfield = $request->sortfield;
            $sortascdesc = $request->sorting;
        } else {
            $sortfield = 'ShipDate';
            $sortascdesc = 'DESC';
        }
        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';

        // get all query for filters
        if ($datefilter == 'custom') {
            $filterqry = $this->getfilter_query($datefilter, 'ShipDate', $request->start_date, $request->end_date);
        } else {
            $filterqry = $this->getfilter_query($datefilter, 'ShipDate');
        }

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
        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr('ShipDate', $filterqry['wheremonthval']);
        endif;

        $orders->whereRaw('RunDate=(select max(RunDate) FROM DelayedShipments WHERE StoreID IN (' . $storeids . '))');
        $orders->orderBy($sortfield, $sortascdesc);
        $orders->groupBy('OrderNumber');
        $delayedorders = $orders->get();

        return response()->json([
            'success' => true,
            'orders' => $delayedorders
        ]);
    }

    public function ordersIntransit(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $perpage = ($request->perpage != '') ? $request->perpage : 10;
        if (isset($request->sortfield) != '') {
            $sortfield = $request->sortfield;
            $sortascdesc = $request->sorting;
        } else {
            $sortfield = 'ShipDate';
            $sortascdesc = 'DESC';
        }
        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        // get all query for filters
        if ($datefilter == 'custom') {
            $filterqry = $this->getfilter_query($datefilter, 'ShipDate', $request->start_date, $request->end_date);
        } else {
            $filterqry = $this->getfilter_query($datefilter, 'ShipDate');
        }

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
        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr('ShipDate', $filterqry['wheremonthval']);
        endif;

        $orders->whereRaw('RunDate=(select max(RunDate) FROM InTransit WHERE StoreID IN (' . $storeids . '))');
        $orders->orderBy($sortfield, $sortascdesc);
        $intransitorders = $orders->get();

        return response()->json([
            'success' => true,
            'orders' => $intransitorders
        ]);
    }

    public function openorders(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $perpage = ($request->perpage != '') ? $request->perpage : 10;
        if (isset($request->sortfield) != '') {
            $sortfield = $request->sortfield;
            $sortascdesc = $request->sorting;
        } else {
            $sortfield = 'OrderDate';
            $sortascdesc = 'DESC';
        }

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';

        // get all query for filters
        if ($datefilter == 'custom') {
            $filterqry = $this->getfilter_query($datefilter, 'OrderDate', $request->start_date, $request->end_date);
        } else {
            $filterqry = $this->getfilter_query($datefilter, 'OrderDate');
        }

        $wherestr = $filterqry['wherestr'];

        $orders = OpenOrders::whereIn('StoreID', explode(',', $storeids));
        if (isset($request->statusfilter) != '') {
            $orders->where('LocalStatus', $request->statusfilter);
        }

        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr('OrderDate', $filterqry['wheremonthval']);
        endif;

        // $orders->whereNull('ForcePrint');
        // $orders->whereNull('CancelOrder');

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }

        $isUKdataCondition = '(isUKdata is null or isUKdata = 0)';
        if ($country_store == 'US') {
            $orders->whereRaw($isUKdataCondition);
        } else {
            $orders->where('isUKdata', 1);
            $isUKdataCondition = 'isUKdata = 1';
        }

        $orders->whereRaw('((CancelOrder is null) AND (ForcePrint is null))');

        $orders->whereRaw('RunDate=(select max(RunDate) FROM OpenOrders WHERE StoreID IN (' . $storeids . ') AND ((CancelOrder is null) AND (ForcePrint is null)) AND ' . $isUKdataCondition . ')');
        $orders->orderBy($sortfield, $sortascdesc);
        $orders->orderBy('ID', 'DESC');
        $openorders = $orders->get();

        $storeidonly = $this->getuser_storeid();
        $checkdisable = $this->helper->checkdisableopenorder($storeidonly);
        $editing_status = $checkdisable['editstatus'];

        return response()->json([
            'success' => true,
            'orders' => $openorders,
            'editing_status' => $editing_status
        ]);
    }

    public function editedopenorders(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $perpage = ($request->perpage != '') ? $request->perpage : 10;
        if (isset($request->sortfield) != '') {
            $sortfield = $request->sortfield;
            $sortascdesc = $request->sorting;
        } else {
            $sortfield = 'created_at';
            $sortascdesc = 'DESC';
        }

        $orders = EditOpenOrders::whereIn('StoreID', explode(',', $storeids));
        if (isset($request->statusfilter) != '') {
            $orders->where('LocalStatus', $request->statusfilter);
        }

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('isUKdata');
        } else {
            $orders->where('isUKdata', 1);
        }

        $orders->orderBy($sortfield, $sortascdesc);
        $orders->orderBy('id', 'DESC');
        $openorders = $orders->get();

        return response()->json([
            'success' => true,
            'orders' => $openorders
        ]);
    }

    public function getfilter_query($datefilter, $monthqry = null, $customstartdate = null, $customenddate = null)
    {
        $wheretype = 'days';
        $wheremonth = ($monthqry != '') ? $monthqry : 'OrderDate';
        $wheremonthval = $whereclause = '';
        $wherestr = 'where';
        switch ($datefilter):
            case 'thismonth':
                $wherestr = 'whereBetween';
                $firstmonthdate = date('Y-m-01');
                $lastmonthdate = date('Y-m-t');
                $wheremonthval = [$firstmonthdate, $lastmonthdate];
                $wheretype = 'months';
                break;
            case '30days':
                $wherestr = 'whereBetween';
                $startdate = Carbon::now()->subDays(30);
                $enddate = Carbon::now()->subDays(-1);
                $wheremonthval = [$startdate, $enddate];
                $wheretype = 'months';
                break;
            case 'lastmonth':
                $wherestr = 'whereBetween';
                $wheremonthval = [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()];
                $wheretype = 'months';
                break;
            case 'thisquarter':
                $dates = $this->helper->getDatesOfQuarter('current', null, 'Y-m-d');
                $firstmonthdate = $dates['start'];
                $lastmonthdate = $dates['end'];
                $wheremonthval = [$firstmonthdate, $lastmonthdate];
                $wherestr = 'whereBetween';
                $wheretype = 'months';
                break;
            case 'lastquarter':
                $dates = $this->helper->getDatesOfQuarter('previous', null, 'Y-m-d');
                $firstmonthdate = $dates['start'];
                $lastmonthdate = $dates['end'];
                $wheremonthval = [$firstmonthdate, $lastmonthdate];
                $wherestr = 'whereBetween';
                $wheretype = 'months';
                break;
            case 'last12months':
                $wherestr = 'whereBetween';
                $wheremonthval = [Carbon::now()->subYear(), Carbon::now()];
                $wheretype = 'months';
                break;
            case '7days':
                $wherestr = 'whereBetween';
                $startdate = Carbon::now()->subDays(7);
                $enddate = Carbon::now()->subDays(-1);
                $wheremonthval = [$startdate, $enddate];
                $wheretype = 'months';
                break;
            case 'custom':
                $wherestr = 'whereBetween';
                $wheremonthval = [$customstartdate, $customenddate];
                $wheretype = 'months';
                break;
            default:
                $wherestr = 'whereBetween';
                $wheremonthval = [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()];
                $wheretype = 'months';
                break;
        endswitch;

        return array(
            "whereclause" => $whereclause,
            "wheretype" => $wheretype,
            "wheremonthval" => $wheremonthval,
            "wherestr" => $wherestr
        );
    }

    public function returnchartdata(Request $request)
    {
        $storeid = $this->getuser_storeid();
        $storeids = $this->getuser_storeid(true);

        $store_ids = $storeid . ',' . $storeids;

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        // $datefilter = 'last12months';

        // get all query for filters
        if ($datefilter == 'custom') {
            $filterqry = $this->getfilter_query($datefilter, 'order_date', $request->start_date, $request->end_date);
        } else {
            $filterqry = $this->getfilter_query($datefilter, 'order_date');
        }

        $wherestr = $filterqry['wherestr'];

        if ($filterqry['wheretype'] == 'days') :
            $orderdata = Orders::where('order_type', 'Returns')
                ->$wherestr($filterqry['whereclause'])
                ->whereIn('store_id', explode(',', $store_ids))
                ->get();
        else :
            $orderdata = Orders::where('order_type', 'Returns')
                ->$wherestr('order_date', $filterqry['wheremonthval'])
                ->whereIn('store_id', explode(',', $store_ids))
                ->get();
        endif;

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'UK') {
            $orderdata = [];
        }

        // print_r($filterqry['wheremonthval']);
        $labelarray = $datasetarray = $alldataar = [];
        // get all order data
        if (!empty($orderdata)) :
            foreach ($orderdata as $odata) :
                $orderdates = date('Y-m-d', strtotime($odata->order_date));
                $countdt = (int)$odata->no_items_returned;
                $alldataar[$orderdates][] = $countdt;

                if (array_key_exists($orderdates, $datasetarray)) :
                    // if order date is equal to key and sum it
                    $sumdataar = $datasetarray[$orderdates] + $countdt;
                    $datasetarray[$orderdates] = $sumdataar;
                else :
                    $datasetarray[$orderdates] = $countdt;
                endif;

            endforeach;
        endif;
        ksort($datasetarray);
        $datachart = [];
        // $defaultlabels = $this->getlabel_str($datefilter);
        if ($datefilter == 'custom') {
            $defaultlabels = $this->getlabel_str($datefilter, $request->start_date, $request->end_date);
        } else {
            $defaultlabels = $this->getlabel_str($datefilter);
        }
        $bymonthar = [];
        if ($datefilter == 'thisweek' || $datefilter == '7days' || $datefilter == '30days' || $datefilter == 'thismonth' || $datefilter == 'lastmonth') :
            // labels and data for single dates
            foreach ($defaultlabels as $datelabels) :
                $labelarray[] = substr($datelabels, 5);
                $datachart[] = (array_key_exists($datelabels, $datasetarray)) ? $datasetarray[$datelabels] : 0;
            endforeach;
        else :
            // labels and data for months
            foreach ($defaultlabels as $datelabels) :
                $ymonth_key = date('Y-m', strtotime($datelabels));
                $bymonthar[$ymonth_key][] = (array_key_exists($datelabels, $datasetarray)) ? $datasetarray[$datelabels] : 0;
            endforeach;
            foreach ($bymonthar as $key => $val) :
                $ymon_today = date("Y-m");
                if ($datefilter == 'last12months') :
                    // if last 12 months don't include current month
                    if ($ymon_today != $key) :
                        $labelarray[] = date('M', strtotime($key));
                        $datachart[] = array_sum($bymonthar[$key]);
                    endif;
                else :
                    $labelarray[] = date('M', strtotime($key));
                    $datachart[] = array_sum($bymonthar[$key]);
                endif;
            endforeach;
        endif;

        $labels = $labelarray;


        // echo '<pre>';
        // print_r($bymonthar);
        // echo '</pre>';exit;

        $returndataset = $datachart;
        $dataset = [
            'type' => 'line',
            'label' => 'TOTAL NUMBERS OF RETURNS',
            'borderColor' => '#AA5539',
            'backgroundColor' => '#AA5539',
            'fill' => true,
            'data' => $returndataset,
            'lineTension' => 0.1,
            'borderWidth' => 2,
            'pointRadius' => 2
        ];
        return response()->json([
            'chartlabel' => $labels,
            'chartdataset' => $dataset,
            'orderdata' => $orderdata
        ]);
    }
    public function getlabel_str($datefilter, $customstartdate = null, $customenddate = null)
    {
        // function to get all dates
        $returndates = '';

        switch ($datefilter):
            case 'thisweek':
                $startweek = Carbon::now()->startOfWeek();
                $endweek = Carbon::now()->endOfWeek();
                $startdate = date('Y-m-d', strtotime($startweek));
                $enddate = date('Y-m-d', strtotime($endweek));
                break;
            case 'thismonth':
                $firstmonthdate = date('Y-m-01');
                $lastmonthdate = date('Y-m-d');
                $startdate = date('Y-m-d', strtotime($firstmonthdate));
                $enddate = date('Y-m-d', strtotime($lastmonthdate));
                break;
            case 'lastmonth':
                $firstmonthdate = Carbon::now()->subMonth()->startOfMonth();
                $lastmonthdate =  Carbon::now()->subMonth()->endOfMonth();
                $startdate = date('Y-m-d', strtotime($firstmonthdate));
                $enddate = date('Y-m-d', strtotime($lastmonthdate));
                break;
            case '7days':
                $sdate = Carbon::now()->subDays(7);
                $edate = Carbon::now()->subDays(1);
                $startdate = date('Y-m-d', strtotime($sdate));
                $enddate = date('Y-m-d', strtotime($edate));
                break;
            case '30days':
                $sdate = Carbon::now()->subDays(30);
                $edate = Carbon::now()->subDays(1);
                $startdate = date('Y-m-d', strtotime($sdate));
                $enddate = date('Y-m-d', strtotime($edate));
                break;
            case 'thisquarter':
                $dates = $this->helper->getDatesOfQuarter('current', null, 'Y-m-d');
                $startdate = $dates['start'];
                $enddate = $dates['end'];
                break;
            case 'lastquarter':
                $dates = $this->helper->getDatesOfQuarter('previous', null, 'Y-m-d');
                $startdate = $dates['start'];
                $enddate = $dates['end'];
                break;
            case 'custom':
                $startdate = date('Y-m-d', strtotime($customstartdate));
                $enddate = date('Y-m-d', strtotime($customenddate));
                break;
            case 'last12months':
                $sdate = Carbon::now()->subYear();
                $edate = Carbon::now();
                $startdate = date('Y-m-d', strtotime($sdate));
                $enddate = date('Y-m-d', strtotime($edate));;
                break;
        endswitch;
        $returndates = $this->getalldateinbetween($startdate, $enddate);
        return $returndates;
        // return $startdate.'=='.$enddate;
    }
    public function getalldateinbetween($startdate, $enddate)
    {
        $rangeArray = [];

        $startdate = strtotime($startdate);
        $enddate = strtotime($enddate);

        for ($currentDate = $startdate; $currentDate <= $enddate; $currentDate += (86400)) {
            $date = date('Y-m-d', $currentDate);
            $rangeArray[] = $date;
        }

        return $rangeArray;
    }
    public function heldchartdata(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';

        // get all query for filters
        $filterqry = $this->getfilter_query($datefilter, 'OrderDate');
        $wherestr = $filterqry['wherestr'];

        $orders = HeldOrders::whereIn('StoreID', explode(',', $storeids));

        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr('OrderDate', $filterqry['wheremonthval']);
        endif;

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('Source');
            $orders->whereRaw('RunDate=(select max(RunDate) FROM HeldOrder WHERE StoreID IN (' . $storeids . '))');
        } else {
            $orders->where('Source', 'sheet');
        }

        $orderdata = $orders->get();

        $labelarray = $datasetarray = $alldataar = [];
        // get all order data
        if (!empty($orderdata)) :
            foreach ($orderdata as $odata) :
                $orderdates = date('Y-m-d', strtotime($odata->OrderDate));
                $hstatus = str_replace('-', '', $odata->Status);
                $hstatus = str_replace(' ', '', $hstatus);
                $alldataar[$hstatus][$orderdates][] = $odata->OrderNumber;

            endforeach;
        endif;

        $datachart = [];
        $defaultlabels = $this->getlabel_str($datefilter);
        $bymonthar = [];
        $hstat_ar = ['PostalHold', 'EditAddress', 'Backordered'];
        if ($datefilter == 'thisweek' || $datefilter == '7days' || $datefilter == '30days' || $datefilter == 'thismonth' || $datefilter == 'lastmonth') :
            // labels and data for single dates

            foreach ($defaultlabels as $datelabels) :
                $labelarray[] = substr($datelabels, 5);
                foreach ($hstat_ar as $hstats) :
                    // assign array with status key and data
                    $datachart[$hstats][] = (isset($alldataar[$hstats])) ? (array_key_exists($datelabels, $alldataar[$hstats])) ? count($alldataar[$hstats][$datelabels]) : 0 : 0;
                endforeach;
            endforeach;
        else :
            // labels and data for months
            foreach ($defaultlabels as $datelabels) :
                $ymonth_key = date('Y-m', strtotime($datelabels));
                foreach ($hstat_ar as $hstats) :
                    // assign array with status key and data
                    $bymonthar[$hstats][$ymonth_key][] = (isset($alldataar[$hstats])) ? (array_key_exists($datelabels, $alldataar[$hstats])) ? count($alldataar[$hstats][$datelabels]) : 0 : 0;
                endforeach;
            endforeach;

            $hsctr = 1;
            foreach ($hstat_ar as $heldstats) :
                $labelarray = [];
                foreach ($bymonthar[$heldstats] as $key => $val) :
                    $ymon_today = date("Y-m");
                    if ($datefilter == 'last12months') :
                        // if last 12 months don't include current month
                        if ($ymon_today != $key) :
                            $labelarray[] = date('M', strtotime($key));
                            // assign total sum by month
                            $datachart[$heldstats][] = array_sum($bymonthar[$heldstats][$key]);
                        endif;
                    else :
                        $labelarray[] = date('M', strtotime($key));
                        // assign total sum by month
                        $datachart[$heldstats][] = array_sum($bymonthar[$heldstats][$key]);
                    endif;
                endforeach;
                $hsctr++;
            endforeach;
        endif;

        $labels = $labelarray;
        // echo '<pre>';
        // print_r($labelarray);
        // print_r($datachart);
        // echo '</pre>';exit;


        $returndataset = $datachart;
        $dsetar = [
            'Postal_Hold' => '#FCC354',
            'Bad_Address' => '#AA3939',
            'Backordered' => '#E97841'
        ];
        $dataset = [];
        foreach ($dsetar as $key => $val) :
            $labeltext = str_replace('_', ' ', $key);
            $keystr = str_replace('_', '', $key);
            $dataset[] = [
                'type' => 'line',
                'label' => $labeltext,
                'borderColor' => $val,
                'backgroundColor' => $val,
                'fill' => true,
                'data' => $datachart[$keystr],
                'lineTension' => 0.1,
                'borderWidth' => 2,
                'pointRadius' => 2
            ];
        endforeach;

        return response()->json([
            'chartlabel' => $labels,
            'chartdataset' => $dataset,
            'orderdata' => $orderdata
        ]);
    }
    public function openorderschartdata(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        // $datefilter = 'last12months';

        // get all query for filters
        if ($datefilter == 'custom') {
            $filterqry = $this->getfilter_query($datefilter, 'OrderDate', $request->start_date, $request->end_date);
        } else {
            $filterqry = $this->getfilter_query($datefilter, 'OrderDate');
        }
        $wherestr = $filterqry['wherestr'];

        $orders = OpenOrders::whereIn('StoreID', explode(',', $storeids));

        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr('OrderDate', $filterqry['wheremonthval']);
        endif;

        // $orders->whereNull('ForcePrint');
        // $orders->whereNull('CancelOrder');

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }

        $isUKdataCondition = '(isUKdata is null or isUKdata = 0)';
        if ($country_store == 'US') {
            $orders->whereRaw($isUKdataCondition);
        } else {
            $orders->where('isUKdata', 1);
            $isUKdataCondition = 'isUKdata = 1';
        }

        $orders->whereRaw('((CancelOrder is null) AND (ForcePrint is null))');

        $orders->whereRaw('RunDate=(select max(RunDate) FROM OpenOrders WHERE StoreID IN (' . $storeids . ') AND ((CancelOrder is null) AND (ForcePrint is null)) AND ' . $isUKdataCondition . ')');

        $orderdata = $orders->get();

        $labelarray = $datasetarray = $alldataar = [];
        // get all order data
        if (!empty($orderdata)) :
            foreach ($orderdata as $odata) :
                $orderdates = date('Y-m-d', strtotime($odata->OrderDate));
                $countdt = 1;
                $alldataar[$orderdates][] = $countdt;

                if (array_key_exists($orderdates, $datasetarray)) :
                    // if order date is equal to key and sum it
                    $sumdataar = $datasetarray[$orderdates] + $countdt;
                    $datasetarray[$orderdates] = $sumdataar;
                else :
                    $datasetarray[$orderdates] = $countdt;
                endif;

            endforeach;
        endif;
        ksort($datasetarray);
        // echo '<pre>';
        // print_r($datasetarray);
        // echo '</pre>';exit;
        $datachart = [];
        if ($datefilter == 'custom') {
            $defaultlabels = $this->getlabel_str($datefilter, $request->start_date, $request->end_date);
        } else {
            $defaultlabels = $this->getlabel_str($datefilter);
        }
        $bymonthar = [];
        if ($datefilter == 'thisweek' || $datefilter == '7days' || $datefilter == '30days' || $datefilter == 'thismonth' || $datefilter == 'lastmonth') :
            // labels and data for single dates
            foreach ($defaultlabels as $datelabels) :
                $labelarray[] = substr($datelabels, 5);
                $datachart[] = (array_key_exists($datelabels, $datasetarray)) ? $datasetarray[$datelabels] : 0;
            endforeach;
        else :
            // labels and data for months
            foreach ($defaultlabels as $datelabels) :
                $ymonth_key = date('Y-m', strtotime($datelabels));
                $bymonthar[$ymonth_key][] = (array_key_exists($datelabels, $datasetarray)) ? $datasetarray[$datelabels] : 0;
            endforeach;
            foreach ($bymonthar as $key => $val) :
                $ymon_today = date("Y-m");
                if ($datefilter == 'last12months') :
                    // if last 12 months don't include current month
                    if ($ymon_today != $key) :
                        $labelarray[] = date('M', strtotime($key));
                        $datachart[] = array_sum($bymonthar[$key]);
                    endif;
                else :
                    $labelarray[] = date('M', strtotime($key));
                    $datachart[] = array_sum($bymonthar[$key]);
                endif;
            endforeach;
        endif;

        $labels = $labelarray;


        // echo '<pre>';
        // print_r($datachart);
        // echo '</pre>';exit;

        $returndataset = $datachart;
        $dataset = [
            'type' => 'line',
            'label' => 'TOTAL NUMBERS OF OPEN ORDERS',
            'borderColor' => '#AA5539',
            'backgroundColor' => '#AA5539',
            'fill' => true,
            'data' => $returndataset,
            'lineTension' => 0.1,
            'borderWidth' => 2,
            'pointRadius' => 2
        ];
        return response()->json([
            'chartlabel' => $labels,
            'chartdataset' => $dataset,
            'orderdata' => $orderdata
        ]);
    }
    public function delayedchartdata(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        // $datefilter = 'lastmonth';

        // get all query for filters
        // get all query for filters
        if ($datefilter == 'custom') {
            $filterqry = $this->getfilter_query($datefilter, 'ShipDate', $request->start_date, $request->end_date);
        } else {
            $filterqry = $this->getfilter_query($datefilter, 'ShipDate');
        }
        // $filterqry = $this->getfilter_query($datefilter, 'ShipDate');
        $wherestr = $filterqry['wherestr'];

        $orders = DelayedOrders::whereIn('StoreID', explode(',', $storeids));
        $orders->whereIn('DeliveryStatus', ['Delayed', 'Exception']);

        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr('ShipDate', $filterqry['wheremonthval']);
            $orders->orderBy('ShipDate', 'ASC');
        endif;

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('Source');
        } else {
            $orders->where('Source', 'sheet');
        }

        $orders->whereRaw('RunDate=(select max(RunDate) FROM DelayedShipments WHERE StoreID IN (' . $storeids . '))');
        $orders->groupBy('OrderNumber');
        $orderdata = $orders->get();

        $labelarray = $datasetarray = $alldataar = [];
        // get all order data
        if (!empty($orderdata)) :
            foreach ($orderdata as $odata) :
                $orderdates = date('Y-m-d', strtotime($odata->ShipDate));
                $dstatus = str_replace('-', '', $odata->DeliveryStatus);
                $dstatus = str_replace(' ', '', $dstatus);
                $alldataar[$dstatus][$orderdates][] = $odata->OrderNumber;

            endforeach;
        endif;

        $datachart = [];
        // $defaultlabels = $this->getlabel_str($datefilter);
        if ($datefilter == 'custom') {
            $defaultlabels = $this->getlabel_str($datefilter, $request->start_date, $request->end_date);
        } else {
            $defaultlabels = $this->getlabel_str($datefilter);
        }
        $bymonthar = [];

        $dstat_ar = ['Delayed'];

        if ($datefilter == 'thisweek' || $datefilter == '7days' || $datefilter == '30days' || $datefilter == 'thismonth' || $datefilter == 'lastmonth') :
            // labels and data for single dates

            foreach ($defaultlabels as $datelabels) :
                $labelarray[] = substr($datelabels, 5);
                foreach ($dstat_ar as $dstatkey) :
                    // assign array with status key and data
                    $datachart[$dstatkey][] = (isset($alldataar[$dstatkey])) ? (array_key_exists($datelabels, $alldataar[$dstatkey])) ? count($alldataar[$dstatkey][$datelabels]) : 0 : 0;
                endforeach;
            endforeach;
        else :
            // labels and data for months
            foreach ($defaultlabels as $datelabels) :
                $ymonth_key = date('Y-m', strtotime($datelabels));
                foreach ($dstat_ar as $dstatkey) :
                    // assign array with status key and data
                    $bymonthar[$dstatkey][$ymonth_key][] = (isset($alldataar[$dstatkey])) ? (array_key_exists($datelabels, $alldataar[$dstatkey])) ? count($alldataar[$dstatkey][$datelabels]) : 0 : 0;
                endforeach;

            endforeach;

            $hsctr = 1;
            foreach ($dstat_ar as $delaystats) :
                $labelarray = [];
                foreach ($bymonthar[$delaystats] as $key => $val) :
                    $ymon_today = date("Y-m");
                    if ($datefilter == 'last12months') :
                        // if last 12 months don't include current month
                        if ($ymon_today != $key) :
                            $labelarray[] = date('M', strtotime($key));
                            // assign total sum by month
                            $datachart[$delaystats][] = array_sum($bymonthar[$delaystats][$key]);
                        endif;
                    else :
                        $labelarray[] = date('M', strtotime($key));
                        // assign total sum by month
                        $datachart[$delaystats][] = array_sum($bymonthar[$delaystats][$key]);
                    endif;
                endforeach;
                $hsctr++;
            endforeach;
        endif;

        $labels = $labelarray;
        // echo '<pre>';
        // print_r($labelarray);
        // print_r($datachart);
        // echo '</pre>';exit;

        $returndataset = $datachart;
        $dsetar = ['Delayed' => '#FCC354'];

        $dataset = [];
        foreach ($dsetar as $key => $val) :
            $labeltext = str_replace('_', ' ', $key);
            $keystr = str_replace('_', '', $key);
            $dataset[] = [
                'type' => 'bar',
                'label' => $labeltext,
                'borderColor' => $val,
                'backgroundColor' => $val,
                'fill' => true,
                'data' => $datachart[$keystr],
                'lineTension' => 0.1,
                'borderWidth' => 2,
                'borderRadius' => 2,
                'pointRadius' => 2
            ];
        endforeach;

        return response()->json([
            'chartlabel' => $labels,
            'chartdataset' => $dataset,
            'orderdata' => $orderdata
        ]);
    }
    public function intransitchartdata(Request $request)
    {
        $storeids = $this->getuser_storeid(true);

        $datefilter = ($request->datefilter != '') ? $request->datefilter : '30days';
        // $datefilter = 'lastmonth';

        // get all query for filters
        if ($datefilter == 'custom') {
            $filterqry = $this->getfilter_query($datefilter, 'ShipDate', $request->start_date, $request->end_date);
        } else {
            $filterqry = $this->getfilter_query($datefilter, 'ShipDate');
        }
        $wherestr = $filterqry['wherestr'];

        $orders = InTransit::whereIn('StoreID', explode(',', $storeids));

        if ($filterqry['wheretype'] == 'days') :
            $orders->$wherestr($filterqry['whereclause']);
        else :
            $orders->$wherestr('ShipDate', $filterqry['wheremonthval']);
            $orders->orderBy('ShipDate', 'ASC');
        endif;

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($country_store == 'US') {
            $orders->whereNull('Source');
        } else {
            $orders->where('Source', 'sheet');
        }

        $orders->whereRaw('RunDate=(select max(RunDate) FROM InTransit WHERE StoreID IN (' . $storeids . '))');
        $orderdata = $orders->get();

        $labelarray = $datasetarray = $alldataar = [];
        // get all order data
        if (!empty($orderdata)) :
            foreach ($orderdata as $odata) :
                $orderdates = date('Y-m-d', strtotime($odata->ShipDate));
                $dstatus = str_replace('-', '', $odata->DeliveryStatus);
                $dstatus = str_replace(' ', '', $dstatus);
                $alldataar[$dstatus][$orderdates][] = $odata->OrderNumber;

            endforeach;
        endif;

        $datachart = [];
        if ($datefilter == 'custom') {
            $defaultlabels = $this->getlabel_str($datefilter, $request->start_date, $request->end_date);
        } else {
            $defaultlabels = $this->getlabel_str($datefilter);
        }
        // $defaultlabels = $this->getlabel_str($datefilter);
        $bymonthar = [];

        $dstat_ar = ['Accepted', 'Delivered', 'InTransit'];

        if ($datefilter == 'thisweek' || $datefilter == '7days' || $datefilter == '30days' || $datefilter == 'thismonth' || $datefilter == 'lastmonth') :
            // labels and data for single dates

            foreach ($defaultlabels as $datelabels) :
                $labelarray[] = substr($datelabels, 5);
                foreach ($dstat_ar as $dstatkey) :
                    // assign array with status key and data
                    $datachart[$dstatkey][] = (isset($alldataar[$dstatkey])) ? (array_key_exists($datelabels, $alldataar[$dstatkey])) ? count($alldataar[$dstatkey][$datelabels]) : 0 : 0;
                endforeach;
            endforeach;
        else :
            // labels and data for months
            foreach ($defaultlabels as $datelabels) :
                $ymonth_key = date('Y-m', strtotime($datelabels));
                foreach ($dstat_ar as $dstatkey) :
                    // assign array with status key and data
                    $bymonthar[$dstatkey][$ymonth_key][] = (isset($alldataar[$dstatkey])) ? (array_key_exists($datelabels, $alldataar[$dstatkey])) ? count($alldataar[$dstatkey][$datelabels]) : 0 : 0;
                endforeach;

            endforeach;

            $hsctr = 1;
            foreach ($dstat_ar as $delaystats) :
                $labelarray = [];
                foreach ($bymonthar[$delaystats] as $key => $val) :
                    $ymon_today = date("Y-m");
                    if ($datefilter == 'last12months') :
                        // if last 12 months don't include current month
                        if ($ymon_today != $key) :
                            $labelarray[] = date('M', strtotime($key));
                            // assign total sum by month
                            $datachart[$delaystats][] = array_sum($bymonthar[$delaystats][$key]);
                        endif;
                    else :
                        $labelarray[] = date('M', strtotime($key));
                        // assign total sum by month
                        $datachart[$delaystats][] = array_sum($bymonthar[$delaystats][$key]);
                    endif;
                endforeach;
                $hsctr++;
            endforeach;
        endif;

        $labels = $labelarray;
        // echo '<pre>';
        // print_r($labelarray);
        // print_r($datachart);
        // echo '</pre>';exit;

        $returndataset = $datachart;
        $dsetar = [
            'Accepted' => '#FCC354',
            'Delivered' => '#AA3939',
            'In_Transit' => '#E97841'
        ];

        $dataset = [];
        foreach ($dsetar as $key => $val) :
            $labeltext = str_replace('_', ' ', $key);
            $keystr = str_replace('_', '', $key);
            $dataset[] = [
                'type' => 'bar',
                'label' => $labeltext,
                'borderColor' => $val,
                'backgroundColor' => $val,
                'fill' => true,
                'data' => $datachart[$keystr],
                'lineTension' => 0.1,
                'borderWidth' => 2,
                'borderRadius' => 2,
                'pointRadius' => 2
            ];
        endforeach;

        return response()->json([
            'chartlabel' => $labels,
            'chartdataset' => $dataset,
            'orderdata' => $orderdata
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

    public static function getuser_id()
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        return $userid;
    }

    public function archiveOrder(Request $request)
    {
        $storeid = $this->getuser_storeid();
        $orderid = $request->orderid;
        $status = $request->status;

        Orders::where('id', $orderid)->where('store_id', $storeid)->update(['status' => $status]);

        return response()->json([
            'success' => true
        ]);
    }

    public function archiveOrders(Request $request)
    {
        $storeid = $this->getuser_storeid();
        $orders = $request->orders;
        if (!empty($orders)) {
            $orders = json_decode($orders, true);
            $orderids = [];
            foreach ($orders as $order) {
                $orderids[] = $order['id'];
            }

            if (!empty($orderids)) {
                Orders::whereIn('id', $orderids)->where('store_id', $storeid)->update(['status' => 'archived']);
            }
        }

        return response()->json([
            'success' => true
        ]);
    }

    public function getOrder(Request $request)
    {
        $orderid = $request->orderid;
        $order = Orders::where('id', $orderid)->first();

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    public function getHeldOrder(Request $request)
    {
        $orderid = $request->orderid;
        $order = HeldOrders::where('ID', $orderid)->first();

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    public function getOpenOrder(Request $request)
    {
        $orderid = $request->orderid;
        $order = OpenOrders::where('ID', $orderid)->first();

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    public function getEditedOpenOrder(Request $request)
    {
        $orderid = $request->orderid;
        $order = EditOpenOrders::where('OpenorderID', $orderid)->first();

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    public function updateOrder(Request $request)
    {
        $orderid = $request->orderid;
        Orders::where('id', $orderid)->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'address' => $request->address,
            'buyer_postal_code' => $request->buyer_postal_code,
            'shipping_country' => $request->shipping_country
        ]);

        return response()->json([
            'success' => true
        ]);
    }

    public function updateOpenOrder(Request $request)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }

        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }

        $user = User::where('id', $userid)->first();

        $orderid = $request->orderid;
        $openorders = OpenOrders::where('ID', $orderid)->first();
        OpenOrders::where('ID', $orderid)->update([
            'FirstName' => $request->first_name,
            'LastName' => $request->last_name,
            'Address' => $request->address,
            'Address2' => $request->address2,
            'Address3' => $request->address3,
            'ShipCity' => $request->city,
            'ShipState' => $request->state,
            'Zipcode' => $request->buyer_postal_code,
            'Country' => $request->shipping_country,
            'UpdatedStatus' => 'prepkanga',
            'EditStatus' => 1
        ]);

        // Check updated items only
        $message = 'Order Number ' . $openorders->OrderNumber;

        // Send email
        $details = array(
            'subject' => $country_store . ' Open orders updated.',
            'heading' => $country_store . ' Open order updated.',
            'message' => $message,
            'template' => 'orders'
        );
        $editreason = array();
        if (trim($request->first_name) !== trim($openorders->FirstName)) {
            $details['first_name'] = $request->first_name;
            $editreason[] = 'FirstName: From ' . $openorders->FirstName . ' to ' . $request->first_name;
        }
        if (trim($request->last_name) !== trim($openorders->LastName)) {
            $details['last_name'] = $request->last_name;
            $editreason[] = 'LastName: From ' . $openorders->LastName . ' to ' . $request->last_name;
        }
        if (trim($request->address) !== trim($openorders->Address)) {
            $details['address'] = $request->address;
            $editreason[] = 'Address: From ' . $openorders->Address . ' to ' . $request->address;
        }
        if (trim($request->address2) !== trim($openorders->Address2)) {
            $details['address2'] = $request->address2;
            $editreason[] = 'Address 2: From ' . $openorders->Address2 . ' to ' . $request->address2;
        }
        if (trim($request->address3) !== trim($openorders->Address3)) {
            $details['address3'] = $request->address3;
            $editreason[] = 'Address 3: From ' . $openorders->Address3 . ' to ' . $request->address3;
        }
        if (trim($request->city) !== trim($openorders->ShipCity)) {
            $details['city'] = $request->city;
            $editreason[] = 'City: From ' . $openorders->ShipCity . ' to ' . $request->city;
        }
        if (trim($request->state) !== trim($openorders->ShipState)) {
            $details['state'] = $request->state;
            $editreason[] = 'State: From ' . $openorders->ShipState . ' to ' . $request->state;
        }
        if (trim($request->buyer_postal_code) !== trim($openorders->Zipcode)) {
            $details['postal_code'] = $request->buyer_postal_code;
            $editreason[] = 'Postal: From ' . $openorders->Zipcode . ' to ' . $request->buyer_postal_code;
        }
        if (trim($request->shipping_country) !== trim($openorders->Country)) {
            $details['shipping_country'] = $request->shipping_country;
            $editreason[] = 'Country: From ' . $openorders->Country . ' to ' . $request->shipping_country;
        }

        $stringreason = implode(', ', $editreason);
        $editreasons = "Edited " . $stringreason;

        $isuk = 1;
        if ($country_store == 'US') {
            $isuk = NULL;
        }

        EditOpenOrders::create([
            'OpenorderID' => $openorders->OrderID,
            'StoreID' => $openorders->StoreID,
            'StoreName' => $openorders->StoreName,
            'OrderNumber' => $openorders->OrderNumber,
            'OrderDate' => $openorders->OrderDate,
            'FirstName' => $request->first_name,
            'LastName' => $request->last_name,
            'Address' => $request->address,
            'Address2' => $request->address2,
            'Address3' => $request->address3,
            'ShipCity' => $request->city,
            'ShipState' => $request->state,
            'Zipcode' => $request->buyer_postal_code,
            'Country' => $request->shipping_country,
            'Reason' => $editreasons,
            'isUKdata' => $isuk,
            'edit_with' => $userinfo->first_name
        ]);

        if ($isuk) {
            Mail::to($this->emailrecipient)->send(new AppMail($details));
        }

        return response()->json([
            'success' => true,
            'country' => $country_store
        ]);
    }

    public function cancelOpenOrder(Request $request)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $user = User::where('id', $userid)->first();

        $orderid = $request->orderid;
        $openorder = OpenOrders::where('ID', $orderid)->first();

        if (!$openorder->CancelOrder && !$openorder->ForcePrint) {
            OpenOrders::where('ID', $orderid)->update([
                'CancelOrder' => 1
            ]);

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }

            $isuk = 1;
            if ($country_store == 'US') {
                $isuk = NULL;
            }

            $editreasons = "Open Order is cancelled.";

            EditOpenOrders::create([
                'OpenorderID' => $openorder->OrderID,
                'StoreID' => $openorder->StoreID,
                'StoreName' => $openorder->StoreName,
                'OrderNumber' => $openorder->OrderNumber,
                'OrderDate' => $openorder->OrderDate,
                'FirstName' => $openorder->FirstName,
                'LastName' => $openorder->LastName,
                'Address' => $openorder->Address,
                'Address2' => $openorder->Address2,
                'Address3' => $openorder->Address3,
                'ShipCity' => $openorder->ShipCity,
                'ShipState' => $openorder->ShipState,
                'Zipcode' => $openorder->Zipcode,
                'Country' => $openorder->Country,
                'Reason' => $editreasons,
                'isUKdata' => $isuk,
                'edit_with' => $userinfo->first_name
            ]);

            if ($isuk) {
                $details = array(
                    'subject' => $country_store . ' Open order cancelled.',
                    'heading' => $editreasons,
                    'message' => 'Order Number ' . $openorder->OrderNumber,
                    'template' => 'orders'
                );
                Mail::to($this->emailrecipient)->send(new AppMail($details));
            }
        }

        return response()->json([
            'success' => true,
            'printed' => $openorder->ForcePrint,
            'cancelled' => $openorder->CancelOrder
        ]);
    }

    public function printOpenOrder(Request $request)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $user = User::where('id', $userid)->first();

        $orderid = $request->orderid;
        $openorder = OpenOrders::where('ID', $orderid)->first();

        if (!$openorder->ForcePrint && !$openorder->CancelOrder) {
            OpenOrders::where('ID', $orderid)->update([
                'ForcePrint' => 1
            ]);

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }

            $isuk = 1;
            if ($country_store == 'US') {
                $isuk = NULL;
            }

            $editreasons = "Open Order is force printed.";

            EditOpenOrders::create([
                'OpenorderID' => $openorder->OrderID,
                'StoreID' => $openorder->StoreID,
                'StoreName' => $openorder->StoreName,
                'OrderNumber' => $openorder->OrderNumber,
                'OrderDate' => $openorder->OrderDate,
                'FirstName' => $openorder->FirstName,
                'LastName' => $openorder->LastName,
                'Address' => $openorder->Address,
                'Address2' => $openorder->Address2,
                'Address3' => $openorder->Address3,
                'ShipCity' => $openorder->ShipCity,
                'ShipState' => $openorder->ShipState,
                'Zipcode' => $openorder->Zipcode,
                'Country' => $openorder->Country,
                'Reason' => $editreasons,
                'isUKdata' => $isuk,
                'edit_with' => $userinfo->first_name
            ]);

            if ($isuk) {
                $details = array(
                    'subject' => $country_store . ' Open order force printed.',
                    'heading' => $editreasons,
                    'message' => 'Order Number ' . $openorder->OrderNumber,
                    'template' => 'orders'
                );
                Mail::to($this->emailrecipient)->send(new AppMail($details));
            }
        }

        return response()->json([
            'success' => true,
            'cancelled' => $openorder->CancelOrder,
            'printed' => $openorder->ForcePrint
        ]);
    }

    public function updateHeldOrder(Request $request)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $user = User::where('id', $userid)->first();

        $orderid = $request->orderid;
        $heldorders = HeldOrders::where('ID', $orderid)->first();
        $orderNumber = $heldorders->OrderNumber;

        // Update held orders
        HeldOrders::where('ID', $orderid)->update([
            'FirstName' => $request->first_name,
            'LastName' => $request->last_name,
            'Address' => $request->address,
            'Address2' => $request->address2,
            'Address3' => $request->address3,
            'ShipCity' => $request->city,
            'ShipState' => $request->state,
            'Zipcode' => $request->buyer_postal_code,
            'Country' => $request->shipping_country,
            'EditStatus' => 1
        ]);

        // Check if in open orders
        $openorders = OpenOrders::where('OrderNumber', $heldorders->OrderNumber)->first();
        if (!empty($openorders)) {
            OpenOrders::where('OrderNumber', $heldorders->OrderNumber)->update([
                'FirstName' => $request->first_name,
                'LastName' => $request->last_name,
                'Address' => $request->address,
                'Address2' => $request->address2,
                'Address3' => $request->address3,
                'ShipCity' => $request->city,
                'ShipState' => $request->state,
                'Zipcode' => $request->buyer_postal_code,
                'Country' => $request->shipping_country,
                'UpdatedStatus' => 'prepkanga'
            ]);
        }

        $editopenorders = EditOpenOrders::where('OrderNumber', $heldorders->OrderNumber)->first();
        if (!empty($editopenorders)) {
            EditOpenOrders::where('OrderNumber', $heldorders->OrderNumber)->update([
                'FirstName' => $request->first_name,
                'LastName' => $request->last_name,
                'Address' => $request->address,
                'Address2' => $request->address2,
                'Address3' => $request->address3,
                'ShipCity' => $request->city,
                'ShipState' => $request->state,
                'Zipcode' => $request->buyer_postal_code,
                'Country' => $request->shipping_country
            ]);
        } else {
            EditOpenOrders::create([
                'OpenorderID' => $heldorders->OrderID,
                'StoreID' => $heldorders->StoreID,
                'StoreName' => $heldorders->StoreName,
                'OrderNumber' => $heldorders->OrderNumber,
                'OrderDate' => $heldorders->OrderDate,
                'FirstName' => $request->first_name,
                'LastName' => $request->last_name,
                'Address' => $request->address,
                'Address2' => $request->address2,
                'Address3' => $request->address3,
                'ShipCity' => $request->city,
                'ShipState' => $request->state,
                'Zipcode' => $request->buyer_postal_code,
                'Country' => $request->shipping_country
            ]);
        }

        // Check updated items only
        $message = 'Order Number ' . $orderNumber;

        // Send email
        $details = array(
            'subject' => 'Held orders updated.',
            'heading' => 'Held order updated.',
            'message' => $message,
            'template' => 'orders'
        );
        if (trim($request->first_name) !== trim($heldorders->FirstName)) {
            $details['first_name'] = $request->first_name;
        }
        if (trim($request->last_name) !== trim($heldorders->LastName)) {
            $details['last_name'] = $request->last_name;
        }
        if (trim($request->address) !== trim($heldorders->Address)) {
            $details['address'] = $request->address;
        }
        if (trim($request->address2) !== trim($heldorders->Address2)) {
            $details['address2'] = $request->address2;
        }
        if (trim($request->address3) !== trim($heldorders->Address3)) {
            $details['address3'] = $request->address3;
        }
        if (trim($request->city) !== trim($heldorders->ShipCity)) {
            $details['city'] = $request->city;
        }
        if (trim($request->state) !== trim($heldorders->ShipState)) {
            $details['state'] = $request->state;
        }
        if (trim($request->buyer_postal_code) !== trim($heldorders->Zipcode)) {
            $details['postal_code'] = $request->buyer_postal_code;
        }
        if (trim($request->shipping_country) !== trim($heldorders->Country)) {
            $details['shipping_country'] = $request->shipping_country;
        }
        // Mail::to($this->emailrecipient)->send(new AppMail($details));
        // Mail::to($user->email)->send(new AppMail($details));

        return response()->json([
            'success' => true
        ]);
    }

    public function get_editstatus_order(Request $request)
    {
        $storeid = $request->storeid;
        $checkdisable = $this->helper->checkdisableopenorder($storeid);
        return response()->json([
            'success' => true,
            'editstatus' => $checkdisable['editstatus'],
            'disabletype' => $checkdisable['disabletype']
        ]);
    }

    public function assign_storeid()
    {
        $storeid = $this->getuser_storeid();
        return response()->json([
            'success' => true,
            'storeid' => $storeid
        ]);
    }

    public function allorders(Request $request)
    {
        $storeids = $this->getuser_storeid(true);
        $perpage = ($request->perpage != '') ? $request->perpage : ($request->export != "" ? 25000 : 200);
        $country_store = session('country_store');

        if ($country_store == 'UK') {
            $allorders = [
                "data" => [],
                "total" => 0,
            ];
        } else {
            if (empty($country_store)) {
                $country_store = 'US';
            }

            $orders = ClientOrders::join(
                "ClientShipmentsV2",
                "ClientShipmentsV2.ordernumber",
                "=",
                "ClientOrders.ordernumber"
            )->whereIn('Storeid', explode(',', $storeids));

            if (isset($request->statusfilter) != '') {
                $orders->where('LocalStatus', $request->statusfilter);
                if ($request->start_date != "null"  && $request->end_date != "null") {
                    if ($request->filterByDate == "Order Date") {
                        $orders->whereBetween('ClientOrders.OrderDate', [$request->start_date, $request->end_date]);
                    } else {
                        $orders->whereBetween('ClientShipmentsV2.ProcessedDate', [$request->start_date, $request->end_date]);
                    }
                } else {
                    if ($request->shippedFilterDate != '') {
                        if ($request->shippedFilterDate == 'Today') {
                            if ($request->statusfilter == "Shipped") {

                                $orders->whereDate('ClientShipmentsV2.ProcessedDate', Carbon::now());
                            }
                        } else {
                            $orders->whereBetween('ClientShipmentsV2.ProcessedDate', [Carbon::now()->subDays($request->shippedFilterDate), Carbon::now()]);
                        }
                    }
                }
            }
            if (isset($request->searchOrders) != '') {
                $searchTerm = $request->searchOrders;
                $orders->where(function ($query) use ($searchTerm) {
                    if ($searchTerm  == "Delayed") {
                        $startDate = Carbon::today()->subDays(5)->toDateString();
                        $query->whereNotIn('ClientShipmentsV2.TrackingStatus', ['Delivered'])
                            ->where('ClientOrders.LocalStatus', "=", "Shipped")
                            ->where('ClientShipmentsV2.Carrier', '=', "USPS")
                            ->whereDate('ClientShipmentsV2.ProcessedDate', '<=', $startDate)
                            ->orderBy('ClientShipmentsV2.ProcessedDate', 'desc');
                    } else {
                        $query->where('ClientOrders.ordernumber', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientOrders.OrderDate', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientOrders.ShipStreet1', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientOrders.ShipStreet2', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientOrders.ShipStreet3', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientOrders.ShipCity', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientOrders.ShipPostalCode', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientOrders.ShipStateProvCode', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientOrders.ShipCountryCode', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientShipmentsV2.TrackingNumber', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientShipmentsV2.ProcessedDate', 'LIKE', "%" . $searchTerm . "%")
                            ->orWhere('ClientShipmentsV2.Carrier', 'LIKE', "%" . $searchTerm . "%");
                    }
                });
            }

            $orders->orderBy('ClientOrders.OrderDate', 'DESC');
            $allorders = $orders->paginate($perpage, ['*'], 'page', $request->page);
        }
        // if ($request->export != '') {
        //     $today = now()->addDay()->format('Y-m-d');
        //     $fileName = 'allOrders-' . $today . '.csv';

        //     $headers = array(
        //         "Content-type" => "text/csv",
        //         "Content-Disposition" => "attachment; filename=$fileName",
        //         "Pragma" => "no-cache",
        //         "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
        //         "Expires" => "0"
        //     );
        //     $output = fopen('php://output', 'w');
        //     fputcsv($output, ['ordernumber', 'TrackingNumber', 'OrderDate', 'ShippedDate', 'Carrier', 'TrackingStatus', 'ShipStreet1', 'ShipStreet2', 'ShipStreet3', 'ShipCity', 'ShipPostalCode', 'ShipStateProvCode', 'ShipCountryCode']);

        //     foreach ($orders->get() as $ordersData) {

        //         $ordernumber = $ordersData->ordernumber;
        //         $TrackingNumber = $ordersData->TrackingNumber;
        //         $OrderDate = $ordersData->OrderDate;
        //         $ShippedDate = $ordersData->ProcessedDate;
        //         $Carrier = $ordersData->Carrier;
        //         $TrackingStatus = $ordersData->TrackingStatus;
        //         $ShipStreet1 = $ordersData->ShipStreet1;
        //         $ShipStreet2 = $ordersData->ShipStreet2;
        //         $ShipStreet3 = $ordersData->ShipStreet3;
        //         $ShipCity = $ordersData->ShipCity;
        //         $ShipPostalCode = $ordersData->ShipPostalCode;
        //         $ShipStateProvCode = $ordersData->ShipStateProvCode;
        //         $ShipCountryCode = $ordersData->ShipCountryCode;
        //         fputcsv($output, [$ordernumber, $TrackingNumber, $OrderDate, $ShippedDate, $Carrier, $TrackingStatus, $ShipStreet1, $ShipStreet2, $ShipStreet3, $ShipCity, $ShipPostalCode, $ShipStateProvCode, $ShipCountryCode]);
        //     }

        //     return response()->stream(
        //         function () use ($output) {
        //             fclose($output);
        //         },
        //         200,
        //         $headers
        //     );
        // }
        return response()->json([
            'success' => true,
            'orders' => $allorders,
        ]);
    }

    public function getClientOrderItem(Request $request)
    {
        $clientOrder = ClientOrderItem::join("ClientProducts", "ClientProducts.SKU", "=", "ClientOrderItem.SKU")
            ->where('ClientOrderItem.ordernumber', $request->orderNumber)
            ->where('ClientOrderItem.OrderID', $request->orderId);
        $clientOrderItem = $clientOrder->get();

        return response()->json([
            'success' => true,
            'ordernumber' => $request->orderNumber,
            'clientOrderItem' => $clientOrderItem
        ]);
    }

    public function getLocalStatusEditAddress(Request $request)
    {
        $local_status = ClientOrders::where('ordernumber', $request->ordernumber)
            ->where('LocalStatus', $request->localstatus)
            ->get();

        return response()->json([
            'success' => true,
            'LocalStatusEditAddress' => $local_status
        ]);
    }

    public function updateLocalStatusAddress(Request $request)
    {
        try {
            $request->validate([
                'country' => ['required'],
                'state' => ['required'],
                'city' => ['required'],
                'street1' => ['required'],
                'postal_code' => ['required'],
            ]);

            $ship_state = $request->stateText ?? $request->state;
            $ship_city = $request->cityText ?? $request->city;

            if ($request->localstatus == "Bad Address") {

                ClientOrders::where('ordernumber', $request->order_number)
                    ->where('LocalStatus', "Bad Address")
                    ->update([
                        'ShipCountryCode' => $request->country,
                        'ShipStateProvCode' => $ship_state,
                        'ShipCity' => $ship_city,
                        'ShipStreet1' => $request->street1,
                        'ShipStreet2' => $request->street2,
                        'ShipStreet3' => $request->street3,
                        'ShipPostalCode' => $request->postal_code,
                        'LocalStatus' => "processing",
                        'ModifiedDate' => Carbon::now()
                    ]);
            } else {
                ClientOrders::where('ordernumber', $request->order_number)
                    ->where('LocalStatus', $request->localstatus)
                    ->update([
                        'ShipCountryCode' => $request->country,
                        'ShipStateProvCode' => $ship_state,
                        'ShipCity' => $ship_city,
                        'ShipStreet1' => $request->street1,
                        'ShipStreet2' => $request->street2,
                        'ShipStreet3' => $request->street3,
                        'ShipPostalCode' => $request->postal_code,
                        'LocalStatus' => $request->localstatus,
                        'ModifiedDate' => Carbon::now()
                    ]);
            }

            $clientOrders = ClientOrders::where('ordernumber', $request->order_number)->first();
            $editreasons = "All Order Address Updated";
            $userinfo = Auth::user();
            $store = AdminStores::where('StoreID', $clientOrders->Storeid)->first();

            EditOpenOrders::create([
                'OpenorderID' => $clientOrders->orderid,
                'StoreID' => $store->StoreID,
                'StoreName' => $store->StoreName,
                'OrderNumber' => $clientOrders->ordernumber,
                'OrderDate' => $clientOrders->OrderDate,
                'FirstName' => $clientOrders->ShipFirstName,
                'LastName' => $clientOrders->ShipLastName,
                'Address' => $clientOrders->ShipStreet1,
                'Address2' => $clientOrders->ShipStreet2,
                'Address3' => $clientOrders->ShipStreet3,
                'ShipCity' => $clientOrders->ShipCity,
                'ShipState' => $clientOrders->ShipState,
                'Zipcode' => $clientOrders->ShipPostalCode,
                'Country' => $clientOrders->ShipCountryCode,
                'Reason' => $editreasons,
                'isUKdata' => null,
                'edit_with' => $userinfo->first_name
            ]);

            return response()->json([
                'success' => true,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function allOrdersLocalStatus()
    {
        $storeids = $this->getuser_storeid(true);

        $localstatus = ClientOrders::distinct()
            ->whereIn('Storeid', explode(',', $storeids))
            ->get(['localstatus']);

        return response()->json([
            'success' => true,
            'localstatus' => $localstatus,
        ]);
    }

    public function allOrdersForcePrint(Request $request)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $user = User::where('id', $userid)->first();

        $orderid = $request->orderid;
        $ordernumber = $request->ordernumber;
        $clientOrders = ClientOrders::where('orderid', $orderid)->where('ordernumber', $ordernumber)->first();
        $forcePrint = 'Force Print';

        if ($clientOrders->LocalStatus != $forcePrint) {
            ClientOrders::where('orderid', $orderid)->update([
                'LocalStatus' => $forcePrint,
                'ModifiedDate' => Carbon::now()
            ]);

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }

            $isuk = 1;
            if ($country_store == 'US') {
                $isuk = NULL;
            }

            $editreasons = "All Order is " . $forcePrint . ".";
            $store = AdminStores::where('StoreID', $clientOrders->Storeid)->first();

            EditOpenOrders::create([
                'OpenorderID' => $clientOrders->orderid,
                'StoreID' => $store->StoreID,
                'StoreName' => $store->StoreName,
                'OrderNumber' => $clientOrders->ordernumber,
                'OrderDate' => $clientOrders->OrderDate,
                'FirstName' => $clientOrders->ShipFirstName,
                'LastName' => $clientOrders->ShipLastName,
                'Address' => $clientOrders->ShipStreet1,
                'Address2' => $clientOrders->ShipStreet2,
                'Address3' => $clientOrders->ShipStreet3,
                'ShipCity' => $clientOrders->ShipCity,
                'ShipState' => $clientOrders->ShipState,
                'Zipcode' => $clientOrders->ShipPostalCode,
                'Country' => $clientOrders->ShipCountryCode,
                'Reason' => $editreasons,
                'isUKdata' => $isuk,
                'edit_with' => $userinfo->first_name
            ]);

            if ($isuk) {
                $details = array(
                    'subject' => $country_store . ' All Order ' . $forcePrint . '.',
                    'heading' => $editreasons,
                    'message' => 'Order Number ' . $ordernumber,
                    'template' => 'orders'
                );
                Mail::to($this->emailrecipient)->send(new AppMail($details));
            }
        }

        return response()->json([
            'success' => true,
            'printed' => $forcePrint
        ]);
    }

    public function allOrdersCancelByClient(Request $request)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $user = User::where('id', $userid)->first();

        $orderid = $request->orderid;
        $ordernumber = $request->ordernumber;
        $clientOrders = ClientOrders::where('orderid', $orderid)->where('ordernumber', $ordernumber)->first();
        $cancelByClient = 'Cancel By Client';

        if ($clientOrders->LocalStatus != $cancelByClient) {
            ClientOrders::where('orderid', $orderid)->update([
                'LocalStatus' => $cancelByClient,
                'ModifiedDate' => Carbon::now()
            ]);

            $country_store = session('country_store');
            if (empty($country_store)) {
                $country_store = 'US';
            }

            $isuk = 1;
            if ($country_store == 'US') {
                $isuk = NULL;
            }

            $editreasons = "All Order is " . $cancelByClient . ".";
            $store = AdminStores::where('StoreID', $clientOrders->Storeid)->first();

            EditOpenOrders::create([
                'OpenorderID' => $clientOrders->orderid,
                'StoreID' => $store->StoreID,
                'StoreName' => $store->StoreName,
                'OrderNumber' => $clientOrders->ordernumber,
                'OrderDate' => $clientOrders->OrderDate,
                'FirstName' => $clientOrders->ShipFirstName,
                'LastName' => $clientOrders->ShipLastName,
                'Address' => $clientOrders->ShipStreet1,
                'Address2' => $clientOrders->ShipStreet2,
                'Address3' => $clientOrders->ShipStreet3,
                'ShipCity' => $clientOrders->ShipCity,
                'ShipState' => $clientOrders->ShipState,
                'Zipcode' => $clientOrders->ShipPostalCode,
                'Country' => $clientOrders->ShipCountryCode,
                'Reason' => $editreasons,
                'isUKdata' => $isuk,
                'edit_with' => $userinfo->first_name
            ]);

            if ($isuk) {
                $details = array(
                    'subject' => $country_store . ' All Order ' . $cancelByClient . '.',
                    'heading' => $editreasons,
                    'message' => 'Order Number ' . $ordernumber,
                    'template' => 'orders'
                );
                Mail::to($this->emailrecipient)->send(new AppMail($details));
            }
        }

        return response()->json([
            'success' => true,
            'cancelled' => $cancelByClient
        ]);
    }

    public function countries()
    {
        $countries = Countries::all();

        return response()->json([
            'success' => true,
            'countries' => $countries,
        ]);
    }

    public function states()
    {
        $states = States::all();

        return response()->json([
            'success' => true,
            'states' => $states,
        ]);
    }

    public function cities()
    {
        $cities = Cities::all();

        return response()->json([
            'success' => true,
            'cities' => $cities,
        ]);
    }
}
