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
import {
    DataGridPremium,
    GridToolbar,
    GridActionsCellItem,
} from "@mui/x-data-grid-premium";

class UsersLists extends Component {
    constructor(props) {
        super(props);

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "first_name",
                headerName: "Display Name",
                flex: 1,
            },
            {
                field: "email",
                headerName: "Email",
                flex: 1,
            },
            {
                field: "level",
                headerName: "Access Level",
                flex: 1,
                renderCell: (params) => {
                    let access = "Super Admin";
                    if (params.row.level === 1) {
                        access = "Admin";
                    }

                    return access;
                },
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
            customers: [],
            openModal: false,
            editModal: false,
            deleteModal: false,
            formSubmitting: false,
            message: "",
            user: {
                user_id: 0,
                first_name: "",
                email: "",
                password: "",
            },
            showdesc: "block",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 20,
        };

        this.handleUserSubmit = this.handleUserSubmit.bind(this);
        this.handleUserEditSubmit = this.handleUserEditSubmit.bind(this);
        this.handleUserDeleteSubmit = this.handleUserDeleteSubmit.bind(this);
        this.handleFirstname = this.handleFirstname.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    componentDidMount() {
        this.getData({ page: 1 });
    }

    getData = (data) => {
        axios.get("api/users").then((response) => {
            let fullgriddata = [];
            response.data.users.forEach(function (key) {
                let row_grid_data = {
                    id: key.id,
                    first_name: key.first_name,
                    email: key.email,
                    level: key.access_level,
                    actions: key.id,
                };
                fullgriddata.push(row_grid_data);
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
            global_msg: { message: "" },
        });
    };

    showdescription = () => {
        let showtoggle = this.state.showdesc == "none" ? "block" : "none";
        this.setState({ showdesc: showtoggle });
    };

    handleUserSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let userData = this.state.user;

        axios
            .post("api/add-user", userData)
            .then((response) => {
                this.setState({ openModal: false, formSubmitting: false });
                this.getData({ page: 1 });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.first_name !== "undefined" &&
                    errors.first_name.length > 0
                ) {
                    msg += errors.first_name[0] + "\r\n";
                }
                if (
                    typeof errors.email !== "undefined" &&
                    errors.email.length > 0
                ) {
                    msg += errors.email[0] + "\r\n";
                }
                if (
                    typeof errors.password !== "undefined" &&
                    errors.password.length > 0
                ) {
                    msg += errors.password[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, message: msg });
            });
    }

    handleUserEditSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let userData = this.state.user;

        axios
            .post("api/edit-user", userData)
            .then((response) => {
                this.setState({
                    editModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Admin user " +
                            this.state.user.first_name +
                            " updated successfully!",
                    },
                });
                this.getData({ page: 1 });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.first_name !== "undefined" &&
                    errors.first_name.length > 0
                ) {
                    msg += errors.first_name[0] + "\r\n";
                }
                if (
                    typeof errors.email !== "undefined" &&
                    errors.email.length > 0
                ) {
                    msg += errors.email[0] + "\r\n";
                }
                if (
                    typeof errors.password !== "undefined" &&
                    errors.password.length > 0
                ) {
                    msg += errors.password[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, message: msg });
            });
    }

    handleUserDeleteSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let userData = this.state.user;

        axios
            .post("api/delete-user", userData)
            .then((response) => {
                this.setState({
                    deleteModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Admin user " +
                            this.state.user.first_name +
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

    handleFirstname(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                first_name: value,
            },
        }));
    }

    handleEmail(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                email: value,
            },
        }));
    }

    handlePassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                password: value,
            },
        }));
    }

    handlePageClick = (e) => {
        console.log(e);
    };

    handleEditModal = (id) => {
        let token = document.querySelector('meta[name="csrf-token"]').content;

        axios
            .post("api/get-user", { id: id })
            .then((response) => {
                this.setState({
                    editModal: true,
                    user: {
                        user_id: response.data.user.id,
                        first_name: response.data.user.first_name,
                        email: response.data.user.email,
                        password: "",
                    },
                });
            })
            .catch((error) => {
                this.setState({ editModal: false });
            });
    };

    handleDeleteModal = (id) => {
        axios
            .post("api/get-customer", { id: id })
            .then((response) => {
                this.setState({
                    deleteModal: true,
                    user: {
                        user_id: response.data.user.id,
                        first_name: response.data.user.first_name,
                        email: response.data.user.email,
                        password: "",
                    },
                });
            })
            .catch((error) => {
                this.setState({ deleteModal: false });
            });
    };

    handleChange = (event) => {
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                [event.target.name]: event.target.checked,
            },
        }));
    };

    render() {
        const fullWidth = true;
        const maxWidth = "md";

        const modalContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box component={"form"} onSubmit={this.handleUserSubmit}>
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
                            Add New Admin User
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
                            id="first_name"
                            label="Display Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleFirstname}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                            onChange={this.handleEmail}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            onChange={this.handlePassword}
                        />
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
                <Box component={"form"} onSubmit={this.handleUserEditSubmit}>
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
                            Edit {this.state.user.first_name}{" "}
                            {this.state.user.last_name} User
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
                            id="customer_id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.user.customer_id}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="first_name"
                            label="First Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={this.state.user.first_name}
                            onChange={this.handleFirstname}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                            defaultValue={this.state.user.email}
                            onChange={this.handleEmail}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            onChange={this.handlePassword}
                        />
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
                <Box component={"form"} onSubmit={this.handleUserDeleteSubmit}>
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
                            Delete {this.state.user.first_name}
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            Deleting this user can't be undone. Continue?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <TextField
                            hiddenLabel
                            id="user_id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.user.user_id}
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
                        In the admin users section, you can view any
                        information. Access to this area is limited. Only
                        administrators or team leaders can reach.
                    </div>
                    <div className="admin_topright_btn">
                        <Button
                            variant="outlined"
                            onClick={this.handleOpenModal}
                            className="export_button addbtn"
                        >
                            <img src={plus_icon} alt="add icon" /> Add User
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

export default withRouter(UsersLists);
