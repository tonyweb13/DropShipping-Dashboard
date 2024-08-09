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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import archivetopicon from "../../../../../img/archive_top_icon.png";
import edit_icon from "../../../../../img/edit_icon_new.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import {
    DataGridPremium,
    GridToolbar,
    GridLinkOperator,
} from "@mui/x-data-grid-premium";

class InventoryWholesaleLists extends Component {
    constructor(props) {
        super(props);
        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "inventory_date",
                headerName: "Check-In Date",
                flex: 1,
            },
            {
                field: "title",
                headerName: "Item Title",
                flex: 1,
            },
            {
                field: "sku",
                headerName: "Item SKU",
                flex: 1,
            },
            {
                field: "inventory_count",
                headerName: "Quantity",
                flex: 1,
            },
            {
                field: "destination",
                headerName: "Destination",
                flex: 1,
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
            history: [],
            receiveditems: [],
            store: 0,
            global_msg: {
                type: "error",
                message: "",
            },
            form_message: "",
            openModal: false,
            openReceivingModal: false,
            openModalNotes: false,
            historyModal: false,
            openModalQuantity: false,
            formSubmitting: false,
            images: "",
            imageList: "",
            country: "US",
            perpage: 10,
            statusfilter: "",
            sorticon: "",
            sortfield: "",
            inventory_receiving: {
                inventory_id: 0,
                status: "",
                notes: "",
                files: "",
            },
            inventory_new_receiving: {
                checkindate: "",
                product: "",
                quantity: 0,
                destination: "",
            },
            sorting: "ASC",
            showhistoricalold: "inline-block",
            showhistoricallatest: "none",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 10,
            uploadurl: "",
            file_name: "No file chosen",
            datetimesync: "",
            showdisputedbtn: "inline-block",
            showdisputedbtndefault: "none",
            showapprovebtn: "inline-block",
            showapprovebtndefault: "none",
            showchangestatusbtns: "inline-block",
            showrestorebtn: "none",
            searchValue: sparamval,
            role: "",
            productoptions: [],
            showaddreceivingbtn: "inline-block",
            disabledItemQuantity: true,
        };

        this.handleInventorySubmit = this.handleInventorySubmit.bind(this);
        this.handleAddInventorySubmit =
            this.handleAddInventorySubmit.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
        this.handleNotes = this.handleNotes.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleInventorySubmitNotes =
            this.handleInventorySubmitNotes.bind(this);
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
            let receivingbtnstatus =
                MenuAppState.member_menu.add_receiving_wholesale_button == 1
                    ? "inline-block"
                    : "none";

