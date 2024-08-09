import React, { Component } from "react";
// import {Pagination} from 'react-laravel-paginex'
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
    OutlinedInput,
    Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CloseCircleIcon from "@mui/icons-material/HighlightOff";
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

class InventoryLists extends Component {
    constructor(props) {
        super(props);
        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "itemname",
                headerName: "Item Title",
                flex: 1,
            },
            {
                field: "sku",
                headerName: "SKU",
                flex: 1,
            },
            {
                field: "action",
                headerName: "Action",
                flex: 1,
                renderCell: (params) => {
                    if (params.row.status == "Pending") {
                        return (
                            <div>
                                {" "}
                                <Button
                                    variant="outlined"
                                    onClick={this.handleChangeProductStatus.bind(
                                        this,
                                        params.row.sku,
                                        "Approved"
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20"
                                >
                                    Approve
                                </Button>{" "}
                                &nbsp;{" "}
                                <Button
                                    variant="outlined"
                                    onClick={this.handleShowEditBundle.bind(
                                        this,
                                        params.row.sku
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20"
                                >
                                    Edit
                                </Button>{" "}
                                &nbsp;{" "}
                                <Button
                                    variant="outlined"
                                    onClick={this.handleDeleteProductBundle.bind(
                                        this,
                                        params.row.sku
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20"
                                >
                                    Delete
                                </Button>{" "}
                            </div>
                        );
                    } else {
                        return "";
                    }
                },
            },
        ];

        const defaultrows = [];
        const urlparams = new URLSearchParams(window.location.search);
        const sparamval = urlparams.get("search");
        this.state = {
            title: props.Title,
            producttype: props.Type,
            stocktype: props.stocktype,
            date: "",
            datefilter: "",
            dateweekfilter: "",
            products: [],
            data: [],
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
            perpage: 200,
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 200,
            datetimesync: "",
            searchValue: sparamval,
            product_new_bundle: {
                editsku: "",
                skus: [],
                bundle_sku: "",
                quantity: 0,
                name: "",
                location: "",
                weight: "",
                length: "",
                height: "",
                width: "",
                alias: "",
                origin: "",
                alias_sku: "",
            },
            productoptions: [],
            hideAction: false,
            showbtntext: "Pending Bundles",
            role: "",
            showaddproductbtn: "inline-block",
            listofskus: [],
        };

        this.handleAddBundlesSubmit = this.handleAddBundlesSubmit.bind(this);
        this.handleEditBundlesSubmit = this.handleEditBundlesSubmit.bind(this);
    }

    componentDidMount() {
        const today = new Date();
        const dateformat = this.state.date !== "" ? this.state.date : today;
        const date = new Date(dateformat);
        let state = localStorage["appState"];
        let menustate = localStorage["menuState"];
        if (state) {
            let AppState = JSON.parse(state);
            let MenuAppState = JSON.parse(menustate);
            let productbtnstatus =
                MenuAppState.member_menu.add_bundle_button == 1
                    ? "inline-block"
                    : "none";

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
                showaddproductbtn: productbtnstatus,
                role: AppState.role,
            });
        }
        this.getData({ page: 1, perpage: this.state.perpage, date: date });
        this.getsearch_params();
    }

    getData = (data) => {
        const stocktype = this.state.stocktype;

        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        this.showpending =
            data.show_pending !== undefined ? data.show_pending : "";
        axios
            .get(
                "api/productslist?producttype=bundle&show_pending=" +
                    this.showpending
            )
            .then((response) => {
                let fullgriddata = [];
                let ctrgrid = 1;
                response.data.products.forEach(function (key) {
                    let row_grid_data = {
                        id: key.ProductVariantID,
                        itemname: key.ProductAlias,
                        sku: key.SKU,
                        location: key.Location,
                        origin: key.CountryOfOrigin,
                        length: key.Length,
                        height: key.Height,
                        weight: key.Weight,
                        width: key.Width,
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

    handleShowForm = (event) => {
        axios.get("api/productslist").then((response) => {
            this.setState({
                openModal: true,
                productoptions: response.data.products,
                global_msg: { message: "" },
                product_new_bundle: {
                    skus: [],
                    bundle_sku: "",
                    quantity: 0,
                    name: "",
                    location: "",
                    weight: "",
                    length: "",
                    height: "",
                    width: "",
                    alias: "",
                    origin: "",
                    alias_sku: "",
                },
            });
            this.createNewElementSku("list-of-skus");
        });
    };

    handleShowEditBundle = (sku) => {
        axios.get("api/productslist?edit=" + sku).then((response) => {
            this.setState({
                editModal: true,
                productoptions: response.data.products,
                global_msg: { message: "" },
                product_new_bundle: {
                    editsku: response.data.product.bundle_sku,
                    skus: response.data.product.skus,
                    bundle_sku: response.data.product.bundle_sku,
                    quantity: response.data.product.quantity,
                    name: response.data.product.name,
                    location: response.data.product.location,
                    weight: response.data.product.weight,
                    length: response.data.product.length,
                    height: response.data.product.height,
                    width: response.data.product.width,
                    alias: response.data.product.alias,
                    origin: response.data.product.origin,
                    alias_sku: response.data.product.alias_sku,
                },
            });
            this.createNewElementEditedSku(
                "list-of-edited-skus",
                response.data.product.skus
            );
        });
    };

    handleDeleteProductBundle = (sku) => {
        if (confirm("Sure to delete?")) {
            axios.post("api/deletebundle", { sku: sku }).then((response) => {
                this.getData({
                    perpage: this.state.perpage,
                    show_pending: "yes",
                });
            });
        }
    };

    handleCloseModal = () => {
        this.setState({
            editModal: false,
            openModal: false,
            global_msg: { message: "" },
            listofskus: [],
        });
    };

    handleAddBundlesSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });

        const skus = document.getElementsByName("sku[]");
        const quantities = document.getElementsByName("qty[]");
        let productitems = "";
        if (skus.length > 0) {
            let sku_list = [];
            for (var i = 0; i < skus.length; i++) {
                if (skus[i].value != "") {
                    sku_list[i] = {
                        sku: skus[i].value,
                        qty: quantities[i].value,
                    };
                }
            }
            if (sku_list.length > 0) {
                productitems = JSON.stringify(sku_list);
            }
        }

        const productData = new FormData();
        productData.append("skus", productitems);
        productData.append(
            "bundle_sku",
            this.state.product_new_bundle.bundle_sku
        );
        productData.append("quantity", this.state.product_new_bundle.quantity);
        productData.append("name", this.state.product_new_bundle.name);
        productData.append("location", this.state.product_new_bundle.location);
        productData.append("weight", this.state.product_new_bundle.weight);
        productData.append("length", this.state.product_new_bundle.length);
        productData.append("height", this.state.product_new_bundle.height);
        productData.append("width", this.state.product_new_bundle.width);
        productData.append("alias", this.state.product_new_bundle.alias);
        productData.append("origin", this.state.product_new_bundle.origin);
        productData.append(
            "alias_sku",
            this.state.product_new_bundle.alias_sku
        );

        axios
            .post("api/add-bundle-item", productData)
            .then((response) => {
                this.setState({
                    openModal: false,
                    global_msg: {
                        type: "success",
                        message: "New Bundle item added successfully!",
                    },
                    formSubmitting: false,
                    form_message: "",
                    product_new_bundle: {
                        skus: [],
                        bundle_sku: "",
                        quantity: 0,
                        name: "",
                        location: "",
                        weight: "",
                        length: "",
                        height: "",
                        width: "",
                        alias: "",
                        origin: "",
                        alias_sku: "",
                    },
                    showbtntext: "All Bundles",
                    listofskus: [],
                });

                let btntext = this.state.showbtntext;
                if (btntext == "Pending Bundles") {
                    this.setState({ showbtntext: "Pending Bundles" });
                    this.getData({
                        perpage: this.state.perpage,
                        show_pending: "",
                    });
                } else {
                    this.setState({ showbtntext: "All Bundles" });
                    this.getData({
                        perpage: this.state.perpage,
                        show_pending: "yes",
                    });
                }
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.skus !== "undefined" &&
                    errors.skus.length > 0
                ) {
                    msg += errors.skus[0] + "\r\n";
                }
                if (
                    typeof errors.bundle_sku !== "undefined" &&
                    errors.bundle_sku.length > 0
                ) {
                    msg += errors.bundle_sku[0] + "\r\n";
                }
                if (
                    typeof errors.quantity !== "undefined" &&
                    errors.quantity.length > 0
                ) {
                    msg += errors.quantity[0] + "\r\n";
                }
                if (
                    typeof errors.name !== "undefined" &&
                    errors.name.length > 0
                ) {
                    msg += errors.name[0] + "\r\n";
                }
                if (
                    typeof errors.alias !== "undefined" &&
                    errors.alias.length > 0
                ) {
                    msg += errors.alias[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleEditBundlesSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });

        const skus = document.getElementsByName("sku[]");
        const quantities = document.getElementsByName("qty[]");
        let productitems = "";
        if (skus.length > 0) {
            let sku_list = [];
            for (var i = 0; i < skus.length; i++) {
                if (skus[i].value != "") {
                    sku_list[i] = {
                        sku: skus[i].value,
                        qty: quantities[i].value,
                    };
                }
            }
            if (sku_list.length > 0) {
                productitems = JSON.stringify(sku_list);
            }
        }

        const productData = new FormData();
        productData.append("skus", productitems);
        productData.append("editsku", this.state.product_new_bundle.editsku);
        productData.append(
            "bundle_sku",
            this.state.product_new_bundle.bundle_sku
        );
        productData.append("quantity", this.state.product_new_bundle.quantity);
        productData.append("name", this.state.product_new_bundle.name);
        productData.append("location", this.state.product_new_bundle.location);
        productData.append("weight", this.state.product_new_bundle.weight);
        productData.append("length", this.state.product_new_bundle.length);
        productData.append("height", this.state.product_new_bundle.height);
        productData.append("width", this.state.product_new_bundle.width);
        productData.append("alias", this.state.product_new_bundle.alias);
        productData.append("origin", this.state.product_new_bundle.origin);
        productData.append(
            "alias_sku",
            this.state.product_new_bundle.alias_sku
        );

        axios
            .post("api/edit-bundle-item", productData)
            .then((response) => {
                this.setState({
                    editModal: false,
                    global_msg: {
                        type: "success",
                        message: "Bundle item updated successfully!",
                    },
                    formSubmitting: false,
                    form_message: "",
                    listofskus: [],
                    product_new_bundle: {
                        skus: [],
                        bundle_sku: "",
                        quantity: 0,
                        name: "",
                        location: "",
                        weight: "",
                        length: "",
                        height: "",
                        width: "",
                        alias: "",
                        origin: "",
                        alias_sku: "",
                    },
                });
                this.getData({ page: 1, show_pending: "yes" });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.skus !== "undefined" &&
                    errors.skus.length > 0
                ) {
                    msg += errors.skus[0] + "\r\n";
                }
                if (
                    typeof errors.bundle_sku !== "undefined" &&
                    errors.bundle_sku.length > 0
                ) {
                    msg += errors.bundle_sku[0] + "\r\n";
                }
                if (
                    typeof errors.quantity !== "undefined" &&
                    errors.quantity.length > 0
                ) {
                    msg += errors.quantity[0] + "\r\n";
                }
                if (
                    typeof errors.name !== "undefined" &&
                    errors.name.length > 0
                ) {
                    msg += errors.name[0] + "\r\n";
                }
                if (
                    typeof errors.alias !== "undefined" &&
                    errors.alias.length > 0
                ) {
                    msg += errors.alias[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleAddBundleName = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                name: value,
            },
        }));
    };

    handleAddBundleSku = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                bundle_sku: value,
            },
        }));
    };

