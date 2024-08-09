import React, { Component } from "react";
// import {Pagination} from 'react-laravel-paginex'
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
    Alert,
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
import CommonSection from "../Common/CommonSection";
import Title from "../Common/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import downloadicon from "../../../../../img/dl.png";
import printericon from "../../../../../img/printer_icon.png";
import uploadicon from "../../../../../img/upload_icon.png";
import settingsicon from "../../../../../img/settings_icon.png";
import { color } from "@mui/system";
import axios from "axios";
import { endsWith, isEmpty } from "lodash";
import { CSVLink, CSVDownload } from "react-csv";
import CloseIcon from "@mui/icons-material/Close";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import calendaricondark from "../../../../../img/calendar_icon_dark.png";
import arrowforwardbrown from "../../../../../img/arrow_forward_brown.png";
import arrowforwardblack from "../../../../../img/arrow_forward_black.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import {
    DataGridPremium,
    GridToolbar,
    GridLinkOperator,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
    GridFooterContainer,
    GridPagination,
} from "@mui/x-data-grid-premium";

import Pagination from "@mui/material/Pagination";

export function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
            showFirstButton
            showLastButton
        />
    );
}

function CustomFooter() {
    return (
        <GridFooterContainer>
            <GridPagination />
            <CustomPagination />
        </GridFooterContainer>
    );
}

class Orders extends Component {
    constructor(props) {
        super(props);
        ChartJS.register(
            LinearScale,
            CategoryScale,
            BarElement,
            PointElement,
            LineElement,
            Legend,
            Tooltip
        );

        let labels = [" "];
        const linedata = labels.map(() => 0);

        const chartdata = {
            labels,
            datasets: [
                {
                    type: "line",
                    label: " ",
                    borderColor: "#FCC354",
                    backgroundColor: "#FCC354",
                    fill: true,
                    data: linedata,
                    lineTension: 0.1,
                    borderWidth: 2,
                    pointRadius: 0,
                },
            ],
        };
        const getOrCreateTooltip = (chart) => {
            let tooltipEl = chart.canvas.parentNode.querySelector("div");

            if (!tooltipEl) {
                tooltipEl = document.createElement("div");
                tooltipEl.style.background = "#FEFEFE";
                tooltipEl.style.borderRadius = "3px";
                tooltipEl.style.color = "#000";
                tooltipEl.style.fontFamily = "'Work Sans', sans-serif";
                tooltipEl.style.opacity = 1;
                tooltipEl.style.pointerEvents = "none";
                tooltipEl.style.position = "absolute";
                tooltipEl.style.transform = "translate(-50%, 0)";
                tooltipEl.style.transition = "all .1s ease";
                tooltipEl.style.zIndex = 99;
                tooltipEl.style.boxShadow =
                    "-1px 1px 2px rgba(216, 216, 216, 0.2), 1px -1px 2px rgba(216, 216, 216, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.9), 1px 1px 3px rgba(216, 216, 216, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.3), inset -1px -1px 2px rgba(216, 216, 216, 0.5)";

                const table = document.createElement("table");
                table.style.margin = "0px";

                tooltipEl.appendChild(table);
                chart.canvas.parentNode.appendChild(tooltipEl);
            }

            return tooltipEl;
        };

        const externalTooltipHandler = (context) => {
            // Tooltip Element
            const { chart, tooltip } = context;
            const tooltipEl = getOrCreateTooltip(chart);

            // Hide if no tooltip
            if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
            }

            // Set Text
            if (tooltip.body) {
                const titleLines = tooltip.title || [];
                const bodyLines = tooltip.body.map((b) => b.lines);

                const tableHead = document.createElement("thead");

                titleLines.forEach((title) => {
                    const tr = document.createElement("tr");
                    tr.style.borderWidth = 0;
                    tr.style.backgroundColor = "#AA5539";
                    tr.style.borderRadius = "10px 10px 0px 0px";

                    const th = document.createElement("th");
                    th.style.borderWidth = 0;
                    th.style.backgroundColor = "#AA5539";
                    th.style.padding = "5px 20px";
                    th.style.borderRadius = "10px 10px 0px 0px";
                    th.style.color = "#FFFFFF";
                    th.style.fontSize = "12px";
                    th.style.lineHeight = "14px";
                    th.style.textAlign = "center";
                    th.style.fontFamily = "'Work Sans', sans-serif";
                    th.style.fontWeight = "500";
                    th.style.boxShadow =
                        "inset 1px -1px 2px rgba(129, 65, 43, 0.2), inset -1px 1px 2px rgba(129, 65, 43, 0.2), inset 1px 1px 2px rgba(211, 105, 71, 0.9), inset -1px -1px 3px rgba(129, 65, 43, 0.9)";
                    const text = document.createTextNode(title);

                    th.appendChild(text);
                    tr.appendChild(th);
                    tableHead.appendChild(tr);
                });

                const tableBody = document.createElement("tbody");
                bodyLines.forEach((body, i) => {
                    const colors = tooltip.labelColors[i];

                    const tr = document.createElement("tr");
                    tr.style.backgroundColor = "inherit";
                    tr.style.borderWidth = 0;
                    tr.style.padding = "14px 20px";

                    const td = document.createElement("td");
                    td.style.borderWidth = 0;
                    td.style.padding = "14px 20px 0";
                    td.style.fontSize = "12px";
                    td.style.fontFamily = "'Manrope', sans-serif";
                    td.style.fontWeight = "500";

                    const text = document.createTextNode(body);

                    // td.appendChild(span);
                    td.appendChild(text);
                    tr.appendChild(td);
                    tableBody.appendChild(tr);
                });

                const tableRoot = tooltipEl.querySelector("table");

                // Remove old children
                while (tableRoot.firstChild) {
                    tableRoot.firstChild.remove();
                }

                // Add new children
                tableRoot.appendChild(tableHead);
                tableRoot.appendChild(tableBody);
            }

            const { offsetLeft: positionX, offsetTop: positionY } =
                chart.canvas;

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 1;
            tooltipEl.style.left = positionX + tooltip.caretX + "px";
            tooltipEl.style.top = positionY + tooltip.caretY + "px";
            tooltipEl.style.font = tooltip.options.bodyFont.string;
            tooltipEl.style.borderRadius = "10px";
            tooltipEl.style.paddingBottom = "14px";
            // tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
        };

