import React from "react";
import { Redirect, Route } from "react-router-dom";

let state_of_state = localStorage["appState"];
if (!state_of_state) {
    let appState = {
        isLoggedIn: false,
        store: false,
        user: {},
    };
    localStorage["appState"] = JSON.stringify(appState);
}
let state = localStorage["appState"];
let AppState = JSON.parse(state);
let haspageaccess = true;
switch (location.pathname) {
    case "/open-orders":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.open_orders != "1"
                ? false
                : true;
        break;
    case "/held-orders":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.held_orders != "1"
                ? false
                : true;
        break;
    case "/return-orders":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.return_orders != "1"
                ? false
                : true;
        break;
    case "/intransit-orders":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.in_transit != "1"
                ? false
                : true;
        break;
    case "/delayed-orders":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.delay_transit != "1"
                ? false
                : true;
        break;
    case "/inventory-receiving":
        haspageaccess =
            AppState.isLoggedIn &&
            AppState.member_menu.receiving_inventory != "1"
                ? false
                : true;
        break;
    case "/inventory-add-shipments":
        haspageaccess =
            AppState.isLoggedIn &&
            AppState.member_menu.addshipment_inventory != "1"
                ? false
                : true;
        break;
    case "/inventory-no-stock":
        haspageaccess =
            AppState.isLoggedIn &&
            AppState.member_menu.no_stock_inventory != "1"
                ? false
                : true;
        break;
    case "/inventory-products":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.product_inventory != "1"
                ? false
                : true;
        break;
    case "/pricing-ustous-expedited":
    case "/pricing-ustous-standard":
    case "/pricing-ustous-economy":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.ustous_pricing != "1"
                ? false
                : true;
        break;
    case "/pricing-ustononus-canada":
    case "/pricing-ustononus-mexico":
    case "/pricing-ustononus-expedited":
    case "/pricing-ustononus-standard":
    case "/pricing-ustononus-economy":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.ustononus_pricing != "1"
                ? false
                : true;
        break;
    case "/pricing-uktouk":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.uktouk_pricing != "1"
                ? false
                : true;
        break;
    case "/pricing-uktoeu":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.uktoeu_pricing != "1"
                ? false
                : true;
        break;
    case "/invoicing":
        haspageaccess =
            AppState.isLoggedIn && AppState.member_menu.invoicing != "1"
                ? false
                : true;
        break;
}
const Auth = {
    isLoggedIn: AppState.isLoggedIn,
    user: AppState,
    store: AppState.store,
    role: AppState.user.role,
    hasaccess: haspageaccess,
};

if (location.pathname != "/login") {
    axios.get("api/checkuser_iflogin").then((response) => {
        let mode = parseInt(response.data.mode);
        let userid = parseInt(response.data.userid);
        axios.get("api/clear-cache");
        axios.get("api/view-clear");
        if (userid <= 0) {
            window.location.reload(true);
            window.location.replace("/login");
        } else {
            if (location.pathname != "/maintenance" && mode != 0) {
                // window.location ="/maintenance";
                axios
                    .post("api/logout")
                    .then((response) => {
                        return response;
                    })
                    .then((json) => {
                        if (json.data.success) {
                            let userData = {};
                            let appState = {
                                isLoggedIn: false,
                                user: userData,
                            };
                            localStorage["appState"] = JSON.stringify(appState);
                            location.reload();
                        }
                    })
                    .catch((error) => {});
            } else if (location.pathname == "/maintenance" && mode == 0) {
                window.location = "/dashboard";
            }
        }
    });
}

export const ProtectedRoute = ({
    component: Component,
    roles,
    path,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (!Auth.isLoggedIn) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: {
                                    prevLocation: path,
                                    error: "You need to login first!",
                                },
                            }}
                        />
                    );
                }
                // if (Auth.isLoggedIn && Auth.role == 'Client' && !Auth.store && path != '/selectstore') {
                //   return <Redirect to={{ pathname: '/selectstore', state: { prevLocation: path, error: "You need to choose a store first!" } }} />
                // }
                if (roles && roles.indexOf(Auth.role) === -1) {
                    return <Redirect to={{ pathname: "/login" }} />;
                }
                if (
                    Auth.role == "Member" &&
                    (Auth.hasaccess == false || location.pathname == "members")
                ) {
                    // return <Redirect to={{ pathname: '/'}} />
                    return (location.href = "/");
                }
                return <Component {...props} />;
            }}
        />
    );
};
