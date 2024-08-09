<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Revolution\Google\Sheets\Facades\Sheets;
use App\Models\GeneralSettings;
use App\Models\Inventory;
use App\Models\InventoryDates;
use App\Models\InventoryCount;
use App\Models\User;
use App\Models\Stores;
use App\Models\Orders;

class DailySyncing extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'daily:syncingdata';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncing of orders, and inventory';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Syncing started!');
        $users = User::where('is_admin', 0)->get();
        if(!empty($users)) {
            foreach($users as $user) {
                // Get store
                $countries = ['US', 'UK'];
                foreach($countries as $country) {
                    $store  = Stores::where('user_id', $user->id)->where('country', $country)->first();
                    if(!empty($store)) {
                        $storename = $store->store_name;
                        $storeid = $store->id;

                        if($country == 'US') {
                            /* Syncing Orders */
                            $this->info($storename .' Open Order Syncing Started!');
                            $this->syncOpenOrders($storeid, $storename);
                            $this->info($storename .' Held Order Syncing Started!');
                            $this->syncHeldOrders($storeid, $storename);
                            $this->info($storename .' Delayed Order Syncing Started!');
                            $this->syncDelayedOrders($storeid, $storename);
                            $this->info($storename .' Return Order Syncing Started!');
                            $this->syncReturnOrders($storeid, $storename);
                        }

                        /* Syncing Inventory */
                        $this->info($storename .' Inventory Syncing Started!');
                        $this->syncMasterInventory($storeid, $storename, $country);
                        $this->info($storename .' Receiving Inventory Syncing Started!');
                        $this->syncReceivingInventory($storeid, $storename, $country);
                    }
                }
            }
        }
        $this->info('Syncing Done!');
    }

    /**
     * Sync held orders
     * @param $storeid, $storename
     * */
    public function syncHeldOrders($storeid, $storename)
    {
        $held = GeneralSettings::where('option_name', 'held_googlesheet_id')->first();
        $held_option_value = !empty($held)?$held->option_value:'1Z0Fpjt0ud5tJI8XF_PFPXg7M36bIAEXRRc3MR1U7rqg';
    
        $data = Sheets::spreadsheet($held_option_value)->sheet($storename)->all();

        Orders::where('order_type', 'Held')
                    ->where('store_id', $storeid)
                    ->delete();
        
        foreach($data as $key=>$sheetdata):
            if($key!=0):
                
                // echo "<pre> ";
                // var_dump( $intnumber);
                // echo "</pre>";
                
                $order_date = date('Y-m-d H:i:s', strtotime($sheetdata[2]));

                $orders = Orders::create([
                    'store_id'=> $storeid,
                    'order_number'=> $sheetdata[1],
                    'order_date'=> $order_date,
                    'customer_name'=> $sheetdata[3],
                    'status'=> $sheetdata[4],
                    'order_type'=> 'Held'
                ]);
            endif;
        endforeach;
    }

    /**
     * Sync open orders
     * @param $storeid, $storename
     * */
    public function syncOpenOrders($storeid, $storename)
    {
        $openorders = GeneralSettings::where('option_name', 'openorders_googlesheet_id')->first();
        $openorders_option_value = !empty($openorders)?$openorders->option_value:'1Pjr8zKoI21kgmBNr68W0MS49QLeW_jp1grUJvehiI5o';
    
        $data = Sheets::spreadsheet($openorders_option_value)->sheet($storename)->all();

        Orders::where('order_type', 'Open')
                ->where('store_id', $storeid)
                ->delete();

        foreach($data as $key=>$sheetdata):
            if($key>=2):

                $order_date = date('Y-m-d H:i:s', strtotime($sheetdata[0]));

                print_r($sheetdata);

                $orders = Orders::create([
                    'store_id'=> $storeid,
                    'order_date'=> $order_date,
                    'store_name'=> $sheetdata[1],
                    'order_number'=> $sheetdata[2],
                    'skus'=> $sheetdata[3],
                    'requested_shipping'=> $sheetdata[4],
                    'first_name'=> $sheetdata[5],
                    'last_name'=> $sheetdata[6],
                    'email'=> $sheetdata[7],
                    'address'=> $sheetdata[8],
                    'city'=> $sheetdata[9],
                    'state'=> $sheetdata[10],
                    'buyer_postal_code'=> $sheetdata[11],
                    'shipping_country'=> $sheetdata[12],
                    'order_type'=> 'Open'
                ]);
            endif;
        endforeach;
    }

    /**
     * Sync delayed orders
     * @param $storeid, $storename
     * */
    public function syncDelayedOrders($storeid, $storename)
    {
        $delayed = GeneralSettings::where('option_name', 'delayed_googlesheet_id')->first();
        $delayed_option_value = !empty($delayed)?$delayed->option_value:'1-vLn8bI4_0oVhqtkeKDhvVK2wb0vaG43WLXICHIOFpQ';
    
        Orders::where('order_type', 'Delayed')
                    ->where('store_id', $storeid)
                    ->delete();

        $data = Sheets::spreadsheet($delayed_option_value)->sheet($storename)->all();
        if(!empty($data)) {
            foreach($data as $key=>$sheetdata):
                if($key>=7):
                    
                    $order_number = $sheetdata[0];
                    $shipping_date = date('Y-m-d H:i:s', strtotime($sheetdata[3]));

                    $orders = Orders::create([
                        'order_number'=> $order_number,
                        'store_id'=> $storeid,
                        'email'=> $sheetdata[1],
                        'shipping_date'=> $shipping_date,
                        'shipping_country'=> $sheetdata[4],
                        'carrier'=> $sheetdata[5],
                        'service_used'=> $sheetdata[6],
                        'tracking_number'=> $sheetdata[8],
                        'delivery_status'=> $sheetdata[9],
                        'order_age'=> intval($sheetdata[10]),
                        'tracking_link'=> $sheetdata[12],
                        'skus'=> $sheetdata[7],
                        'order_type'=> 'Delayed'
                    ]);

                endif;
            endforeach;
        }
    }

    /**
     * Sync return orders
     * @param $storeid, $storename
     * */
    public function syncReturnOrders($storeid, $storename)
    {
        $return = GeneralSettings::where('option_name', 'return_googlesheet_id')->first();
        $return_option_value = !empty($return)?$return->option_value:'1O_GcHt1-EAElKfEv8PIVkHm8QpvQf71qXbtVtuGTJdo';
    
        $data = Sheets::spreadsheet($return_option_value)->sheet($storename)->all();

        Orders::where('order_type', 'Returns')
                    ->where('store_id', $storeid)
                    ->where('status', '!=', 'archived')
                    ->delete();
                    
        if(!empty($data)) {
            foreach($data as $key=>$sheetdata):
                if($key!=0):
                    
                    $order_date = date('Y-m-d H:i:s', strtotime($sheetdata[0]));
                    $postage_due = (!empty($sheetdata[13]))?$sheetdata[13]:'';
                    $billed_return = (!empty($sheetdata[14]))?$sheetdata[14]:'';
                    $archive_return = (!empty($sheetdata[15]))?$sheetdata[15]:'';
                    $returned_age = (!empty($sheetdata[16]))?$sheetdata[16]:'';
                    $notes_conqueror_only = (!empty($sheetdata[17]))?$sheetdata[17]:'';
                    $order_number = (!empty($sheetdata[2]) && $sheetdata[2]!='')?(int)$sheetdata[2]:0;

                    $orders = Orders::create([
                        'order_date'=> $order_date,
                        'store_id'=> $storeid,
                        'return_store_id'=> $sheetdata[1],
                        'order_number'=> $order_number,
                        'tracking_number'=> $sheetdata[3],
                        'shipping_country'=> $sheetdata[4],
                        'buyer_name'=> $sheetdata[5],
                        'buyer_street_number'=> $sheetdata[6],
                        'buyer_postal_code'=> $sheetdata[7],
                        'packing_condition'=> $sheetdata[8],
                        'item_condition'=> $sheetdata[9],
                        'photo_upload'=> $sheetdata[10],
                        'return_notes'=> $sheetdata[11],
                        'no_items_returned'=> $sheetdata[12],
                        'postage_due'=> $postage_due,
                        'billed_return'=> $billed_return,
                        'archive_return'=> $archive_return,
                        'returned_age'=> $returned_age,
                        'notes_conqueror_only'=> $notes_conqueror_only,
                        'order_type'=> 'Returns'
                    ]);
                    
                endif;
            endforeach;
        }
    }

    /**
     * Sync Invetories
     * @param $storeid, $storename
     * */
    public function syncMasterInventory($storeid, $storename, $country)
    {
        $inventory_googlesheet = GeneralSettings::where('option_name', 'inventory_googlesheet_id')->first();
        $inventory_option_value = !empty($inventory_googlesheet)?$inventory_googlesheet->option_value:'1Tidlg17fnYX-r0R_cjrSr0loO8PzFikHbPqVV3lngs4';
        if($country == 'UK') {
            $inventory_option_value = '19mqbrDFLV0IuqxkrblAZT__I3m2DZPsilL3xY9fuk7I';
        }
    
        $data = Sheets::spreadsheet($inventory_option_value)->sheet($storename)->all();
        if(!empty($data)) {
            // get year var
            $yeararray = [];
            foreach($data[0] as $key=>$yeardata):
                if(trim($yeardata)!='')
                    $yeararray[$key] = $yeardata;
            endforeach;
            // get month day var
            $mon_days_array = [];
            foreach($data[1] as $key=>$daymondata):
                if(trim($daymondata)!='')
                    $mon_days_array[$key] = $daymondata;
            endforeach;

            //combine date arrays
            // Get list of dates
            $dates = [];
            $fulldatesarray = [];
            foreach($yeararray as $key=>$ydata):
                if(trim($ydata)!=''):
                    $datestring = $mon_days_array[$key].' '.$ydata;
                    $fdateformat = date('Y-m-d', strtotime($datestring));
                    $inventorydate = InventoryDates::where('date', $fdateformat)->where('date_key', $key)->where('date_type', 'stock')->first();
                    if(empty($inventorydate)) {
                        $inventorydate = InventoryDates::create([
                            'date_key'=> $key,
                            'date_type'=> 'stock',
                            'date'=> $fdateformat,
                        ]);
                    }
                    $dates[$key] = $inventorydate->id;
                    $fulldatesarray[$key] = $fdateformat;
                endif;
            endforeach;

            foreach($data as $key=>$sheetdata):
                if($key>=3):
                    // end here for empty row
                    if(count($data[$key])<=0){
                        break;
                    }

                    $ship_order_data = [];
                    $ship_order_datafeb28 = [];
                    foreach($fulldatesarray as $dkey=>$fdateformat):
                        if(isset($sheetdata[$dkey]) && $sheetdata[$dkey]>0):
                            $ship_order_data[$fdateformat] = $sheetdata[$dkey];
                            if($fdateformat > '2022-02-28'):
                                $ship_order_datafeb28[$fdateformat] = $sheetdata[$dkey];
                            endif;
                        endif;    
                    endforeach;

                    $inventory = Inventory::where('store_id', $storeid)->where('sku', $sheetdata[3])->first();
                    $inventory_count = !empty($sheetdata[9])?$sheetdata[9]:0;
                    if(!empty($inventory)) {
                        Inventory::where('sku', $sheetdata[3])->update([
                            'title'=> $sheetdata[1],
                            'code_alias'=> $sheetdata[4],
                            'amount'=> 0,
                            'inventory_count'=> $inventory_count,
                            'ship_order_data'=> ''
                        ]);
                    } else {
                        $inventory = Inventory::create([
                            'store_id'=> $storeid,
                            'user_id'=> $userid,
                            'product_type'=> 'stock',
                            'title'=> $sheetdata[1],
                            'code_alias'=> $sheetdata[4],
                            'sku'=> $sheetdata[3],
                            'amount'=> 0,
                            'inventory_count'=> $inventory_count,
                            'ship_order_data'=> serialize($ship_order_data)
                        ]);
                    }

                    if(!empty($sheetdata)):
                        foreach($sheetdata as $shkey => $sheet):
                            if($shkey>=10):
                                $inventorycount = InventoryCount::where('inventorydate_id', $dates[$shkey])->where('product_id', $inventory->id)->first();
                                if(!empty($inventorycount)) {
                                    InventoryCount::whereId($inventorycount->id)->update([
                                        'count'=> $sheet
                                    ]);
                                } else {
                                    InventoryCount::create([
                                        'inventorydate_id'=> $dates[$shkey],
                                        'product_id'=> $inventory->id,
                                        'count'=> $sheet
                                    ]);
                                }
                            endif;
                        endforeach;
                    endif;
                    
                endif;
            endforeach;
        }
    }

    public function syncReceivingInventory($storeid, $storename, $country){
        $receiving_googlesheet = GeneralSettings::where('option_name', 'receiving_googlesheet_id')->first();
        $receiving_option_value = !empty($receiving_googlesheet)?$receiving_googlesheet->option_value:'1v4duwzTNa3SXrmeMYfWwSaTdn0vTjPoI2GwjSvpu-1M';
        if($country == 'UK') {
            $receiving_option_value = '1Be_DTE029t6NGdpZcPf1SJ7wX5dNsBFrR23AjRojL18';
        }
    
        $data = Sheets::spreadsheet($receiving_option_value)->sheet($storename)->all();

        // Save Inventory
        if(!empty($data)) {
            // Get list of dates
            $dates = [];
            foreach ($data[1] as $key => $label) {
                // Save inventory dates
                if($key>=6):
                    $fdateformat = date('Y-m-d', strtotime($label));
                    $inventorydate = InventoryDates::where('date', $fdateformat)->where('date_key', $key)->where('date_type', 'receiving')->first();
                    if(empty($inventorydate)) {
                        $inventorydate = InventoryDates::create([
                            'date_key'=> $key,
                            'date_type'=> 'receiving',
                            'date'=> $fdateformat,
                        ]);
                    }

                    $dates[$key] = array(
                        'date' => $fdateformat,
                        'id' => $inventorydate->id
                    );
                endif;
            }

            foreach ($data as $key => $sheetdata) {
                if($key>=2):
                    if(count($data[$key])<=0){
                        break;
                    }

                    $inventory = Inventory::where('store_id', $storeid)->where('sku', $sheetdata[3])->first();
                    if(!empty($inventory)) {
                        Inventory::where('sku', $sheetdata[3])->update([
                            'title'=> $sheetdata[1]
                        ]);
                    } else {
                        $inventory = Inventory::create([
                            'store_id'=> $storeid,
                            'user_id'=> $userid,
                            'product_type'=> 'receiving',
                            'title'=> $sheetdata[1],
                            'code_alias'=> '',
                            'sku'=> $sheetdata[3],
                            'amount'=> 0,
                            'inventory_count'=> 0,
                            'ship_order_data'=> ''
                        ]);
                    }

                    if(!empty($sheetdata)):
                        foreach($sheetdata as $shkey => $sheet):
                            if($shkey>=6 && !empty($sheetdata[$shkey])):
                                $inventorycount = InventoryCount::where('inventorydate_id', $dates[$shkey]['id'])->where('product_id', $inventory->id)->first();

                                // Get status per date
                                $status = NULL;
                                if(strtotime($dates[$shkey]['date']) <= strtotime('2022-06-17')) {
                                    $status = 'Approved';
                                }

                                if(!empty($inventorycount)) {
                                    InventoryCount::whereId($inventorycount->id)->update([
                                        'count'=> $sheet,
                                        'status' => $status
                                    ]);
                                } else {
                                    InventoryCount::create([
                                        'inventorydate_id'=> $dates[$shkey]['id'],
                                        'product_id'=> $inventory->id,
                                        'status' => $status,
                                        'count'=> $sheet
                                    ]);
                                }
                            endif;
                        endforeach;
                    endif;

                endif;
            }
        }
    }
}
