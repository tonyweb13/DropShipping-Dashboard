import React, { Component } from "react";
// import {Pagination} from 'react-laravel-paginex'
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
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
    Select,
    MenuItem,
    Button,
    Checkbox,
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
import LinearProgress, {
    linearProgressClasses,
} from "@mui/material/LinearProgress";
import CommonSection from "../Common/CommonSection";
import Title from "../Common/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import downloadicon from "../../../../../img/dl.png";
import printericon from "../../../../../img/printer_icon.png";
import uploadicon from "../../../../../img/upload_icon.png";
import settingsicon from "../../../../../img/settings_icon.png";
import { color } from "@mui/system";
import axios from "axios";
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

class InvoiceLists extends Component {
    constructor(props) {
        super(props);

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "invoicedate",
                headerName: "Date",
                flex: 1,
            },
            {
                field: "invoice",
                headerName: "Type",
                flex: 1,
            },
            {
                field: "invoicenum",
                headerName: "Invoice No.",
                flex: 1,
            },
            {
                field: "balance",
                headerName: "Balance",
                flex: 1,
                renderCell: (params) => {
                    return (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span className="currency-sign">$</span>
                            <span className="amount-text">
                                {params.row.balance}
                            </span>
                        </div>
                    );
                },
            },
            {
                field: "total",
                headerName: "Total",
                flex: 1,
                renderCell: (params) => {
                    return (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span className="currency-sign">$</span>
                            <span className="amount-text">
                                {params.row.total}
                            </span>
                        </div>
                    );
                },
            },
            {
                field: "statuscode",
                headerName: "Status",
                flex: 1,
                renderCell: (params) => {
                    return (
                        <span className={"status-" + params.row.statuscode}>
                            {params.row.status}
                        </span>
                    );
                },
            },
            { field: "status", headerName: "status", flex: 1, hide: true },
        ];

        const defaultrows = [];
        this.state = {
            location: "invoicing",
            title: "INVOICING",
            invoices: [],
            perdate: "",
            unpaidinvoices: {
                unpaid: 0,
                overdue: 0,
                overduepercentage: 0,
                open: 0,
                openpercentage: 0,
            },
            paidinvoices: {
                paid: 0,
                deposited: 0,
                depositpercentage: 0,
                undeposited: 0,
                undepositpercentage: 0,
            },
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 200,
        };
    }

    componentDidMount() {
        this.getData({ perdate: "" });
    }

    getData = (data) => {
        // axios.get('api/quickbooks-invoices?perdate='+ data.perdate).then(response => {
        //     this.setState({invoices:response.data.invoices});
        // });
        axios
            .get("api/quickbooks-invoices?perdate=" + data.perdate)
            .then((response) => {
                this.setState({ uploadurl: response.data.storageurl });
                let fullgriddata = [];
                let ctrgrid = 1;
                response.data.invoices.forEach(function (key) {
                    let row_grid_data = {
                        id: ctrgrid,
                        invoicedate: key.invoicedate,
                        invoice: "Invoice",
                        invoicenum: key.invoicenum,
                        balance: key.balance,
                        total: key.total,
                        statuscode: key.statuscode,
                        status: key.status,
                    };
                    fullgriddata.push(row_grid_data);
                    ctrgrid++;
                });

                this.setState({ gridrows: fullgriddata });
            });

        axios.get("api/quickbooks-account").then((response) => {
            this.setState({
                unpaidinvoices: {
                    unpaid: response.data.unpaidinvoices.unpaid,
                    overdue: response.data.unpaidinvoices.overdue,
                    overduepercentage:
                        response.data.unpaidinvoices.overduepercentage,
                    open: response.data.unpaidinvoices.open,
                    openpercentage: response.data.unpaidinvoices.openpercentage,
                },
                paidinvoices: {
                    paid: response.data.paidinvoices.paid,
                    deposited: response.data.paidinvoices.deposited,
                    depositpercentage:
                        response.data.paidinvoices.depositpercentage,
                    undeposited: response.data.paidinvoices.undeposited,
                    undepositpercentage:
                        response.data.paidinvoices.undepositpercentage,
                },
            });
        });
    };

    handleChangeFilter = (event) => {};

    handleChangeDate = (event) => {
        this.setState({ perdate: event.target.value });
        this.getData({ perdate: event.target.value });
    };

    render() {
        const mdTheme = createTheme();

        const BorderLinearProgressUnpaid = styled(LinearProgress)(
            ({ theme }) => ({
                height: 15,
                borderRadius: 5,
                [`&.${linearProgressClasses.colorPrimary}`]: {
                    backgroundColor:
                        theme.palette.grey[
                            theme.palette.mode === "light" ? 200 : 800
                        ],
                },
                [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor:
                        theme.palette.mode === "light" ? "#E97841" : "#F2F2F2",
                },
            })
        );

        const BorderLinearProgressPaid = styled(LinearProgress)(
            ({ theme }) => ({
                height: 15,
                borderRadius: 5,
                [`&.${linearProgressClasses.colorPrimary}`]: {
                    backgroundColor:
                        theme.palette.grey[
                            theme.palette.mode === "light" ? 200 : 800
                        ],
                },
                [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor:
                        theme.palette.mode === "light" ? "#507150" : "#F2F2F2",
                },
            })
        );

        return (
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />
                    <CommonSection
                        title={this.state.title}
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
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                        className="table_grid"
                                    >
                                        <Box sx={{ display: "flex" }}>
                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                    width: "49%",
                                                    marginRight: "1%",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                        color: "#1C1C1C",
                                                    }}
                                                    className="invoice_unpaid_cnt"
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                        style={{
                                                            lineHeight: "1rem",
                                                        }}
                                                    >
                                                        <strong
                                                            style={{
                                                                display:
                                                                    "block",
                                                            }}
                                                            className="unpaid_titles"
                                                        >
                                                            $
                                                            {
                                                                this.state
                                                                    .unpaidinvoices
                                                                    .overdue
                                                            }
                                                        </strong>
                                                        <span className="unpaid_spans">
                                                            Open Balance
                                                        </span>
                                                    </Typography>
                                                </div>
                                                <BorderLinearProgressUnpaid
                                                    className="invoice_progressbar"
                                                    variant="determinate"
                                                    value={
                                                        this.state
                                                            .unpaidinvoices
                                                            .overduepercentage
                                                    }
                                                />
                                            </div>
                                        </Box>
                                        <Title></Title>
                                        <div
                                            className="table_filter_options"
                                            style={{ margin: "20px 0px" }}
                                        >
                                            <Typography
                                                component="div"
                                                className="table_selection_area"
                                            >
                                                {/* <Select
                                    value={''}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className='table-filters filter_selects'
                                    IconComponent={KeyboardArrowDownIcon}
                                >
                                    <MenuItem value="">
                                        <em style={{ fontStyle: 'normal' }}>Filter</em>
                                    </MenuItem>
                                </Select> */}
                                                <Select
                                                    value={this.state.perdate}
                                                    onChange={
                                                        this.handleChangeDate
                                                    }
                                                    displayEmpty
                                                    inputProps={{
                                                        "aria-label":
                                                            "Without label",
                                                    }}
                                                    className="filter-graph-by filter_selects"
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
                                                            All time
                                                        </em>
                                                    </MenuItem>
                                                    <MenuItem value="thisweek">
                                                        This Week
                                                    </MenuItem>
                                                    <MenuItem value="thismonth">
                                                        This Month
                                                    </MenuItem>
                                                    <MenuItem value="last30days">
                                                        Last 30 Days
                                                    </MenuItem>
                                                    <MenuItem value="lastmonth">
                                                        Last month
                                                    </MenuItem>
                                                    <MenuItem value="thisquarter">
                                                        This quarter
                                                    </MenuItem>
                                                    <MenuItem value="lastquarter">
                                                        Last quarter
                                                    </MenuItem>
                                                </Select>
                                            </Typography>
                                        </div>
                                        {/* <Table size="small" className="table_data">
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Invoice NO.</TableCell>
                                <TableCell>Balance</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.state.invoices.length > 0 ? this.state.invoices.map((row) => (
                                <TableRow key={row.id}>
                                  <TableCell>{row.invoicedate}</TableCell>
                                  <TableCell>Invoice</TableCell>
                                  <TableCell>{row.invoicenum}</TableCell>
                                  <TableCell>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="currency-sign">$</span><span className="amount-text">{row.balance}</span></div>
                                  </TableCell>
                                  <TableCell><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="currency-sign">$</span><span className="amount-text">{row.total}</span></div></TableCell>
                                  <TableCell><span className={"status-"+row.statuscode}>{row.status}</span></TableCell>
                                </TableRow>
                              )) : 
                                <TableRow key={0}>
                                  <TableCell colSpan={7}>No matching invoices found.</TableCell>
                                </TableRow>
                            }
                            </TableBody>
                          </Table> */}
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
                                                experimentalFeatures={{
                                                    newEditingApi: true,
                                                }}
                                                initialState={{
                                                    pinnedColumns: {
                                                        left: [
                                                            "delivery_date",
                                                            "shipment_title",
                                                        ],
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

export default InvoiceLists;
