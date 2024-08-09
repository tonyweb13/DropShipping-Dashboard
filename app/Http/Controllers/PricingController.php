<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Stores;
use App\Models\Pricing;
use Carbon\Carbon;
use App\Lib\Helper;

class PricingController extends Controller
{
    public $helper;

    public function __construct()
    {
        $this->helper = new Helper();
    }

    public function index()
    {
    }
    public function getpricingdata(Request $request)
    {
        $storeid = $this->getuser_storeid();
        $ptype = ($request->pricingtype != '') ? $request->pricingtype : 'ustous';
        $pricing_type = $this->get_price_type($ptype);

        $shipping = ($request->shipping != '') ? $request->shipping : 'expedited';
        $pricing_shipping = $this->get_price_shipping($shipping);


        $perpage = ($request->perpage != '') ? $request->perpage : 500;
        $pricing = Pricing::where('store_id', $storeid)
            ->where('pricing_type', $pricing_type)
            ->where('pricing_shipping', $pricing_shipping)
            ->paginate($perpage, ['*'], 'page', $request->page);
        return response()->json([
            'success' => true,
            'pricing' => $pricing
        ]);
    }
    public function getcalctotal(Request $request)
    {
        $storeid = $this->getuser_storeid();
        $pricing_weight = ($request->weight != '') ? $request->weight : 0;
        $pricing_units = ($request->units != '') ? $request->units : 'kg';
        if ($request->pricingtype != '' && $pricing_units == 'kg' && ($request->pricingtype == 'ustous' || $request->pricingtype == 'ustononus')) {
            if (is_numeric($pricing_weight)) {
                $pricing_weight = $pricing_weight * 2.205;
                if (is_numeric($pricing_weight) && floor($pricing_weight) != $pricing_weight) {
                    $pricing_weight = floor($pricing_weight) + 1;
                }
                $pricing_units = 'lb';
            }
        }
        $ptype = ($request->pricingtype != '') ? $request->pricingtype : 'ustous';
        $pricing_type = $this->get_price_type($ptype);

        $shipping = ($request->shipping != '') ? $request->shipping : 'expedited';
        $pricing_shipping = $this->get_price_shipping($shipping);

        $pricing = Pricing::select('price')
            ->where('store_id', $storeid)
            ->where('pricing_type', $pricing_type)
            ->where('pricing_shipping', $pricing_shipping)
            ->where('pricing_weight', $pricing_weight)
            ->where('pricing_units', $pricing_units)
            ->get();
        $pricing_total = 0;
        if (!empty($pricing)) {
            foreach ($pricing as $pricedata) :
                $pricing_total = number_format($pricedata->price, 2);
            endforeach;
        }

        return response()->json(['pricing_total' => $pricing_total]);
    }
    public function get_price_type($ptype)
    {
        $pricing_type = 'US to US Pricing';
        switch ($ptype) {
            case "ustononus":
                $pricing_type = 'US to Non-US Pricing';
                break;
            case "uktouk":
                $pricing_type = 'UK to UK Pricing';
                break;
            case "uktoeu":
                $pricing_type = 'UK to EU Pricing';
                break;
            default:
                $pricing_type = 'US to US Pricing';
                break;
        }
        return $pricing_type;
    }
    public function get_price_shipping($shipping)
    {
        $pricing_shipping = 'Expedited Shipping';
        switch ($shipping) {
            case "nextday":
                $pricing_shipping = 'Next Day Shipping';
                break;
            case "standard":
                $pricing_shipping = 'Standard Shipping';
                break;
            case "economy":
                $pricing_shipping = 'Economy Shipping';
                break;
            case "canada":
                // $pricing_shipping = 'Canada Shipping (without FIMS)'; old header
                $pricing_shipping = 'Canada / Mexico Shipping';
                break;
            case "mexico":
                // $pricing_shipping = 'Mexico Shipping (without FIMS)';
                $pricing_shipping = 'Canada / Mexico Shipping';
                break;
            case "uktouk":
                $pricing_shipping = 'UK to UK Shipping';
                break;
            case "uktoeu":
                $pricing_shipping = 'Conqueror UK to EU Pricing';
                break;
            default:
                $pricing_shipping = 'Expedited Shipping';
                break;
        }
        return $pricing_shipping;
    }
    public function getuser_storeid()
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
        return $storeid;
    }
}