    handleAddBundleQuantity = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                quantity: value,
            },
        }));
    };

    handleAddBundleLocation = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                location: value,
            },
        }));
    };

    handleAddBundleWeight = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                weight: value,
            },
        }));
    };

    handleAddBundleHeight = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                height: value,
            },
        }));
    };

    handleAddBundleLength = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                length: value,
            },
        }));
    };

    handleAddBundleWidth = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                width: value,
            },
        }));
    };

    handleAddBundleAlias = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                alias: value,
            },
        }));
    };

    handleAddBundleOrigin = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                origin: value,
            },
        }));
    };

    handleAddBundleAliasSku = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                alias_sku: value,
            },
        }));
    };

    handleShowPendingProducts = (event) => {
        let btntext = this.state.showbtntext;
        if (btntext == "Pending Bundles") {
            this.setState({
                showbtntext: "All Bundles",
                global_msg: { message: "" },
            });
            this.getData({ perpage: this.state.perpage, show_pending: "yes" });
        } else {
            this.setState({
                showbtntext: "Pending Bundles",
                global_msg: { message: "" },
            });
            this.getData({ perpage: this.state.perpage, show_pending: "" });
        }
    };

    handleChangeProductStatus = (skuvalue, productstatus) => {
        let receivemsg = "Bundle has been approved.";

        const productData = new FormData();
        productData.append("sku", skuvalue);
        productData.append("status", productstatus);
        productData.append("type", "bundle");
        axios.post("api/change-productstatus", productData).then((response) => {
            this.getData({ page: 1, show_pending: "yes" });
            this.setState({
                global_msg: { type: "success", message: receivemsg },
            });
        });
    };

    createNewElementSku = (elem) => {
        const listofskus = document.getElementById(elem);
        const d = new Date();
        let time = d.getTime();
        const newElement = (
            <div id={"sku-item-" + time} style={{ display: "flex" }}>
                <div
                    style={{
                        width: "100%",
                        maxWidth: "55%",
                        marginRight: "2%",
                        marginTop: "8px",
                    }}
                >
                    <InputLabel>SKU</InputLabel>
                    <Select
                        label="Product"
                        hiddenlabel
                        className="table-filters custom-select-style"
                        fullWidth
                        name="sku[]"
                    >
                        <MenuItem key={0} value="">
                            {" "}
                            Select SKU{" "}
                        </MenuItem>
                        {this.state.productoptions.map((row) => (
                            <MenuItem
                                key={row.ProductVariantID}
                                value={row.SKU}
                            >
                                {row.ProductAlias}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <div
                    style={{
                        width: "100%",
                        maxWidth: "38%",
                        marginRight: "2%",
                    }}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        name="qty"
                        label="Quantity"
                        fullWidth
                        variant="standard"
                        name="qty[]"
                        type="number"
                    />
                </div>
                <div
                    style={{
                        width: "100%",
                        maxWidth: "5%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CloseCircleIcon
                        onClick={this.removeProduct.bind(this, time)}
                    />
                </div>
            </div>
        );
        const addedElement = this.state.listofskus.concat(newElement);
        this.setState({ listofskus: addedElement });
    };

    createNewElementEditedSku = (elem, skus) => {
        const listofskus = document.getElementById(elem);
        const newElement = (
            <div>
                {skus.map((editedrow, i) => (
                    <div id={"sku-item-" + i} style={{ display: "flex" }}>
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "55%",
                                marginRight: "2%",
                                marginTop: "8px",
                            }}
                        >
                            <InputLabel>SKU</InputLabel>
                            <Select
                                label="Product"
                                hiddenlabel
                                className="table-filters custom-select-style"
                                fullWidth
                                name="sku[]"
                                defaultValue={editedrow.sku}
                            >
                                <MenuItem key={0} value="">
                                    {" "}
                                    Select SKU{" "}
                                </MenuItem>
                                {this.state.productoptions.map((row) => (
                                    <MenuItem
                                        key={row.ProductVariantID}
                                        value={row.SKU}
                                    >
                                        {row.ProductAlias}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "38%",
                                marginRight: "2%",
                            }}
                        >
                            <TextField
                                autoFocus
                                margin="dense"
                                name="qty"
                                label="Quantity"
                                fullWidth
                                variant="standard"
                                name="qty[]"
                                defaultValue={editedrow.qty}
                                type="number"
                            />
                        </div>
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "5%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CloseCircleIcon
                                onClick={this.removeProduct.bind(this, i)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
        const addedElement = this.state.listofskus.concat(newElement);
        this.setState({ listofskus: addedElement });
    };

    removeProduct = (id) => {
        document.getElementById("sku-item-" + id).remove();
    };

    render() {
        const fullWidth = true;
        const maxWidth = "md";

        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 250,
                },
            },
        };

        const modalPopupContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="inventoryAddBundlesForm"
                    component={"form"}
                    onSubmit={this.handleAddBundlesSubmit}
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
                            Add Product Bundle
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.form_message}
                            </Alert>
                        )}
                        <div
                            style={{
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <h6>
                                <strong>List of SKU's</strong>
                            </h6>
                            <Button
                                variant="outlined"
                                onClick={this.createNewElementSku.bind(
                                    this,
                                    "list-of-skus"
                                )}
                                className="archive_btn_table"
                                style={{ minWidth: "160px" }}
                            >
                                Add New Item
                            </Button>
                        </div>
                        <div id="list-of-skus" style={{ marginBottom: "20px" }}>
                            {this.state.listofskus.length > 0 ? (
                                this.state.listofskus.map((skuElement) => (
                                    <div>{skuElement}</div>
                                ))
                            ) : (
                                <Alert severity="error">
                                    No SKU added. Click button above.
                                </Alert>
                            )}
                        </div>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                name="name"
                                label="Bundle Name"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddBundleName}
                            />
                        </div>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="bundle_sku"
                                name="bundle_sku"
                                label="Bundle SKU"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddBundleSku}
                            />
                        </div>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="alias"
                                name="alias"
                                label="Bundle Product Alias"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddBundleAlias}
                            />
                        </div>
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

        const modalEditPopupContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.editModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="inventoryEditBundlesForm"
                    component={"form"}
                    onSubmit={this.handleEditBundlesSubmit}
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
                            Edit Product Bundle
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.form_message}
                            </Alert>
                        )}
                        <div
                            style={{
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <h6>
                                <strong>List of SKU's</strong>
                            </h6>
                            <Button
                                variant="outlined"
                                onClick={this.createNewElementSku.bind(
                                    this,
                                    "list-of-edited-skus"
                                )}
                                className="archive_btn_table"
                                style={{ minWidth: "160px" }}
                            >
                                Add New Item
                            </Button>
                        </div>
                        <div
                            id="list-of-edited-skus"
                            style={{ marginBottom: "20px" }}
                        >
                            {this.state.listofskus.length > 0 ? (
                                this.state.listofskus.map((skuElement) => (
                                    <div>{skuElement}</div>
                                ))
                            ) : (
                                <Alert severity="error">
                                    No SKU added. Click button above.
                                </Alert>
                            )}
                        </div>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                name="name"
                                label="Bundle Name"
                                fullWidth
                                variant="standard"
                                value={this.state.product_new_bundle.name}
                                onChange={this.handleAddBundleName}
                            />
                        </div>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="bundle_sku"
                                name="bundle_sku"
                                label="Bundle SKU"
                                fullWidth
                                variant="standard"
                                value={this.state.product_new_bundle.bundle_sku}
                                onChange={this.handleAddBundleSku}
                            />
                        </div>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="alias"
                                name="alias"
                                label="Bundle Product Alias"
                                fullWidth
                                variant="standard"
                                value={this.state.product_new_bundle.alias}
                                onChange={this.handleAddBundleAlias}
                            />
                        </div>
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
                                    ? "Updating..."
                                    : "Update"}
                            </Button>
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        let showPendingBtn = "";
        if (this.state.role != "Client") {
            showPendingBtn = (
                <div style={{ display: "inline-block" }}>
                    <Button
                        variant="outlined"
                        onClick={this.handleShowPendingProducts}
                        className="archive_btn_table"
                        style={{ width: "auto" }}
                    >
                        Show {this.state.showbtntext}
                    </Button>{" "}
                    &nbsp;
                </div>
            );
        }

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
                            {showPendingBtn}
                        </Typography>
                        <div>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box className="subpage_graph_sort_cnt">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={this.handleShowForm}
                                    className="export_button addbtn"
                                    style={{
                                        display: this.state.showaddproductbtn,
                                    }}
                                >
                                    <AddIcon /> Add Product Bundle
                                </Button>
                            </Box>
                        </div>
                    </div>
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
                {modalPopupContainer}
                {modalEditPopupContainer}
            </React.Fragment>
        );
    }
}

export default InventoryLists;
