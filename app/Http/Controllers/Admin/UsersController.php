<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Mail\AppMail;
use App\Models\User;
use App\Lib\Helper;

class UsersController extends Controller
{
    public $helper;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->helper = new Helper();
    }

    /**
     * Fetch all users
     * @param None
     * @return JSON users
     * */
    public function index(Request $request)
    {
        $users = User::where('is_admin', 1)->get();

        return response()->json([
            'success' => true,
            'users'   => $users
        ]);
    }

    /**
     * Add new user
     * @param Request user data
     * @return Success
     * */
    public function addUser(Request $request)
    {
        $validation = $request->validate([
            'first_name' => ['required'],
            'email'      => ['required', 'email', 'unique:users'],
            'password'   => ['required', 'string', 'min:8', 'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/']
        ]);

        $password     = Hash::make($request->password);

        $user = User::create([
            'first_name'   => $request->first_name,
            'email'        => $request->email,
            'password'     => $password,
            'is_admin'     => 1,
            'access_level' => 1
        ]);

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Get single user
     * @param Request User id
     * @return JSON User
     * */
    public function getUser(Request $request)
    {
        $id   = $request->id;
        $data = User::whereId($id)->first();

        return response()->json([
            'user' => $data
        ]);
    }

    /**
     * Edit single user
     * @param Request User data
     * @return JSON Success
     * */
    public function editUser(Request $request)
    {
        $validation = $request->validate([
            'first_name' => ['required'],
            'email'      => ['required', 'email'],
            'password'   => ['required', 'string', 'min:8', 'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/']
        ]);

        $password = Hash::make($request->password);

        User::whereId($request->user_id)->update([
            'first_name' => $request->first_name,
            'email'      => $request->email,
            'password'   => $password
        ]);

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Delete user
     * @param Request User id
     * @return JSON success
     * */
    public function deleteUser(Request $request)
    {
        User::whereId($request->user_id)->delete();

        return response()->json([
            'success' => 1
        ]);
    }
}
