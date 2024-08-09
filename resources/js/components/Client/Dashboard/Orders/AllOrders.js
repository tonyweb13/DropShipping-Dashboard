import React, { Component } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Container,
    Grid,
    Paper,
    CssBaseline,
    Box,
    Toolbar,
    Link,
    Typography,
    TextField,
    Alert,
    Select,
    MenuItem,
    Button,
    DialogContent,
    Dialog,
    AppBar,
    IconButton,
    InputLabel,
    Autocomplete,
} from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CommonSection from "../Common/CommonSection";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CSVLink } from "react-csv";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import Swal from "sweetalert";

import {
    DataGridPremium,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid-premium";
import PaginationComponent from "./Pagination";

export function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
}

function CustomFooter() {
    return <div style={{ backgroundColor: "white" }}></div>;
}

class Orders extends Component {
    constructor(props) {
        super(props);
        let labels = [" "];
        const csvData = [];
        const defaultrows = [];
        const urlparams = new URLSearchParams(window.location.search);
        const sparamval = urlparams.get("search");
        const badAddressParam = urlparams.get("statusFilter");
        const shippedFilterDate = urlparams.get("shippedFilterDate");
        this.csvLinkRef = React.createRef();
        this.state = {
            location: "all-orders",
            title: "All",
            maintitle: "Orders",
            orders: [],
            data: [],
            perpage: 200,
            statusfilter: "Shipped",
            sortfield: "",
            sorting: "ASC",
            csvdata: csvData,
            openModal: false,
            openEditAddressModal: false,
            formSubmitting: false,
            exceldata: [],
            orderid: 0,
            sorticon: "",
            totalV2: 0,
            pageV2: 1,
            exporting: false,
            perPageV2: 200,
            searchOrders: "",
            gridrows: defaultrows,
            gridrowsCSVCSV: [],
            badAddressParam: badAddressParam,
            shippedFilterDate: shippedFilterDate,
            gridcolumns: [],
            gridcolumnsCSV: [],
            gridloading: false,
            pagesize: 200,
            filterByDate: "Order Date",
            checked: true,
            global_msg: {
                type: "error",
                message: "",
            },
            global_msgnew: {
                type: "error",
                message: "",
            },
            common_msg: {
                type: "error",
                message: "",
            },
            cancelledbtn: null,
            printedbtn: null,
            disableModal: false,
            storedisable: false,
            gstoreid: 0,
            reloadpopup: false,
            searchValue: sparamval,
            startdate: "",
            enddate: "",
            displayDates: "none",
            form_message: "",
            showDropdownUS: false,
            countriesoptions: [],
            statesoptions: [],
            citiesoptions: [],
            order_item: [],
            statusoptions: [],
            exportFlag: 1,
            badAddress: {
                order_id: 0,
                order_number: "",
                country: "",
                state: "",
                city: "",
                street1: "",
                street2: "",
                street3: "",
                postal_code: "",
                address_validation: "",
            },
            shipppedcolumns: [
                {
                    field: "ordernumber",
                    headerName: "Order Number",
                    renderCell: (params) => {
                        return (
                            <div
                                className="prod_title_link"
                                onClick={this.handleShowClientOrderItem.bind(
                                    this,
                                    params.row.orderid,
                                    params.row.ordernumber
                                )}
                            >
                                {params.row.ordernumber}
                            </div>
                        );
                    },
                    flex: 1,
                },
                {
                    field: "OrderDate",
                    headerName: "Order Date",
                    flex: 1,
                },
                {
                    field: "ShippingAddress",
                    headerName: "Shipping Address",
                    renderCell: (params) => {
                        let spstreet1 = params.row.ShipStreet1 ?? "";
                        let spstreet2 = params.row.ShipStreet2 ?? "";
                        let spstreet3 = params.row.ShipStreet3 ?? "";
                        let spcity = params.row.ShipCity ?? "";
                        let spState = params.row.ShipPostalCode ?? "";
                        let zpcode = params.row.ShipStateProvCode ?? "";
                        let cntry = params.row.ShipCountryCode ?? "";

                        return (
                            spstreet1 +
                            " " +
                            spstreet2 +
                            " " +
                            spstreet3 +
                            " " +
                            spcity +
                            " " +
                            spState +
                            " " +
                            zpcode +
                            " " +
                            cntry
                        );
                    },
                    flex: 1,
                },
                {
                    field: "TrackingNumber",
                    headerName: "Tracking Number",
                    renderCell: (params) => {
                        let asendia =
                            "https://a1.asendiausa.com/tracking/?trackingnumber=";
                        let ups =
                            "https://www.ups.com/track?loc=en_US&tracknum=";
                        let dhl =
                            "https://www.dhl.com/ph-en/home/tracking/tracking-express.html?submit=1&tracking-id=";
                        let fedex =
                            "http://mailviewrecipient.fedex.com/recip_package_summary.aspx?PostalID=";
                        let usps =
                            "https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=";
                        let royal =
                            "https://www.royalmail.com/track-your-item#/tracking-results/";
                        let deutsche =
                            "https://www.packet.deutschepost.com/webapp/public/packet_traceit.xhtml?barcode=";
                        let dhl_express_uk =
                            "https://mydhl.express.dhl/gb/en/tracking.html#/results?id=";
                        let evri = "https://globaleco.app/track/";

                        if (params.row.Carrier == "Asendia") {
                            return (
                                <Link
                                    href={`${asendia}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        } else if (params.row.Carrier == "UPS") {
                            return (
                                <Link
                                    href={`${ups}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        } else if (params.row.Carrier == "DHL Express") {
                            return (
                                <Link
                                    href={`${dhl}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        } else if (params.row.Carrier == "FedEx") {
                            return (
                                <Link
                                    href={`${fedex}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        } else if (params.row.Carrier == "USPS") {
                            return (
                                <Link
                                    href={`${usps}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        } else if (params.row.Carrier == "Royal Mail") {
                            return (
                                <Link
                                    href={`${royal}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        } else if (
                            params.row.Carrier == "Deutsche Post Cross-Border"
                        ) {
                            return (
                                <Link
                                    href={`${deutsche}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        } else if (params.row.Carrier == "dhl_express_uk") {
                            return (
                                <Link
                                    href={`${dhl_express_uk}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        } else if (params.row.Carrier == "EVRi UK") {
                            return (
                                <Link
                                    href={`${evri}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        } else {
                            return (
                                <Link
                                    href={`${usps}${params.row.TrackingNumber}`}
                                    target="_blank"
                                >
                                    {params.row.TrackingNumber}
                                </Link>
                            );
                        }
                    },
                    flex: 1,
                },
                {
                    field: "ProcessedDate",
                    headerName: "Shipped Date",
                    renderCell: (params) => {
                        if (
                            params.row.ProcessedDate == "1900-01-01 00:00:00" ||
                            params.row.ProcessedDate == "0000-00-00 00:00:00"
                        ) {
                            return "";
                        } else {
                            const dateObj = new Date(params.row.ProcessedDate);
                            const year = dateObj.getFullYear();
                            const month = String(
                                dateObj.getMonth() + 1
                            ).padStart(2, "0");
                            const day = String(dateObj.getDate()).padStart(
                                2,
                                "0"
                            );
                            return `${year}-${month}-${day}`;
                        }
                    },
                    flex: 1,
                },
                {
                    field: "Carrier",
                    headerName: "Carrier",
                    flex: 1,
                },
                {
                    field: "TrackingStatus",
                    headerName: "Tracking Status",
                    flex: 1,
                },
            ],
            badaddresscolumns: [
                {
                    field: "ordernumber",
                    headerName: "Order Number",
                    renderCell: (params) => {
                        return (
                            <div
                                className="prod_title_link"
                                onClick={this.handleShowClientOrderItem.bind(
                                    this,
                                    params.row.orderid,
                                    params.row.ordernumber
                                )}
                            >
                                {params.row.ordernumber}
                            </div>
                        );
                    },
                    flex: 1,
                },
                {
                    field: "OrderDate",
                    headerName: "Order Date",
                    flex: 1,
                },
                {
                    field: "LocalStatus",
                    headerName: "Local Status",
                    renderCell: (params) => {
                        const lowerCaseLocalStatus =
                            params.row.LocalStatus.toLowerCase();
                        if (
                            params.row.LocalStatus == "Bad Address" ||
                            params.row.LocalStatus == "Awaiting Shipment" ||
                            params.row.LocalStatus == "Backordered" ||
                            lowerCaseLocalStatus.includes("hold")
                        ) {
                            return (
                                <div
                                    title="Click to Edit Address"
                                    className="prod_title_link"
                                    onClick={this.handleEditAddress.bind(
                                        this,
                                        params.row.ordernumber,
                                        params.row.LocalStatus
                                    )}
                                >
                                    {params.row.LocalStatus}
                                </div>
                            );
                        }
                    },
                    flex: 1,
                },
                {
                    field: "ShippingAddress",
                    headerName: "Shipping Address",
                    renderCell: (params) => {
                        let spstreet1 = params.row.ShipStreet1 ?? "";
                        let spstreet2 = params.row.ShipStreet2 ?? "";
                        let spstreet3 = params.row.ShipStreet3 ?? "";
                        let spcity = params.row.ShipCity ?? "";
                        let spState = params.row.ShipPostalCode ?? "";
                        let zpcode = params.row.ShipStateProvCode ?? "";
                        let cntry = params.row.ShipCountryCode ?? "";

                        return (
                            spstreet1 +
                            " " +
                            spstreet2 +
                            " " +
                            spstreet3 +
                            " " +
                            spcity +
                            " " +
                            spState +
                            " " +
                            zpcode +
                            " " +
                            cntry
                        );
                    },
                    flex: 1,
                },
                {
                    field: "shipaddressvalidationerror",
                    headerName: "Ship Address Validation Error",
                    renderCell: (params) => {
                        if (params.row.LocalStatus == "processing") {
                            return "";
                        }
                    },
                    flex: 1,
                },
            ],
        };

        this.handleShowClientOrderItem =
            this.handleShowClientOrderItem.bind(this);

        this.handleEditAddressSubmit = this.handleEditAddressSubmit.bind(this);
    }

    showConfirmAlert = () => {
        swal({
            title: "Confirmation",
            text: "The application can only export up to 25, 000 records, if you wish to download the data click YES or NO to Cancel",
            icon: "warning",
            buttons: ["Cancel", "Yes"],
        }).then((result) => {
            if (result) {
                this.csvLinkRef.current.link.click();
            } else {
            }
        });
    };

    componentDidMount() {
        let accessUserLevel = parseInt(localStorage["accessUserLevel"]);
        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);

        this.getData({
            page: 1,
            perpage: this.state.perpage,
            gridcolumns: this.state.shipppedcolumns,
        });
        this.assign_storeid();
        this.getsearch_params();

        if (typeof accessUserLevel !== undefined && accessUserLevel == 1) {
            this.removeActionColumn();
        }
        this.handleSelectedLocalStatus();
    }

    getData = (data) => {
        this.state.gridloading = true;
        this.perpageno =
            data.perpage !== undefined ? data.perpage : this.state.perpage;
        this.sortname =
            data.sortname !== undefined ? data.sortname : this.state.sortfield;
        this.sortascdesc =
            data.sorting !== undefined ? data.sorting : this.state.sorting;
        this.statfilter = data.statusfilter ?? this.state.statusfilter;
        this.searchCustom = data.searchOrders ?? this.state.searchOrders;

        this.start_date = data.start_date ? data?.start_date : null;
        this.end_date = data.end_date ? data?.end_date : null;

        this.export = data.export ? data?.export : "";

        this.filterByDate = data.filterByDate ?? this.state.filterByDate;

        if (this.searchCustom) {
            this.statfilter = "";
            this.setState({
                searchOrders: this.searchCustom,
            });
        }

        if (!data.searchOrders) {
            this.setState({
                searchOrders: "",
            });
        }

        if (this.state.badAddressParam) {
            if (this.state.badAddressParam == "Delayed") {
                this.searchCustom = "Delayed";
                this.setState({
                    searchOrders: "Delayed",
                    badAddressParam: null,
                });
            } else {
                this.statfilter = this.state.badAddressParam;
            }
        }

        let shippedFilterDate = this.state.shippedFilterDate
            ? this.state.shippedFilterDate
            : "";

        axios
            .get(
                `api/allorders?page=${data.page}&statusfilter=${
                    this.statfilter
                }&searchOrders=${
                    this.state.searchValue
                        ? this.state.searchValue
                        : this.searchCustom
                }&start_date=` +
                    this.start_date +
                    "&end_date=" +
                    this.end_date +
                    "&export=" +
                    this.export +
                    "&filterByDate=" +
                    this.filterByDate +
                    "&shippedFilterDate=" +
                    shippedFilterDate
            )
            .then((response) => {
                let fullgriddata = [];
                let ctrgrid = 1;

                response.data.orders?.data.forEach(function (key) {
                    let row_grid_data = {
                        id: ctrgrid,
                        orderid: key.orderid,
                        ordernumber: key.ordernumber,
                        OrderDate: key.OrderDate.substring(0, 11),
                        LocalStatus: key.LocalStatus,
                        ShipStreet1: key.ShipStreet1,
                        ShipStreet2: key.ShipStreet2,
                        ShipStreet3: key.ShipStreet3,
                        ShipCity: key.ShipCity,
                        ShipPostalCode: key.ShipPostalCode,
                        ShipStateProvCode: key.ShipStateProvCode,
                        ShipCountryCode: key.ShipCountryCode,
                        TrackingNumber: key.TrackingNumber,
                        ProcessedDate: key.ProcessedDate,
                        Carrier: key.Carrier,
                        ShippingService: key.ShippingService,
                        RequestedShipping: key.RequestedShipping,
                        shipaddressvalidationerror:
                            key.shipaddressvalidationerror,
                        TrackingStatus: key.TrackingStatus,
                    };
                    let fullgriddataCSV = [];
                    fullgriddata.push(row_grid_data);
                    fullgriddataCSV.push(fullgriddataCSV);
                    ctrgrid++;
                });

                if (this.export == "export") {
                    this.setState(
                        {
                            gridrowsCSVCSV: fullgriddata,
                        },
                        () => {
                            // Callback function to execute after state is updated
                            console.log(fullgriddata);
                            if (fullgriddata.length > 25000) {
                                this.showConfirmAlert();
                            } else {
                                this.csvLinkRef.current.link.click();
                            }
                        }
                    );
                }

                if (this.statfilter == "Shipped" || this.statfilter == "") {
                    let gridcolumnsCSVTemp = [];
                    this.state.shipppedcolumns?.map((data, index) => {
                        gridcolumnsCSVTemp.push({
                            label: data?.field,
                            key: data?.field,
                        });
                    });
                    this.setState({
                        gridcolumns: this.state.shipppedcolumns,
                        gridcolumnsCSV: gridcolumnsCSVTemp,
                    });
                } else {
                    let gridcolumnsCSVTemp = [];
                    this.state.badaddresscolumns?.map((data, index) => {
                        gridcolumnsCSVTemp.push({
                            label: data?.field,
                            key: data?.field,
                        });
                    });
                    this.setState({
                        gridcolumns: this.state.badaddresscolumns,
                        gridcolumnsCSV: gridcolumnsCSVTemp,
                    });
                }

                this.setState({
                    gridrows: fullgriddata,
                    gridloading: false,
                    totalV2: response?.data?.orders?.total,
                    searchValue: null,
                });
                if (this.state.badAddressParam) {
                    this.setState({
                        statusfilter: this.state.badAddressParam,
                        badAddressParam: null,
                    });
                }
                const urlParams = new URLSearchParams(window.location.search);

                // Remove the desired query parameter
                urlParams.delete("search");
                urlParams.delete("shippedFilterDate");

                const newUrl = `${
                    window.location.pathname
                }?${urlParams.toString()}`;
                window.history.replaceState(null, "", newUrl);
            });
    };

    handleSearchChange = (event) => {
        this.setState({ gridloading: true });
        let searcResult = event.target.value;
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            searchOrders: searcResult,
        });
        this.setState({ gridloading: false });
    };

    handlePageChange = (newPage) => {
        this.setState({
            pageV2: newPage,
        });
    };

    componentDidUpdate(prevProps, prevState) {
        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        if (prevState.pageV2 !== this.state.pageV2) {
            this.getData({
                page: this.state.pageV2,
                perpage: this.state.perPageV2,
                start_date: this.state.startdate,
                end_date: this.state.enddate,
            });
        }

        // if (prevState.exporting) {
        //     if (this.state.exportFlag == 1) {
        //         this.setState({
        //             exportFlag: 2,
        //         });
        //         let columns = [];

        //         let condition = 4;
        //         if (
        //             this.state.statusfilter == "Shipped" ||
        //             this.state.statusfilter == ""
        //         ) {
        //             this.state.shipppedcolumns?.map((data, index) => {
        //                 columns.push(data?.field);
        //             });
        //         } else {
        //             condition = 5;
        //             this.state.badaddresscolumns?.map((data, index) => {
        //                 columns.push(data?.field);
        //             });
        //         }

        //         const csvData = this.state.gridrowsCSVCSV.map((row) => {
        //             let spstreet1 = row.ShipStreet1 ?? "";
        //             let spstreet2 = row.ShipStreet2 ?? "";
        //             let spstreet3 = row.ShipStreet3 ?? "";
        //             let spcity = row.ShipCity ?? "";
        //             let spState = row.ShipPostalCode ?? "";
        //             let zpcode = row.ShipStateProvCode ?? "";
        //             let cntry = row.ShipCountryCode ?? "";
        //             row.ShippingAddress1 =
        //                 spstreet1 +
        //                 " " +
        //                 spstreet2 +
        //                 " " +
        //                 spstreet3 +
        //                 " " +
        //                 spcity +
        //                 " " +
        //                 spState +
        //                 " " +
        //                 zpcode +
        //                 " " +
        //                 cntry;
        //             let rows = [];
        //             let count = 0;
        //             Object.keys(row).map((key) => {
        //                 count++;
        //                 if (columns.includes(key)) {
        //                     rows.push(row[key]);
        //                 }
        //                 if (count == condition) {
        //                     rows.push(row.ShippingAddress1);
        //                 }
        //             });
        //             return rows;
        //         });

        //         let finalData = [[...columns], ...csvData];
        //         console.log(finalData);
        //         const csvContent =
        //             "data:text/csv;charset=utf-8," +
        //             finalData.map((e) => e.join(",")).join("\n");
        //         const encodedUri = encodeURI(csvContent);
        //         const link = document.createElement("a");
        //         link.setAttribute("href", encodedUri);
        //         link.setAttribute(
        //             "download",
        //             `allOrders-${new Date().toISOString()}.csv`
        //         );
        //         document.body.appendChild(link);
        //         link.click();
        //         this.setState({
        //             global_msgnew: {
        //                 message: "",
        //                 type: "success",
        //             },
        //         });
        //         this.setState({ exporting: false });
        //     }
        // }
    }

    handleEditAddress = (ordernumber, localstatus) => {
        axios
            .get(
                `api/getLocalStatusEditAddress?ordernumber=${ordernumber}&localstatus=${localstatus}`
            )
            .then((response) => {
                this.setState({
                    openEditAddressModal: true,
                    form_message: "",
                    badAddress: {
                        order_id:
                            response.data.LocalStatusEditAddress[0].orderid,
                        order_number:
                            response.data.LocalStatusEditAddress[0].ordernumber,
                        street1:
                            response.data.LocalStatusEditAddress[0].ShipStreet1,
                        street2:
                            response.data.LocalStatusEditAddress[0].ShipStreet2,
                        street3:
                            response.data.LocalStatusEditAddress[0].ShipStreet3,
                        postal_code:
                            response.data.LocalStatusEditAddress[0]
                                .ShipPostalCode,
                        address_validation:
                            response.data.LocalStatusEditAddress[0]
                                .shipaddressvalidationerror,
                        country: {
                            value: response.data.LocalStatusEditAddress[0]
                                .ShipCountryCode,
                            label: response.data.LocalStatusEditAddress[0]
                                .ShipCountryCode,
                        },
                        state: {
                            value: response.data.LocalStatusEditAddress[0]
                                .ShipStateProvCode,
                            label: response.data.LocalStatusEditAddress[0]
                                .ShipStateProvCode,
                        },
                        city: {
                            value: response.data.LocalStatusEditAddress[0]
                                .ShipCity,
                            label: response.data.LocalStatusEditAddress[0]
                                .ShipCity,
                        },
                    },
                });
            });

        axios.get("api/countries").then((response) => {
            const country_options = [];
            response.data.countries.forEach(function (key) {
                let row_grid_data = {
                    value: key.code,
                    label: key.name + " - " + key.code,
                };
                country_options.push(row_grid_data);
            });
            this.setState({ countriesoptions: country_options });
        });

        axios.get("api/states").then((response) => {
            const states_options = [];
            response.data.states.forEach(function (key) {
                let row_grid_data = {
                    value: key.code,
                    label: key.name + " - " + key.code,
                };
                states_options.push(row_grid_data);
            });
            this.setState({ statesoptions: states_options });
        });

        axios.get("api/cities").then((response) => {
            const cities_options = [];
            response.data.cities.forEach(function (key) {
                let row_grid_data = {
                    value: key.name,
                    label: key.name,
                };
                cities_options.push(row_grid_data);
            });
            this.setState({ citiesoptions: cities_options });
        });
    };

    handleEditAddressSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });

        let country =
            this.state.badAddress.country.value ??
            this.state.badAddress.country;
        let states =
            this.state.badAddress.state.value ?? this.state.badAddress.state;
        let city =
            this.state.badAddress.city.value ?? this.state.badAddress.city;

        const form = document.querySelector("#editAddressForm");
        const newEditAddress = new FormData(form);
        newEditAddress.append("country", country);
        newEditAddress.append("state", states);
        newEditAddress.append("city", city);
        newEditAddress.append("localstatus", this.state.statusfilter);
        newEditAddress.append(
            "order_number",
            this.state.badAddress.order_number
        );

        axios
            .post("api/updateLocalStatusAddress", newEditAddress)
            .then((response) => {
                this.setState({
                    openEditAddressModal: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message:
                            "Order Number " +
                            this.state.badAddress.order_number +
                            " Address Updated Successfully!",
                    },
                });
                this.getData({ page: 1 });
                this.setState({ form_message: "", ...newEditAddress });
            })
            .catch((error) => {
                let msg = "";

                if (error.response && error.response.status === 422) {
                    const validationErrors = error.response.data.errors;

                    if (validationErrors.street1) {
                        msg += validationErrors.street1[0] + "\r\n";
                    }
                    if (validationErrors.postal_code) {
                        msg += validationErrors.postal_code[0] + "\r\n";
                    }
                } else {
                    msg += error + "\r\n";
                }

                this.setState({ formSubmitting: false, form_message: msg });
            });
    }

    handleSelectedLocalStatus = () => {
        axios.get("api/allOrdersLocalStatus").then((response) => {
            this.setState({ statusoptions: response.data.localstatus });
        });
    };

    handleSelectedCountry = (e) => {
        let value = e.target.attributes.value.value;
        if (value == "US") {
            this.setState({ showDropdownUS: true });
        } else {
            this.setState({ showDropdownUS: false });
        }
        this.setState((prevState) => ({
            badAddress: {
                ...prevState.badAddress,
                country: value,
            },
        }));
    };

    handleSelectedState = (e) => {
        if (this.state.badAddress.country == "US") {
            let value = e.target.attributes.value.value;
            this.setState((prevState) => ({
                badAddress: {
                    ...prevState.badAddress,
                    state: value,
                },
            }));
        }
    };

    handleSelectedCity = (e) => {
        let value = e.target.attributes.value.value;
        this.setState((prevState) => ({
            badAddress: {
                ...prevState.badAddress,
                city: value,
            },
        }));
    };

    handleShowClientOrderItem = (orderid, ordernumber) => {
        axios
            .get(
                `api/getClientOrderItem?orderId=${orderid}&orderNumber=${ordernumber}`
            )
            .then((response) => {
                this.setState({
                    openModal: true,
                    order_item: response.data.clientOrderItem,
                });
            });
    };

    handleForcePrint = () => {
        if (window.confirm("Do you really wish to force print this order?")) {
            const orderData = new FormData();
            orderData.append("orderid", this.state.badAddress.order_id);
            orderData.append("ordernumber", this.state.badAddress.order_number);

            axios
                .post("api/allOrdersForcePrint", orderData)
                .then((response) => {
                    let type = "";
                    let msg = "";
                    let dropdownStatus = "Shipped";

                    if (response.data.printed) {
                        type = "success";
                        msg = `Order Number: ${this.state.badAddress.order_number} ${response.data.printed} Successfully!`;
                        dropdownStatus = response.data.printed;
                    } else {
                        type = "error";
                        msg = "All Orders for Force Print Failed";
                    }

                    let dropdownForcePrint = {
                        target: {
                            value: dropdownStatus,
                        },
                    };

                    this.getData({
                        page: 1,
                        statusfilter: dropdownStatus,
                    });
                    this.handleChangeFilter(dropdownForcePrint);
                    this.setState({
                        openEditAddressModal: false,
                        global_msg: {
                            type: type,
                            message: msg,
                        },
                    });
                });
        }
    };

    handleCancelByClient = () => {
        if (window.confirm("Do you really wish to cancel this order?")) {
            const orderData = new FormData();
            orderData.append("orderid", this.state.badAddress.order_id);
            orderData.append("ordernumber", this.state.badAddress.order_number);

            axios
                .post("api/allOrdersCancelByClient", orderData)
                .then((response) => {
                    let type = "";
                    let msg = "";
                    let dropdownStatus = "Shipped";

                    if (response.data.cancelled) {
                        type = "success";
                        msg = `Order Number: ${this.state.badAddress.order_number} ${response.data.cancelled} Successfully!`;
                        dropdownStatus = response.data.cancelled;
                    } else {
                        type = "error";
                        msg = "All Orders for Cancel Order Failed";
                    }

                    let dropdownCancelled = {
                        target: {
                            value: dropdownStatus,
                        },
                    };

                    this.getData({
                        page: 1,
                        statusfilter: dropdownStatus,
                    });
                    this.handleChangeFilter(dropdownCancelled);
                    this.setState({
                        openEditAddressModal: false,
                        global_msg: {
                            type: type,
                            message: msg,
                        },
                    });
                });
        }
    };

    handleChangePerPage = (event) => {
        this.setState({
            perpage: event.target.value,
            pagesize: event.target.value,
            global_msg: { message: "" },
        });
        this.getData({ page: 1, perpage: event.target.value });
    };

    handleChangeFilter = (event) => {
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            statusfilter: event.target.value,
            searchOrders: "",
            start_date: this.state.startdate,
            end_date: this.state.enddate,
        });
        this.setState({
            statusfilter: event.target.value,
            searchOrders: "",
            startdate: null,
            enddate: null,
            global_msg: { message: "" },
        });
    };

    handleChangeDateFilter = (event) => {
        if (event.target.value == "custom") {
            this.setState({ displayDates: "inline-block" });
        } else {
            this.setState({
                displayDates: "none",
                enddate: null,
                startdate: null,
            });
            this.getData({ page: 1, perpage: this.state.perpage });
        }
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
            global_msg: { message: "" },
        });
        this.getData({
            page: 1,
            perpage: this.state.perpage,
            sortname: sorttype,
            sorting: toggleSorting,
        });
        event.preventDefault();
    };

    handleOpenModal = (orderid) => {
        this.setState({ openModal: true, openEditAddressModal: true });
    };

    handleOpenDisableModal = () => {
        this.setState({ disableModal: true });
    };

    handleReloadpage = () => {
        location.reload(true);
    };

    handleCloseModal = () => {
        this.setState({ openModal: false, openEditAddressModal: false });
    };

    assign_storeid = () => {
        axios.get("api/assign_storeid").then((response) => {
            this.setState({ gstoreid: response.data.storeid });
        });
    };

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

        this.setState({ startdate: fdate });
        let sdate = fdate;
        let edate = this.state.enddate;
        const startdateString = sdate; // Your date string in "YYYY-MM-DD" format

        const enddateString = this.state.enddate;
        const end = new Date(startdateString);
        const start = new Date(enddateString);
        let daysRange = this.isDateRangeMoreThan31Days(
            sdate,
            this.state.enddate
        );
        let dateSS = start < end;
        if (dateSS) {
            if (sdate != null && edate != null) {
                this.setState({
                    startdate: null,
                    global_msgnew: {
                        type: "error",
                        message:
                            "End date must be equal or after the Start Date",
                    },
                });
            }
        } else if (daysRange) {
            this.setState({
                startdate: null,
                global_msgnew: {
                    type: "error",
                    message: "Date must be within 31 days or less.",
                },
            });
        } else {
            if (sdate != "" && edate != "") {
                this.getData({
                    page: 1,
                    perpage: this.state.perpage,
                    start_date: sdate,
                    end_date: edate,
                });
                this.setState({
                    global_msgnew: {
                        type: "error",
                        message: "",
                    },
                });
            }
        }
    };

    handleFilterByDate = (event) => {
        this.getData({
            page: this.state.pageV2,
            perpage: this.state.perpage,
        });

        this.setState({
            filterByDate: event.target.value,
            startdate: null,
            enddate: null,
            global_msgnew: {
                type: "error",
                message: "",
            },
        });
    };

    isDateRangeMoreThan31Days = (startDateStr, endDateStr) => {
        // Parse the date strings into Date objects
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        // Calculate the difference in milliseconds
        const timeDifference = endDate - startDate;

        // Convert milliseconds to days
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

        // Compare with 31 days
        return daysDifference > 31;
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

        let daysRange = this.isDateRangeMoreThan31Days(
            this.state.startdate,
            fdate
        );

        const startdateString = this.state.startdate; // Your date string in "YYYY-MM-DD" format

        const enddateString = fdate;
        const end = new Date(startdateString);
        const start = new Date(enddateString);
        this.setState({ enddate: fdate });
        if (start < end) {
            this.setState({
                enddate: null,
                global_msgnew: {
                    message: "End date must be equal or after the Start Date",
                    type: "error",
                },
            });
        } else if (daysRange) {
            this.setState({
                enddate: null,
                global_msgnew: {
                    type: "error",
                    message: "Date range must be 31 days below",
                },
            });
        } else {
            let sdate = this.state.startdate;
            let edate = fdate;
            if (sdate != "" && edate != "") {
                this.getData({
                    page: 1,
                    perpage: this.state.perpage,
                    start_date: sdate,
                    end_date: edate,
                });
            }
            this.setState({
                global_msgnew: {
                    type: "error",
                    message: "",
                },
            });
        }
    };

    handleExportChange = () => {
        const startdateString = this.state.startdate; // Your date string in "YYYY-MM-DD" format

        const enddateString = this.state.enddate;
        const end = new Date(startdateString);
        const start = new Date(enddateString);
        if (
            this.state.startdate == null ||
            this.state.enddate == null ||
            this.state.startdate == "" ||
            this.state.enddate == ""
        ) {
            this.setState({
                global_msgnew: {
                    message: "Start date and End dates are required",
                    type: "error",
                },
                type: "",
            });
        } else if (start < end) {
            this.setState({
                global_msgnew: {
                    message: "End date must be equal or after the Start Date",
                    type: "error",
                },
            });
        } else if (this.state.gridrows.length == 0) {
            this.setState({
                global_msgnew: {
                    message: "There are no records to export",
                    type: "error",
                },
            });
        } else {
            this.getData({
                page: this.state.pageV2,
                perpage: this.state.perpage,
                start_date: this.state.startdate,
                end_date: this.state.enddate,
                export: "export",
            });
        }
    };

    render() {
        const mdTheme = createTheme();
        const fullWidth = true;
        const maxWidth = "md";

        const renderOptions = (props, option) => {
            const { value, label } = option;
            return (
                <MenuItem {...props} key={value} value={value}>
                    {label}
                </MenuItem>
            );
        };

        const modalContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box component={"form"}>
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
                    <DialogContent className="proddetail_contents">
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Client Order Item
                        </Typography>
                        {this.state.order_item.map((item, index) => (
                            <fieldset
                                key={item.OrderItemID}
                                style={{
                                    border: "1px solid gray",
                                    margin: "10px",
                                    padding: "10px",
                                }}
                            >
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id={`OrderNumber_${item.OrderItemID}`}
                                    name="OrderNumber"
                                    label={`Order Number (${index + 1})`}
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                    disabled
                                    defaultValue={item.ordernumber}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id={`SKU_${item.OrderItemID}`}
                                    name="title"
                                    label="ITEM TITLE"
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                    disabled
                                    defaultValue={item.ProductName}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id={`SKU_${item.OrderItemID}`}
                                    name="SKU"
                                    label="ITEM SKU"
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                    disabled
                                    defaultValue={item.SKU}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id={`Quantity_${item.OrderItemID}`}
                                    name="Quantity"
                                    label="Quantity"
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                    disabled
                                    defaultValue={parseFloat(
                                        item.Quantity
                                    ).toFixed(0)}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id={`TotalWeight_${item.OrderItemID}`}
                                    name="TotalWeight"
                                    label="Item Weight (oz)"
                                    fullWidth
                                    rows={4}
                                    variant="standard"
                                    disabled
                                    defaultValue={parseFloat(
                                        item.TotalWeight * 16
                                    ).toFixed(2)}
                                />
                            </fieldset>
                        ))}
                        <div className="form_btns">
                            <Button
                                type={"button"}
                                autoFocus
                                color="inherit"
                                onClick={this.handleCloseModal}
                            >
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        const modalEditAddressContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openEditAddressModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="editAddressForm"
                    component={"form"}
                    onSubmit={this.handleEditAddressSubmit}
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
                            Edit Address
                            {this.state.form_message != "" && (
                                <Alert severity="error">
                                    {this.state.form_message}
                                </Alert>
                            )}
                        </Typography>
                        <Box sx={{ ml: 1, flex: 1 }}>
                            <div style={{ marginBottom: "25px" }}>
                                <div style={{ fontWeight: "bold" }}>
                                    Address Validation:
                                </div>
                                {this.state.badAddress.address_validation}
                            </div>
                            <div style={{ marginBottom: "25px" }}>
                                <span style={{ fontWeight: "bold" }}>
                                    Order Number:
                                </span>
                                {this.state.badAddress.order_number}
                            </div>
                            <div style={{ marginBottom: "25px" }}>
                                <InputLabel>Country</InputLabel>
                                <Autocomplete
                                    disablePortal
                                    id="country"
                                    name="country"
                                    style={{ height: "auto" }}
                                    options={this.state.countriesoptions}
                                    getOptionLabel={(option) => option.label}
                                    isOptionEqualToValue={(option, value) =>
                                        option.value === value.value
                                    }
                                    className="table-filters filter_selects"
                                    fullWidth
                                    renderOption={renderOptions}
                                    defaultValue={this.state.badAddress.country}
                                    onChange={this.handleSelectedCountry}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Type to select."
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </div>

                            <div style={{ marginBottom: "25px" }}>
                                <InputLabel>State</InputLabel>
                                {this.state.badAddress.country.value == "US" ||
                                this.state.showDropdownUS == true ? (
                                    <Autocomplete
                                        disablePortal
                                        id="state"
                                        name="state"
                                        style={{ height: "auto" }}
                                        options={this.state.statesoptions}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            option.value === value.value
                                        }
                                        className="table-filters filter_selects"
                                        fullWidth
                                        renderOption={renderOptions}
                                        defaultValue={
                                            this.state.badAddress.state
                                        }
                                        onChange={this.handleSelectedState}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Type to select."
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                ) : (
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="stateText"
                                        name="stateText"
                                        defaultValue={
                                            this.state.badAddress.state.value
                                        }
                                        fullWidth
                                        type="text"
                                        variant="standard"
                                    />
                                )}
                            </div>

                            <div style={{ marginBottom: "25px" }}>
                                <InputLabel>City</InputLabel>
                                {this.state.badAddress.country.value == "US" ||
                                this.state.showDropdownUS == true ? (
                                    <Autocomplete
                                        disablePortal
                                        id="city"
                                        name="city"
                                        style={{ height: "auto" }}
                                        options={this.state.citiesoptions}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            option.value === value.value
                                        }
                                        className="table-filters filter_selects"
                                        fullWidth
                                        renderOption={renderOptions}
                                        defaultValue={
                                            this.state.badAddress.city
                                        }
                                        onChange={this.handleSelectedCity}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Type to select."
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                ) : (
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="cityText"
                                        name="cityText"
                                        defaultValue={
                                            this.state.badAddress.city.value
                                        }
                                        fullWidth
                                        type="text"
                                        variant="standard"
                                    />
                                )}
                            </div>

                            <TextField
                                autoFocus
                                margin="dense"
                                id="street1"
                                name="street1"
                                label="Street 1"
                                defaultValue={this.state.badAddress.street1}
                                fullWidth
                                type="text"
                                variant="standard"
                            />

                            <TextField
                                autoFocus
                                margin="dense"
                                id="street2"
                                name="street2"
                                label="Street 2"
                                defaultValue={this.state.badAddress.street2}
                                fullWidth
                                type="text"
                                variant="standard"
                            />

                            <TextField
                                autoFocus
                                margin="dense"
                                id="street3"
                                name="street3"
                                label="Street 3"
                                defaultValue={this.state.badAddress.street3}
                                fullWidth
                                type="text"
                                variant="standard"
                            />

                            <TextField
                                autoFocus
                                margin="dense"
                                id="postal_code"
                                name="postal_code"
                                defaultValue={this.state.badAddress.postal_code}
                                label="Postal Code"
                                fullWidth
                                type="text"
                                variant="standard"
                            />
                        </Box>
                        <div className="form_btns">
                            <Button
                                type={"button"}
                                style={{
                                    color: "#fff",
                                    background:
                                        "linear-gradient(135deg, rgb(255 0 40) 0%, rgb(208 0 0 / 99%) 100%)",
                                    whiteSpace: "nowrap",
                                    width: "150px",
                                }}
                                autoFocus
                                color="inherit"
                                onClick={this.handleCancelByClient}
                            >
                                Cancel Order
                            </Button>
                            <Button
                                type={"button"}
                                style={{
                                    color: "#fff",
                                    background:
                                        "linear-gradient(135deg, #449248 0%, #26a22cfc 100%)",
                                    whiteSpace: "nowrap",
                                    width: "150px",
                                }}
                                autoFocus
                                color="inherit"
                                onClick={this.handleForcePrint}
                            >
                                Force Print
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
                            <Button
                                type={"button"}
                                autoFocus
                                color="inherit"
                                onClick={this.handleCloseModal}
                            >
                                Exit
                            </Button>
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        let showbtns = true;
        let showstatuslbl;
        if (this.state.cancelledbtn == 1) {
            showbtns = false;
            showstatuslbl = (
                <Alert style={{ marginBottom: "20px" }} severity="error">
                    Order Cancelled
                </Alert>
            );
        } else if (this.state.printedbtn == 1) {
            showbtns = false;
            showstatuslbl = (
                <Alert style={{ marginBottom: "20px" }} severity="success">
                    Order Printed
                </Alert>
            );
        }

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
                            <Grid container spacing={5}>
                                <Grid item xs={12}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                        className="table_grid"
                                    >
                                        <div className="table_filter_options">
                                            <div
                                                style={{
                                                    display: "inline-block",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        paddingTop: "10px",
                                                        paddingRight: "16px",
                                                    }}
                                                >
                                                    <Select
                                                        value={
                                                            this.state.perpage
                                                        }
                                                        onChange={
                                                            this
                                                                .handleChangePerPage
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
                                                        style={{
                                                            width: "204px",
                                                        }}
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
                                                    {this.state.statusoptions
                                                        .length > 0 ? (
                                                        <Select
                                                            style={{
                                                                width: "150px",
                                                            }}
                                                            value={
                                                                this.state
                                                                    .statusfilter
                                                            }
                                                            onChange={
                                                                this
                                                                    .handleChangeFilter
                                                            }
                                                            displayEmpty
                                                            inputProps={{
                                                                "aria-label":
                                                                    "Without label",
                                                            }}
                                                            className="mx-1 table-filters filter_selects"
                                                            IconComponent={
                                                                KeyboardArrowDownIcon
                                                            }
                                                        >
                                                            {this.state.statusoptions.map(
                                                                (row) => (
                                                                    <MenuItem
                                                                        key={
                                                                            row.localstatus
                                                                        }
                                                                        value={
                                                                            row.localstatus
                                                                        }
                                                                    >
                                                                        {
                                                                            row.localstatus
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    ) : null}

                                                    <TextField
                                                        label="Search Orders..."
                                                        value={
                                                            this.state
                                                                .searchOrders
                                                        }
                                                        onChange={
                                                            this
                                                                .handleSearchChange
                                                        }
                                                        type="search"
                                                        variant="standard"
                                                        style={{
                                                            marginTop: "-1%",
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className="table_filter_options"
                                                    style={{ display: "block" }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <Select
                                                            value={
                                                                this.state
                                                                    .filterByDate
                                                            }
                                                            onChange={
                                                                this
                                                                    .handleFilterByDate
                                                            }
                                                            displayEmpty
                                                            inputProps={{
                                                                "aria-label":
                                                                    "Without label",
                                                            }}
                                                            className="table-filters filter_selects"
                                                        >
                                                            <MenuItem
                                                                value={
                                                                    "Order Date"
                                                                }
                                                            >
                                                                Filter By: Order
                                                                date
                                                            </MenuItem>
                                                            <MenuItem
                                                                value={
                                                                    "Shipped Date"
                                                                }
                                                            >
                                                                Filter By:
                                                                Shipped Date
                                                            </MenuItem>
                                                        </Select>
                                                        <LocalizationProvider
                                                            dateAdapter={
                                                                AdapterDayjs
                                                            }
                                                        >
                                                            <DesktopDatePicker
                                                                label="Start Date"
                                                                inputFormat="YYYY-MM-DD"
                                                                value={
                                                                    this.state
                                                                        .startdate
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
                                                                        style={{
                                                                            width: "150px",
                                                                        }}
                                                                        {...params}
                                                                    />
                                                                )}
                                                            />
                                                            <DesktopDatePicker
                                                                label="End Date"
                                                                inputFormat="YYYY-MM-DD"
                                                                value={
                                                                    this.state
                                                                        .enddate
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
                                                                        style={{
                                                                            width: "150px",
                                                                        }}
                                                                        {...params}
                                                                    />
                                                                )}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outlined"
                                                                onClick={
                                                                    this
                                                                        .handleExportChange
                                                                }
                                                                className="export_button addbtn"
                                                                disabled={
                                                                    this.state
                                                                        .global_msgnew
                                                                        .message !=
                                                                    ""
                                                                }
                                                            >
                                                                {}
                                                                <span
                                                                    style={{
                                                                        color:
                                                                            this
                                                                                .state
                                                                                .global_msgnew
                                                                                .message !=
                                                                            ""
                                                                                ? "#737373"
                                                                                : "",
                                                                    }}
                                                                >
                                                                    Export CSV
                                                                </span>
                                                            </Button>

                                                            <CSVLink
                                                                headers={
                                                                    this.state
                                                                        .gridcolumnsCSV
                                                                }
                                                                data={
                                                                    this.state
                                                                        .gridrowsCSVCSV
                                                                }
                                                                style={{
                                                                    display:
                                                                        "none",
                                                                }}
                                                                className="csv-link-latest"
                                                                filename={`allOrders-${new Date().toISOString()}.csv`}
                                                                ref={
                                                                    this
                                                                        .csvLinkRef
                                                                }
                                                            >
                                                                Export CSV
                                                            </CSVLink>
                                                        </LocalizationProvider>
                                                    </div>
                                                    {this.state.global_msgnew
                                                        .message != "" ? (
                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "10px",
                                                            }}
                                                        >
                                                            <Alert
                                                                severity={
                                                                    this.state
                                                                        .global_msgnew
                                                                        .type
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .global_msgnew
                                                                        .message
                                                                }
                                                            </Alert>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        {this.state.global_msg.message !=
                                            "" && (
                                            <Alert
                                                style={{ margin: "20px 0" }}
                                                severity={
                                                    this.state.global_msg.type
                                                }
                                            >
                                                {this.state.global_msg.message}
                                            </Alert>
                                        )}
                                        {this.state.statusfilter ==
                                            "Bad Address" ||
                                        this.state.statusfilter ==
                                            "Awaiting Shipment" ||
                                        this.state.statusfilter ==
                                            "Backordered" ||
                                        this.state.statusfilter
                                            .toLowerCase()
                                            .includes("hold") ? (
                                            <Typography
                                                style={{
                                                    color: "red",
                                                    marginTop: "10px",
                                                    marginBottom: "-10px",
                                                    zIndex: "999",
                                                }}
                                            >
                                                <small>
                                                    <i>
                                                        To edit the address,
                                                        cancel print or
                                                        forceprint, click the
                                                        Local Status
                                                    </i>
                                                </small>
                                            </Typography>
                                        ) : null}
                                        <Box className="data_grid_container">
                                            <DataGridPremium
                                                rows={this.state.gridrows}
                                                columns={this.state.gridcolumns}
                                                pageSize={this.state.pagesize}
                                                rowsPerPageOptions={[
                                                    this.state.pagesize,
                                                ]}
                                                loading={this.state.gridloading}
                                                pagination
                                                components={{
                                                    Footer: CustomFooter,
                                                }}
                                            />
                                            <div className="datagrid_pagination_bg"></div>
                                            <div style={{ marginBottom: "4%" }}>
                                                <div
                                                    style={{
                                                        float: "right",
                                                        marginTop: "-1%",
                                                        marginRight: "3%",
                                                    }}
                                                >
                                                    {/* <b>
                                                        Total:{" "}
                                                        {this.state.totalV2}
                                                    </b> */}
                                                </div>
                                            </div>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <div
                                style={{ marginBottom: "4%", marginLeft: "5%" }}
                            >
                                <PaginationComponent
                                    states={this.state}
                                    onPageChange={this.handlePageChange}
                                />
                            </div>
                        </Container>
                    </Box>
                </Box>
                {modalContainer}
                {modalEditAddressContainer}
            </ThemeProvider>
        );
    }
}

export default Orders;
