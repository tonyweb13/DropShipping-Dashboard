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

class ZendeskLogs extends Component {
    constructor(props) {
        super(props);

        const defaultcolumns = [
            { field: "id", headerName: "ID", flex: 1, hide: true },
            {
                field: "log_title",
                headerName: "Title",
                flex: 1,
            },
            {
                field: "customername",
                headerName: "Customer",
                flex: 1,
            },
            {
                field: "requester",
                headerName: "Requester",
                flex: 1,
            },
            {
                field: "storename",
                headerName: "Store",
                flex: 1,
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
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 20,
        };
    }

    componentDidMount() {
        this.getData({ page: 1 });
        this.storelists();
    }

    getData = (data) => {
        axios.get("api/zendesk-logs").then((response) => {
            let fullgriddata = [];
            let ctrgrid = 1;
            response.data.logs.forEach(function (key) {
                let storedata =
                    key.store != "" && !isNull(key.store)
                        ? key.store
                        : "All Stores";
                let row_grid_data = {
                    id: key.id,
                    log_title: key.log_title,
                    customername: key.customername,
                    requester: key.requester,
                    storename: key.storename,
                    actions: key.id,
                };
                fullgriddata.push(row_grid_data);
                ctrgrid++;
            });
            this.setState({ gridrows: fullgriddata });
        });
    };

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
            </React.Fragment>
        );
    }
}

export default withRouter(ZendeskLogs);
