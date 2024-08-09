<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthorizedController extends Controller
{
    public function processAuth(Request $request)
    {
        print_r($request);
        exit;
    }
}