        const chartoptions = {
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                    position: "nearest",
                    external: externalTooltipHandler,
                },
            },
            scales: {
                x: {
                    grid: {
                        borderDash: [8, 4],
                    },
                    ticks: {
                        color: "black",
                        font: {
                            size: 11,
                            family: "'Manrope',sans-serif",
                            style: "normal",
                            weight: 500,
                        },
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: "black",
                        font: {
                            size: 11,
                            family: "'Manrope',sans-serif",
                            style: "normal",
                            weight: 500,
                        },
                        beginAtZero: true,
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value;
                            }
                        },
                    },
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            maintainAspectRatio: false,
        };
        const csvData = [];

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "RunDate",
                headerName: "Run Date",
                width: 140,
                hide: true,
            },
            {
                field: "OrderNumber",
                headerName: "Order Number",
                width: 140,
            },
            {
                field: "OrderDate",
                headerName: "Order Date",
                width: 180,
            },
            {
                field: "FirstName",
                headerName: "First Name",
                width: 170,
                hide: true,
            },
            {
                field: "LastName",
                headerName: "Last Name",
                width: 170,
                hide: true,
            },
            {
                field: "CustomerName",
                headerName: "Customers Name",
                renderCell: (params) => {
                    return params.row.FirstName + " " + params.row.LastName;
                },
                width: 200,
            },
            {
                field: "Address",
                headerName: "Address",
                width: 350,
                hide: true,
            },
            {
                field: "Address2",
                headerName: "Address 2",
                width: 350,
                hide: true,
            },
            {
                field: "Address3",
                headerName: "Address 3",
                width: 350,
                hide: true,
            },
            {
                field: "ShipCity",
                headerName: "City",
                width: 350,
                hide: true,
            },
            {
                field: "ShipState",
                headerName: "State",
                width: 350,
                hide: true,
            },
            {
                field: "Zipcode",
                headerName: "Zip Code",
                width: 160,
                hide: true,
            },
            {
                field: "Country",
                headerName: "Country",
                width: 160,
                hide: true,
            },
            {
                field: "FullAddress",
                headerName: "Address",
                renderCell: (params) => {
                    let addrs =
                        params.row.Address == null ? "" : params.row.Address;
                    let addrs2 =
                        params.row.Address2 == null ? "" : params.row.Address2;
                    let addrs3 =
                        params.row.Address3 == null ? "" : params.row.Address3;
                    let spcity =
                        params.row.ShipCity == null ? "" : params.row.ShipCity;
                    let spState =
                        params.row.ShipState == null
                            ? ""
                            : params.row.ShipState;
                    let zpcode =
                        params.row.Zipcode == null ? "" : params.row.Zipcode;
                    let cntry =
                        params.row.Country == null ? "" : params.row.Country;

                    return (
                        addrs +
                        " " +
                        addrs2 +
                        " " +
                        addrs3 +
                        " " +
                        spcity +
                        ", " +
                        spState +
                        " " +
                        zpcode +
                        " " +
                        cntry
                    );
                },
                width: 350,
            },
            {
                field: "LocalStatus",
                headerName: "Reasons",
                width: 160,
            },
            {
                field: "Type",
                headerName: "Status",
                renderCell: (params) => {
                    if (params.row.ForcePrint == 1) {
                        return params.row.Type + " (ForcePrint - In Progress)";
                    } else {
                        return params.row.Type;
                    }
                },
                width: 160,
            },
            {
                field: "actions",
                headerName: "Action",
                renderCell: (params) => {
                    if (params.row.editing_status == "Disable") {
                        return (
                            <Button
                                variant="outlined"
                                onClick={this.handleOpenDisableModal.bind()}
                                className="primary-btn datagridbtn disablebtn"
                            >
                                Update
                            </Button>
                        );
                    } else {
                        return (
                            <Button
                                variant="outlined"
                                onClick={this.handleEditOpenModal.bind(
                                    this,
                                    params.row.actions
                                )}
                                className="primary-btn datagridbtn"
                            >
                                Update
                            </Button>
                        );
                    }
                },
                width: 150,
            },
        ];

        const defaultrows = [];
        const urlparams = new URLSearchParams(window.location.search);
        const sparamval = urlparams.get("search");
        this.state = {
            location: "open-orders",
            title: "Open",
            maintitle: "Orders",
            orders: [],
            data: [],
            cdata: chartdata,
            coptions: chartoptions,
            openorders: "30days",
            perpage: 200,
            statusfilter: "",
            sortfield: "",
            sorting: "ASC",
            csvdata: csvData,
            openModal: false,
            openEditModal: false,
            formSubmitting: false,
            exceldata: [],
            orderid: 0,
            first_name: "",
            last_name: "",
            address: "",
            address2: "",
            address3: "",
            city: "",
            state: "",
            buyer_postal_code: "",
            shipping_country: "",
            sorticon: "",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 200,
            global_msg: {
                type: "error",
                message: "",
            },
            common_msg: {
                type: "error",
                message: "",
            },
            cancelledbtn: null,
            printedbtn: null,
            disableModal: false,
            editing_status_class: "hide_imp",
            storedisable: false,
            gstoreid: 0,
            reloadpopup: false,
            searchValue: sparamval,
            startdate: "",
            enddate: "",
            displayDates: "none",
        };

        this.handleEditSubmit = this.handleEditSubmit.bind(this);
    }

    componentDidMount() {
        let accessUserLevel = parseInt(localStorage["accessUserLevel"]);
        let localFilterState = localStorage["blocksFilter"];

        let FilterAppState = JSON.parse(localFilterState);

        this.setState({ openorders: FilterAppState.openorders });

        this.getData({
            page: 1,
            perpage: this.state.perpage,
            datefilter: FilterAppState.openorders,
        });
        this.getChartData({ datefilter: FilterAppState.openorders });
        this.assign_storeid();
        this.getsearch_params();

        // disable action is access level is 1.
        if (typeof accessUserLevel !== undefined && accessUserLevel == 1) {
            this.removeActionColumn();
        }
    }

    getData = (data) => {
        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        this.statfilter =
            data.statusfilter !== undefined
                ? data.statusfilter
                : this.state.statusfilter;
        this.sortname =
            data.sortname !== undefined ? data.sortname : this.state.sortfield;
        this.sortascdesc =
            data.sorting !== undefined ? data.sorting : this.state.sorting;
        this.datefilter =
            data.datefilter !== undefined
                ? data.datefilter
                : this.state.openorders;
        this.start_date =
            data.start_date !== undefined
                ? data.start_date
                : this.state.startdate;
        this.end_date =
            data.end_date !== undefined ? data.end_date : this.state.enddate;

        axios
            .get(
                "api/openorders?datefilter=" +
                    this.datefilter +
                    "&start_date=" +
                    this.start_date +
                    "&end_date=" +
                    this.end_date
            )
            .then((response) => {
                let fullgriddata = [];
                let ctrgrid = 1;
                let editstatus = response.data.editing_status;
                if (editstatus == "Disable") {
                    this.setState({
                        editing_status_class: "show_disable_open_msg",
                    });
                }
                response.data.orders.forEach(function (key) {
                    let typestatus;
                    if (key.Type == "O") {
                        typestatus = "Open";
                    } else if (key.Type == "H") {
                        typestatus = "Held";
                    }

                    let row_grid_data = {
                        id: ctrgrid,
                        RunDate: key.RunDate,
                        OrderNumber: key.OrderNumber,
                        OrderDate: key.OrderDate.substring(0, 11),
                        FirstName: key.FirstName,
                        LastName: key.LastName,
                        Address: key.Address,
                        Address2: key.Address2,
                        Address3: key.Address3,
                        ShipCity: key.ShipCity,
                        ShipState: key.ShipState,
                        Zipcode: key.Zipcode,
                        Country: key.Country,
                        LocalStatus: key.LocalStatus,
                        ForcePrint: key.ForcePrint,
                        Type: typestatus,
                        actions: key.ID,
                        editing_status: editstatus,
                    };
                    fullgriddata.push(row_grid_data);
                    ctrgrid++;
                });
                this.setState({ gridrows: fullgriddata });
            });
    };

    getChartData = (data) => {
        this.datefilter =
            data.datefilter !== undefined
                ? data.datefilter
                : this.state.openorders;
        this.start_date =
            data.start_date !== undefined
                ? data.start_date
                : this.state.startdate;
        this.end_date =
            data.end_date !== undefined ? data.end_date : this.state.enddate;
        axios
            .get(
                "api/openorderschartdata?datefilter=" +
                    this.datefilter +
                    "&start_date=" +
                    this.start_date +
                    "&end_date=" +
                    this.end_date
            )
            .then((response) => {
                this.newchart = {
                    labels: response.data.chartlabel,
                    datasets: [response.data.chartdataset],
                };
                this.setState({ cdata: this.newchart });

                let csvjson = response.data.orderdata;
                let headercsv = [
                    "Run Date",
                    "Order Number",
                    "Order Date",
                    "First Name",
                    "Last Name",
                    "Address",
                    "Zip Code",
                    "Shipping Country",
                ];

                let fullcsvdata = [];
                fullcsvdata.push(headercsv);

                csvjson.forEach(function (key) {
                    let row_data_csv = [
                        key.RunDate,
                        key.OrderNumber,
                        key.OrderDate,
                        key.FirstName,
                        key.LastName,
                        key.Address,
                        key.Zipcode,
                        key.Country,
                    ];
                    fullcsvdata.push(row_data_csv);
                });

                this.setState({
                    csvdata: fullcsvdata,
                    global_msg: { message: "" },
                });
                this.setState({ exceldata: response.data.orderdata });
            });
    };

    handleChangePerPage = (event) => {
        this.setState({
            perpage: event.target.value,
            pagesize: event.target.value,
            global_msg: { message: "" },
        });
        this.getData({ page: 1, perpage: event.target.value });
    };
    handleChangeFilter = (event) => {
        this.setState({
            statusfilter: event.target.value,
            global_msg: { message: "" },
        });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            statusfilter: event.target.value,
        });
    };
    handleChangeDateFilter = (event) => {
        this.setState({
            openorders: event.target.value,
            global_msg: { message: "" },
        });
        if (event.target.value == "custom") {
            this.setState({ displayDates: "inline-block" });
        } else {
            this.setState({
                displayDates: "none",
                enddate: null,
                startdate: null,
            });
            this.getChartData({ datefilter: event.target.value });
            this.getData({
                page: 1,
                perpage: this.state.perpage,
                datefilter: event.target.value,
            });
        }
    };

    handleTableSort = (sorttype) => (event) => {
        let toggleSorting = "ASC";
        if (this.state.sorting == "ASC") {
            toggleSorting = "DESC";
        }
        this.setState({
            sorting: toggleSorting,
            sortfield: sorttype,
            sorticon: sorttype,
            global_msg: { message: "" },
        });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            sortname: sorttype,
            sorting: toggleSorting,
        });
        event.preventDefault();
    };

    handleOpenModal = (orderid) => {
        this.setState({ openModal: true });
    };

    handleOpenDisableModal = () => {
        this.setState({ disableModal: true });
    };
    handleReloadpage = () => {
        location.reload(true);
    };

    handleEditOpenModal = (orderid) => {
        axios
            .get("api/get_editstatus_order?storeid=" + this.state.gstoreid)
            .then((response) => {
                let storestatus = response.data.editstatus;
                if (storestatus == "Disable") {
                    this.setState({ openEditModal: false, reloadpopup: true });
                    this.handleOpenDisableModal(true);
                } else {
                    axios
                        .get("api/getopenorder?orderid=" + orderid)
                        .then((response) => {
                            this.setState({
                                orderid: response.data.order.ID,
                                first_name: response.data.order.FirstName,
                                last_name: response.data.order.LastName,
                                address: response.data.order.Address,
                                address2: response.data.order.Address2,
                                address3: response.data.order.Address3,
                                city: response.data.order.ShipCity,
                                state: response.data.order.ShipState,
                                buyer_postal_code: response.data.order.Zipcode,
                                shipping_country: response.data.order.Country,
                                cancelledbtn: response.data.order.CancelOrder,
                                printedbtn: response.data.order.ForcePrint,
                                openEditModal: true,
                                global_msg: { message: "" },
                            });
                        });
                }
            });
    };

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            openEditModal: false,
            disableModal: false,
        });
    };

    handleEditSubmit(e) {
        e.preventDefault();
        axios
            .get("api/get_editstatus_order?storeid=" + this.state.gstoreid)
            .then((response) => {
                let storestatus = response.data.editstatus;
                if (storestatus == "Disable") {
                    this.setState({ reloadpopup: true });
                    this.handleOpenDisableModal(true);
                    this.setState({ formSubmitting: false });
                } else {
                    this.setState({ formSubmitting: true });
                    const form = document.querySelector("#orderForm");
                    const orderData = new FormData(form);
                    orderData.append("orderid", this.state.orderid);

                    axios
                        .post("api/editopenorder", orderData)
                        .then((response) => {
                            this.setState({
                                openEditModal: false,
                                formSubmitting: false,
                                global_msg: {
                                    type: "success",
                                    message: "Open Order updated successfully!",
                                },
                            });
                            this.getData({ page: 1 });
                        });
                }
            });
    }

    handleCancelOrder = () => {
        axios
            .get("api/get_editstatus_order?storeid=" + this.state.gstoreid)
            .then((response) => {
                let storestatus = response.data.editstatus;
                if (storestatus == "Disable") {
                    this.setState({ reloadpopup: true });
                    this.handleOpenDisableModal(true);
                } else {
                    if (
                        window.confirm(
                            "Do you really wish to cancel this order?"
                        )
                    ) {
                        const orderData = new FormData();
                        orderData.append("orderid", this.state.orderid);

                        axios
                            .post("api/cancelopenorder", orderData)
                            .then((response) => {
                                let type = "success";
                                let msg = "Open Order cancelled successfully!";
                                if (
                                    response.data.cancelled == 1 &&
                                    response.data.printed == null
                                ) {
                                    type = "error";
                                    msg = "Open Order already cancelled.";
                                } else if (
                                    response.data.cancelled == null &&
                                    response.data.printed == 1
                                ) {
                                    type = "error";
                                    msg =
                                        "Not allowed: Open Order already force printed.";
                                } else if (
                                    response.data.printed == 1 &&
                                    response.data.cancelled == 1
                                ) {
                                    type = "error";
                                    msg = "Open Order already cancelled.";
                                }

                                this.setState({
                                    disableModal: false,
                                    openEditModal: false,
                                    cancelledbtn: 1,
                                    global_msg: { type: type, message: msg },
                                });
                                this.getData({ page: 1 });
                            });
                    }
                }
            });
    };

    handleForceSprint = () => {
        axios
            .get("api/get_editstatus_order?storeid=" + this.state.gstoreid)
            .then((response) => {
                let storestatus = response.data.editstatus;
                if (storestatus == "Disable") {
                    this.setState({ reloadpopup: true });
                    this.handleOpenDisableModal(true);
                } else {
                    if (
                        window.confirm(
                            "Do you really wish to force print this order?"
                        )
                    ) {
                        const orderData = new FormData();
                        orderData.append("orderid", this.state.orderid);

                        axios
                            .post("api/printopenorder", orderData)
                            .then((response) => {
                                let type = "success";
                                let msg =
                                    "Open Order force print successfully!";
                                if (
                                    response.data.printed == 1 &&
                                    response.data.cancelled == null
                                ) {
                                    type = "error";
                                    msg = "Open Order already force printed.";
                                } else if (
                                    response.data.printed == null &&
                                    response.data.cancelled == 1
                                ) {
                                    type = "error";
                                    msg =
                                        "Not allowed: Open Order already cancelled.";
                                } else if (
                                    response.data.printed == 1 &&
                                    response.data.cancelled == 1
                                ) {
                                    type = "error";
                                    msg = "Open Order already force printed.";
                                }

                                this.setState({
                                    disableModal: false,
                                    openEditModal: false,
                                    printedbtn: 1,
                                    global_msg: { type: type, message: msg },
                                });
                                this.getData({ page: 1 });
                            });
                    }
                }
            });
    };
    assign_storeid = () => {
        axios.get("api/assign_storeid").then((response) => {
            this.setState({ gstoreid: response.data.storeid });
        });
    };
    getsearch_params = () => {
        const urlparams = new URLSearchParams(window.location.search);
        let searchparamval = urlparams.get("search");
        let searchState = {
            searchtext: searchparamval,
        };
        localStorage["searchState"] = JSON.stringify(searchState);
    };
    handleStartDateChange = (newValue) => {
        let fdate = "";
        if (newValue !== null && newValue !== undefined) {
            let monp1 = parseInt(newValue["$M"]) + 1;
            let mons = monp1.toString().padStart(2, 0);
            let days = newValue["$D"].toString().padStart(2, 0);
            let yr = newValue["$y"];
            fdate = yr + "-" + mons + "-" + days;
        }

        this.setState({ startdate: fdate });
        let sdate = fdate;
        let edate = this.state.enddate;
        if (sdate != "" && edate != "") {
            this.getChartData({ start_date: sdate, end_date: edate });
            this.getData({
                page: 1,
                perpage: this.state.perpage,
                start_date: sdate,
                end_date: edate,
            });
        }
    };

    handleEndDateChange = (newValue) => {
        let fdate = "";
        if (newValue !== null && newValue !== undefined) {
            let monp1 = parseInt(newValue["$M"]) + 1;
            let mons = monp1.toString().padStart(2, 0);
            let days = newValue["$D"].toString().padStart(2, 0);
            let yr = newValue["$y"];
            fdate = yr + "-" + mons + "-" + days;
        }

        this.setState({ enddate: fdate });
        let sdate = this.state.startdate;
        let edate = fdate;
        if (sdate != "" && edate != "") {
            this.getChartData({ start_date: sdate, end_date: edate });
            this.getData({
                page: 1,
                perpage: this.state.perpage,
                start_date: sdate,
                end_date: edate,
            });
        }
    };

    removeActionColumn = () => {
        const cfields = this.state.gridcolumns.filter(
            (column) => column.field !== "actions"
        );
        this.setState({ gridcolumns: cfields });
    };

    render() {
        const mdTheme = createTheme();

        const fullWidth = true;
        const maxWidth = "md";

        const modalContainer = (
            <Dialog
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box component={"form"} onSubmit={this.handleInventorySubmit}>
                    <AppBar sx={{ position: "relative" }}>
                        <Toolbar>
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="h6"
                                component="div"
                            ></Typography>

                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={this.handleCloseModal}
                                aria-label="close"
                                className="close_dialog_button"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Choose Export
                        </Typography>

                        <CSVLink
                            data={this.state.csvdata}
                            filename={"Open Order Data"}
                            className="exportpopupbtn"
                        >
                            Export CSV
                        </CSVLink>

                        <ReactHTMLTableToExcel
                            className="exportpopupbtn"
                            table="chartTable"
                            filename="Open Order Data"
                            sheet="Sheet"
                            buttonText={"Export Excel"}
                        />
                    </DialogContent>
                </Box>
            </Dialog>
        );

        let showbtns = true;
        let showstatuslbl;
        if (this.state.cancelledbtn == 1) {
            showbtns = false;
            showstatuslbl = (
                <Alert style={{ marginBottom: "20px" }} severity="error">
                    Order Cancelled
                </Alert>
            );
        } else if (this.state.printedbtn == 1) {
            showbtns = false;
            showstatuslbl = (
                <Alert style={{ marginBottom: "20px" }} severity="success">
                    Order Printed
                </Alert>
            );
        }

        const modalEditContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openEditModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="orderForm"
                    component={"form"}
                    onSubmit={this.handleEditSubmit}
                >
                    <AppBar
                        sx={{ position: "relative" }}
                        className="primary-appbar"
                    >
                        <Toolbar className="primary-toolbar">
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="h6"
                                component="div"
                            ></Typography>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={this.handleCloseModal}
                                aria-label="close"
                                className="close_dialog_button"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Update Open Order
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="first_name"
                            name="first_name"
                            label="First Name"
                            defaultValue={this.state.first_name}
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="last_name"
                            name="last_name"
                            label="Last Name"
                            defaultValue={this.state.last_name}
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="address"
                            name="address"
                            label="Address"
                            defaultValue={this.state.address}
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="address2"
                            name="address2"
                            label="Address 2"
                            defaultValue={this.state.address2}
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="address3"
                            name="address3"
                            label="Address 3"
                            defaultValue={this.state.address3}
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="city"
                            name="city"
                            defaultValue={this.state.city}
                            label="City"
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="state"
                            name="state"
                            defaultValue={this.state.state}
                            label="State"
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="buyer_postal_code"
                            name="buyer_postal_code"
                            defaultValue={this.state.buyer_postal_code}
                            label="Zip Code"
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="shipping_country"
                            name="shipping_country"
                            label="Shipping Country"
                            defaultValue={this.state.shipping_country}
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <div className="form_btns">
                            {showbtns ? (
                                <span>
                                    <Button
                                        type={"button"}
                                        style={{
                                            color: "#fff",
                                            background:
                                                "linear-gradient(135deg, rgb(255 0 40) 0%, rgb(208 0 0 / 99%) 100%)",
                                            whiteSpace: "nowrap",
                                            width: "150px",
                                        }}
                                        autoFocus
                                        color="inherit"
                                        onClick={this.handleCancelOrder}
                                    >
                                        Cancel Order
                                    </Button>
                                    <Button
                                        type={"button"}
                                        style={{
                                            color: "#fff",
                                            background:
                                                "linear-gradient(135deg, #449248 0%, #26a22cfc 100%)",
                                            whiteSpace: "nowrap",
                                            width: "150px",
                                        }}
                                        autoFocus
                                        color="inherit"
                                        onClick={this.handleForceSprint}
                                    >
                                        Force Print
                                    </Button>
                                    <Button
                                        type={"submit"}
                                        autoFocus
                                        color="inherit"
                                        disabled={this.state.formSubmitting}
                                    >
                                        {this.state.formSubmitting
                                            ? "Saving..."
                                            : "Save"}
                                    </Button>
                                </span>
                            ) : (
                                <span>{showstatuslbl}</span>
                            )}
                            <Button
                                type={"button"}
                                autoFocus
                                color="inherit"
                                onClick={this.handleCloseModal}
                            >
                                Exit
                            </Button>
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        const modalDisableContainer = (
            <Dialog
                open={this.state.disableModal}
                onClose={
                    this.state.reloadpopup
                        ? this.handleReloadpage
                        : this.handleCloseModal
                }
                className="ordermodal"
            >
                <Box component={"form"}>
                    <AppBar sx={{ position: "relative" }}>
                        <Toolbar>
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="h6"
                                component="div"
                            ></Typography>

                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={
                                    this.state.reloadpopup
                                        ? this.handleReloadpage
                                        : this.handleCloseModal
                                }
                                aria-label="close"
                                className="close_dialog_button"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Open Orders
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            Editing is not allowed during this hour. Please
                            contact your administrator for more information.
                        </DialogContentText>
                        <div className="form_btns">
                            <Button
                                type={"button"}
                                color="inherit"
                                onClick={
                                    this.state.reloadpopup
                                        ? this.handleReloadpage
                                        : this.handleCloseModal
                                }
                            >
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );
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
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography
                                        component="h2"
                                        className="subpage_title"
                                    >
                                        {this.state.title} Orders
                                    </Typography>
                                    <Typography
                                        component="h3"
                                        className="subpage_subtitle"
                                    >
                                        Here is the statistics for open orders.
                                    </Typography>
                                    <Typography
                                        component="div"
                                        className="subpage_graph_sort_cnt orders_top_date_filters"
                                    >
                                        <Typography
                                            component="div"
                                            className="datepicker_contents"
                                            style={{
                                                display:
                                                    this.state.displayDates,
                                            }}
                                        >
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                            >
                                                <DesktopDatePicker
                                                    label="Start Date"
                                                    inputFormat="YYYY-MM-DD"
                                                    value={this.state.startdate}
                                                    onChange={
                                                        this
                                                            .handleStartDateChange
                                                    }
                                                    className="table-filters filter_selects date-picker-field"
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                        />
                                                    )}
                                                />
                                                <DesktopDatePicker
                                                    label="End Date"
                                                    inputFormat="YYYY-MM-DD"
                                                    value={this.state.enddate}
                                                    onChange={
                                                        this.handleEndDateChange
                                                    }
                                                    className="table-filters filter_selects date-picker-field"
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Typography>
                                        <Select
                                            value={this.state.openorders}
                                            onChange={
                                                this.handleChangeDateFilter
                                            }
                                            displayEmpty
                                            inputProps={{
                                                "aria-label": "Without label",
                                            }}
                                            className="filter-graph-by filter_selects"
                                            IconComponent={
                                                KeyboardArrowDownIcon
                                            }
                                        >
                                            <MenuItem value="thisweek">
                                                <em
                                                    style={{
                                                        fontStyle: "normal",
                                                    }}
                                                >
                                                    This Week
                                                </em>
                                            </MenuItem>
                                            <MenuItem value={"thismonth"}>
                                                This Month
                                            </MenuItem>
                                            <MenuItem value={"7days"}>
                                                Last 7 Days
                                            </MenuItem>
                                            <MenuItem value={"30days"}>
                                                Last 30 Days
                                            </MenuItem>
                                            <MenuItem value={"lastmonth"}>
                                                Last month
                                            </MenuItem>
                                            <MenuItem value={"thisquarter"}>
                                                This quarter
                                            </MenuItem>
                                            <MenuItem value={"lastquarter"}>
                                                Last quarter
                                            </MenuItem>
                                            <MenuItem value={"last12months"}>
                                                Last 12 Months
                                            </MenuItem>
                                            <MenuItem value={"custom"}>
                                                Custom Date
                                            </MenuItem>
                                        </Select>
                                        <Button
                                            className="export_button"
                                            onClick={this.handleOpenModal}
                                        >
                                            {" "}
                                            <img
                                                src={downloadicon}
                                                alt="download"
                                            />{" "}
                                            Export Data
                                        </Button>
                                        {/* <CSVLink data={this.state.csvdata} filename={"Held Order Data"} className="btn export_button exportcsvbtn" ><img src={downloadicon} alt="download" /> Export Data</CSVLink> */}
                                    </Typography>
                                    <Typography
                                        variant="div"
                                        component="div"
                                        className="graph_container"
                                        style={{ paddingTop: "20px" }}
                                    >
                                        <Chart
                                            type="bar"
                                            data={this.state.cdata}
                                            options={this.state.coptions}
                                            height="400"
                                        />
                                    </Typography>
                                    <Table id="chartTable">
                                        <thead>
                                            <tr>
                                                <th>Order Number</th>
                                                <th>Order Date</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Address</th>
                                                <th>Zip Code</th>
                                                <th>Shipping Country</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.exceldata.map(
                                                (exrow, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {
                                                                    exrow.OrderNumber
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.OrderDate
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.FirstName
                                                                }
                                                            </td>
                                                            <td>
                                                                {exrow.LastName}
                                                            </td>
                                                            <td>
                                                                {exrow.Address}
                                                            </td>
                                                            <td>
                                                                {exrow.Zipcode}
                                                            </td>
                                                            <td>
                                                                {exrow.Country}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </Table>
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
                                            className={
                                                "table_selection_area " +
                                                this.state.editing_status_class
                                            }
                                        >
                                            <Alert
                                                style={{ marginBottom: "20px" }}
                                                severity="error"
                                            >
                                                Editing is not allowed during
                                                this hour. Please contact your
                                                administrator for more
                                                information.
                                            </Alert>
                                        </Typography>
                                        <div className="table_filter_options">
                                            <Typography
                                                component="div"
                                                className="table_selection_area"
                                            >
                                                <Select
                                                    value={this.state.perpage}
                                                    onChange={
                                                        this.handleChangePerPage
                                                    }
                                                    displayEmpty
                                                    inputProps={{
                                                        "aria-label":
                                                            "Without label",
                                                    }}
                                                    className="table-filters filter_selects"
                                                    IconComponent={
                                                        KeyboardArrowDownIcon
                                                    }
                                                >
                                                    <MenuItem value="10">
                                                        <em
                                                            style={{
                                                                fontStyle:
                                                                    "normal",
                                                            }}
                                                        >
                                                            Show 10
                                                        </em>
                                                    </MenuItem>
                                                    <MenuItem value={20}>
                                                        Show 20
                                                    </MenuItem>
                                                    <MenuItem value={50}>
                                                        Show 50
                                                    </MenuItem>
                                                    <MenuItem value={75}>
                                                        Show 75
                                                    </MenuItem>
                                                    <MenuItem value={100}>
                                                        Show 100
                                                    </MenuItem>
                                                    <MenuItem value={200}>
                                                        Show 200
                                                    </MenuItem>
                                                    <MenuItem value={500}>
                                                        Show 500
                                                    </MenuItem>
                                                </Select>
                                            </Typography>
                                        </div>
                                        {this.state.global_msg.message !=
                                            "" && (
                                            <Alert
                                                style={{ margin: "20px 0" }}
                                                severity={
                                                    this.state.global_msg.type
                                                }
                                            >
                                                {this.state.global_msg.message}
                                            </Alert>
                                        )}
                                        <Box className="data_grid_container">
                                            <DataGridPremium
                                                rows={this.state.gridrows}
                                                columns={this.state.gridcolumns}
                                                pageSize={this.state.pagesize}
                                                rowsPerPageOptions={[-1]}
                                                pagination
                                                disableSelectionOnClick
                                                components={{
                                                    Toolbar: GridToolbar,
                                                    Footer: CustomFooter,
                                                }}
                                                componentsProps={{
                                                    toolbar: {
                                                        showQuickFilter: true,
                                                    },
                                                }}
                                                getCellClassName={(params) => {
                                                    if (
                                                        params.field === "Type"
                                                    ) {
                                                        if (
                                                            params.value ==
                                                            "Held"
                                                        ) {
                                                            return "order-status-red";
                                                        } else {
                                                            return "order-status-green";
                                                        }
                                                    } else {
                                                        return "";
                                                    }
                                                }}
                                                initialState={{
                                                    filter: {
                                                        filterModel: {
                                                            items: [
                                                                {
                                                                    id: 1,
                                                                    columnField:
                                                                        "OrderNumber",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 2,
                                                                    columnField:
                                                                        "FirstName",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 3,
                                                                    columnField:
                                                                        "LastName",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 4,
                                                                    columnField:
                                                                        "Address",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                            ],
                                                            linkOperator:
                                                                GridLinkOperator.Or,
                                                        },
                                                    },
                                                }}
                                                experimentalFeatures={{
                                                    newEditingApi: true,
                                                }}
                                            />
                                            <div className="datagrid_pagination_bg"></div>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
                {modalContainer}
                {modalEditContainer}
                {modalDisableContainer}
            </ThemeProvider>
        );
    }
}

export default Orders;
