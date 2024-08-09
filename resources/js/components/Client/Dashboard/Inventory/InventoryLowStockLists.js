import React, { Component } from "react";
import { Pagination } from "react-laravel-paginex";
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

class InventoryLists extends Component {
    constructor(props) {
        super(props);
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
            perpage: 10,
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
    }

    getData = (data) => {
        const statedate = new Date(this.state.date);
        const date = data.date !== undefined ? data.date : statedate;
        const dateformat =
            date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear();
        const stocktype = this.state.stocktype;

        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        axios
            .get(
                "api/products?page=" +
                    data.page +
                    "&perpage=" +
                    this.perpageno +
                    "&producttype=" +
                    this.state.producttype +
                    "&date=" +
                    dateformat +
                    "&stocktype=" +
                    stocktype
            )
            .then((response) => {
                this.setState({
                    products: response.data.products.data,
                    data: response.data.products,
                    date: dateformat,
                    datefilter: date.toLocaleDateString("en-us", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }),
                    dateweekfilter: date.toLocaleDateString("en-us", {
                        weekday: "long",
                    }),
                });
            });
    };

    handleChangePerPage = (event) => {
        const date = new Date(this.state.date);
        this.setState({ perpage: event.target.value });
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
                    <div className="table_filter_options inventory_filters">
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
                                <MenuItem value={2}>Show 2</MenuItem>
                                <MenuItem value="10">
                                    <em style={{ fontStyle: "normal" }}>
                                        Show 10
                                    </em>
                                </MenuItem>
                                <MenuItem value={20}>Show 20</MenuItem>
                                <MenuItem value={50}>Show 50</MenuItem>
                                <MenuItem value={75}>Show 75</MenuItem>
                                <MenuItem value={100}>Show 100</MenuItem>
                            </Select>
                        </Typography>
                        <Typography
                            component="div"
                            className="table_selection_area right_selections"
                        >
                            <Link href="#">
                                <img src={printericon} alt="printer icon" />
                            </Link>
                            <Link href="#">
                                <img src={uploadicon} alt="upload icon" />
                            </Link>
                            <Link href="#">
                                <img src={settingsicon} alt="settings icon" />
                            </Link>
                        </Typography>
                    </div>

                    <div className="table_grid_container">
                        <Table size="small" className="table_data">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>SKU</TableCell>
                                    <TableCell>PK Count</TableCell>
                                    <TableCell>Ordered Qty</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Notes</TableCell>
                                    <TableCell>Upload</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.products.length > 0 ? (
                                    this.state.products.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.title}</TableCell>
                                            <TableCell>{row.sku}</TableCell>
                                            <TableCell>
                                                {row.inventory_count}
                                            </TableCell>
                                            <TableCell>
                                                {row.inventory_count}
                                            </TableCell>
                                            <TableCell>
                                                {row.inventory_count}
                                            </TableCell>
                                            <TableCell>
                                                {row.inventory_count}
                                            </TableCell>
                                            <TableCell>
                                                {row.inventory_count}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow key={0}>
                                        <TableCell colSpan={7}>
                                            No matching inventory found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <Typography
                        component="div"
                        className="inventory_pagination_div"
                    >
                        <Pagination
                            count={10}
                            changePage={this.getData}
                            data={this.state.data}
                            variant="outlined"
                            shape="rounded"
                            prevButtonClass="prev_pbtn"
                            nextButtonClass="next_pbtn"
                        />
                    </Typography>
                </Paper>
                {modalContainer}
            </React.Fragment>
        );
    }
}

export default InventoryLists;
