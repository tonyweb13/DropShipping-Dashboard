import React, { Component } from "react";
import { withRouter } from "react-router-dom";
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
    Checkbox,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
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
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
    DataGridPremium,
    GridToolbar,
    GridActionsCellItem,
} from "@mui/x-data-grid-premium";
import { isNull } from "lodash";
import axios from "axios";

class NotifyLists extends Component {
    constructor(props) {
        super(props);

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "notification_title",
                headerName: "Title",
                flex: 1,
            },
            {
                field: "notification_content",
                headerName: "Notes",
                flex: 1,
            },
            {
                field: "notification_upload",
                headerName: "Uploaded File",
                width: 210,
                renderCell: (params) => {
                    return (
                        <Link
                            href={
                                this.state.uploadurl +
                                params.row.notification_upload
                            }
                            target="_blank"
                        >
                            {params.row.notification_upload ? (
                                <AttachFileIcon />
                            ) : (
                                ""
                            )}{" "}
                            {params.row.notification_upload}
                        </Link>
                    );
                },
            },
            {
                field: "store",
                headerName: "Store",
                flex: 1,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                getActions: (params) => [
                    <Button
                        onClick={this.handleEditModal.bind(this, params.row.id)}
                        className="custbtn adminactionbtn"
                    >
                        <span className="edit_icon" /> Edit
                    </Button>,
                    <Button
                        onClick={this.handleDeleteModal.bind(
                            this,
                            params.row.id
                        )}
                        className="custbtn adminactionbtn admincust_delete"
                    >
                        <span className="delete_icon" /> Delete
                    </Button>,
                ],
                width: 300,
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
            openModal: false,
            editModal: false,
            deleteModal: false,
            formSubmitting: false,
            message: "",
            showdesc: "block",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            file_name: "No file chosen",
            pagesize: 20,
            defaultstore: 0,
            stores: [],
            uploadurl: "",
            notifyinfo: {
                nid: "",
                notification_title: "",
                notification_content: "",
                notification_upload: "",
                store_id: 0,
            },
            form_message: "",
        };

