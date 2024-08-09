<?php
return [
	'environment'     => env('FEDEX_ENVIRONMENT', config('app.env') === 'production' ? '' : 'sandbox'),
	'client_id'     => env('FEDEX_CLIENT_ID'),
    'client_secret' => env('FEDEX_CLIENT_SECRET'),
    'fedex_version' => env('FEDEX_VERSION'),
];