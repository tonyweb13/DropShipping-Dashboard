<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Stores;
use App\Models\Shipments;
use App\Models\ShipmentNotes;
use App\Lib\Helper;
use App\Mail\AppMail;
use File;

class ShipmentsController extends Controller
{
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

        $perpage = ($request->perpage != '') ? $request->perpage : 10;
        if (isset($request->sortfield) != '') {
            $sortfield = $request->sortfield;
            $sortascdesc = $request->sorting;
        } else {
            $sortfield = 'delivery_date';
            $sortascdesc = 'DESC';
        }

        if (isset($request->statusfilter) != '') {
            $shipment->where('status', $request->statusfilter);
        }

        $shipment->where('archived', $request->statusfield);

        $shipment->orderBy($sortfield, $sortascdesc);
        // $shipments = $shipment->paginate($perpage, ['*'], 'page', $request->page);
        $shipments = $shipment->get();

        return response()->json([
            'success' => true,
            'storageurl' => asset('storage/uploads') . '/' . $userid . '/',
            'shipments' => $shipments,
            'total' => count($shipments),
            'user_fullname' => $user->first_name . ' ' . $user->last_name
        ]);
    }

    public function getShipment(Request $request)
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

        $shipment = Shipments::where('id', $request->id)->first();
        $notes = ShipmentNotes::where('shipment_id', $shipment->id)->get();
        return response()->json([
            'success' => true,
            'storageurl' => asset('storage/uploads') . '/' . $userid . '/',
            'shipment' => $shipment,
            'notes' => $notes
        ]);
    }

    /**
     * Add shipment
     * @param Requests
     * @return JSON
     * */
    public function addShipment(Request $request)
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

        $request->validate([
            'shipment_title' => ['required']
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

        $shipment = Shipments::create([
            'user_id' => $userid,
            'shipment_title' => $request->shipment_title,
            'delivery_date' => date('Y-m-d H:i:s'),
            'title' => $request->title,
            'sku' => $request->sku,
            'qty' => $request->qty,
            'country' => $request->country,
            'contact_person' => $request->contact_person,
            'contact_number' => $request->contact_number,
            'notes' => $request->notes,
            'upload'   => $filename,
            'status'   => $request->status
        ]);

        if (!empty($request->notes) || !empty($filename)) {
            // save notes
            ShipmentNotes::create([
                'user_name' => $userinfo->first_name,
                'shipment_id' => $shipment->id,
                'notes' => $request->notes,
                'upload' => $filename
            ]);
        }

        // Send email
        $details = array(
            'subject' => 'New Shipment Added.',
            'heading' => 'Shipment added by ' . $userinfo->first_name,
            'template' => 'shipments'
        );
        if (!empty($request->shipment_title)) {
            $details['shipment_title'] = $request->shipment_title;
        }
        if (!empty($request->title)) {
            $details['title'] = $request->title;
        }
        if (!empty($request->sku)) {
            $details['sku'] = $request->sku;
        }
        if (!empty($request->qty)) {
            $details['qty'] = $request->qty;
        }
        if (!empty($request->country)) {
            $details['country'] = $request->country;
        }
        if (!empty($request->contact_person)) {
            $details['contact_person'] = $request->contact_person;
        }
        if (!empty($request->contact_number)) {
            $details['contact_number'] = $request->contact_number;
        }
        if (!empty($request->notes)) {
            $details['notes'] = $request->notes;
        }
        if (!empty($filename)) {
            $filepath = public_path('storage/uploads') . '/' . $userid . '/' . $filename;
            $details['filename'] = $filepath;
        }
        Mail::to($this->emailrecipient)->send(new AppMail($details));
        // Mail::to($user->email)->send(new AppMail($details));

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Edit shipment
     * @param Requests
     * @return JSON
     * */
    public function editShipment(Request $request)
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
        $storeuser = User::where('id', $userid)->first();

        $request->validate([
            'shipment_title' => ['required']
        ]);

        $shipment = Shipments::where('id', $request->id)->first();

        $oldnotes = $shipment->notes;
        $filename = $shipment->upload;
        $newuploadfile = '';
        if ($request->hasFile('files')) {
            $file = $request->file('files');

            $path = public_path('storage/uploads') . '/' . $userid;
            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0777, true, true);
            }

            $extension = $file->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            $newuploadfile = $filename;
            $file->move($path, $filename);
        }

        Shipments::where('id', $request->id)->update([
            'shipment_title' => $request->shipment_title,
            'title' => $request->title,
            'sku' => $request->sku,
            'qty' => $request->qty,
            'country' => $request->country,
            'contact_person' => $request->contact_person,
            'contact_number' => $request->contact_number,
            'notes' => !empty($request->notes) ? $request->notes : $oldnotes,
            'upload'   => $filename,
            'status'   => $request->status
        ]);

        // save notes
        if (!empty($request->notes) || !empty($newuploadfile)) {
            ShipmentNotes::create([
                'user_name' => $user->first_name,
                'shipment_id' => $shipment->id,
                'notes' => $request->notes,
                'upload' => $newuploadfile
            ]);
        }

        // Send email
        $details = array(
            'subject' => 'Shipment Updated.',
            'heading' => 'Shipment updated by ' . $user->first_name,
            'template' => 'shipments'
        );
        if (!empty($request->shipment_title)) {
            $details['shipment_title'] = $request->shipment_title;
        } else {
            $details['shipment_title'] = $shipment->shipment_title;
        }
        if (!empty($request->title)) {
            $details['title'] = $request->title;
        }
        if (!empty($request->sku)) {
            $details['sku'] = $request->sku;
        }
        if (!empty($request->qty)) {
            $details['qty'] = $request->qty;
        }
        if (!empty($request->country)) {
            $details['country'] = $request->country;
        }
        if (!empty($request->contact_person)) {
            $details['contact_person'] = $request->contact_person;
        }
        if (!empty($request->contact_number)) {
            $details['contact_number'] = $request->contact_number;
        }
        if (!empty($request->notes)) {
            $details['notes'] = $request->notes;
        }
        if (!empty($newuploadfile)) {
            $filepath = public_path('storage/uploads') . '/' . $userid . '/' . $newuploadfile;
            $details['filename'] = $filepath;
        }
        Mail::to($this->emailrecipient)->send(new AppMail($details));
        // Mail::to($storeuser->email)->send(new AppMail($details));

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Delete shipment
     * @param Requests
     * @return JSON
     * */
    public function deleteShipment(Request $request)
    {
        Shipments::whereId($request->id)->delete();

        return response()->json([
            'success' => 1
        ]);
    }


    public function archiveShipment(Request $request)
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

        $shipmentid = $request->shipmentid;
        $status = $request->status;

        Shipments::where('id', $shipmentid)->where('user_id', $userid)->update(['archived' => $status]);

        return response()->json([
            'success' => true
        ]);
    }

    public function archiveShipments(Request $request)
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

        $shipments = $request->shipments;
        if (!empty($shipments)) {
            $shipments = json_decode($shipments, true);
            $shipmentids = [];
            foreach ($shipments as $shipment) {
                $shipmentids[] = $shipment['shipmentid'];
            }
            $status = empty($request->statusshipment) ? 1 : 0;

            if (!empty($shipmentids)) {
                Shipments::whereIn('id', $shipmentids)->where('user_id', $userid)->update(['archived' => $status]);
            }
        }

        return response()->json([
            'success' => true
        ]);
    }
}
