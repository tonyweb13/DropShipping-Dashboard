<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Stores;
use App\Models\CustomerSettings;
use App\Models\GeneralSettings;
use App\Models\Zendesk;
use App\Lib\Helper;
use File;

/* Zendesk */
use Zendesk\API\HttpClient as ZendeskClient;

class ZendeskController extends Controller
{
    public $helper;
    public $zendesk;

    public function __construct()
    {
        $this->helper = new Helper();

        $this->zendesk = new ZendeskClient(config('zendesk.subdomain'));
        $this->zendesk->setAuth('basic', [
            'username' => config('zendesk.username'),
            'token' => config('zendesk.token'),
        ]);
    }

    public function get_all_tickets()
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
        $user = User::whereId($userid)->first();
        $members = User::where('client_user_id', $user->id)->get();

        $error_msg = '';
        $ticketlists = array();
        if (!empty($members)) {
            foreach ($members as $member) {
                $mem_params = ['query' => $member->email];
                $mem_search = $this->zendesk->users()->search($mem_params);

                if (!empty($mem_search->users)) {
                    foreach ($mem_search->users as $memberData) {
                        $memberId = $memberData->id;
                        $mem_tickets = $this->zendesk->users($memberId)->requests()->findAll();

                        if (!empty($mem_tickets->requests)) {
                            foreach ($mem_tickets->requests as $mem_requests) {
                                $ticketlists[] = $mem_requests;
                            }
                        }
                    }
                }
            }
        }

        try {
            // Search the current customer
            $params = ['query' => $user->email];
            $search = $this->zendesk->users()->search($params);

            if (empty($search->users)) {
                $error_msg = "This email address could not be found on Zendesk";
            } else {
                foreach ($search->users as $userData) {
                    $userId = $userData->id;
                    $tickets = $this->zendesk->users($userId)->requests()->findAll();

                    if (!empty($tickets->requests)) {
                        foreach ($tickets->requests as $requests) {
                            $ticketlists[] = $requests;
                        }
                    }
                }
            }
        } catch (\Zendesk\API\Exceptions\ApiResponseException $e) {
            $error_msg = $e->getMessage() . '</br>';
        }

        return response()->json([
            'error_msg' => $error_msg,
            'tickets' => $ticketlists
        ]);
    }

    public function get_ticket(Request $request)
    {
        $error_msg = '';
        $ticket = array();
        $comments = array();
        try {
            $ticket = $this->zendesk->tickets()->find($request->ticket);
            $comments = $this->zendesk->tickets($request->ticket)->comments()->findAll();
        } catch (\Zendesk\API\Exceptions\ApiResponseException $e) {
            $error_msg = $e->getMessage() . '</br>';
        }

        return response()->json([
            'error_msg' => $error_msg,
            'ticket' => $ticket,
            'comments' => $comments
        ]);
    }

    public function create_ticket(Request $request)
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
        $user = User::whereId($userid)->first();
        $store = Stores::where('user_id', $userid)->first();

        $request->validate([
            'subject' => ['required'],
            'comment' => ['required']
        ]);

        try {
            $zendesk_data = array(
                'type' => 'problem',
                'tags'  => explode(',', $request->tags),
                'subject'  => $request->subject,
                'comment'  => array(
                    'body' => $request->comment
                ),
                'requester' => array(
                    'locale_id' => $userinfo->id,
                    'name' => $userinfo->first_name,
                    'email' => $userinfo->email,
                ),
                'priority' => 'normal',
            );

            // Check if a file has been uploaded

            $filename = '';
            $filepath = '';
            if ($request->hasFile('uploads')) {
                $file = $request->file('uploads');

                $path = public_path('storage/uploads') . '/' . $userid;
                if (!File::isDirectory($path)) {
                    File::makeDirectory($path, 0777, true, true);
                }

                $extension = $file->getClientOriginalExtension();
                $filename = time() . '.' . $extension;
                $filepath = $path . '/' . $filename;
                $file->move($path, $filename);
            }

            if ($filename) {
                $attachment = $this->zendesk->attachments()->upload([
                    'file' => $filepath,
                    'type' => mime_content_type($filepath),
                    'name' => $filename
                ]);

                // Add the attachment to the ticket data
                $zendesk_data['comment']['uploads'][] = $attachment->upload->token;
            }


            // Create a new ticket
            $newTicket = $this->zendesk->tickets()->create($zendesk_data);

            // Remove new created file.
            if ($filename) {
                Storage::delete($filepath);
            }

            // Add log.
            Zendesk::create([
                'log_title' => $userinfo->first_name . ' raised a ticket.',
                'user_id' => $userid,
                'store_id' => $store->id,
                'reporter' => $userinfo->first_name
            ]);

            // Show result
            return response()->json([
                'success' => true,
                'data' => $newTicket,
                'message' => 'Success'
            ]);
        } catch (\Zendesk\API\Exceptions\ApiResponseException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update_ticket(Request $request)
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
        $user = User::whereId($userid)->first();
        $store = Stores::where('user_id', $userid)->first();

        $request->validate([
            'comment' => ['required']
        ]);

        try {
            $zendesk_data = array(
                'comment'  => array(
                    'body' => $request->comment
                )
            );

            // Check if a file has been uploaded

            $filename = '';
            $filepath = '';
            if ($request->hasFile('uploads')) {
                $file = $request->file('uploads');

                $path = public_path('storage/uploads') . '/' . $userid;
                if (!File::isDirectory($path)) {
                    File::makeDirectory($path, 0777, true, true);
                }

                $extension = $file->getClientOriginalExtension();
                $filename = time() . '.' . $extension;
                $filepath = $path . '/' . $filename;
                $file->move($path, $filename);
            }

            if ($filename) {
                $attachment = $this->zendesk->attachments()->upload([
                    'file' => $filepath,
                    'type' => mime_content_type($filepath),
                    'name' => $filename
                ]);

                // Add the attachment to the ticket data
                $zendesk_data['comment']['uploads'][] = $attachment->upload->token;
            }


            // Create a new ticket
            $updateTicket = $this->zendesk->tickets()->update($request->ticket_id, $zendesk_data);

            // Remove new created file.
            if ($filename) {
                Storage::delete($filepath);
            }

            // Add log.
            Zendesk::create([
                'log_title' => $userinfo->first_name . ' comment in a ticket.',
                'user_id' => $userid,
                'store_id' => $store->id,
                'reporter' => $userinfo->first_name
            ]);

            // Show result
            return response()->json([
                'success' => true,
                'data' => $updateTicket,
                'message' => 'Success'
            ]);
        } catch (\Zendesk\API\Exceptions\ApiResponseException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function get_logs(Request $request)
    {
        $zendesk_log = Zendesk::join('users', 'users.id', '=', 'ZendeskReportLog.user_id');
        $zendesk_log->join('customers_store', 'customers_store.id', '=', 'ZendeskReportLog.store_id');
        $zendesk_log->select('ZendeskReportLog.id as id', 'ZendeskReportLog.log_title as log_title', 'users.first_name as customername', 'customers_store.store_name as storename', 'ZendeskReportLog.reporter as requester');
        $logs = $zendesk_log->get();

        return response()->json([
            'success' => true,
            'logs' => $logs
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
