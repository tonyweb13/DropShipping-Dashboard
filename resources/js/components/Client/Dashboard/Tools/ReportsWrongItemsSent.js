import React, { Component } from "react";
// import {Pagination} from 'react-laravel-paginex'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Container,
    Grid,
    Paper,
    CssBaseline,
    Box,
    Toolbar,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Checkbox,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog,
    Alert,
    AppBar,
    IconButton,
    Stack,
} from "@mui/material";
import CommonSection from "../Common/CommonSection";
import Title from "../Common/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import downloadicon from "../../../../../img/dl.png";
import printericon from "../../../../../img/printer_icon.png";
import uploadicon from "../../../../../img/upload_icon.png";
import settingsicon from "../../../../../img/settings_icon.png";
import { color } from "@mui/system";
import axios from "axios";
import { endsWith, isEmpty } from "lodash";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import calendaricondark from "../../../../../img/calendar_icon_dark.png";
import arrowforwardbrown from "../../../../../img/arrow_forward_brown.png";
import arrowforwardblack from "../../../../../img/arrow_forward_black.png";
import edit_icon from "../../../../../img/edit_icon_new.png";
import trash_icon from "../../../../../img/trash_icon.png";
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

class ReportsWrongItemsSent extends Component {
    constructor(props) {
        super(props);
        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "RunDate",
                headerName: "Run Date",
                hide: true,
                flex: 1,
            },
            {
                field: "OrderNumber",
                headerName: "Order Number",
                flex: 1,
            },
            {
                field: "ShipEmail",
                headerName: "Ship Email",
                flex: 1,
            },
            {
                field: "ShipDate",
                headerName: "Ship Date",
                flex: 1,
                // },
                // {
                //   field: 'actions',
                //   type: 'actions',
                //   headerName: 'ACTIONS',
                //   width: 320,
                //   getActions: (params) => [
                //   <Button onClick={this.handleEditOpenModal.bind(this, params.row.actions)} className="export_button addbtn">
                //     <img src={edit_icon} alt="edit icon" /> Edit
                //   </Button>,
                //   <Button onClick={this.handleDeleteModal.bind(this, params.row.actions)} className="export_button addbtn">
                //     <img src={trash_icon} alt="delete icon" /> Delete
                //   </Button>
                //   ]
            },
        ];

        const defaultrows = [];
        const urlparams = new URLSearchParams(window.location.search);
        const sparamval = urlparams.get("search");
        this.state = {
            location: "wrong-items-sent",
            title: "Wrong Items Sent",
            maintitle: "Custom Tools",
            global_msg: {
                type: "error",
                message: "",
            },
            perpage: 200,
            sortfield: "",
            sorting: "ASC",
            openModal: false,
            openEditModal: false,
            openDeleteModal: false,
            formSubmitting: false,
            safeid: 0,
            Email: "",
            sorticon: "",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 200,
            searchValue: sparamval,
            startdate: "",
            enddate: "",
        };

        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    }

    componentDidMount() {
        this.getData({ page: 1, perpage: this.state.perpage });
        this.getsearch_params();
    }

    getData = (data) => {
        const startdate = data.startdate
            ? data.startdate
            : this.state.startdate;
        const enddate = data.enddate ? data.enddate : this.state.enddate;

        axios
            .get(
                "api/safelists-shipments?startdate=" +
                    startdate +
                    "&enddate=" +
                    enddate
            )
            .then((response) => {
                let fullgriddata = [];
                let ctrgrid = 1;
                response.data.lists.forEach(function (key) {
                    let row_grid_data = {
                        id: key.ID,
                        RunDate: key.RunDate,
                        OrderNumber: key.OrderNumber,
                        ShipEmail: key.ShipEmail,
                        ShipDate: key.ShipDate,
                        actions: key.ID,
                    };
                    fullgriddata.push(row_grid_data);
                    ctrgrid++;
                });
                this.setState({
                    gridrows: fullgriddata,
                    startdate: startdate,
                    enddate: enddate,
                });
            });
    };

    handleChangePerPage = (event) => {
        this.setState({ pagesize: event.target.value });
        this.getData({ page: 1 });
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
        this.getData({ page: 1, perpage: this.state.perpage });
        event.preventDefault();
    };

    handleOpenModal = (safeid) => {
        this.setState({ openModal: true });
    };

    handleEditOpenModal = (safeid) => {
        axios.get("api/getsafelist?safeid=" + safeid).then((response) => {
            this.setState({
                safeid: response.data.safelist.ID,
                Email: response.data.safelist.Email,
                openEditModal: true,
            });
        });
    };

    handleDeleteModal = (safeid) => {
        axios.get("api/getsafelist?safeid=" + safeid).then((response) => {
            this.setState({
                safeid: response.data.safelist.ID,
                Email: response.data.safelist.Email,
                openDeleteModal: true,
            });
        });
    };

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            openEditModal: false,
            openDeleteModal: false,
        });
    };

    handleAddSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        const form = document.querySelector("#addsafelistForm");
        const safelistData = new FormData(form);

        axios.post("api/addsafelist", safelistData).then((response) => {
            this.setState({
                openModal: false,
                formSubmitting: false,
                global_msg: {
                    type: "success",
                    message: "Safe list added successfully!",
                },
            });
            this.getData({ page: 1 });
        });
    }

    handleEditSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        const form = document.querySelector("#safelistForm");
        const safelistData = new FormData(form);
        safelistData.append("safeid", this.state.safeid);

        axios.post("api/editsafelist", safelistData).then((response) => {
            this.setState({
                openEditModal: false,
                formSubmitting: false,
                global_msg: {
                    type: "success",
                    message: "Safe list edited successfully!",
                },
            });
            this.getData({ page: 1 });
        });
    }

    handleDeleteSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let id = this.state.safeid;

        axios
            .post("api/delete-safelist", { safeid: id })
            .then((response) => {
                this.setState({
                    openDeleteModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Safe list " +
                            this.state.Email +
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
    getsearch_params = () => {
        const urlparams = new URLSearchParams(window.location.search);
        let searchparamval = urlparams.get("search");
        let searchState = {
            searchtext: searchparamval,
        };
        localStorage["searchState"] = JSON.stringify(searchState);
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

        this.getData({ startdate: fdate });
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

        this.getData({ enddate: fdate });
    };
    render() {
        const mdTheme = createTheme();

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
                <Box
                    id="addsafelistForm"
                    component={"form"}
                    onSubmit={this.handleAddSubmit}
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
                            Add Safe List
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            rows={4}
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

        const modalEditContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openEditModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="safelistForm"
                    component={"form"}
                    onSubmit={this.handleEditSubmit}
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
                            Update Safe List
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            name="email"
                            label="Email"
                            defaultValue={this.state.Email}
                            fullWidth
                            rows={4}
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

        const modalDeleteContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={"xs"}
                open={this.state.openDeleteModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box component={"form"} onSubmit={this.handleDeleteSubmit}>
                    <DialogTitle id="responsive-dialog-title">
                        Delete Email {this.state.Email}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Deleting this safelist item can't be undone.
                            Continue?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <TextField
                            hiddenLabel
                            id="id"
                            type="hidden"
                            variant="standard"
                            defaultValue={this.state.safeid}
                        />
                        <div className="form_btns form_btns_del">
                            <Button
                                type={"button"}
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
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />
                    <CommonSection
                        title={this.state.title}
                        maintitle={this.state.maintitle}
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
                                    <Typography
                                        component="h3"
                                        className="subpage_subtitle"
                                    ></Typography>
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
                                                <Select
                                                    value={this.state.pagesize}
                                                    onChange={
                                                        this.handleChangePerPage
                                                    }
                                                    displayEmpty
                                                    inputProps={{
                                                        "aria-label":
                                                            "Without label",
                                                    }}
                                                    className="table-filters filter_selects"
                                                    IconComponent={
                                                        KeyboardArrowDownIcon
                                                    }
                                                >
                                                    <MenuItem value="10">
                                                        <em
                                                            style={{
                                                                fontStyle:
                                                                    "normal",
                                                            }}
                                                        >
                                                            Show 10
                                                        </em>
                                                    </MenuItem>
                                                    <MenuItem value={20}>
                                                        Show 20
                                                    </MenuItem>
                                                    <MenuItem value={50}>
                                                        Show 50
                                                    </MenuItem>
                                                    <MenuItem value={75}>
                                                        Show 75
                                                    </MenuItem>
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
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                >
                                                    <DesktopDatePicker
                                                        label="Start Date"
                                                        inputFormat="YYYY-MM-DD"
                                                        value={
                                                            this.state.startdate
                                                        }
                                                        onChange={
                                                            this
                                                                .handleStartDateChange
                                                        }
                                                        className="table-filters filter_selects date-picker-field"
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                            />
                                                        )}
                                                    />
                                                    <DesktopDatePicker
                                                        label="End Date"
                                                        inputFormat="YYYY-MM-DD"
                                                        value={
                                                            this.state.enddate
                                                        }
                                                        onChange={
                                                            this
                                                                .handleEndDateChange
                                                        }
                                                        className="table-filters filter_selects date-picker-field"
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Typography>
                                            {/*<Box sx={{ flexGrow: 1 }} />
                            <Box className="subpage_graph_sort_cnt">
                              <Button type="button" variant="outlined" onClick={this.handleOpenModal} className="export_button addbtn"><AddIcon /> Add Safe List</Button>
                            </Box>*/}
                                        </div>
                                        {this.state.global_msg.message !=
                                            "" && (
                                            <Alert
                                                style={{ marginBottom: "20px" }}
                                                severity={
                                                    this.state.global_msg.type
                                                }
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
                                                    Toolbar: GridToolbar,
                                                    Footer: CustomFooter,
                                                }}
                                                componentsProps={{
                                                    toolbar: {
                                                        showQuickFilter: true,
                                                    },
                                                }}
                                                experimentalFeatures={{
                                                    newEditingApi: true,
                                                }}
                                                initialState={{
                                                    filter: {
                                                        filterModel: {
                                                            items: [
                                                                {
                                                                    id: 1,
                                                                    columnField:
                                                                        "Email",
                                                                    operatorValue:
                                                                        "contains",
                                                                    value: this
                                                                        .state
                                                                        .searchValue,
                                                                },
                                                            ],
                                                            linkOperator:
                                                                GridLinkOperator.Or,
                                                        },
                                                    },
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

export default ReportsWrongItemsSent;
