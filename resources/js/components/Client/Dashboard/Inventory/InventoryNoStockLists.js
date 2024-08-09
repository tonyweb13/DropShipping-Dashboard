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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
                field: "itemname",
                headerName: "Item Title",
                flex: 1,
            },
            {
                field: "sku",
                headerName: "SKU",
                flex: 1,
            },
            {
                field: "origin",
                headerName: "Country of Origin",
                flex: 1,
            },
            {
                field: "length",
                headerName: "Length",
                flex: 1,
            },
            {
                field: "width",
                headerName: "Width",
                flex: 1,
            },
            {
                field: "height",
                headerName: "Height",
                flex: 1,
            },
            {
                field: "weight",
                headerName: "Weight",
                flex: 1,
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
            store: 0,
            global_msg: {
                type: "error",
                message: "",
            },
            form_message: "",
            openModal: false,
            editModal: false,
            deleteModal: false,
            formSubmitting: false,
            images: "",
            imageList: "",
            country: "US",
            perpage: 200,
            sorticon: "",
            sortfield: "",
            sorting: "ASC",
            gridrows: defaultrows,
            gridcolumns: defaultcolumns,
            pagesize: 200,
            datetimesync: "",
            searchValue: sparamval,
        };

        this.handleInventorySubmit = this.handleInventorySubmit.bind(this);
    }

    componentDidMount() {
        const today = new Date();
        const dateformat = this.state.date !== "" ? this.state.date : today;
        const date = new Date(dateformat);
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            this.setState({
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
            });
        }
        this.getData({ page: 1, perpage: this.state.perpage, date: date });
        this.getsearch_params();
    }

    getData = (data) => {
        this.sortname =
            data.sortname !== undefined ? data.sortname : this.state.sortfield;
        this.sortascdesc =
            data.sorting !== undefined ? data.sorting : this.state.sorting;

        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        // axios.get('api/nostockproducts?page=' + data.page + '&perpage=' + this.perpageno + '&sortfield=' + this.sortname+ '&sorting=' + this.sortascdesc).then(response => {
        //     this.setState({products:response.data.products.data, data:response.data.products});
        // });
        axios.get("api/nostockproducts").then((response) => {
            let fullgriddata = [];
            let ctrgrid = 1;
            response.data.products.forEach(function (key) {
                let row_grid_data = {
                    id: key.master_inventory_id,
                    itemname: key.item_name,
                    sku: key.sku,
                    location: key.location,
                    origin: key.origin,
                    length: key.length,
                    height: key.height,
                    weight: key.weight,
                    width: key.width,
                    qty: key.qty_onhand,
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

    handleChangePerPage = (event) => {
        const date = new Date(this.state.date);
        this.setState({
            perpage: event.target.value,
            pagesize: event.target.value,
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

    handleOnchangeImage = (imageList, addUpdateIndex) => {
        console.log(imageList, addUpdateIndex);
        this.setState({ imageList: imageList });
    };

    onImageUpload = () => {
        console.log("Image upload");
    };

    onImageRemoveAll = () => {
        console.log("Image remove all");
    };

    onImageUpdate = () => {
        console.log("Image update");
    };

    onImageRemove = () => {
        console.log("Image remove");
    };

    handleInventorySubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });

        console.log(e);

        var formData = new FormData();
        // formData.append("title", e.target[5].value);
        // formData.append("sku", e.target[6].value);
        // formData.append("description", e.target[7].value);
        // formData.append("quantity", e.target[9].value);
        // formData.append("amount", e.target[10].value);
        // formData.append("store", this.state.store);
        // // formData.append("userfile", fileInputElement.files[0]);

        // axios.post('api/add-product', formData).then(response => {
        //           this.setState({openModal:false, formSubmitting: false});
        //           this.getData({page:1});
        //       }).catch(error=> {
        //        let msg = '';
        //       	const errors = error.response.data.errors;
        //       	if(typeof errors.title !== 'undefined' && errors.title.length > 0) {
        //       		msg += errors.title[0] +"\r\n";
        //       	}
        //       	if(typeof errors.sku !== 'undefined' && errors.sku.length > 0) {
        //       		msg += errors.sku[0] +"\r\n";
        //       	}
        //       	if(typeof errors.description !== 'undefined' && errors.description.length > 0) {
        //       		msg += errors.description[0] +"\r\n";
        //       	}
        //       	if(typeof errors.quantity !== 'undefined' && errors.quantity.length > 0) {
        //       		msg += errors.quantity[0] +"\r\n";
        //       	}
        //       	if(typeof errors.amount !== 'undefined' && errors.amount.length > 0) {
        //       		msg += errors.amount[0] +"\r\n";
        //       	}
        //        this.setState({formSubmitting: false, form_message: msg});
        //       });
    }

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

        const modalContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
            >
                <Box
                    id="inventoryForm"
                    component={"form"}
                    onSubmit={this.handleInventorySubmit}
                >
                    <AppBar sx={{ position: "relative" }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={this.handleCloseModal}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="h6"
                                component="div"
                            >
                                Add Product
                            </Typography>
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
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        {this.state.form_message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.form_message}
                            </Alert>
                        )}
                        <ImageUploading
                            multiple
                            value={this.state.images}
                            onChange={this.handleOnchangeImage}
                            maxNumber={69}
                            dataURLKey="data_url"
                        >
                            {({
                                imageList,
                                onImageUpload,
                                onImageRemoveAll,
                                onImageUpdate,
                                onImageRemove,
                                isDragging,
                                dragProps,
                            }) => (
                                // write your building UI
                                <div className="upload__image-wrapper">
                                    <button
                                        type={"button"}
                                        style={
                                            isDragging
                                                ? { color: "red" }
                                                : undefined
                                        }
                                        onClick={this.onImageUpload}
                                        {...dragProps}
                                    >
                                        Click or Drop here
                                    </button>
                                    &nbsp;
                                    <button
                                        type={"button"}
                                        onClick={onImageRemoveAll}
                                    >
                                        Remove all images
                                    </button>
                                    {imageList.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <img
                                                src={image["data_url"]}
                                                alt=""
                                                width="100"
                                            />
                                            <div className="image-item__btn-wrapper">
                                                <button
                                                    onClick={() =>
                                                        onImageUpdate(index)
                                                    }
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onImageRemove(index)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ImageUploading>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            name="title"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="sku"
                            name="sku"
                            label="SKU"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            fullWidth
                            rows={4}
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="quantity"
                            name="quantity"
                            label="Quantity"
                            type="number"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="amount"
                            name="amount"
                            label="Amount"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
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
                >
                    {/* <Button variant="outlined" onClick={this.handleOpenModal}>
					  <AddIcon /> Add Product
					</Button> */}
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
                {this.state.global_msg.message != "" && (
                    <Alert
                        style={{ marginBottom: "20px" }}
                        severity={this.state.global_msg.type}
                    >
                        {this.state.global_msg.message}
                    </Alert>
                )}
                <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                    className="table_grid"
                >
                    <Typography component="h2" className="subpage_title">
                        {this.state.title}
                    </Typography>
                    <div className="table_filter_options inventory_filters prodfilters">
                        <Typography
                            component="div"
                            className="table_selection_area"
                        >
                            {/* <Select
								value={''}
								displayEmpty
								inputProps={{ 'aria-label': 'Without label' }}
								className='filter-by-batch filter_selects'
								IconComponent={KeyboardArrowDownIcon}
							>
								<MenuItem value="">
									<em style={{ fontStyle: 'normal' }}>Batch Action</em>
								</MenuItem>
							</Select> */}
                            {/*<Select
								value={''}
								displayEmpty
								inputProps={{ 'aria-label': 'Without label' }}
								className='table-filters filter_selects'
								IconComponent={KeyboardArrowDownIcon}
							>
								<MenuItem value="">
									<em style={{ fontStyle: 'normal' }}>Filter</em>
								</MenuItem>
							</Select>*/}
                            <Select
                                value={this.state.perpage}
                                onChange={this.handleChangePerPage}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                className="table-filters filter_selects"
                                IconComponent={KeyboardArrowDownIcon}
                            >
                                {/* <MenuItem value={2}>Show 2</MenuItem> */}
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
                    </div>

                    {/* <div className="table_grid_container">
						<Table size="small"  className="table_data">
							<TableHead>
							<TableRow>
								<TableCell><Link href="#" onClick={this.handleTableSort("title")}>Item Title {this.state.sorticon=="title" && this.state.sorting=="ASC" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</Link></TableCell>
								<TableCell><Link href="#" onClick={this.handleTableSort("sku")}>Item SKU {this.state.sorticon=="sku" && this.state.sorting=="ASC" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</Link></TableCell>
							</TableRow>
							</TableHead>
							<TableBody>
							{this.state.products.length > 0 ? this.state.products.map((row) => (						
								<TableRow>
								<TableCell>{row.title}</TableCell>
								<TableCell>{row.sku}</TableCell>
								</TableRow>
							)) : 
                                <TableRow key={0}>
                                  <TableCell colSpan={7}>No matching inventory found.</TableCell>
                                </TableRow>
                            }
							</TableBody>
						</Table>
					</div>
					<Typography component="div" className="inventory_pagination_div">
						<Pagination count={10} changePage={this.getData} data={this.state.data} variant="outlined" shape="rounded"  prevButtonClass="prev_pbtn" nextButtonClass="next_pbtn"/>
					</Typography> */}
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
                            experimentalFeatures={{ newEditingApi: true }}
                            initialState={{
                                filter: {
                                    filterModel: {
                                        items: [
                                            {
                                                id: 1,
                                                columnField: "itemname",
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
            </React.Fragment>
        );
    }
}

export default InventoryLists;
