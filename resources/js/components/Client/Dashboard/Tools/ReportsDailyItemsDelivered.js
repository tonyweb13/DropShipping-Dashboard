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
    Alert,
    AppBar,
    IconButton,
    Stack,
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
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import calendaricondark from "../../../../../img/calendar_icon_dark.png";
import arrowforwardbrown from "../../../../../img/arrow_forward_brown.png";
import arrowforwardblack from "../../../../../img/arrow_forward_black.png";
import edit_icon from "../../../../../img/edit_icon_new.png";
import trash_icon from "../../../../../img/trash_icon.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import {
    DataGridPremium,
    GridToolbar,
    GridLinkOperator,
} from "@mui/x-data-grid-premium";

class ReportsDailyItemsDelivered extends Component {
    constructor(props) {
        super(props);
        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "OrderNumber",
                headerName: "Order Number",
                hide: true,
                flex: 1,
            },
            {
                field: "CustomerEmail",
                headerName: "Customer Email",
                flex: 1,
            },
            {
                field: "ShipCountryCode",
                headerName: "Country Code",
                flex: 1,
            },
            {
                field: "Carrier",
                headerName: "Carrier",
                flex: 1,
            },
            {
                field: "RollupItemSKU",
                headerName: "Rollup SKU",
                flex: 1,
            },
            {
                field: "trackingnumber",
                headerName: "Tracking Number",
                flex: 1,
            },
            {
                field: "Delivery_Status",
                headerName: "Delivery Status",
                flex: 1,
            },
            {
                field: "OrderAge",
                headerName: "Order Age",
                flex: 1,
            },
        ];

        const defaultrows = [];
        const urlparams = new URLSearchParams(window.location.search);
        const sparamval = urlparams.get("search");
        this.state = {
            location: "daily-items-delivered",
            title: "Daily Items Delivered",
            maintitle: "Custom Tools",
            global_msg: {
                type: "error",
                message: "",
            },
            perpage: 10,
            sortfield: "",
            sorting: "ASC",
            safeid: 0,
            CustomerEmail: "",
            sorticon: "",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 10,
            searchValue: sparamval,
        };
    }

    componentDidMount() {
        this.getData({ page: 1, perpage: this.state.perpage });
        this.getsearch_params();
    }

    getData = (data) => {
        axios.get("api/item-delivery-lists").then((response) => {
            let fullgriddata = [];
            response.data.lists.forEach(function (key) {
                let row_grid_data = {
                    id: key.Recorid,
                    OrderNumber: key.OrderNumber,
                    CustomerEmail: key.CustomerEmail,
                    ShipCountryCode: key.ShipCountryCode,
                    Carrier: key.Carrier,
                    RollupItemSKU: key.RollupItemSKU,
                    trackingnumber: key.trackingnumber,
                    Delivery_Status: key.Delivery_Status,
                    OrderAge: key.OrderAge,
                };
                fullgriddata.push(row_grid_data);
            });
            this.setState({ gridrows: fullgriddata });
        });
    };

    handleChangePerPage = (event) => {
        this.setState({ pagesize: event.target.value });
        this.getData({ page: 1 });
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
        this.getData({ page: 1, perpage: this.state.perpage });
        event.preventDefault();
    };

    getsearch_params = () => {
        const urlparams = new URLSearchParams(window.location.search);
        let searchparamval = urlparams.get("search");
        let searchState = {
            searchtext: searchparamval,
        };
        localStorage["searchState"] = JSON.stringify(searchState);
    };

    exportJsonData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(this.state.gridrows)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "data.json";

        link.click();
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
                                    ></Typography>
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
                                                    value={this.state.pagesize}
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
                                                <Button
                                                    variant="outlined"
                                                    onClick={
                                                        this.exportJsonData
                                                    }
                                                    className="filter_top_btn"
                                                >
                                                    Export JSON
                                                </Button>
                                            </Typography>
                                        </div>
                                        {this.state.global_msg.message !=
                                            "" && (
                                            <Alert
                                                style={{ marginBottom: "20px" }}
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
                                                rowsPerPageOptions={[10]}
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
                                                                        "CustomerEmail",
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
            </ThemeProvider>
        );
    }
}

export default ReportsDailyItemsDelivered;
