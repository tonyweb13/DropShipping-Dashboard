import React, { Component } from "react";
// import { Pagination } from "react-laravel-paginex";
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
import { end } from "@popperjs/core";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

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

class InventoryMasterList extends Component {
    constructor(props) {
        super(props);
        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "sku",
                headerName: "SKU",
                flex: 1,
                renderCell: (params) => {
                    return (
                        <div
                            className="prod_title_link"
                            onClick={this.handleShowProductDetails.bind(
                                this,
                                params.row.sku
                            )}
                        >
                            {params.row.sku}
                        </div>
                    );
                },
            },
            {
                field: "itemname",
                headerName: "Item Title",
                flex: 1,
            },
            {
                field: "AliasSKU1",
                headerName: "Alias SKU 1",
                flex: 1,
            },
            {
                field: "AliasSKU2",
                headerName: "Alias SKU 2",
                flex: 1,
            },
            {
                field: "qtyonhand",
                headerName: "Qty on Hand",
                flex: 1,
                renderCell: (params) => {
                    let qtyonhand = params.row.qtyonhand;
                    if (qtyonhand == null) {
                        qtyonhand = 0;
                    }

                    if (qtyonhand <= 50) {
                        return (
                            <div className="text-danger">
                                {qtyonhand.toLocaleString()}
                            </div>
                        );
                    } else if (qtyonhand > 50 && qtyonhand <= 100) {
                        return (
                            <div className="text-warning">
                                {qtyonhand.toLocaleString()}
                            </div>
                        );
                    } else if (qtyonhand > 100 && qtyonhand <= 300) {
                        return (
                            <div className="text-primary">
                                {qtyonhand.toLocaleString()}
                            </div>
                        );
                    } else {
                        return (
                            <div className="text-success">
                                {qtyonhand.toLocaleString()}
                            </div>
                        );
                    }
                },
            },
            {
                field: "qtyallocated",
                headerName: "Qty Allocated",
                flex: 1,
                renderCell: (params) => {
                    let qtyallocated = params.row.qtyallocated;
                    if (qtyallocated == null) {
                        qtyallocated = 0;
                    }

                    return (
                        <div className="text-danger">
                            {qtyallocated.toLocaleString()}
                        </div>
                    );
                },
            },
            {
                field: "qtytosell",
                headerName: "Qty to Sell",
                flex: 1,
                renderCell: (params) => {
                    let qtytosell = params.row.qtytosell;
                    if (qtytosell == null) {
                        qtytosell = 0;
                    }

                    if (qtytosell <= 50) {
                        return (
                            <div className="text-danger">
                                {qtytosell.toLocaleString()}
                            </div>
                        );
                    } else if (qtytosell > 50 && qtytosell <= 100) {
                        return (
                            <div className="text-warning">
                                {qtytosell.toLocaleString()}
                            </div>
                        );
                    } else if (qtytosell > 100 && qtytosell <= 300) {
                        return (
                            <div className="text-primary">
                                {qtytosell.toLocaleString()}
                            </div>
                        );
                    } else {
                        return (
                            <div className="text-success">
                                {qtytosell.toLocaleString()}
                            </div>
                        );
                    }
                },
            },
            {
                field: "Qty_Pending",
                headerName: "Qty Pending",
                flex: 1,
            },
        ];

        const defaultrows = [];
        const urlparams = new URLSearchParams(window.location.search);
        const sparamval = urlparams.get("search");
        this.state = {
            title: props.Title,
            date: "",
            datefilter: "",
            dateweekfilter: "",
            products: [],
            data: [],
            store: 0,
            perpage: 200,
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 200,
            datetimesync: "",
            isBundleAllowed: 0,
            searchValue: sparamval,
            openModalProduct: false,
            prodSKU: "",
            filterBundle: "N",
            inventoryDetails: {
                prodtitle: "",
                prodsku: "",
                prodcountry: "",
                prodweight: "",
                prodlength: "",
                prodheight: "",
                prodwidth: "",
                AliasSKU1: "",
                AliasSKU2: "",
                AliasSKU3: "",
                AliasSKU4: "",
                AliasSKU5: "",
            },
            isInchesAndPounds: true,
            accessLevel: 0,
        };

        this.handleShowProductDetails =
            this.handleShowProductDetails.bind(this);
    }

    handleChangeFilterBundle = (event) => {
        const date = new Date(this.state.date);
        this.setState({ filterBundle: event.target.value }, () => {
            this.getData({
                page: 1,
                perpage: event.target.value,
                date: date,
                filterBundle: event.target.value,
            });
        });
    };

    componentDidMount() {
        let accessUserLevel = parseInt(localStorage["accessUserLevel"]);
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
        this.getData({ page: 1, perpage: this.state.perpage, date: date });
        this.getsearch_params();

        // disable action is access level is 1.
        this.setState({ accessLevel: accessUserLevel });
    }

    getData = (data) => {
        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        const bundleStatus = data?.filterBundle
            ? data?.filterBundle
            : this.state.filterBundle;
        if (window.location.search.substr(1) == "qtyAllocatedList") {
            axios
                .get(
                    "api/getInventoryAllocatedNotification?" +
                        "bundleStatus=" +
                        bundleStatus
                )
                .then((response) => {
                    let fullgriddata = [];
                    let ctrgrid = 1;
                    response.data.inventory.forEach(function (key) {
                        let row_grid_data = {
                            id: key.ID,
                            inventory_date: key.inventory_date,
                            itemname: key.item_name,
                            sku: key.sku,
                            aliassku: key.aliassku,
                            aliassku2: key.aliassku2,
                            AliasSKU1: key.AliasSKU1,
                            AliasSKU2: key.AliasSKU2,
                            AliasSKU3: key.AliasSKU3,
                            AliasSKU4: key.AliasSKU4,
                            AliasSKU5: key.AliasSKU5,
                            qtyonhand: key.qtyonhand,
                            qtyallocated: key.qtyallocated,
                            qtytosell: key.qtytosell,
                            cumm_shipment: key.cumm_shipment,
                            datemanualcount: key.datemanualcount,
                            manualcount: key.manualcount,
                        };
                        fullgriddata.push(row_grid_data);
                        ctrgrid++;
                    });
                    this.setState({
                        gridrows: fullgriddata,
                        datetimesync: response.data.syncdatetime,
                        isBundleAllowed: response.data.isBundleAllowed,
                    });
                });
        } else {
            axios
                .get(
                    "api/masterinventorylists?" + "bundleStatus=" + bundleStatus
                )
                .then((response) => {
                    let fullgriddata = [];
                    let ctrgrid = 1;
                    response.data.inventory.forEach(function (key) {
                        let row_grid_data = {
                            id: key.ID,
                            inventory_date: key.inventory_date,
                            itemname: key.item_name,
                            sku: key.sku,
                            aliassku: key.aliassku,
                            aliassku2: key.aliassku2,
                            AliasSKU1: key.AliasSKU1,
                            AliasSKU2: key.AliasSKU2,
                            AliasSKU3: key.AliasSKU3,
                            AliasSKU4: key.AliasSKU4,
                            AliasSKU5: key.AliasSKU5,
                            qtyonhand: key.qtyonhand,
                            qtyallocated: key.qtyallocated,
                            qtytosell: key.qtytosell,
                            cumm_shipment: key.cumm_shipment,
                            datemanualcount: key.datemanualcount,
                            manualcount: key.manualcount,
                            Qty_Pending: key.Qty_Pending,
                        };
                        fullgriddata.push(row_grid_data);
                        ctrgrid++;
                    });
                    this.setState({
                        gridrows: fullgriddata,
                        datetimesync: response.data.syncdatetime,
                        isBundleAllowed: response.data.isBundleAllowed,
                    });
                });
        }
    };

    handleChangePerPage = (event) => {
        const date = new Date(this.state.date);
        this.setState({
            perpage: event.target.value,
            pagesize: event.target.value,
        });
        this.getData({ page: 1, perpage: event.target.value, date: date });
    };
    getsearch_params = () => {
        const urlparams = new URLSearchParams(window.location.search);
        let searchparamval = urlparams.get("search");
        let searchState = {
            searchtext: searchparamval,
        };
        localStorage["searchState"] = JSON.stringify(searchState);
    };

    handleShowProductDetails = (skuvalue) => {
        // this.setState({ openModalProduct:true });
        let proddetails = {};
        axios
            .get("api/getProductBySKU?prodsku=" + skuvalue)
            .then((response) => {
                response.data.productDetails.forEach(function (key) {
                    console.log(response);
                    proddetails = {
                        ptitle: key.ProductName,
                        psku: skuvalue,
                        pcountry: key.CountryOfOrigin,
                        pweight: key.Weight,
                        plength: key.Length,
                        pheight: key.Height,
                        pwidth: key.Width,
                        AliasSKU1: key.AliasSKU1,
                        AliasSKU2: key.AliasSKU2,
                        AliasSKU3: key.AliasSKU3,
                        AliasSKU4: key.AliasSKU4,
                        AliasSKU5: key.AliasSKU5,
                    };
                });

                this.setState({
                    openModalProduct: true,
                    inventoryDetails: {
                        prodtitle: proddetails.ptitle,
                        prodsku: skuvalue,
                        prodcountry: proddetails.pcountry,
                        prodweight: proddetails.pweight,
                        prodlength: proddetails.plength,
                        prodheight: proddetails.pheight,
                        prodwidth: proddetails.pwidth,
                        AliasSKU1: proddetails.AliasSKU1,
                        AliasSKU2: proddetails.AliasSKU2,
                        AliasSKU3: proddetails.AliasSKU3,
                        AliasSKU4: proddetails.AliasSKU4,
                        AliasSKU5: proddetails.AliasSKU5,
                    },
                });
                console.log(proddetails.ptitle);
            });
    };
    handleCloseModal = () => {
        this.setState({ openModalProduct: false });
    };

    handleConvertInchensAndPoundsToCMandGrams = (isInchesAndPounds) => {
        this.setState({ isInchesAndPounds: isInchesAndPounds });
    };

    render() {
        const fullWidth = true;
        const maxWidth = "md";
        const modalContainerProduct = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModalProduct}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box id="inventoryForm" component={"form"}>
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
                    <DialogContent className="proddetail_contents">
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Product Details
                        </Typography>
                        <div style={{ float: "right" }}>
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="p"
                                style={{
                                    margin: 0,
                                    fontSize: "12px",
                                    textTransform: "uppercase",
                                    fontFamily: "Manrope",
                                    fontWeight: "600",
                                }}
                            >
                                Metric
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={
                                            !this.state.isInchesAndPounds
                                        }
                                        onChange={this.handleConvertInchensAndPoundsToCMandGrams.bind(
                                            this,
                                            !this.state.isInchesAndPounds
                                        )}
                                    />
                                }
                                style={{ margin: 0 }}
                            />
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="p"
                                style={{
                                    margin: 0,
                                    fontSize: "12px",
                                    textTransform: "uppercase",
                                    fontFamily: "Manrope",
                                    fontWeight: "600",
                                }}
                            >
                                Imperial
                            </Typography>
                        </div>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="ProductAlias"
                            name="ProductAlias"
                            label="Product Title"
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            defaultValue={this.state.inventoryDetails.prodtitle}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productsku"
                            name="productsku"
                            label="SKU"
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            defaultValue={this.state.inventoryDetails.prodsku}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productsku"
                            name="productsku"
                            label="Alias SKU 1"
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            defaultValue={this.state.inventoryDetails.AliasSKU1}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productsku"
                            name="productsku"
                            label="Alias SKU 2"
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            defaultValue={this.state.inventoryDetails.AliasSKU2}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productsku"
                            name="productsku"
                            label="Alias SKU 3"
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            defaultValue={this.state.inventoryDetails.AliasSKU3}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productsku"
                            name="productsku"
                            label="Alias SKU 4"
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            defaultValue={this.state.inventoryDetails.AliasSKU4}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productsku"
                            name="productsku"
                            label="Alias SKU 5"
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            defaultValue={this.state.inventoryDetails.AliasSKU5}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productCountryOfOrigin"
                            name="productCountryOfOrigin"
                            label="Country Of Origin"
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            defaultValue={
                                this.state.inventoryDetails.prodcountry
                            }
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productWeight"
                            name="productWeight"
                            label={`Weight${
                                this.state.isInchesAndPounds
                                    ? this.state.inventoryDetails.prodweight < 1
                                        ? " (oz)"
                                        : this.state.inventoryDetails
                                              .prodweight > 1
                                        ? " (lbs)"
                                        : " (lb)"
                                    : " (gm)"
                            }`}
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            value={
                                this.state.isInchesAndPounds
                                    ? this.state.inventoryDetails.prodweight >=
                                      1
                                        ? this.state.inventoryDetails.prodweight
                                        : parseFloat(
                                              this.state.inventoryDetails
                                                  .prodweight
                                          ) * 16
                                    : (
                                          parseFloat(
                                              this.state.inventoryDetails
                                                  .prodweight
                                          ) * 453.59237
                                      ).toFixed(1)
                            }
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productLength"
                            name="productLength"
                            label={`Length${
                                this.state.isInchesAndPounds ? " (in)" : " (cm)"
                            }`}
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            value={
                                this.state.isInchesAndPounds
                                    ? this.state.inventoryDetails.prodlength
                                    : (
                                          parseFloat(
                                              this.state.inventoryDetails
                                                  .prodlength
                                          ) * 2.54
                                      ).toFixed(1)
                            }
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productHeight"
                            name="productHeight"
                            label={`Height${
                                this.state.isInchesAndPounds ? " (in)" : " (cm)"
                            }`}
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            value={
                                this.state.isInchesAndPounds
                                    ? this.state.inventoryDetails.prodheight
                                    : (
                                          parseFloat(
                                              this.state.inventoryDetails
                                                  .prodheight
                                          ) * 2.54
                                      ).toFixed(1)
                            }
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="productWidth"
                            name="productWidth"
                            label={`Width${
                                this.state.isInchesAndPounds ? " (in)" : " (cm)"
                            }`}
                            fullWidth
                            rows={4}
                            variant="standard"
                            disabled
                            value={
                                this.state.isInchesAndPounds
                                    ? this.state.inventoryDetails.prodwidth
                                    : (
                                          parseFloat(
                                              this.state.inventoryDetails
                                                  .prodwidth
                                          ) * 2.54
                                      ).toFixed(1)
                            }
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
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );

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
                                <MenuItem value={200}>Show 200</MenuItem>
                                <MenuItem value={500}>Show 500</MenuItem>
                            </Select>
                            {this.state.isBundleAllowed > 0 ? (
                                <Select
                                    value={this.state.filterBundle}
                                    displayEmpty
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
                                    onChange={(e) => {
                                        this.handleChangeFilterBundle(e);
                                    }}
                                    className="mx-1 table-filters filter_selects"
                                    IconComponent={KeyboardArrowDownIcon}
                                >
                                    <MenuItem key={"1"} value={"N"}>
                                        {"Non Bundle"}
                                    </MenuItem>
                                    <MenuItem key={"2"} value={"Y"}>
                                        {"Bundle"}
                                    </MenuItem>
                                    <MenuItem key={"3"} value={"Both"}>
                                        {"Both"}
                                    </MenuItem>
                                </Select>
                            ) : null}
                        </Typography>
                    </div>
                    <Box className="data_grid_container">
                        <DataGridPremium
                            rows={this.state.gridrows}
                            columns={this.state.gridcolumns}
                            disableColumnSelector={true}
                            disableDensitySelector={true}
                            pageSize={this.state.pagesize}
                            rowsPerPageOptions={[5]}
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
                            experimentalFeatures={{ newEditingApi: true }}
                            initialState={{
                                filter: {
                                    filterModel: {
                                        items: [
                                            {
                                                id: 1,
                                                columnField: "sku",
                                                operatorValue: "contains",
                                                value: this.state.searchValue,
                                            },
                                            {
                                                id: 2,
                                                columnField: "itemname",
                                                operatorValue: "contains",
                                                value: this.state.searchValue,
                                            },
                                        ],
                                        linkOperator: GridLinkOperator.Or,
                                    },
                                },
                            }}
                        />
                        <div className="datagrid_pagination_bg"></div>
                    </Box>
                </Paper>
                {modalContainerProduct}
            </React.Fragment>
        );
    }
}

export default InventoryMasterList;