        this.handleNotificationSubmit =
            this.handleNotificationSubmit.bind(this);
        this.handleNotificationEditSubmit =
            this.handleNotificationEditSubmit.bind(this);
        this.handleNotificationDeleteSubmit =
            this.handleNotificationDeleteSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleStoreSelected = this.handleStoreSelected.bind(this);
    }

    componentDidMount() {
        this.getData({ page: 1 });
        this.storelists();
    }

    getData = (data) => {
        axios.get("api/notifications").then((response) => {
            let fullgriddata = [];
            let ctrgrid = 1;
            response.data.notify.forEach(function (key) {
                let storedata =
                    key.store != "" && !isNull(key.store)
                        ? key.store
                        : "All Stores";
                let row_grid_data = {
                    id: key.id,
                    notification_title: key.notification_title,
                    notification_content: key.notification_content,
                    notification_upload: key.notification_upload,
                    store: storedata,
                    actions: key.id,
                };
                fullgriddata.push(row_grid_data);
                ctrgrid++;
            });
            this.setState({
                gridrows: fullgriddata,
                uploadurl: response.data.storageurl,
            });
        });
    };

    handleOpenModal = () => {
        this.setState({
            openModal: true,
            notifyinfo: { store_id: 0 },
            file_name: "No file chosen",
            form_message: "",
        });
    };

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            editModal: false,
            deleteModal: false,
            global_msg: { message: "" },
        });
    };

    showdescription = () => {
        let showtoggle = this.state.showdesc == "none" ? "block" : "none";
        this.setState({ showdesc: showtoggle });
    };

    handleNotificationSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        const form = document.querySelector("#addNotifyForm");
        const notifyData = new FormData(form);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        if (this.state.file_name == "No file chosen") {
            this.setState({
                formSubmitting: false,
                form_message: "File upload is empty.",
            });
        } else {
            axios
                .post("api/add-notification", notifyData, config)
                .then((response) => {
                    this.setState({
                        openModal: false,
                        formSubmitting: false,
                        global_msg: {
                            type: "success",
                            message: "Notification added successfully!",
                        },
                    });
                    this.getData({ page: 1 });
                })
                .catch((error) => {
                    let msg = "";
                    const errors = error.response.data.errors;
                    if (
                        typeof errors.files !== "undefined" &&
                        errors.files.length > 0
                    ) {
                        msg += errors.files[0] + "\r\n";
                    }
                    this.setState({ formSubmitting: false, form_message: msg });
                });
        }
    }

    handleNotificationEditSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        const form = document.querySelector("#addNotifyForm");
        const notifyData = new FormData(form);
        notifyData.append("nid", this.state.notifyinfo.nid);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        axios
            .post("api/updateNotification", notifyData, config)
            .then((response) => {
                this.setState({
                    editModal: false,
                    formSubmitting: false,
                    notifyinfo: {
                        nid: "",
                        notification_title: "",
                        notification_content: "",
                        notification_upload: "",
                        store_id: 0,
                    },
                    global_msg: {
                        type: "success",
                        message: "Notification has been updated!",
                    },
                });
                this.getData({ page: 1 });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.files !== "undefined" &&
                    errors.files.length > 0
                ) {
                    msg += errors.files[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleNotificationDeleteSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let id = this.state.notifyinfo.nid;

        axios
            .post("api/delete-notification", { id: id })
            .then((response) => {
                this.setState({
                    deleteModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message: "Notification has been deleted successfully!",
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

    handleEditModal = (editid) => {
        axios
            .post("api/get-notification", { id: editid })
            .then((response) => {
                this.setState({
                    editModal: true,
                    file_name: "No file chosen",
                    notifyinfo: {
                        nid: editid,
                        notification_title:
                            response.data.notifydata.notification_title,
                        notification_content:
                            response.data.notifydata.notification_content,
                        notification_upload:
                            response.data.notifydata.notification_upload,
                        store_id: response.data.notifydata.store_id,
                        defaultstore: response.data.notifydata.store_id,
                    },
                    file_name: response.data.notifydata.notification_upload,
                    global_msg: { message: "" },
                });
            })
            .catch((error) => {
                this.setState({ editModal: false });
            });
    };

    handleDeleteModal = (id) => {
        this.setState({ deleteModal: true, notifyinfo: { nid: id } });
    };

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    };
    handleFile(e) {
        this.setState({ file_name: e.target.files[0]["name"] });
    }

    handleStoreSelected(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            notifyinfo: {
                ...prevState.nofityinfo,
                store_id: value,
                nid: this.state.notifyinfo.nid,
            },
        }));
    }
    storelists = () => {
        axios.get("api/getallstores").then((response) => {
            this.setState({ stores: response.data.stores });
        });
    };
    render() {
        const fullWidth = true;
        const maxWidth = "md";
        const storeslist = this.state.stores;
        let storeOptions;
        storeOptions = (
            <FormControl variant="standard" fullWidth>
                <InputLabel id="store-simple-select-label">
                    Select Store
                </InputLabel>
                <Select
                    labelId="store-simple-select-label"
                    id="store-simple-select"
                    name="store_id"
                    label="Store"
                    value={this.state.notifyinfo.store_id}
                    onChange={this.handleStoreSelected}
                >
                    <MenuItem key={0} value="0">
                        {" "}
                        All Stores{" "}
                    </MenuItem>
                    {storeslist.map((row) => (
                        <MenuItem key={row.id} value={row.id}>
                            {row.store_name + " (" + row.country + ")"}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );

        const modalContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="addNotifyForm"
                    component={"form"}
                    onSubmit={this.handleNotificationSubmit}
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
                            Add New Notification
                        </Typography>
                        {this.state.message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.message}
                            </Alert>
                        )}
                        {storeOptions}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="notification_title"
                            name="notification_title"
                            label="Title"
                            type="text"
                            fullWidth
                            variant="standard"
                            required
                        />
                        <TextField
                            margin="dense"
                            id="notification_content"
                            name="notification_content"
                            label="Notes"
                            multiline
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            <div className="fileupload_div">
                                <input
                                    style={{ display: "none" }}
                                    id="notification-upload-file"
                                    name="files"
                                    type="file"
                                    onChange={this.handleFile}
                                />
                                <span className="filetext">
                                    {this.state.file_name}
                                </span>
                                <label htmlFor="notification-upload-file">
                                    <Button
                                        variant="raised"
                                        component="span"
                                        id="upload-btn1"
                                    >
                                        Upload
                                    </Button>
                                </label>
                            </div>
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert severity="error">
                                {this.state.form_message}
                            </Alert>
                        )}
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
                className="ordermodal"
            >
                <Box
                    id="addNotifyForm"
                    component={"form"}
                    onSubmit={this.handleNotificationEditSubmit}
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
                            Edit Notification
                        </Typography>

                        {storeOptions}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="notification_title"
                            name="notification_title"
                            label="Title"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={
                                this.state.notifyinfo.notification_title
                            }
                            required
                        />
                        <TextField
                            margin="dense"
                            id="notification_content"
                            name="notification_content"
                            label="Notes"
                            multiline
                            fullWidth
                            rows={4}
                            variant="standard"
                            defaultValue={
                                this.state.notifyinfo.notification_content
                            }
                        />
                        <Typography
                            sx={{ ml: 1, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            <div className="fileupload_div">
                                <input
                                    style={{ display: "none" }}
                                    id="notification-upload-file"
                                    name="files"
                                    type="file"
                                    onChange={this.handleFile}
                                />
                                <span className="filetext">
                                    {this.state.file_name}
                                </span>
                                <label htmlFor="notification-upload-file">
                                    <Button
                                        variant="raised"
                                        component="span"
                                        id="upload-btn1"
                                    >
                                        Upload
                                    </Button>
                                </label>
                            </div>
                        </Typography>
                        {this.state.form_message != "" && (
                            <Alert severity="error">
                                {this.state.form_message}
                            </Alert>
                        )}
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
                className="ordermodal"
            >
                <Box
                    component={"form"}
                    onSubmit={this.handleNotificationDeleteSubmit}
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
                            Delete Notification
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            Deleting this notification can't be undone.
                            Continue?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <TextField
                            hiddenLabel
                            id="store_id"
                            type="hidden"
                            variant="standard"
                            // defaultValue={this.state.user.customer_id}
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

        return (
            <React.Fragment>
                <Box
                    m={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {/* <Typography component="h2" className="admin_page_title">{this.state.title} <img src={helpIcon} alt="help icon" className="helpicon" onClick={this.showdescription}/></Typography> */}
                </Box>
                <Typography
                    component="div"
                    className="pagedescription"
                    display={this.state.showdesc}
                >
                    <div className="admin_desc_info">
                        In the notification section, you can review and manage
                        all details from of the notificaton. You can view,
                        delete and edit many information of the notification by
                        stores. Access to this area is limited. Only
                        administrators or team leaders can reach.
                    </div>
                    <div className="admin_topright_btn">
                        <Button
                            variant="outlined"
                            onClick={this.handleOpenModal}
                            className="export_button addbtn"
                        >
                            <img src={plus_icon} alt="add icon" /> Add
                            Notification
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
                {modalContainer}
                {modalEditContainer}
                {modalDeleteContainer}
            </React.Fragment>
        );
    }
}

export default withRouter(NotifyLists);
