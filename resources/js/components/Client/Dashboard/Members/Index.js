import React, { Component } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Container,
    Grid,
    Paper,
    CssBaseline,
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
import CommonSection from "../Common/CommonSection";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { Pagination } from "react-laravel-paginex";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Title from "../Common/Title";
import {
    DataGridPremium,
    GridToolbar,
    GridActionsCellItem,
} from "@mui/x-data-grid-premium";

class Index extends Component {
    constructor(props) {
        super(props);
        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "first_name",
                headerName: "FIRST NAME",
                flex: 1,
            },
            {
                field: "last_name",
                headerName: "LAST NAME",
                flex: 1,
            },
            {
                field: "email",
                headerName: "EMAIL",
                flex: 1,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "ACTIONS",
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={this.handleEditModal.bind(this, params.row.id)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={this.handleDeleteModal.bind(
                            this,
                            params.row.id
                        )}
                    />,
                ],
                flex: 1,
            },
        ];

        const defaultrows = [];

        this.state = {
            location: "members",
            title: "Members",
            firstname: "",
            lastname: "",
            emailaddress: "",
            econfirmpass: "",
            formSubmitting: true,
            user: {
                new_password: "",
                confirm_password: "",
                first_name: "",
                last_name: "",
                email: "",
                invoice: false,
                storage_cost: false,
                storage_calculator: false,
                held: false,
                openorders: false,
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
                held_orders: false,
                return_orders: false,
                receiving_inventory: false,
                addshipment_inventory: false,
                no_stock_inventory: false,
                product_inventory: false,
                ustous_pricing: false,
                ustononus_pricing: false,
                uktouk_pricing: false,
                uktoeu_pricing: false,
                safelist: false,
                edithistory: false,
                reports: false,
                safelistshipments: false,
                uspsdelayedshipments: false,
                product_bundles: false,
                inventory_manager: false,
                add_receiving_button: false,
                add_receiving_wholesale_button: false,
                add_shipments_button: false,
                add_product_button: false,
                add_bundle_button: false,
                wrongitemssent: false,
                dailyitemsdelivered: false,
            },
            openModal: false,
            editModal: false,
            deleteModal: false,
            reloginmsg: "",
            etakenemail: "",
            efirstname: "",
            eemail: "",
            members: [],
            perpage: 10,
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 20,
        };
        this.handleNewPassword = this.handleNewPassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
        this.handleMemberSubmit = this.handleMemberSubmit.bind(this);
        this.handleEditMemberSubmit = this.handleEditMemberSubmit.bind(this);
        this.handleFirstname = this.handleFirstname.bind(this);
        this.handleLastname = this.handleLastname.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handleMemberDeleteSubmit =
            this.handleMemberDeleteSubmit.bind(this);
    }

    componentDidMount() {
        this.getData({ page: 1 });
    }

    getData = (data) => {
        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;

        // axios.get('api/usermember?page=' + data.page + '&perpage=' + this.perpageno).then(response => {
        //     this.setState({members:response.data.members.data, data:response.data.members});
        // });
        axios.get("api/usermember").then((response) => {
            let fullgriddata = [];
            response.data.members.forEach(function (key) {
                let row_grid_data = {
                    id: key.id,
                    first_name: key.first_name,
                    last_name: key.last_name,
                    email: key.email,
                };
                fullgriddata.push(row_grid_data);
            });
            this.setState({ gridrows: fullgriddata });
        });
    };
    getUserAccountInfo = (data) => {
        axios.get("api/profile").then((response) => {
            let userinfo = response.data.user;
            this.setState({
                firstname: userinfo.first_name,
                lastname: userinfo.last_name,
                emailaddress: userinfo.email,
            });
        });
    };
    handleMemberSubmit(e) {
        e.preventDefault();

        this.setState({ formSubmitting: true });
        this.setState({
            econfirmpass: "",
            etakenemail: "",
            eemail: "",
            efirstname: "",
        });
        let userData = this.state.user;
        let haserrormsg = false;

        if (userData.confirm_password != userData.new_password) {
            this.setState({
                econfirmpass: "Password and confirm password is not the same.",
            });
            haserrormsg = true;
        } else if (
            userData.confirm_password == "" ||
            userData.new_password == ""
        ) {
            this.setState({
                econfirmpass: "Please input new password and confirm password.",
            });
            haserrormsg = true;
        } else {
            this.setState({ econfirmpass: "" });
            haserrormsg = false;
        }
        if (userData.first_name == "") {
            this.setState({ efirstname: "At least input a firstname." });
            haserrormsg = true;
        }
        if (userData.email == "") {
            this.setState({ eemail: "Email is required." });
            haserrormsg = true;
        }
        if (haserrormsg) {
            this.setState({ formSubmitting: false });
        }

        userData.first_name =
            userData.first_name == ""
                ? this.state.firstname
                : userData.first_name;
        userData.last_name =
            userData.company_name == ""
                ? this.state.lastname
                : userData.last_name;
        userData.email =
            userData.email == "" ? this.state.emailaddress : userData.email;
        if (haserrormsg == false) {
            axios.post("api/createnewmember", userData).then((response) => {
                this.setState({ formSubmitting: false });
                if (response.data.success == "EmailTaken") {
                    this.setState({ etakenemail: "Email is already taken." });
                } else {
                    this.setState({ eoldpass: "" });
                    location.reload();
                }
            });
        }
    }
    handleEditMemberSubmit(e) {
        e.preventDefault();

        this.setState({ formSubmitting: true });
        this.setState({
            econfirmpass: "",
            etakenemail: "",
            eemail: "",
            efirstname: "",
        });
        let userData = this.state.user;
        let haserrormsg = false;
        if (userData.first_name == "") {
            this.setState({ efirstname: "At least input a firstname." });
            haserrormsg = true;
        }
        if (userData.email == "") {
            this.setState({ eemail: "Email is required." });
            haserrormsg = true;
        }
        if (userData.confirm_password != userData.new_password) {
            this.setState({
                econfirmpass: "Password and confirm password is not the same.",
            });
            haserrormsg = true;
        }
        if (haserrormsg) {
            this.setState({ formSubmitting: false });
        }

        userData.first_name =
            userData.first_name == ""
                ? this.state.firstname
                : userData.first_name;
        userData.last_name =
            userData.company_name == ""
                ? this.state.lastname
                : userData.last_name;
        userData.email =
            userData.email == "" ? this.state.emailaddress : userData.email;
        if (haserrormsg == false) {
            axios.post("api/updatemember", userData).then((response) => {
                this.setState({ formSubmitting: false });
                if (response.data.success == "EmailTaken") {
                    this.setState({ etakenemail: "Email is already taken." });
                } else {
                    this.setState({ eoldpass: "" });
                    location.reload();
                }
            });
        }
    }
    handleFirstname(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                first_name: value,
            },
            firstname: value,
        }));
    }
    handleLastname(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                last_name: value,
            },
            lastname: value,
        }));
    }
    handleEmail(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                email: value,
            },
            emailaddress: value,
        }));
    }
    handleNewPassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                new_password: value,
            },
        }));
    }
    handleConfirmPassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                confirm_password: value,
            },
        }));
    }
    handleAddModal = () => {
        this.setState((prevState) => ({
            econfirmpass: "",
            etakenemail: "",
            eemail: "",
            efirstname: "",
            firstname: "",
            lastname: "",
            emailaddress: "",
            user: {
                ...prevState.user,
                email: "",
                first_name: "",
                last_name: "",
            },
        }));
        this.setState({ openModal: true });
    };
    handleEditModal = (id) => {
        this.setState((prevState) => ({
            econfirmpass: "",
            etakenemail: "",
            eemail: "",
            efirstname: "",
            firstname: "",
            lastname: "",
            emailaddress: "",
            user: {
                ...prevState.user,
                email: "",
                first_name: "",
                last_name: "",
            },
        }));
        let token = document.querySelector('meta[name="csrf-token"]').content;

        axios
            .post("api/get_member", { id: id })
            .then((response) => {
                this.setState({
                    editModal: true,
                    user: {
                        member_id: response.data.user.id,
                        first_name: response.data.user.first_name,
                        last_name: response.data.user.last_name,
                        email: response.data.user.email,
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
            .post("api/get_member", { id: id })
            .then((response) => {
                this.setState({
                    deleteModal: true,
                    user: {
                        member_id: response.data.user.id,
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
    handleCloseModal = () => {
        this.setState({
            openModal: false,
            editModal: false,
            deleteModal: false,
        });
    };

    handleMemberDeleteSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let userData = this.state.user;

        axios
            .post("api/deletemember", userData)
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
                this.handleCloseModal();
            })
            .catch((error) => {
                this.setState({
                    formSubmitting: false,
                    message: "There's an error. Please try again!",
                });
            });
    }
    handleChange = (event) => {
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                [event.target.name]: event.target.checked,
            },
        }));
    };
    render() {
        const mdTheme = createTheme();
        const fullWidth = true;
        const maxWidth = "md";
        const modalContainer = (
            <Dialog
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box component={"form"} onSubmit={this.handleMemberSubmit}>
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
                            Add New Member
                        </Typography>
                        <Box>
                            <Typography component="div">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="first_name"
                                    label="First Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={this.handleFirstname}
                                    value={this.state.firstname}
                                />
                                {this.state.efirstname != "" && (
                                    <Alert severity="error">
                                        {this.state.efirstname}
                                    </Alert>
                                )}
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="last_name"
                                    label="Last Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={this.handleLastname}
                                    value={this.state.lastname}
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
                                    value={this.state.emailaddress}
                                />
                                {this.state.eemail != "" && (
                                    <Alert
                                        style={{ marginBottom: "20px" }}
                                        severity="error"
                                    >
                                        {this.state.eemail}
                                    </Alert>
                                )}
                                {this.state.etakenemail != "" && (
                                    <Alert severity="error">
                                        {this.state.etakenemail}
                                    </Alert>
                                )}

                                <TextField
                                    margin="dense"
                                    id="password"
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    variant="standard"
                                    onChange={this.handleNewPassword}
                                />
                                <TextField
                                    margin="dense"
                                    id="confirm_password"
                                    fullWidth
                                    label="Confirm password"
                                    type="password"
                                    autoComplete="current-password"
                                    variant="standard"
                                    onChange={this.handleConfirmPassword}
                                />
                                {this.state.econfirmpass != "" && (
                                    <Alert severity="error">
                                        {this.state.econfirmpass}
                                    </Alert>
                                )}
                            </Typography>
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
                                                    this.state.user
                                                        .return_orders
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
                                                checked={
                                                    this.state.user.in_transit
                                                }
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
                                                    this.state.user
                                                        .delay_transit
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
                                                    this.state.user
                                                        .product_bundles
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
                                                    this.state.user
                                                        .ustous_pricing
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
                                                    this.state.user
                                                        .uktouk_pricing
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
                                                    this.state.user
                                                        .uktoeu_pricing
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
                                                checked={
                                                    this.state.user.invoicing
                                                }
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
                                                checked={
                                                    this.state.user.safelist
                                                }
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
                                                checked={
                                                    this.state.user.reports
                                                }
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
                                        label="SafeList Shipments"
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
                                                    this.state.user
                                                        .wrongitemssent
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
                                <FormHelperText>
                                    Check to display
                                </FormHelperText>
                            </FormControl>

                            <FormControl
                                sx={{ mt: 3 }}
                                component="fieldset"
                                variant="standard"
                                className="fieldset_options"
                            >
                                <FormLabel component="legend">
                                    Show Dashboard Blocks
                                </FormLabel>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    this.state.user.invoice
                                                }
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
                                                checked={
                                                    this.state.user.openorders
                                                }
                                                onChange={this.handleChange}
                                                name="openorders"
                                            />
                                        }
                                        label="Open Orders"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    this.state.user.intransit
                                                }
                                                onChange={this.handleChange}
                                                name="intransit"
                                            />
                                        }
                                        label="In Transit"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    this.state.user.delayed
                                                }
                                                onChange={this.handleChange}
                                                name="delayed"
                                            />
                                        }
                                        label="Delayed"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    this.state.user.returns
                                                }
                                                onChange={this.handleChange}
                                                name="returns"
                                            />
                                        }
                                        label="Return Orders"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    this.state.user.receiving
                                                }
                                                onChange={this.handleChange}
                                                name="receiving"
                                            />
                                        }
                                        label="Receiving"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    this.state.user.low_stock
                                                }
                                                onChange={this.handleChange}
                                                name="low_stock"
                                            />
                                        }
                                        label="Low Stock"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    this.state.user.no_stock
                                                }
                                                onChange={this.handleChange}
                                                name="no_stock"
                                            />
                                        }
                                        label="No Stock"
                                    />
                                </FormGroup>
                                <FormHelperText>
                                    Check to display
                                </FormHelperText>
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
                                <FormHelperText>
                                    Check to display
                                </FormHelperText>
                            </FormControl>
                            <div className="form_btns">
                                <Button
                                    type={"button"}
                                    color="inherit"
                                    onClick={this.handleCloseModal}
                                >
                                    Cancel
                                </Button>
                                <Button type={"submit"} color="inherit">
                                    Save
                                </Button>
                            </div>
                        </Box>
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
                <Box component={"form"} onSubmit={this.handleEditMemberSubmit}>
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
                            Edit Member - {this.state.user.first_name}{" "}
                            {this.state.user.last_name}
                        </Typography>

                        <TextField
                            hiddenLabel
                            id="member_id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.user.member_id}
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
                        {this.state.efirstname != "" && (
                            <Alert severity="error">
                                {this.state.efirstname}
                            </Alert>
                        )}
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
                        {this.state.eemail != "" && (
                            <Alert severity="error">{this.state.eemail}</Alert>
                        )}
                        {this.state.etakenemail != "" && (
                            <Alert severity="error">
                                {this.state.etakenemail}
                            </Alert>
                        )}

                        <TextField
                            margin="dense"
                            id="password"
                            fullWidth
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="standard"
                            onChange={this.handleNewPassword}
                        />
                        <TextField
                            margin="dense"
                            id="confirm_password"
                            fullWidth
                            label="Confirm password"
                            type="password"
                            autoComplete="current-password"
                            variant="standard"
                            onChange={this.handleConfirmPassword}
                        />
                        {this.state.econfirmpass != "" && (
                            <Alert severity="error">
                                {this.state.econfirmpass}
                            </Alert>
                        )}

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
                                    label="SafeList Shipments"
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
                            className="fieldset_options"
                        >
                            <FormLabel component="legend">
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
                            <Button type={"submit"} color="inherit">
                                Save
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
                    onSubmit={this.handleMemberDeleteSubmit}
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
                            Delete Member
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this member "
                            {this.state.user.first_name}{" "}
                            {this.state.user.last_name}"?
                        </DialogContentText>
                        <DialogActions>
                            <TextField
                                hiddenLabel
                                id="store_id"
                                type="hidden"
                                variant="standard"
                                defaultValue={this.state.user.customer_id}
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
        return (
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />
                    <CommonSection
                        title={this.state.title}
                        location={this.state.location}
                    />
                    <Box
                        component="main"
                        sx={{
                            backgroundColor: (theme) =>
                                theme.palette.mode === "light"
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],
                            flexGrow: 1,
                            height: "100vh",
                            overflow: "auto",
                        }}
                    >
                        <Toolbar />
                        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography
                                        component="h2"
                                        className="subpage_title"
                                    >
                                        {this.state.title}
                                    </Typography>

                                    {/* <div className="table_filter_options mtop50">
                            <Typography component="div" className="table_selection_area"> &nbsp;</Typography>
                            <Typography component="div" className="table_selection_area right_selections">
                              <Button variant="outlined" className="export_button" onClick={this.handleAddModal}>
                                <AddIcon /> Add Member
                              </Button>
                            </Typography>
                      
                      </div> */}
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                        className="table_grid"
                                    >
                                        <Title></Title>
                                        <div className="table_filter_options">
                                            <Typography
                                                component="div"
                                                className="table_selection_area"
                                            >
                                                {" "}
                                                &nbsp;
                                            </Typography>
                                            <Typography
                                                component="div"
                                                className="table_selection_area right_selections"
                                            >
                                                <Button
                                                    variant="outlined"
                                                    className="export_button addbtn"
                                                    onClick={
                                                        this.handleAddModal
                                                    }
                                                >
                                                    <AddIcon /> Add Member
                                                </Button>
                                            </Typography>
                                        </div>
                                        {/* <Pagination count={10} changePage={this.getData} data={this.state.data} variant="outlined" shape="rounded" prevButtonClass="prev_pbtn" nextButtonClass="next_pbtn"/>
                          <div className="table_grid_container">
                            <Table size="small" className="table_data">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell align="right">Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {this.state.members.map((row) => (
                                  <TableRow key={row.id}>
                                    <TableCell>{row.first_name} {row.last_name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell align="right">
                                    <Button onClick={this.handleEditModal.bind(this, row.id)}>
                                    <EditIcon />
                                    </Button>
                                    <Button onClick={this.handleDeleteModal.bind(this, row.id)}>
                                    <DeleteIcon />
                                    </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div> */}
                                        <Box className="data_grid_container">
                                            <DataGridPremium
                                                rows={this.state.gridrows}
                                                columns={this.state.gridcolumns}
                                                pageSize={this.state.pagesize}
                                                rowsPerPageOptions={[20]}
                                                pagination
                                                disableSelectionOnClick
                                                components={{
                                                    Toolbar: GridToolbar,
                                                }}
                                                componentsProps={{
                                                    toolbar: {
                                                        showQuickFilter: true,
                                                    },
                                                }}
                                                experimentalFeatures={{
                                                    newEditingApi: true,
                                                }}
                                            />
                                            <div className="datagrid_pagination_bg"></div>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
                {modalContainer}
                {modalEditContainer}
                {modalDeleteContainer}
            </ThemeProvider>
        );
    }
}

export default Index;
