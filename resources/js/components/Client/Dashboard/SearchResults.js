import React, { Component } from "react";
import { Pagination } from "react-laravel-paginex";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Container,
    Grid,
    Paper,
    CssBaseline,
    Box,
    Toolbar,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Checkbox,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog,
    AppBar,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    AreaElement,
    Legend,
    Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import CommonSection from "./Common/CommonSection";
import Title from "./Common/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import downloadicon from "../../../../img/dl.png";
import printericon from "../../../../img/printer_icon.png";
import uploadicon from "../../../../img/upload_icon.png";
import settingsicon from "../../../../img/settings_icon.png";
import { color } from "@mui/system";
import axios from "axios";
import { endsWith, isEmpty } from "lodash";
import { CSVLink, CSVDownload } from "react-csv";
import CloseIcon from "@mui/icons-material/Close";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import calendaricondark from "../../../../img/calendar_icon_dark.png";
import arrowforwardbrown from "../../../../img/arrow_forward_brown.png";
import arrowforwardblack from "../../../../img/arrow_forward_black.png";

import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";

class SearchResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: "searchresults",
            title: "Search Results",
            maintitle: "",
            orders: [],
            data: [],
            openorders: "30days",
            perpage: 10,
            statusfilter: "",
            sortfield: "",
            sorting: "ASC",
            openModal: false,
            openEditModal: false,
            formSubmitting: false,
            exceldata: [],
            orderid: 0,
            pagesize: 10,
            searchtext: "",
            openordercount: 0,
            returnordercount: 0,
            intransitcount: 0,
            delayedcount: 0,
            receivingcount: 0,
            shipmentcount: 0,
            nostockcount: 0,
            safelistcount: 0,
            editedhistorycount: 0,
            inventorytrackercount: 0,
            masterinventorytrackercount: 0,
            searchcontents: {
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
                tools: "",
                order_menu: "",
                inventory_menu: "",
                pricing_menu: "",
                customtools_menu: "",
                resports_submenu: "",
                product_bundles: "",
                inventory_manager: "",
                allOrders: "",
            },
        };
    }

    componentDidMount() {
        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);

        let localsearchstate = localStorage["searchState"];
        let searchAppState = JSON.parse(localsearchstate);
        this.setState({ searchtext: searchAppState.searchtext });

        if (searchAppState.searchtext != "") {
            axios
                .post("api/searchresults", {
                    searchtext: searchAppState.searchtext,
                })
                .then((response) => {
                    this.setState({
                        openordercount: response.data.openorders,
                        returnordercount: response.data.returnorders,
                        intransitcount: response.data.intransit,
                        delayedcount: response.data.delayed,
                        receivingcount: response.data.receiving,
                        shipmentcount: response.data.shipment,
                        nostockcount: response.data.nostocks,
                        safelistcount: response.data.safelist,
                        editedhistorycount: response.data.editedhistory,
                        inventorytrackercount: response.data.inventorytracker,
                        masterinventorytrackercount:
                            response.data.masterinventorytracker,
                        allOrders: response.data.allOrders,
                    });
                });
        }
        let state = localStorage["appState"];
        let menustate = localStorage["menuState"];

        let usermemrole = "";
        if (state) {
            let AppState = JSON.parse(state);
            let MenuAppState = JSON.parse(menustate);
            usermemrole = AppState.user.role;

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
            AppState.uspsdelayedshipments == "0"
                ? "hide_imp"
                : "";
        let resportssubmenu = "";

        this.setState({
            searchcontents: {
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
                product_bundles: AppState.product_bundles,
                inventory_manager: AppState.inventory_manager,
                resports_submenu: resportssubmenu,
            },
        });

        return;
    };

    render() {
        const mdTheme = createTheme();

        const fullWidth = true;
        const maxWidth = "md";

        return (
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />
                    <CommonSection
                        title={this.state.title}
                        maintitle={this.state.maintitle}
                        location={this.state.location}
                    />
                    <Box
                        component="main"
                        sx={{
                            backgroundColor: (theme) =>
                                theme.palette.mode === "light"
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],
                            flexGrow: 1,
                            height: "100vh",
                            overflow: "auto",
                        }}
                    >
                        <Toolbar />
                        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                            <Grid className="dashboard_home_container searchpagecontainer">
                                <Grid item xs={12}>
                                    <Typography
                                        component="h2"
                                        className="subpage_title"
                                    >
                                        {this.state.title} for :{" "}
                                        <span className="search_text_header">
                                            {this.state.searchtext}
                                        </span>{" "}
                                    </Typography>

                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                        className="table_grid"
                                    >
                                        <Title></Title>
                                        <Typography
                                            component="div"
                                            className="settingsBlock"
                                            xs={12}
                                        >
                                            <List
                                                sx={{
                                                    width: "100%",
                                                    bgcolor: "background.paper",
                                                }}
                                                className="setting_block_list search_result_list"
                                            >
                                                <ListItem
                                                    key={0}
                                                    className="default_settingli"
                                                >
                                                    <ListItemText
                                                        id="settingdefault"
                                                        primary="Pages"
                                                        className="default_listname dlfirst"
                                                    />
                                                    <div className="default_listname">
                                                        <Typography
                                                            component="span"
                                                            edge="end"
                                                            aria-label="right"
                                                            className="default_listname"
                                                        >
                                                            Search Found
                                                        </Typography>
                                                    </div>
                                                </ListItem>
                                                {/* {this.state.allOrders == 0 &&
                                                this.state.editedhistorycount ==
                                                    0 &&
                                                this.state
                                                    .inventorytrackercount ==
                                                    0 &&
                                                this.state
                                                    .masterinventorytrackercount ==
                                                    0 &&
                                                this.state.nostockcount == 0 &&
                                                this.state.receivingcount ==
                                                    0 &&
                                                this.state.safelistcount == 0 &&
                                                this.state.shipmentcount ==
                                                    0 ? (
                                                    <div
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "14px",
                                                            }}
                                                        >
                                                            <hr></hr>
                                                            No Page Found
                                                        </span>
                                                    </div> */}
                                                {/* ) : ( */}
                                                <div>
                                                    <ListItem
                                                        key={101}
                                                        className={[
                                                            "searchResultHeaders " +
                                                                this.state
                                                                    .searchcontents
                                                                    .order_menu,
                                                        ]}
                                                    >
                                                        <ListItemText
                                                            id="setting-1"
                                                            primary="Orders"
                                                            className="searchGroupTitle"
                                                        />
                                                    </ListItem>
                                                    {this.state.allOrders ==
                                                    0 ? (
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "14px",
                                                                }}
                                                            >
                                                                <hr></hr>
                                                                No Records Found
                                                            </span>
                                                            <hr></hr>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <ListItem key={4}>
                                                                <ListItemText
                                                                    id="setting-4"
                                                                    primary="All"
                                                                    className="limit-char"
                                                                />
                                                                <Typography
                                                                    edge="end"
                                                                    aria-label="right"
                                                                >
                                                                    <Link
                                                                        href={[
                                                                            "/all-orders?search=" +
                                                                                this
                                                                                    .state
                                                                                    .searchtext,
                                                                        ]}
                                                                    >
                                                                        {
                                                                            this
                                                                                .state
                                                                                .allOrders
                                                                        }
                                                                    </Link>
                                                                </Typography>
                                                            </ListItem>
                                                        </div>
                                                    )}
                                                    <ListItem
                                                        key={102}
                                                        className={[
                                                            "searchResultHeaders " +
                                                                this.state
                                                                    .searchcontents
                                                                    .inventory_menu,
                                                        ]}
                                                    >
                                                        <ListItemText
                                                            id="setting-1"
                                                            primary="Inventory"
                                                            className="searchGroupTitle"
                                                        />
                                                    </ListItem>
                                                    {this.state
                                                        .receivingcount == 0 &&
                                                    this.state.shipmentcount ==
                                                        0 &&
                                                    this.state.nostockcount ==
                                                        0 &&
                                                    this.state
                                                        .inventorytrackercount ==
                                                        0 &&
                                                    this.state
                                                        .masterinventorytrackercount ==
                                                        0 ? (
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "14px",
                                                                }}
                                                            >
                                                                <hr></hr>
                                                                No Records Found
                                                            </span>
                                                            <hr></hr>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {this.state
                                                                .receivingcount ==
                                                            0 ? null : (
                                                                <div>
                                                                    <ListItem
                                                                        key={5}
                                                                        className={
                                                                            "mhide" +
                                                                            this
                                                                                .state
                                                                                .searchcontents
                                                                                .receiving_inventory
                                                                        }
                                                                    >
                                                                        <ListItemText
                                                                            id="setting-5"
                                                                            primary="Inventory Receiving"
                                                                            className="limit-char"
                                                                        />
                                                                        <Typography
                                                                            edge="end"
                                                                            aria-label="right"
                                                                        >
                                                                            <Link
                                                                                href={[
                                                                                    "/inventory-receiving?search=" +
                                                                                        this
                                                                                            .state
                                                                                            .searchtext,
                                                                                ]}
                                                                            >
                                                                                {
                                                                                    this
                                                                                        .state
                                                                                        .receivingcount
                                                                                }
                                                                            </Link>
                                                                        </Typography>
                                                                    </ListItem>
                                                                </div>
                                                            )}
                                                            {this.state
                                                                .shipmentcount ==
                                                            0 ? null : (
                                                                <ListItem
                                                                    key={6}
                                                                    className={
                                                                        "mhide" +
                                                                        this
                                                                            .state
                                                                            .searchcontents
                                                                            .addshipment_inventory
                                                                    }
                                                                >
                                                                    <ListItemText
                                                                        id="setting-6"
                                                                        primary="Add Shipments"
                                                                        className="limit-char"
                                                                    />
                                                                    <Typography
                                                                        edge="end"
                                                                        aria-label="right"
                                                                    >
                                                                        <Link
                                                                            href={[
                                                                                "/inventory-add-shipments?search=" +
                                                                                    this
                                                                                        .state
                                                                                        .searchtext,
                                                                            ]}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .shipmentcount
                                                                            }
                                                                        </Link>
                                                                    </Typography>
                                                                </ListItem>
                                                            )}
                                                            {this.state
                                                                .nostockcount ==
                                                            0 ? null : (
                                                                <ListItem
                                                                    key={7}
                                                                    className={
                                                                        "mhide" +
                                                                        this
                                                                            .state
                                                                            .searchcontents
                                                                            .no_stock_inventory
                                                                    }
                                                                >
                                                                    <ListItemText
                                                                        id="setting-7"
                                                                        primary="No Stock"
                                                                        className="limit-char"
                                                                    />
                                                                    <Typography
                                                                        edge="end"
                                                                        aria-label="right"
                                                                    >
                                                                        <Link
                                                                            href={[
                                                                                "/inventory-no-stock?search=" +
                                                                                    this
                                                                                        .state
                                                                                        .searchtext,
                                                                            ]}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .nostockcount
                                                                            }
                                                                        </Link>
                                                                    </Typography>
                                                                </ListItem>
                                                            )}
                                                            {this.state
                                                                .inventorytrackercount ==
                                                            0 ? null : (
                                                                <ListItem
                                                                    key={8}
                                                                    className={
                                                                        "mhide" +
                                                                        this
                                                                            .state
                                                                            .searchcontents
                                                                            .product_inventory
                                                                    }
                                                                >
                                                                    <ListItemText
                                                                        id="setting-8"
                                                                        primary="Products"
                                                                        className="limit-char"
                                                                    />
                                                                    <Typography
                                                                        edge="end"
                                                                        aria-label="right"
                                                                    >
                                                                        <Link
                                                                            href={[
                                                                                "/inventory-products?search=" +
                                                                                    this
                                                                                        .state
                                                                                        .searchtext,
                                                                            ]}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .inventorytrackercount
                                                                            }
                                                                        </Link>
                                                                    </Typography>
                                                                </ListItem>
                                                            )}
                                                            {this.state
                                                                .masterinventorytrackercount ==
                                                            0 ? null : (
                                                                <ListItem
                                                                    key={9}
                                                                    className={
                                                                        "mhide" +
                                                                        this
                                                                            .state
                                                                            .searchcontents
                                                                            .inventory_manager
                                                                    }
                                                                >
                                                                    <ListItemText
                                                                        id="setting-9"
                                                                        primary="Inventory Manager"
                                                                        className="limit-char"
                                                                    />
                                                                    <Typography
                                                                        edge="end"
                                                                        aria-label="right"
                                                                    >
                                                                        <Link
                                                                            href={[
                                                                                "/inventory-master-lists?search=" +
                                                                                    this
                                                                                        .state
                                                                                        .searchtext,
                                                                            ]}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .masterinventorytrackercount
                                                                            }
                                                                        </Link>
                                                                    </Typography>
                                                                </ListItem>
                                                            )}
                                                        </div>
                                                    )}

                                                    <ListItem
                                                        key={103}
                                                        className={[
                                                            "searchResultHeaders " +
                                                                this.state
                                                                    .searchcontents
                                                                    .customtools_menu,
                                                        ]}
                                                    >
                                                        <ListItemText
                                                            id="setting-103"
                                                            primary="Custom Tools"
                                                            className="searchGroupTitle"
                                                        />
                                                    </ListItem>
                                                    {this.state.safelistcount ==
                                                        0 &&
                                                    this.state
                                                        .editedhistorycount ==
                                                        0 ? (
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "14px",
                                                                }}
                                                            >
                                                                <hr></hr>
                                                                No Records Found
                                                            </span>
                                                            <hr></hr>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {this.state
                                                                .safelistcount ==
                                                            0 ? null : (
                                                                <ListItem
                                                                    key={10}
                                                                    className={
                                                                        "mhide" +
                                                                        this
                                                                            .state
                                                                            .searchcontents
                                                                            .safelist
                                                                    }
                                                                >
                                                                    <ListItemText
                                                                        id="setting-10"
                                                                        primary="Safelist"
                                                                        className="limit-char"
                                                                    />
                                                                    <Typography
                                                                        edge="end"
                                                                        aria-label="right"
                                                                    >
                                                                        <Link
                                                                            href={[
                                                                                "/safe-list?search=" +
                                                                                    this
                                                                                        .state
                                                                                        .searchtext,
                                                                            ]}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .safelistcount
                                                                            }
                                                                        </Link>
                                                                    </Typography>
                                                                </ListItem>
                                                            )}
                                                            {this.state
                                                                .editedhistorycount ==
                                                            0 ? null : (
                                                                <ListItem
                                                                    key={11}
                                                                    className={
                                                                        "mhide" +
                                                                        this
                                                                            .state
                                                                            .searchcontents
                                                                            .edithistory
                                                                    }
                                                                >
                                                                    <ListItemText
                                                                        id="setting-11"
                                                                        primary="Edit History"
                                                                        className="limit-char"
                                                                    />
                                                                    <Typography
                                                                        edge="end"
                                                                        aria-label="right"
                                                                    >
                                                                        <Link
                                                                            z
                                                                            href={[
                                                                                "/edited-open-orders?search=" +
                                                                                    this
                                                                                        .state
                                                                                        .searchtext,
                                                                            ]}
                                                                        >
                                                                            {
                                                                                this
                                                                                    .state
                                                                                    .editedhistorycount
                                                                            }
                                                                        </Link>
                                                                    </Typography>
                                                                </ListItem>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {/* )} */}
                                            </List>
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }
}

export default SearchResults;
