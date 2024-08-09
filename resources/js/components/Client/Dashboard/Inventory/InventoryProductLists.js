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
import CloseCircleIcon from "@mui/icons-material/HighlightOff";
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

class InventoryLists extends Component {
    constructor(props) {
        super(props);

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "codesku",
                headerName: "SKU",
                flex: 1,
                renderCell: (params) => {
                    return (
                        <Link
                            href={null}
                            onClick={this.handleShowForm.bind(this, params.row)}
                        >
                            {params.row.codesku}
                        </Link>
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
                field: "AliasSKU3",
                headerName: "Alias SKU 3",
                flex: 1,
            },
            {
                field: "AliasSKU4",
                headerName: "Alias SKU 4",
                flex: 1,
            },
            {
                field: "AliasSKU5",
                headerName: "Alias SKU 5",
                flex: 1,
            },
            {
                field: "declaredValue",
                headerName: "Declared Value",
                flex: 1,
            },
            {
                field: "origin",
                headerName: "Country Of Origin",
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
                                        params.row.action,
                                        "Approved"
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20"
                                >
                                    Approve
                                </Button>{" "}
                            </div>
                        );
                    } else {
                        return "";
                    }
                },
                hide: true,
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
            showaddproductbtn: "inline-block",
            openProductsModal: false,
            openProductsCatalog: false,
            modalTitleIsEdit: false,
            formIsValid: true,
            formID: "",
            formSKU: "",
            hasSKUChanged: false,
            formSKUOldValue: "",
            formItemTitle: "",
            formAliasSKU1: "",
            formAliasSKU2: "",
            formAliasSKU3: "",
            formAliasSKU4: "",
            formAliasSKU5: "",
            formTariffCode: "",
            formCountryOfOrigin: "",
            formDeclaredValue: "",
            formWidth: "",
            formLength: "",
            formHeight: "",
            formWeight: "",
            formStatus: "",
            statusForList: "",
            formError: "",
            filterStatus: "Approved",
            filterBundle: "N",
            isBundleAllowed: 0,
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
            listofskus: [],
            inventory_new_product: {
                SKU: "",
                ProductName: "",
                Location: "",
                Weight: 0,
                Length: 0,
                Height: 0,
                Width: 0,
                ProductAlias: "",
                CountryOfOrigin: "",
                AliasSKU: "",
            },
            formSubmitting: false,
            formSubmitButtonState: "Save",
            hideAction: false,
            showbtntext: "Pending Products",
            role: "",
            pendingitems: [],
            showchangestatusbtns: "none",
            isInchesAndPounds: true,
            gridRowsCopy: [],
            accessLevel: 0,
        };
        this.handleAddBundlesSubmit = this.handleAddBundlesSubmit.bind(this);
        this.handleAddProductSubmit = this.handleAddProductSubmit.bind(this);
        this.handleChangeProductStatus =
            this.handleChangeProductStatus.bind(this);
    }

    handleCloseModalBundle = () => {
        
        this.setState({
            openModal: false,
            listofskus: [],
        });
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

    handleAddBundleAlias = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                alias: value,
            },
        }));
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

    handleShowFormBudle = (event) => {
        axios
            .get("api/productslist?bundleStatus=N&&search=" + null)
            .then((response) => {
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

    componentDidMount() {
        let accessUserLevel = parseInt(localStorage["accessUserLevel"]);
        const today = new Date();
        const dateformat = this.state.date !== "" ? this.state.date : today;
        const date = new Date(dateformat);
        let state = localStorage["appState"];
        let menustate = localStorage["menuState"];
        if (state) {
            let AppState = JSON.parse(state);
            let MenuAppState = JSON.parse(menustate);
            let productbtnstatus =
                MenuAppState.member_menu.add_product_button == 1
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
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            date: date,
            filterStatus: this.state.filterStatus,
        });
        this.getsearch_params();

        // disable action is access level is 1.
        this.setState({ accessLevel: accessUserLevel });
        if (typeof accessUserLevel !== undefined && accessUserLevel == 1) {
            this.removeActionColumn();
        }
    }

    removeActionColumn = () => {
        const cfields = this.state.gridcolumns.filter(
            (column) => column.field !== "action"
        );
        this.setState({ gridcolumns: cfields });
    };

    removeProduct = (id) => {
        document.getElementById("sku-item-" + id).remove();
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
                                {row.SKU}
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

    getData = (data) => {
        const stocktype = this.state.stocktype;
        const bundleStatus = data?.filterBundle
            ? data?.filterBundle
            : this.state.filterBundle;

        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        this.showpending =
            data.show_pending !== undefined ? data.show_pending : "";
        axios
            .get(
                "api/productslist?show_pending=" +
                    this.state.filterStatus +
                    "&&search=" +
                    this.state.searchValue +
                    "&&bundleStatus=" +
                    bundleStatus
            )
            .then((response) => {
                let fullgriddata = [];
                response.data.products.forEach(function (key) {
                    let length_val = "-";
                    let height_val = "-";
                    let weight_val = "-";
                    let width_val = "-";
                    let weightOz_val = "-";

                    if (key.Length) {
                        length_val = parseFloat(key.Length);
                    }
                    if (key.Height) {
                        height_val = parseFloat(key.Height);
                    }
                    if (key.Weight) {
                        weight_val = parseFloat(key.Weight);
                        weightOz_val = weight_val * 16;
                    }
                    if (key.Width) {
                        width_val = parseFloat(key.Width);
                    }

                    let row_grid_data = {
                        id: key.ProductVariantID,
                        itemname: key.ProductName,
                        sku: key.SKU,
                        location: key.Location,
                        origin: key.CountryOfOrigin,
                        length: length_val,
                        height: height_val,
                        weight: weight_val,
                        width: width_val,
                        action: key.SKU,
                        codesku: key.SKU,
                        webcodesku: key.AliasSKU2,
                        productgroup: key.ProductGroup,
                        weightOz: weightOz_val,
                        aliasSKU1: key.AliasSKU1,
                        aliasSKU2: key.AliasSKU2,
                        aliasSKU3: key.AliasSKU3,
                        aliasSKU4: key.AliasSKU4,
                        aliasSKU5: key.AliasSKU5,
                        AliasSKU1: key.AliasSKU1,
                        AliasSKU2: key.AliasSKU2,
                        AliasSKU3: key.AliasSKU3,
                        AliasSKU4: key.AliasSKU4,
                        AliasSKU5: key.AliasSKU5,
                        tariffCode: key.TariffCode,
                        countryOfOrigin: key.CountryOrigin,
                        declaredValue: key.DeclaredValue,
                        status: key.status,
                        statusForList: key.status,
                    };
                    fullgriddata.push(row_grid_data);
                });
                this.setState({
                    gridrows: fullgriddata,
                    datetimesync: response.data.syncdatetime,
                    searchValue: null,
                    isBundleAllowed: response.data.isBundleAllowed,
                });
                const urlParams = new URLSearchParams(window.location.search);

                // Remove the desired query parameter
                urlParams.delete("search");
                const newUrl = `${
                    window.location.pathname
                }?${urlParams.toString()}`;
                window.history.replaceState(null, "", newUrl);
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

    handleChangeFilter = (event) => {
        const date = new Date(this.state.date);
        this.setState({ filterStatus: event.target.value }, () => {
            this.getData({
                page: 1,
                perpage: event.target.value,
                date: date,
                filterStatus: event.target.value,
            });
        });
    };

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

    getsearch_params = () => {
        const urlparams = new URLSearchParams(window.location.search);
        let searchparamval = urlparams.get("search");
        let searchState = {
            searchtext: searchparamval,
        };
        localStorage["searchState"] = JSON.stringify(searchState);
    };

    handleShowAddProduct = (event) => {
        this.setState({ openProductsModal: true, formSubmitting: false });
    };
    handleCloseModal = () => {
        this.setState({ openProductsModal: false });
    };

    handleCloseProductCatalogModal = (id) => {
        this.setState({ openProductsCatalog: false, formIsValid: true });
    };

    handleAddProductAlias = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                ProductAlias: value,
            },
        }));
    };

    handleAddSKU = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                SKU: value,
            },
        }));
    };
    handleAddProductName = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                ProductName: value,
            },
        }));
    };
    handleAddLocation = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                Location: value,
            },
        }));
    };
    handleAddWeight = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                Weight: value,
            },
        }));
    };
    handleAddLength = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                Length: value,
            },
        }));
    };

    handleFormData = (e) => {
        console.log(e?.target?.name);
        let field = "";
        switch (e?.target?.name) {
            case "SKU":
                field = "formSKU";
                this.setState({ hasSKUChanged: true });
                break;
            case "ItemTitle":
                field = "formItemTitle";
                break;
            case "AliasSKU1":
                field = "formAliasSKU1";
                break;
            case "AliasSKU2":
                field = "formAliasSKU2";
                break;
            case "AliasSKU3":
                field = "formAliasSKU3";
                break;
            case "AliasSKU4":
                field = "formAliasSKU4";
                break;
            case "AliasSKU5":
                field = "formAliasSKU5";
                break;
            case "TariffCode":
                field = "formTariffCode";
                break;
            case "CountryOfOrigin":
                field = "formCountryOfOrigin";
                break;
            case "DeclaredValue":
                field = "formDeclaredValue";
                break;
            case "Width":
                field = "formWidth";
                break;
            case "Length":
                field = "formLength";
                break;
            case "Height":
                field = "formHeight";
                break;
            case "Weight":
                field = "formWeight";
                break;
            case "status":
                field = "formStatus";
        }
        this.setState({ [field]: e?.target?.value });
    };

    handleAddHeight = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                Height: value,
            },
        }));
    };
    handleAddWidth = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                Width: value,
            },
        }));
    };
    handleAddCountryOfOrigin = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                CountryOfOrigin: value,
            },
        }));
    };
    handleAddAliasSKU = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_product: {
                ...prevState.inventory_new_product,
                AliasSKU: value,
            },
        }));
    };

    handleSubmitProductCatalogForm = (e) => {
        e.preventDefault();
        this.setState({ formSubmitButtonState: "Saving..." });
        if (
            this.state.formSKU == "" ||
            this.state.formItemTitle == "" ||
            this.state.formTariffCode == "" ||
            this.state.formCountryOfOrigin == "" ||
            this.state.formAliasSKU1 == "" ||
            this.state.formDeclaredValue == ""
        ) {
            this.setState({
                formIsValid: false,
                formSubmitButtonState: "Save",
            });
        } else {
            var formData = {
                formID: this.state.formID,
                formSKU: this.state.formSKU,
                formItemTitle: this.state.formItemTitle,
                formAliasSKU1: this.state.formAliasSKU1,
                formAliasSKU2: this.state.formAliasSKU2,
                formAliasSKU3: this.state.formAliasSKU3,
                formAliasSKU4: this.state.formAliasSKU4,
                formAliasSKU5: this.state.formAliasSKU5,
                formTariffCode: this.state.formTariffCode,
                formCountryOfOrigin: this.state.formCountryOfOrigin,
                formDeclaredValue: this.state.formDeclaredValue,
                formWidth: this.state.formWidth,
                formLength: this.state.formLength,
                formHeight: this.state.formHeight,
                formWeight: this.state.formWeight,
                hasSKUChanged: this.state.hasSKUChanged,
                formSKUOldValue: this.state.formSKUOldValue,
                formStatus: this.state.formStatus,
            };
            axios
                .post("api/store-product-catalog", formData)
                .then((response) => {
                    this.setState({
                        formSubmitButtonState: "Saved!",
                    });
                    location.reload();
                })
                .catch((error) => {
                    console.error(error?.response?.data);
                    this.setState({
                        formIsValid: false,
                        formError: error?.response?.data,
                        formSubmitButtonState: "Save",
                    });
                });
        }
    };

    handleShowForm = (data) => {
        this.setState({
            openProductsCatalog: true,
            modalTitleIsEdit: data?.id ? true : false,
            formID: data?.id ? data?.id : "",
            formSKU: data?.sku ? data?.sku : "",
            formItemTitle: data?.itemname ? data?.itemname : "",
            formAliasSKU1: data?.aliasSKU1 ? data?.aliasSKU1 : "",
            formAliasSKU2: data?.aliasSKU2 ? data?.aliasSKU2 : "",
            formAliasSKU3: data?.aliasSKU3 ? data?.aliasSKU3 : "",
            formAliasSKU4: data?.aliasSKU4 ? data?.aliasSKU4 : "",
            formAliasSKU5: data?.aliasSKU5 ? data?.aliasSKU5 : "",
            formTariffCode: data?.tariffCode ? data?.tariffCode : "",
            formCountryOfOrigin: data?.countryOfOrigin
                ? data?.countryOfOrigin
                : "",
            formDeclaredValue: data?.declaredValue ? data?.declaredValue : "",
            formWidth: data?.width ? data?.width : "",
            formLength: data?.length ? data?.length : "",
            formHeight: data?.height ? data?.height : "",
            formWeight: data?.weight ? data?.weight : "",
            formStatus: data?.status ? data?.status : "Hold",
            formSKUOldValue: data?.sku ? data?.sku : "",
            statusForList: data?.status ? data?.status : "",
        });
    };

    handleAddBundleName = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            product_new_bundle: {
                ...prevState.product_new_bundle,
                name: value,
            },
        }));
    };

    handleAddProductSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });

        axios
            .post("api/add-product", this.state.inventory_new_product)
            .then((response) => {
                this.setState({
                    openProductsModal: false,
                    global_msg: {
                        type: "success",
                        message:
                            "New product is now pending and please wait for the admin's approval.",
                    },
                    formSubmitting: false,
                });
                let btntext = this.state.showbtntext;
                let newbtntext = "";
                let showpending = "";
                let showbtnstatus = "";
                if (btntext == "Pending Products") {
                    newbtntext = "All Products";
                    showpending = "yes";
                    showbtnstatus = "inline-block";
                } else {
                    newbtntext = "Pending Products";
                    showpending = "";
                    showbtnstatus = "none";
                }
                this.getData({
                    page: 1,
                    perpage: this.state.perpage,
                    show_pending: showpending,
                });
                this.setState({
                    form_message: "",
                    inventory_new_product: {
                        SKU: "",
                        ProductName: "",
                        Location: "",
                        Weight: 0,
                        Length: 0,
                        Height: 0,
                        Width: 0,
                        ProductAlias: "",
                        CountryOfOrigin: "",
                        AliasSKU: "",
                    },
                    showbtntext: newbtntext,
                    showchangestatusbtns: showbtnstatus,
                });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.SKU !== "undefined" &&
                    errors.SKU.length > 0
                ) {
                    msg += errors.SKU[0] + "\r\n";
                }
                if (
                    typeof errors.ProductAlias !== "undefined" &&
                    errors.ProductAlias.length > 0
                ) {
                    msg += errors.ProductAlias[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }
    handleShowPendingProducts = (event) => {
        let btntext = this.state.showbtntext;
        if (btntext == "Pending Products") {
            this.setState({
                showbtntext: "All Products",
                showchangestatusbtns: "inline-block",
                global_msg: { message: "" },
            });
            this.getData({
                page: 1,
                perpage: this.state.perpage,
                show_pending: "yes",
            });
        } else {
            this.setState({
                showbtntext: "Pending Products",
                showchangestatusbtns: "none",
                global_msg: { message: "" },
            });
            this.getData({
                page: 1,
                perpage: this.state.perpage,
                show_pending: "",
            });
        }
    };
    handleChangeProductStatus = (skuvalue, productstatus) => {
        let receivemsg = "Product has been approve.";

        const productData = new FormData();
        productData.append("sku", skuvalue);
        productData.append("status", productstatus);
        productData.append("type", "");
        axios.post("api/change-productstatus", productData).then((response) => {
            this.getData({ page: 1, show_pending: "yes" });
            this.setState({
                global_msg: { type: "success", message: receivemsg },
            });
        });
    };
    handleChangeStatusRows = (pendingitems) => {
        console.log(pendingitems);
        this.setState({
            pendingitems: pendingitems,
            global_msg: { message: "" },
        });
    };

    handleChangeProductItemsStatus = (pendingstatus) => {
        if (this.state.pendingitems.length > 0) {
            const productData = new FormData();
            productData.append(
                "productinfo",
                JSON.stringify(this.state.pendingitems)
            );
            productData.append("status", pendingstatus);
            axios
                .post("api/change-productstatus-items", productData)
                .then((response) => {
                    this.setState({
                        pendingitems: [],
                        global_msg: {
                            type: "success",
                            message:
                                "Selected products has beed approved successfully!",
                        },
                    });
                    this.getData({ page: 1, show_pending: "yes" });
                });
        } else {
            this.setState({
                pendingitems: [],
                global_msg: {
                    type: "error",
                    message: "Please select item(s) to change status.",
                },
            });
        }
    };

    handleConvertInchensAndPoundsToCMandGrams = (isInchesAndPounds) => {
        this.setState({ isInchesAndPounds: isInchesAndPounds });
    };

    render() {
        const fullWidth = true;
        const maxWidth = "md";

        const modalAddProductContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openProductsCatalog}
                onClose={this.handleCloseProductCatalogModal}
                className="ordermodal"
            >
                <Box
                    id="inventoryAddReceivingForm"
                    component={"form"}
                    onSubmit={this.handleSubmitProductCatalogForm}
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
                                onClick={this.handleCloseProductCatalogModal}
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
                            {this.state.modalTitleIsEdit ? "Edit" : "Add"}{" "}
                            Product
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
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="SKU"
                                name="SKU"
                                label="SKU"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFormData}
                                value={this.state.formSKU}
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                            />
                            {!this.state.formIsValid && !this.state.formSKU ? (
                                <>
                                    <span
                                        style={{
                                            color: "red",
                                            fontSize: "12px",
                                        }}
                                    >
                                        SKU field is requred.
                                    </span>
                                    <br></br>
                                </>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{
                                    marginTop:
                                        !this.state.formIsValid &&
                                        !this.state.formSKU
                                            ? "50px"
                                            : "0px",
                                }}
                                margin="dense"
                                id="ItemTitle"
                                name="ItemTitle"
                                label="Item Title"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFormData}
                                value={this.state.formItemTitle}
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                            />
                            {!this.state.formIsValid &&
                            !this.state.formItemTitle ? (
                                <>
                                    <span
                                        style={{
                                            color: "red",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Item Title field is requred.<br></br>
                                    </span>
                                </>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{
                                    marginTop:
                                        !this.state.formIsValid &&
                                        !this.state.formItemTitle
                                            ? "50px"
                                            : "0px",
                                }}
                                margin="dense"
                                id="AliasSKU1"
                                name="AliasSKU1"
                                label="Alias SKU 1"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFormData}
                                value={this.state.formAliasSKU1}
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                            />
                            {!this.state.formIsValid &&
                            !this.state.formAliasSKU1 ? (
                                <>
                                    <span
                                        style={{
                                            color: "red",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Alias SKU 1 field is requred.<br></br>
                                    </span>
                                </>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{
                                    marginTop:
                                        !this.state.formIsValid &&
                                        !this.state.formAliasSKU1
                                            ? "50px"
                                            : "0px",
                                }}
                                margin="dense"
                                id="AliasSKU2"
                                name="AliasSKU2"
                                label="Alias SKU 2"
                                fullWidth
                                variant="standard"
                                value={this.state.formAliasSKU2}
                                onChange={this.handleFormData}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="AliasSKU3"
                                name="AliasSKU3"
                                label="Alias SKU 3"
                                fullWidth
                                variant="standard"
                                value={this.state.formAliasSKU3}
                                onChange={this.handleFormData}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="AliasSKU4"
                                name="AliasSKU4"
                                label="Alias SKU 4"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFormData}
                                value={this.state.formAliasSKU4}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="AliasSKU5"
                                name="AliasSKU5"
                                label="Alias SKU 5"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFormData}
                                value={this.state.formAliasSKU5}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="TariffCode"
                                name="TariffCode"
                                label="Tariff Code"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFormData}
                                value={this.state.formTariffCode}
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                            />
                            {!this.state.formIsValid &&
                            !this.state.formTariffCode ? (
                                <>
                                    <span
                                        style={{
                                            color: "red",
                                            fontSize: "12px",
                                            marginBottom: "7px",
                                        }}
                                    >
                                        Tariff Code field is requred.<br></br>
                                    </span>
                                </>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{
                                    marginTop:
                                        !this.state.formIsValid &&
                                        !this.state.formTariffCode
                                            ? "50px"
                                            : "0px",
                                }}
                                margin="dense"
                                id="CountryOfOrigin"
                                name="CountryOfOrigin"
                                label="Country of Origin"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFormData}
                                value={this.state.formCountryOfOrigin}
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                            />
                            {!this.state.formIsValid &&
                            !this.state.formCountryOfOrigin ? (
                                <>
                                    <span
                                        style={{
                                            color: "red",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Country Of Origin field is requred.
                                        <br></br>
                                    </span>
                                </>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{
                                    marginTop:
                                        !this.state.formIsValid &&
                                        !this.state.formCountryOfOrigin
                                            ? "50px"
                                            : "0px",
                                }}
                                type="number"
                                margin="dense"
                                id="DeclaredValue"
                                name="DeclaredValue"
                                label="Declared Value"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFormData}
                                value={this.state.formDeclaredValue}
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                            />
                            {!this.state.formIsValid &&
                            !this.state.formDeclaredValue ? (
                                <>
                                    <span
                                        style={{
                                            color: "red",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Declared Value field is requred.
                                        <br></br>
                                    </span>
                                </>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{
                                    marginTop:
                                        !this.state.formIsValid &&
                                        !this.state.formDeclaredValue
                                            ? "50px"
                                            : "0px",
                                }}
                                margin="dense"
                                id="Width"
                                name="Width"
                                type="number"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFormData}
                                value={
                                    this.state.isInchesAndPounds
                                        ? this.state.formWidth
                                        : (
                                              parseFloat(this.state.formWidth) *
                                              2.54
                                          ).toFixed(1)
                                }
                                label={`Width${
                                    this.state.isInchesAndPounds
                                        ? " (in)"
                                        : " (cm)"
                                }`}
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="Length"
                                name="Length"
                                label={`Length${
                                    this.state.isInchesAndPounds
                                        ? " (in)"
                                        : " (cm)"
                                }`}
                                fullWidth
                                variant="standard"
                                type="number"
                                onChange={this.handleFormData}
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                                value={
                                    this.state.isInchesAndPounds
                                        ? this.state.formLength
                                        : (
                                              parseFloat(
                                                  this.state.formLength
                                              ) * 2.54
                                          ).toFixed(1)
                                }
                            />
                        </div>

                        <div>
                            <TextField
                                margin="dense"
                                id="Height"
                                name="Height"
                                label={`Height${
                                    this.state.isInchesAndPounds
                                        ? " (in)"
                                        : " (cm)"
                                }`}
                                fullWidth
                                type="number"
                                variant="standard"
                                onChange={this.handleFormData}
                                value={
                                    this.state.isInchesAndPounds
                                        ? this.state.formHeight
                                        : (
                                              parseFloat(
                                                  this.state.formHeight
                                              ) * 2.54
                                          ).toFixed(1)
                                }
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                            />
                        </div>

                        <div>
                            <TextField
                                margin="dense"
                                id="Weight"
                                name="Weight"
                                label={`Weight${
                                    this.state.isInchesAndPounds
                                        ? this.state.formWeight < 1
                                            ? " (oz)"
                                            : this.state.formWeight > 1
                                            ? " (lbs)"
                                            : " (lb)"
                                        : " (gm)"
                                }`}
                                fullWidth
                                variant="standard"
                                type="number"
                                onChange={this.handleFormData}
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                                value={
                                    this.state.isInchesAndPounds
                                        ? this.state.formWeight >= 1
                                            ? this.state.formWeight
                                            : parseFloat(
                                                  this.state.formWeight
                                              ) * 16
                                        : (
                                              parseFloat(
                                                  this.state.formWeight
                                              ) * 453.59237
                                          ).toFixed(1)
                                }
                            />
                        </div>
                        <div>
                            <Select
                                label="status"
                                value={this.state.formStatus}
                                inputProps={{ "aria-label": "Without label" }}
                                className="table-filters filter_selects"
                                fullWidth
                                onChange={this.handleFormData}
                                name="status"
                                disabled={
                                    this.state.modalTitleIsEdit == true &&
                                    this.state.statusForList === "Approved"
                                        ? true
                                        : false
                                }
                            >
                                <MenuItem key={0} value="Hold">
                                    <em
                                        style={{
                                            color: "#AA5539",
                                            fontStyle: "normal",
                                        }}
                                    >
                                        Hold
                                    </em>
                                </MenuItem>
                                {this.state.modalTitleIsEdit ? (
                                    <MenuItem key={1} value="Approved">
                                        <em
                                            style={{
                                                color: "#AA5539",
                                                fontStyle: "normal",
                                            }}
                                        >
                                            Approved
                                        </em>
                                    </MenuItem>
                                ) : null}
                            </Select>
                        </div>
                        {!this.state.formIsValid && (
                            <Alert
                                style={{
                                    marginBottom: "20px",
                                    marginTop: "20px",
                                }}
                                severity="error"
                            >
                                <>{this.state.formError}</>
                            </Alert>
                        )}
                        <div className="form_btns">
                            <Button
                                type={"button"}
                                color="inherit"
                                onClick={this.handleCloseProductCatalogModal}
                            >
                                Close
                            </Button>
                            <Button
                                type={"submit"}
                                color="inherit"
                                disabled={this.state.formSubmitting}
                            >
                                {this.state.formSubmitButtonState}
                            </Button>
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        const modalPopupContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModalBundle}
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

        const modalProductContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openProductsModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="inventoryAddReceivingForm"
                    component={"form"}
                    onSubmit={this.handleAddProductSubmit}
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
                            {this.state.modalTitleIsEdit ? "Edit" : "Add"}{" "}
                            Product
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.form_message}
                            </Alert>
                        )}

                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="ProductAlias"
                                name="ProductAlias"
                                label="Product Alias"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddProductAlias}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="SKU"
                                name="SKU"
                                label="SKU"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddSKU}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="ProductName"
                                name="ProductName"
                                label="Product Name"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddProductName}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="Location"
                                name="Location"
                                label="Location"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddLocation}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="Weight"
                                name="Weight"
                                label="Weight"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddWeight}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="Length"
                                name="Length"
                                label="Length"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddLength}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="Height"
                                name="Height"
                                label="Height"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddHeight}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="Width"
                                name="Width"
                                label="Width"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddWidth}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="CountryOfOrigin"
                                name="CountryOfOrigin"
                                label="Country Of Origin"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddCountryOfOrigin}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="AliasSKU"
                                name="AliasSKU"
                                label="Alias SKU"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddAliasSKU}
                            />
                        </div>
                        <div className="form_btns">
                            <Button
                                type={"button"}
                                color="inherit"
                                onClick={this.handleCloseModal}
                            >
                                Close
                            </Button>
                            <Button
                                type={"submit"}
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

        let addProductBtn = "";
        // if(this.state.role != 'Client') {
        // addProductBtn = (
        //     <div>
        //         <Box sx={{ flexGrow: 1 }} />
        //         <Box className="subpage_graph_sort_cnt">
        //             <Button
        //                 type="button"
        //                 variant="outlined"
        //                 onClick={this.handleShowAddProduct}
        //                 className="export_button addbtn"
        //                 style={{ display: this.state.showaddproductbtn }}
        //             >
        //                 <AddIcon /> Add Product
        //             </Button>
        //         </Box>
        //     </div>
        // );
        // }
        let showPendingBtn = "";
        if (this.state.role == "Admin") {
            showPendingBtn = (
                <div style={{ display: "inline-block" }}>
                    <Button
                        variant="outlined"
                        onClick={this.handleShowPendingProducts}
                        className="archive_btn_table"
                        style={{
                            width: "auto",
                            display: this.state.showaddproductbtn,
                        }}
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
                                value={this.state.filterStatus}
                                displayEmpty
                                inputProps={{
                                    "aria-label": "Without label",
                                }}
                                onChange={(e) => {
                                    this.handleChangeFilter(e);
                                }}
                                className="mx-1 table-filters filter_selects"
                                IconComponent={KeyboardArrowDownIcon}
                            >
                                <MenuItem key={"1"} value={"Hold"}>
                                    {"Hold"}
                                </MenuItem>
                                <MenuItem key={"2"} value={"Approved"}>
                                    {"Approved"}
                                </MenuItem>
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

                            {/* <Select
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
                                Metric
                            </Typography>
                            <div
                                style={{
                                    display: this.state.showchangestatusbtns,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={this.handleChangeProductItemsStatus.bind(
                                        this,
                                        "Approved"
                                    )}
                                    className="archive_btn_table"
                                >
                                    Approve
                                </Button>
                            </div> */}
                        </Typography>
                        <Box className="subpage_graph_sort_cnt">
                            {this.state.isBundleAllowed > 0 ? (
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={this.handleShowFormBudle}
                                    className="export_button addbtn"
                                    style={{
                                        display: this.state.showaddshipmentbtn,
                                    }}
                                >
                                    <AddIcon /> Add Bundle Product
                                </Button>
                            ) : null}

                            <Button
                                type="button"
                                variant="outlined"
                                onClick={this.handleShowForm}
                                className="export_button addbtn"
                                style={{
                                    display: this.state.showaddshipmentbtn,
                                }}
                            >
                                <AddIcon /> Add Non-Bundle Product
                            </Button>
                        </Box>
                        {this.state.accessLevel == 0 ? (
                            <>{addProductBtn}</>
                        ) : (
                            <></>
                        )}
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
                            rowsPerPageOptions={[-1]}
                            pagination
                            disableSelectionOnClick
                            components={{
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
                            //   columnVisibilityModel={{
                            //  status: this.state.hideAction
                            //   }}
                            //   checkboxSelection
                            //   onSelectionModelChange={(ids) => {
                            //  const selectedIDs = new Set(ids);
                            //  const selectedRows = this.state.gridrows.filter((row) =>
                            //    selectedIDs.has(row.id),
                            //  );

                            //  this.handleChangeStatusRows(selectedRows);
                            //   }}
                        />
                        <div className="datagrid_pagination_bg"></div>
                    </Box>
                </Paper>
                {modalProductContainer}
                {modalAddProductContainer}
                {modalPopupContainer}
            </React.Fragment>
        );
    }
}

export default InventoryLists;
