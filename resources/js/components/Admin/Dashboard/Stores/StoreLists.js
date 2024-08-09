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

class StoreLists extends Component {
    constructor(props) {
        super(props);

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "store_name",
                headerName: "Store Name",
                width: 300,
            },
            {
                field: "first_name",
                headerName: "First Name",
                flex: 1,
                hide: true,
            },
            {
                field: "last_name",
                headerName: "Last Name",
                flex: 1,
                hide: true,
            },
            {
                field: "customer",
                headerName: "Customer",
                sortable: false,
                width: 350,
                valueGetter: (params) =>
                    `${params.row.first_name || ""} ${
                        params.row.last_name || ""
                    }`,
            },
            {
                field: "editing_status",
                headerName: "Editing Status",
                width: 200,
                renderCell: (params) => {
                    let editstat =
                        params.row.editing_status == null ||
                        params.row.editing_status == ""
                            ? "Enable"
                            : params.row.editing_status;

                    return editstat;
                },
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                getActions: (params) => [
                    <Button
                        onClick={this.handleDisableEditingModal.bind(
                            this,
                            params.row.id
                        )}
                        className="custbtn adminactionbtn autowidth"
                        style={
                            params.row.editing_status == null ||
                            params.row.editing_status == "" ||
                            params.row.editing_status == "Enable"
                                ? { display: "block" }
                                : { display: "none" }
                        }
                    >
                        Disable Editing Now
                    </Button>,
                    <Button
                        onClick={this.handleDisableEditingModal.bind(
                            this,
                            params.row.id
                        )}
                        className="custbtn autowidth defaultdarkbtn hoverblacktext"
                        style={
                            params.row.editing_status == null ||
                            params.row.editing_status == "" ||
                            params.row.editing_status == "Enable"
                                ? { display: "none" }
                                : { display: "block" }
                        }
                    >
                        Enable Editing Now
                    </Button>,
                    <Button
                        onClick={this.handleDisableSettingModal.bind(
                            this,
                            params.row.id
                        )}
                        className="custbtn adminactionbtn autowidth"
                    >
                        Schedule Disable Editing
                    </Button>,
                    <Button
                        onClick={this.handleEditModal.bind(this, params.row.id)}
                        className="custbtn adminactionbtn autowidth"
                    >
                        <span className="edit_icon" /> Edit
                    </Button>,
                    <Button
                        onClick={this.handleDeleteModal.bind(
                            this,
                            params.row.id
                        )}
                        className="custbtn adminactionbtn autowidth"
                    >
                        <span className="delete_icon" /> Delete
                    </Button>,
                ],
                //   flex:1,
                width: 500,
            },
        ];

        const defaultrows = [];

        this.state = {
            title: props.Title,
            global_msg: {
                type: "error",
                message: "",
            },
            data: [],
            stores: [],
            openModal: false,
            editModal: false,
            deleteModal: false,
            disablesettingModal: false,
            disableeditingModal: false,
            formSubmitting: false,
            message: "",
            store: {
                store_ids: 0,
                store_id: 0,
                store_name: "",
                quickbooksid: "",
                country: "",
                customer: 0,
                editing_status: "",
                disable_date: null,
                disable_enddate: null,
                disable_time: "",
                disable_endtime: "",
                disable_type: "Daily",
                disable_stime_field: "",
                disable_etime_field: "",
                disable_date2: null,
                disable_enddate2: null,
                disable_time2: "",
                disable_endtime2: "",
                disable_stime_field2: "",
                disable_etime_field2: "",
            },
            user: {
                invoice: true,
                storage_cost: true,
                storage_calculator: true,
                held: true,
                openorders: true,
                intransit: true,
                delayed: true,
                returns: true,
                receiving: true,
                low_stock: true,
                no_stock: true,
                open_orders: true,
                in_transit: true,
                delay_transit: true,
                invoicing: true,
                held_orders: true,
                return_orders: true,
                receiving_inventory: true,
                addshipment_inventory: true,
                no_stock_inventory: true,
                product_inventory: true,
                ustous_pricing: true,
                ustononus_pricing: true,
                uktouk_pricing: true,
                uktoeu_pricing: true,
                safelist: true,
                edithistory: true,
                reports: true,
                safelistshipments: true,
                uspsdelayedshipments: true,
                product_bundles: true,
                inventory_manager: true,
                add_receiving_button: true,
                add_receiving_wholesale_button: true,
                add_shipments_button: true,
                add_product_button: true,
                add_bundle_button: true,
                wrongitemssent: true,
                dailyitemsdelivered: true,
            },
            customers: [],
            showdesc: "block",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 20,
            showdatedivs: "hide_imp",
            currentdate: "",
        };

        this.handleStoreSubmit = this.handleStoreSubmit.bind(this);
        this.handleStoreEditSubmit = this.handleStoreEditSubmit.bind(this);
        this.handleStoreDeleteSubmit = this.handleStoreDeleteSubmit.bind(this);
        this.handleStoreID = this.handleStoreID.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleQuickbooksID = this.handleQuickbooksID.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.handleChangeCustomer = this.handleChangeCustomer.bind(this);
        this.handleStoreDisableEditingSubmit =
            this.handleStoreDisableEditingSubmit.bind(this);
        this.handleDisableDateChange = this.handleDisableDateChange.bind(this);
        this.handleDisableEndDateChange =
            this.handleDisableEndDateChange.bind(this);
        this.handleDisableTimeChange = this.handleDisableTimeChange.bind(this);
        this.handleStoreDisableSettingSubmit =
            this.handleStoreDisableSettingSubmit.bind(this);
    }

    componentDidMount() {
        this.getData({ page: 1 });
    }

    getData = (data) => {
        // axios.get('api/stores?page=' + data.page).then(response => {
        //     this.setState({stores:response.data.stores.data, data:response.data.stores, customers:response.data.customers});
        // });
        axios.get("api/stores").then((response) => {
            this.setState({
                stores: response.data.stores.data,
                data: response.data.stores,
                customers: response.data.customers,
            });
            let fullgriddata = [];
            let ctrgrid = 1;
            response.data.stores.forEach(function (key) {
                let storestatus =
                    typeof response.data.storestatus[key.id] !== "undefined" &&
                    response.data.storestatus[key.id].length > 0
                        ? response.data.storestatus[key.id]
                        : null;
                let editstats =
                    key.editing_status == "Forced Enable"
                        ? "Enable"
                        : key.editing_status;
                if (storestatus != null) {
                    editstats =
                        storestatus[0].editstatus != ""
                            ? storestatus[0].editstatus
                            : editstats;
                }
                let row_grid_data = {
                    id: key.id,
                    store_name: key.store_name,
                    first_name: key.user.first_name,
                    last_name: key.user.last_name,
                    actions: key.id,
                    editing_status: editstats,
                };
                fullgriddata.push(row_grid_data);
                ctrgrid++;
            });
            this.setState({ gridrows: fullgriddata });
        });
    };
    handleOpenModal = () => {
        this.setState({ openModal: true });
    };

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            editModal: false,
            deleteModal: false,
            disablesettingModal: false,
            disableeditingModal: false,
            global_msg: { message: "" },
        });
    };

    handleStoreSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let userData = this.state.store;
        userData.user = this.state.user;

        axios
            .post("api/add-store", userData)
            .then((response) => {
                this.setState({ openModal: false, formSubmitting: false });
                this.getData({ page: 1 });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.store_name !== "undefined" &&
                    errors.store_name.length > 0
                ) {
                    msg += errors.store_name[0] + "\r\n";
                }
                if (
                    typeof errors.customer !== "undefined" &&
                    errors.customer.length > 0
                ) {
                    msg += errors.customer[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, message: msg });
            });
    }

    handleStoreEditSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let storeDate = this.state.store;
        storeDate.user = this.state.user;

        axios
            .post("api/edit-store", storeDate)
            .then((response) => {
                this.setState({
                    editModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Store " +
                            this.state.store.store_name +
                            " updated successfully!",
                    },
                });
                this.getData({ page: 1 });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.store_name !== "undefined" &&
                    errors.store_name.length > 0
                ) {
                    msg += errors.store_name[0] + "\r\n";
                }
                if (
                    typeof errors.customer !== "undefined" &&
                    errors.customer.length > 0
                ) {
                    msg += errors.customer[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, message: msg });
            });
    }

    handleStoreDeleteSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let storeDate = this.state.store;

        axios
            .post("api/delete-store", storeDate)
            .then((response) => {
                this.setState({
                    deleteModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Store " +
                            this.state.store.store_name +
                            " deleted successfully!",
                    },
                });
                this.getData({ page: 1 });
            })
            .catch((error) => {
                this.setState({
                    formSubmitting: false,
                    message: "There's an error. Please try again!",
                });
            });
    }

    handleStoreDisableEditingSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let storeDate = this.state.store;

        axios
            .post("api/disableenable-store", storeDate)
            .then((response) => {
                this.setState({
                    disableeditingModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Successfully updated editing status for " +
                            this.state.store.store_name +
                            "!",
                    },
                });
                this.getData({ page: 1 });
                location.reload(true);
            })
            .catch((error) => {
                this.setState({
                    formSubmitting: false,
                    message: "There's an error. Please try again!",
                });
            });
    }

    handleStoreDisableSettingSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let storeDate = this.state.store;
        let allrequired1 = "";
        let allrequired2 = "";
        let requiremsg = "";
        if (this.state.store.disable_type == "date") {
            allrequired1 =
                this.state.store.disable_date == "" ||
                this.state.store.disable_date == null ||
                this.state.store.disable_enddate == "" ||
                this.state.store.disable_enddate == null ||
                this.state.store.disable_stime_field == "" ||
                this.state.store.disable_stime_field == null ||
                this.state.store.disable_etime_field == "" ||
                this.state.store.disable_etime_field == null
                    ? "At least 1 field is empty."
                    : "";

            allrequired2 =
                this.state.store.disable_date2 == "" ||
                this.state.store.disable_date2 == null ||
                this.state.store.disable_enddate2 == "" ||
                this.state.store.disable_enddate2 == null ||
                this.state.store.disable_stime_field2 == "" ||
                this.state.store.disable_stime_field2 == null ||
                this.state.store.disable_etime_field2 == "" ||
                this.state.store.disable_etime_field2 == null
                    ? "At least 1 field is empty."
                    : "";
        } else {
            allrequired1 =
                this.state.store.disable_stime_field == "" ||
                this.state.store.disable_stime_field == null ||
                this.state.store.disable_etime_field == "" ||
                this.state.store.disable_etime_field == null
                    ? ".At least 1 field is empty."
                    : "";
            allrequired2 =
                this.state.store.disable_stime_field2 == "" ||
                this.state.store.disable_stime_field2 == null ||
                this.state.store.disable_etime_field2 == "" ||
                this.state.store.disable_etime_field2 == null
                    ? "At least 1 field is empty."
                    : "";
        }
        requiremsg =
            allrequired1 != "" && allrequired2 != ""
                ? "Please fill up at least 1 set of group."
                : "";

        if (requiremsg == "") {
            axios
                .post("api/disablesetting-store", storeDate)
                .then((response) => {
                    this.setState({
                        disablesettingModal: false,
                        formSubmitting: false,
                        global_msg: {
                            type: "success",
                            message:
                                "Successfully updated disable settings for " +
                                this.state.store.store_name +
                                "!",
                        },
                    });
                    this.getData({ page: 1 });
                    location.reload(true);
                })
                .catch((error) => {
                    this.setState({
                        formSubmitting: false,
                        message: "There's an error. Please try again!",
                    });
                });
        } else {
            this.setState({ formSubmitting: false, message: requiremsg });
        }
    }

    handleStoreID(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                store_ids: value,
            },
        }));
    }

    handleName(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                store_name: value,
            },
        }));
    }

    handleQuickbooksID(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                quickbooksid: value,
            },
        }));
    }

    handleChangeCustomer(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                customer: value,
            },
        }));
    }

    handleChangeCountry(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                country: value,
            },
        }));
    }

    handleDisableDateChange = (newValue) => {
        let fdate = "";
        if (newValue !== null && newValue !== undefined) {
            let monp1 = parseInt(newValue["$M"]) + 1;
            let mons = monp1.toString().padStart(2, 0);
            let days = newValue["$D"].toString().padStart(2, 0);
            let yr = newValue["$y"];
            fdate = yr + "-" + mons + "-" + days;
        }
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                disable_date: fdate,
            },
        }));
    };
    handleDisableEndDateChange = (newValue) => {
        let fdate = "";
        if (newValue !== null && newValue !== undefined) {
            let monp1 = parseInt(newValue["$M"]) + 1;
            let mons = monp1.toString().padStart(2, 0);
            let days = newValue["$D"].toString().padStart(2, 0);
            let yr = newValue["$y"];
            fdate = yr + "-" + mons + "-" + days;
        }

        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                disable_enddate: fdate,
            },
        }));
    };

    handleDisableTimeChange = (newValue) => {
        let fulltime = "";
        if (newValue !== null && newValue !== undefined) {
            let hour = newValue["$H"].toString().padStart(2, 0);
            let min = newValue["$m"].toString().padStart(2, 0);
            fulltime = hour + ":" + min + ":00";
        }
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                disable_stime_field: newValue,
                disable_time: fulltime,
            },
        }));
    };

    handleDisableEndTimeChange = (newValue) => {
        let fulltime = "";
        if (newValue !== null && newValue !== undefined) {
            let hour = newValue["$H"].toString().padStart(2, 0);
            let min = newValue["$m"].toString().padStart(2, 0);
            fulltime = hour + ":" + min + ":00";
        }
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                disable_etime_field: newValue,
                disable_endtime: fulltime,
            },
        }));
    };

    handleDisableDateChange2 = (newValue) => {
        let fdate = "";
        if (newValue !== null && newValue !== undefined) {
            let monp1 = parseInt(newValue["$M"]) + 1;
            let mons = monp1.toString().padStart(2, 0);
            let days = newValue["$D"].toString().padStart(2, 0);
            let yr = newValue["$y"];
            fdate = yr + "-" + mons + "-" + days;
        }
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                disable_date2: fdate,
            },
        }));
    };
    handleDisableEndDateChange2 = (newValue) => {
        let fdate = "";
        if (newValue !== null && newValue !== undefined) {
            let monp1 = parseInt(newValue["$M"]) + 1;
            let mons = monp1.toString().padStart(2, 0);
            let days = newValue["$D"].toString().padStart(2, 0);
            let yr = newValue["$y"];
            fdate = yr + "-" + mons + "-" + days;
        }

        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                disable_enddate2: fdate,
            },
        }));
    };

    handleDisableTimeChange2 = (newValue) => {
        let fulltime = "";
        if (newValue !== null && newValue !== undefined) {
            let hour = newValue["$H"].toString().padStart(2, 0);
            let min = newValue["$m"].toString().padStart(2, 0);
            fulltime = hour + ":" + min + ":00";
        }
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                disable_stime_field2: newValue,
                disable_time2: fulltime,
            },
        }));
    };

    handleDisableEndTimeChange2 = (newValue) => {
        let fulltime = "";
        if (newValue !== null && newValue !== undefined) {
            let hour = newValue["$H"].toString().padStart(2, 0);
            let min = newValue["$m"].toString().padStart(2, 0);
            fulltime = hour + ":" + min + ":00";
        }
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                disable_etime_field2: newValue,
                disable_endtime2: fulltime,
            },
        }));
    };

    handleEditModal = (id) => {
        axios
            .post("api/get-store", { id: id })
            .then((response) => {
                // this.setState({editModal: true, store: {store_id: response.data.id, store_ids: response.data.store_ids, quickbooksid: response.data.customer_quickbooks_id, store_name: response.data.store_name, country: response.data.country, customer: response.data.user.id}});

                this.setState({
                    editModal: true,
                    store: {
                        store_id: response.data.store.id,
                        store_ids: response.data.store.store_ids,
                        quickbooksid:
                            response.data.store.customer_quickbooks_id,
                        store_name: response.data.store.store_name,
                        country: response.data.store.country,
                        customer: response.data.store.user.id,
                    },
                    user: {
                        invoice: parseInt(response.data.settings.invoice),
                        storage_cost: parseInt(
                            response.data.settings.storage_cost
                        ),
                        storage_calculator: parseInt(
                            response.data.settings.storage_calculator
                        ),
                        intransit: parseInt(response.data.settings.intransit),
                        delayed: parseInt(response.data.settings.delayed),
                        returns: parseInt(response.data.settings.returns),
                        receiving: parseInt(response.data.settings.receiving),
                        low_stock: parseInt(response.data.settings.low_stock),
                        no_stock: parseInt(response.data.settings.no_stock),
                        open_orders: parseInt(
                            response.data.settings.open_orders
                        ),
                        in_transit: parseInt(response.data.settings.in_transit),
                        delay_transit: parseInt(
                            response.data.settings.delay_transit
                        ),
                        invoicing: parseInt(response.data.settings.invoicing),
                        return_orders: parseInt(
                            response.data.settings.return_orders
                        ),
                        receiving_inventory: parseInt(
                            response.data.settings.receiving_inventory
                        ),
                        addshipment_inventory: parseInt(
                            response.data.settings.addshipment_inventory
                        ),
                        no_stock_inventory: parseInt(
                            response.data.settings.no_stock_inventory
                        ),
                        product_inventory: parseInt(
                            response.data.settings.product_inventory
                        ),
                        ustous_pricing: parseInt(
                            response.data.settings.ustous_pricing
                        ),
                        ustononus_pricing: parseInt(
                            response.data.settings.ustononus_pricing
                        ),
                        uktouk_pricing: parseInt(
                            response.data.settings.uktouk_pricing
                        ),
                        uktoeu_pricing: parseInt(
                            response.data.settings.uktoeu_pricing
                        ),
                        safelist: parseInt(response.data.settings.safelist),
                        openorders: parseInt(response.data.settings.openorders),
                        edithistory: parseInt(
                            response.data.settings.edithistory
                        ),
                        reports: parseInt(response.data.settings.reports),
                        safelistshipments: parseInt(
                            response.data.settings.safelistshipments
                        ),
                        uspsdelayedshipments: parseInt(
                            response.data.settings.uspsdelayedshipments
                        ),
                        product_bundles: parseInt(
                            response.data.settings.product_bundles
                        ),
                        inventory_manager: parseInt(
                            response.data.settings.inventory_manager
                        ),
                        add_receiving_button: parseInt(
                            response.data.settings.add_receiving_button
                        ),
                        add_receiving_wholesale_button: parseInt(
                            response.data.settings
                                .add_receiving_wholesale_button
                        ),
                        add_shipments_button: parseInt(
                            response.data.settings.add_shipments_button
                        ),
                        add_product_button: parseInt(
                            response.data.settings.add_product_button
                        ),
                        add_bundle_button: parseInt(
                            response.data.settings.add_bundle_button
                        ),
                        wrongitemssent: parseInt(
                            response.data.settings.wrongitemssent
                        ),
                        dailyitemsdelivered: parseInt(
                            response.data.settings.dailyitemsdelivered
                        ),
                    },
                });
            })
            .catch((error) => {
                this.setState({ editModal: false });
            });
    };

    handleDeleteModal = (id) => {
        axios
            .post("api/get-store", { id: id })
            .then((response) => {
                this.setState({
                    deleteModal: true,
                    store: {
                        store_id: response.data.store.id,
                        store_name: response.data.store.store_name,
                    },
                });
            })
            .catch((error) => {
                this.setState({ deleteModal: false });
            });
    };

    handleDisableEditingModal = (id) => {
        axios
            .post("api/get-store", { id: id })
            .then((response) => {
                this.setState({
                    disableeditingModal: true,
                    store: {
                        store_id: response.data.store.id,
                        store_name: response.data.store.store_name,
                        editing_status: response.data.editstatus,
                    },
                });
            })
            .catch((error) => {
                this.setState({ disableeditingModal: false });
            });
    };

    handleDisableSettingModal = (id) => {
        let cdate = new Date();
        let cday = cdate.getDate().toString().padStart(2, 0);
        let cmon = (cdate.getMonth() + 1).toString().padStart(2, 0);

        // let fulldate = cmon+'-'+cday+'-'+cdate.getFullYear();
        let fulldate = Date().toLocaleString();
        this.setState({ currentdate: fulldate, message: "" });
        axios
            .post("api/get-store", { id: id })
            .then((response) => {
                let disabletype =
                    response.data.store.disable_type == null ||
                    response.data.store.disable_type == ""
                        ? "daily"
                        : response.data.store.disable_type;
                this.setState({
                    disablesettingModal: true,
                    store: {
                        store_id: response.data.store.id,
                        store_name: response.data.store.store_name,
                        editing_status: response.data.store.editing_status,
                        disable_date: response.data.store.disable_date,
                        disable_enddate: response.data.store.disable_enddate,
                        disable_time: response.data.store.disable_time,
                        disable_endtime: response.data.store.disable_endtime,
                        disable_stime_field:
                            response.data.store.disable_stime_field,
                        disable_etime_field:
                            response.data.store.disable_etime_field,
                        disable_type: disabletype,
                        disable_date2: response.data.store.disable_date2,
                        disable_enddate2: response.data.store.disable_enddate2,
                        disable_time2: response.data.store.disable_time2,
                        disable_endtime2: response.data.store.disable_endtime2,
                        disable_stime_field2:
                            response.data.store.disable_stime_field2,
                        disable_etime_field2:
                            response.data.store.disable_etime_field2,
                    },
                });
                if (response.data.store.disable_type == "date") {
                    this.setState({ showdatedivs: "" });
                } else {
                    this.setState({ showdatedivs: "hide_imp" });
                }
            })
            .catch((error) => {
                this.setState({ disableeditingModal: false });
            });
    };
    showdescription = () => {
        let showtoggle = this.state.showdesc == "none" ? "block" : "none";
        this.setState({ showdesc: showtoggle });
    };

    handleChange = (event) => {
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                [event.target.name]: event.target.checked,
            },
        }));
    };
    handleChangeDisableType = (event) => {
        let value = event.target.value;
        if (value == "date") {
            this.setState({ showdatedivs: "" });
        } else {
            this.setState({ showdatedivs: "hide_imp" });
            this.setState((prevState) => ({
                store: {
                    ...prevState.store,
                    disable_enddate: null,
                    disable_date: null,
                    disable_enddate2: null,
                    disable_date2: null,
                },
            }));
        }
        this.setState((prevState) => ({
            store: {
                ...prevState.store,
                disable_type: value,
            },
        }));
    };
    render() {
        const fullWidth = true;
        const maxWidth = "md";

        const countries = ["US", "UK"];

        const modalContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal adminmodal"
            >
                <Box component={"form"} onSubmit={this.handleStoreSubmit}>
                    {/* <DialogTitle id="responsive-dialog-title" className="modal_dia_title">Add Store
					<IconButton
							edge="start"
							color="inherit"
							onClick={this.handleCloseModal}
							aria-label="close"
							className="close_dialog_button"
						>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
			        <DialogContent> */}
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
                            Add Store
                        </Typography>
                        {this.state.message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.message}
                            </Alert>
                        )}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="store_ids"
                            label="Store ID's"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleStoreID}
                        />
                        <span className="sep_coma_span">
                            Separate it with comma(,)
                        </span>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="store_name"
                            label="Store Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleName}
                            required
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="customer_quickbooks_id"
                            label="Quickbooks Customer ID"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleQuickbooksID}
                        />
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="country-simple-select-label">
                                Select Country
                            </InputLabel>
                            <Select
                                labelId="country-simple-select-label"
                                id="country-simple-select"
                                label="Country"
                                required
                                onChange={this.handleChangeCountry}
                            >
                                {countries.map((row) => (
                                    <MenuItem key={row.toString()} value={row}>
                                        {row}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="customer-simple-select-label">
                                Select Customer
                            </InputLabel>
                            <Select
                                labelId="customer-simple-select-label"
                                id="customer-simple-select"
                                label="Customer"
                                required
                                onChange={this.handleChangeCustomer}
                            >
                                {this.state.customers.map((row) => (
                                    <MenuItem key={row.id} value={row.id}>
                                        {row.first_name} {row.last_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            sx={{ mt: 3 }}
                            component="fieldset"
                            variant="standard"
                            className="fieldset_options"
                        >
                            <FormLabel component="legend">
                                Show Sidebars
                            </FormLabel>
                            <FormGroup>
                                <Typography className="option_tab_titles">
                                    Orders Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.open_orders
                                            }
                                            onChange={this.handleChange}
                                            name="open_orders"
                                        />
                                    }
                                    label="Open Orders"
                                />
                                {/* <FormControlLabel
                              control={
                                <Checkbox checked={this.state.user.held_orders} onChange={this.handleChange} name="held_orders" />
                              }
                              label="Held"
                            /> */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.return_orders
                                            }
                                            onChange={this.handleChange}
                                            name="return_orders"
                                        />
                                    }
                                    label="Returns"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.in_transit}
                                            onChange={this.handleChange}
                                            name="in_transit"
                                        />
                                    }
                                    label="In-Transit"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.delay_transit
                                            }
                                            onChange={this.handleChange}
                                            name="delay_transit"
                                        />
                                    }
                                    label="Delayed"
                                />
                                <Typography className="option_tab_titles">
                                    Inventory Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .receiving_inventory
                                            }
                                            onChange={this.handleChange}
                                            name="receiving_inventory"
                                        />
                                    }
                                    label="Receiving"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .addshipment_inventory
                                            }
                                            onChange={this.handleChange}
                                            name="addshipment_inventory"
                                        />
                                    }
                                    label="Add Shipments"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .no_stock_inventory
                                            }
                                            onChange={this.handleChange}
                                            name="no_stock_inventory"
                                        />
                                    }
                                    label="No Stock"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .product_inventory
                                            }
                                            onChange={this.handleChange}
                                            name="product_inventory"
                                        />
                                    }
                                    label="Products"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.product_bundles
                                            }
                                            onChange={this.handleChange}
                                            name="product_bundles"
                                        />
                                    }
                                    label="Bundles"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .inventory_manager
                                            }
                                            onChange={this.handleChange}
                                            name="inventory_manager"
                                        />
                                    }
                                    label="Inventory Manager"
                                />
                                <Typography className="option_tab_titles">
                                    Pricing Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.ustous_pricing
                                            }
                                            onChange={this.handleChange}
                                            name="ustous_pricing"
                                        />
                                    }
                                    label="US to US"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .ustononus_pricing
                                            }
                                            onChange={this.handleChange}
                                            name="ustononus_pricing"
                                        />
                                    }
                                    label="US to Non-US"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.uktouk_pricing
                                            }
                                            onChange={this.handleChange}
                                            name="uktouk_pricing"
                                        />
                                    }
                                    label="UK to UK"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.uktoeu_pricing
                                            }
                                            onChange={this.handleChange}
                                            name="uktoeu_pricing"
                                        />
                                    }
                                    label="UK to EU "
                                />
                                <Typography className="option_tab_titles">
                                    Invoicing Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.invoicing}
                                            onChange={this.handleChange}
                                            name="invoicing"
                                        />
                                    }
                                    label="Invoicing"
                                />
                                <Typography className="option_tab_titles">
                                    Custom Tools Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.safelist}
                                            onChange={this.handleChange}
                                            name="safelist"
                                        />
                                    }
                                    label="Safe Lists"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.edithistory
                                            }
                                            onChange={this.handleChange}
                                            name="edithistory"
                                        />
                                    }
                                    label="Edit History"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.reports}
                                            onChange={this.handleChange}
                                            name="reports"
                                        />
                                    }
                                    label="Reports"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .safelistshipments
                                            }
                                            onChange={this.handleChange}
                                            name="safelistshipments"
                                        />
                                    }
                                    label="Safelist Shipments"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .uspsdelayedshipments
                                            }
                                            onChange={this.handleChange}
                                            name="uspsdelayedshipments"
                                        />
                                    }
                                    label="Delayed Shipments"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.wrongitemssent
                                            }
                                            onChange={this.handleChange}
                                            name="wrongitemssent"
                                        />
                                    }
                                    label="Wrong Items Sent"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .dailyitemsdelivered
                                            }
                                            onChange={this.handleChange}
                                            name="dailyitemsdelivered"
                                        />
                                    }
                                    label="Daily Items Delivered"
                                />
                            </FormGroup>
                            <FormHelperText>Check to display</FormHelperText>
                        </FormControl>
                        <FormControl
                            sx={{ mt: 3 }}
                            component="fieldset"
                            variant="standard"
                            className="width50 showsidescheckbox"
                        >
                            <FormLabel
                                component="legend"
                                className="headershowsides"
                            >
                                Show Dashboard Blocks
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.invoice}
                                            onChange={this.handleChange}
                                            name="invoice"
                                        />
                                    }
                                    label="Invoice"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.storage_cost
                                            }
                                            onChange={this.handleChange}
                                            name="storage_cost"
                                        />
                                    }
                                    label="Storage Cost"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .storage_calculator
                                            }
                                            onChange={this.handleChange}
                                            name="storage_calculator"
                                        />
                                    }
                                    label="Storage Calculator"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.openorders}
                                            onChange={this.handleChange}
                                            name="openorders"
                                        />
                                    }
                                    label="Open Orders"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.intransit}
                                            onChange={this.handleChange}
                                            name="intransit"
                                        />
                                    }
                                    label="In Transit"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.delayed}
                                            onChange={this.handleChange}
                                            name="delayed"
                                        />
                                    }
                                    label="Delayed"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.returns}
                                            onChange={this.handleChange}
                                            name="returns"
                                        />
                                    }
                                    label="Return Orders"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.receiving}
                                            onChange={this.handleChange}
                                            name="receiving"
                                        />
                                    }
                                    label="Receiving"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.low_stock}
                                            onChange={this.handleChange}
                                            name="low_stock"
                                        />
                                    }
                                    label="Low Stock"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.no_stock}
                                            onChange={this.handleChange}
                                            name="no_stock"
                                        />
                                    }
                                    label="No Stock"
                                />
                            </FormGroup>
                            <FormHelperText>Check to display</FormHelperText>
                        </FormControl>
                        <FormControl
                            sx={{ mt: 3 }}
                            component="fieldset"
                            variant="standard"
                            className="fieldset_options"
                        >
                            <FormLabel component="legend">
                                Show Functional Buttons
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_receiving_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_receiving_button"
                                        />
                                    }
                                    label="Add Receiving (Default)"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_receiving_wholesale_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_receiving_wholesale_button"
                                        />
                                    }
                                    label="Add Receiving (Wholesale)"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_shipments_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_shipments_button"
                                        />
                                    }
                                    label="Add Shipment"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_product_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_product_button"
                                        />
                                    }
                                    label="Add Product"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_bundle_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_bundle_button"
                                        />
                                    }
                                    label="Add Bundle"
                                />
                            </FormGroup>
                            <FormHelperText>Check to display</FormHelperText>
                        </FormControl>
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
                open={this.state.editModal}
                onClose={this.handleCloseModal}
                className="ordermodal adminmodal"
            >
                <Box component={"form"} onSubmit={this.handleStoreEditSubmit}>
                    {/* <DialogTitle id="responsive-dialog-title" className="modal_dia_title">Edit {this.state.store.store_name} Store
					<IconButton
							edge="start"
							color="inherit"
							onClick={this.handleCloseModal}
							aria-label="close"
							className="close_dialog_button"
						>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
			        <DialogContent> */}
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
                            Edit {this.state.store.store_name} Store
                        </Typography>
                        {this.state.message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.message}
                            </Alert>
                        )}
                        <TextField
                            hiddenLabel
                            id="store_id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.store.store_id}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="store_ids"
                            label="Store ID's"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={this.state.store.store_ids}
                            onChange={this.handleStoreID}
                        />
                        <span className="sep_coma_span">
                            Separate it with comma(,)
                        </span>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="store_name"
                            label="Store Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={this.state.store.store_name}
                            onChange={this.handleName}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="customer_quickbooks_id"
                            label="Quickbooks Customer ID"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={this.state.store.quickbooksid}
                            onChange={this.handleQuickbooksID}
                        />
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="country-simple-select-label">
                                Select Country
                            </InputLabel>
                            <Select
                                labelId="country-simple-select-label"
                                id="country-simple-select"
                                label="Country"
                                defaultValue={this.state.store.country}
                                onChange={this.handleChangeCountry}
                            >
                                {countries.map((row) => (
                                    <MenuItem key={row.toString()} value={row}>
                                        {row}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="customer-simple-select-label">
                                Customer
                            </InputLabel>
                            <Select
                                labelId="customer-simple-select-label"
                                id="customer-simple-select"
                                label="Customer"
                                defaultValue={this.state.store.customer}
                                onChange={this.handleChangeCustomer}
                            >
                                {this.state.customers.map((row) => (
                                    <MenuItem key={row.id} value={row.id}>
                                        {row.first_name} {row.last_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            sx={{ mt: 3 }}
                            component="fieldset"
                            variant="standard"
                            className="fieldset_options"
                        >
                            <FormLabel component="legend">
                                Show Sidebars
                            </FormLabel>
                            <FormGroup>
                                <Typography className="option_tab_titles">
                                    Orders Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.open_orders
                                            }
                                            onChange={this.handleChange}
                                            name="open_orders"
                                        />
                                    }
                                    label="Open Orders"
                                />
                                {/* <FormControlLabel
                              control={
                                <Checkbox checked={this.state.user.held_orders} onChange={this.handleChange} name="held_orders" />
                              }
                              label="Held"
                            /> */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.return_orders
                                            }
                                            onChange={this.handleChange}
                                            name="return_orders"
                                        />
                                    }
                                    label="Returns"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.in_transit}
                                            onChange={this.handleChange}
                                            name="in_transit"
                                        />
                                    }
                                    label="In-Transit"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.delay_transit
                                            }
                                            onChange={this.handleChange}
                                            name="delay_transit"
                                        />
                                    }
                                    label="Delayed"
                                />
                                <Typography className="option_tab_titles">
                                    Inventory Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .receiving_inventory
                                            }
                                            onChange={this.handleChange}
                                            name="receiving_inventory"
                                        />
                                    }
                                    label="Receiving"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .addshipment_inventory
                                            }
                                            onChange={this.handleChange}
                                            name="addshipment_inventory"
                                        />
                                    }
                                    label="Add Shipments"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .no_stock_inventory
                                            }
                                            onChange={this.handleChange}
                                            name="no_stock_inventory"
                                        />
                                    }
                                    label="No Stock"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .product_inventory
                                            }
                                            onChange={this.handleChange}
                                            name="product_inventory"
                                        />
                                    }
                                    label="Products"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.product_bundles
                                            }
                                            onChange={this.handleChange}
                                            name="product_bundles"
                                        />
                                    }
                                    label="Bundles"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .inventory_manager
                                            }
                                            onChange={this.handleChange}
                                            name="inventory_manager"
                                        />
                                    }
                                    label="Inventory Manager"
                                />
                                <Typography className="option_tab_titles">
                                    Pricing Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.ustous_pricing
                                            }
                                            onChange={this.handleChange}
                                            name="ustous_pricing"
                                        />
                                    }
                                    label="US to US"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .ustononus_pricing
                                            }
                                            onChange={this.handleChange}
                                            name="ustononus_pricing"
                                        />
                                    }
                                    label="US to Non-US"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.uktouk_pricing
                                            }
                                            onChange={this.handleChange}
                                            name="uktouk_pricing"
                                        />
                                    }
                                    label="UK to UK"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.uktoeu_pricing
                                            }
                                            onChange={this.handleChange}
                                            name="uktoeu_pricing"
                                        />
                                    }
                                    label="UK to EU "
                                />
                                <Typography className="option_tab_titles">
                                    Invoicing Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.invoicing}
                                            onChange={this.handleChange}
                                            name="invoicing"
                                        />
                                    }
                                    label="Invoicing"
                                />
                                <Typography className="option_tab_titles">
                                    Custom Tools Menu
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.safelist}
                                            onChange={this.handleChange}
                                            name="safelist"
                                        />
                                    }
                                    label="Safe Lists"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.edithistory
                                            }
                                            onChange={this.handleChange}
                                            name="edithistory"
                                        />
                                    }
                                    label="Edit History"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.reports}
                                            onChange={this.handleChange}
                                            name="reports"
                                        />
                                    }
                                    label="Reports"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .safelistshipments
                                            }
                                            onChange={this.handleChange}
                                            name="safelistshipments"
                                        />
                                    }
                                    label="Safelist Shipments"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .uspsdelayedshipments
                                            }
                                            onChange={this.handleChange}
                                            name="uspsdelayedshipments"
                                        />
                                    }
                                    label="Delayed Shipments"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.wrongitemssent
                                            }
                                            onChange={this.handleChange}
                                            name="wrongitemssent"
                                        />
                                    }
                                    label="Wrong Items Sent"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .dailyitemsdelivered
                                            }
                                            onChange={this.handleChange}
                                            name="dailyitemsdelivered"
                                        />
                                    }
                                    label="Daily Items Delivered"
                                />
                            </FormGroup>
                            <FormHelperText>Check to display</FormHelperText>
                        </FormControl>
                        <FormControl
                            sx={{ mt: 3 }}
                            component="fieldset"
                            variant="standard"
                            className="width50 showsidescheckbox"
                        >
                            <FormLabel
                                component="legend"
                                className="headershowsides"
                            >
                                Show Dashboard Blocks{" "}
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.invoice}
                                            onChange={this.handleChange}
                                            name="invoice"
                                        />
                                    }
                                    label="Invoice"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user.storage_cost
                                            }
                                            onChange={this.handleChange}
                                            name="storage_cost"
                                        />
                                    }
                                    label="Storage Cost"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .storage_calculator
                                            }
                                            onChange={this.handleChange}
                                            name="storage_calculator"
                                        />
                                    }
                                    label="Storage Calculator"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.openorders}
                                            onChange={this.handleChange}
                                            name="openorders"
                                        />
                                    }
                                    label="Open Orders"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.intransit}
                                            onChange={this.handleChange}
                                            name="intransit"
                                        />
                                    }
                                    label="In Transit"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.delayed}
                                            onChange={this.handleChange}
                                            name="delayed"
                                        />
                                    }
                                    label="Delayed"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.returns}
                                            onChange={this.handleChange}
                                            name="returns"
                                        />
                                    }
                                    label="Return Orders"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.receiving}
                                            onChange={this.handleChange}
                                            name="receiving"
                                        />
                                    }
                                    label="Receiving"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.low_stock}
                                            onChange={this.handleChange}
                                            name="low_stock"
                                        />
                                    }
                                    label="Low Stock"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.user.no_stock}
                                            onChange={this.handleChange}
                                            name="no_stock"
                                        />
                                    }
                                    label="No Stock"
                                />
                            </FormGroup>
                            <FormHelperText>Check to display</FormHelperText>
                        </FormControl>
                        <FormControl
                            sx={{ mt: 3 }}
                            component="fieldset"
                            variant="standard"
                            className="fieldset_options"
                        >
                            <FormLabel component="legend">
                                SHOW FUNCTIONAL BUTTONS
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_receiving_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_receiving_button"
                                        />
                                    }
                                    label="Add Receiving (Default)"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_receiving_wholesale_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_receiving_wholesale_button"
                                        />
                                    }
                                    label="Add Receiving (Wholesale)"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_shipments_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_shipments_button"
                                        />
                                    }
                                    label="Add Shipment"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_product_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_product_button"
                                        />
                                    }
                                    label="Add Product"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.user
                                                    .add_bundle_button
                                            }
                                            onChange={this.handleChange}
                                            name="add_bundle_button"
                                        />
                                    }
                                    label="Add Bundle"
                                />
                            </FormGroup>
                            <FormHelperText>Check to display</FormHelperText>
                        </FormControl>
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
                                    ? "Updating..."
                                    : "Update"}
                            </Button>
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        const modalDeleteContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={"xs"}
                open={this.state.deleteModal}
                onClose={this.handleCloseModal}
                className="ordermodal adminmodal"
            >
                <Box component={"form"} onSubmit={this.handleStoreDeleteSubmit}>
                    {/* <DialogTitle id="responsive-dialog-title">Delete {this.state.store.store_name}</DialogTitle>
			      		<DialogContent> */}
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
                            Delete {this.state.store.store_name}
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            Deleting this store can't be undone. Continue?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <TextField
                            hiddenLabel
                            id="store_id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.store.store_id}
                        />
                        <div className="form_btns form_btns_del">
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
                                variant="contained"
                                color="error"
                            >
                                {this.state.formSubmitting
                                    ? "Deleting..."
                                    : "Delete"}
                            </Button>
                        </div>
                    </DialogActions>
                </Box>
            </Dialog>
        );

        const modalDisableEditingContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={"xs"}
                open={this.state.disableeditingModal}
                onClose={this.handleCloseModal}
                className="ordermodal adminmodal"
            >
                <Box
                    component={"form"}
                    onSubmit={this.handleStoreDisableEditingSubmit}
                >
                    {/* <DialogTitle id="responsive-dialog-title">Delete {this.state.store.store_name}</DialogTitle>
			      		<DialogContent> */}
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
                            {this.state.store.editing_status == "Disable"
                                ? "Enable Open Orders"
                                : "Disable Open Orders"}
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.store.editing_status == "Disable" ? (
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to enable editing for
                                    this store '
                                    <b>
                                        <i>{this.state.store.store_name}</i>
                                    </b>
                                    '?
                                </DialogContentText>
                            ) : (
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to disable editing for
                                    this store '
                                    <b>
                                        <i>{this.state.store.store_name}</i>
                                    </b>
                                    '?
                                </DialogContentText>
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <TextField
                            hiddenLabel
                            id="store_id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.store.store_id}
                        />
                        <div className="form_btns form_btns_del">
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
                                variant="contained"
                                color="error"
                            >
                                {this.state.store.editing_status == "Disable"
                                    ? "Enable"
                                    : "Disable"}
                            </Button>
                        </div>
                    </DialogActions>
                </Box>
            </Dialog>
        );
        const modalDisableSettingContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={"xs"}
                open={this.state.disablesettingModal}
                onClose={this.handleCloseModal}
                className="ordermodal adminmodal"
            >
                <Box
                    component={"form"}
                    onSubmit={this.handleStoreDisableSettingSubmit}
                >
                    {/* <DialogTitle id="responsive-dialog-title">Delete {this.state.store.store_name}</DialogTitle>
			      		<DialogContent> */}
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
                            Disable settings for {this.state.store.store_name}
                        </Typography>
                        {this.state.message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.message}
                            </Alert>
                        )}
                        {/* <Typography component="div" className="admformgroup">
								{this.state.currentdate}
							</Typography> */}
                        <Typography component="div" className="admformgroup">
                            <label>Disable Type: </label>
                            <Select
                                value={this.state.store.disable_type}
                                onChange={this.handleChangeDisableType}
                                // displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                className="table-filters filter_selects"
                                IconComponent={KeyboardArrowDownIcon}
                            >
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="date">Date</MenuItem>
                            </Select>
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {/* <Typography component="div" className="admformgroup">
								First Group
							</Typography>							 */}
                            <Typography
                                component="div"
                                className="width50 floatleft"
                            >
                                <Typography
                                    component="div"
                                    className={
                                        this.state.showdatedivs +
                                        " admformgroup"
                                    }
                                >
                                    <DesktopDatePicker
                                        label="Start Date"
                                        inputFormat="YYYY-MM-DD"
                                        value={this.state.store.disable_date}
                                        onChange={this.handleDisableDateChange}
                                        name="disable_date"
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        required
                                    />
                                </Typography>
                                <Typography
                                    component="div"
                                    className="admformgroup"
                                >
                                    <TimePicker
                                        label="Start Time"
                                        value={
                                            this.state.store.disable_stime_field
                                        }
                                        onChange={this.handleDisableTimeChange}
                                        name="disable_stime_field"
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        required
                                    />
                                </Typography>
                            </Typography>
                            <Typography
                                component="div"
                                className="width50 floatleft"
                            >
                                <Typography
                                    component="div"
                                    className={
                                        this.state.showdatedivs +
                                        " admformgroup"
                                    }
                                >
                                    <DesktopDatePicker
                                        label="End Date"
                                        inputFormat="YYYY-MM-DD"
                                        value={this.state.store.disable_enddate}
                                        onChange={
                                            this.handleDisableEndDateChange
                                        }
                                        name="disable_enddate"
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        required
                                    />
                                </Typography>
                                <Typography
                                    component="div"
                                    className="admformgroup"
                                >
                                    <TimePicker
                                        label="End Time"
                                        value={
                                            this.state.store.disable_etime_field
                                        }
                                        onChange={
                                            this.handleDisableEndTimeChange
                                        }
                                        name="disable_etime_field"
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        required
                                    />
                                </Typography>
                            </Typography>
                            {/* <Typography component="div" className="admformgroup"  style={{ marginTop: '40px' }}>
								Second Group
							</Typography>						 */}
                            <Typography
                                component="div"
                                className="width50 floatleft"
                                style={{ marginTop: "40px" }}
                            >
                                <Typography
                                    component="div"
                                    className={
                                        this.state.showdatedivs +
                                        " admformgroup"
                                    }
                                >
                                    <DesktopDatePicker
                                        label="Start Date"
                                        inputFormat="YYYY-MM-DD"
                                        value={this.state.store.disable_date2}
                                        onChange={this.handleDisableDateChange2}
                                        name="disable_date2"
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        required
                                    />
                                </Typography>
                                <Typography
                                    component="div"
                                    className="admformgroup"
                                >
                                    <TimePicker
                                        label="Start Time"
                                        value={
                                            this.state.store
                                                .disable_stime_field2
                                        }
                                        onChange={this.handleDisableTimeChange2}
                                        name="disable_stime_field2"
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        required
                                    />
                                </Typography>
                            </Typography>
                            <Typography
                                component="div"
                                className="width50 floatleft"
                                style={{ marginTop: "40px" }}
                            >
                                <Typography
                                    component="div"
                                    className={
                                        this.state.showdatedivs +
                                        " admformgroup"
                                    }
                                >
                                    <DesktopDatePicker
                                        label="End Date"
                                        inputFormat="YYYY-MM-DD"
                                        value={
                                            this.state.store.disable_enddate2
                                        }
                                        onChange={
                                            this.handleDisableEndDateChange2
                                        }
                                        name="disable_enddate2"
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        required
                                    />
                                </Typography>
                                <Typography
                                    component="div"
                                    className="admformgroup"
                                >
                                    <TimePicker
                                        label="End Time"
                                        value={
                                            this.state.store
                                                .disable_etime_field2
                                        }
                                        onChange={
                                            this.handleDisableEndTimeChange2
                                        }
                                        name="disable_etime_field2"
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        required
                                    />
                                </Typography>
                            </Typography>
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                        <TextField
                            hiddenLabel
                            id="store_id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.store.store_id}
                        />
                        <div className="form_btns form_btns_del">
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
                                variant="contained"
                                color="error"
                            >
                                {this.state.formSubmitting
                                    ? "Saving..."
                                    : "Save"}
                            </Button>
                        </div>
                    </DialogActions>
                </Box>
            </Dialog>
        );

        return (
            <React.Fragment>
                <Box
                    m={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {/* <Typography component="h2" className="admin_page_title">{this.state.title} <img src={helpIcon} alt="help icon" className="helpicon" onClick={this.showdescription}/></Typography>          		  	 */}
                </Box>
                <Typography
                    component="div"
                    className="pagedescription"
                    display={this.state.showdesc}
                >
                    <div className="admin_desc_info">
                        In the store section, you can review and manage all
                        details from the store. You can view and edit many
                        information such as store id, store name, quickbooks
                        customer id, country and customer assigned for the
                        store. Access to this area is limited. Only
                        administrators or team leaders can reach.
                    </div>
                    <div className="admin_topright_btn">
                        <Button
                            variant="outlined"
                            onClick={this.handleOpenModal}
                            className="export_button addbtn"
                        >
                            <img src={plus_icon} alt="add icon" /> Add Store
                        </Button>
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
                {/* <div className="table_grid_container">
                <Table size="small" className="table_data customertable">
		        <TableHead>
		          <TableRow>
		            <TableCell>Name</TableCell>
		            <TableCell>Customer</TableCell>
		            <TableCell align="right">Actions</TableCell>
		          </TableRow>
		        </TableHead>
		        <TableBody>
		          {this.state.stores.map((row) => (
		            <TableRow key={row.id}>
		              <TableCell>{row.store_name}</TableCell>
		              <TableCell>{row.user.first_name} {row.user.last_name}</TableCell>
		              <TableCell align="right">
		              	<Button onClick={this.handleEditModal.bind(this, row.id)} className="custbtn">
							  <img src={edit_icon} alt="edit icon" /> Edit
						</Button> | 
						<Button onClick={this.handleDeleteModal.bind(this, row.id)} className="custbtn">
							<img src={trash_icon} alt="delete icon" /> Delete
						</Button>
		              </TableCell>
		            </TableRow>
		          ))}
		        </TableBody>
		      </Table>
			  </div>
			  <div className="page_right">
		      <Pagination count={10} changePage={this.getData} data={this.state.data} variant="outlined" shape="rounded" />
			  </div> */}
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
                        getCellClassName={(params) => {
                            if (params.field === "editing_status") {
                                if (params.value == "Disable") {
                                    return "redtext";
                                } else {
                                    return "greentext";
                                }
                            }
                        }}
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                    <div className="datagrid_pagination_bg"></div>
                </Box>
                {modalContainer}
                {modalEditContainer}
                {modalDeleteContainer}
                {modalDisableEditingContainer}
                {modalDisableSettingContainer}
            </React.Fragment>
        );
    }
}

export default StoreLists;
