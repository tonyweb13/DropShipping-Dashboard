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
import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";

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
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        font: {
                            size: 11,
                            family: "'Manrope',sans-serif",
                            style: "normal",
                            weight: 500,
                        },
                        color: "#000000",
                        padding: 30,
                        textAlign: "left",
                    },
                    position: "top",
                    align: "start",
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
                        color: "#7C7C7C",
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
                        color: "#7C7C7C",
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
                field: "rundate",
                headerName: "Run Date",
                flex: 1,
                renderCell: (params) => {
                    var currentdate = new Date();
                    var date_time =
                        currentdate.getFullYear() +
                        "-" +
                        (currentdate.getMonth() + 1) +
                        "-" +
                        currentdate.getDate() +
                        " " +
                        currentdate.getHours() +
                        ":" +
                        currentdate.getMinutes() +
                        ":" +
                        currentdate.getSeconds();

                    return params.row.rundate ? params.row.rundate : date_time;
                },
                hide: true,
            },
            {
                field: "ordernumber",
                headerName: "Order Number",
                width: 140,
            },
            {
                field: "orderdate",
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
                field: "orderage",
                headerName: "Order Age",
                type: "number",
                flex: 1,
                headerAlign: "left",
                align: "left",
                hide: true,
            },
            {
                field: "customername",
                headerName: "Customers Name",
                renderCell: (params) => {
                    return params.row.firstname + " " + params.row.lastname;
                },
                width: 350,
            },
            {
                field: "status",
                headerName: "Status",
                flex: 1,
                hide: true,
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
                        params.row.address == null ? "" : params.row.address;
                    let addrs2 =
                        params.row.address2 == null ? "" : params.row.address2;
                    let addrs3 =
                        params.row.address3 == null ? "" : params.row.address3;
                    let spcity =
                        params.row.shipCity == null ? "" : params.row.shipCity;
                    let spState =
                        params.row.shipState == null
                            ? ""
                            : params.row.shipState;
                    let zpcode =
                        params.row.zipcode == null ? "" : params.row.zipcode;
                    let cntry =
                        params.row.country == null ? "" : params.row.country;

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
                width: 450,
            },
            {
                field: "actions",
                headerName: "Action",
                renderCell: (params) => {
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
                },
                width: 150,
            },
        ];

        const defaultrows = [];
        this.state = {
            location: "held-orders",
            title: "Held",
            maintitle: "Orders",
            orders: [],
            data: [],
            cdata: chartdata,
            coptions: chartoptions,
            held: "30days",
            perpage: 10,
            statusfilter: "",
            sortfield: "",
            sorting: "ASC",
            csvdata: csvData,
            openModal: false,
            exceldata: [],
            sorticon: "",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 10,
            datetimesync: "",
            orderid: 0,
            customername: "",
            first_name: "",
            last_name: "",
            address: "",
            address2: "",
            address3: "",
            city: "",
            state: "",
            buyer_postal_code: "",
            shipping_country: "",
        };

        this.handleEditSubmit = this.handleEditSubmit.bind(this);
    }

    componentDidMount() {
        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        this.setState({ held: FilterAppState.held });

        this.getData({ page: 1, perpage: this.state.perpage });
        this.getChartData({ datefilter: FilterAppState.held });
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
        // axios.get('api/heldorders?page=' + data.page + '&perpage=' + this.perpageno + '&statusfilter=' + this.statfilter+ '&sortfield=' + this.sortname+ '&sorting=' + this.sortascdesc).then(response => {
        //     this.setState({orders:response.data.orders.data, data:response.data.orders});
        // });

        axios
            .get("api/heldorders?statusfilter=" + this.statfilter)
            .then((response) => {
                let fullgriddata = [];
                let ctrgrid = 1;
                response.data.orders.forEach(function (key) {
                    const customername = key.CustomerName;
                    const splitname = customername.split(" ");
                    let firstname = key.FirstName;
                    let lastname = key.LastName;
                    if (
                        typeof firstname === "undefined" ||
                        firstname === null
                    ) {
                        firstname = splitname[0];
                        lastname = splitname[1];
                    }
                    let row_grid_data = {
                        id: ctrgrid,
                        rundate: key.Rundate,
                        orderdate: key.OrderDate.substring(0, 11),
                        ordernumber: key.OrderNumber,
                        orderage: key.OrderAge,
                        customername: key.CustomerName,
                        firstname: firstname,
                        lastname: lastname,
                        status: key.Status,
                        address: key.Address,
                        address2: key.Address2,
                        address3: key.Address3,
                        shipCity: key.ShipCity,
                        shipState: key.ShipState,
                        zipcode: key.ZipCode,
                        country: key.Country,
                        actions: key.ID,
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
            data.datefilter !== undefined ? data.datefilter : this.state.held;
        axios
            .get("api/heldchartdata?datefilter=" + this.datefilter)
            .then((response) => {
                this.newchart = {
                    labels: response.data.chartlabel,
                    datasets: response.data.chartdataset,
                };
                this.setState({ cdata: this.newchart });

                let csvjson = response.data.orderdata;
                let headercsv = [
                    "Run Date",
                    "Date",
                    "Order Number",
                    "Order Age",
                    "Customer Name",
                    "Status",
                ];
                let fullcsvdata = [];
                fullcsvdata.push(headercsv);

                csvjson.forEach(function (key) {
                    let row_data_csv = [
                        key.Rundate,
                        key.OrderDate,
                        key.OrderNumber,
                        key.OrderAge,
                        key.CustomerName,
                        key.Status,
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
        this.setState({ held: event.target.value });
        this.getChartData({ datefilter: event.target.value });
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
        this.setState({ openModal: false, openEditModal: false });
    };

    handleEditOpenModal = (orderid) => {
        axios.get("api/getheldorders?orderid=" + orderid).then((response) => {
            const customername = response.data.order.CustomerName;
            const splitname = customername.split(" ");
            let firstname = response.data.order.FirstName;
            let lastname = response.data.order.LastName;
            if (typeof firstname === "undefined" || firstname === null) {
                firstname = splitname[0];
                lastname = splitname[1];
            }

            this.setState({
                orderid: response.data.order.ID,
                customername: customername,
                first_name: firstname,
                last_name: lastname,
                address: response.data.order.Address,
                address2: response.data.order.Address2,
                address3: response.data.order.Address3,
                city: response.data.order.ShipCity,
                state: response.data.order.ShipState,
                buyer_postal_code: response.data.order.ZipCode,
                shipping_country: response.data.order.Country,
                openEditModal: true,
            });
        });
    };

    handleEditSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        const form = document.querySelector("#orderForm");
        const orderData = new FormData(form);
        orderData.append("orderid", this.state.orderid);

        axios.post("api/editheldorder", orderData).then((response) => {
            this.setState({ openEditModal: false, formSubmitting: false });
            this.getData({ page: 1 });
        });
    }

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
                            filename={"Held Order Data"}
                            className="exportpopupbtn"
                        >
                            Export CSV
                        </CSVLink>

                        <ReactHTMLTableToExcel
                            className="exportpopupbtn"
                            table="chartTable"
                            filename="Held Order Data"
                            sheet="Sheet"
                            buttonText="Export Excel"
                        />
                    </DialogContent>
                </Box>
            </Dialog>
        );

        let showSyncdate = "";
        if (this.state.datetimesync != "") {
            showSyncdate = (
                <span>
                    <strong>Last Sync:</strong> {this.state.datetimesync}
                </span>
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
                            Update Held Order
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
                            <Button
                                type={"button"}
                                autoFocus
                                color="inherit"
                                onClick={this.handleCloseModal}
                            >
                                Close
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
                                        Here is the graph for the held orders.
                                    </Typography>
                                    <Typography
                                        component="div"
                                        className="subpage_graph_sort_cnt"
                                    >
                                        <Select
                                            value={this.state.held}
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
                                                <th>Run Date</th>
                                                <th>Order Date</th>
                                                <th>Order Number</th>
                                                <th>Order Age</th>
                                                <th>Customer Name</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.exceldata.map(
                                                (exrow, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {exrow.Rundate}
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.OrderDate
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.OrderNumber
                                                                }
                                                            </td>
                                                            <td>
                                                                {exrow.OrderAge}
                                                            </td>
                                                            <td>
                                                                {
                                                                    exrow.CustomerName
                                                                }
                                                            </td>
                                                            <td>
                                                                {exrow.Status}
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
                                            <Typography
                                                component="div"
                                                className="table_selection_area"
                                            >
                                                {/* <Select
                                    value={''}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className='filter-by-batch filter_selects'
                                    IconComponent={KeyboardArrowDownIcon}
                                >
                                    <MenuItem value="">
                                        <em style={{ fontStyle: 'normal' }}>Batch Action</em>
                                    </MenuItem>
                                </Select> */}
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
                                                    className="table-filters filter_selects"
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
                                                        value={"Postal Hold"}
                                                    >
                                                        Postal Hold
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={"Bad Address"}
                                                    >
                                                        Bad Address
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={"Backordered"}
                                                    >
                                                        Backordered
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
                                                </Select>
                                                {showSyncdate}
                                            </Typography>
                                            {/* <Typography component="div" className="table_selection_area right_selections">
                             <Link href="#"><img src={printericon} alt="printer icon" /></Link>
                             <Link href="#"><img src={uploadicon} alt="upload icon" /></Link>
                             <Link href="#"><img src={settingsicon} alt="settings icon" /></Link>
                            </Typography> */}
                                        </div>
                                        {/* <Pagination count={10} changePage={this.getData} data={this.state.data} variant="outlined" shape="rounded" prevButtonClass="prev_pbtn" nextButtonClass="next_pbtn"/>
                          <div className="table_grid_container">
                            <Table size="small" className="table_data">
                              <TableHead>
                                <TableRow>
                                  <TableCell><Link href="#" onClick={this.handleTableSort("OrderDate")}>Order Date {this.state.sorticon=="OrderDate" && this.state.sorting=="ASC" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</Link></TableCell>
                                  <TableCell><Link href="#" onClick={this.handleTableSort("OrderNumber")}>Order Number {this.state.sorticon=="OrderNumber" && this.state.sorting=="ASC" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</Link></TableCell>
                                  <TableCell><Link href="#" onClick={this.handleTableSort("OrderAge")}>Order Age {this.state.sorticon=="OrderAge" && this.state.sorting=="ASC" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</Link></TableCell>
                                  <TableCell><Link href="#" onClick={this.handleTableSort("CustomerName")}>Customer Name {this.state.sorticon=="CustomerName" && this.state.sorting=="ASC" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</Link></TableCell>
                                  <TableCell><Link href="#" onClick={this.handleTableSort("Status")}>Status {this.state.sorticon=="Status" && this.state.sorting=="ASC" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</Link></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {this.state.orders.map((row) => (
                                  <TableRow key={row.id}>
                                    <TableCell>{row.OrderDate.substring(0,11)}</TableCell>
                                    <TableCell>{row.OrderNumber}</TableCell>
                                    <TableCell>{row.OrderAge}</TableCell>
                                    <TableCell>{row.CustomerName}</TableCell>
                                    <TableCell className={'st'+row.Status.replace(/ /g, '')}>{row.Status}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>      
                          </div>  */}
                                        <Box className="data_grid_container">
                                            <DataGridPremium
                                                rows={this.state.gridrows}
                                                columns={this.state.gridcolumns}
                                                pageSize={this.state.pagesize}
                                                rowsPerPageOptions={[5]}
                                                pagination
                                                disableSelectionOnClick
                                                components={{
                                                    Toolbar: GridToolbar,
                                                }}
                                                componentsProps={{
                                                    toolbar: {
                                                        showQuickFilter: true,
                                                    },
                                                }}
                                                getCellClassName={(params) => {
                                                    if (
                                                        params.field ===
                                                        "status"
                                                    ) {
                                                        return (
                                                            "st" +
                                                            params.value.replace(
                                                                / /g,
                                                                ""
                                                            )
                                                        );
                                                    } else {
                                                        return "";
                                                    }
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
            </ThemeProvider>
        );
    }
}

export default Orders;
