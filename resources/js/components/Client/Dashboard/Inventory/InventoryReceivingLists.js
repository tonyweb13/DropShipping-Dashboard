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
    Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
                field: "inventory_date",
                headerName: "Check-In Date",
                width: 140,
            },
            {
                field: "title",
                headerName: "Item Title",
                width: 200,
            },
            {
                field: "sku",
                headerName: "Item SKU",
                width: 200,
            },
            {
                field: "inventory_count",
                headerName: "PK Count",
                width: 100,
            },
            {
                field: "country",
                headerName: "Country",
                width: 100,
            },
            {
                field: "inventory_status",
                headerName: "Status",
                width: 100,
                renderCell: (params) => {
                    let inventorystatus = "For Review";
                    if (params.row.inventory_status != null) {
                        inventorystatus = params.row.inventory_status;
                    }
                    return inventorystatus;
                },
            },
            {
                field: "notes",
                headerName: "Notes",
                width: 150,
                renderCell: (params) => {
                    return (
                        <Button
                            className="btnLink"
                            style={{ textDecoration: "none" }}
                            onClick={this.handleOpenModalHistory.bind(
                                this,
                                params.row.inventory_id
                            )}
                        >
                            <VisibilityIcon />
                            &nbsp;{"View"}
                        </Button>
                    );
                },
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Action",
                renderCell: (params) => {
                    if (
                        params.row.inventory_status != null &&
                        this.state.statusfilter == "Disputed"
                    ) {
                        return (
                            <div>
                                <Button
                                    variant="outlined"
                                    onClick={this.handleChangeReceivingStatus.bind(
                                        this,
                                        params.row.actions,
                                        "Approved"
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20 actionbtn"
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={this.handleOpenModalNotes.bind(
                                        this,
                                        params.row.actions
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20 actionbtn"
                                >
                                    <img src={edit_icon} alt="edit icon" />
                                    &nbsp; Note
                                </Button>
                            </div>
                        );
                    } else if (
                        params.row.inventory_status != null &&
                        this.state.statusfilter == "Approved"
                    ) {
                        return "";
                    } else {
                        return (
                            <div>
                                <Button
                                    variant="outlined"
                                    onClick={this.handleChangeReceivingStatus.bind(
                                        this,
                                        params.row.actions,
                                        "Approved"
                                    )}
                                    className="primary-btn datagridbtn autowidth padrl20 actionbtn"
                                >
                                    Approve
                                </Button>{" "}
                                <Button
                                    variant="outlined"
                                    onClick={this.handleOpenModal.bind(
                                        this,
                                        params.row.actions
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20 actionbtn"
                                >
                                    Dispute
                                </Button>{" "}
                                <Button
                                    variant="outlined"
                                    onClick={this.handleOpenEditReceivingModal.bind(
                                        this,
                                        params.row.actions
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20 actionbtn"
                                >
                                    Edit
                                </Button>{" "}
                                <Button
                                    variant="outlined"
                                    onClick={this.handleOpenDeleteReceivingModal.bind(
                                        this,
                                        params.row.actions
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20 actionbtn"
                                >
                                    Delete
                                </Button>{" "}
                                <Button
                                    variant="outlined"
                                    onClick={this.handleOpenModalNotes.bind(
                                        this,
                                        params.row.actions
                                    )}
                                    className="primary-btn datagridbtn autowidth  padrl20 actionbtn"
                                >
                                    <img src={edit_icon} alt="edit icon" />
                                    &nbsp; Note
                                </Button>
                            </div>
                        );
                    }
                },
                width: 400,
            },
            {
                field: "inventory_id",
                headerName: " ",
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
            openEditReceivingModal: false,
            openDeleteReceivingModal: false,
            openActionReceivingModal: false,
            openModalNotes: false,
            historyModal: false,
            openModalQuantity: false,
            formSubmitting: false,
            images: "",
            imageList: "",
            country: "US",
            perpage: 200,
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
                inventory_id: 0,
                checkindate: "",
                product: "",
                quantity: "",
                country: "",
                pname: "",
            },
            sorting: "ASC",
            showhistoricalold: "inline-block",
            showhistoricallatest: "none",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 200,
            uploadurl: "",
            file_name: "No file chosen",
            datetimesync: "",
            showdisputedbtn: "inline-block",
            showdisputedbtndefault: "none",
            showapprovebtn: "inline-block",
            showapprovebtndefault: "none",
            showchangestatusbtns: "none",
            showrestorebtn: "none",
            searchValue: sparamval,
            role: "",
            productoptions: [],
            showaddreceivingbtn: "inline-block",
            accessLevel: 0,
            startdate: "",
            enddate: "",
            displayDates: "none",
            receiving: "30days",
            actionstatus: "",
            receivingstatus: "",
            showAlert: true,
        };

        this.handleInventorySubmit = this.handleInventorySubmit.bind(this);
        this.handleAddInventorySubmit =
            this.handleAddInventorySubmit.bind(this);
        this.handleEditInventorySubmit =
            this.handleEditInventorySubmit.bind(this);
        this.handleReceivingDeleteSubmit =
            this.handleReceivingDeleteSubmit.bind(this);
        this.handleReceivingActionSubmit =
            this.handleReceivingActionSubmit.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
        this.handleNotes = this.handleNotes.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleInventorySubmitNotes =
            this.handleInventorySubmitNotes.bind(this);
    }

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
            let receivingbtnstatus =
                MenuAppState.member_menu.add_receiving_button == 1
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
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            date: date,
            datefilter: this.state.receiving,
        });

        this.getsearch_params();

        // disable action is access level is 1.
        this.setState({ accessLevel: accessUserLevel });
        if (typeof accessUserLevel !== undefined && accessUserLevel == 1) {
            this.removeActionColumn();
        }
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
        this.datefilter =
            data.datefilter !== undefined
                ? data.datefilter
                : this.state.receiving;
        this.start_date =
            data.start_date !== undefined
                ? data.start_date
                : this.state.startdate;
        this.end_date =
            data.end_date !== undefined ? data.end_date : this.state.enddate;

        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;

        axios
            .get(
                "api/receivingproducts?history=" +
                    this.historydata +
                    "&statusfilter=" +
                    this.statfilter +
                    "&stocktype=" +
                    stocktype +
                    "&datefilter=" +
                    this.datefilter +
                    "&start_date=" +
                    this.start_date +
                    "&end_date=" +
                    this.end_date
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
                        country: cnty,
                        inventory_status: key.inventory_status,
                        notes: key.inventory_notes,
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

    handleOpenEditReceivingModal = (inventoryid) => {
        axios
            .get("api/get-receiving-item?inventoryid=" + inventoryid)
            .then((response) => {
                const product_options = [];
                response.data.products.forEach(function (key) {
                    const product_label =
                        key.ProductAlias != null
                            ? key.ProductAlias
                            : key.ProductName;
                    let row_grid_data = {
                        value: key.ProductVariantID,
                        label: product_label,
                    };
                    product_options.push(row_grid_data);
                });

                const productname =
                    response.data.selectedproduct.ProductAlias != null
                        ? response.data.selectedproduct.ProductAlias
                        : response.data.selectedproduct.ProductName;

                this.setState({
                    openEditReceivingModal: true,
                    inventory_new_receiving: {
                        inventory_id: response.data.receiving.id,
                        checkindate: response.data.receiving.date,
                        product: response.data.receiving.product_id,
                        quantity: response.data.receiving.count,
                        pname: productname,
                    },
                    productoptions: product_options,
                });
            });
    };

    handleOpenDeleteReceivingModal = (inventoryid) => {
        axios
            .get("api/get-receiving-item?inventoryid=" + inventoryid)
            .then((response) => {
                const productname =
                    response.data.selectedproduct.ProductAlias != null
                        ? response.data.selectedproduct.ProductAlias
                        : response.data.selectedproduct.ProductName;

                this.setState({
                    openDeleteReceivingModal: true,
                    inventory_new_receiving: {
                        inventory_id: response.data.receiving.id,
                        pname: productname,
                        product: response.data.receiving.product_id,
                    },
                });
            });
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
            openDeleteReceivingModal: false,
            openActionReceivingModal: false,
            openEditReceivingModal: false,
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
            .post("api/add-receiving-item", this.state.inventory_new_receiving)
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
                        product: 0,
                        quantity: 0,
                        country: "",
                    },
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
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleEditInventorySubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });

        axios
            .post("api/edit-receiving-item", this.state.inventory_new_receiving)
            .then((response) => {
                this.setState({
                    openEditReceivingModal: false,
                    global_msg: {
                        type: "success",
                        message: "Receiving item updated successfully!",
                    },
                    formSubmitting: false,
                    file_name: "No file chosen",
                });
                this.getData({ page: 1 });
                this.setState({
                    form_message: "",
                    inventory_new_receiving: {
                        checkindate: "",
                        product: 0,
                        quantity: 0,
                        country: "",
                    },
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
                    typeof errors.count !== "undefined" &&
                    errors.count.length > 0
                ) {
                    msg += errors.count[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleReceivingDeleteSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });

        axios
            .post(
                "api/delete-receiving-item",
                this.state.inventory_new_receiving
            )
            .then((response) => {
                this.setState({
                    openDeleteReceivingModal: false,
                    global_msg: {
                        type: "success",
                        message: "Receiving item deleted successfully!",
                    },
                    formSubmitting: false,
                    file_name: "No file chosen",
                });
                this.getData({ page: 1 });
                this.setState({
                    form_message: "",
                    inventory_new_receiving: {
                        checkindate: "",
                        product: 0,
                        quantity: 0,
                        country: "",
                    },
                });
            })
            .catch((error) => {
                this.setState({ formSubmitting: false, form_message: "" });
            });
    }

    handleReceivingActionSubmit(e) {
        e.preventDefault();
        const shipmentData = new FormData();
        shipmentData.append(
            "inventory_ids",
            JSON.stringify(this.state.receiveditems)
        );
        shipmentData.append("status", this.state.receivingstatus);
        axios.post("api/add-receiving-items", shipmentData).then((response) => {
            this.setState({
                openActionReceivingModal: false,
                receiveditems: [],
                global_msg: {
                    type: "success",
                    message:
                        "Receiving item(s) " +
                        this.state.receivingstatus +
                        " successfully!",
                },
            });
            this.getData({ page: 1 });
        });
    }

    handleChangeReceivingItemsStatus = (receivestatus, status) => {
        if (this.state.receiveditems.length > 0) {
            this.setState({
                openActionReceivingModal: true,
                receivingstatus: receivestatus,
                actionstatus: status,
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
        let showStatusBtns = "none";
        let showRestoreBtn = "none";
        if (receiveditems.length > 0) {
            if (this.state.statusfilter != "") {
                showRestoreBtn = "inline-block";
            } else {
                showStatusBtns = "inline-block";
            }
        }
        this.setState({
            showchangestatusbtns: showStatusBtns,
            showrestorebtn: showRestoreBtn,
            receiveditems: receiveditems,
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
            const product_options = [];
            response.data.products.forEach(function (key) {
                let row_grid_data = {
                    value: key.ProductVariantID,
                    label: key.ProductName,
                };
                product_options.push(row_grid_data);
            });
            this.setState({
                openReceivingModal: true,
                productoptions: product_options,
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
        this.setState((prevState) => ({
            inventory_new_receiving: {
                ...prevState.inventory_new_receiving,
                quantity: value,
            },
        }));
    };

    handleAddCountry = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            inventory_new_receiving: {
                ...prevState.inventory_new_receiving,
                country: value,
            },
        }));
    };

    handleChangeReceivingQuantity = (e) => {
        this.setState({
            openModalQuantity: true,
            form_message: "",
            inventory_new_receiving: {
                checkindate: "",
                product: 0,
                quantity: 0,
                country: "",
            },
        });
    };

    removeActionColumn = () => {
        const cfields = this.state.gridcolumns.filter(
            (column) => column.field !== "actions"
        );
        this.setState({ gridcolumns: cfields });
    };

    handleChangeDateFilter = (event) => {
        this.setState({ receiving: event.target.value });
        if (event.target.value == "custom") {
            this.setState({ displayDates: "inline-block" });
        } else {
            this.setState({
                displayDates: "none",
                enddate: null,
                startdate: null,
            });
            this.getData({
                page: 1,
                perpage: this.state.perpage,
                datefilter: event.target.value,
            });
        }
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

        this.setState({ startdate: fdate });
        let sdate = fdate;
        let edate = this.state.enddate;
        if (sdate != "" && edate != "") {
            this.getData({
                page: 1,
                perpage: this.state.perpage,
                start_date: sdate,
                end_date: edate,
            });
        }
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

        this.setState({ enddate: fdate });
        let sdate = this.state.startdate;
        let edate = fdate;
        if (sdate != "" && edate != "") {
            this.getData({
                page: 1,
                perpage: this.state.perpage,
                start_date: sdate,
                end_date: edate,
            });
        }
    };

    handleCloseAlert = () => {
        this.setState({
            global_msg: {
                type: "",
                message: "",
                showAlert: false,
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

        const renderOption = (props, option) => {
            const { value, label } = option;
            return (
                <MenuItem {...props} key={value} value={value}>
                    {label}
                </MenuItem>
            );
        };

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
                        <div style={{ marginBottom: "20px" }}>
                            <InputLabel>Check-In Date</InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
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
                        <div style={{ marginBottom: "20px" }}>
                            <InputLabel>Select Item</InputLabel>
                            <Autocomplete
                                disablePortal
                                style={{ height: "auto" }}
                                options={this.state.productoptions}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) =>
                                    option.value === value.value
                                }
                                onChange={this.handleAddProduct}
                                className="table-filters filter_selects"
                                fullWidth
                                renderOption={renderOption}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Type to select item."
                                        variant="outlined"
                                    />
                                )}
                            />
                        </div>
                        <div>
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

        const modalEditReceivingContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openEditReceivingModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="inventoryEditReceivingForm"
                    component={"form"}
                    onSubmit={this.handleEditInventorySubmit}
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
                            Edit Receiving
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.form_message}
                            </Alert>
                        )}
                        <div style={{ marginBottom: "20px" }}>
                            <InputLabel>Check-In Date</InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
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
                        <div style={{ marginBottom: "20px" }}>
                            <InputLabel>Select Item</InputLabel>
                            <Autocomplete
                                disablePortal
                                style={{ height: "auto" }}
                                options={this.state.productoptions}
                                getOptionLabel={(option) => {
                                    let prodname =
                                        this.state.inventory_new_receiving
                                            .pname;
                                    if (typeof option === "object") {
                                        prodname = option.label;
                                    }
                                    return prodname;
                                }}
                                isOptionEqualToValue={(option, value) => {
                                    let cval = value;
                                    if (typeof value === "object") {
                                        cval = value.value;
                                    }
                                    return option.value === cval;
                                }}
                                onChange={this.handleAddProduct}
                                className="table-filters filter_selects"
                                fullWidth
                                renderOption={renderOption}
                                defaultValue={
                                    this.state.inventory_new_receiving.product
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Type to select item."
                                        variant="outlined"
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="quantity"
                                name="quantity"
                                label="Item Quantity"
                                fullWidth
                                variant="standard"
                                value={
                                    this.state.inventory_new_receiving.quantity
                                }
                                onChange={this.handleAddQuantity}
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

        const modalDeleteContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={"xs"}
                open={this.state.openDeleteReceivingModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    component={"form"}
                    onSubmit={this.handleReceivingDeleteSubmit}
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
                            Delete Receiving
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this receiving item
                            "{this.state.inventory_new_receiving.pname}"?
                        </DialogContentText>
                        <DialogActions>
                            <TextField
                                hiddenLabel
                                id="inventory_id"
                                type="hidden"
                                variant="standard"
                                defaultValue={
                                    this.state.inventory_new_receiving
                                        .inventory_id
                                }
                            />
                            <div className="form_btns">
                                <Button onClick={this.handleCloseModal}>
                                    Cancel
                                </Button>
                                <Button
                                    type={"submit"}
                                    color="inherit"
                                    variant="contained"
                                >
                                    Delete
                                </Button>
                            </div>
                        </DialogActions>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        const modalActionContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={"xs"}
                open={this.state.openActionReceivingModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    component={"form"}
                    onSubmit={this.handleReceivingActionSubmit}
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
                            {this.state.actionstatus} Receiving
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to {this.state.actionstatus}{" "}
                            this item(s)?
                        </DialogContentText>
                        <DialogActions>
                            <div className="form_btns">
                                <Button onClick={this.handleCloseModal}>
                                    No
                                </Button>
                                <Button
                                    type={"submit"}
                                    color="inherit"
                                    variant="contained"
                                >
                                    Yes
                                </Button>
                            </div>
                        </DialogActions>
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
                                <Typography
                                    component="div"
                                    className="receiving_filters"
                                >
                                    <span>Filter By: &nbsp; </span>
                                    <Select
                                        value={this.state.statusfilter}
                                        onChange={this.handleChangeFilter}
                                        displayEmpty
                                        inputProps={{
                                            "aria-label": "Without label",
                                        }}
                                        className="table-filters filter_selects"
                                        IconComponent={KeyboardArrowDownIcon}
                                    >
                                        <MenuItem value="">
                                            Pending Review
                                        </MenuItem>
                                        <MenuItem value={"Disputed"}>
                                            Disputed
                                        </MenuItem>
                                        <MenuItem value={"Approved"}>
                                            Approved
                                        </MenuItem>
                                    </Select>
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
                                </Typography>
                                <Typography
                                    component="div"
                                    className="table_area_date receiving_area_date"
                                    style={{ display: this.state.displayDates }}
                                >
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <DesktopDatePicker
                                            label="Start Date"
                                            inputFormat="YYYY-MM-DD"
                                            value={this.state.startdate}
                                            onChange={
                                                this.handleStartDateChange
                                            }
                                            className="table-filters filter_selects date-picker-field"
                                            renderInput={(params) => (
                                                <TextField {...params} />
                                            )}
                                        />
                                        <DesktopDatePicker
                                            label="End Date"
                                            inputFormat="YYYY-MM-DD"
                                            value={this.state.enddate}
                                            onChange={this.handleEndDateChange}
                                            className="table-filters filter_selects date-picker-field"
                                            renderInput={(params) => (
                                                <TextField {...params} />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Typography>
                                <Select
                                    value={this.state.receiving}
                                    onChange={this.handleChangeDateFilter}
                                    displayEmpty
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
                                    className="filter-graph-by filter_selects"
                                    IconComponent={KeyboardArrowDownIcon}
                                >
                                    <MenuItem value="thisweek">
                                        <em style={{ fontStyle: "normal" }}>
                                            This Week
                                        </em>
                                    </MenuItem>
                                    <MenuItem value={"thismonth"}>
                                        This Month
                                    </MenuItem>
                                    <MenuItem value={"7days"}>
                                        Last 7 Days
                                    </MenuItem>
                                    <MenuItem value={"30days"}>
                                        Last 30 Days
                                    </MenuItem>
                                    <MenuItem value={"lastmonth"}>
                                        Last month
                                    </MenuItem>
                                    <MenuItem value={"thisquarter"}>
                                        This quarter
                                    </MenuItem>
                                    <MenuItem value={"lastquarter"}>
                                        Last quarter
                                    </MenuItem>
                                    <MenuItem value={"last12months"}>
                                        Last 12 Months
                                    </MenuItem>
                                    <MenuItem value={"custom"}>
                                        Custom Date
                                    </MenuItem>
                                </Select>
                                {this.state.accessLevel == 0 ? (
                                    <>
                                        <div
                                            style={{
                                                display:
                                                    this.state
                                                        .showchangestatusbtns,
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                onClick={this.handleChangeReceivingItemsStatus.bind(
                                                    this,
                                                    "Approved",
                                                    "Approve"
                                                )}
                                                className="archive_btn_table"
                                            >
                                                Approve
                                            </Button>{" "}
                                            &nbsp;
                                            <Button
                                                variant="outlined"
                                                onClick={this.handleChangeReceivingItemsStatus.bind(
                                                    this,
                                                    "Disputed",
                                                    "Dispute"
                                                )}
                                                className="archive_btn_table"
                                            >
                                                Dispute
                                            </Button>{" "}
                                            &nbsp;
                                        </div>
                                        {/* <div
                                            style={{
                                                display:
                                                    this.state.showrestorebtn,
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                onClick={this.handleChangeReceivingItemsStatus.bind(
                                                    this,
                                                    "Restore",
                                                    "Restore"
                                                )}
                                                className="archive_btn_table"
                                            >
                                                Restore
                                            </Button>{" "}
                                            &nbsp;
                                        </div> */}
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Typography>
                        </Typography>
                        {this.state.accessLevel == 0 ? (
                            <>{addReceivingBtn}</>
                        ) : (
                            <></>
                        )}
                    </div>
                    {this.state.global_msg.message != "" && (
                        <Alert
                            style={{ marginBottom: "20px" }}
                            severity={this.state.global_msg.type}
                            onClose={this.handleCloseAlert}
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
                            checkboxSelection
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = this.state.gridrows.filter(
                                    (row) => selectedIDs.has(row.id)
                                );

                                this.handleChangeStatusRows(selectedRows);
                            }}
                            components={{
                                Toolbar: GridToolbar,
                                Footer: CustomFooter,
                            }}
                            componentsProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                },
                            }}
                            getCellClassName={(params) => {
                                if (params.field === "inventory_status") {
                                    if (params.value == "Disputed") {
                                        return "redtext";
                                    } else if (params.value == "Approved") {
                                        return "greentext";
                                    } else {
                                        return "";
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
                {modalEditReceivingContainer}
                {modalDeleteContainer}
                {modalActionContainer}
                {modalHistoryContainer}
                {modalContainerNotes}
                {modalContainerQuantity}
            </React.Fragment>
        );
    }
}

export default InventoryLists;
