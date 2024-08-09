import React, { Component } from "react";
import { withRouter } from "react-router-dom";
// import {Pagination} from 'react-laravel-paginex'
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
    Paper,
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    DataGridPremium,
    GridToolbar,
    GridActionsCellItem,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
    GridFooterContainer,
    GridPagination,
} from "@mui/x-data-grid-premium";

import Pagination from "@mui/material/Pagination";
import { isNull } from "lodash";
import axios from "axios";

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

class Lists extends Component {
    constructor(props) {
        super(props);

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "subject",
                headerName: "Subject",
                flex: 1,
            },
            {
                field: "status",
                headerName: "Status",
                flex: 1,
                renderCell: (params) => {
                    const status = params.row.status;
                    const color = this.colorStatus(status);
                    return (
                        <span style={{ color: color }}>
                            {this.capitalizeFirstLowercase(status)}
                        </span>
                    );
                },
            },
            {
                field: "created_at",
                headerName: "Created at",
                flex: 1,
            },
            {
                field: "updated_at",
                headerName: "Last Updated",
                flex: 1,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                getActions: (params) => [
                    <Button
                        onClick={this.handleViewTicket.bind(
                            this,
                            params.row.id,
                            true
                        )}
                        className="custbtn adminactionbtn"
                    >
                        <span className="edit_icon" /> Open
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
            form_message: "",
            showdesc: "block",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            file_name: "No file chosen",
            perpage: 200,
            pagesize: 200,
            defaultstore: 0,
            stores: [],
            ticketinfo: {
                tid: "",
                status: "",
                subject: "",
                comment_body: "",
                comments: [],
                files: [],
            },
        };

        this.handleTicketSubmit = this.handleTicketSubmit.bind(this);
        this.handleTicketCommentSubmit =
            this.handleTicketCommentSubmit.bind(this);
    }

    componentDidMount() {
        this.getData({ page: 1 });
    }

