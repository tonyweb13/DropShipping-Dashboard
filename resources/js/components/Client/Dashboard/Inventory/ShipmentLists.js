import React, { Component } from "react";
// import { Pagination } from "react-laravel-paginex";
import ImageUploading from "react-images-uploading";
import {
    AppBar,
    Container,
    Grid,
    Paper,
    CssBaseline,
    Box,
    Toolbar,
    Typography,
    Divider,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    IconButton,
    Button,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Slide,
    Dialog,
    Alert,
    Select,
    MenuItem,
    Checkbox,
    FormControl,
    InputLabel,
} from "@mui/material";
import Title from "../Common/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import plus_icon from "../../../../../img/plus_icon.png";
import edit_icon from "../../../../../img/edit_icon_new.png";
import trash_icon from "../../../../../img/trash_icon.png";
import archivetopicon from "../../../../../img/archive_top_icon.png";
import openfoldericon from "../../../../../img/open_folder_icon.png";
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
import moment from "moment";

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

class ShipmentLists extends Component {
    constructor(props) {
        super(props);

        //today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        const defaultcolumns = [
            { field: "id", headerName: "ID", hide: true },
            {
                field: "delivery_date",
                headerName: "Ship Date",
                width: 190,
            },
            {
                field: "shipment_title",
                headerName: "ShipmentID",
                width: 250,
            },
            {
                field: "title",
                headerName: "Item Title",
                width: 200,
                hide: true,
            },
            {
                field: "qty",
                headerName: "Expected Qty",
                width: 86,
                hide: true,
            },
            {
                field: "country",
                headerName: "Country",
                width: 126,
                hide: true,
            },
            {
                field: "contact_person",
                headerName: "Contact Person",
                width: 150,
                hide: true,
            },
            {
                field: "contact_number",
                headerName: "Contact Number",
                width: 150,
                hide: true,
            },
            {
                field: "notes",
                headerName: "Notes",
                width: 140,
                renderCell: (params) => {
                    return (
                        <Button
                            className="export_button"
                            onClick={this.handleOpenModalHistory.bind(
                                this,
                                params.row.shipmentid
                            )}
                        >
                            <VisibilityIcon />
                            &nbsp;{"View"}
                        </Button>
                    );
                },
            },
            {
                field: "upload",
                headerName: "Uploaded File",
                width: 210,
                renderCell: (params) => {
                    return (
                        <Link
                            href={this.state.uploadurl + params.row.upload}
                            target="_blank"
                        >
                            {params.row.upload ? <AttachFileIcon /> : ""}{" "}
                            {params.row.upload}
                        </Link>
                    );
                },
            },
            {
                field: "actions",
                type: "actions",
                headerName: "ACTIONS",
                width: 420,
                getActions: (params) => [
                    <Button
                        onClick={this.handleEditModal.bind(
                            this,
                            params.row.shipmentid
                        )}
                        className="export_button addbtn"
                    >
                        <img src={edit_icon} alt="edit icon" /> Edit
                    </Button>,
                    params.row.archived == 1 ? (
                        <>
                            <Button
                                onClick={this.handleDeleteModal.bind(
                                    this,
                                    params.row.shipmentid
                                )}
                                className="export_button addbtn"
                            >
                                <img src={trash_icon} alt="delete icon" />{" "}
                                Delete
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={this.handleArchiveOrder.bind(
                                    this,
                                    params.row.shipmentid,
                                    0
                                )}
                                className="archive_btn_table"
                            >
                                Restore
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={this.handleArchiveOrder.bind(
                                this,
                                params.row.shipmentid,
                                1
                            )}
                            className="archive_btn_table"
                        >
                            Archive
                        </Button>
                    ),
                ],
            },
        ];

        const defaultrows = [];
        const urlparams = new URLSearchParams(window.location.search);
        const sparamval = urlparams.get("search");
        this.state = {
            location: "inventory-add-shipments",
            title: props.Title,
            global_msg: {
                type: "error",
                message: "",
            },
            role: "",
            shipments: [],
            data: [],
            openModal: false,
            openEditModal: false,
            openDeleteModal: false,
            historyModal: false,
            form_message: "",
            formSubmitting: false,
            perpage: 200,
            uploadurl: "",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 200,
            statusfield: 0,
            showarchivedata: "inline-block",
            showactivedata: "none",
            archivedbtnlabel: "Archive",
            archived: [],
            shipment: {
                id: "",
                created_at: "",
                shipment_title: "",
                title: "",
                qty: "",
                sku: "",
                country: "",
                contact_person: "",
                notes: "",
                upload: "",
                files: "",
                status: "",
            },
            notes: [],
            file_name: "No file chosen",
            searchValue: sparamval,
            showaddshipmentbtn: "inline-block",
            productoptions: [],
            totalShipment: 0,
            todaysDate: formattedDate,
            user_fullname: "",
            isFileEmpty: true,
            showErrorMessageForFileUpload: false,
            accessLevel: 0,
        };

