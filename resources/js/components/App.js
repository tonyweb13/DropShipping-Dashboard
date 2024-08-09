import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute/ProtectedRoute";
import Login from "./Auth/Login";
import Maintenance from "./Auth/Maintenance";
import NotFound from "./NotFound";
import AdminDashboard from "./Admin/Dashboard/Index";
import AdminCustomers from "./Admin/Dashboard/Customers";
import AdminStores from "./Admin/Dashboard/Stores";
import AdminEditHistory from "./Admin/Dashboard/StoresEditHistory";
import AdminReturnsForm from "./Admin/Dashboard/StoresReturns";
import AdminInventoryReceiving from "./Admin/Dashboard/Inventory/Receiving";
import AdminSettings from "./Admin/Dashboard/Settings";
import AdminNotifications from "./Admin/Dashboard/Notifications";
import AdminUsers from "./Admin/Dashboard/Users";
import AdminZendeskNotifications from "./Admin/Dashboard/ZendeskLogs";
import AdminProfile from "./Admin/Dashboard/Profile/Index";
import ClientStore from "./Client/Dashboard/Store";
import ClientDashboard from "./Client/Dashboard/Index";
import ClientOrders from "./Client/Dashboard/Orders/Index";
import ClientRequestEditdOrders from "./Client/Dashboard/Orders/RequestEditdOrders";
import ClientHeldOrders from "./Client/Dashboard/Orders/HeldOrders";
import ClientDelayedOrders from "./Client/Dashboard/Orders/DelayedOrders";
import ClientReturnOrders from "./Client/Dashboard/Orders/ReturnOrders";
import ClientInventory from "./Client/Dashboard/Inventory/Index";
import ClientInventoryReceiving from "./Client/Dashboard/Inventory/Receiving";
import ClientInventoryLowStock from "./Client/Dashboard/Inventory/LowStock";
import ClientInventoryNoStock from "./Client/Dashboard/Inventory/NoStock";
import ClientInvoicing from "./Client/Dashboard/Invoicing/Index";
import ClientProfile from "./Client/Dashboard/Profile/Index";
import ClientPricingUstoUsExpedited from "./Client/Dashboard/Pricing/UstoUsExpedited";
import ClientPricingUstoUsStandard from "./Client/Dashboard/Pricing/UstoUsStandard";
import ClientPricingUstoUsEconomy from "./Client/Dashboard/Pricing/UstoUsEconomy";
import ClientPricingUstoNonUsCanada from "./Client/Dashboard/Pricing/UstoNonUsCanada";
import ClientPricingUstoNonUsMexico from "./Client/Dashboard/Pricing/UstoNonUsMexico";
import ClientPricingUstoNonUsExpedited from "./Client/Dashboard/Pricing/UstoNonUsExpedited";
import ClientPricingUstoNonUsStandard from "./Client/Dashboard/Pricing/UstoNonUsStandard";
import ClientPricingUstoNonUsEconomy from "./Client/Dashboard/Pricing/UstoNonUsEconomy";
import ClientPricingUktoUk from "./Client/Dashboard/Pricing/UktoUk";
import ClientPricingUktoEU from "./Client/Dashboard/Pricing/UktoEu";
import ClientIntransitOrders from "./Client/Dashboard/Orders/IntransitOrders";
import ClientInventoryAddShipment from "./Client/Dashboard/Inventory/AddShipment";
import ClientMembers from "./Client/Dashboard/Members/Index";
import ClientAllOrders from "./Client/Dashboard/Orders/AllOrders";
import ClientOpenOrders from "./Client/Dashboard/Orders/OpenOrders";
import ClientProducts from "./Client/Dashboard/Inventory/Products";
import ClientProductBundles from "./Client/Dashboard/Inventory/Bundles";
import ClientSafeLists from "./Client/Dashboard/Tools/SafeLists";
import ClientReports from "./Client/Dashboard/Tools/Reports";
import ClientSafelistShipments from "./Client/Dashboard/Tools/SafelistShipments";
import ClientUSPSDelayedShipments from "./Client/Dashboard/Tools/UspsDelayedShipments";
import ClientSearchResults from "./Client/Dashboard/SearchResults";
import ClientInventoryMasterList from "./Client/Dashboard/Inventory/MasterList";
import ClientInventoryQuantityOnHand from "./Client/Dashboard/Inventory/QuantityOnHand";
import ClientInventoryQuantityAllocated from "./Client/Dashboard/Inventory/QuantityAllocated";
import ClientInventoryQuantityAvailable from "./Client/Dashboard/Inventory/QuantityAvailable";
import ClientPricingUstoUsNextDay from "./Client/Dashboard/Pricing/UstoUsNextDay";
import ClientReportsWrongItemsSent from "./Client/Dashboard/Tools/ReportsWrongItemsSent";
import ClientReportsDailyItemsDelivered from "./Client/Dashboard/Tools/ReportsDailyItemsDelivered";
import ClientNotificationLists from "./Client/Dashboard/UserNotifications";
import ClientTicketLists from "./Client/Dashboard/TicketLists";
import { LicenseInfo } from "@mui/x-license-pro";
LicenseInfo.setLicenseKey(
  "43a39950d33e1e78764d64f9f98df572Tz03NDUyMyxFPTE3MjYxOTg1OTcwMDAsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y"
);
import { ClearBrowserCacheBoundary } from "react-clear-browser-cache";

