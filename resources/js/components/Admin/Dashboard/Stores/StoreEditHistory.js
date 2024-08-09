import React, { Component } from "react";
import { Pagination } from "react-laravel-paginex";
import {
    AppBar,
    Divider,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Typography,
    IconButton,
    Button,
    Box,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Slide,
    Dialog,
    Toolbar,
    Alert,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Title from "../Common/Title";
import helpIcon from "../../../../../img/helpIcon.png";
import plus_icon from "../../../../../img/plus_icon.png";
import edit_icon from "../../../../../img/edit_icon_new.png";
import trash_icon from "../../../../../img/trash_icon.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import moment from "moment";
import {
    DataGridPremium,
    GridToolbar,
    GridActionsCellItem,
} from "@mui/x-data-grid-premium";

class StoreEditHistory extends Component {
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
                headerName: "Reason",
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
            {
                field: "actions",
                type: "actions",
                headerName: "Action",
                renderCell: (params) => {
                    return (
                        <div>
                            <Button
                                variant="outlined"
                                onClick={this.handleApprovedOrder.bind(
                                    this,
                                    params.row.OrderNumber
                                )}
                                className="archive_btn_table"
                            >
                                Approve
                            </Button>
                        </div>
                    );
                },
                width: 325,
            },
        ];

        const defaultrows = [];

        this.state = {
            title: props.Title,
            global_msg: {
                type: "error",
                message: "",
            },
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 10,
            stores: [],
            country: "UK",
            store: 0,
        };
    }

    componentDidMount() {
        this.getStores(this.state.country);
    }

    getData = (data) => {
        this.country =
            data.country !== undefined ? data.country : this.state.country;
        this.store = data.store !== undefined ? data.store : this.state.store;

        axios
            .get(
                "api/editedadminhistory?store=" +
                    this.store +
                    "&country=" +
                    this.country
            )
            .then((response) => {
                let fullgriddata = [];
                response.data.orders.forEach(function (key) {
                    let row_grid_data = {
                        id: key.id,
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
                });
                this.setState({
                    gridrows: fullgriddata,
                    country: this.country,
                    store: this.store,
                });
            });
    };

    getStores = (country) => {
        axios.get("api/countrystores?country=" + country).then((response) => {
            this.setState({
                store: 0,
                country: country,
                stores: response.data.stores,
                global_msg: { message: "" },
            });
        });
    };

    handleChangeCountry = (e) => {
        let country = e.target.value;
        this.getStores(country);
    };

    handleChangeStore = (e) => {
        let store = e.target.value;
        this.getData({ store: store });
    };

    handleApprovedOrder = (OrderNumber) => {
        axios
            .get("api/approvedorder?orderNumber=" + OrderNumber)
            .then((response) => {
                this.getData({
                    store: this.state.store,
                    country: this.state.country,
                });
                this.setState({
                    stores: this.state.stores,
                    global_msg: {
                        type: "success",
                        message: "Note added successfully!",
                    },
                });
            });
    };

    render() {
        const fullWidth = true;
        const maxWidth = "md";

        const countries = ["US", "UK"];

        return (
            <React.Fragment>
                <Typography
                    component="div"
                    className="pagedescription"
                    display={this.state.showdesc}
                >
                    <div className="admin_desc_info">
                        <span>Filter By: &nbsp; </span>
                        <Select
                            label="Country"
                            value={this.state.country}
                            inputProps={{ "aria-label": "Without label" }}
                            className="table-filters filter_selects"
                            onChange={this.handleChangeCountry}
                            style={{ marginRight: "20px" }}
                        >
                            {countries.map((row) => (
                                <MenuItem key={row.toString()} value={row}>
                                    {row}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            label="Store"
                            value={this.state.store}
                            inputProps={{ "aria-label": "Without label" }}
                            className="table-filters filter_selects"
                            onChange={this.handleChangeStore}
                        >
                            <MenuItem key={0} value="0">
                                <em style={{ fontStyle: "normal" }}>
                                    Select Store
                                </em>
                            </MenuItem>
                            {this.state.stores.map((row) => (
                                <MenuItem key={row.toString()} value={row.id}>
                                    {row.store_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </Typography>

                {this.state.global_msg.message != "" && (
                    <Alert
                        style={{ marginBottom: "20px" }}
                        severity={this.state.global_msg.type}
                    >
                        {this.state.global_msg.message}
                    </Alert>
                )}
                <Box className="data_grid_container">
                    <DataGridPremium
                        rows={this.state.gridrows}
                        columns={this.state.gridcolumns}
                        pageSize={this.state.pagesize}
                        rowsPerPageOptions={[20]}
                        pagination
                        disableSelectionOnClick
                        components={{ Toolbar: GridToolbar }}
                        componentsProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                    <div className="datagrid_pagination_bg"></div>
                </Box>
            </React.Fragment>
        );
    }
}

export default StoreEditHistory;
