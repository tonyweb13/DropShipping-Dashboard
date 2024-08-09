<?php

namespace App\Lib;

class FedExApi
{

	protected $endpoint;
	protected $clientid;
	protected $clientsecret;
	protected $fedexversion;

	public function __construct()
	{
		$sandbox = (config('fedexapi.environment') == 'sandbox') ? '-sandbox' : '';
		$this->fedexversion = config('fedexapi.fedex_version');
		$this->endpoint = 'https://apis' . $sandbox . '.fedex.com/track/' . $this->fedexversion . '/';
		$this->clientid = config('fedexapi.client_id');
		$this->clientsecret = config('fedexapi.client_secret');
	}

	/**
	 * Track by Tracking Number
	 * @param $trackingnumber tracking number
	 * @return tracking results
	 * */
	public function trackByNumber($trackingnumber)
	{
	}

	/**
	 * Track by Reference
	 * @param $reference Reference 
	 * @return tracking results
	 * */
	public function trackByReference($reference)
	{
	}

	/**
	 * Track by Tracking Control Number
	 * @param $controlnumber Control Number
	 * @return tracking results
	 * */
	public function trackByControlNumber($controlnumber)
	{
	}

	public function httpRequestProcess($endpoint, $data)
	{
		$request = new HttpRequest();
		$request->setUrl($endpoint);
		$request->setMethod(HTTP_METH_POST);
	}
}