            this.setState({
                role: AppState.role,
                country: AppState.country,
                store: AppState.store,
                datefilter: today.toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
                dateweekfilter: today.toLocaleDateString("en-us", {
                    weekday: "long",
                }),
                showaddreceivingbtn: receivingbtnstatus,
            });
        }
        if (menustate) {
        }
        this.getData({ page: 1, perpage: this.state.perpage, date: date });

        this.getsearch_params();
    }

    getData = (data) => {
        const statedate = new Date(this.state.date);
        const date = data.date !== undefined ? data.date : statedate;
        const dateformat =
            date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear();
        const stocktype = this.state.stocktype;

        this.sortname =
            data.sortname !== undefined ? data.sortname : this.state.sortfield;
        this.sortascdesc =
            data.sorting !== undefined ? data.sorting : this.state.sorting;
        this.statfilter =
            data.statusfilter !== undefined
                ? data.statusfilter
                : this.state.statusfilter;
        this.historydata =
            data.historydata !== undefined ? data.historydata : "latest";

        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        axios
            .get(
                "api/wholesalereceivingproducts?history=" +
                    this.historydata +
                    "&statusfilter=" +
                    this.statfilter +
                    "&stocktype=" +
                    stocktype
            )
            .then((response) => {
                let fullgriddata = [];
                let ctrgrid = 1;
                let cnty = this.state.country;
                response.data.products.forEach(function (key) {
                    let row_grid_data = {
                        id: key.inventory_id,
                        inventory_date: key.inventory_date,
                        title: key.title,
                        sku: key.sku,
                        inventory_count: key.inventory_count,
                        destination: key.destination,
                        actions: key.inventory_id,
                        inventory_id: key.inventory_id,
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

    handleChangeFilter = (event) => {
        let btndisplaydisputed = "inline-block";
        let btndisplaydefaultdisputed = "none";
        let btndisplayapproved = "inline-block";
        let btndisplaydefaultapproved = "none";
        let btndisplayachangestatusbtns = "inline-block";
        let btndisplayrestorebtn = "none";
        if (event.target.value == "Disputed") {
            btndisplaydisputed = "none";
            btndisplaydefaultdisputed = "inline-block";
            btndisplayapproved = "inline-block";
            btndisplaydefaultapproved = "none";
            btndisplayachangestatusbtns = "none";
            btndisplayrestorebtn = "inline-block";
        } else if (event.target.value == "Approved") {
            btndisplaydisputed = "inline-block";
            btndisplaydefaultdisputed = "none";
            btndisplayapproved = "none";
            btndisplaydefaultapproved = "inline-block";
            btndisplayachangestatusbtns = "none";
            btndisplayrestorebtn = "inline-block";
        }

        this.setState({
            showdisputedbtn: btndisplaydisputed,
            showdisputedbtndefault: btndisplaydefaultdisputed,
            showapprovebtn: btndisplayapproved,
            showapprovebtndefault: btndisplaydefaultapproved,
            showchangestatusbtns: btndisplayachangestatusbtns,
            showrestorebtn: btndisplayrestorebtn,
            statusfilter: event.target.value,
        });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            statusfilter: event.target.value,
        });

        this.setState({
            statusfilter: event.target.value,
            global_msg: { message: "" },
        });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            statusfilter: event.target.value,
        });
    };

    handleChangePerPage = (event) => {
        const date = new Date(this.state.date);
        this.setState({
            perpage: event.target.value,
            pagesize: event.target.value,
            global_msg: { message: "" },
        });
        this.getData({ page: 1, perpage: event.target.value, date: date });
    };

    getPreviousDay = () => {
        const day = this.state.date;
        const date = new Date(day);
        const previous = new Date(date.getTime());
        previous.setDate(date.getDate() - 1);

        this.getData({ page: 1, perpage: this.state.perpage, date: previous });
    };

    getNextDay = () => {
        const day = this.state.date;
        const date = new Date(day);
        const next = new Date(date.getTime());
        next.setDate(date.getDate() + 1);

        this.getData({ page: 1, perpage: this.state.perpage, date: next });
    };

    handleOpenModal = (inventoryid) => {
        this.setState({
            openModal: true,
            form_message: "",
            global_msg: { message: "" },
        });
        this.setState((prevState) => ({
            inventory_receiving: {
                ...prevState.inventory_receiving,
                inventory_id: inventoryid,
            },
        }));
    };

    handleOpenModalHistory = (inventoryid) => {
        axios.get("api/product?inventoryid=" + inventoryid).then((response) => {
            this.setState({
                historyModal: true,
                history: response.data.notes,
                uploadurl: response.data.storageurl,
            });
        });
    };

    handleStatus(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_receiving: {
                ...prevState.inventory_receiving,
                status: value,
            },
        }));

        this.setState({ form_message: "", global_msg: { message: "" } });
    }

    handleNotes(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_receiving: {
                ...prevState.inventory_receiving,
                notes: value,
            },
        }));
    }

    handleFile(e) {
        let fileList = e.target.files[0];

        this.setState((prevState) => ({
            inventory_receiving: {
                ...prevState.inventory_receiving,
                files: fileList,
            },
        }));

        this.setState({ file_name: e.target.files[0]["name"] });
    }

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            openModalQuantity: false,
            openReceivingModal: false,
            historyModal: false,
            openModalNotes: false,
            global_msg: { message: "" },
        });
    };

    handleInventorySubmitNotes(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        const form = document.querySelector("#inventoryForm");
        const inventoryData = new FormData(form);
        inventoryData.append(
            "inventory_id",
            this.state.inventory_receiving.inventory_id
        );

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        axios
            .post("api/add-receiving-notes", inventoryData, config)
            .then((response) => {
                this.setState({
                    openModalNotes: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message: "Note added successfully!",
                    },
                });
                this.getData({ page: 1 });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.status !== "undefined" &&
                    errors.status.length > 0
                ) {
                    msg += errors.status[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleInventorySubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        const form = document.querySelector("#inventoryForm");
        const inventoryData = new FormData(form);
        inventoryData.append("status", "Disputed");
        inventoryData.append(
            "inventory_id",
            this.state.inventory_receiving.inventory_id
        );

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        axios
            .post("api/add-receiving", inventoryData, config)
            .then((response) => {
                this.setState({
                    openModal: false,
                    global_msg: {
                        type: "success",
                        message: "Receiving item disputed successfully!",
                    },
                    formSubmitting: false,
                    file_name: "No file chosen",
                });
                this.getData({ page: 1 });
                this.setState({
                    form_message: "",
                    inventory_receiving: { status: "", notes: "", files: "" },
                });
            })
            .catch((error) => {
                this.setState({ formSubmitting: false });
            });
    }

    handleAddInventorySubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        axios
            .post(
                "api/add-wholesale-receiving-item",
                this.state.inventory_new_receiving
            )
            .then((response) => {
                this.setState({
                    openReceivingModal: false,
                    global_msg: {
                        type: "success",
                        message: "New Receiving item added successfully!",
                    },
                    formSubmitting: false,
                    file_name: "No file chosen",
                });
                this.getData({ page: 1 });
                this.setState({
                    form_message: "",
                    inventory_new_receiving: {
                        checkindate: "",
                        product: "",
                        quantity: 0,
                        country: "",
                    },
                    disabledItemQuantity: true,
                });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.checkindate !== "undefined" &&
                    errors.checkindate.length > 0
                ) {
                    msg += errors.checkindate[0] + "\r\n";
                }
                if (
                    typeof errors.product !== "undefined" &&
                    errors.product.length > 0
                ) {
                    msg += errors.product[0] + "\r\n";
                }
                if (
                    typeof errors.quantity !== "undefined" &&
                    errors.quantity.length > 0
                ) {
                    msg += errors.quantity[0] + "\r\n";
                }
                if (
                    typeof errors.destination !== "undefined" &&
                    errors.destination.length > 0
                ) {
                    msg += errors.destination[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleChangeReceivingItemsStatus = (receivestatus) => {
        if (this.state.receiveditems.length > 0) {
            const shipmentData = new FormData();
            shipmentData.append(
                "inventory_ids",
                JSON.stringify(this.state.receiveditems)
            );
            shipmentData.append("status", receivestatus);
            axios
                .post("api/add-receiving-items", shipmentData)
                .then((response) => {
                    this.setState({
                        receiveditems: [],
                        global_msg: {
                            type: "success",
                            message:
                                "Receiving item(s) " +
                                receivestatus +
                                " successfully!",
                        },
                    });
                    this.getData({ page: 1 });
                });
        } else {
            this.setState({
                receiveditems: [],
                global_msg: {
                    type: "error",
                    message: "Please select item(s) to change status.",
                },
            });
        }
    };

    handleTableSort = (sorttype) => (event) => {
        let toggleSorting = "ASC";
        if (this.state.sorting == "ASC") {
            toggleSorting = "DESC";
        }
        const date = new Date(this.state.date);

        this.setState({
            sorting: toggleSorting,
            sortfield: sorttype,
            sorticon: sorttype,
            global_msg: { message: "" },
        });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            date: date,
            sortname: sorttype,
            sorting: toggleSorting,
        });
        event.preventDefault();
    };

    handleShowReceiving = (type) => {
        const date = new Date(this.state.date);
        let btndisplayold = "inline-block";
        let btndisplaylatest = "none";
        if (type == "old") {
            btndisplayold = "none";
            btndisplaylatest = "inline-block";
        }
        this.setState({
            showhistoricalold: btndisplayold,
            showhistoricallatest: btndisplaylatest,
            global_msg: { message: "" },
        });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            date: date,
            sortname: this.state.sorticon,
            sorting: this.state.sorting,
            historydata: type,
        });
    };

    showdisputedreceiving = (event) => {
        let btndisplaydisputed = "inline-block";
        let btndisplaydefaultdisputed = "none";
        let btndisplayapproved = "inline-block";
        let btndisplaydefaultapproved = "none";
        let btndisplayachangestatusbtns = "inline-block";
        let btndisplayrestorebtn = "none";
        if (event == "Disputed") {
            btndisplaydisputed = "none";
            btndisplaydefaultdisputed = "inline-block";
            btndisplayapproved = "inline-block";
            btndisplaydefaultapproved = "none";
            btndisplayachangestatusbtns = "none";
            btndisplayrestorebtn = "inline-block";
        } else if (event == "Approved") {
            btndisplaydisputed = "inline-block";
            btndisplaydefaultdisputed = "none";
            btndisplayapproved = "none";
            btndisplaydefaultapproved = "inline-block";
            btndisplayachangestatusbtns = "none";
            btndisplayrestorebtn = "inline-block";
        }
        this.setState({
            showdisputedbtn: btndisplaydisputed,
            showdisputedbtndefault: btndisplaydefaultdisputed,
            showapprovebtn: btndisplayapproved,
            showapprovebtndefault: btndisplaydefaultapproved,
            showchangestatusbtns: btndisplayachangestatusbtns,
            showrestorebtn: btndisplayrestorebtn,
            statusfilter: event,
            global_msg: { message: "" },
        });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            statusfilter: event,
        });
    };

    handleChangeStatusRows = (receiveditems) => {
        this.setState({
            receiveditems: receiveditems,
            global_msg: { message: "" },
        });
    };

    handleChangeReceivingStatus = (receiveid, receivestatus) => {
        let receivemsg =
            "Stocks have been approved and will be added to the Inventory Manager shortly.";
        if (receivestatus == "") {
            receivemsg = "Item has been restored.";
        } else if (receivestatus == "Disputed") {
            receivemsg = "Item has been disputed.";
        }

        const shipmentData = new FormData();
        shipmentData.append("inventory_id", receiveid);
        shipmentData.append("status", receivestatus);
        axios
            .post("api/change-receivingstatus", shipmentData)
            .then((response) => {
                this.getData({ page: 1 });
                this.setState({
                    global_msg: { type: "success", message: receivemsg },
                });
            });
    };

    isImage = (url) => {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    };

    handleOpenModalNotes = (inventoryid) => {
        this.setState({
            openModalNotes: true,
            file_name: "No file chosen",
            global_msg: { message: "" },
        });
        this.setState((prevState) => ({
            inventory_receiving: {
                ...prevState.inventory_receiving,
                inventory_id: inventoryid,
            },
        }));
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
                openReceivingModal: true,
                productoptions: response.data.products,
                global_msg: { message: "" },
            });
        });
    };

    handleCheckinDate = (newValue) => {
        let fdate = "";
        if (newValue !== null && newValue !== undefined) {
            let monp1 = parseInt(newValue["$M"]) + 1;
            let mons = monp1.toString().padStart(2, 0);
            let days = newValue["$D"].toString().padStart(2, 0);
            let yr = newValue["$y"];
            fdate = yr + "-" + mons + "-" + days;
        }

        this.setState((prevState) => ({
            inventory_new_receiving: {
                ...prevState.inventory_new_receiving,
                checkindate: fdate,
            },
        }));
    };

    handleAddProduct = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_receiving: {
                ...prevState.inventory_new_receiving,
                product: value,
            },
        }));
    };

    handleAddQuantity = (e) => {
        let value = e.target.value;
        let parsedValue = parseFloat(value);
        let msg = "";
        if (this.state.inventory_new_receiving.destination == "Warehouse") {
            // Allow positive number only
            if (!isNaN(parsedValue) && parsedValue > 0) {
                msg = "";
                this.setState((prevState) => ({
                    inventory_new_receiving: {
                        ...prevState.inventory_new_receiving,
                        quantity: value,
                    },
                }));
            } else {
                msg = "Items going to the Warehouse must be greater than zero.";
            }
        } else {
            // Allow negative number only
            if (!isNaN(parsedValue) && parsedValue < 0) {
                msg = "";
                this.setState((prevState) => ({
                    inventory_new_receiving: {
                        ...prevState.inventory_new_receiving,
                        quantity: value,
                    },
                }));
            } else {
                msg =
                    "Items going out from the Warehouse must be negative to indicate that this is a shipped out.";
            }
        }

        this.setState({
            form_message: msg,
        });
    };

    handleAddDestination = (e) => {
        let value = e.target.value;
        this.state.disabledItemQuantity = false;

        this.setState((prevState) => ({
            inventory_new_receiving: {
                ...prevState.inventory_new_receiving,
                destination: value,
            },
            disabledItemQuantity: false,
        }));
    };

    handleChangeReceivingQuantity = (e) => {
        this.setState({
            openModalQuantity: true,
            form_message: "",
            inventory_new_receiving: {
                checkindate: "",
                product: "",
                quantity: 0,
                country: "",
            },
        });
    };

    render() {
        const fullWidth = true;
        const maxWidth = "md";

        const statusOptions = ["Disputed", "Approved"];

        const modalContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="inventoryForm"
                    component={"form"}
                    onSubmit={this.handleInventorySubmit}
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
                            Dispute Receiving
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.form_message}
                            </Alert>
                        )}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="notes"
                            name="notes"
                            label="Notes"
                            multiline
                            fullWidth
                            rows={4}
                            variant="standard"
                            onChange={this.handleNotes}
                        />
                        <div className="fileupload_div">
                            <input
                                style={{ display: "none" }}
                                id="raised-button-file"
                                name="files"
                                type="file"
                                onChange={this.handleFile}
                            />
                            <span className="filetext">
                                {this.state.file_name}
                            </span>
                            <label htmlFor="raised-button-file">
                                <Button
                                    variant="raised"
                                    component="span"
                                    id="upload-btn"
                                >
                                    Upload
                                </Button>
                            </label>
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

        const modalReceivingContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openReceivingModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="inventoryAddReceivingForm"
                    component={"form"}
                    onSubmit={this.handleAddInventorySubmit}
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
                            Add Receiving
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.form_message}
                            </Alert>
                        )}
                        <div style={{ marginBottom: "20px", display: "flex" }}>
                            <div
                                style={{
                                    maxWidth: "50%",
                                    width: "100%",
                                    marginRight: "10px",
                                }}
                            >
                                <Select
                                    label="Product"
                                    value={
                                        this.state.inventory_new_receiving
                                            .product
                                    }
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
                                    className="table-filters filter_selects"
                                    fullWidth
                                    onChange={this.handleAddProduct}
                                >
                                    <MenuItem key={0} value="0">
                                        <em style={{ fontStyle: "normal" }}>
                                            Select Product
                                        </em>
                                    </MenuItem>
                                    {this.state.productoptions.map((row) => (
                                        <MenuItem
                                            key={row.ProductVariantID}
                                            value={row.SKU}
                                        >
                                            {row.ProductName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div
                                style={{
                                    maxWidth: "50%",
                                    width: "100%",
                                    marginTop: "5px",
                                }}
                            >
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DesktopDatePicker
                                        label="Check-In Date"
                                        inputFormat="YYYY-MM-DD"
                                        value={
                                            this.state.inventory_new_receiving
                                                .checkindate
                                        }
                                        onChange={this.handleCheckinDate}
                                        className="table-filters filter_selects date-picker-field"
                                        fullWidth
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div>
                            <InputLabel>Destination</InputLabel>
                            <Select
                                label="Destination"
                                value={
                                    this.state.inventory_new_receiving
                                        .destination
                                }
                                inputProps={{ "aria-label": "Without label" }}
                                className="table-filters filter_selects"
                                fullWidth
                                onChange={this.handleAddDestination}
                            >
                                <MenuItem key={0} value="0">
                                    <em style={{ fontStyle: "normal" }}>
                                        Select Destination
                                    </em>
                                </MenuItem>
                                <MenuItem key={1} value={"Warehouse"}>
                                    Warehouse
                                </MenuItem>
                                <MenuItem key={2} value={"Amazon"}>
                                    Amazon
                                </MenuItem>
                                <MenuItem key={3} value={"Others"}>
                                    Others
                                </MenuItem>
                            </Select>
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="quantity"
                                name="quantity"
                                label="Item Quantity"
                                fullWidth
                                variant="standard"
                                onChange={this.handleAddQuantity}
                                type="number"
                                disabled={this.state.disabledItemQuantity}
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

        const modalHistoryContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.historyModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box className="history-lists" component={"div"}>
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
                            History Notes
                        </Typography>
                        <div id="history-lists">
                            {this.state.history.length > 0 ? (
                                this.state.history.map((row) => (
                                    <div className="history">
                                        <p>
                                            <span>{row.note_added}</span>
                                            {row.added_by_name != "" &&
                                            row.added_by_name != null
                                                ? " By: " + row.added_by_name
                                                : ""}
                                        </p>
                                        <p>{row.notes_title}</p>
                                        <p>{row.notes}</p>
                                        {row.upload != "" ? (
                                            <a
                                                href={
                                                    this.state.uploadurl +
                                                    row.upload
                                                }
                                                target="_blank"
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                            >
                                                {this.isImage(
                                                    this.state.uploadurl +
                                                        row.upload
                                                ) ? (
                                                    <img
                                                        src={
                                                            this.state
                                                                .uploadurl +
                                                            row.upload
                                                        }
                                                        alt={row.notes_title}
                                                        style={{
                                                            maxWidth: "500px",
                                                        }}
                                                    />
                                                ) : (
                                                    <div>
                                                        <AttachFileIcon />{" "}
                                                        {row.upload}
                                                    </div>
                                                )}
                                            </a>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ))
                            ) : (
                                <Alert
                                    style={{ margin: "20px 0" }}
                                    severity="error"
                                >
                                    No notes added.
                                </Alert>
                            )}
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );
        const modalContainerNotes = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModalNotes}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="inventoryForm"
                    component={"form"}
                    onSubmit={this.handleInventorySubmitNotes}
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
                            Add Notes
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert severity="error">
                                {this.state.form_message}
                            </Alert>
                        )}

                        <TextField
                            autoFocus
                            margin="dense"
                            id="notes_title"
                            name="notes_title"
                            label="Title"
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="notes"
                            name="notes"
                            label="Notes"
                            multiline
                            fullWidth
                            rows={4}
                            variant="standard"
                            onChange={this.handleNotes}
                        />
                        <div className="fileupload_div">
                            <input
                                style={{ display: "none" }}
                                id="raised-button-file"
                                name="files"
                                type="file"
                                onChange={this.handleFile}
                            />
                            <span className="filetext">
                                {this.state.file_name}
                            </span>
                            <label htmlFor="raised-button-file">
                                <Button
                                    variant="raised"
                                    component="span"
                                    id="upload-btn"
                                >
                                    Upload
                                </Button>
                            </label>
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

        const modalContainerQuantity = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModalQuantity}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="inventoryForm"
                    component={"form"}
                    onSubmit={this.handleChangeQuantity}
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
                            Change Quantity
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert severity="error">
                                {this.state.form_message}
                            </Alert>
                        )}

                        <TextField
                            autoFocus
                            margin="dense"
                            id="quantity"
                            name="quantity"
                            label="Quantity"
                            fullWidth
                            variant="standard"
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

        let addReceivingBtn = "";
        if (this.state.role != "Client") {
            addReceivingBtn = (
                <div>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box className="subpage_graph_sort_cnt">
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={this.handleShowForm}
                            className="export_button addbtn"
                            style={{ display: this.state.showaddreceivingbtn }}
                        >
                            <AddIcon /> Add Receiving
                        </Button>
                    </Box>
                </div>
            );
        }

        return (
            <React.Fragment>
                <Box
                    m={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {/* <Typography component="div" className="inventory_date_heading">
						<Typography component="div" className="idateheading_title">
						{this.state.datefilter}
						<span className="imagespans">
							<img src={arrowlefticon} alt="printer icon" onClick={this.getPreviousDay} />
							<img src={calendaricon} alt="printer icon" />
							<img src={arrowrighticon} alt="printer icon" onClick={this.getNextDay} />
						</span>
						</Typography>
						<Typography component="div" className="idate_subtitle">
						{this.state.dateweekfilter.toUpperCase()}
						</Typography>
					</Typography> */}
                </Box>
                <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                    className="table_grid"
                >
                    <Typography component="h2" className="subpage_title">
                        {this.state.title}
                    </Typography>
                    <div className="table_filter_options inventory_filters">
                        <Typography
                            component="div"
                            className="table_selection_area"
                        >
                            <Typography
                                component="div"
                                className="fulltablearea"
                            >
                                {/*<span>Filter By: &nbsp; </span>
								<Select
	                                    value={this.state.statusfilter}
	                                    onChange={this.handleChangeFilter}
	                                    displayEmpty
	                                    inputProps={{ 'aria-label': 'Without label' }}
	                                    className='table-filters filter_selects'
	                                    IconComponent={KeyboardArrowDownIcon}
	                                >

	                                    <MenuItem value="">Pending Review</MenuItem>
	                                    <MenuItem value={'Disputed'}>Disputed</MenuItem>
	                                    <MenuItem value={'Approved'}>Approved</MenuItem>
	                                </Select>*/}
                                <Select
                                    value={this.state.perpage}
                                    onChange={this.handleChangePerPage}
                                    displayEmpty
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
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
                                {/*<div style={{ display: this.state.showchangestatusbtns }}>
										<Button variant="outlined" onClick={this.handleChangeReceivingItemsStatus.bind(this, 'Approved')} className="archive_btn_table">Approve</Button>
									</div>
									<div style={{ display: this.state.showrestorebtn }}>
										<Button variant="outlined" onClick={this.handleChangeReceivingItemsStatus.bind(this, 'Restore')} className="archive_btn_table">Restore</Button> &nbsp;
									</div>*/}
                            </Typography>
                        </Typography>
                        {addReceivingBtn}
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
                            rowsPerPageOptions={[10]}
                            pagination
                            disableSelectionOnClick
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = this.state.gridrows.filter(
                                    (row) => selectedIDs.has(row.id)
                                );

                                this.handleChangeStatusRows(selectedRows);
                            }}
                            components={{ Toolbar: GridToolbar }}
                            componentsProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                },
                            }}
                            getCellClassName={(params) => {
                                if (params.field === "inventory_status") {
                                    if (params.value == "Disputed") {
                                        return "redtext";
                                    } else {
                                        return "greentext";
                                    }
                                } else {
                                    return "";
                                }
                            }}
                            experimentalFeatures={{ newEditingApi: true }}
                            initialState={{
                                filter: {
                                    filterModel: {
                                        items: [
                                            {
                                                id: 1,
                                                columnField: "title",
                                                operatorValue: "contains",
                                                value: this.state.searchValue,
                                            },
                                            {
                                                id: 2,
                                                columnField: "sku",
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
                {modalContainer}
                {modalReceivingContainer}
                {modalHistoryContainer}
                {modalContainerNotes}
                {modalContainerQuantity}
            </React.Fragment>
        );
    }
}

export default InventoryWholesaleLists;
