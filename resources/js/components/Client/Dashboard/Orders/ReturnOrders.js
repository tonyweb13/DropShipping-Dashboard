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
import archivetopicon from "../../../../../img/archive_top_icon.png";
import openfoldericon from "../../../../../img/open_folder_icon.png";
import axios from "axios";
import { CSVLink, CSVDownload } from "react-csv";
import CloseIcon from "@mui/icons-material/Close";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

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

        // let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let labels = [" "];
        const linedata = labels.map(() => 0);

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

        const chartdata = {
            labels,
            datasets: [
                {
                    type: "line",
                    label: " ",
                    borderColor: "#AA5539",
                    backgroundColor: "#AA5539",
                    fill: true,
                    data: linedata,
                    lineTension: 0.1,
                    borderWidth: 2,
                    pointRadius: 2,
                },
            ],
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
                field: "order_date",
                headerName: "Return Date",
                width: 140,
            },
            {
                field: "order_number",
                headerName: "Order Number",
                width: 150,
            },
            {
                field: "no_items_returned",
                headerName: "Items Returned",
                width: 159,
            },
            {
                field: "buyer_name",
                headerName: "Customer Name",
                width: 200,
            },
            {
                field: "buyer_street_number",
                headerName: "Customer Address",
                width: 189,
                hide: true,
            },
            {
                field: "buyer_postal_code",
                headerName: "Zip Code",
                width: 90,
                hide: true,
            },
            {
                field: "shipping_country",
                headerName: "Shipping Country",
                width: 178,
                hide: true,
            },
            {
                field: "FullAddress",
                headerName: "Address",
                renderCell: (params) => {
                    return (
                        params.row.buyer_street_number +
                        ", " +
                        params.row.buyer_postal_code +
                        " " +
                        params.row.shipping_country
                    );
                },
                width: 450,
            },
            {
                field: "tracking_number",
                headerName: "Tracking Link",
                width: 210,
                renderCell: (params) => {
                    return (
                        <a
                            href={`https://parcelsapp.com/en/tracking/${params.row.tracking_number}`}
                            target="_blank"
                        >
                            {params.row.tracking_number}
                        </a>
                    );
                },
            },
            {
                field: "packing_condition",
                headerName: "Package Condition",
                width: 189,
            },
            {
                field: "item_condition",
                headerName: "Item Condition",
                width: 160,
            },
            {
                field: "return_notes",
                headerName: "Notes",
                width: 250,
            },
            {
                field: "status",
                headerName: "Actions",
                renderCell: (params) => {
                    return params.row.status == "archived" ? (
                        <Button
                            variant="outlined"
                            onClick={this.handleArchiveOrder.bind(
                                this,
                                params.row.id
                            )}
                            className="archive_btn_table"
                        >
                            Restore
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={this.handleArchiveOrder.bind(
                                this,
                                params.row.id
                            )}
                            className="archive_btn_table"
                        >
                            Archive
                        </Button>
                    );
                },
                width: 150,
            },
        ];

        const defaultrows = [];
        const urlparams = new URLSearchParams(window.location.search);
        const sparamval = urlparams.get("search");
        this.state = {
            location: "return-orders",
            title: "Return",
            maintitle: "Orders",
            orders: [],
            data: [],
            archived: [],
            cdata: chartdata,
            coptions: chartoptions,
            perpage: 200,
            statusfilter: "",
            returns: "30days",
            sortfield: "",
            sorting: "ASC",
            csvdata: csvData,
            openModal: false,
            exceldata: [],
            sorticon: "",
            statusfield: "",
            showarchivedata: "inline-block",
            showactivedata: "none",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 200,
            datetimesync: "No Data",
            searchValue: sparamval,
            startdate: "",
            enddate: "",
            displayDates: "none",
        };
    }

    componentDidMount() {
        let accessUserLevel = parseInt(localStorage["accessUserLevel"]);
        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        this.setState({ returns: FilterAppState.returns });

        this.getData({
            page: 1,
            perpage: this.state.perpage,
            datefilter: FilterAppState.returns,
        });
        this.getChartData({ datefilter: FilterAppState.returns });
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
        this.statusfield =
            data.statusfield !== undefined ? data.statusfield : "";
        this.datefilter =
            data.datefilter !== undefined
                ? data.datefilter
                : this.state.returns;
        this.start_date =
            data.start_date !== undefined
                ? data.start_date
                : this.state.startdate;
        this.end_date =
            data.end_date !== undefined ? data.end_date : this.state.enddate;

        // axios.get('api/ordersreturns?page=' + data.page + '&perpage=' + this.perpageno + '&statusfilter=' + this.statfilter+ '&sortfield=' + this.sortname+ '&sorting=' + this.sortascdesc+ '&statusfield=' + this.statusfield).then(response => {
        //     this.setState({orders:response.data.orders.data, data:response.data.orders});
        // });
        axios
            .get(
                "api/ordersreturns?statusfield=" +
                    this.statusfield +
                    "&statusfilter=" +
                    this.statfilter +
                    "&datefilter=" +
                    this.datefilter +
                    "&start_date=" +
                    this.start_date +
                    "&end_date=" +
                    this.end_date
            )
            .then((response) => {
                let fullgriddata = [];
                let ctrgrid = 1;
                response.data.orders.forEach(function (key) {
                    let row_grid_data = {
                        checkid: key.id,
                        id: key.id,
                        order_date: key.order_date.substring(0, 11),
                        order_number: key.order_number,
                        no_items_returned: key.no_items_returned,
                        buyer_name: key.buyer_name,
                        buyer_street_number: key.buyer_street_number,
                        buyer_postal_code: key.buyer_postal_code,
                        shipping_country: key.shipping_country,
                        tracking_number: key.tracking_number,
                        packing_condition: key.packing_condition,
                        item_condition: key.item_condition,
                        return_notes: key.return_notes,
                        status: key.status,
                    };
                    fullgriddata.push(row_grid_data);
                    ctrgrid++;
                });
                this.setState({
                    gridrows: fullgriddata,
                    datetimesync: response.data.syncdatetime,
                });
            });
    };

    getChartData = (data) => {
        this.datefilter =
            data.datefilter !== undefined
                ? data.datefilter
                : this.state.returns;
        this.start_date =
            data.start_date !== undefined
                ? data.start_date
                : this.state.startdate;
        this.end_date =
            data.end_date !== undefined ? data.end_date : this.state.enddate;
        axios
            .get(
                "api/returnchartdata?datefilter=" +
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
                    "Timestamp",
                    "Senders Name",
                    "Senders Address",
                    "Zip Code",
                    "Shipping Country",
                    "Tracking Number",
                    "Package Condition",
                    "Item Condition",
                    "Items Returned",
                ];
                let fullcsvdata = [];
                fullcsvdata.push(headercsv);

                csvjson.forEach(function (key) {
                    let row_data_csv = [
                        key.order_date,
                        key.buyer_name,
                        key.buyer_street_number,
                        key.buyer_postal_code,
                        key.shipping_country,
                        key.tracking_number,
                        key.packing_condition,
                        key.item_condition,
                        key.no_items_returned,
                    ];
                    fullcsvdata.push(row_data_csv);
                });

                this.setState({ csvdata: fullcsvdata });
                this.setState({ exceldata: response.data.orderdata });
            });
    };

    handleChangePerPage = (event) => {
        this.setState({
            perpage: event.target.value,
            pagesize: event.target.value,
        });
        this.getData({ page: 1, perpage: event.target.value });
    };

    handleChangeFilter = (event) => {
        this.setState({ statusfilter: event.target.value });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            statusfilter: event.target.value,
        });
    };
    handleChangeDateFilter = (event) => {
        this.setState({ returns: event.target.value });
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
        });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            sortname: sorttype,
            sorting: toggleSorting,
        });
        event.preventDefault();
    };

    handleOpenModal = () => {
        this.setState({ openModal: true });
    };

    handleCloseModal = () => {
        this.setState({ openModal: false });
    };

    handleArchiveOrder = (orderid) => {
        const statusfield = this.state.statusfield;
        let status = "archived";
        if (statusfield == "archived") {
            status = "";
        }
        const orderData = new FormData();
        orderData.append("orderid", orderid);
        orderData.append("status", status);
        axios.post("api/archiveorder", orderData).then((response) => {
            this.getData({
                page: 1,
                statusfield: statusfield,
                perpage: this.state.perpage,
                sortname: this.state.sortfield,
                sorting: this.state.sorting,
            });
        });
    };

    handleArchiveOrders = (event) => {
        const orderData = new FormData();
        orderData.append("orders", JSON.stringify(this.state.archived));
        axios.post("api/archiveorders", orderData).then((response) => {
            this.getData({
                page: 1,
                perpage: this.state.perpage,
                sortname: this.state.sortfield,
                sorting: this.state.sorting,
            });
        });
    };

    handleArchiveCheckedRows = (archived) => {
        this.setState({ archived: archived });
    };

    showArchiveOrders = (type) => {
        let btndisplayarchive = "inline-block";
        let btndisplayactive = "none";
        if (type == "archived") {
            btndisplayarchive = "none";
            btndisplayactive = "inline-block";
        }
        this.setState({
            showarchivedata: btndisplayarchive,
            showactivedata: btndisplayactive,
            statusfield: type,
        });
        this.getData({ page: 1, statusfield: type, statusfilter: "" });
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
            (column) => column.field !== "status"
        );
        this.setState({ gridcolumns: cfields });
    };

    render() {
        const mdTheme = createTheme();
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
                            filename={"Return Order Data"}
                            className="exportpopupbtn"
                        >
                            Export CSV
                        </CSVLink>

                        <ReactHTMLTableToExcel
                            className="exportpopupbtn"
                            table="chartTable"
                            filename="Return Order Data"
                            sheet="Sheet"
                            buttonText="Export Excel"
                        />
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
                                        Here is the graph for the return orders.
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
                                            value={this.state.returns}
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
                                                <th>Timestamp</th>
                                                <th>Senders Name</th>
                                                <th>Senders Address</th>
                                                <th>Zip Code</th>
                                                <th>Shipping Country</th>
                                                <th>Tracking Number</th>
                                                <th>Package Condition</th>
                                                <th>Item Condition</th>
                                                <th>Items Returned</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.exceldata.map(
                                                (exrow, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {
                                                                    exrow.order_date
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.buyer_name
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.buyer_street_number
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.buyer_postal_code
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.shipping_country
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.tracking_number
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.packing_condition
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.item_condition
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.no_items_returned
                                                                }
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
                                        <div className="table_filter_options">
                                            <Typography component="div">
                                                <Select
                                                    value={
                                                        this.state.statusfilter
                                                    }
                                                    onChange={
                                                        this.handleChangeFilter
                                                    }
                                                    displayEmpty
                                                    inputProps={{
                                                        "aria-label":
                                                            "Without label",
                                                    }}
                                                    className="mx-1 table-filters filter_selects"
                                                    IconComponent={
                                                        KeyboardArrowDownIcon
                                                    }
                                                >
                                                    <MenuItem value="">
                                                        <em
                                                            style={{
                                                                fontStyle:
                                                                    "normal",
                                                            }}
                                                        >
                                                            Status
                                                        </em>
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={"Appears New"}
                                                    >
                                                        Appears New
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={"Broken/Trash"}
                                                    >
                                                        Broken/Trash
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={
                                                            "Needs Further Inspection"
                                                        }
                                                    >
                                                        Needs Further Inspection
                                                    </MenuItem>
                                                </Select>
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
                                                    className="mx-1 table-filters filter_selects"
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
                                                <Button
                                                    style={{
                                                        display: "inline-block",
                                                    }}
                                                    onClick={this.handleArchiveOrders.bind(
                                                        this
                                                    )}
                                                    className="filter_top_btn"
                                                >
                                                    <img
                                                        src={archivetopicon}
                                                        alt="archive icon"
                                                    />
                                                    Archive
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    style={{
                                                        display:
                                                            this.state
                                                                .showarchivedata,
                                                    }}
                                                    onClick={this.showArchiveOrders.bind(
                                                        this,
                                                        "archived"
                                                    )}
                                                    className="filter_top_btn"
                                                >
                                                    <img
                                                        src={archivetopicon}
                                                        alt="archive icon"
                                                    />{" "}
                                                    Show Archived
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    style={{
                                                        display:
                                                            this.state
                                                                .showactivedata,
                                                    }}
                                                    onClick={this.showArchiveOrders.bind(
                                                        this,
                                                        ""
                                                    )}
                                                    className="filter_top_btn"
                                                >
                                                    <img
                                                        src={openfoldericon}
                                                        alt="open folder icon"
                                                    />{" "}
                                                    Show Active Returns
                                                </Button>
                                                <span>
                                                    <strong>Last Sync:</strong>{" "}
                                                    {this.state.datetimesync}
                                                </span>
                                            </Typography>
                                        </div>
                                        <Box className="data_grid_container">
                                            <DataGridPremium
                                                rows={this.state.gridrows}
                                                columns={this.state.gridcolumns}
                                                pageSize={this.state.pagesize}
                                                rowsPerPageOptions={[-1]}
                                                pagination
                                                checkboxSelection
                                                onSelectionModelChange={(
                                                    ids
                                                ) => {
                                                    const selectedIDs = new Set(
                                                        ids
                                                    );
                                                    const selectedRows =
                                                        this.state.gridrows.filter(
                                                            (row) =>
                                                                selectedIDs.has(
                                                                    row.id
                                                                )
                                                        );

                                                    this.handleArchiveCheckedRows(
                                                        selectedRows
                                                    );
                                                }}
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
                                                        params.field ===
                                                        "packing_condition"
                                                    ) {
                                                        return (
                                                            "st" +
                                                            params.value
                                                                .replace(
                                                                    / /g,
                                                                    ""
                                                                )
                                                                .substring(0, 5)
                                                        );
                                                    } else if (
                                                        params.field ===
                                                        "item_condition"
                                                    ) {
                                                        return (
                                                            "st" +
                                                            params.value
                                                                .replace(
                                                                    / /g,
                                                                    ""
                                                                )
                                                                .substring(0, 5)
                                                        );
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
                                                                        "order_number",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 2,
                                                                    columnField:
                                                                        "buyer_name",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 3,
                                                                    columnField:
                                                                        "tracking_number",
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
            </ThemeProvider>
        );
    }
}

export default Orders;