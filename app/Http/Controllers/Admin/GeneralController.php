<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Models\GeneralSettings;

/* Quickbooks */
use QuickBooksOnline\API\Core\ServiceContext;
use QuickBooksOnline\API\DataService\DataService;
use QuickBooksOnline\API\PlatformService\PlatformService;
use QuickBooksOnline\API\Core\Http\Serialization\XmlObjectSerializer;
use QuickBooksOnline\API\Facades\Customer;
use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2LoginHelper;

class GeneralController extends Controller
{
    /**
     * Save Google Settings
     * @param $post settings
     * @return Sucess JSON response
     * */
    public function saveGoogleSheetOption(Request $request)
    {
        $validation = $request->validate([
            'held' => ['required'],
            'return' => ['required'],
            'inventory' => ['required']
        ]);

        // Save Held Option
        $held = GeneralSettings::where('option_name', 'held_googlesheet_id')->first();
        if (!empty($held)) {
            GeneralSettings::where('option_name', 'held_googlesheet_id')->update([
                'option_value' => $request->held
            ]);
        } else {
            GeneralSettings::create([
                'option_name' => 'held_googlesheet_id',
                'option_value' => $request->held
            ]);
        }
        // Save Delayed Option
        $delayed = GeneralSettings::where('option_name', 'delayed_googlesheet_id')->first();
        if (!empty($delayed)) {
            GeneralSettings::where('option_name', 'delayed_googlesheet_id')->update([
                'option_value' => $request->delayed
            ]);
        } else {
            GeneralSettings::create([
                'option_name' => 'delayed_googlesheet_id',
                'option_value' => $request->delayed
            ]);
        }
        // Save Return Option
        $return = GeneralSettings::where('option_name', 'return_googlesheet_id')->first();
        if (!empty($return)) {
            GeneralSettings::where('option_name', 'return_googlesheet_id')->update([
                'option_value' => $request->return
            ]);
        } else {
            GeneralSettings::create([
                'option_name' => 'return_googlesheet_id',
                'option_value' => $request->return
            ]);
        }
        // Save Inventory Option
        $inventory = GeneralSettings::where('option_name', 'inventory_googlesheet_id')->first();
        if (!empty($inventory)) {
            GeneralSettings::where('option_name', 'inventory_googlesheet_id')->update([
                'option_value' => $request->inventory
            ]);
        } else {
            GeneralSettings::create([
                'option_name' => 'inventory_googlesheet_id',
                'option_value' => $request->inventory
            ]);
        }
        // Save Receiving Option
        $receiving = GeneralSettings::where('option_name', 'receiving_googlesheet_id')->first();
        if (!empty($receiving)) {
            GeneralSettings::where('option_name', 'receiving_googlesheet_id')->update([
                'option_value' => $request->receiving
            ]);
        } else {
            GeneralSettings::create([
                'option_name' => 'receiving_googlesheet_id',
                'option_value' => $request->receiving
            ]);
        }

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Get Google Settings
     * @param NULL
     * @return Success JSON Response
     * */
    public function getSiteOptions()
    {
        $held = GeneralSettings::where('option_name', 'held_googlesheet_id')->first();
        $delayed = GeneralSettings::where('option_name', 'delayed_googlesheet_id')->first();
        $return = GeneralSettings::where('option_name', 'return_googlesheet_id')->first();
        $inventory = GeneralSettings::where('option_name', 'inventory_googlesheet_id')->first();
        $receiving = GeneralSettings::where('option_name', 'receiving_googlesheet_id')->first();
        $mode = GeneralSettings::where('option_name', 'maintenance_mode')->first();

        return response()->json([
            'success' => 1,
            'held' => $held->option_value,
            'delayed' => $delayed->option_value,
            'return' => $return->option_value,
            'inventory' => $inventory->option_value,
            'receiving' => $receiving->option_value,
            'mode' => !empty($mode->option_value) ? $mode->option_value : false,
        ]);
    }

    /**
     * Set Maintenance mode
     * */
    public function setMaintenanceMode(Request $request)
    {
        // Save Maintenance Mode
        $maintenance = GeneralSettings::where('option_name', 'maintenance_mode')->first();
        if (!empty($maintenance)) {
            GeneralSettings::where('option_name', 'maintenance_mode')->update([
                'option_value' => $request->maintenance_mode
            ]);
        } else {
            GeneralSettings::create([
                'option_name' => 'maintenance_mode',
                'option_value' => $request->maintenance_mode
            ]);
        }

        return response()->json([
            'success' => 1
        ]);
    }

    /**
     * Get Account information to quickbooks
     * */
    public function quickbooksAuthorize(Request $request)
    {
        $country_store = session('country_store');

        $dataService = DataService::Configure(array(
            'auth_mode'     => 'oauth2',
            'ClientID'      => config('quickbooks.data_service.client_id'),
            'ClientSecret'  => config('quickbooks.data_service.client_secret'),
            'RedirectURI'   => route('quickbooks'),
            'scope'         => config('quickbooks.data_service.scope'),
            'baseUrl'       => config('quickbooks.data_service.base_url')
        ));

        $OAuth2LoginHelper = $dataService->getOAuth2LoginHelper();
        $authorizationCodeUrl = $OAuth2LoginHelper->getAuthorizationCodeURL();
        if (empty($request->code)) {
            return Redirect::to($authorizationCodeUrl);
        } else {
            $accessTokenObj = $OAuth2LoginHelper->exchangeAuthorizationCodeForToken($request->code, $request->realmId);
            $accessTokenValue = $accessTokenObj->getAccessToken();
            // $refreshTokenValue = $accessTokenObj->getRefreshToken();

            $exist = GeneralSettings::where('option_name', 'authorizationCode')->first();
            if ($country_store == 'UK') {
                $exist = GeneralSettings::where('option_name', 'authorizationCode_uk')->first();
            }
            if (!empty($exist)) {
                if ($country_store == 'US') {
                    // Update Authorizationcode
                    GeneralSettings::where('option_name', 'authorizationCode')->update([
                        'option_value' => $request->code
                    ]);
                    // Update RealmID
                    GeneralSettings::where('option_name', 'realmID')->update([
                        'option_value' => $request->realmId
                    ]);
                    // Update Accesstoken
                    GeneralSettings::where('option_name', 'accesstoken')->update([
                        'option_value' => $accessTokenValue
                    ]);
                    // Update Refreshtoken
                    // GeneralSettings::where('option_name', 'refreshtoken')->update([
                    //     'option_value' => $refreshTokenValue
                    // ]);
                }
                if ($country_store == 'UK') {
                    // Update Authorizationcode
                    GeneralSettings::where('option_name', 'authorizationCode_uk')->update([
                        'option_value' => $request->code
                    ]);
                    // Update RealmID
                    GeneralSettings::where('option_name', 'realmID_uk')->update([
                        'option_value' => $request->realmId
                    ]);
                    // Update Accesstoken
                    GeneralSettings::where('option_name', 'accesstoken_uk')->update([
                        'option_value' => $accessTokenValue
                    ]);
                    // Update Refreshtoken
                    // GeneralSettings::where('option_name', 'refreshtoken_uk')->update([
                    //     'option_value' => $refreshTokenValue
                    // ]);
                }
            } else {

                if ($country_store == 'US') {
                    // Save Authorizationcode
                    GeneralSettings::create([
                        'option_name' => 'authorizationCode',
                        'option_value' => $request->code
                    ]);
                    // Save RealmID
                    GeneralSettings::create([
                        'option_name' => 'realmID',
                        'option_value' => $request->realmId
                    ]);
                    // Update Accesstoken
                    GeneralSettings::create([
                        'option_name' => 'accesstoken',
                        'option_value' => $accessTokenValue
                    ]);
                    // Update Refreshtoken
                    // GeneralSettings::create([
                    //     'option_name' => 'refreshtoken',
                    //     'option_value' => $refreshTokenValue
                    // ]);
                }

                if ($country_store == 'UK') {
                    // Save Authorizationcode
                    GeneralSettings::create([
                        'option_name' => 'authorizationCode_uk',
                        'option_value' => $request->code
                    ]);
                    // Save RealmID
                    GeneralSettings::create([
                        'option_name' => 'realmID_uk',
                        'option_value' => $request->realmId
                    ]);
                    // Update Accesstoken
                    GeneralSettings::create([
                        'option_name' => 'accesstoken_uk',
                        'option_value' => $accessTokenValue
                    ]);
                    // Update Refreshtoken
                    // GeneralSettings::create([
                    //     'option_name' => 'refreshtoken_uk',
                    //     'option_value' => $refreshTokenValue
                    // ]);
                }
            }

            return redirect()->route('/');
        }
    }
}
