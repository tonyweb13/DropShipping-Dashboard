import React, { Component } from "react";
import { Pagination } from "react-laravel-paginex";
import ImageUploading from "react-images-uploading";
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
    Select,
    MenuItem,
    Checkbox,
    Paper,
    FormControl,
    InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Title from "../Common/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import downloadicon from "../../../../../img/dl.png";
import printericon from "../../../../../img/printer_icon.png";
import uploadicon from "../../../../../img/upload_icon.png";
import settingsicon from "../../../../../img/settings_icon.png";
import calendaricon from "../../../../../img/calendar_icon.png";
import arrowlefticon from "../../../../../img/arrow_left_icon.png";
import arrowrighticon from "../../../../../img/arrow_right_icon.png";
import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";

class InventoryQuantityAvailableList extends Component {
    constructor(props) {
        super(props);
        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "inventory_date",
                headerName: "Inventory Date",
                flex: 1,
            },
            {
                field: "itemsku",
                headerName: "SKU",
                flex: 1,
            },
            {
                field: "itemname",
                headerName: "Product Alias",
                flex: 1,
            },
            {
                field: "qty_tosell",
                headerName: "QTY to Sell",
                type: "number",
                flex: 1,
                headerAlign: "left",
                align: "left",
            },
        ];

        const defaultrows = [];
        this.state = {
            title: props.Title,
            date: "",
            datefilter: "",
            dateweekfilter: "",
            store: 0,
            global_msg: {
                type: "error",
                message: "",
            },
            form_message: "",
            openModal: false,
            editModal: false,
            deleteModal: false,
            formSubmitting: false,
            images: "",
            imageList: "",
            perpage: 10,
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 10,
        };
    }

    componentDidMount() {
        const today = new Date();
        const dateformat = this.state.date !== "" ? this.state.date : today;
        const date = new Date(dateformat);
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            this.setState({
                store: AppState.store,
                datefilter: today.toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
                dateweekfilter: today.toLocaleDateString("en-us", {
                    weekday: "long",
                }),
            });
        }
        this.getData({ page: 1, perpage: this.state.perpage });
    }

    getData = (data) => {
        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        axios.get("api/productinventorylist").then((response) => {
            let fullgriddata = [];
            let ctrgrid = 1;
            response.data.inventory.forEach(function (key) {
                let row_grid_data = {
                    id: ctrgrid,
                    inventory_date: key.inventory_date,
                    itemname: key.item_name,
                    itemsku: key.sku,
                    qty_tosell: key.qty_tosell,
                };
                fullgriddata.push(row_grid_data);
                ctrgrid++;
            });
            this.setState({ gridrows: fullgriddata });
        });
    };

    handleChangePerPage = (event) => {
        const date = new Date(this.state.date);
        this.setState({
            perpage: event.target.value,
            pagesize: event.target.value,
        });
        this.getData({ page: 1, perpage: event.target.value, date: date });
    };

    render() {
        const fullWidth = true;
        const maxWidth = "md";

        return (
            <React.Fragment>
                <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                    className="table_grid"
                >
                    <Typography component="h2" className="subpage_title">
                        {this.state.title}
                    </Typography>
                    <div className="table_filter_options inventory_filters prodfilters">
                        <Typography
                            component="div"
                            className="table_selection_area"
                        >
                            <Select
                                value={this.state.perpage}
                                onChange={this.handleChangePerPage}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                className="table-filters filter_selects"
                                IconComponent={KeyboardArrowDownIcon}
                            >
                                <MenuItem value="10">
                                    <em style={{ fontStyle: "normal" }}>
                                        Show 10
                                    </em>
                                </MenuItem>
                                <MenuItem value={20}>Show 20</MenuItem>
                                <MenuItem value={50}>Show 50</MenuItem>
                                <MenuItem value={75}>Show 75</MenuItem>
                                <MenuItem value={100}>Show 100</MenuItem>
                            </Select>
                        </Typography>
                    </div>
                    <Box className="data_grid_container">
                        <DataGridPremium
                            rows={this.state.gridrows}
                            columns={this.state.gridcolumns}
                            pageSize={this.state.pagesize}
                            rowsPerPageOptions={[5]}
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
                </Paper>
            </React.Fragment>
        );
    }
}

export default InventoryQuantityAvailableList;
