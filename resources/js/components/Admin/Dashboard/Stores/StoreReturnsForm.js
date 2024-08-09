import React, { Component } from "react";
import {
    AppBar,
    DialogContent,
    Typography,
    IconButton,
    Button,
    Box,
    Dialog,
    TextField,
    Toolbar,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    Autocomplete,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import {
    DataGridPremium,
    GridToolbar,
    GridLinkOperator,
} from "@mui/x-data-grid-premium";

class StoreReturnsForm extends Component {
    constructor(props) {
        super(props);

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "order_date",
                headerName: "Return Date",
                width: 140,
            },
            {
                field: "order_number",
                headerName: "Order Number",
                width: 150,
            },
            {
                field: "no_items_returned",
                headerName: "Items Returned",
                width: 159,
            },
            {
                field: "buyer_name",
                headerName: "Customer Name",
                width: 200,
            },
            {
                field: "buyer_street_number",
                headerName: "Customer Address",
                width: 189,
                hide: true,
            },
            {
                field: "buyer_postal_code",
                headerName: "Zip Code",
                width: 90,
                hide: true,
            },
            {
                field: "shipping_country",
                headerName: "Shipping Country",
                width: 178,
                hide: true,
            },
            {
                field: "FullAddress",
                headerName: "Address",
                renderCell: (params) => {
                    return (
                        params.row.buyer_street_number +
                        ", " +
                        params.row.buyer_postal_code +
                        " " +
                        params.row.shipping_country
                    );
                },
                width: 200,
                hide: true,
            },
            {
                field: "tracking_number",
                headerName: "Tracking Link",
                width: 210,
                renderCell: (params) => {
                    return (
                        <a
                            href={`https://parcelsapp.com/en/tracking/${params.row.tracking_number}`}
                            target="_blank"
                        >
                            {params.row.tracking_number}
                        </a>
                    );
                },
            },
            {
                field: "packing_condition",
                headerName: "Package Condition",
                width: 189,
            },
            {
                field: "item_condition",
                headerName: "Item Condition",
                width: 160,
            },
            {
                field: "return_notes",
                headerName: "Notes",
                width: 250,
                hide: true,
            },
            {
                field: "actions",
                headerName: "Action",
                width: 150,
                renderCell: (params) => {
                    return (
                        <Button
                            variant="outlined"
                            className="primary-btn datagridbtn"
                            onClick={this.handleEditOpenModal.bind(
                                this,
                                params.row.id
                            )}
                        >
                            Update
                        </Button>
                    );
                },
            },
        ];

        const defaultrows = [];
        this.state = {
            location: "return-orders",
            title: props.Title,
            global_msg: {
                type: "error",
                message: "",
            },
            form_message: "",
            orders: [],
            data: [],
            archived: [],
            perpage: 10,
            statusfilter: "",
            returns: "30days",
            sortfield: "",
            sorting: "ASC",
            openModal: false,
            formSubmitting: false,
            showdesc: "block",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 10,
            datetimesync: "No Data",
            packingoptions: [],
            itemoptions: [],
            adminstoreoptions: [],
            shippingoptions: [],
            billedoptions: [
                { id: "Y", value: "Y" },
                { id: "N", value: "N" },
            ],
            newOrderReturns: {
                return_order_id: 0,
                order_date: new Date().toLocaleString("en-US", {
                    hour12: false,
                }),
                order_number: "",
                tracking_number: "",
                shipping_country: "",
                buyer_name: "",
                buyer_street_number: "",
                buyer_postal_code: "",
                packing_condition: "",
                item_condition: "",
                return_notes: "",
                no_items_returned: 0,
                postage_due: "",
                billed_return: "",
            },
            storeSelected: {},
            now: new Date().toLocaleString("en-US", { hour12: false }),
            openEditModal: false,
        };

        this.handleOrderReturnsSubmit =
            this.handleOrderReturnsSubmit.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
    }

    componentDidMount() {
        let localFilterState = localStorage["appState"];
        let FilterAppState = JSON.parse(localFilterState);
        this.setState({ returns: FilterAppState.returns });
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
        this.statusfield =
            data.statusfield !== undefined ? data.statusfield : "";

        axios
            .get(
                "api/ordersreturns-admin?statusfield=" +
                    this.statusfield +
                    "&statusfilter=" +
                    this.statfilter
            )
            .then((response) => {
                let fullgriddata = [];
                let ctrgrid = 1;

                response.data.orders.forEach(function (key) {
                    let row_grid_data = {
                        checkid: key.id,
                        id: key.id,
                        order_date: key.order_date.substring(0, 11),
                        order_number: key.order_number,
                        no_items_returned: key.no_items_returned,
                        buyer_name: key.buyer_name,
                        buyer_street_number: key.buyer_street_number,
                        buyer_postal_code: key.buyer_postal_code,
                        shipping_country: key.shipping_country,
                        tracking_number: key.tracking_number,
                        packing_condition: key.packing_condition,
                        item_condition: key.item_condition,
                        return_notes: key.return_notes,
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

    handleOpenModal = () => {
        this.setState({
            openModal: true,
            openEditModal: false,
            form_message: "",
            global_msg: { message: "" },
        });
    };

    handleCloseModal = () => {
        this.setState({ openModal: false, openEditModal: false });
    };

    handleArchiveCheckedRows = (archived) => {
        this.setState({ archived: archived });
    };

    showArchiveOrders = (type) => {
        let btndisplayarchive = "inline-block";
        let btndisplayactive = "none";
        if (type == "archived") {
            btndisplayarchive = "none";
            btndisplayactive = "inline-block";
        }
        this.setState({
            showarchivedata: btndisplayarchive,
            showactivedata: btndisplayactive,
            statusfield: type,
        });
        this.getData({ page: 1, statusfield: type, statusfilter: "" });
    };

    getsearch_params = () => {
        const urlparams = new URLSearchParams(window.location.search);
        let searchparamval = urlparams.get("search");
        let searchState = {
            searchtext: searchparamval,
        };
        localStorage["searchState"] = JSON.stringify(searchState);
    };

    handleAddOrderDate = (newValue) => {
        let fdate = "";
        if (newValue !== null && newValue !== undefined) {
            let monp1 = parseInt(newValue["$M"]) + 1;
            let mons = monp1.toString().padStart(2, 0);
            let days = newValue["$D"].toString().padStart(2, 0);
            let yr = newValue["$y"];
            let hr = newValue["$H"];
            let min = newValue["$m"];
            let sec = newValue["$s"];
            fdate =
                mons + "/" + days + "/" + yr + " " + hr + ":" + min + ":" + sec;
        }
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                order_date: fdate,
            },
        }));
    };

    handleAddStoreId = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                return_store_id: value,
            },
        }));
    };

    handleAddOrderNumber = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                order_number: value,
            },
        }));
    };

    handleAddTrackingNumber = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                tracking_number: value,
            },
        }));
    };

    handleAddShippingCountry = (e) => {
        let value = e.target.innerText;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                shipping_country: value,
            },
        }));
    };

    handleAddBuyerName = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                buyer_name: value,
            },
        }));
    };

    handleAddBuyerStreet = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                buyer_street_number: value,
            },
        }));
    };

    handleAddBuyerPostal = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                buyer_postal_code: value,
            },
        }));
    };

    handleAddPackingCondition = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                packing_condition: value,
            },
        }));
    };

    handleAddItemCondition = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                item_condition: value,
            },
        }));
    };

    handleAddReturnNotes = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                return_notes: value,
            },
        }));
    };

    handleAddItemReturned = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                no_items_returned: value,
            },
        }));
    };

    handleAddPostageDue = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                postage_due: value,
            },
        }));
    };

    handleAddBilledReturn = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            newOrderReturns: {
                ...prevState.newOrderReturns,
                billed_return: value,
            },
        }));
    };

    handleEditSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let returnsData = this.state.newOrderReturns;

        axios
            .post("api/addUpdateOrderReturn", returnsData)
            .then((response) => {
                this.setState({
                    openEditModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message: "Edit Return Order updated successfully!",
                    },
                });
                this.getData({ page: 1 });
                this.setState({ form_message: "", ...returnsData });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;

                if (
                    error.response.status == 500 &&
                    error.response.config.data.return_store_id == undefined
                ) {
                    this.state.formSubmitting = false;
                    msg += "The store name field is required.\r\n";
                    this.setState({ formSubmitting: false, form_message: msg });
                } else {
                    if (
                        typeof errors.return_store_id !== "undefined" &&
                        errors.return_store_id.length > 0
                    ) {
                        msg += "The store name field is required." + "\r\n";
                    }

                    if (
                        typeof errors.shipping_country !== "undefined" &&
                        errors.shipping_country.length > 0
                    ) {
                        msg += errors.shipping_country[0] + "\r\n";
                    }

                    if (
                        typeof errors.order_date !== "undefined" &&
                        errors.order_date.length > 0
                    ) {
                        msg += errors.order_date[0] + "\r\n";
                    }

                    if (
                        typeof errors.order_number !== "undefined" &&
                        errors.order_number.length > 0
                    ) {
                        msg += errors.order_number[0] + "\r\n";
                    }

                    if (
                        typeof errors.buyer_name !== "undefined" &&
                        errors.buyer_name.length > 0
                    ) {
                        msg += errors.buyer_name[0] + "\r\n";
                    }

                    if (
                        typeof errors.buyer_street_number !== "undefined" &&
                        errors.buyer_street_numberlength > 0
                    ) {
                        msg += errors.buyer_street_number[0] + "\r\n";
                    }

                    if (
                        typeof errors.buyer_postal_code !== "undefined" &&
                        errors.buyer_postal_code.length > 0
                    ) {
                        msg += errors.buyer_postal_code[0] + "\r\n";
                    }

                    if (
                        typeof errors.tracking_number !== "undefined" &&
                        errors.tracking_number.length > 0
                    ) {
                        msg += errors.tracking_number[0] + "\r\n";
                    }

                    if (
                        typeof errors.packing_condition !== "undefined" &&
                        errors.packing_condition.length > 0
                    ) {
                        msg += errors.packing_condition[0] + "\r\n";
                    }

                    if (
                        typeof errors.item_condition !== "undefined" &&
                        errors.item_condition.length > 0
                    ) {
                        msg += errors.item_condition[0] + "\r\n";
                    }

                    if (
                        typeof errors.no_items_returned !== "undefined" &&
                        errors.no_items_returned.length > 0
                    ) {
                        msg += errors.no_items_returned[0] + "\r\n";
                    }

                    if (
                        typeof errors.postage_due !== "undefined" &&
                        errors.postage_due.length > 0
                    ) {
                        msg += errors.postage_due[0] + "\r\n";
                    }

                    if (
                        typeof errors.billed_return !== "undefined" &&
                        errors.billed_return.length > 0
                    ) {
                        msg += errors.billed_return[0] + "\r\n";
                    }

                    this.setState({ formSubmitting: false, form_message: msg });
                }
            });
    }

    handleOrderReturnsSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let returnsData = this.state.newOrderReturns;

        axios
            .post("api/addUpdateOrderReturn", returnsData)
            .then((response) => {
                this.setState({
                    openModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message: "New Return Order added successfully!",
                    },
                });
                this.getData({ page: 1 });
                this.setState({ form_message: "", ...returnsData });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;

                if (
                    typeof errors.return_store_id !== "undefined" &&
                    errors.return_store_id.length > 0
                ) {
                    msg += "The store name field is required." + "\r\n";
                }

                if (
                    typeof errors.shipping_country !== "undefined" &&
                    errors.shipping_country.length > 0
                ) {
                    msg += errors.shipping_country[0] + "\r\n";
                }

                if (
                    typeof errors.order_date !== "undefined" &&
                    errors.order_date.length > 0
                ) {
                    msg += errors.order_date[0] + "\r\n";
                }

                if (
                    typeof errors.order_number !== "undefined" &&
                    errors.order_number.length > 0
                ) {
                    msg += errors.order_number[0] + "\r\n";
                }

                if (
                    typeof errors.buyer_name !== "undefined" &&
                    errors.buyer_name.length > 0
                ) {
                    msg += errors.buyer_name[0] + "\r\n";
                }

                if (
                    typeof errors.buyer_street_number !== "undefined" &&
                    errors.buyer_street_number.length > 0
                ) {
                    msg += errors.buyer_street_number[0] + "\r\n";
                }

                if (
                    typeof errors.buyer_postal_code !== "undefined" &&
                    errors.buyer_postal_code.length > 0
                ) {
                    msg += errors.buyer_postal_code[0] + "\r\n";
                }

                if (
                    typeof errors.tracking_number !== "undefined" &&
                    errors.tracking_number.length > 0
                ) {
                    msg += errors.tracking_number[0] + "\r\n";
                }

                if (
                    typeof errors.packing_condition !== "undefined" &&
                    errors.packing_condition.length > 0
                ) {
                    msg += errors.packing_condition[0] + "\r\n";
                }

                if (
                    typeof errors.item_condition !== "undefined" &&
                    errors.item_condition.length > 0
                ) {
                    msg += errors.item_condition[0] + "\r\n";
                }

                if (
                    typeof errors.no_items_returned !== "undefined" &&
                    errors.no_items_returned.length > 0
                ) {
                    msg += errors.no_items_returned[0] + "\r\n";
                }

                if (
                    typeof errors.postage_due !== "undefined" &&
                    errors.postage_due.length > 0
                ) {
                    msg += errors.postage_due[0] + "\r\n";
                }

                if (
                    typeof errors.billed_return !== "undefined" &&
                    errors.billed_return.length > 0
                ) {
                    msg += errors.billed_return[0] + "\r\n";
                }

                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleDropdownModal = (event) => {
        this.setState({ openModal: true, global_msg: { message: "" } });

        axios.get("api/packingcondition-list").then((response) => {
            this.setState({ packingoptions: response.data.packing });
        });

        axios.get("api/itemcondition-list").then((response) => {
            this.setState({ itemoptions: response.data.item });
        });

        axios.get("api/shippingcountry-list").then((response) => {
            const shipping_options = [];
            response.data.shipping.forEach(function (key) {
                let row_grid_data = {
                    value: key.shipping_country,
                    label: key.shipping_country,
                };
                shipping_options.push(row_grid_data);
            });
            this.setState({ shippingoptions: shipping_options });
        });

        axios.get("api/adminstore-list").then((response) => {
            const store_options = [];
            response.data.stores.forEach(function (key) {
                let row_grid_data = {
                    value: key.StoreID,
                    label: key.StoreID + " - " + key.StoreName,
                };
                store_options.push(row_grid_data);
            });
            this.setState({ adminstoreoptions: store_options });
        });
    };

    handleEditOpenModal = (id) => {
        axios.get("api/showReturnOrderAdmin/" + id).then((response) => {
            let adminStoreSelected = {
                value: 0,
                label: "",
            };

            let getStoreID = 0;

            if (response.data.order.StoreID) {
                adminStoreSelected = {
                    value: response.data.order.StoreID,
                    label:
                        response.data.order.StoreID +
                        " - " +
                        response.data.order.StoreName,
                };

                getStoreID = response.data.order.StoreID;
            }

            this.setState({
                newOrderReturns: {
                    return_order_id: response.data.order.id,
                    return_store_id: getStoreID,
                    order_date: response.data.order.order_date,
                    order_number: response.data.order.order_number,
                    tracking_number: response.data.order.tracking_number,
                    shipping_country: response.data.order.shipping_country,
                    buyer_name: response.data.order.buyer_name,
                    buyer_street_number:
                        response.data.order.buyer_street_number,
                    buyer_postal_code: response.data.order.buyer_postal_code,
                    packing_condition: response.data.order.packing_condition,
                    item_condition: response.data.order.item_condition,
                    return_notes: response.data.order.return_notes,
                    no_items_returned: response.data.order.no_items_returned,
                    postage_due: response.data.order.postage_due,
                    billed_return: response.data.order.billed_return,
                },
                storeSelected: adminStoreSelected,
                openEditModal: true,
                global_msg: { message: "" },
            });
        });

        axios.get("api/packingcondition-list").then((response) => {
            this.setState({ packingoptions: response.data.packing });
        });

        axios.get("api/itemcondition-list").then((response) => {
            this.setState({ itemoptions: response.data.item });
        });

        axios.get("api/shippingcountry-list").then((response) => {
            const shipping_options = [];
            response.data.shipping.forEach(function (key) {
                let row_grid_data = {
                    value: key.shipping_country,
                    label: key.shipping_country,
                };
                shipping_options.push(row_grid_data);
            });
            this.setState({ shippingoptions: shipping_options });
        });

        axios.get("api/adminstore-list").then((response) => {
            const store_options = [];
            response.data.stores.forEach(function (key) {
                let row_grid_data = {
                    value: key.StoreID,
                    label: key.StoreID + " - " + key.StoreName,
                };
                store_options.push(row_grid_data);
            });
            this.setState({ adminstoreoptions: store_options });
        });
    };

    render() {
        const fullWidth = true;
        const maxWidth = "md";

        const renderOptionStore = (props, option) => {
            const { value, label } = option;
            return (
                <MenuItem {...props} key={value} value={value}>
                    {label}
                </MenuItem>
            );
        };

        const renderOptionShipping = (props, option) => {
            const { value, label } = option;
            return (
                <MenuItem {...props} key={value} value={value}>
                    {label}
                </MenuItem>
            );
        };

        const modalContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    component={"form"}
                    onSubmit={this.handleOrderReturnsSubmit}
                >
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
                            Add New Return
                            {this.state.form_message != "" && (
                                <Alert severity="error">
                                    {this.state.form_message}
                                </Alert>
                            )}
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "25px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <InputLabel>Store Name</InputLabel>
                                    <Autocomplete
                                        disablePortal
                                        id="return_store_id"
                                        name="return_store_id"
                                        style={{ height: "auto" }}
                                        options={this.state.adminstoreoptions}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            option.value === value.value
                                        }
                                        onChange={this.handleAddStoreId}
                                        className="table-filters filter_selects"
                                        fullWidth
                                        renderOption={renderOptionStore}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Type to select store."
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <InputLabel>Shipping Country</InputLabel>
                                    <Autocomplete
                                        disablePortal
                                        id="shipping_country"
                                        name="shipping_country"
                                        style={{ height: "auto" }}
                                        options={this.state.shippingoptions}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            option.value === value.value
                                        }
                                        onChange={this.handleAddShippingCountry}
                                        className="table-filters filter_selects"
                                        fullWidth
                                        renderOption={renderOptionShipping}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Type to select country."
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <div
                                        style={{
                                            marginBottom: "20px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        <InputLabel>Return Date</InputLabel>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DesktopDateTimePicker
                                                id="order_date"
                                                name="order_date"
                                                inputFormat="M/D/YYYY HH:mm:ss"
                                                value={
                                                    this.state.newOrderReturns
                                                        .order_date
                                                }
                                                onChange={
                                                    this.handleAddOrderDate
                                                }
                                                className="table-filters filter_selects date-picker-field"
                                                fullWidth
                                                renderInput={(params) => (
                                                    <TextField {...params} />
                                                )}
                                                ampm={false}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="order_number"
                                        name="order_number"
                                        label="Order Number"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddOrderNumber}
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="tracking_number"
                                        name="tracking_number"
                                        label="Tracking Number"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddTrackingNumber}
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="buyer_name"
                                        name="buyer_name"
                                        label="Buyer Name"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddBuyerName}
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="buyer_street_number"
                                        name="buyer_street_number"
                                        label="Buyer Street Number"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddBuyerStreet}
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="buyer_postal_code"
                                        name="buyer_postal_code"
                                        label="Buyer Postal Code"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddBuyerPostal}
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "25px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <InputLabel>Package Condition</InputLabel>
                                    <Select
                                        label="Package Condition"
                                        className="table-filters custom-select-style"
                                        fullWidth
                                        id="packing_condition"
                                        name="packing_condition"
                                        onChange={
                                            this.handleAddPackingCondition
                                        }
                                    >
                                        <MenuItem key={0} value="">
                                            {" "}
                                            Select{" "}
                                        </MenuItem>
                                        {this.state.packingoptions.map(
                                            (row) => (
                                                <MenuItem
                                                    key={row.packing_condition}
                                                    value={
                                                        row.packing_condition
                                                    }
                                                >
                                                    {row.packing_condition}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <InputLabel>Item Condition</InputLabel>
                                    <Select
                                        label="Item Condition"
                                        className="table-filters custom-select-style"
                                        fullWidth
                                        id="item_condition"
                                        name="item_condition"
                                        onChange={this.handleAddItemCondition}
                                    >
                                        <MenuItem key={0} value="">
                                            {" "}
                                            Select{" "}
                                        </MenuItem>
                                        {this.state.itemoptions.map((row) => (
                                            <MenuItem
                                                key={row.item_condition}
                                                value={row.item_condition}
                                            >
                                                {row.item_condition}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="return_notes"
                                        name="return_notes"
                                        label="Notes"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddReturnNotes}
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="no_items_returned"
                                        name="no_items_returned"
                                        label="No. Items Returned"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddItemReturned}
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="postage_due"
                                        name="postage_due"
                                        label="Postage Due"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddPostageDue}
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <div
                                        style={{
                                            marginBottom: "20px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        <InputLabel>Billed Return</InputLabel>
                                        <Select
                                            label="Billed Return"
                                            className="table-filters custom-select-style"
                                            fullWidth
                                            id="billed_return"
                                            name="billed_return"
                                            onChange={
                                                this.handleAddBilledReturn
                                            }
                                        >
                                            <MenuItem key={0} value="">
                                                {" "}
                                                Select{" "}
                                            </MenuItem>
                                            {this.state.billedoptions.map(
                                                (row) => (
                                                    <MenuItem
                                                        key={row.id}
                                                        value={row.value}
                                                    >
                                                        {row.value}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </div>
                                </Box>
                            </Box>
                        </Typography>
                        <div className="form_btns">
                            <Button
                                type={"button"}
                                color="inherit"
                                onClick={this.handleCloseModal}
                            >
                                Cancel
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

        const modalEditContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openEditModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="editOrderForm"
                    component={"form"}
                    onSubmit={this.handleEditSubmit}
                >
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
                            Edit New Return
                            {this.state.form_message != "" && (
                                <Alert severity="error">
                                    {this.state.form_message}
                                </Alert>
                            )}
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "25px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <InputLabel>Store Name</InputLabel>
                                    <Autocomplete
                                        disablePortal
                                        id="return_store_id"
                                        name="return_store_id"
                                        style={{ height: "auto" }}
                                        options={this.state.adminstoreoptions}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            option.value === value.value
                                        }
                                        onChange={this.handleAddStoreId}
                                        className="table-filters filter_selects"
                                        fullWidth
                                        renderOption={renderOptionStore}
                                        defaultValue={this.state.storeSelected}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Type to select store."
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <InputLabel>Shipping Country</InputLabel>
                                    <Autocomplete
                                        disablePortal
                                        id="shipping_country"
                                        name="shipping_country"
                                        style={{ height: "auto" }}
                                        options={this.state.shippingoptions}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            option.value === value.value
                                        }
                                        onChange={this.handleAddShippingCountry}
                                        className="table-filters filter_selects"
                                        fullWidth
                                        renderOption={renderOptionShipping}
                                        defaultValue={{
                                            value: this.state.newOrderReturns
                                                .shipping_country,
                                            label: this.state.newOrderReturns
                                                .shipping_country,
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Type to select country."
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <div
                                        style={{
                                            marginBottom: "20px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        <InputLabel>Return Date</InputLabel>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DesktopDateTimePicker
                                                id="order_date"
                                                name="order_date"
                                                inputFormat="M/D/YYYY HH:mm:ss"
                                                value={
                                                    this.state.newOrderReturns
                                                        .order_date
                                                }
                                                onChange={
                                                    this.handleAddOrderDate
                                                }
                                                className="table-filters filter_selects date-picker-field"
                                                fullWidth
                                                renderInput={(params) => (
                                                    <TextField {...params} />
                                                )}
                                                ampm={false}
                                                defaultValue={
                                                    this.state.newOrderReturns
                                                        .order_date
                                                }
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="order_number"
                                        name="order_number"
                                        label="Order Number"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddOrderNumber}
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .order_number
                                        }
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="tracking_number"
                                        name="tracking_number"
                                        label="Tracking Number"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddTrackingNumber}
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .tracking_number
                                        }
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="buyer_name"
                                        name="buyer_name"
                                        label="Buyer Name"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddBuyerName}
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .buyer_name
                                        }
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="buyer_street_number"
                                        name="buyer_street_number"
                                        label="Buyer Street Number"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddBuyerStreet}
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .buyer_street_number
                                        }
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="buyer_postal_code"
                                        name="buyer_postal_code"
                                        label="Buyer Postal Code"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddBuyerPostal}
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .buyer_postal_code
                                        }
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "25px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <InputLabel>Package Condition</InputLabel>
                                    <Select
                                        label="Package Condition"
                                        className="table-filters custom-select-style"
                                        fullWidth
                                        id="packing_condition"
                                        name="packing_condition"
                                        onChange={
                                            this.handleAddPackingCondition
                                        }
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .packing_condition
                                        }
                                    >
                                        <MenuItem key={0} value="">
                                            {" "}
                                            Select{" "}
                                        </MenuItem>
                                        {this.state.packingoptions.map(
                                            (row) => (
                                                <MenuItem
                                                    key={row.packing_condition}
                                                    value={
                                                        row.packing_condition
                                                    }
                                                >
                                                    {row.packing_condition}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <InputLabel>Item Condition</InputLabel>
                                    <Select
                                        label="Item Condition"
                                        className="table-filters custom-select-style"
                                        fullWidth
                                        id="item_condition"
                                        name="item_condition"
                                        onChange={this.handleAddItemCondition}
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .item_condition
                                        }
                                    >
                                        {this.state.itemoptions.map((row) => (
                                            <MenuItem
                                                key={row.item_condition}
                                                value={row.item_condition}
                                            >
                                                {row.item_condition}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="return_notes"
                                        name="return_notes"
                                        label="Notes"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddReturnNotes}
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .return_notes
                                        }
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="no_items_returned"
                                        name="no_items_returned"
                                        label="No. Items Returned"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddItemReturned}
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .no_items_returned
                                        }
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            component="div"
                            style={{ marginBottom: "8px" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="postage_due"
                                        name="postage_due"
                                        label="Postage Due"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        onChange={this.handleAddPostageDue}
                                        defaultValue={
                                            this.state.newOrderReturns
                                                .postage_due
                                        }
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <div
                                        style={{
                                            marginBottom: "20px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        <InputLabel>Billed Return</InputLabel>
                                        <Select
                                            label="Billed Return"
                                            className="table-filters custom-select-style"
                                            fullWidth
                                            id="billed_return"
                                            name="billed_return"
                                            onChange={
                                                this.handleAddBilledReturn
                                            }
                                            defaultValue={
                                                this.state.newOrderReturns
                                                    .billed_return
                                            }
                                        >
                                            {this.state.billedoptions.map(
                                                (row) => (
                                                    <MenuItem
                                                        key={row.id}
                                                        value={row.value}
                                                    >
                                                        {row.value}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </div>
                                </Box>
                            </Box>
                        </Typography>
                        <div className="form_btns">
                            <Button
                                type={"button"}
                                color="inherit"
                                onClick={this.handleCloseModal}
                            >
                                Cancel
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
            <React.Fragment>
                <Typography
                    component="div"
                    className="pagedescription"
                    display={this.state.showdesc}
                />
                <Box
                    className="subpage_graph_sort_cnt"
                    style={{ top: "-20px" }}
                >
                    <Button
                        type="button"
                        variant="outlined"
                        className="export_button addbtn"
                        onClick={this.handleDropdownModal}
                    >
                        <AddIcon /> Add Return Form
                    </Button>
                </Box>
                <Box className="data_grid_container">
                    {this.state.global_msg.message != "" && (
                        <Alert
                            style={{ marginBottom: "20px" }}
                            severity={this.state.global_msg.type}
                        >
                            {this.state.global_msg.message}
                        </Alert>
                    )}

                    <DataGridPremium
                        rows={this.state.gridrows}
                        columns={this.state.gridcolumns}
                        pageSize={this.state.pagesize}
                        rowsPerPageOptions={[10]}
                        pagination
                        checkboxSelection
                        onSelectionModelChange={(ids) => {
                            const selectedIDs = new Set(ids);
                            const selectedRows = this.state.gridrows.filter(
                                (row) => selectedIDs.has(row.id)
                            );

                            this.handleArchiveCheckedRows(selectedRows);
                        }}
                        disableSelectionOnClick
                        components={{ Toolbar: GridToolbar }}
                        componentsProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        getCellClassName={(params) => {
                            if (params.field === "packing_condition") {
                                return (
                                    "st" +
                                    params.value
                                        .replace(/ /g, "")
                                        .substring(0, 5)
                                );
                            } else if (params.field === "item_condition") {
                                return (
                                    "st" +
                                    params.value
                                        .replace(/ /g, "")
                                        .substring(0, 5)
                                );
                            } else {
                                return "";
                            }
                        }}
                        initialState={{
                            filter: {
                                filterModel: {
                                    items: [
                                        {
                                            id: 1,
                                            columnField: "order_number",
                                            operatorValue: "contains",
                                            value: this.state.searchValue,
                                        },
                                        {
                                            id: 2,
                                            columnField: "buyer_name",
                                            operatorValue: "contains",
                                            value: this.state.searchValue,
                                        },
                                        {
                                            id: 3,
                                            columnField: "tracking_number",
                                            operatorValue: "contains",
                                            value: this.state.searchValue,
                                        },
                                    ],
                                    linkOperator: GridLinkOperator.Or,
                                },
                            },
                        }}
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                    <div className="datagrid_pagination_bg"></div>
                </Box>

                {modalContainer}
                {modalEditContainer}
            </React.Fragment>
        );
    }
}

export default StoreReturnsForm;