        this.handleAddShipmentSubmit = this.handleAddShipmentSubmit.bind(this);
        this.handleEditShipmentSubmit =
            this.handleEditShipmentSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    componentDidMount() {
        let accessUserLevel = parseInt(localStorage["accessUserLevel"]);
        let appstate = localStorage["appState"];
        let menustate = localStorage["menuState"];
        if (appstate) {
            let AppState = JSON.parse(appstate);
            let MenuAppState = JSON.parse(menustate);
            let shipmentbtnstatus =
                MenuAppState.member_menu.add_shipments_button == 1
                    ? "inline-block"
                    : "none";
            this.setState({
                role: AppState.role,
                showaddshipmentbtn: shipmentbtnstatus,
            });
        }
        this.getData({ page: 1, perpage: this.state.perpage });
        this.getsearch_params();

        // disable action is access level is 1.
        this.setState({ accessLevel: accessUserLevel });
        if (typeof accessUserLevel !== undefined && accessUserLevel == 1) {
            this.removeActionColumn();
        }
    }

    removeActionColumn = () => {
        const cfields = this.state.gridcolumns.filter(
            (column) => column.field !== "actions"
        );
        this.setState({ gridcolumns: cfields });
    };

    getData = (data) => {
        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        this.statusfield =
            data.statusfield !== undefined
                ? data.statusfield
                : this.state.statusfield;
        axios
            .get("api/shipments?statusfield=" + this.statusfield)
            .then((response) => {
                let fullgriddata = [];
                let ctrgrid = 1;
                response.data.shipments.forEach(function (key) {
                    let row_grid_data = {
                        id: key.id,
                        delivery_date: key.delivery_date,
                        shipment_title: key.shipment_title,
                        title: key.title,
                        sku: key.sku,
                        qty: key.qty,
                        country: key.country,
                        contact_person: key.contact_person,
                        contact_number: key.contact_number,
                        notes: key.notes,
                        upload: key.upload,
                        status: key.status,
                        archived: key.archived,
                        shipmentid: key.id,
                    };
                    fullgriddata.push(row_grid_data);
                    ctrgrid++;
                });

                this.setState({
                    gridrows: fullgriddata,
                    uploadurl: response.data.storageurl,
                    totalShipment: response.data.total,
                    user_fullname: response.data.user_fullname,
                });
            });
    };

    handleChangePerPage = (event) => {
        this.setState({
            perpage: event.target.value,
            pagesize: event.target.value,
            global_msg: { type: "success", message: "" },
        });
        this.getData({ page: 1, perpage: event.target.value });
    };

    handleShowForm = (event) => {
        axios.get("api/productslist").then((response) => {
            this.setState({
                openModal: true,
                global_msg: { message: "" },
            });
        });
    };

    handleCloseModal = (event) => {
        this.setState({ openModal: false });
    };

    handleCloseEditModal = (event) => {
        this.setState({ openEditModal: false });
    };

    handleCloseDeleteModal = (event) => {
        this.setState({ openDeleteModal: false });
    };

    handleCloseHistoryModal = (event) => {
        this.setState({ historyModal: false });
    };

