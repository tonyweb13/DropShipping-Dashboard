import React, { Component } from "react";
import { useLocation } from "react-router-dom";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StoreIcon from "@mui/icons-material/Store";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DelayedOrderIcon from "@mui/icons-material/ProductionQuantityLimits";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CompleteCheckIcon from "@mui/icons-material/FactCheck";
import HeldOrderIcon from "@mui/icons-material/Reorder";
import ListOrderIcon from "@mui/icons-material/PlaylistAdd";
import ReturnOrderIcon from "@mui/icons-material/LowPriority";
import GridViewIcon from "@mui/icons-material/GridView";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import LowStockIcon from "@mui/icons-material/TrendingDown";
import NoStockIcon from "@mui/icons-material/MobiledataOff";
import ReceivingStockIcon from "@mui/icons-material/SystemUpdateAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group";
import { touchRippleClasses } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import usflagsd from "../../../../../img/us_flag_sidebar.png";
import ukflagsd from "../../../../../img/uk_flag_sidebar.png";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import sidemenuarrowright from "../../../../../img/sidemenu_arrow-right.png";
import Fade from "@mui/material/Fade";

class MainListItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            path: props.location,
            openOrderSub: false,
            openInventorySub: false,
            openPricingSub: false,
            openPricingUstoUS: false,
            openPricingUstoNONUS: false,
            opentoolsSub: false,
            is_admin: false,
            current_inventory: "",
            current_orders: "",
            current_pricing: "",
            current_ustous: "",
            current_ustononus: "",
            current_tools: "",
            loginasurl: "/",
            sidebarmenu: {
                all_orders: "",
                open_orders: "",
                in_transit: "",
                delay_transit: "",
                invoicing: "",
                held_orders: "",
                return_orders: "",
                receiving_inventory: "",
                addshipment_inventory: "",
                quantity_onhand: "",
                quantity_available: "",
                quantity_onsell: "",
                no_stock_inventory: "",
                product_inventory: "",
                master_inventory: "",
                ustous_pricing: "",
                ustononus_pricing: "",
                uktouk_pricing: "",
                uktoeu_pricing: "",
                safelist: "",
                editedorders: "",
                edithistory: "",
                reports: "",
                safelistshipments: "",
                uspsdelayedshipments: "",
                wrongitemssent: "",
                dailyitemsdelivered: "",
                tools: "",
                order_menu: "",
                inventory_menu: "",
                pricing_menu: "",
                customtools_menu: "",
                resports_submenu: "",
                product_bundles: "",
                inventory_manager: "",
            },
            memberrole: "",
            country: "",
            withuk: 0,
            main_order: "",
            main_inventory: "",
            main_pricing: "",
            main_tools: "",
            main_ustous: "",
            main_ustononus: "",
        };
        switch (this.state.path) {
            case "orders":
            case "open-orders":
            case "held-orders":
            case "delayed-orders":
            case "intransit-orders":
            case "return-orders":
                // this.state.openOrderSub=true;
                this.state.current_orders = "current_li";
                this.state.main_order = "current_main";
                break;
            case "inventory":
            case "inventory-receiving":
            case "inventory-low-stock":
            case "inventory-no-stock":
            case "inventory-add-shipments":
            case "inventory-products":
            case "product-bundles":
            case "inventory-master-lists":
            case "inventory-quantity-on-hand":
            case "inventory-quantity-allocated":
            case "inventory-quantity-available":
                // this.state.openInventorySub=true;
                this.state.current_inventory = "current_li";
                this.state.main_inventory = "current_main";
                break;
            case "pricing-ustous-expedited":
            case "pricing-ustous-standard":
            case "pricing-ustous-economy":
            case "pricing-ustous-nextday":
                this.state.current_ustous = "current_li";
                this.state.current_pricing = "current_li";
                this.state.main_pricing = "current_main";
                this.state.main_ustous = "current_submain";
                this.state.openPricingUstoUS = true;
                break;
            case "pricing-ustononus-canada":
            case "pricing-ustononus-mexico":
            case "pricing-ustononus-expedited":
            case "pricing-ustononus-standard":
            case "pricing-ustononus-economy":
                this.state.current_ustononus = "current_li";
                this.state.current_pricing = "current_li";
                this.state.main_pricing = "current_main";
                this.state.main_ustononus = "current_submain";
                this.state.openPricingUstoNONUS = true;
                break;
            case "pricing-uktouk":
            case "pricing-uktoeu":
                this.state.current_pricing = "current_li";
                this.state.main_pricing = "current_main";
                break;
            case "safe-list":
            case "edited-open-orders":
            case "reports":
            case "safelist-shipments":
            case "uspsdelayed-shipments":
            case "wrong-items-sent":
            case "daily-items-delivered":
                // this.state.opentoolsSub=true;
                this.state.current_tools = "current_li";
                this.state.main_tools = "current_main";
                break;
        }
    }

    componentDidMount() {
        let state = localStorage["appState"];
        let menustate = localStorage["menuState"];
        const withukaccount = localStorage["withUK"];

        let usermemrole = "";
        if (state) {
            let AppState = JSON.parse(state);
            let MenuAppState = JSON.parse(menustate);
            usermemrole = AppState.user.role;

            this.setState({
                country: AppState.country,
                is_admin: AppState.user.is_admin,
                memberrole: usermemrole,
                loginasurl: AppState.loginasurl,
                withuk: withukaccount,
            });
            // console.log(AppState);
            if (usermemrole == "Member") {
                this.checkmembermenu(AppState.member_menu);
            } else {
                this.checkmembermenu(MenuAppState.member_menu);
            }
        }
    }
    checkmembermenu = (AppState) => {
        let ordermenu =
            AppState.open_orders == "0" &&
            AppState.in_transit == "0" &&
            AppState.delay_transit == "0" &&
            AppState.return_orders == "0"
                ? "hide_imp"
                : "";

        let inventorymenu =
            AppState.receiving_inventory == "0" &&
            AppState.addshipment_inventory == "0" &&
            AppState.no_stock_inventory == "0" &&
            AppState.product_inventory == "0" &&
            AppState.product_bundles == "0" &&
            AppState.inventory_manager == "0"
                ? "hide_imp"
                : "";

        let pricingmenu =
            AppState.ustous_pricing == "0" &&
            AppState.ustononus_pricing == "0" &&
            AppState.uktouk_pricing == "0" &&
            AppState.uktoeu_pricing == "0"
                ? "hide_imp"
                : "";

        let customtoolsmenu =
            AppState.safelist == "0" &&
            AppState.edithistory == "0" &&
            AppState.reports == "0" &&
            AppState.safelistshipments == "0" &&
            AppState.uspsdelayedshipments == "0" &&
            AppState.wrongitemssent == "0" &&
            AppState.dailyitemsdelivered == "0"
                ? "hide_imp"
                : "";
        let resportssubmenu = "";

        this.setState({
            sidebarmenu: {
                open_orders: AppState.open_orders,
                in_transit: AppState.in_transit,
                delay_transit: AppState.delay_transit,
                return_orders: AppState.return_orders,
                receiving_inventory: AppState.receiving_inventory,
                addshipment_inventory: AppState.addshipment_inventory,
                no_stock_inventory: AppState.no_stock_inventory,
                product_inventory: AppState.product_inventory,
                ustous_pricing: AppState.ustous_pricing,
                ustononus_pricing: AppState.ustononus_pricing,
                uktouk_pricing: AppState.uktouk_pricing,
                uktoeu_pricing: AppState.uktoeu_pricing,
                invoicing: AppState.invoicing,
                order_menu: ordermenu,
                inventory_menu: inventorymenu,
                pricing_menu: pricingmenu,
                customtools_menu: customtoolsmenu,
                safelist: AppState.safelist,
                edithistory: AppState.edithistory,
                reports: AppState.reports,
                safelistshipments: AppState.safelistshipments,
                uspsdelayedshipments: AppState.uspsdelayedshipments,
                wrongitemssent: AppState.wrongitemssent,
                dailyitemsdelivered: AppState.dailyitemsdelivered,
                product_bundles: AppState.product_bundles,
                inventory_manager: AppState.inventory_manager,
                resports_submenu: resportssubmenu,
            },
        });

        // axios.get('api/memberMenu').then(response => {
        //   let ordermenu = (response.data.open_orders=='hide_imp' && response.data.in_transit=='hide_imp' && response.data.delay_transit=='hide_imp' && response.data.held_orders=='hide_imp' && response.data.return_orders=='hide_imp')?'hide_imp':'';

        //   let inventorymenu = (response.data.receiving_inventory=='hide_imp' && response.data.addshipment_inventory=='hide_imp' && response.data.no_stock_inventory=='hide_imp' && response.data.product_inventory=='hide_imp')?'hide_imp':'';
        //   let pricingmenu = (response.data.ustous_pricing=='hide_imp' && response.data.ustononus_pricing=='hide_imp' && response.data.uktouk_pricing=='hide_imp' && response.data.uktoeu_pricing=='hide_imp')?'hide_imp':'';

        //   this.setState({sidebarmenu: {open_orders: response.data.open_orders, in_transit: response.data.in_transit, delay_transit: response.data.delay_transit, held_orders: response.data.held_orders, return_orders: response.data.return_orders, receiving_inventory: response.data.receiving_inventory, addshipment_inventory: response.data.addshipment_inventory, no_stock_inventory: response.data.no_stock_inventory, product_inventory: response.data.product_inventory, ustous_pricing: response.data.ustous_pricing, ustononus_pricing: response.data.ustononus_pricing, uktouk_pricing: response.data.uktouk_pricing, uktoeu_pricing: response.data.uktoeu_pricing,invoicing: response.data.invoicing, order_menu:ordermenu,inventory_menu:inventorymenu,pricing_menu:pricingmenu}});
        // });
        return;
    };
    handleOpenChild = () => {
        let toggleOrderSub = false;
        if (!this.state.openOrderSub) {
            toggleOrderSub = true;
        }
        // this.setState({ openOrderSub:toggleOrderSub });
        this.setState({
            openOrderSub: toggleOrderSub,
            openInventorySub: false,
            openPricingSub: false,
            opentoolsSub: false,
        });
    };

    handleOpenInventoryChild = () => {
        let toggleInventorySub = false;
        if (!this.state.openInventorySub) {
            toggleInventorySub = true;
        }
        this.setState({
            openInventorySub: toggleInventorySub,
            openOrderSub: false,
            openPricingSub: false,
            opentoolsSub: false,
        });
    };
    handleOpenInventoryMain = () => {
        let toggleInventorySub = false;
        if (!this.state.openInventorySub) {
            toggleInventorySub = true;
        }
        this.setState({
            openInventorySub: toggleInventorySub,
            openOrderSub: false,
            openPricingSub: false,
            opentoolsSub: false,
        });
        // window.location ="/inventory";
    };

    handleOpenPricingChild = () => {
        let togglePricingSub = false;
        if (!this.state.openPricingSub) {
            togglePricingSub = true;
        }
        this.setState({
            openPricingSub: togglePricingSub,
            openOrderSub: false,
            openInventorySub: false,
            opentoolsSub: false,
        });
    };
    handleOpenUstoUsChild = () => {
        let toggleUstoUsSub = false;
        if (!this.state.openPricingUstoUS) {
            toggleUstoUsSub = true;
        }
        this.setState({ openPricingUstoUS: toggleUstoUsSub });
    };
    handleOpenUstoNONUsChild = () => {
        let toggleUstoNonUsSub = false;
        if (!this.state.openPricingUstoNONUS) {
            toggleUstoNonUsSub = true;
        }
        this.setState({ openPricingUstoNONUS: toggleUstoNonUsSub });
    };
    handleOpenTools = () => {
        let toggleToolsSub = false;
        if (!this.state.opentoolsSub) {
            toggleToolsSub = true;
        }
        this.setState({
            opentoolsSub: toggleToolsSub,
            openOrderSub: false,
            openInventorySub: false,
            openPricingSub: false,
        });
    };

    logout(e) {
        e.preventDefault();
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
            .catch((error) => {
                console.log(error);
            });
    }
    handleSelectCountry = (country) => {
        axios.get("api/select-store?country=" + country).then((response) => {
            this.setState({ country: response.data.country });
            let menuState = {
                member_menu: response.data.member_menu,
            };
            localStorage["menuState"] = JSON.stringify(menuState);
            let localState = localStorage["appState"];
            let AppState = JSON.parse(localState);
            let appState = {
                isLoggedIn: true,
                role: AppState.role,
                base: AppState.base,
                user: AppState.user,
                store: AppState.store,
                country: country,
                member_menu: AppState.member_menu,
                loginasurl: AppState.loginasurl,
            };
            localStorage["appState"] = JSON.stringify(appState);

            // location.reload()
            window.location.href = "/userdashboard";
        });
    };
    escFunction = (event) => {
        if (event.key === "Escape") {
            this.setState({
                opentoolsSub: false,
                openOrderSub: false,
                openInventorySub: false,
                openPricingSub: false,
            });
        }
    };
    hideAllSubMenu = () => {
        this.setState({
            opentoolsSub: false,
            openOrderSub: false,
            openInventorySub: false,
            openPricingSub: false,
        });
    };
    render() {
        const isLoggedAdmin = this.state.is_admin;
        const client_menus = (
            <List component="nav" className="sidebar_main_menu_container">
                <ListSubheader component="div" className="list_item_title">
                    Management
                </ListSubheader>
                <ListItemButton
                    className="list-item main_item"
                    component="a"
                    href={this.state.loginasurl}
                    selected={this.state.path === "client/dashboard"}
                >
                    <ListItemIcon>
                        {/* <GridViewIcon style={{ color: '#D3D3D3' }}  /> */}
                        <div className="nav_icons dash_icon"></div>
                    </ListItemIcon>
                    <ListItemText
                        primary="Dashboard"
                        className="list-item-text"
                    />
                </ListItemButton>
                <div className="sidebar-menu-group">
                    <ListItemButton
                        className={[
                            "list-item  main_item " +
                                this.state.sidebarmenu.order_menu +
                                " " +
                                this.state.main_order,
                        ]}
                        onClick={this.handleOpenChild}
                        selected={this.state.path === "orders"}
                        onKeyDown={this.escFunction}
                    >
                        <ListItemIcon>
                            {/* <ShoppingCartIcon style={{ color: '#D3D3D3' }}  /> */}
                            <div className="nav_icons order_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Orders"
                            className="list-item-text"
                        />
                        {/* {this.state.openOrderSub ? <ExpandLess /> : <ExpandMore />} */}
                        <img src={sidemenuarrowright} alt="Arrow right" />
                    </ListItemButton>
                    <Fade
                        in={this.state.openOrderSub}
                        timeout={200}
                        unmountOnExit
                        className={
                            this.state.sidebarmenu.order_menu +
                            " sidebar-collapse"
                        }
                        orientation="horizontal"
                        onMouseLeave={this.hideAllSubMenu}
                    >
                        <List
                            component="div"
                            disablePadding
                            className={
                                "sidebar-submenu " + this.state.current_orders
                            }
                        >
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.all_orders
                                }
                                component="a"
                                href="/all-orders"
                                selected={this.state.path === "all-orders"}
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_open_order_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="All Orders"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            {/* <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.open_orders
                                }
                                component="a"
                                href="/open-orders"
                                selected={this.state.path === "open-orders"}
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_open_order_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Open Orders"
                                    className="list-item-text"
                                />
                            </ListItemButton> */}
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.return_orders
                                }
                                component="a"
                                //href="/return-orders"
                                selected={this.state.path === "return-orders"}
                                sx={{ pl: 4 }}
                                onClick={()=>{
                                    alert("Feature not yet available..");
                                }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_return_order_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Returns"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            {/* <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.in_transit
                                }
                                component="a"
                                href="/intransit-orders"
                                selected={
                                    this.state.path === "intransit-orders"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_intransit_order_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="In-Transit"
                                    className="list-item-text"
                                />
                            </ListItemButton> */}
                            {/* <Collapse
                                in={true}
                                timeout="auto"
                                unmountOnExit
                                className={
                                    "nestedsubmenu " +
                                    "mhide" +
                                    this.state.sidebarmenu.delay_transit
                                }
                            >
                                <ListItemButton
                                    className="list-item"
                                    component="a"
                                    href="/delayed-orders"
                                    selected={
                                        this.state.path === "delayed-orders"
                                    }
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemIcon className="submenu_icon">
                                        <div className="navsubmenu_smallnested_icon"></div>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Delayed"
                                        className="list-item-text"
                                    />
                                </ListItemButton>
                            </Collapse> */}
                        </List>
                    </Fade>
                </div>
                <div className="sidebar-menu-group">
                    <ListItemButton
                        className={[
                            "list-item  main_item " +
                                this.state.current_inventory +
                                " " +
                                this.state.sidebarmenu.inventory_menu +
                                " " +
                                this.state.main_inventory,
                        ]}
                        onClick={this.handleOpenInventoryMain}
                        selected={this.state.path === "inventory"}
                        onKeyDown={this.escFunction}
                    >
                        <ListItemIcon>
                            {/* <InventoryOutlinedIcon style={{ color: '#D3D3D3' }}  /> */}
                            <div className="nav_icons inventory_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Inventory"
                            className="list-item-text"
                        />
                        {/* {this.state.openInventorySub ? <ExpandLess /> : <ExpandMore />} */}
                        <img src={sidemenuarrowright} alt="Arrow right" />
                    </ListItemButton>
                    <Fade
                        in={this.state.openInventorySub}
                        timeout={200}
                        unmountOnExit
                        className={
                            this.state.sidebarmenu.inventory_menu +
                            " sidebar-collapse"
                        }
                        orientation="horizontal"
                        onMouseLeave={this.hideAllSubMenu}
                    >
                        <List
                            component="div"
                            disablePadding
                            className={this.state.current_inventory}
                        >
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.receiving_inventory
                                }
                                component="a"
                                href="/inventory-receiving"
                                selected={
                                    this.state.path === "inventory-receiving"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_receiving_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Receiving"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.addshipment_inventory
                                }
                                component="a"
                                href="/inventory-add-shipments"
                                selected={
                                    this.state.path ===
                                    "inventory-add-shipments"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_addshipment_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Add Shipments"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.no_stock_inventory
                                }
                                component="a"
                                href="/inventory-no-stock"
                                selected={
                                    this.state.path === "inventory-no-stock"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_nostock_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="No Stock"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.product_inventory
                                }
                                component="a"
                                href="/inventory-products"
                                selected={
                                    this.state.path === "inventory-products"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_product_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Products"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            <Collapse
                                in={true}
                                timeout="auto"
                                unmountOnExit
                                className={
                                    "nestedsubmenu " +
                                    "mhide" +
                                    this.state.sidebarmenu.product_bundles
                                }
                            >
                                <List
                                    component="div"
                                    disablePadding
                                    className={this.state.current_ustous}
                                >
                                    <ListItemButton
                                        className="list-item"
                                        component="a"
                                        href="/product-bundles"
                                        selected={
                                            this.state.path ===
                                            "product-bundles"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_smallnested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Bundles"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.inventory_manager
                                }
                                component="a"
                                href="/inventory-master-lists"
                                selected={
                                    this.state.path === "inventory-master-lists"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_inventorymanager_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Inventory Manager"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                        </List>
                    </Fade>
                </div>
                <div className="sidebar-menu-group">
                    <ListItemButton
                        className={[
                            "list-item  main_item " +
                                this.state.current_pricing +
                                " " +
                                this.state.sidebarmenu.pricing_menu +
                                " " +
                                this.state.main_pricing,
                        ]}
                        onClick={this.handleOpenPricingChild}
                        onKeyDown={this.escFunction}
                    >
                        <ListItemIcon>
                            {/* <AttachMoneyIcon style={{ color: '#D3D3D3' }}  /> */}
                            <div className="nav_icons pricing_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Pricing"
                            className="list-item-text"
                        />
                        {/* {this.state.openPricingSub ? <ExpandLess /> : <ExpandMore />} */}
                        <img src={sidemenuarrowright} alt="Arrow right" />
                    </ListItemButton>
                    <Fade
                        in={this.state.openPricingSub}
                        timeout={200}
                        unmountOnExit
                        className={
                            this.state.sidebarmenu.pricing_menu +
                            " sidebar-collapse"
                        }
                        orientation="horizontal"
                        onMouseLeave={this.hideAllSubMenu}
                    >
                        <List
                            component="div"
                            disablePadding
                            className={this.state.current_pricing}
                        >
                            <ListItemButton
                                className={[
                                    "list-item nested_submain " +
                                        this.state.current_ustous +
                                        " mhide" +
                                        this.state.sidebarmenu.ustous_pricing +
                                        " " +
                                        this.state.main_ustous,
                                ]}
                                onClick={this.handleOpenUstoUsChild}
                                onKeyDown={this.escFunction}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_pricing_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="US to US"
                                    className="list-item-text"
                                />
                                {this.state.openPricingUstoUS ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={this.state.openPricingUstoUS}
                                timeout="auto"
                                unmountOnExit
                                className={
                                    "nestedsubmenu " +
                                    this.state.sidebarmenu.ustous_pricing
                                }
                            >
                                <List
                                    component="div"
                                    disablePadding
                                    className={this.state.current_ustous}
                                >
                                    <ListItemButton
                                        className="list-item"
                                        component="a"
                                        href="/pricing-ustous-expedited"
                                        selected={
                                            this.state.path ===
                                            "pricing-ustous-expedited"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_smallnested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Expedited Shipping"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        className="list-item wbignesticon"
                                        component="a"
                                        href="/pricing-ustous-standard"
                                        selected={
                                            this.state.path ===
                                            "pricing-ustous-standard"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_bignested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Standard Shipping"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        className="list-item wbignesticon"
                                        component="a"
                                        href="/pricing-ustous-economy"
                                        selected={
                                            this.state.path ===
                                            "pricing-ustous-economy"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_bignested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Economy Shipping"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        className="list-item wbignesticon"
                                        component="a"
                                        href="/pricing-ustous-nextday"
                                        selected={
                                            this.state.path ===
                                            "pricing-ustous-nextday"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_bignested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Next Day Shipping"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                            <ListItemButton
                                className={[
                                    "list-item nested_submain " +
                                        this.state.current_ustononus +
                                        " mhide" +
                                        this.state.sidebarmenu
                                            .ustononus_pricing +
                                        " " +
                                        this.state.main_ustononus,
                                ]}
                                onClick={this.handleOpenUstoNONUsChild}
                                onKeyDown={this.escFunction}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_pricing_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="US to Non-US"
                                    className="list-item-text"
                                />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {this.state.openPricingUstoNONUS ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={this.state.openPricingUstoNONUS}
                                timeout="auto"
                                unmountOnExit
                                className={
                                    "nestedsubmenu " +
                                    "mhide" +
                                    this.state.sidebarmenu.ustononus_pricing
                                }
                            >
                                <List
                                    component="div"
                                    disablePadding
                                    className={this.state.current_ustononus}
                                >
                                    <ListItemButton
                                        className="list-item"
                                        component="a"
                                        href="/pricing-ustononus-canada"
                                        selected={
                                            this.state.path ===
                                            "pricing-ustononus-canada"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_smallnested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Canada Shipping"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        className="list-item wbignesticon"
                                        component="a"
                                        href="/pricing-ustononus-mexico"
                                        selected={
                                            this.state.path ===
                                            "pricing-ustononus-mexico"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_bignested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Mexico Shipping"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        className="list-item wbignesticon"
                                        component="a"
                                        href="/pricing-ustononus-expedited"
                                        selected={
                                            this.state.path ===
                                            "pricing-ustononus-expedited"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_bignested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Expedited Shipping"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        className="list-item wbignesticon"
                                        component="a"
                                        href="/pricing-ustononus-standard"
                                        selected={
                                            this.state.path ===
                                            "pricing-ustononus-standard"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_bignested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Standard Shipping"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        className="list-item wbignesticon"
                                        component="a"
                                        href="/pricing-ustononus-economy"
                                        selected={
                                            this.state.path ===
                                            "pricing-ustononus-economy"
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon className="submenu_icon">
                                            <div className="navsubmenu_bignested_icon"></div>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Economy Shipping"
                                            className="list-item-text"
                                        />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.uktouk_pricing
                                }
                                component="a"
                                href="/pricing-uktouk"
                                selected={this.state.path === "pricing-uktouk"}
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_pricing_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="UK to UK"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.uktoeu_pricing
                                }
                                component="a"
                                href="/pricing-uktoeu"
                                selected={this.state.path === "pricing-uktoeu"}
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_pricing_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="UK to EU"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                        </List>
                    </Fade>
                </div>
                <ListItemButton
                    className={
                        "list-item main_item " +
                        "mhide" +
                        this.state.sidebarmenu.invoicing
                    }
                    component="a"
                    href="/invoicing"
                    selected={this.state.path === "invoicing"}
                >
                    <ListItemIcon>
                        {/* <ReceiptOutlinedIcon style={{ color: '#D3D3D3' }} sx={{ '&:hover': { color: 'blue' } }} /> */}
                        <div className="nav_icons invoicing_icon"></div>
                    </ListItemIcon>
                    <ListItemText
                        primary="Invoicing"
                        className="list-item-text"
                    />
                </ListItemButton>
                <div className="sidebar-menu-group">
                    <ListItemButton
                        className={[
                            "list-item  main_item " +
                                this.state.current_tools +
                                " " +
                                this.state.sidebarmenu.customtools_menu +
                                " " +
                                this.state.main_tools,
                        ]}
                        onClick={this.handleOpenTools}
                        selected={this.state.path === "tools"}
                        onKeyDown={this.escFunction}
                    >
                        <ListItemIcon>
                            <DisplaySettingsIcon style={{ color: "#c8c5c5" }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Custom Tools"
                            className="list-item-text"
                        />
                        {/* {this.state.opentoolsSub ? <ExpandLess /> : <ExpandMore />} */}
                        <img src={sidemenuarrowright} alt="Arrow right" />
                    </ListItemButton>
                    <Fade
                        in={this.state.opentoolsSub}
                        timeout={200}
                        unmountOnExit
                        className={
                            this.state.sidebarmenu.customtools_menu +
                            " sidebar-collapse"
                        }
                        orientation="horizontal"
                        onMouseLeave={this.hideAllSubMenu}
                    >
                        <List
                            component="div"
                            disablePadding
                            className={this.state.current_tools}
                        >
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.safelist
                                }
                                component="a"
                                href="/safe-list"
                                selected={this.state.path === "safe-list"}
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_safelist_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Safe Lists"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.edithistory
                                }
                                component="a"
                                href="/edited-open-orders"
                                selected={
                                    this.state.path === "edited-open-orders"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_edithistory_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Edit History"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            <ListItemButton
                                className={
                                    "list-item " +
                                    "mhide" +
                                    this.state.sidebarmenu.reports
                                }
                                component="a"
                                href="/reports"
                                selected={this.state.path === "reports"}
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon className="submenu_icon">
                                    <div className="navsubmenu_reports_icon submenu_icons"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Reports"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            <Collapse
                                in={true}
                                timeout="auto"
                                unmountOnExit
                                className={
                                    "nestedsubmenu " +
                                    "mhide" +
                                    this.state.sidebarmenu.resports_submenu
                                }
                            >
                                <ListItemButton
                                    className={
                                        "list-item " +
                                        "mhide" +
                                        this.state.sidebarmenu.safelistshipments
                                    }
                                    component="a"
                                    href="/safelist-shipments"
                                    selected={
                                        this.state.path === "safelist-shipments"
                                    }
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemIcon className="submenu_icon">
                                        <div className="navsubmenu_smallnested_icon"></div>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="SafeList Shipments"
                                        className="list-item-text"
                                    />
                                </ListItemButton>
                                <ListItemButton
                                    className={
                                        "list-item wbignesticon " +
                                        "mhide" +
                                        this.state.sidebarmenu
                                            .uspsdelayedshipments
                                    }
                                    component="a"
                                    href="/uspsdelayed-shipments"
                                    selected={
                                        this.state.path ===
                                        "uspsdelayed-shipments"
                                    }
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemIcon className="submenu_icon">
                                        <div className="navsubmenu_bignested_icon"></div>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Delayed Shipments"
                                        className="list-item-text"
                                    />
                                </ListItemButton>
                                <ListItemButton
                                    className={
                                        "list-item wbignesticon " +
                                        "mhide" +
                                        this.state.sidebarmenu.wrongitemssent
                                    }
                                    component="a"
                                    href="/wrong-items-sent"
                                    selected={
                                        this.state.path === "wrong-items-sent"
                                    }
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemIcon className="submenu_icon">
                                        <div className="navsubmenu_bignested_icon"></div>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Wront Items Sent"
                                        className="list-item-text"
                                    />
                                </ListItemButton>
                            </Collapse>
                        </List>
                    </Fade>
                </div>
                <ListItemButton
                    className={
                        "list-item main_item " +
                        (this.state.memberrole == "Member" ? "hide_imp" : "")
                    }
                    component="a"
                    href="/members"
                    selected={this.state.path === "members"}
                >
                    <ListItemIcon>
                        <GroupIcon
                            style={{ color: "#D3D3D3" }}
                            sx={{ "&:hover": { color: "blue" } }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary="Members"
                        className="list-item-text"
                    />
                </ListItemButton>
                <ListItemButton
                    className={"list-item main_item "}
                    component="a"
                    href="/tickets"
                    selected={this.state.path === "tickets"}
                >
                    <ListItemIcon>
                        <div className="nav_icons ticket_icon"></div>
                    </ListItemIcon>
                    <ListItemText
                        primary="Tickets"
                        className="list-item-text"
                    />
                </ListItemButton>
                <ListItemButton
                    className="list-item"
                    component="a"
                    href="#"
                    onClick={this.logout}
                >
                    <ListItemIcon>
                        {/* <LogoutIcon style={{ color: '#D3D3D3' }} /> */}
                        <div className="nav_icons logoutnav_icon"></div>
                    </ListItemIcon>
                    <ListItemText primary="Logout" className="list-item-text" />
                </ListItemButton>
                <ListSubheader
                    component="div"
                    className="list_item_title filter_sidemenu_text"
                >
                    Filter By
                </ListSubheader>
                <ListItemButton
                    className="list-item"
                    component="a"
                    href="#"
                    onClick={() => this.handleSelectCountry("US")}
                >
                    <ListItemIcon>
                        <img src={usflagsd} alt="us icon" />
                    </ListItemIcon>
                    <ListItemText primary="US" className="list-item-text" />
                </ListItemButton>
                <ListItemButton
                    className={"list-item " + "mhide" + this.state.withuk}
                    component="a"
                    href="#"
                    onClick={() => this.handleSelectCountry("UK")}
                >
                    <ListItemIcon>
                        <img src={ukflagsd} alt="uk icon" />
                    </ListItemIcon>
                    <ListItemText primary="UK" className="list-item-text" />
                </ListItemButton>
            </List>
        );

        return <React.Fragment>{client_menus}</React.Fragment>;
    }
}

export default MainListItems;