function App() {
    return (
        <React.Fragment>
            <BrowserRouter basename="/">
                <Switch>
                    <Route path={"/login"}>
                        <Login />
                    </Route>
                    <Route path={"/maintenance"}>
                        <Maintenance />
                    </Route>
                    <ProtectedRoute
                        exact
                        path={"/dashboard"}
                        component={AdminDashboard}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/customers"}
                        component={AdminCustomers}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/stores"}
                        component={AdminStores}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/admin-order-history"}
                        component={AdminEditHistory}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/admin-returns-form"}
                        component={AdminReturnsForm}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/admin-inventory-receiving"}
                        component={AdminInventoryReceiving}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/settings"}
                        component={AdminSettings}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/users"}
                        component={AdminUsers}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/"}
                        component={ClientDashboard}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/userdashboard"}
                        component={ClientDashboard}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/orders"}
                        component={ClientOrders}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/edited-open-orders"}
                        component={ClientRequestEditdOrders}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/held-orders"}
                        component={ClientHeldOrders}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/delayed-orders"}
                        component={ClientDelayedOrders}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/return-orders"}
                        component={ClientReturnOrders}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/intransit-orders"}
                        component={ClientIntransitOrders}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory"}
                        component={ClientInventory}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory-receiving"}
                        component={ClientInventoryReceiving}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory-low-stock"}
                        component={ClientInventoryLowStock}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory-no-stock"}
                        component={ClientInventoryNoStock}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory-add-shipments"}
                        component={ClientInventoryAddShipment}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/invoicing"}
                        component={ClientInvoicing}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/profile"}
                        component={ClientProfile}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-ustous-expedited"}
                        component={ClientPricingUstoUsExpedited}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-ustous-standard"}
                        component={ClientPricingUstoUsStandard}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-ustous-economy"}
                        component={ClientPricingUstoUsEconomy}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-ustononus-canada"}
                        component={ClientPricingUstoNonUsCanada}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-ustononus-mexico"}
                        component={ClientPricingUstoNonUsMexico}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-ustononus-expedited"}
                        component={ClientPricingUstoNonUsExpedited}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-ustononus-standard"}
                        component={ClientPricingUstoNonUsStandard}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-ustononus-economy"}
                        component={ClientPricingUstoNonUsEconomy}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-uktouk"}
                        component={ClientPricingUktoUk}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-uktoeu"}
                        component={ClientPricingUktoEU}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/members"}
                        component={ClientMembers}
                        roles={["Client", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/all-orders"}
                        component={ClientAllOrders}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/open-orders"}
                        component={ClientOpenOrders}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory-products"}
                        component={ClientProducts}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/product-bundles"}
                        component={ClientProductBundles}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/safe-list"}
                        component={ClientSafeLists}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/reports"}
                        component={ClientReports}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/safelist-shipments"}
                        component={ClientSafelistShipments}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/uspsdelayed-shipments"}
                        component={ClientUSPSDelayedShipments}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/wrong-items-sent"}
                        component={ClientReportsWrongItemsSent}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/daily-items-delivered"}
                        component={ClientReportsDailyItemsDelivered}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/notifications"}
                        component={AdminNotifications}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/zendesk-notifications"}
                        component={AdminZendeskNotifications}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/searchresults"}
                        component={ClientSearchResults}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/adminprofile"}
                        component={AdminProfile}
                        roles={["Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory-master-lists"}
                        component={ClientInventoryMasterList}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory-quantity-on-hand"}
                        component={ClientInventoryQuantityOnHand}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory-quantity-allocated"}
                        component={ClientInventoryQuantityAllocated}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/inventory-quantity-available"}
                        component={ClientInventoryQuantityAvailable}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/pricing-ustous-nextday"}
                        component={ClientPricingUstoUsNextDay}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/usernotifications"}
                        component={ClientNotificationLists}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <ProtectedRoute
                        exact
                        path={"/tickets"}
                        component={ClientTicketLists}
                        roles={["Client", "Member", "Admin"]}
                    />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;

if (document.getElementById("app")) {
    ReactDOM.render(
        <ClearBrowserCacheBoundary auto>
            <App />
        </ClearBrowserCacheBoundary>,
        document.getElementById("app")
    );
}