    handleAddShipmentSubmit(e) {
        e.preventDefault();

        this.setState({ formSubmitting: true });
        const form = document.querySelector("#addShipmentForm");
        const shipmentData = new FormData(form);
        if (!this.state.isFileEmpty) {
            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                },
            };
            axios
                .post("api/add-shipments", shipmentData, config)
                .then((response) => {
                    this.setState({
                        openModal: false,
                        formSubmitting: false,
                        global_msg: {
                            type: "success",
                            message: "Shipment added successfully!",
                        },
                    });
                    this.getData({ page: 1 });
                })
                .catch((error) => {
                    let msg = "";
                    const errors = error.response.data.errors;
                    if (
                        typeof errors.shipment_title !== "undefined" &&
                        errors.shipment_title.length > 0
                    ) {
                        msg += errors.shipment_title[0] + "\r\n";
                    }
                    this.setState({ formSubmitting: false, form_message: msg });
                });
        } else {
            this.setState({ formSubmitting: false });
            this.setState({ showErrorMessageForFileUpload: true });
        }
    }
    handleFile(e) {
        this.setState({ file_name: e.target.files[0]["name"] });
        this.setState({ isFileEmpty: false });
        this.setState({ showErrorMessageForFileUpload: false });
    }

    handleEditShipmentSubmit(e) {
        e.preventDefault();

        this.setState({ formSubmitting: true });
        const form = document.querySelector("#addShipmentForm");
        const shipmentData = new FormData(form);
        shipmentData.append("id", this.state.shipment.id);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        axios
            .post("api/edit-shipments", shipmentData, config)
            .then((response) => {
                this.setState({
                    openEditModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message: "Shipment edited successfully!",
                    },
                    file_name: "No file chosen",
                });
                this.getData({ page: 1 });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.shipment_title !== "undefined" &&
                    errors.shipment_title.length > 0
                ) {
                    msg += errors.shipment_title[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleEditModal = (id) => {
        let token = document.querySelector('meta[name="csrf-token"]').content;

        axios
            .post("api/get-shipment", { id: id })
            .then((response) => {
                this.setState({
                    openEditModal: true,
                    shipment: {
                        id: response.data.shipment.id,
                        shipment_title: response.data.shipment.shipment_title,
                        title: response.data.shipment.title,
                        qty: response.data.shipment.qty,
                        sku: response.data.shipment.sku,
                        country: response.data.shipment.country,
                        contact_person: response.data.shipment.contact_person,
                        contact_number: response.data.shipment.contact_number,
                        notes: "",
                        upload: "",
                        status: response.data.shipment.status,
                    },
                    notes: response.data.notes,
                    uploadurl: response.data.storageurl,
                    global_msg: { message: "" },
                });
            })
            .catch((error) => {
                this.setState({ openEditModal: false });
            });
    };

    handleDeleteModal = (id) => {
        axios
            .post("api/get-shipment", { id: id })
            .then((response) => {
                this.setState({
                    openDeleteModal: true,
                    shipment: {
                        id: response.data.shipment.id,
                        shipment_title: response.data.shipment.shipment_title,
                        title: response.data.shipment.title,
                        qty: response.data.shipment.qty,
                        sku: response.data.shipment.sku,
                        country: response.data.shipment.country,
                        contact_person: response.data.shipment.contact_person,
                        contact_number: response.data.shipment.contact_number,
                        notes: response.data.shipment.notes,
                        upload: response.data.shipment.upload,
                        status: response.data.shipment.status,
                    },
                    global_msg: { message: "" },
                });
            })
            .catch((error) => {
                this.setState({ openDeleteModal: false });
            });
    };

    handleDeleteSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let id = this.state.shipment.id;

        axios
            .post("api/delete-shipment", { id: id })
            .then((response) => {
                this.setState({
                    openDeleteModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Shipment " +
                            this.state.shipment.shipment_title +
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

    handleArchiveOrder = (shipmentid, archivestatus) => {
        let shipmentmsg = "Shipment has been moved to archive.";
        if (archivestatus == 0) {
            shipmentmsg = "Shipment has been restored.";
        }

        const shipmentData = new FormData();
        shipmentData.append("shipmentid", shipmentid);
        shipmentData.append("status", archivestatus);
        axios.post("api/archiveshipment", shipmentData).then((response) => {
            this.setState({
                global_msg: { type: "success", message: shipmentmsg },
            });
            this.getData({ page: 1 });
        });
    };

    handleArchiveOrders = (event) => {
        let shipmentmsg = "Shipments has been moved to archive.";
        if (this.state.statusfield == 1) {
            shipmentmsg = "Shipments has been restored.";
        }

        const shipmentData = new FormData();
        shipmentData.append("shipments", JSON.stringify(this.state.archived));
        shipmentData.append("statusshipment", this.state.statusfield);
        axios.post("api/archiveshipments", shipmentData).then((response) => {
            this.setState({
                global_msg: { type: "success", message: shipmentmsg },
            });
            this.getData({ page: 1 });
        });
    };

    handleArchiveCheckedRows = (archived) => {
        this.setState({ archived: archived, global_msg: { message: "" } });
    };

    handleOpenModalHistory = (id) => {
        axios.post("api/get-shipment", { id: id }).then((response) => {
            this.setState({
                historyModal: true,
                shipment: {
                    id: response.data.shipment.id,
                    created_at: response.data.shipment.created_at,
                    shipment_title: response.data.shipment.shipment_title,
                    title: response.data.shipment.title,
                    qty: response.data.shipment.qty,
                    sku: response.data.shipment.sku,
                    country: response.data.shipment.country,
                    contact_person: response.data.shipment.contact_person,
                    contact_number: response.data.shipment.contact_number,
                    notes: response.data.shipment.notes,
                    upload: response.data.shipment.upload,
                    status: response.data.shipment.status,
                },
                notes: response.data.notes,
                uploadurl: response.data.storageurl,
                global_msg: { message: "" },
            });
        });
    };

    showArchiveOrders = (type) => {
        let btndisplayarchive = "inline-block";
        let btndisplayactive = "none";
        let btnarchivelabel = "Archive";
        if (type == 1) {
            btndisplayarchive = "none";
            btndisplayactive = "inline-block";
            btnarchivelabel = "Restore";
        }
        this.setState({
            showarchivedata: btndisplayarchive,
            showactivedata: btndisplayactive,
            statusfield: type,
            archivedbtnlabel: btnarchivelabel,
            global_msg: { message: "" },
        });
        this.getData({ page: 1, statusfield: type });
    };

    isImage = (url) => {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    };

    getsearch_params = () => {
        const urlparams = new URLSearchParams(window.location.search);
        let searchparamval = urlparams.get("search");
        let searchState = {
            searchtext: searchparamval,
        };
        localStorage["searchState"] = JSON.stringify(searchState);
    };
    render() {
        const fullWidth = true;
        const maxWidth = "md";

        const statuses = [
            "MATCH - Added to Inventory",
            "MISMATCH - Added to Inventory",
        ];
        let statusOptions;
        if (this.state.role == "Admin") {
            statusOptions = (
                <FormControl
                    variant="standard"
                    fullWidth
                    style={{ display: "none" }}
                >
                    <InputLabel id="status-simple-select-label">
                        Select Status
                    </InputLabel>
                    <Select
                        labelId="status-simple-select-label"
                        id="status-simple-select"
                        name="status"
                        label="Status"
                        defaultValue={"Shipped"}
                    >
                        {statuses.map((row) => (
                            <MenuItem key={row.toString()} value={row}>
                                {row}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }

        let historynotes = (
            <Alert style={{ margin: "20px 0" }} severity="error">
                No notes added.
            </Alert>
        );
        if (this.state.notes != "") {
            historynotes = (
                <div id="history-lists" style={{ marginBottom: "20px" }}>
                    {this.state.notes.map((row) => (
                        <div className="history">
                            <p>
                                <span>
                                    {moment(row.created_at).format("llll")} (By:{" "}
                                    {row.user_name})
                                </span>
                            </p>
                            <p>{row.notes}</p>
                            {row.upload != "" ? (
                                <a
                                    href={this.state.uploadurl + row.upload}
                                    target="_blank"
                                    style={{ textDecoration: "none" }}
                                >
                                    {this.isImage(
                                        this.state.uploadurl + row.upload
                                    ) ? (
                                        <img
                                            src={
                                                this.state.uploadurl +
                                                row.upload
                                            }
                                            alt="Note"
                                            style={{ maxWidth: "500px" }}
                                        />
                                    ) : (
                                        <div>
                                            <AttachFileIcon /> row.upload
                                        </div>
                                    )}
                                </a>
                            ) : (
                                ""
                            )}
                        </div>
                    ))}
                </div>
            );
        } else if (this.state.shipment.notes != null) {
            historynotes = (
                <div className="history">
                    <p>
                        <span>
                            {moment(this.state.shipment.created_at).format(
                                "llll"
                            )}
                        </span>
                    </p>
                    <p>{this.state.shipment.notes}</p>
                    {this.state.shipment.upload != "" ? (
                        <a
                            href={
                                this.state.uploadurl +
                                this.state.shipment.upload
                            }
                            target="_blank"
                            style={{ textDecoration: "none" }}
                        >
                            {this.isImage(
                                this.state.uploadurl +
                                    this.state.shipment.upload
                            ) ? (
                                <img
                                    src={
                                        this.state.uploadurl +
                                        this.state.shipment.upload
                                    }
                                    alt="Note"
                                    style={{ maxWidth: "500px" }}
                                />
                            ) : (
                                <div>
                                    <AttachFileIcon />{" "}
                                    this.state.shipment.upload
                                </div>
                            )}
                        </a>
                    ) : (
                        ""
                    )}
                </div>
            );
        }

        const modalContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="addShipmentForm"
                    component={"form"}
                    onSubmit={this.handleAddShipmentSubmit}
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
                            Add shipments
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.form_message}
                            </Alert>
                        )}
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
                            <Box sx={{ ml: 1, flex: 1 }}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="shipment_title"
                                    name="shipment_title"
                                    label="Shipment Title"
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                    value={
                                        `Shipment_${this.state.totalShipment}_` +
                                        this.state.todaysDate
                                    }
                                    readOnly
                                />
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
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
                                                id="upload-btn1"
                                            >
                                                Upload
                                            </Button>
                                        </label>
                                    </div>
                                </Box>
                            </Box>
                            {this.state.showErrorMessageForFileUpload ? (
                                <Typography>
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            paddingLeft: "6px",
                                            color: "#ff0000",
                                        }}
                                    >
                                        This field is required.
                                    </p>
                                </Typography>
                            ) : null}
                        </Typography>
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
                            <Box sx={{ display: "flex" }}></Box>
                        </Typography>
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="contact_person"
                                        name="contact_person"
                                        label="Contact Person"
                                        fullWidth
                                        rows={4}
                                        variant="standard"
                                        value={this.state.user_fullname}
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="contact_number"
                                        name="contact_number"
                                        label="Contact Number"
                                        fullWidth
                                        rows={4}
                                        variant="standard"
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="notes"
                                        name="notes"
                                        label="Add Notes"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        variant="standard"
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
                            {statusOptions}
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
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
                                </Box>
                            </Box>
                        </Typography>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        const modalEditContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openEditModal}
                onClose={this.handleCloseEditModal}
                className="ordermodal"
            >
                <Box
                    id="addShipmentForm"
                    component={"form"}
                    onSubmit={this.handleEditShipmentSubmit}
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
                                onClick={this.handleCloseEditModal}
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
                            Edit shipments
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.form_message}
                            </Alert>
                        )}
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            <Box sx={{ ml: 1, flex: 1 }}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="shipment_title"
                                    name="shipment_title"
                                    label="Shipment Title"
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                    defaultValue={
                                        this.state.shipment.shipment_title
                                    }
                                    readOnly
                                />
                            </Box>
                        </Typography>

                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
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
                                                id="upload-btn2"
                                            >
                                                Upload
                                            </Button>
                                        </label>
                                    </div>
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="contact_person"
                                        name="contact_person"
                                        label="Contact Person"
                                        fullWidth
                                        rows={4}
                                        variant="standard"
                                        defaultValue={
                                            this.state.shipment.contact_person
                                        }
                                    />
                                </Box>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="contact_number"
                                        name="contact_number"
                                        label="Contact Number"
                                        fullWidth
                                        rows={4}
                                        variant="standard"
                                        defaultValue={
                                            this.state.shipment.contact_number
                                        }
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="notes"
                                        name="notes"
                                        label="Add Notes"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        variant="standard"
                                        defaultValue={this.state.shipment.notes}
                                    />
                                </Box>
                            </Box>
                        </Typography>
                        {statusOptions}
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <div className="form_btns">
                                        <Button
                                            type={"button"}
                                            autoFocus
                                            color="inherit"
                                            onClick={this.handleCloseEditModal}
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
                                </Box>
                            </Box>
                        </Typography>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        const modalDeleteContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={"xs"}
                open={this.state.openDeleteModal}
                onClose={this.handleCloseDeleteModal}
                className="ordermodal"
            >
                <Box component={"form"} onSubmit={this.handleDeleteSubmit}>
                    <DialogTitle id="responsive-dialog-title">
                        Delete {this.state.shipment.shipment_title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Deleting this shipment can't be undone. Continue?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <TextField
                            hiddenLabel
                            id="id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.shipment.id}
                        />
                        <div className="form_btns form_btns_del">
                            <Button
                                type={"button"}
                                color="inherit"
                                onClick={this.handleCloseDeleteModal}
                            >
                                Close
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

        const modalHistoryContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.historyModal}
                onClose={this.handleCloseHistoryModal}
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
                                onClick={this.handleCloseHistoryModal}
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
                        <div id="history-lists">{historynotes}</div>
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
                    <div className="table_filter_options inventory_filters">
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
                            <Button
                                style={{ display: "inline-block" }}
                                onClick={this.handleArchiveOrders.bind(this)}
                                className="filter_top_btn"
                            >
                                <img src={archivetopicon} alt="archive icon" />
                                {this.state.archivedbtnlabel}
                            </Button>
                            <Button
                                variant="outlined"
                                style={{ display: this.state.showarchivedata }}
                                onClick={this.showArchiveOrders.bind(this, 1)}
                                className="filter_top_btn"
                            >
                                <img src={archivetopicon} alt="archive icon" />{" "}
                                Show Archived
                            </Button>
                            <Button
                                variant="outlined"
                                style={{ display: this.state.showactivedata }}
                                onClick={this.showArchiveOrders.bind(this, 0)}
                                className="filter_top_btn"
                            >
                                <img
                                    src={openfoldericon}
                                    alt="open folder icon"
                                />{" "}
                                Show Active Shipments
                            </Button>
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box className="subpage_graph_sort_cnt">
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={this.handleShowForm}
                                className="export_button addbtn"
                                style={{
                                    display: this.state.showaddshipmentbtn,
                                }}
                            >
                                <AddIcon /> Add Shipments
                            </Button>
                        </Box>
                    </div>
                    {/* <div className="table_grid_container">
						<Table size="small"  className="table_data">
							<TableHead>
							<TableRow>
								<TableCell>EST. DELIVERY DATE</TableCell>
								<TableCell>SHIPMENT TITLE</TableCell>
                <TableCell>ITEM TITLE</TableCell>
								<TableCell>ITEM SKU</TableCell>
								<TableCell>EXPECTED QTY</TableCell>
								<TableCell>COUNTRY</TableCell>
								<TableCell>CONTACT PERSON</TableCell>
								<TableCell>CONTACT NUMBER</TableCell>
								<TableCell>NOTES</TableCell>
								<TableCell>UPLOAD FILE</TableCell>
							</TableRow>
							</TableHead>
							<TableBody>
							{this.state.shipments.length > 0 ? this.state.shipments.map((row) => (						
								<TableRow>
								<TableCell>{row.delivery_date}</TableCell>
								<TableCell>{row.shipment_title}</TableCell>
                <TableCell>{row.title}</TableCell>
								<TableCell>{row.sku}</TableCell>
								<TableCell>{row.qty}</TableCell>
								<TableCell>{row.country}</TableCell>
								<TableCell>{row.contact_person}</TableCell>
								<TableCell>{row.contact_number}</TableCell>
								<TableCell>{(row.notes ? row.notes.substring(0, 20) : 'No Notes')}...</TableCell>
								<TableCell><a href={this.state.uploadurl + row.upload} target="_blank" style={{ textDecoration: 'none' }}><AttachFileIcon /> {row.upload}</a></TableCell>
								</TableRow>
							)) : 
                                <TableRow key={0}>
                                  <TableCell colSpan={7}>No matching shipments found.</TableCell>
                                </TableRow>
                            }
							</TableBody>
						</Table>
					</div>
					<Typography component="div" className="inventory_pagination_div">
						<Pagination count={10} changePage={this.getData} data={this.state.data} variant="outlined" shape="rounded"  prevButtonClass="prev_pbtn" nextButtonClass="next_pbtn"/>
					</Typography> */}
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
                            checkboxSelection
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = this.state.gridrows.filter(
                                    (row) => selectedIDs.has(row.id)
                                );

                                this.handleArchiveCheckedRows(selectedRows);
                            }}
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
                            getCellClassName={(params) => {
                                if (params.field === "status") {
                                    if (
                                        params.value ==
                                        "MISMATCH - Added to Inventory"
                                    ) {
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
                                                columnField: "shipment_title",
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
                {modalEditContainer}
                {modalDeleteContainer}
                {modalHistoryContainer}
            </React.Fragment>
        );
    }
}

export default ShipmentLists;
