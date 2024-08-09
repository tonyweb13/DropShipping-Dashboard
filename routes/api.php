<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => ['web']], function () {
    Route::post('login', [App\Http\Controllers\LoginController::class, 'authenticate'])->name('login');
    Route::post('logout', [App\Http\Controllers\LoginController::class, 'logout'])->name('logout');
    Route::get('loginuser', [App\Http\Controllers\LoginController::class, 'loginuser'])->name('loginuser');
    Route::get('loginasuser', [App\Http\Controllers\LoginController::class, 'loginAsUser'])->name('loginasuser');
    Route::get('checkuser_iflogin', [App\Http\Controllers\LoginController::class, 'checkuser_iflogin'])->name('checkuser_iflogin');
    Route::get('check_maintenance_mode', [App\Http\Controllers\LoginController::class, 'check_maintenance_mode'])->name('check_maintenance_mode');

    Route::get('profile', [App\Http\Controllers\UserController::class, 'profile'])->name('profile');

    // Admin Actions
    Route::get('customers', [App\Http\Controllers\Admin\CustomersController::class, 'index'])->name('customers');
    Route::post('get-customer', [App\Http\Controllers\Admin\CustomersController::class, 'getCustomer'])->name('get.customer');
    Route::post('add-customer', [App\Http\Controllers\Admin\CustomersController::class, 'addCustomer'])->name('add.customer');
    Route::post('edit-customer', [App\Http\Controllers\Admin\CustomersController::class, 'editCustomer'])->name('edit.customer');
    Route::post('delete-customer', [App\Http\Controllers\Admin\CustomersController::class, 'deleteCustomer'])->name('delete.customer');
    Route::get('users', [App\Http\Controllers\Admin\UsersController::class, 'index'])->name('users');
    Route::post('get-user', [App\Http\Controllers\Admin\UsersController::class, 'getUser'])->name('get.user');
    Route::post('add-user', [App\Http\Controllers\Admin\UsersController::class, 'addUser'])->name('add.user');
    Route::post('edit-user', [App\Http\Controllers\Admin\UsersController::class, 'editUser'])->name('edit.user');
    Route::post('delete-user', [App\Http\Controllers\Admin\UsersController::class, 'deleteUser'])->name('delete.user');
    Route::post('login-as-client', [App\Http\Controllers\Admin\CustomersController::class, 'loginAsClient'])->name('loginas.client');
    Route::get('stores', [App\Http\Controllers\Admin\StoreController::class, 'index'])->name('store');
    Route::get('countrystores', [App\Http\Controllers\Admin\StoreController::class, 'getStores'])->name('countrystores');
    Route::post('get-store', [App\Http\Controllers\Admin\StoreController::class, 'getStore'])->name('get.store');
    Route::post('add-store', [App\Http\Controllers\Admin\StoreController::class, 'addStore'])->name('add.store');
    Route::post('edit-store', [App\Http\Controllers\Admin\StoreController::class, 'editStore'])->name('edit.store');
    Route::post('delete-store', [App\Http\Controllers\Admin\StoreController::class, 'deleteStore'])->name('delete.store');
    Route::post('disableenable-store', [App\Http\Controllers\Admin\StoreController::class, 'disableenablestore'])->name('disableenablestore');
    Route::post('disablesetting-store', [App\Http\Controllers\Admin\StoreController::class, 'disablesettingstore'])->name('disablesettingstore');
    Route::post('set-google-settings', [App\Http\Controllers\Admin\GeneralController::class, 'saveGoogleSheetOption'])->name('setgoogle.settings');
    Route::post('set-maintenance-mode', [App\Http\Controllers\Admin\GeneralController::class, 'setMaintenanceMode'])->name('setmaintenance.settings');
    Route::get('get-system-settings', [App\Http\Controllers\Admin\GeneralController::class, 'getSiteOptions'])->name('getsite.settings');
    Route::get('quickbooks', [App\Http\Controllers\Admin\GeneralController::class, 'quickbooksAuthorize'])->name('quickbooks');
    Route::get('editedadminhistory', [App\Http\Controllers\Admin\OrderController::class, 'editedadminhistory'])->name('editedadminhistory');
    Route::get('approvedorder', [App\Http\Controllers\Admin\OrderController::class, 'approved_order'])->name('approvedorder');
    Route::get('ordersreturns-admin', [App\Http\Controllers\Admin\OrderController::class, 'ordersReturnsAdmin'])->name('ordersreturns.admin');
    Route::get('packingcondition-list', [App\Http\Controllers\Admin\OrderController::class, 'packingConditionList'])->name('packingcondition.list');
    Route::get('itemcondition-list', [App\Http\Controllers\Admin\OrderController::class, 'itemConditionList'])->name('itemcondition.list');
    Route::get('adminstore-list', [App\Http\Controllers\Admin\OrderController::class, 'AdminStoreList'])->name('admin.store.list');
    Route::get('shippingcountry-list', [App\Http\Controllers\Admin\OrderController::class, 'ShippingCountryList'])->name('shipping.country.list');
    Route::get('showReturnOrderAdmin/{id}', [App\Http\Controllers\Admin\OrderController::class, 'showReturnOrderAdmin'])->name('showReturnOrderAdmin');
    Route::post('addUpdateOrderReturn', [App\Http\Controllers\Admin\OrderController::class, 'addUpdateOrderReturn'])->name('addUpdateOrderReturn');

    Route::get('admin-receivingproducts', [App\Http\Controllers\Admin\InventoryController::class, 'getReceivingProductsAdmin'])->name('admin.receivingproducts');
    Route::get('admin-product', [App\Http\Controllers\Admin\InventoryController::class, 'getProductAdmin'])->name('admin.product');
    Route::post('admin-add-receiving-notes', [App\Http\Controllers\Admin\InventoryController::class, 'addReceivingNotesAdmin'])->name('admin.addreceivingnotes');
    Route::post('admin-add-receiving', [App\Http\Controllers\Admin\InventoryController::class, 'addReceivingAdmin'])->name('admin.add.receiving');
    Route::post('admin-add-receiving-item', [App\Http\Controllers\Admin\InventoryController::class, 'addNewReceivingItemAdmin'])->name('admin.add.receiving');
    Route::post('admin-add-receiving-items', [App\Http\Controllers\Admin\InventoryController::class, 'addReceivingItemsAdmin'])->name('admin.add.receivingitems');
    Route::post('admin-change-receivingstatus', [App\Http\Controllers\Admin\InventoryController::class, 'changeReceivingStatusAdmin'])->name('admin.change.receivingstatus');
    Route::get('admin-productslist', [App\Http\Controllers\Admin\InventoryController::class, 'productslistAdmin'])->name('admin.productslist');

    // Customer Actions
    Route::get('quickbooks-account', [App\Http\Controllers\UserController::class, 'quickbooksAccount'])->name('quickbooks.account');
    Route::get('quickbooks-invoices', [App\Http\Controllers\UserController::class, 'quickbooksInvoices'])->name('quickbooks.invoices');
    Route::get('held', [App\Http\Controllers\UserDashboardController::class, 'getHeldData'])->name('held');
    Route::get('returnsdata', [App\Http\Controllers\UserDashboardController::class, 'getReturnsData'])->name('returnsdata');
    Route::get('masterinventory', [App\Http\Controllers\UserDashboardController::class, 'getMasterInventoryData'])->name('masterinventory');
    Route::get('receivinginventory', [App\Http\Controllers\UserDashboardController::class, 'getReceivingInventoryData'])->name('receivinginventory');
    Route::get('delayeddata', [App\Http\Controllers\UserDashboardController::class, 'getDelayedData'])->name('delayeddata');
    Route::get('openordersdata', [App\Http\Controllers\UserDashboardController::class, 'getOpenOrdersData'])->name('openordersdata');
    Route::get('callback', [App\Http\Controllers\UserDashboardController::class, 'authCallback'])->name('callback');
    Route::get('ustouspricing', [App\Http\Controllers\UserDashboardController::class, 'getPricingUStoUS'])->name('ustouspricing');
    Route::get('ustononuspricing', [App\Http\Controllers\UserDashboardController::class, 'getPricingUStoNonUS'])->name('ustononuspricing');
    Route::get('uktoukpricing', [App\Http\Controllers\UserDashboardController::class, 'getPricingUKtoUK'])->name('uktoukpricing');
    Route::get('uktoeupricing', [App\Http\Controllers\UserDashboardController::class, 'getPricingUKtoEU'])->name('uktoeupricing');

    Route::get('orders', [App\Http\Controllers\OrderController::class, 'index'])->name('orders');
    Route::get('orderCount', [App\Http\Controllers\OrderController::class, 'orderCount'])->name('orderCount');
    Route::get('heldCount', [App\Http\Controllers\OrderController::class, 'heldCount'])->name('heldCount');
    Route::get('returnCount', [App\Http\Controllers\OrderController::class, 'returnCount'])->name('returnCount');
    Route::get('shippedFilter', [App\Http\Controllers\OrderController::class, 'shippedFilter'])->name('shippedFilter');
    Route::get('allOrderStatusCount', [App\Http\Controllers\OrderController::class, 'allOrderStatusCount'])->name('allOrderStatusCount');
    Route::get('intransitCount', [App\Http\Controllers\OrderController::class, 'intransitCount'])->name('intransitCount');
    Route::get('delayedCount', [App\Http\Controllers\OrderController::class, 'delayedCount'])->name('delayedCount');
    Route::get('heldorders', [App\Http\Controllers\OrderController::class, 'ordersHeld'])->name('heldorders');
    Route::get('getheldorders', [App\Http\Controllers\OrderController::class, 'getHeldOrder'])->name('getheldorders');
    Route::get('ordersreturns', [App\Http\Controllers\OrderController::class, 'ordersReturns'])->name('ordersreturns');
    Route::get('ordersdelayed', [App\Http\Controllers\OrderController::class, 'ordersDelayed'])->name('ordersdelayed');
    Route::get('returnchartdata', [App\Http\Controllers\OrderController::class, 'returnchartdata'])->name('returnchartdata');
    Route::get('heldchartdata', [App\Http\Controllers\OrderController::class, 'heldchartdata'])->name('heldchartdata');
    Route::get('delayedchartdata', [App\Http\Controllers\OrderController::class, 'delayedchartdata'])->name('delayedchartdata');
    Route::get('allorders', [App\Http\Controllers\OrderController::class, 'allorders'])->name('allorders');
    Route::get('getClientOrderItem', [App\Http\Controllers\OrderController::class, 'getClientOrderItem'])->name('getClientOrderItem');
    Route::get('getLocalStatusEditAddress', [App\Http\Controllers\OrderController::class, 'getLocalStatusEditAddress'])->name('getLocalStatusEditAddress');
    Route::get('allOrdersLocalStatus', [App\Http\Controllers\OrderController::class, 'allOrdersLocalStatus'])
        ->name('allOrdersLocalStatus');
    Route::post('allOrdersForcePrint', [App\Http\Controllers\OrderController::class, 'allOrdersForcePrint'])
    ->name('allOrdersForcePrint');
    Route::post('allOrdersCancelByClient', [App\Http\Controllers\OrderController::class, 'allOrdersCancelByClient'])
    ->name('allOrdersCancelByClient');
    Route::get('openorders', [App\Http\Controllers\OrderController::class, 'openorders'])->name('openorders');
    Route::get('openorderschartdata', [App\Http\Controllers\OrderController::class, 'openorderschartdata'])->name('openorderschartdata');
    Route::get('editedopenorders', [App\Http\Controllers\OrderController::class, 'editedopenorders'])->name('editedopenorders');
    Route::post('archiveorder', [App\Http\Controllers\OrderController::class, 'archiveOrder'])->name('archiveorder');
    Route::post('archiveorders', [App\Http\Controllers\OrderController::class, 'archiveOrders'])->name('archiveorders');
    Route::get('getorder', [App\Http\Controllers\OrderController::class, 'getOrder'])->name('getorder');
    Route::get('getopenorder', [App\Http\Controllers\OrderController::class, 'getOpenOrder'])->name('getopenorder');
    Route::get('geteditedopenorder', [App\Http\Controllers\OrderController::class, 'getEditedOpenOrder'])->name('geteditedopenorder');
    Route::post('editorder', [App\Http\Controllers\OrderController::class, 'updateOrder'])->name('editorder');
    Route::post('editopenorder', [App\Http\Controllers\OrderController::class, 'updateOpenOrder'])->name('editopenorder');
    Route::post('editheldorder', [App\Http\Controllers\OrderController::class, 'updateHeldOrder'])->name('editheldorder');
    Route::post('cancelopenorder', [App\Http\Controllers\OrderController::class, 'cancelOpenOrder'])->name('cancelopenorder');
    Route::post('printopenorder', [App\Http\Controllers\OrderController::class, 'printOpenOrder'])->name('printopenorder');
    Route::get('ordersintransit', [App\Http\Controllers\OrderController::class, 'ordersIntransit'])->name('ordersintransit');
    Route::get('intransitchartdata', [App\Http\Controllers\OrderController::class, 'intransitchartdata'])->name('intransitchartdata');
    Route::get('heldorders2', [App\Http\Controllers\OrderController::class, 'ordersHeld2'])->name('heldorders2');
    Route::get('openordersCount', [App\Http\Controllers\OrderController::class, 'openordersCount'])->name('openordersCount');
    Route::get('get_editstatus_order', [App\Http\Controllers\OrderController::class, 'get_editstatus_order'])->name('get_editstatus_order');
    Route::get('assign_storeid', [App\Http\Controllers\OrderController::class, 'assign_storeid'])->name('assign_storeid');
    Route::post('updateLocalStatusAddress', [App\Http\Controllers\OrderController::class, 'updateLocalStatusAddress'])
    ->name('updateLocalStatusAddress');

    Route::get('countries', [App\Http\Controllers\OrderController::class, 'countries'])->name('countries');
    Route::get('states', [App\Http\Controllers\OrderController::class, 'states'])->name('states');
    Route::get('cities', [App\Http\Controllers\OrderController::class, 'cities'])->name('cities');

    Route::get('customerstores', [App\Http\Controllers\CustomerController::class, 'customerStores'])->name('customerstores');
    Route::get('customerblocks', [App\Http\Controllers\CustomerController::class, 'customerBlocks'])->name('customerblocks');
    Route::get('getsysteminformation', [App\Http\Controllers\CustomerController::class, 'getSystemInfo'])->name('getsysteminformation');
    Route::get('storeSidebarMenu', [App\Http\Controllers\CustomerController::class, 'storeSidebarMenu'])->name('storeSidebarMenu');

    Route::get('select-store', [App\Http\Controllers\CustomerController::class, 'selectStore'])->name('select.store');

    Route::post('reports', [App\Http\Controllers\ReportController::class, 'index'])->name('reports');

    Route::get('products', [App\Http\Controllers\InventoryController::class, 'index'])->name('products');
    Route::get('productlists', [App\Http\Controllers\InventoryController::class, 'getStoreProducts'])->name('productlists');
    Route::get('masterinventorylists', [App\Http\Controllers\InventoryController::class, 'getStoreMasterLists'])->name('masterinventorylists');
    Route::get('receivingproducts', [App\Http\Controllers\InventoryController::class, 'getReceivingProducts'])->name('receivingproducts');
    Route::get('wholesalereceivingproducts', [App\Http\Controllers\InventoryController::class, 'getWholesaleReceivingProducts'])->name('wholesalereceivingproducts');
    Route::get('product', [App\Http\Controllers\InventoryController::class, 'getProduct'])->name('product');
    Route::get('nostockproducts', [App\Http\Controllers\InventoryController::class, 'nostockResults'])->name('nostockproducts');
    Route::post('add-receiving', [App\Http\Controllers\InventoryController::class, 'addReceiving'])->name('add.product');
    Route::post('add-receiving-item', [App\Http\Controllers\InventoryController::class, 'addNewReceivingItem'])->name('add.receiving');
    Route::post('edit-receiving-item', [App\Http\Controllers\InventoryController::class, 'editReceivingItem'])->name('edit.receiving');
    Route::get('get-receiving-item', [App\Http\Controllers\InventoryController::class, 'getReceivingItem'])->name('get.receiving');
    Route::post('delete-receiving-item', [App\Http\Controllers\InventoryController::class, 'deleteReceivingItem'])->name('delete.receiving');
    Route::post('add-wholesale-receiving-item', [App\Http\Controllers\InventoryController::class, 'addNewWholesaleReceivingItem'])->name('add.wholesalereceiving');
    Route::post('add-bundle-item', [App\Http\Controllers\InventoryController::class, 'addNewBundleItem'])->name('add.bundle');
    Route::post('edit-bundle-item', [App\Http\Controllers\InventoryController::class, 'editBundleItem'])->name('edit.bundle');
    Route::post('deletebundle', [App\Http\Controllers\InventoryController::class, 'deleteBundleItem'])->name('delete.bundle');
    Route::post('change-receivingstatus', [App\Http\Controllers\InventoryController::class, 'changeReceivingStatus'])->name('change.receivingstatus');
    Route::post('add-receiving-items', [App\Http\Controllers\InventoryController::class, 'addReceivingItems'])->name('add.receivingitems');

    Route::get('receivingcounts', [App\Http\Controllers\InventoryController::class, 'receivingCounts'])->name('receivingcounts');
    Route::get('nostockcount', [App\Http\Controllers\InventoryController::class, 'nostockCount'])->name('nostockcount');
    Route::get('lowstockcount', [App\Http\Controllers\InventoryController::class, 'lowstockCount'])->name('lowstockcount');
    Route::get('productslist', [App\Http\Controllers\InventoryController::class, 'productslist'])->name('productslist');
    Route::post('store-product-catalog', [App\Http\Controllers\InventoryController::class, 'storeProductCatalog'])->name('store-product-catalog');

    Route::post('add-receiving-notes', [App\Http\Controllers\InventoryController::class, 'addReceivingNotes'])->name('addreceivingnotes');
    Route::get('getNotesHistory', [App\Http\Controllers\InventoryController::class, 'getNotesHistory'])->name('getNotesHistory');
    Route::get('productinventorylist', [App\Http\Controllers\InventoryController::class, 'productInventoryList'])->name('productInventoryList');
    Route::post('add-product', [App\Http\Controllers\InventoryController::class, 'addNewProduct'])->name('add.product');
    Route::post('change-productstatus', [App\Http\Controllers\InventoryController::class, 'changeProductStatus'])->name('change.productstatus');
    Route::post('change-productstatus-items', [App\Http\Controllers\InventoryController::class, 'changeProductStatusItems'])->name('change.productstatusitems');

    Route::get('getpricingdata', [App\Http\Controllers\PricingController::class, 'getpricingdata'])->name('getpricingdata');
    Route::get('getcalctotal', [App\Http\Controllers\PricingController::class, 'getcalctotal'])->name('getcalctotal');
    Route::get('inventorychartdata', [App\Http\Controllers\InventoryController::class, 'inventoryChatData'])->name('inventorychartdata');
    Route::get('get-invoice/{invoicenum}', [App\Http\Controllers\UserController::class, 'invoicePDF'])->name('getinvoice');


    Route::post('updateuserprofile', [App\Http\Controllers\UserController::class, 'updateuserprofile'])->name('updateuserprofile');
    Route::post('createnewmember', [App\Http\Controllers\UserController::class, 'createnewmember'])->name('createnewmember');
    Route::post('updatemember', [App\Http\Controllers\UserController::class, 'updatemember'])->name('updatemember');
    Route::post('deletemember', [App\Http\Controllers\UserController::class, 'deletemember'])->name('deletemember');
    Route::post('get_member', [App\Http\Controllers\UserController::class, 'get_member'])->name('get_member');
    Route::get('usermember', [App\Http\Controllers\UserController::class, 'usermember'])->name('usermember');
    Route::get('memberMenu', [App\Http\Controllers\UserController::class, 'memberMenu'])->name('memberMenu');

    Route::get('shipments', [App\Http\Controllers\ShipmentsController::class, 'index'])->name('shipments');
    Route::post('add-shipments', [App\Http\Controllers\ShipmentsController::class, 'addShipment'])->name('addshipment');
    Route::post('edit-shipments', [App\Http\Controllers\ShipmentsController::class, 'editShipment'])->name('editshipment');
    Route::post('get-shipment', [App\Http\Controllers\ShipmentsController::class, 'getShipment'])->name('getshipment');
    Route::post('delete-shipment', [App\Http\Controllers\ShipmentsController::class, 'deleteShipment'])->name('deleteshipment');
    Route::post('archiveshipment', [App\Http\Controllers\ShipmentsController::class, 'archiveShipment'])->name('archiveshipment');
    Route::post('archiveshipments', [App\Http\Controllers\ShipmentsController::class, 'archiveShipments'])->name('archiveshipments');

    Route::get('safe-lists', [App\Http\Controllers\ToolsController::class, 'safeLists'])->name('safelists');
    Route::get('getsafelist', [App\Http\Controllers\ToolsController::class, 'getSafeLists'])->name('getsafelist');
    Route::get('safelists-shipments', [App\Http\Controllers\ToolsController::class, 'safeListsShipments'])->name('safelistsshipments');
    Route::get('delayed-shipments', [App\Http\Controllers\ToolsController::class, 'delayedShipments'])->name('delayedshipments');
    Route::post('addsafelist', [App\Http\Controllers\ToolsController::class, 'addSafeList'])->name('addsafelist');
    Route::post('editsafelist', [App\Http\Controllers\ToolsController::class, 'editSafeList'])->name('editsafelist');
    Route::post('delete-safelist', [App\Http\Controllers\ToolsController::class, 'deleteSafeList'])->name('deletesafelist');
    Route::get('item-delivery-lists', [App\Http\Controllers\ToolsController::class, 'getItemDeliveries'])->name('itemdeliverylists');

    Route::get('reports', [App\Http\Controllers\ReportController::class, 'getReports'])->name('reports');
    Route::get('report-categories', [App\Http\Controllers\ReportController::class, 'getCategories'])->name('reportcategories');
    Route::get('report-shipments', [App\Http\Controllers\ReportController::class, 'index'])->name('reportshipments');

    Route::post('searchresults', [App\Http\Controllers\GlobalController::class, 'search'])->name('search');
    Route::get('getProductBySKU', [App\Http\Controllers\GlobalController::class, 'getProductBySKU'])->name('getProductBySKU');

    Route::post('updateadminprofile', [App\Http\Controllers\Admin\CustomersController::class, 'updateadminprofile'])->name('updateadminprofile');

    Route::post('add-notification', [App\Http\Controllers\Admin\NotificationController::class, 'addNotification'])->name('addNotification');
    Route::get('notifications', [App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('notifications');
    Route::get('getallstores', [App\Http\Controllers\Admin\NotificationController::class, 'getAllStores'])->name('getAllStores');
    Route::post('get-notification', [App\Http\Controllers\Admin\NotificationController::class, 'getNotification'])->name('getNotification');
    Route::post('updateNotification', [App\Http\Controllers\Admin\NotificationController::class, 'updateNotification'])->name('updateNotification');
    Route::post('delete-notification', [App\Http\Controllers\Admin\NotificationController::class, 'deleteNotification'])->name('deleteNotification');
    Route::post('read-notification', [App\Http\Controllers\Admin\NotificationController::class, 'readNotification'])->name('readNotification');
    Route::get('getallnotification', [App\Http\Controllers\Admin\NotificationController::class, 'getAllNotification'])->name('getAllNotification');
    Route::get('getInventoryAllocatedNotification', [App\Http\Controllers\Admin\NotificationController::class, 'getInventoryAllocatedNotification'])->name('getInventoryAllocatedNotification');
    Route::get('getallreadunread', [App\Http\Controllers\Admin\NotificationController::class, 'getAllReadUnread'])->name('getAllReadUnread');
    Route::get('usernotifications', [App\Http\Controllers\Admin\NotificationController::class, 'userNotifications'])->name('userNotifications');

    // Zendesk
    Route::get('get-tickets', [App\Http\Controllers\ZendeskController::class, 'get_all_tickets'])->name('all_tickets');
    Route::get('get-ticket', [App\Http\Controllers\ZendeskController::class, 'get_ticket'])->name('get_ticket');
    Route::post('new-ticket', [App\Http\Controllers\ZendeskController::class, 'create_ticket'])->name('create_ticket');
    Route::post('update-ticket', [App\Http\Controllers\ZendeskController::class, 'update_ticket'])->name('update_ticket');
    Route::get('zendesk-logs', [App\Http\Controllers\ZendeskController::class, 'get_logs'])->name('get_logs');

    Route::get('clear-cache', function () {
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        return 'Application cache has been cleared';
    });
    Route::get('view-clear', function () {
        Artisan::call('view:clear');
        return 'View cache has been cleared';
    });
});
