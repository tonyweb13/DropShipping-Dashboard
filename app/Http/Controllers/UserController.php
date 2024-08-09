<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Stores;
use App\Models\CustomerSettings;
use App\Models\GeneralSettings;
use App\Lib\Helper;

/* Quickbooks */
use QuickBooksOnline\API\Core\ServiceContext;
use QuickBooksOnline\API\DataService\DataService;
use QuickBooksOnline\API\PlatformService\PlatformService;
use QuickBooksOnline\API\Core\Http\Serialization\XmlObjectSerializer;
use QuickBooksOnline\API\Facades\Customer;
use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2LoginHelper;
use QuickBooksOnline\API\Facades\Invoice;

class UserController extends Controller
{
    public $helper;

    public function __construct()
    {
        $this->helper = new Helper();
    }

    public function profile()
    {
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Update profile information
     * @param Request user information
     * @return JSON success
     * */
    public function updateProfile(Request $request)
    {
        User::whereId($request->id)->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
        ]);
        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Get Account information to quickbooks
     * */
    public function quickbooksAccount(Request $request)
    {
        $user = Auth::user();
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $user = User::whereId($customer_id)->first();
        }
        $customer_quickbooks_id = $user->store->customer_quickbooks_id;
        $country_store = session('country_store');
        if ($country_store == 'UK') {
            $storeinfo  = Stores::where('user_id', $user->id)->where('country', $country_store)->first();
            $customer_quickbooks_id = $storeinfo->customer_quickbooks_id;
        }

        $last365days = date('Y-m-d', strtotime('today - 365 days'));
        $wherelast365days = "TxnDate >= '" . $last365days . "'";

        $dataService2 = $this->quickbooksRefreshTokens();

        // Invoices
        $theInvoices = $dataService2->Query("SELECT * FROM Invoice WHERE CustomerRef='" . $customer_quickbooks_id . "' AND " . $wherelast365days);

        $totalunpaid = 0;
        $totaloverdue = 0;
        $totalopen = 0;
        if (!empty($theInvoices)) {
            foreach ($theInvoices as $theInvoice) {
                if (!empty($theInvoice->Balance)) {
                    $totalunpaid += $theInvoice->Balance;
                    if (strtotime($theInvoice->DueDate) < time()) {
                        // Overdue
                        $totaloverdue += $theInvoice->Balance;
                    } else {
                        // Open
                        $totalopen += $theInvoice->Balance;
                    }
                }
            }
        }

        // Get percentage
        $overduepercentage = 0;
        $openpercentage = 0;
        if (!empty($totalunpaid)) {
            $overduepercentage = 100 - ((($totalunpaid - $totaloverdue) / $totalunpaid) * 100);
            $openpercentage = 100 - ((($totalunpaid - $totalopen) / $totalunpaid) * 100);
        }

        $unpaidinvoices = [
            'unpaid' => number_format($totalunpaid),
            'overdue' => number_format($totaloverdue),
            'overduepercentage' => intval($overduepercentage),
            'open' => number_format($totalopen),
            'openpercentage' => intval($openpercentage)
        ];

        // Payments
        $last30days = date('Y-m-d', strtotime('today - 30 days'));
        $wherelast30days = "TxnDate >= '" . $last30days . "'";
        $thePayments = $dataService2->Query("SELECT * FROM Payment WHERE CustomerRef='" . $customer_quickbooks_id . "' AND " . $wherelast30days);
        $totalpaid = 0;
        $totaldeposited = 0;
        $totalundeposited = 0;
        if (!empty($thePayments)) {
            $payments = [];
            foreach ($thePayments as $thePayment) {
                $totalpaid += $thePayment->TotalAmt;
                if ($thePayment->DepositToAccountRef == 4) {
                    // Undeposited
                    $totalundeposited += $thePayment->TotalAmt;
                } else {
                    // Deposited
                    $totaldeposited += $thePayment->TotalAmt;
                }
            }
        }

        // Get percentage
        $depositpercentage = 0;
        $undepositpercentage = 0;
        if (!empty($totalpaid)) {
            $depositpercentage = 100 - ((($totalpaid - $totaldeposited) / $totalpaid) * 100);
            $undepositpercentage = 100 - ((($totalpaid - $totalundeposited) / $totalpaid) * 100);
        }

        $paidinvoices = [
            'paid' => number_format($totalpaid),
            'deposited' => number_format($totaldeposited),
            'depositpercentage' => intval($depositpercentage),
            'undeposited' => number_format($totalundeposited),
            'undepositpercentage' => intval($undepositpercentage)
        ];

