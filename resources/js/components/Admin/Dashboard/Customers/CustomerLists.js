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

class CustomerLists extends Component {
    constructor(props) {
        super(props);

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "first_name",
                headerName: "First Name",
                flex: 1,
            },
            {
                field: "last_name",
                headerName: "Last Name",
                flex: 1,
            },
            {
                field: "email",
                headerName: "Email",
                flex: 1,
            },
            {
                field: "loginas",
                headerName: "Login As",
                flex: 1,
                renderCell: (params) => {
                    return (
                        <Button
                            onClick={this.handleLoginAs.bind(
                                this,
                                params.row.id
                            )}
                            className="btnLinkadmin"
                        >
                            Login as {params.row.first_name}
                        </Button>
                    );
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
                customer_id: 0,
                first_name: "",
                last_name: "",
                email: "",
                _token: "",
                invoice: false,
                storage_cost: false,
                storage_calculator: false,
                held: false,
                intransit: false,
                delayed: false,
                returns: false,
                receiving: false,
                low_stock: false,
                no_stock: false,
                open_orders: false,
                in_transit: false,
                delay_transit: false,
                invoicing: false,
                pricing: false,
            },
            showdesc: "block",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 20,
        };

        this.handleCustomerSubmit = this.handleCustomerSubmit.bind(this);
        this.handleCustomerEditSubmit =
            this.handleCustomerEditSubmit.bind(this);
        this.handleCustomerDeleteSubmit =
            this.handleCustomerDeleteSubmit.bind(this);
        this.handleFirstname = this.handleFirstname.bind(this);
        this.handleLastname = this.handleLastname.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
    }

    componentDidMount() {
        this.getData({ page: 1 });
    }

    getData = (data) => {
        // axios.get('api/customers?page=' + data.page).then(response => {
        //     this.setState({customers:response.data.customers.data, data:response.data.customers});
        // });
        axios.get("api/customers").then((response) => {
            let fullgriddata = [];
            let ctrgrid = 1;
            response.data.customers.forEach(function (key) {
                let row_grid_data = {
                    id: key.id,
                    first_name: key.first_name,
                    last_name: key.last_name,
                    email: key.email,
                    loginas: key.id,
                    actions: key.id,
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
            global_msg: { message: "" },
        });
    };

    showdescription = () => {
        let showtoggle = this.state.showdesc == "none" ? "block" : "none";
        this.setState({ showdesc: showtoggle });
    };

    handleCustomerSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let userData = this.state.user;

        axios
            .post("api/add-customer", userData)
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
                    typeof errors.last_name !== "undefined" &&
                    errors.last_name.length > 0
                ) {
                    msg += errors.last_name[0] + "\r\n";
                }
                if (
                    typeof errors.email !== "undefined" &&
                    errors.email.length > 0
                ) {
                    msg += errors.email[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, message: msg });
            });
    }

    handleCustomerEditSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let userData = this.state.user;

        axios
            .post("api/edit-customer", userData)
            .then((response) => {
                this.setState({
                    editModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Customer " +
                            this.state.user.first_name +
                            " " +
                            this.state.user.last_name +
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
                    typeof errors.last_name !== "undefined" &&
                    errors.last_name.length > 0
                ) {
                    msg += errors.last_name[0] + "\r\n";
                }
                if (
                    typeof errors.email !== "undefined" &&
                    errors.email.length > 0
                ) {
                    msg += errors.email[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, message: msg });
            });
    }

    handleCustomerDeleteSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let userData = this.state.user;

        axios
            .post("api/delete-customer", userData)
            .then((response) => {
                this.setState({
                    deleteModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Customer " +
                            this.state.user.first_name +
                            " " +
                            this.state.user.last_name +
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

    handleLastname(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                last_name: value,
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

    handlePageClick = (e) => {
        console.log(e);
    };

    handleLoginAs = (customerid) => {
        axios
            .post("api/login-as-client", { customer_id: customerid })
            .then((response) => {
                // this.props.history.push("/");
                let menuState = {
                    member_menu: response.data.member_menu,
                };
                localStorage["menuState"] = JSON.stringify(menuState);
                localStorage["withUK"] = response.data.withuk;
                localStorage["accessUserLevel"] = response.data.access_level;
                const win = window.open("/userdashboard", "_blank");
                win.focus();
            });
    };

    handleEditModal = (id) => {
        let token = document.querySelector('meta[name="csrf-token"]').content;

        axios
            .post("api/get-customer", { id: id })
            .then((response) => {
                this.setState({
                    editModal: true,
                    user: {
                        customer_id: response.data.user.id,
                        first_name: response.data.user.first_name,
                        last_name: response.data.user.last_name,
                        email: response.data.user.email,
                        _token: token,
                        invoice: parseInt(response.data.settings.invoice),
                        storage_cost: parseInt(
                            response.data.settings.storage_cost
                        ),
                        storage_calculator: parseInt(
                            response.data.settings.storage_calculator
                        ),
                        held: parseInt(response.data.settings.held),
                        intransit: parseInt(response.data.settings.intransit),
                        delayed: parseInt(response.data.settings.delayed),
                        returns: parseInt(response.data.settings.returns),
                        receiving: parseInt(response.data.settings.receiving),
                        low_stock: parseInt(response.data.settings.low_stock),
                        no_stock: parseInt(response.data.settings.no_stock),
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
                        customer_id: response.data.user.id,
                        first_name: response.data.user.first_name,
                        last_name: response.data.user.last_name,
                        email: response.data.user.email,
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
                <Box component={"form"} onSubmit={this.handleCustomerSubmit}>
                    {/* <AppBar sx={{ position: 'relative' }}>
			          <Toolbar>
			            <IconButton
			              edge="start"
			              color="inherit"
			              onClick={this.handleCloseModal}
			              aria-label="close"
			            >
			              <CloseIcon />
			            </IconButton>
			            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
			              Add Customer
			            </Typography>
			            <Button type={"submit"} autoFocus color="inherit" disabled={this.state.formSubmitting}>
			              {this.state.formSubmitting ? "Saving..." : "Save"}
			            </Button>
			          </Toolbar>
			        </AppBar> */}
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
                            Add New Customer
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
                            label="First Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleFirstname}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="last_name"
                            label="Last Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleLastname}
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

                        {/* <FormControl sx={{ mt: 5 }} component="fieldset" variant="standard" className="width50 showsidescheckbox">
					        <FormLabel component="legend" className="headershowsides">Show Dashboard Blocks <span>(Check to display)</span></FormLabel>
					        <FormGroup>
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.invoice} onChange={this.handleChange} name="invoice" />
					            }
					            label="Invoice"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.storage_cost} onChange={this.handleChange} name="storage_cost" />
					            }
					            label="Storage Cost"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.storage_calculator} onChange={this.handleChange} name="storage_calculator" />
					            }
					            label="Storage Calculator"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.held} onChange={this.handleChange} name="held" />
					            }
					            label="Held Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.intransit} onChange={this.handleChange} name="intransit" />
					            }
					            label="In Transit"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.delayed} onChange={this.handleChange} name="delayed" />
					            }
					            label="Delayed"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.returns} onChange={this.handleChange} name="returns" />
					            }
					            label="Return Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.receiving} onChange={this.handleChange} name="receiving" />
					            }
					            label="Receiving"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.low_stock} onChange={this.handleChange} name="low_stock" />
					            }
					            label="Low Stock"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.no_stock} onChange={this.handleChange} name="no_stock" />
					            }
					            label="No Stock"
					          />
					        </FormGroup>
				      	</FormControl>
						  <FormControl sx={{ mt: 5 }} component="fieldset" variant="standard" className="showsidescheckbox">
					        <FormLabel component="legend" className="headershowsides">Show Sidebars <span>(Check to display)</span></FormLabel>
					        <FormGroup>
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.open_orders} onChange={this.handleChange} name="open_orders" />
					            }
					            label="Open Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.in_transit} onChange={this.handleChange} name="in_transit" />
					            }
					            label="In-Transit Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.delay_transit} onChange={this.handleChange} name="delay_transit" />
					            }
					            label="Delayed Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.invoicing} onChange={this.handleChange} name="invoicing" />
					            }
					            label="Invoicing"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.pricing} onChange={this.handleChange} name="pricing" />
					            }
					            label="Pricing"
					          />
					        </FormGroup>
				      	</FormControl> */}
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
                    component={"form"}
                    onSubmit={this.handleCustomerEditSubmit}
                >
                    {/* <AppBar sx={{ position: 'relative' }}>
			          <Toolbar>
			            <IconButton
			              edge="start"
			              color="inherit"
			              onClick={this.handleCloseModal}
			              aria-label="close"
			            >
			              <CloseIcon />
			            </IconButton>
			            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
			              Edit {this.state.user.first_name} {this.state.user.last_name} Customer
			            </Typography>
			            
			          </Toolbar>
			        </AppBar> */}
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
                            {this.state.user.last_name} Customer
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
                            id="last_name"
                            label="Last Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={this.state.user.last_name}
                            onChange={this.handleLastname}
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

                        {/* <FormControl sx={{ mt: 3 }} component="fieldset" variant="standard"  className="width50 showsidescheckbox">
						  <FormLabel component="legend" className="headershowsides">Show Dashboard Blocks <span>(Check to display)</span></FormLabel>
					        <FormGroup>
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.invoice} onChange={this.handleChange} name="invoice" />
					            }
					            label="Invoice"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.storage_cost} onChange={this.handleChange} name="storage_cost" />
					            }
					            label="Storage Cost"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.storage_calculator} onChange={this.handleChange} name="storage_calculator" />
					            }
					            label="Storage Calculator"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.held} onChange={this.handleChange} name="held" />
					            }
					            label="Held Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.intransit} onChange={this.handleChange} name="intransit" />
					            }
					            label="In Transit"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.delayed} onChange={this.handleChange} name="delayed" />
					            }
					            label="Delayed"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.returns} onChange={this.handleChange} name="returns" />
					            }
					            label="Return Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.receiving} onChange={this.handleChange} name="receiving" />
					            }
					            label="Receiving"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.low_stock} onChange={this.handleChange} name="low_stock" />
					            }
					            label="Low Stock"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.no_stock} onChange={this.handleChange} name="no_stock" />
					            }
					            label="No Stock"
					          />
					        </FormGroup>
				      	</FormControl>
						  <FormControl sx={{ mt: 3 }} component="fieldset" variant="standard" className="showsidescheckbox">
						  	<FormLabel component="legend" className="headershowsides">Show Sidebars <span>(Check to display)</span></FormLabel>
					        <FormGroup>
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.open_orders} onChange={this.handleChange} name="open_orders" />
					            }
					            label="Open Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.in_transit} onChange={this.handleChange} name="in_transit" />
					            }
					            label="In-Transit Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.delay_transit} onChange={this.handleChange} name="delay_transit" />
					            }
					            label="Delayed Orders"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.invoicing} onChange={this.handleChange} name="invoicing" />
					            }
					            label="Invoicing"
					          />
					          <FormControlLabel
					            control={
					              <Checkbox checked={this.state.user.pricing} onChange={this.handleChange} name="pricing" />
					            }
					            label="Pricing"
					          />
					        </FormGroup>
					        <FormHelperText>Check to display</FormHelperText>
				      	</FormControl> */}

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
                    onSubmit={this.handleCustomerDeleteSubmit}
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
                            Delete {this.state.user.first_name}{" "}
                            {this.state.user.last_name}
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            Deleting this customer can't be undone. Continue?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <TextField
                            hiddenLabel
                            id="store_id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.user.customer_id}
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
                        In the customers section, you can review and manage all
                        details from the customer. You can view and edit many
                        information such as first name, last name, email
                        address, address, and even hide or show each dashboard
                        blocks such as invoice, storage cost, storage
                        calculator, held orders, delayed in transit, return
                        orders, receiving, low stock, and no stock block. Access
                        to this area is limited. Only administrators or team
                        leaders can reach.
                    </div>
                    <div className="admin_topright_btn">
                        <Button
                            variant="outlined"
                            onClick={this.handleOpenModal}
                            className="export_button addbtn"
                        >
                            <img src={plus_icon} alt="add icon" /> Add Customer
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
		            <TableCell>Email</TableCell>
		            <TableCell align="right">Login As</TableCell>
		            <TableCell align="right">Action</TableCell>
		          </TableRow>
		        </TableHead>
		        <TableBody>
		          {this.state.customers.map((row) => (
		            <TableRow key={row.id}>
		              	<TableCell>{row.first_name} {row.last_name}</TableCell>
		              	<TableCell>{row.email}</TableCell>
		            	<TableCell align="right">
			              	<Button onClick={this.handleLoginAs.bind(this, row.id)}>
							  Login as {row.first_name}
							</Button>
		              	</TableCell>
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

export default withRouter(CustomerLists);