    getData = (data) => {
        axios.get("api/get-tickets").then((response) => {
            let fullgriddata = [];
            response.data.tickets.forEach(function (key) {
                let row_grid_data = {
                    id: key.id,
                    subject: key.subject,
                    status: key.status,
                    created_at: key.created_at,
                    updated_at: key.updated_at,
                    actions: key.id,
                };
                fullgriddata.push(row_grid_data);
            });
            this.setState({ gridrows: fullgriddata });
        });
    };

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    };

    handleChangePerPage = (event) => {
        this.setState({
            perpage: event.target.value,
            pagesize: event.target.value,
            global_msg: { message: "" },
        });
        this.getData({});
    };

    handleViewTicket = (ticket_id, withpopup) => {
        axios.get("api/get-ticket?ticket=" + ticket_id).then((response) => {
            const ticket_info = response.data.ticket;
            const ticket_comment = response.data.comments;
            console.log(ticket_comment.comments);
            this.setState({
                editModal: withpopup,
                ticketinfo: {
                    tid: ticket_info.ticket.id,
                    status: ticket_info.ticket.status,
                    subject: ticket_info.ticket.subject,
                    comments: ticket_comment.comments,
                },
                file_name: "No file chosen",
            });
        });
    };

    handleOpenModal = () => {
        this.setState({ openModal: true, file_name: "No file chosen" });
    };

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            editModal: false,
            deleteModal: false,
            global_msg: { message: "" },
            file_name: "No file chosen",
        });
    };

    handleTicketSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });

        const form = document.querySelector("#ticketForm");
        const ticketData = new FormData(form);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        axios
            .post("api/new-ticket", ticketData, config)
            .then((response) => {
                this.setState({
                    openModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Ticket added successfully! Please wait within 24 hours response.",
                    },
                });
                this.getData({ page: 1 });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.subject !== "undefined" &&
                    errors.subject.length > 0
                ) {
                    msg += errors.subject[0] + "\r\n";
                }
                if (
                    typeof errors.comment !== "undefined" &&
                    errors.comment.length > 0
                ) {
                    msg += errors.comment[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleTicketCommentSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });

        const form = document.querySelector("#ticketCommentForm");
        const ticketData = new FormData(form);
        ticketData.append("ticket_id", this.state.ticketinfo.tid);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        axios
            .post("api/update-ticket", ticketData, config)
            .then((response) => {
                this.setState({
                    file_name: "No file chosen",
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Ticket comment added successfully! Please wait within 24 hours response.",
                    },
                });
                this.handleViewTicket(this.state.ticketinfo.tid, false);
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.comment !== "undefined" &&
                    errors.comment.length > 0
                ) {
                    msg += errors.comment[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleFile = (e) => {
        this.setState({ file_name: e.target.files[0]["name"] });
    };

    capitalizeFirstLowercase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    colorStatus = (status) => {
        let color = "#f50303";
        if (status == "pending") {
            color = "#FFFF00";
        } else if (status == "solved") {
            color = "#00FF00";
        }

        return color;
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
                <Box
                    id="ticketForm"
                    component={"form"}
                    onSubmit={this.handleTicketSubmit}
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
                            Add New Ticket
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
                                    id="subject"
                                    name="subject"
                                    label="Subject"
                                    fullWidth
                                    variant="standard"
                                />
                            </Box>
                        </Typography>
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
                            <Box sx={{ ml: 1, flex: 1 }}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="comment"
                                    name="comment"
                                    label="Comment"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                />
                            </Box>
                        </Typography>
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
                            <Box sx={{ ml: 1, flex: 1 }}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="tags"
                                    name="tags"
                                    label="Tags"
                                    fullWidth
                                    variant="standard"
                                />
                            </Box>
                        </Typography>
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <div className="fileupload_div">
                                        <input
                                            style={{ display: "none" }}
                                            id="raised-button-file"
                                            name="uploads"
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
                        </Typography>
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
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

        const modalCommentsContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.editModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="ticketCommentForm"
                    component={"form"}
                    onSubmit={this.handleTicketCommentSubmit}
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
                            Comments
                        </Typography>

                        {/* Show list of comments */}
                        <Typography sx={{ ml: 2, flex: 1 }} component="div">
                            <h4>
                                Subject:{" "}
                                <strong>{this.state.ticketinfo.subject}</strong>
                            </h4>
                            <p>
                                Status:{" "}
                                <strong>
                                    <span
                                        style={{
                                            color: this.colorStatus(
                                                this.state.ticketinfo.status
                                            ),
                                        }}
                                    >
                                        {this.capitalizeFirstLowercase(
                                            this.state.ticketinfo.status
                                        )}
                                    </span>
                                </strong>
                            </p>
                            <hr />
                            {this.state.ticketinfo.comments.length > 0 ? (
                                this.state.ticketinfo.comments.map((row) => (
                                    <div className="history">
                                        <p>
                                            <span>{row.created_at}</span>
                                        </p>
                                        <p>{row.body}</p>
                                        {row.attachments.length > 0
                                            ? row.attachments.map(
                                                  (attachment) => (
                                                      <img
                                                          src={
                                                              attachment.content_url
                                                          }
                                                          style={{
                                                              maxWidth: "500px",
                                                          }}
                                                      />
                                                  )
                                              )
                                            : ""}
                                    </div>
                                ))
                            ) : (
                                <Alert
                                    style={{ margin: "20px 0" }}
                                    severity="error"
                                >
                                    No Comments added.
                                </Alert>
                            )}
                        </Typography>

                        <Typography
                            style={{ margin: "20px 0px" }}
                            sx={{ ml: 2, flex: 1 }}
                            component="div"
                        >
                            <strong>ADD COMMENTS</strong>
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
                                    id="comment"
                                    name="comment"
                                    label="Comment"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                />
                            </Box>
                        </Typography>
                        <Typography sx={{ ml: 1, flex: 1 }} component="div">
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ ml: 1, flex: 1 }}>
                                    <div className="fileupload_div">
                                        <input
                                            style={{ display: "none" }}
                                            id="raised-button-file"
                                            name="uploads"
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
                                                ? "Submitting..."
                                                : "Submit"}
                                        </Button>
                                    </div>
                                </Box>
                            </Box>
                        </Typography>
                    </DialogContent>
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
                ></Box>
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
                                    <MenuItem value={200}>Show 200</MenuItem>
                                    <MenuItem value={500}>Show 500</MenuItem>
                                </Select>
                            </Typography>
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box className="subpage_graph_sort_cnt">
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={this.handleOpenModal}
                                className="export_button addbtn"
                            >
                                <AddIcon /> Create Ticket
                            </Button>
                        </Box>
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
                            rowsPerPageOptions={[20]}
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
                            getCellClassName={(params) => {
                                if (params.field === "status") {
                                    return params.value + "status";
                                }
                            }}
                            experimentalFeatures={{ newEditingApi: true }}
                        />
                        <div className="datagrid_pagination_bg"></div>
                    </Box>
                </Paper>
                {modalContainer}
                {modalCommentsContainer}
            </React.Fragment>
        );
    }
}

export default withRouter(Lists);
