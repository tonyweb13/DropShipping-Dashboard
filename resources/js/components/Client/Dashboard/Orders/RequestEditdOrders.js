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
import moment from "moment";

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

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
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
                width: 250,
            },
            {
                field: "Reason",
                headerName: "Action",
                width: 350,
            },
            {
                field: "CreatedAt",
                headerName: "Date Edited",
                renderCell: (params) => {
                    return moment(params.row.CreatedAt).format("llll");
                },
                width: 180,
            },
            {
                field: "EditedBy",
                headerName: "Edited By",
                width: 180,
            },
        ];

        const defaultrows = [];
        const urlparams = new URLSearchParams(window.location.search);
        const sparamval = urlparams.get("search");
        this.state = {
            location: "edited-open-orders",
            title: "Edit History",
            maintitle: "History",
            orders: [],
            data: [],
            openorders: "30days",
            perpage: 200,
            statusfilter: "",
            sortfield: "",
            sorting: "ASC",
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
            searchValue: sparamval,
        };

        this.handleEditSubmit = this.handleEditSubmit.bind(this);
    }

    componentDidMount() {
        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        this.setState({ openorders: FilterAppState.openorders });

        this.getData({ page: 1, perpage: this.state.perpage });
        this.getsearch_params();
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

        axios.get("api/editedopenorders").then((response) => {
            let fullgriddata = [];
            let ctrgrid = 1;
            response.data.orders.forEach(function (key) {
                let row_grid_data = {
                    id: ctrgrid,
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
                    actions: key.OpenorderID,
                    status: key.Status,
                    Reason: key.Reason,
                    CreatedAt: key.created_at,
                    EditedBy: key.edit_with,
                };
                fullgriddata.push(row_grid_data);
                ctrgrid++;
            });
            this.setState({ gridrows: fullgriddata });
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

    handleOpenModal = (orderid) => {
        this.setState({ openModal: true });
    };

    handleEditOpenModal = (orderid) => {
        axios
            .get("api/geteditedopenorder?orderid=" + orderid)
            .then((response) => {
                this.setState({
                    orderid: response.data.order.OpenorderID,
                    first_name: response.data.order.FirstName,
                    last_name: response.data.order.LastName,
                    address: response.data.order.Address,
                    address2: response.data.order.Address2,
                    address3: response.data.order.Address3,
                    city: response.data.order.ShipCity,
                    state: response.data.order.ShipState,
                    buyer_postal_code: response.data.order.Zipcode,
                    shipping_country: response.data.order.Country,
                    openEditModal: true,
                });
            });
    };

    handleCloseModal = () => {
        this.setState({ openModal: false, openEditModal: false });
    };

    handleEditSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        const form = document.querySelector("#orderForm");
        const orderData = new FormData(form);
        orderData.append("orderid", this.state.orderid);

        axios.post("api/editopenorder", orderData).then((response) => {
            this.setState({ openEditModal: false, formSubmitting: false });
            this.getData({ page: 1 });
        });
    }
    getsearch_params = () => {
        const urlparams = new URLSearchParams(window.location.search);
        let searchparamval = urlparams.get("search");
        let searchState = {
            searchtext: searchparamval,
        };
        localStorage["searchState"] = JSON.stringify(searchState);
    };

    render() {
        const mdTheme = createTheme();

        const fullWidth = true;
        const maxWidth = "md";

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
                                        {this.state.title}
                                    </Typography>
                                    <Typography
                                        component="h3"
                                        className="subpage_subtitle"
                                    >
                                        Here is the statistics for edit
                                        histories.
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
                                        <Box className="data_grid_container">
                                            <DataGridPremium
                                                rows={this.state.gridrows}
                                                columns={this.state.gridcolumns}
                                                pageSize={this.state.pagesize}
                                                rowsPerPageOptions={[10]}
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
                                                        params.field ===
                                                        "status"
                                                    ) {
                                                        if (
                                                            params.value ==
                                                            "Pending"
                                                        ) {
                                                            return "order-status-yellow";
                                                        } else if (
                                                            params.value ==
                                                            "Failed"
                                                        ) {
                                                            return "order-status-red";
                                                        } else {
                                                            return "order-status-green";
                                                        }
                                                    } else {
                                                        return "";
                                                    }
                                                }}
                                                experimentalFeatures={{
                                                    newEditingApi: true,
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
                                                                {
                                                                    id: 5,
                                                                    columnField:
                                                                        "Address2",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 6,
                                                                    columnField:
                                                                        "Address3",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 7,
                                                                    columnField:
                                                                        "ShipCity",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 8,
                                                                    columnField:
                                                                        "ShipState",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 9,
                                                                    columnField:
                                                                        "Zipcode",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 10,
                                                                    columnField:
                                                                        "Country",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                                {
                                                                    id: 11,
                                                                    columnField:
                                                                        "Reason",
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
                                            />
                                            <div className="datagrid_pagination_bg"></div>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
                {modalEditContainer}
            </ThemeProvider>
        );
    }
}

export default Orders;