        return response()->json([
            'success' => true,
            'unpaidinvoices' => $unpaidinvoices,
            'paidinvoices' => $paidinvoices
        ]);
    }

    /**
     * Set new refersh tokens
     * */
    public function quickbooksRefreshTokens()
    {
        $country_store = session('country_store');

        $authorizationCode = GeneralSettings::where('option_name', 'authorizationCode')->first();
        $refreshtoken = GeneralSettings::where('option_name', 'refreshtoken')->first();
        if ($country_store == 'UK') {
            $authorizationCode = GeneralSettings::where('option_name', 'authorizationCode_uk')->first();
            $refreshtoken = GeneralSettings::where('option_name', 'refreshtoken_uk')->first();
        }
        $dataService2 = $this->quickbooksDataService();
        $OAuth2LoginHelper = $dataService2->getOAuth2LoginHelper();
        $accessTokenObj = $OAuth2LoginHelper->refreshToken();

        // $newAccessToken    = $accessTokenObj->getAccessToken();
        // $newRefreshToken   = $accessTokenObj->getRefreshToken();

        // if ($country_store == 'US') {
        //     // Update Accesstoken
        //     GeneralSettings::where('option_name', 'accesstoken')->update([
        //         'option_value' => $newAccessToken
        //     ]);
        //     // Update Refreshtoken
        //     GeneralSettings::where('option_name', 'refreshtoken')->update([
        //         'option_value' => $newRefreshToken
        //     ]);
        // } elseif ($country_store == 'UK') {
        //     // Update Accesstoken
        //     GeneralSettings::where('option_name', 'accesstoken_uk')->update([
        //         'option_value' => $newAccessToken
        //     ]);
        //     // Update Refreshtoken
        //     GeneralSettings::where('option_name', 'refreshtoken_uk')->update([
        //         'option_value' => $newRefreshToken
        //     ]);
        // }

        return $this->quickbooksDataService();
    }

    /**
     * dataservice function
     * */
    public function quickbooksDataService()
    {
        $country_store = session('country_store');

        $authorizationCode = GeneralSettings::where('option_name', 'authorizationCode')->first();
        $realmID = GeneralSettings::where('option_name', 'realmID')->first();
        $accesstoken = GeneralSettings::where('option_name', 'accesstoken')->first();
        $refreshtoken = GeneralSettings::where('option_name', 'refreshtoken')->first();
        if ($country_store == 'UK') {
            $authorizationCode = GeneralSettings::where('option_name', 'authorizationCode_uk')->first();
            $realmID = GeneralSettings::where('option_name', 'realmID_uk')->first();
            $accesstoken = GeneralSettings::where('option_name', 'accesstoken_uk')->first();
            $refreshtoken = GeneralSettings::where('option_name', 'refreshtoken_uk')->first();
        }

        $dataService2 = DataService::Configure(array(
            'auth_mode'         => 'oauth2',
            'ClientID'          => config('quickbooks.data_service.client_id'),
            'ClientSecret'      => config('quickbooks.data_service.client_secret'),
            'accessTokenKey'    => $accesstoken->option_value,
            'refreshTokenKey'   => $refreshtoken->option_value,
            'QBORealmID'        => $realmID->option_value,
            'scope'             => config('quickbooks.data_service.scope'),
            'baseUrl'           => config('quickbooks.data_service.base_url')
        ));

        return $dataService2;
    }

    /**
     * Get Invoices from quickbooks
     * */
    public function quickbooksInvoices(Request $request)
    {
        $user = Auth::user();
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $user = User::whereId($customer_id)->first();
        }
        $customer_quickbooks_id = $user->store->customer_quickbooks_id;
        $country_store = session('country_store');
        if ($country_store == 'UK') {
            $storeinfo  = Stores::where('user_id', $user->id)->where('country', $country_store)->first();
            $customer_quickbooks_id = $storeinfo->customer_quickbooks_id;
        }

        $perdate = $request->perdate;
        $wheredate = "";
        if ($perdate == 'thisweek') {
            $now = Carbon::now();
            $weekStartDate = $now->startOfWeek()->format('Y-m-d');
            $weekEndDate = $now->endOfWeek()->format('Y-m-d');
            $wheredate = " AND TxnDate <= '" . $weekStartDate . "' AND TxnDate >= '" . $weekEndDate . "'";
        } elseif ($perdate == 'thismonth') {
            $firstmonthdate = date('Y-m-01');
            $lastmonthdate = date('Y-m-t');
            $wheredate = " AND TxnDate <= '" . $firstmonthdate . "' AND TxnDate >= '" . $lastmonthdate . "'";
        } elseif ($perdate == 'last30days') {
            $last30days = date('Y-m-d', strtotime('today - 30 days'));
            $wheredate = " AND TxnDate >= '" . $last30days . "'";
        } elseif ($perdate == 'lastmonth') {
            $firstmonthdate = date("Y-m-d", mktime(0, 0, 0, date("m") - 1, 1));
            $lastmonthdate = date("Y-m-d", mktime(0, 0, 0, date("m"), 0));
            $wheredate = " AND TxnDate <= '" . $firstmonthdate . "' AND TxnDate >= '" . $lastmonthdate . "'";
        } elseif ($perdate == 'thisquarter') {
            $dates = $this->helper->getDatesOfQuarter('current', null, 'Y-m-d');
            $firstmonthdate = $dates['start'];
            $lastmonthdate = $dates['end'];
            $wheredate = " AND TxnDate <= '" . $firstmonthdate . "' AND TxnDate >= '" . $lastmonthdate . "'";
        } elseif ($perdate == 'lastquarter') {
            $dates = $this->helper->getDatesOfQuarter('previous', null, 'Y-m-d');
            $firstmonthdate = $dates['start'];
            $lastmonthdate = $dates['end'];
            $wheredate = " AND TxnDate <= '" . $firstmonthdate . "' AND TxnDate >= '" . $lastmonthdate . "'";
        }
        // dd($wheredate);
        $dataService2 = $this->quickbooksRefreshTokens();

        $wheredate .= " ORDER BY TxnDate DESC";

        // Invoices
        $theInvoices = $dataService2->Query("SELECT * FROM Invoice WHERE CustomerRef='" . $customer_quickbooks_id . "'" . $wheredate);
        $invoices = [];
        if (!empty($theInvoices)) {
            foreach ($theInvoices as $theInvoice) {
                $status = 'OPEN';
                $statuscode = 0;
                if (empty($theInvoice->Balance)) {
                    $status = 'PAID';
                    $statuscode = 1;
                } elseif (strtotime($theInvoice->DueDate) < time()) {
                    $status = 'OPEN BALANCE';
                    $statuscode = 2;
                }

                $invoices[] = array(
                    'statuscode' => $statuscode,
                    'status' => $status,
                    'invoicenum' => $theInvoice->DocNumber,
                    'invoicedate' => $theInvoice->TxnDate,
                    'duedate' => $theInvoice->DueDate,
                    'balance' => number_format($theInvoice->Balance, 2),
                    'total' => number_format($theInvoice->TotalAmt, 2)
                );
            }
        }
        return response()->json([
            'success' => true,
            'invoices' => $invoices
        ]);
    }

    /**
     * Get invoice PDF
     * @param invoiceid
     * @return PDF invoice file
     * */
    public function invoicePDF($invoicenum)
    {
        $dataService2 = $this->quickbooksRefreshTokens();
        $invoice = $dataService2->FindById("Invoice", strval($invoicenum));
        $pdfContent = $dataService2->DownloadPDF($invoice);
        echo $pdfContent;
    }

    public function updateuserprofile(Request $request)
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

        if ($user->is_admin != 2) {
            $user->company_name = $request->company_name;
        }
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
    public function usermember(Request $request)
    {
        $user = Auth::user();
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        } else {
            $userid = $user->id;
        }
        $members = User::where('is_admin', 2)
            ->where('client_user_id', $userid)
            // ->paginate(5, ['*'], 'page', $request->page);
            ->get();
        return response()->json([
            'success' => true,
            'members' => $members
        ]);
    }
    public function createnewmember(Request $request)
    {
        $user = Auth::user();

        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        } else {
            $userid = $user->id;
        }

        $post_new_password = $request->new_password;
        $password = Hash::make($request->new_password);

        $validator = Validator::make(['email' => $request->email], [
            'email' => 'required|exists:users'
        ]);
        $member_array = array(
            'first_name' => $request->first_name,
            'last_name' => $request->last_name . ' ',
            'email'     => $request->email,
            'password'  => $password,
            'is_admin'  => 2,
            'client_user_id' => $userid
        );

        if ($validator->fails() && $user->email != $request->email) {
            $user = User::create($member_array);

            // dashboard blocks options
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'invoice',
                'option_value' => $request->invoice
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'storage_cost',
                'option_value' => $request->storage_cost
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'storage_calculator',
                'option_value' => $request->storage_calculator
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'openorders',
                'option_value' => $request->openorders
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'intransit',
                'option_value' => $request->intransit
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'delayed',
                'option_value' => $request->delayed
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'returns',
                'option_value' => $request->returns
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'receiving',
                'option_value' => $request->receiving
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'low_stock',
                'option_value' => $request->low_stock
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'no_stock',
                'option_value' => $request->no_stock
            ]);

            // sidebar nav options
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'open_orders',
                'option_value' => $request->open_orders
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'in_transit',
                'option_value' => $request->in_transit
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'delay_transit',
                'option_value' => $request->delay_transit
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'invoicing',
                'option_value' => $request->invoicing
            ]);
            // CustomerSettings::create([
            //     'user_id' => $user->id,
            //     'option_name' => 'held_orders',
            //     'option_value' => $request->held_orders
            // ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'return_orders',
                'option_value' => $request->return_orders
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'receiving_inventory',
                'option_value' => $request->receiving_inventory
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'addshipment_inventory',
                'option_value' => $request->addshipment_inventory
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'no_stock_inventory',
                'option_value' => $request->no_stock_inventory
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'product_inventory',
                'option_value' => $request->product_inventory
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'ustous_pricing',
                'option_value' => $request->ustous_pricing
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'ustononus_pricing',
                'option_value' => $request->ustononus_pricing
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'uktouk_pricing',
                'option_value' => $request->uktouk_pricing
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'uktoeu_pricing',
                'option_value' => $request->uktoeu_pricing
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'safelist',
                'option_value' => $request->safelist
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'edithistory',
                'option_value' => $request->edithistory
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'reports',
                'option_value' => $request->reports
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'safelistshipments',
                'option_value' => $request->safelistshipments
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'uspsdelayedshipments',
                'option_value' => $request->uspsdelayedshipments
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'product_bundles',
                'option_value' => $request->product_bundles
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'inventory_manager',
                'option_value' => $request->inventory_manager
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'add_receiving_button',
                'option_value' => $request->add_receiving_button
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'add_receiving_wholesale_button',
                'option_value' => $request->add_receiving_wholesale_button
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'add_shipments_button',
                'option_value' => $request->add_shipments_button
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'add_product_button',
                'option_value' => $request->add_product_button
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'add_bundle_button',
                'option_value' => $request->add_bundle_button
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'wrongitemssent',
                'option_value' => $request->wrongitemssent
            ]);
            CustomerSettings::create([
                'user_id' => $user->id,
                'option_name' => 'dailyitemsdelivered',
                'option_value' => $request->dailyitemsdelivered
            ]);
        } else {
            return response()->json([
                'success' => "EmailTaken"
            ]);
        }
    }
    public function updatemember(Request $request)
    {
        $user = Auth::user();


        $memberinfo = User::whereId($request->member_id)->get();
        foreach ($memberinfo as $meminfo) {
            $member_email = $meminfo->email;
            break;
        }

        $post_new_password = $request->new_password;
        $post_confirm_password = $request->confirm_password;

        $edituser_array = [];

        $post_new_password = str_replace(' ', '', $post_new_password);
        $post_confirm_password = str_replace(' ', '', $post_confirm_password);
        $verifynewpass = ($post_new_password != '' && $post_confirm_password != '' && ($post_new_password == $post_confirm_password)) ? true : false;

        if ($verifynewpass == true) {
            $password = Hash::make($request->new_password);
            $edituser_array["password"] = $password;
        }

        $edituser_array["first_name"] = $request->first_name;
        $edituser_array["last_name"] = $request->last_name . ' ';


        $validator = Validator::make(['email' => $request->email], [
            'email' => 'required|exists:users'
        ]);

        if ($request->member_id > 0) {
            // Update customer settings
            $invoice = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'invoice')->first();
            if (!empty($invoice)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'invoice')->update([
                    'option_value' => $request->invoice
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'invoice',
                    'option_value' => $request->invoice
                ]);
            }

            $storage_cost = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'storage_cost')->first();
            if (!empty($storage_cost)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'storage_cost')->update([
                    'option_value' => $request->storage_cost
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'storage_cost',
                    'option_value' => $request->storage_cost
                ]);
            }

            $storage_calculator = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'storage_calculator')->first();
            if (!empty($storage_calculator)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'storage_calculator')->update([
                    'option_value' => $request->storage_calculator
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'storage_calculator',
                    'option_value' => $request->storage_calculator
                ]);
            }

            $openorders = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'openorders')->first();
            if (!empty($openorders)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'openorders')->update([
                    'option_value' => $request->openorders
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'openorders',
                    'option_value' => $request->openorders
                ]);
            }

            $intransit = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'intransit')->first();
            if (!empty($intransit)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'intransit')->update([
                    'option_value' => $request->intransit
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'intransit',
                    'option_value' => $request->intransit
                ]);
            }

            $delayed = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'delayed')->first();
            if (!empty($delayed)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'delayed')->update([
                    'option_value' => $request->delayed
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'delayed',
                    'option_value' => $request->delayed
                ]);
            }

            $returns = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'returns')->first();
            if (!empty($returns)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'returns')->update([
                    'option_value' => $request->returns
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'returns',
                    'option_value' => $request->returns
                ]);
            }

            $receiving = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'receiving')->first();
            if (!empty($receiving)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'receiving')->update([
                    'option_value' => $request->receiving
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'receiving',
                    'option_value' => $request->receiving
                ]);
            }

            $low_stock = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'low_stock')->first();
            if (!empty($low_stock)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'low_stock')->update([
                    'option_value' => $request->low_stock
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'low_stock',
                    'option_value' => $request->low_stock
                ]);
            }

            $no_stock = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'no_stock')->first();
            if (!empty($no_stock)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'no_stock')->update([
                    'option_value' => $request->no_stock
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'no_stock',
                    'option_value' => $request->no_stock
                ]);
            }

            $open_orders = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'open_orders')->first();
            if (!empty($open_orders)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'open_orders')->update([
                    'option_value' => $request->open_orders
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'open_orders',
                    'option_value' => $request->open_orders
                ]);
            }

            $in_transit = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'in_transit')->first();
            if (!empty($in_transit)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'in_transit')->update([
                    'option_value' => $request->in_transit
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'in_transit',
                    'option_value' => $request->in_transit
                ]);
            }

            $delay_transit = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'delay_transit')->first();
            if (!empty($delay_transit)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'delay_transit')->update([
                    'option_value' => $request->delay_transit
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'delay_transit',
                    'option_value' => $request->delay_transit
                ]);
            }

            $invoicing = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'invoicing')->first();
            if (!empty($invoicing)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'invoicing')->update([
                    'option_value' => $request->invoicing
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'invoicing',
                    'option_value' => $request->invoicing
                ]);
            }

            // $held_orders = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'held_orders')->first();
            // if(!empty($held_orders)) {
            //     CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'held_orders')->update([
            //         'option_value' => $request->held_orders
            //     ]);
            // } else {
            //     CustomerSettings::create([
            //         'user_id' => $request->member_id,
            //         'option_name' => 'held_orders',
            //         'option_value' => $request->held_orders
            //     ]);
            // }

            $return_orders = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'return_orders')->first();
            if (!empty($return_orders)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'return_orders')->update([
                    'option_value' => $request->return_orders
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'return_orders',
                    'option_value' => $request->return_orders
                ]);
            }

            $receiving_inventory = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'receiving_inventory')->first();
            if (!empty($receiving_inventory)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'receiving_inventory')->update([
                    'option_value' => $request->receiving_inventory
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'receiving_inventory',
                    'option_value' => $request->receiving_inventory
                ]);
            }

            $addshipment_inventory = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'addshipment_inventory')->first();
            if (!empty($addshipment_inventory)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'addshipment_inventory')->update([
                    'option_value' => $request->addshipment_inventory
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'addshipment_inventory',
                    'option_value' => $request->addshipment_inventory
                ]);
            }

            $no_stock_inventory = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'no_stock_inventory')->first();
            if (!empty($no_stock_inventory)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'no_stock_inventory')->update([
                    'option_value' => $request->no_stock_inventory
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'no_stock_inventory',
                    'option_value' => $request->no_stock_inventory
                ]);
            }

            $product_inventory = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'product_inventory')->first();
            if (!empty($product_inventory)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'product_inventory')->update([
                    'option_value' => $request->product_inventory
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'product_inventory',
                    'option_value' => $request->product_inventory
                ]);
            }

            $ustous_pricing = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'ustous_pricing')->first();
            if (!empty($ustous_pricing)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'ustous_pricing')->update([
                    'option_value' => $request->ustous_pricing
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'ustous_pricing',
                    'option_value' => $request->ustous_pricing
                ]);
            }

            $ustononus_pricing = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'ustononus_pricing')->first();
            if (!empty($ustononus_pricing)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'ustononus_pricing')->update([
                    'option_value' => $request->ustononus_pricing
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'ustononus_pricing',
                    'option_value' => $request->ustononus_pricing
                ]);
            }

            $uktouk_pricing = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'uktouk_pricing')->first();
            if (!empty($uktouk_pricing)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'uktouk_pricing')->update([
                    'option_value' => $request->uktouk_pricing
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'uktouk_pricing',
                    'option_value' => $request->uktouk_pricing
                ]);
            }

            $uktoeu_pricing = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'uktoeu_pricing')->first();
            if (!empty($uktoeu_pricing)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'uktoeu_pricing')->update([
                    'option_value' => $request->uktoeu_pricing
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'uktoeu_pricing',
                    'option_value' => $request->uktoeu_pricing
                ]);
            }

            $safelist = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'safelist')->first();
            if (!empty($safelist)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'safelist')->update([
                    'option_value' => $request->safelist
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'safelist',
                    'option_value' => $request->safelist
                ]);
            }
            $edithistory = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'edithistory')->first();
            if (!empty($edithistory)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'edithistory')->update([
                    'option_value' => $request->edithistory
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'edithistory',
                    'option_value' => $request->edithistory
                ]);
            }
            $reports = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'reports')->first();
            if (!empty($reports)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'reports')->update([
                    'option_value' => $request->reports
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'reports',
                    'option_value' => $request->reports
                ]);
            }

            $safelistshipments = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'safelistshipments')->first();
            if (!empty($safelistshipments)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'safelistshipments')->update([
                    'option_value' => $request->safelistshipments
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'safelistshipments',
                    'option_value' => $request->safelistshipments
                ]);
            }

            $uspsdelayedshipments = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'uspsdelayedshipments')->first();
            if (!empty($uspsdelayedshipments)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'uspsdelayedshipments')->update([
                    'option_value' => $request->uspsdelayedshipments
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'uspsdelayedshipments',
                    'option_value' => $request->uspsdelayedshipments
                ]);
            }

            $product_bundles = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'product_bundles')->first();
            if (!empty($product_bundles)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'product_bundles')->update([
                    'option_value' => $request->product_bundles
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'product_bundles',
                    'option_value' => $request->product_bundles
                ]);
            }

            $inventory_manager = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'inventory_manager')->first();
            if (!empty($inventory_manager)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'inventory_manager')->update([
                    'option_value' => $request->inventory_manager
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'inventory_manager',
                    'option_value' => $request->inventory_manager
                ]);
            }

            $add_receiving_button = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_receiving_button')->first();
            if (!empty($add_receiving_button)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_receiving_button')->update([
                    'option_value' => $request->add_receiving_button
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'add_receiving_button',
                    'option_value' => $request->add_receiving_button
                ]);
            }

            $add_receiving_wholesale_button = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_receiving_wholesale_button')->first();
            if (!empty($add_receiving_wholesale_button)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_receiving_wholesale_button')->update([
                    'option_value' => $request->add_receiving_wholesale_button
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'add_receiving_wholesale_button',
                    'option_value' => $request->add_receiving_wholesale_button
                ]);
            }

            $add_shipments_button = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_shipments_button')->first();
            if (!empty($add_shipments_button)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_shipments_button')->update([
                    'option_value' => $request->add_shipments_button
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'add_shipments_button',
                    'option_value' => $request->add_shipments_button
                ]);
            }

            $add_product_button = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_product_button')->first();
            if (!empty($add_product_button)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_product_button')->update([
                    'option_value' => $request->add_product_button
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'add_product_button',
                    'option_value' => $request->add_product_button
                ]);
            }

            $add_bundle_button = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_bundle_button')->first();
            if (!empty($add_bundle_button)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'add_bundle_button')->update([
                    'option_value' => $request->add_bundle_button
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'add_bundle_button',
                    'option_value' => $request->add_bundle_button
                ]);
            }

            $wrongitemssent = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'wrongitemssent')->first();
            if (!empty($wrongitemssent)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'wrongitemssent')->update([
                    'option_value' => $request->wrongitemssent
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'wrongitemssent',
                    'option_value' => $request->wrongitemssent
                ]);
            }

            $dailyitemsdelivered = CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'dailyitemsdelivered')->first();
            if (!empty($dailyitemsdelivered)) {
                CustomerSettings::where('user_id', $request->member_id)->where('option_name', 'dailyitemsdelivered')->update([
                    'option_value' => $request->dailyitemsdelivered
                ]);
            } else {
                CustomerSettings::create([
                    'user_id' => $request->member_id,
                    'option_name' => 'dailyitemsdelivered',
                    'option_value' => $request->dailyitemsdelivered
                ]);
            }
        }


        if ($validator->fails() && $member_email != $request->email && $member_email != '') {
            $edituser_array["email"] = $request->email;
            User::whereId($request->member_id)->update($edituser_array);

            return response()->json([
                'success' => 'ChangeEmail'
            ]);
        } else {
            if ($member_email == $request->email) {
                User::whereId($request->member_id)->update($edituser_array);

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
    public function deletemember(Request $request)
    {
        User::whereId($request->member_id)->delete();

        return response()->json([
            'success' => 1
        ]);
    }
    public function get_member(Request $request)
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

        $open_orders = CustomerSettings::where('user_id', $id)->where('option_name', 'open_orders')->first();
        $open_orders_on = (!empty($open_orders)) ? intval($open_orders->option_value) : 0;

        $in_transit = CustomerSettings::where('user_id', $id)->where('option_name', 'in_transit')->first();
        $in_transit_on = (!empty($in_transit)) ? intval($in_transit->option_value) : 0;

        $delay_transit = CustomerSettings::where('user_id', $id)->where('option_name', 'delay_transit')->first();
        $delay_transit_on = (!empty($delay_transit)) ? intval($delay_transit->option_value) : 0;

        $invoicing = CustomerSettings::where('user_id', $id)->where('option_name', 'invoicing')->first();
        $invoicing_on = (!empty($invoicing)) ? intval($invoicing->option_value) : 0;

        // $held_orders = CustomerSettings::where('user_id', $id)->where('option_name', 'held_orders')->first();
        // $held_orders_on = (!empty($held_orders))?intval($held_orders->option_value):0;

        $return_orders = CustomerSettings::where('user_id', $id)->where('option_name', 'return_orders')->first();
        $return_orders_on = (!empty($return_orders)) ? intval($return_orders->option_value) : 0;

        $receiving_inventory = CustomerSettings::where('user_id', $id)->where('option_name', 'receiving_inventory')->first();
        $receiving_inventory_on = (!empty($receiving_inventory)) ? intval($receiving_inventory->option_value) : 0;

        $addshipment_inventory = CustomerSettings::where('user_id', $id)->where('option_name', 'addshipment_inventory')->first();
        $addshipment_inventory_on = (!empty($addshipment_inventory)) ? intval($addshipment_inventory->option_value) : 0;

        $no_stock_inventory = CustomerSettings::where('user_id', $id)->where('option_name', 'no_stock_inventory')->first();
        $no_stock_inventory_on = (!empty($no_stock_inventory)) ? intval($no_stock_inventory->option_value) : 0;

        $product_inventory = CustomerSettings::where('user_id', $id)->where('option_name', 'product_inventory')->first();
        $product_inventory_on = (!empty($product_inventory)) ? intval($product_inventory->option_value) : 0;

        $ustous_pricing = CustomerSettings::where('user_id', $id)->where('option_name', 'ustous_pricing')->first();
        $ustous_pricing_on = (!empty($ustous_pricing)) ? intval($ustous_pricing->option_value) : 0;

        $ustononus_pricing = CustomerSettings::where('user_id', $id)->where('option_name', 'ustononus_pricing')->first();
        $ustononus_pricing_on = (!empty($ustononus_pricing)) ? intval($ustononus_pricing->option_value) : 0;

        $uktouk_pricing = CustomerSettings::where('user_id', $id)->where('option_name', 'uktouk_pricing')->first();
        $uktouk_pricing_on = (!empty($uktouk_pricing)) ? intval($uktouk_pricing->option_value) : 0;

        $uktoeu_pricing = CustomerSettings::where('user_id', $id)->where('option_name', 'uktoeu_pricing')->first();
        $uktoeu_pricing_on = (!empty($uktoeu_pricing)) ? intval($uktoeu_pricing->option_value) : 0;

        $safelist = CustomerSettings::where('user_id', $id)->where('option_name', 'safelist')->first();
        $safelist_on = (!empty($safelist)) ? intval($safelist->option_value) : 0;

        $edithistory = CustomerSettings::where('user_id', $id)->where('option_name', 'edithistory')->first();
        $edithistory_on = (!empty($edithistory)) ? intval($edithistory->option_value) : 0;

        $reports = CustomerSettings::where('user_id', $id)->where('option_name', 'reports')->first();
        $reports_on = (!empty($reports)) ? intval($reports->option_value) : 0;

        $safelistshipments = CustomerSettings::where('user_id', $id)->where('option_name', 'safelistshipments')->first();
        $safelistshipments_on = (!empty($safelistshipments)) ? intval($safelistshipments->option_value) : 0;

        $uspsdelayedshipments = CustomerSettings::where('user_id', $id)->where('option_name', 'uspsdelayedshipments')->first();
        $uspsdelayedshipments_on = (!empty($uspsdelayedshipments)) ? intval($uspsdelayedshipments->option_value) : 0;

        $product_bundles = CustomerSettings::where('user_id', $id)->where('option_name', 'product_bundles')->first();
        $product_bundles_on = (!empty($product_bundles)) ? intval($product_bundles->option_value) : 0;

        $inventory_manager = CustomerSettings::where('user_id', $id)->where('option_name', 'inventory_manager')->first();
        $inventory_manager_on = (!empty($inventory_manager)) ? intval($inventory_manager->option_value) : 0;

        $add_receiving_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_receiving_button')->first();
        $add_receiving_button_on = (!empty($add_receiving_button)) ? intval($add_receiving_button->option_value) : 0;

        $add_receiving_wholesale_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_receiving_wholesale_button')->first();
        $add_receiving_wholesale_button_on = (!empty($add_receiving_wholesale_button)) ? intval($add_receiving_wholesale_button->option_value) : 0;

        $add_shipments_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_shipments_button')->first();
        $add_shipments_button_on = (!empty($add_shipments_button)) ? intval($add_shipments_button->option_value) : 0;

        $add_product_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_product_button')->first();
        $add_product_button_on = (!empty($add_product_button)) ? intval($add_product_button->option_value) : 0;

        $add_bundle_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_bundle_button')->first();
        $add_bundle_button_on = (!empty($add_bundle_button)) ? intval($add_bundle_button->option_value) : 0;

        $wrongitemssent = CustomerSettings::where('user_id', $id)->where('option_name', 'wrongitemssent')->first();
        $wrongitemssent_on = (!empty($wrongitemssent)) ? intval($wrongitemssent->option_value) : 0;

        $dailyitemsdelivered = CustomerSettings::where('user_id', $id)->where('option_name', 'dailyitemsdelivered')->first();
        $dailyitemsdelivered_on = (!empty($dailyitemsdelivered)) ? intval($dailyitemsdelivered->option_value) : 0;


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
            ]
        ]);
    }
    public function memberMenu()
    {
        $user = Auth::user();
        $id = $user->id;

        $open_orders = CustomerSettings::where('user_id', $id)->where('option_name', 'open_orders')->first();
        $open_orders_on = (!empty($open_orders)) ? intval($open_orders->option_value) : 0;

        $in_transit = CustomerSettings::where('user_id', $id)->where('option_name', 'in_transit')->first();
        $in_transit_on = (!empty($in_transit)) ? intval($in_transit->option_value) : 0;

        $delay_transit = CustomerSettings::where('user_id', $id)->where('option_name', 'delay_transit')->first();
        $delay_transit_on = (!empty($delay_transit)) ? intval($delay_transit->option_value) : 0;

        $invoicing = CustomerSettings::where('user_id', $id)->where('option_name', 'invoicing')->first();
        $invoicing_on = (!empty($invoicing)) ? intval($invoicing->option_value) : 0;

        // $held_orders = CustomerSettings::where('user_id', $id)->where('option_name', 'held_orders')->first();
        // $held_orders_on = (!empty($held_orders))?intval($held_orders->option_value):0;

        $return_orders = CustomerSettings::where('user_id', $id)->where('option_name', 'return_orders')->first();
        $return_orders_on = (!empty($return_orders)) ? intval($return_orders->option_value) : 0;

        $receiving_inventory = CustomerSettings::where('user_id', $id)->where('option_name', 'receiving_inventory')->first();
        $receiving_inventory_on = (!empty($receiving_inventory)) ? intval($receiving_inventory->option_value) : 0;

        $addshipment_inventory = CustomerSettings::where('user_id', $id)->where('option_name', 'addshipment_inventory')->first();
        $addshipment_inventory_on = (!empty($addshipment_inventory)) ? intval($addshipment_inventory->option_value) : 0;

        $no_stock_inventory = CustomerSettings::where('user_id', $id)->where('option_name', 'no_stock_inventory')->first();
        $no_stock_inventory_on = (!empty($no_stock_inventory)) ? intval($no_stock_inventory->option_value) : 0;

        $product_inventory = CustomerSettings::where('user_id', $id)->where('option_name', 'product_inventory')->first();
        $product_inventory_on = (!empty($product_inventory)) ? intval($product_inventory->option_value) : 0;

        $ustous_pricing = CustomerSettings::where('user_id', $id)->where('option_name', 'ustous_pricing')->first();
        $ustous_pricing_on = (!empty($ustous_pricing)) ? intval($ustous_pricing->option_value) : 0;

        $ustononus_pricing = CustomerSettings::where('user_id', $id)->where('option_name', 'ustononus_pricing')->first();
        $ustononus_pricing_on = (!empty($ustononus_pricing)) ? intval($ustononus_pricing->option_value) : 0;

        $uktouk_pricing = CustomerSettings::where('user_id', $id)->where('option_name', 'uktouk_pricing')->first();
        $uktouk_pricing_on = (!empty($uktouk_pricing)) ? intval($uktouk_pricing->option_value) : 0;

        $uktoeu_pricing = CustomerSettings::where('user_id', $id)->where('option_name', 'uktoeu_pricing')->first();
        $uktoeu_pricing_on = (!empty($uktoeu_pricing)) ? intval($uktoeu_pricing->option_value) : 0;

        $safelist = CustomerSettings::where('user_id', $id)->where('option_name', 'safelist')->first();
        $safelist_on = (!empty($safelist)) ? intval($safelist->option_value) : 0;

        $edithistory = CustomerSettings::where('user_id', $id)->where('option_name', 'edithistory')->first();
        $edithistory_on = (!empty($edithistory)) ? intval($edithistory->option_value) : 0;

        $reports = CustomerSettings::where('user_id', $id)->where('option_name', 'reports')->first();
        $reports_on = (!empty($reports)) ? intval($reports->option_value) : 0;

        $safelistshipments = CustomerSettings::where('user_id', $id)->where('option_name', 'safelistshipments')->first();
        $safelistshipments_on = (!empty($safelistshipments)) ? intval($safelistshipments->option_value) : 0;

        $uspsdelayedshipments = CustomerSettings::where('user_id', $id)->where('option_name', 'uspsdelayedshipments')->first();
        $uspsdelayedshipments_on = (!empty($uspsdelayedshipments)) ? intval($uspsdelayedshipments->option_value) : 0;

        $product_bundles = CustomerSettings::where('user_id', $id)->where('option_name', 'product_bundles')->first();
        $product_bundles_on = (!empty($product_bundles)) ? intval($product_bundles->option_value) : 0;

        $inventory_manager = CustomerSettings::where('user_id', $id)->where('option_name', 'inventory_manager')->first();
        $inventory_manager_on = (!empty($inventory_manager)) ? intval($inventory_manager->option_value) : 0;

        $add_receiving_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_receiving_button')->first();
        $add_receiving_button_on = (!empty($add_receiving_button)) ? intval($add_receiving_button->option_value) : 0;

        $add_receiving_wholesale_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_receiving_wholesale_button')->first();
        $add_receiving_wholesale_button_on = (!empty($add_receiving_wholesale_button)) ? intval($add_receiving_wholesale_button->option_value) : 0;

        $add_shipments_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_shipments_button')->first();
        $add_shipments_button_on = (!empty($add_shipments_button)) ? intval($add_shipments_button->option_value) : 0;

        $add_product_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_product_button')->first();
        $add_product_button_on = (!empty($add_product_button)) ? intval($add_product_button->option_value) : 0;

        $add_bundle_button = CustomerSettings::where('user_id', $id)->where('option_name', 'add_bundle_button')->first();
        $add_bundle_button_on = (!empty($add_bundle_button)) ? intval($add_bundle_button->option_value) : 0;

        $wrongitemssent = CustomerSettings::where('user_id', $id)->where('option_name', 'wrongitemssent')->first();
        $wrongitemssent_on = (!empty($wrongitemssent)) ? intval($wrongitemssent->option_value) : 0;

        $dailyitemsdelivered = CustomerSettings::where('user_id', $id)->where('option_name', 'dailyitemsdelivered')->first();
        $dailyitemsdelivered_on = (!empty($dailyitemsdelivered)) ? intval($dailyitemsdelivered->option_value) : 0;

        return response()->json([
            'success' => 0,
            'open_orders' => (!empty($open_orders_on)) ? '' : 'hide_imp',
            'in_transit' => (!empty($in_transit_on)) ? '' : 'hide_imp',
            'delay_transit' => (!empty($delay_transit_on)) ? '' : 'hide_imp',
            'invoicing' => (!empty($invoicing_on)) ? '' : 'hide_imp',
            // 'held_orders' => (!empty($held_orders_on))?'':'hide_imp',
            'return_orders' => (!empty($return_orders_on)) ? '' : 'hide_imp',
            'receiving_inventory' => (!empty($receiving_inventory_on)) ? '' : 'hide_imp',
            'addshipment_inventory' => (!empty($addshipment_inventory_on)) ? '' : 'hide_imp',
            'no_stock_inventory' => (!empty($no_stock_inventory_on)) ? '' : 'hide_imp',
            'product_inventory' => (!empty($product_inventory_on)) ? '' : 'hide_imp',
            'ustous_pricing' => (!empty($ustous_pricing_on)) ? '' : 'hide_imp',
            'ustononus_pricing' => (!empty($ustononus_pricing_on)) ? '' : 'hide_imp',
            'uktouk_pricing' => (!empty($uktouk_pricing_on)) ? '' : 'hide_imp',
            'uktoeu_pricing' => (!empty($uktoeu_pricing_on)) ? '' : 'hide_imp',
            'safelist' => (!empty($safelist_on)) ? '' : 'hide_imp',
            'edithistory' => (!empty($edithistory_on)) ? '' : 'hide_imp',
            'reports' => (!empty($reports_on)) ? '' : 'hide_imp',
            'safelistshipments' => (!empty($safelistshipments_on)) ? '' : 'hide_imp',
            'uspsdelayedshipments' => (!empty($uspsdelayedshipments_on)) ? '' : 'hide_imp',
            'product_bundles' => (!empty($product_bundles_on)) ? '' : 'hide_imp',
            'inventory_manager' => (!empty($inventory_manager_on)) ? '' : 'hide_imp',
            'add_receiving_button' => (!empty($add_receiving_button_on)) ? '' : 'hide_imp',
            'add_receiving_wholesale_button' => (!empty($add_receiving_wholesale_button_on)) ? '' : 'hide_imp',
            'add_shipments_button' => (!empty($add_shipments_button_on)) ? '' : 'hide_imp',
            'add_product_button' => (!empty($add_product_button_on)) ? '' : 'hide_imp',
            'add_bundle_button' => (!empty($add_bundle_button_on)) ? '' : 'hide_imp',
            'wrongitemssent' => (!empty($wrongitemssent_on)) ? '' : 'hide_imp',
            'dailyitemsdelivered' => (!empty($dailyitemsdelivered_on)) ? '' : 'hide_imp'
        ]);
    }
}
