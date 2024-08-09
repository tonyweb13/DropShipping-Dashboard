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
                            onClick={this.handleReadNotify.bind(
                                this,
                                params.row.id
                            )}
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
                field: "readStatus",
                headerName: "Status",
                flex: 1,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                getActions: (params) => [
                    <Button
                        onClick={this.handleReadNotify.bind(
                            this,
                            params.row.id
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
        };
    }

    componentDidMount() {
        this.getData({ page: 1 });
    }

    getData = (data) => {
        axios.get("api/usernotifications").then((response) => {
            let fullgriddata = [];
            let ctrgrid = 1;
            let readnotifyids = response.data.notify_readids;
            response.data.notify.forEach(function (key) {
                let storedata =
                    key.store != "" && !isNull(key.store)
                        ? key.store
                        : "All Stores";
                let notifystatus = "Unread";
                if (readnotifyids.length > 0) {
                    for (let i = 0; i < readnotifyids.length; i++) {
                        if (readnotifyids[i] == key.id) {
                            notifystatus = "Read";
                        }
                    }
                }
                let row_grid_data = {
                    id: key.id,
                    notification_title: key.notification_title,
                    notification_content: key.notification_content,
                    notification_upload: key.notification_upload,
                    store: storedata,
                    actions: key.id,
                    readStatus: notifystatus,
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

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    };
    handleReadNotify = (notify_id) => {
        const notifyData = new FormData();
        notifyData.append("notifyid", notify_id);

        axios.post("api/read-notification", notifyData).then((response) => {
            if (response.data.filename != "") {
                window.open(response.data.file_url, "_blank", "noreferrer");
                window.location.reload(true);
            }
        });
    };
    render() {
        const fullWidth = true;
        const maxWidth = "md";

        return (
            <React.Fragment>
                <Box
                    m={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                ></Box>

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
                        getCellClassName={(params) => {
                            if (params.field === "readStatus") {
                                return params.value + "status";
                            }
                        }}
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                    <div className="datagrid_pagination_bg"></div>
                </Box>
            </React.Fragment>
        );
    }
}

export default withRouter(NotifyLists);
