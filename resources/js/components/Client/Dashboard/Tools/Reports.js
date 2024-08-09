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

class Reports extends Component {
    constructor(props) {
        super(props);
        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "shipcountry",
                headerName: "Ship Country",
                hide: true,
                flex: 1,
            },
            {
                field: "sku",
                headerName: "SKU",
                hide: true,
                flex: 1,
            },
            {
                field: "shipments",
                headerName: "Shipments",
                flex: 1,
            },
            {
                field: "Resends",
                headerName: "Resends",
                flex: 1,
            },
        ];

        const deliverycolumns = [
            { field: "Recorid", headerName: "ID", flex: 1, hide: true },
            {
                field: "OrderNumber",
                headerName: "Order Number",
                flex: 1,
            },
            {
                field: "CustomerEmail",
                headerName: "Customer Email",
                hide: true,
                flex: 1,
            },
            {
                field: "ActualDeliveryDateEST",
                headerName: "Actual Delivery Date",
                flex: 1,
            },
            {
                field: "OrderDateEST",
                headerName: "Order Date",
                flex: 1,
            },
            {
                field: "ShipDateEST",
                headerName: "Ship Date",
                flex: 1,
            },
            {
                field: "ShipCountryCode",
                headerName: "ShipCountry Code",
                flex: 1,
            },
            {
                field: "Carrier",
                headerName: "Carrier",
                flex: 1,
            },
            {
                field: "RollupItemSKU",
                headerName: "Roll UP SKU",
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
        this.state = {
            location: "reports",
            title: "Reports",
            maintitle: "Custom Tools",
            global_msg: {
                type: "error",
                message: "",
            },
            perpage: 200,
            sortfield: "",
            sorting: "ASC",
            sorticon: "",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            defaultcolumns: defaultcolumns,
            deliverycolumns: deliverycolumns,
            pagesize: 200,
            reports: [],
            categories: [],
            category: 0,
            report: 0,
            startdate: "",
            enddate: "",
        };
    }

    componentDidMount() {
        this.getCategories();
        this.showGridColumn("shipcountry");
    }

    getData = (data) => {
        const report = data.report ? data.report : this.state.report;
        const startdate = data.startdate
            ? data.startdate
            : this.state.startdate;
        const enddate = data.enddate ? data.enddate : this.state.enddate;

        if (report == "delivery") {
            this.setState({ gridcolumns: this.state.deliverycolumns });
        } else {
            this.setState({ gridcolumns: this.state.defaultcolumns });
        }

        axios
            .get(
                "api/report-shipments?report=" +
                    report +
                    "&startdate=" +
                    startdate +
                    "&enddate=" +
                    enddate
            )
            .then((response) => {
                let fullgriddata = [];
                response.data.lists.forEach(function (key) {
                    let row_grid_data;
                    if (report == "delivery") {
                        row_grid_data = {
                            id: key.Recorid,
                            Recorid: key.Recorid,
                            OrderNumber: key.OrderNumber,
                            CustomerEmail: key.CustomerEmail,
                            OrderDateEST: key.OrderDateEST,
                            ShipDateEST: key.ShipDateEST,
                            ActualDeliveryDateEST: key.ActualDeliveryDateEST,
                            ShipCountryCode: key.ShipCountryCode,
                            Carrier: key.Carrier,
                            RollupItemSKU: key.RollupItemSKU,
                            trackingnumber: key.trackingnumber,
                            Delivery_Status: key.Delivery_Status,
                            OrderAge: key.OrderAge,
                        };
                    } else {
                        row_grid_data = {
                            id: key.ID,
                            sku: key.sku,
                            shipcountry: key.shipcountry,
                            shipments: key.shipments,
                            Resends: key.Resends,
                        };
                    }
                    fullgriddata.push(row_grid_data);
                });

                this.showGridColumn(report);
                this.setState({
                    gridrows: fullgriddata,
                    startdate: startdate,
                    enddate: enddate,
                    report: report,
                });
            });
    };

    getReports = (data) => {
        axios.get("api/reports?category=" + data.category).then((response) => {
            this.setState({
                category: data.category,
                reports: response.data.reports,
                gridrows: [],
            });
        });
    };

    getCategories = () => {
        axios.get("api/report-categories").then((response) => {
            this.setState({ categories: response.data.categories });
        });
    };

    handleChangePerPage = (event) => {
        this.setState({ pagesize: event.target.value });
        this.getData({});
    };

    handleChangeCategory = (event) => {
        let value = event.target.value;
        this.getReports({ category: value });
    };

    handleChangeReport = (event) => {
        let value = event.target.value;
        this.getData({ report: value });
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

        this.getData({ startdate: fdate });
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

        this.getData({ enddate: fdate });
    };

    showGridColumn(field) {
        let actualField = field == "sku" ? "sku" : "shipcountry";
        const cfields = this.state.gridcolumns.map((column) => {
            if (column.field === actualField) {
                return { ...column, hide: false };
            } else {
                if (column.field == "sku" || column.field == "shipcountry") {
                    return { ...column, hide: true };
                } else {
                    return column;
                }
            }
        });

        this.setState({ gridcolumns: cfields });
    }

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
                                            <Typography component="div">
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
                                                    <MenuItem value={200}>
                                                        Show 200
                                                    </MenuItem>
                                                    <MenuItem value={500}>
                                                        Show 500
                                                    </MenuItem>
                                                </Select>
                                                <Select
                                                    value={this.state.category}
                                                    inputProps={{
                                                        "aria-label":
                                                            "Without label",
                                                    }}
                                                    className="table-filters filter_selects"
                                                    onChange={
                                                        this
                                                            .handleChangeCategory
                                                    }
                                                >
                                                    <MenuItem key={0} value="0">
                                                        <em
                                                            style={{
                                                                fontStyle:
                                                                    "normal",
                                                            }}
                                                        >
                                                            Select Category
                                                        </em>
                                                    </MenuItem>
                                                    {this.state.categories.map(
                                                        (row, i) => (
                                                            <MenuItem
                                                                key={
                                                                    row.ReportCategoryID
                                                                }
                                                                value={
                                                                    row.ReportCategoryID
                                                                }
                                                            >
                                                                {
                                                                    row.ReportCategoryName
                                                                }
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                                <Select
                                                    value={this.state.report}
                                                    inputProps={{
                                                        "aria-label":
                                                            "Without label",
                                                    }}
                                                    className="table-filters filter_selects"
                                                    onChange={
                                                        this.handleChangeReport
                                                    }
                                                >
                                                    <MenuItem key={0} value="0">
                                                        <em
                                                            style={{
                                                                fontStyle:
                                                                    "normal",
                                                            }}
                                                        >
                                                            Select Report
                                                        </em>
                                                    </MenuItem>
                                                    {this.state.reports.map(
                                                        (row, i) => (
                                                            <MenuItem
                                                                key={
                                                                    row.ReportID
                                                                }
                                                                value={
                                                                    row.ReportKeyWords
                                                                }
                                                            >
                                                                {row.ReportName}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                >
                                                    <DesktopDatePicker
                                                        label="Start Date"
                                                        inputFormat="YYYY-MM-DD"
                                                        value={
                                                            this.state.startdate
                                                        }
                                                        onChange={
                                                            this
                                                                .handleStartDateChange
                                                        }
                                                        className="table-filters filter_selects date-picker-field"
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                            />
                                                        )}
                                                    />
                                                    <DesktopDatePicker
                                                        label="End Date"
                                                        inputFormat="YYYY-MM-DD"
                                                        value={
                                                            this.state.enddate
                                                        }
                                                        onChange={
                                                            this
                                                                .handleEndDateChange
                                                        }
                                                        className="table-filters filter_selects date-picker-field"
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
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
            </ThemeProvider>
        );
    }
}

export default Reports;
