import React, { Component } from "react";
import { styled } from "@mui/material/styles";
import {
    Container,
    Grid,
    Paper,
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Button,
} from "@mui/material";
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    AreaElement,
    Legend,
    Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import LinearProgress, {
    linearProgressClasses,
} from "@mui/material/LinearProgress";
import Title from "./Common/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { height } from "@mui/system";
import { Link } from "react-router-dom";

class Blocks extends Component {
    constructor(props) {
        super(props);

        ChartJS.register(
            LinearScale,
            CategoryScale,
            BarElement,
            PointElement,
            LineElement,
            Legend,
            Tooltip
        );

        // Assign labels
        const date = new Date();

        let labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const linedata = labels.map(() => Math.floor(Math.random() * 10000));
        const bardata = labels.map(() => Math.floor(Math.random() * 10000));
        const areadata = labels.map(() => Math.floor(Math.random() * 10000));

        const chartdata = {
            labels,
            datasets: [
                {
                    type: "line",
                    label: "Dataset 1",
                    borderColor: "#E97841",
                    fill: false,
                    data: linedata,
                    lineTension: 0.4,
                },
                // ,
                // {
                //   type: 'line',
                //   label: 'Dataset 2',
                //   backgroundColor: 'rgba(75, 192, 192, 0.5)',
                //   borderColor: 'rgb(75, 192, 192)',
                //   fill: true,
                //   data: bardata,
                // },
                // {
                //   type: 'line',
                //   label: 'Dataset 3',
                //   borderColor: 'rgb(53, 162, 235)',
                //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
                //   fill: true,
                //   data: areadata,
                // }
            ],
        };
        const chartoptions = {
            plugins: {
                legend: {
                    display: false,
                },
            },
            maintainAspectRatio: false,
        };
        this.state = {
            blockavailable: true,
            openorders: "30days",
            held: "30days",
            delayed: "30days",
            returns: "",
            shippedFilterDate: "",
            intransit: "30days",
            receiving: "30days",
            nostock: 30,
            cdata: chartdata,
            coptions: chartoptions,
            heldcount: 0,
            openorderscount: 0,
            returnscount: 0,
            delayedcount: 0,
            intransitcount: 0,
            receivecounts: 0,
            nostockscounts: 0,
            lowstockscounts: 0,
            company: "",
            mode: "",
            allOrderStatuses: {
                shipped: 0,
                postalHold: 0,
                holdBrazilCPF: 0,
                awaitingShipments: 0,
                delayed: 0,
            },
            unpaidinvoices: {
                unpaid: 0,
                overdue: 0,
                overduepercentage: 0,
                open: 0,
                openpercentage: 0,
            },
            paidinvoices: {
                paid: 0,
                deposited: 0,
                depositpercentage: 0,
                undeposited: 0,
                undepositpercentage: 0,
            },
            blocks: {
                invoice: "none",
                storage_cost: "none",
                storage_calculator: "none",
                held: "none",
                openorders: "none",
                delayed: "none",
                return: "none",
                intransit: "none",
                receiving: "none",
                low_stock: "none",
                no_stock: "none",
            },
            lowstock: 30,
        };
    }

    handleHeldChange = (event) => {
        this.setState({ held: event.target.value });
        axios
            .get("api/heldCount?datefilter=" + event.target.value)
            .then((response) => {
                this.setState({ heldcount: response.data.ordercount });
            });

        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        let filterAppState = {
            openorders: FilterAppState.openorders,
            held: event.target.value,
            delayed: FilterAppState.delayed,
            returns: FilterAppState.returns,
            intransit: FilterAppState.intransit,
            receiving: FilterAppState.receiving,
            nostock: FilterAppState.nostock,
        };
        localStorage["blocksFilter"] = JSON.stringify(filterAppState);
    };
    handleOpenOrdersChange = (event) => {
        this.setState({ openorders: event.target.value });
        axios
            .get("api/openordersCount?datefilter=" + event.target.value)
            .then((response) => {
                this.setState({ openorderscount: response.data.ordercount });
            });

        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        let filterAppState = {
            openorders: event.target.value,
            held: FilterAppState.held,
            delayed: FilterAppState.delayed,
            returns: FilterAppState.returns,
            intransit: FilterAppState.intransit,
            receiving: FilterAppState.receiving,
            nostock: FilterAppState.nostock,
        };
        localStorage["blocksFilter"] = JSON.stringify(filterAppState);
    };
    handleReturnChange = (event) => {
        this.setState({ returns: event.target.value });
        axios
            .get("api/returnCount?datefilter=" + event.target.value)
            .then((response) => {
                this.setState({ returnscount: response.data.ordercount });
            });

        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        let filterAppState = {
            openorders: FilterAppState.openorders,
            // held: FilterAppState.held,
            delayed: FilterAppState.delayed,
            returns: event.target.value,
            intransit: FilterAppState.intransit,
            receiving: FilterAppState.receiving,
            nostock: FilterAppState.nostock,
        };
        localStorage["blocksFilter"] = JSON.stringify(filterAppState);
    };

    handleStatusAllOrderChange = (event) => {
        this.setState({ shippedFilterDate: event.target.value });
        axios
            .get("api/shippedFilter?datefilter=" + event.target.value)
            .then((response) => {
                this.setState({
                    allOrderStatuses: {
                        ...this.state.allOrderStatuses,
                        shipped: response.data.shipped,
                    },
                });
            });

        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        let filterAppState = {
            openorders: FilterAppState.openorders,
            // held: FilterAppState.held,
            delayed: FilterAppState.delayed,
            returns: event.target.value,
            intransit: FilterAppState.intransit,
            receiving: FilterAppState.receiving,
            nostock: FilterAppState.nostock,
        };
        localStorage["blocksFilter"] = JSON.stringify(filterAppState);
    };

    handleDelayedChange = (event) => {
        this.setState({ delayed: event.target.value });
        axios
            .get("api/delayedCount?datefilter=" + event.target.value)
            .then((response) => {
                this.setState({ delayedcount: response.data.ordercount });
            });

        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        let filterAppState = {
            openorders: FilterAppState.openorders,
            // held: FilterAppState.held,
            delayed: event.target.value,
            returns: FilterAppState.returns,
            intransit: FilterAppState.intransit,
            receiving: FilterAppState.receiving,
            nostock: FilterAppState.nostock,
        };
        localStorage["blocksFilter"] = JSON.stringify(filterAppState);
    };
    handleIntransitChange = (event) => {
        this.setState({ intransit: event.target.value });
        axios
            .get("api/intransitCount?datefilter=" + event.target.value)
            .then((response) => {
                this.setState({ intransitcount: response.data.ordercount });
            });

        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        let filterAppState = {
            openorders: FilterAppState.openorders,
            // held: FilterAppState.held,
            delayed: FilterAppState.delayed,
            returns: FilterAppState.returns,
            intransit: event.target.value,
            receiving: FilterAppState.receiving,
            nostock: FilterAppState.nostock,
        };
        localStorage["blocksFilter"] = JSON.stringify(filterAppState);
    };
    handleReceiveChange = (event) => {
        this.setState({ receiving: event.target.value });
        axios
            .get("api/receivingcounts?receivecount=" + event.target.value)
            .then((response) => {
                this.setState({ receivecounts: response.data.countreceive });
            });

        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        let filterAppState = {
            openorders: FilterAppState.openorders,
            // held: FilterAppState.held,
            delayed: FilterAppState.delayed,
            returns: FilterAppState.returns,
            intransit: FilterAppState.intransit,
            receiving: event.target.value,
            nostock: FilterAppState.nostock,
        };
        localStorage["blocksFilter"] = JSON.stringify(filterAppState);
    };
    handleNoStockChange = (event) => {
        this.setState({ nostock: event.target.value });
        axios
            .get("api/nostockcount?nostockrange=" + event.target.value)
            .then((response) => {
                this.setState({ nostockscounts: response.data.countnostock });
            });

        let localFilterState = localStorage["blocksFilter"];
        let FilterAppState = JSON.parse(localFilterState);
        let filterAppState = {
            openorders: FilterAppState.openorders,
            // held: FilterAppState.held,
            delayed: FilterAppState.delayed,
            returns: FilterAppState.returns,
            intransit: FilterAppState.intransit,
            receiving: FilterAppState.receiving,
            nostock: event.target.value,
        };
        localStorage["blocksFilter"] = JSON.stringify(filterAppState);
    };
    handleLowStockChange = (event) => {
        this.setState({ lowstock: event.target.value });
        axios
            .get("api/lowstockcount?lowstockrange=" + event.target.value)
            .then((response) => {
                this.setState({ lowstock: response.data.countlowstock });
            });
    };

    componentDidMount() {
        axios.get("api/getsysteminformation").then((response) => {
            this.setState({
                company: response.data.store,
                mode: response.data.mode,
            });
        });
        let filterAppState = {
            openorders: this.state.openorders,
            // held: this.state.held,
            delayed: this.state.delayed,
            returns: this.state.returns,
            intransit: this.state.intransit,
            receiving: this.state.receiving,
            nostock: this.state.nostock,
        };
        localStorage["blocksFilter"] = JSON.stringify(filterAppState);

        axios.get("api/allOrderStatusCount").then((response) => {
            this.setState({
                allOrderStatuses: {
                    shipped: response.data.shipped,
                    postalHold: response.data.postalHold,
                    holdBrazilCPF: response.data.holdBrazilCPF,
                    awaitingShipments: response.data.awaitingShipments,
                    delayed: response.data.delayed,
                },
            });
        });

        axios.get("api/customerblocks").then((response) => {
            this.setState({
                blocks: {
                    invoice: response.data.invoice,
                    storage_cost: response.data.storage_cost,
                    storage_calculator: response.data.storage_calculator,
                    held: response.data.held,
                    delayed: response.data.delayed,
                    return: response.data.return,
                    receiving: response.data.receiving,
                    low_stock: response.data.low_stock,
                    no_stock: response.data.no_stock,
                    intransit: response.data.intransit,
                    openorders: response.data.openorders,
                },
            });
        });
        axios.get("api/quickbooks-account").then((response) => {
            this.setState({
                unpaidinvoices: {
                    unpaid: response.data.unpaidinvoices.unpaid,
                    overdue: response.data.unpaidinvoices.overdue,
                    overduepercentage:
                        response.data.unpaidinvoices.overduepercentage,
                    open: response.data.unpaidinvoices.open,
                    openpercentage: response.data.unpaidinvoices.openpercentage,
                },
                paidinvoices: {
                    paid: response.data.paidinvoices.paid,
                    deposited: response.data.paidinvoices.deposited,
                    depositpercentage:
                        response.data.paidinvoices.depositpercentage,
                    undeposited: response.data.paidinvoices.undeposited,
                    undepositpercentage:
                        response.data.paidinvoices.undepositpercentage,
                },
            });
        });
        // axios.get('api/orderCount').then(response => {
        //     this.setState({countorders:response.data.ordercount, returnscount:response.data.returnscount});
        // });
        // axios.get('api/heldCount').then(response => {
        //     this.setState({heldcount:response.data.ordercount});
        // });
        axios.get("api/openordersCount").then((response) => {
            this.setState({ openorderscount: response.data.ordercount });
        });
        axios.get("api/returnCount").then((response) => {
            this.setState({ returnscount: response.data.ordercount });
        });
        axios.get("api/intransitCount").then((response) => {
            this.setState({ intransitcount: response.data.ordercount });
        });
        axios.get("api/delayedCount").then((response) => {
            this.setState({ delayedcount: response.data.ordercount });
        });
        axios.get("api/receivingcounts").then((response) => {
            this.setState({ receivecounts: response.data.countreceive });
        });
        axios.get("api/nostockcount").then((response) => {
            this.setState({ nostockscounts: response.data.countnostock });
        });

        let localState = localStorage["appState"];
        let AppState = JSON.parse(localState);
        if (AppState.country == "UK") {
            this.setState({ blockavailable: false });
        }
    }

    render() {
        const BorderLinearProgressUnpaid = styled(LinearProgress)(
            ({ theme }) => ({
                height: 15,
                borderRadius: 5,
                [`&.${linearProgressClasses.colorPrimary}`]: {
                    backgroundColor:
                        theme.palette.grey[
                            theme.palette.mode === "light" ? 200 : 800
                        ],
                },
                [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor:
                        theme.palette.mode === "light" ? "#E97841" : "#F2F2F2",
                },
            })
        );

        const BorderLinearProgressPaid = styled(LinearProgress)(
            ({ theme }) => ({
                height: 15,
                borderRadius: 5,
                [`&.${linearProgressClasses.colorPrimary}`]: {
                    backgroundColor:
                        theme.palette.grey[
                            theme.palette.mode === "light" ? 200 : 800
                        ],
                },
                [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    backgroundColor:
                        theme.palette.mode === "light" ? "#507150" : "#F2F2F2",
                },
            })
        );

        let intransitblock = (
            <CardContent className="main-card-content">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h5"
                        component="div"
                        className="main-card-title fixheight_20"
                    >
                        In-Transit
                    </Typography>
                </div>
                <Typography
                    variant="h6"
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    className="text--center"
                    style={{
                        color: "#367482",
                        fontSize: "50px",
                        paddingTop: "40px",
                    }}
                >
                    Coming soon
                </Typography>
            </CardContent>
        );

        let delayedblock = (
            <CardContent className="main-card-content">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h5"
                        component="div"
                        className="main-card-title fixheight_20"
                    >
                        Delayed
                    </Typography>
                </div>
                <Typography
                    variant="h6"
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    className="text--center"
                    style={{
                        color: "#367482",
                        fontSize: "50px",
                        paddingTop: "40px",
                    }}
                >
                    Coming soon
                </Typography>
            </CardContent>
        );
        if (this.state.blockavailable) {
            delayedblock = (
                <CardContent className="main-card-content order_blocks">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            className="main-card-title fixheight_20"
                        >
                            Delayed
                        </Typography>

                        <Select
                            value={this.state.delayed}
                            onChange={this.handleDelayedChange}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            className="filter-by"
                            IconComponent={KeyboardArrowDownIcon}
                        >
                            <MenuItem value="thisweek">
                                <em style={{ fontStyle: "normal" }}>
                                    This Week
                                </em>
                            </MenuItem>
                            <MenuItem value={"thismonth"}>This Month</MenuItem>
                            <MenuItem value={"7days"}>Last 7 Days</MenuItem>
                            <MenuItem value={"30days"}>Last 30 Days</MenuItem>
                            <MenuItem value={"lastmonth"}>Last month</MenuItem>
                            <MenuItem value={"thisquarter"}>
                                This quarter
                            </MenuItem>
                            <MenuItem value={"lastquarter"}>
                                Last quarter
                            </MenuItem>
                            <MenuItem value={"last12months"}>
                                Last 12 Months
                            </MenuItem>
                        </Select>
                    </div>
                    <Typography
                        variant="h6"
                        sx={{ mb: 1.5 }}
                        color="text.secondary"
                        className="card-total text--center"
                        style={{ color: "#367482" }}
                    >
                        <Link
                            to={"delayed-orders"}
                            style={{ color: "#367482" }}
                        >
                            {this.state.delayedcount}
                        </Link>
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "#000000" }}
                        className="content-details text--center"
                    >
                        Total Delayed Orders
                    </Typography>
                </CardContent>
            );
        }

        let returnsblock = (
            <CardContent className="main-card-content">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h5"
                        component="div"
                        className="main-card-title fixheight_20"
                    >
                        Returns
                    </Typography>
                </div>
                <Typography
                    variant="h6"
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    className="text--center"
                    style={{
                        color: "#E97841",
                        fontSize: "50px",
                        paddingTop: "40px",
                    }}
                >
                    Upcoming.....
                </Typography>
            </CardContent>
        );
        let holdBrazilCPF;
        if (this.state.company == "The Conqueror") {
            holdBrazilCPF = (
                <CardContent className="main-card-content order_blocks">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            className="main-card-title"
                        >
                            Hold Brazil CPF
                        </Typography>
                    </div>

                    <Typography
                        variant="h6"
                        sx={{ mb: 1.5 }}
                        color="text.secondary"
                        className="card-total text--center"
                        style={{ color: "#E97841" }}
                    >
                        <Link
                            to={"all-orders?statusFilter=Hold Brazil CPF"}
                            style={{ color: "#E97841" }}
                        >
                            {this.state.allOrderStatuses.holdBrazilCPF}
                        </Link>
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "#000000" }}
                        className="content-details text--center"
                    >
                        Total Hold Brazil CPF
                    </Typography>
                </CardContent>
            );
        }

        let postalHold;
        if (this.state.blockavailable) {
            postalHold = (
                <CardContent className="main-card-content order_blocks">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            className="main-card-title"
                        >
                            Postal Hold
                        </Typography>
                    </div>

                    <Typography
                        variant="h6"
                        sx={{ mb: 1.5 }}
                        color="text.secondary"
                        className="card-total text--center"
                        style={{ color: "#E97841" }}
                    >
                        <Link
                            to={"all-orders?statusFilter=Postal Hold"}
                            style={{ color: "#E97841" }}
                        >
                            {this.state.allOrderStatuses.postalHold}
                        </Link>
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "#000000" }}
                        className="content-details text--center"
                    >
                        Total Postal Hold
                    </Typography>
                </CardContent>
            );
        }

        let shippedBlock;
        if (this.state.blockavailable) {
            shippedBlock = (
                <CardContent className="main-card-content order_blocks">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            className="main-card-title"
                        >
                            Shipped
                        </Typography>

                        <Select
                            value={this.state.shippedFilterDate}
                            onChange={(e) => {
                                this.handleStatusAllOrderChange(e);
                            }}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            className="filter-by"
                            IconComponent={KeyboardArrowDownIcon}
                        >
                            <MenuItem value={""}>Today</MenuItem>
                            <MenuItem value={"7"}>Last 7 Days</MenuItem>
                            <MenuItem value={"30"}>Last 30 Days</MenuItem>
                            <MenuItem value={"90"}>Last quarter</MenuItem>
                            <MenuItem value={"365"}>Last 12 Months</MenuItem>
                        </Select>
                    </div>

                    <Typography
                        variant="h6"
                        sx={{ mb: 1.5 }}
                        color="text.secondary"
                        className="card-total text--center"
                        style={{ color: "#E97841" }}
                    >
                        <Link
                            to={
                                "all-orders?statusFilter=Shipped&&shippedFilterDate=" +
                                (this.state.shippedFilterDate == ""
                                    ? "Today"
                                    : this.state.shippedFilterDate)
                            }
                            style={{ color: "#E97841" }}
                        >
                            {this.state.allOrderStatuses.shipped}
                        </Link>
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "#000000" }}
                        className="content-details text--center"
                    >
                        Total Shipped
                    </Typography>
                </CardContent>
            );
        }

        let awaitingShipments;
        if (this.state.blockavailable) {
            awaitingShipments = (
                <CardContent className="main-card-content order_blocks">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            className="main-card-title"
                        >
                            Awaiting Shipments
                        </Typography>
                    </div>

                    <Typography
                        variant="h6"
                        sx={{ mb: 1.5 }}
                        color="text.secondary"
                        className="card-total text--center"
                        style={{ color: "#E97841" }}
                    >
                        <Link
                            to={"all-orders?statusFilter=Awaiting Shipment"}
                            style={{ color: "#E97841" }}
                        >
                            {this.state.allOrderStatuses.awaitingShipments}
                        </Link>
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "#000000" }}
                        className="content-details text--center"
                    >
                        Total Awaiting Shipments
                    </Typography>
                </CardContent>
            );
        }

        let delayed;
        if (this.state.blockavailable) {
            delayed = (
                <CardContent className="main-card-content order_blocks">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            className="main-card-title"
                        >
                            Delayed
                        </Typography>
                    </div>

                    <Typography
                        variant="h6"
                        sx={{ mb: 1.5 }}
                        color="text.secondary"
                        className="card-total text--center"
                        style={{ color: "#E97841" }}
                    >
                        <Link
                            to={"all-orders?statusFilter=Delayed"}
                            style={{ color: "#E97841" }}
                        >
                            {this.state.allOrderStatuses.delayed}
                        </Link>
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "#000000" }}
                        className="content-details text--center"
                    >
                        Total USPS Delayed Shipment
                    </Typography>
                </CardContent>
            );
        }

        if (this.state.blockavailable) {
            returnsblock = (
                <CardContent className="main-card-content order_blocks">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            className="main-card-title"
                        >
                            Returns
                        </Typography>

                        {/* <Select
                            value={this.state.returns}
                            onChange={this.handleReturnChange}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            className="filter-by"
                            IconComponent={KeyboardArrowDownIcon}
                        >
                            <MenuItem value="thisweek">
                                <em style={{ fontStyle: "normal" }}>
                                    This Week
                                </em>
                            </MenuItem>
                            <MenuItem value={"thismonth"}>This Month</MenuItem>
                            <MenuItem value={"7days"}>Last 7 Days</MenuItem>
                            <MenuItem value={"30days"}>Last 30 Days</MenuItem>
                            <MenuItem value={"lastmonth"}>Last month</MenuItem>
                            <MenuItem value={"thisquarter"}>
                                This quarter
                            </MenuItem>
                            <MenuItem value={"lastquarter"}>
                                Last quarter
                            </MenuItem>
                            <MenuItem value={"last12months"}>
                                Last 12 Months
                            </MenuItem>
                        </Select> */}
                    </div>

                    <Typography
                        variant="h6"
                        sx={{ mb: 1.5 }}
                        color="text.secondary"
                        className="card-total text--center"
                        style={{ color: "#E97841" }}
                    >
                        <Link to={null} style={{ color: "#E97841" }}>
                            ---
                        </Link>
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "#000000" }}
                        className="content-details text--center"
                    >
                        Upcoming...
                    </Typography>
                </CardContent>
            );
        }

        return (
          <Grid className="dashboard_home_container">
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              className="custom-maxwidth"
            >
              {/* Invoices */}

              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{ display: this.state.blocks.invoice }}
              >
                <Link to="/invoicing" style={{ textDecoration: "none" }}>
                  <Card className="main-card">
                    <CardContent className="main-card-content">
                      <Typography
                        variant="h5"
                        component="div"
                        className="main-card-title"
                      >
                        Invoices
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ mb: 1.5 }}
                        className="text--center block_invoice_count"
                      >
                        <span>$</span>
                        {this.state.unpaidinvoices.overdue}
                      </Typography>
                      <Typography
                        variant="p"
                        component="div"
                        className="text--center block_invoice_text"
                      >
                        Open Balance
                      </Typography>
                      <div style={{ marginTop: "27px" }}>
                        <BorderLinearProgressUnpaid
                          className="invoice_progressbar"
                          variant="determinate"
                          value={this.state.unpaidinvoices.overduepercentage}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>

              {/* Storage Cost */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{ display: this.state.blocks.storage_cost }}
              >
                <Card className="main-card">
                  <CardContent className="main-card-content">
                    <Typography
                      variant="h5"
                      component="div"
                      className="main-card-title"
                    >
                      Storage Cost
                    </Typography>
                    <div className="storagecost_total_cnt">
                      {/* <div className="stc_total">$2,438.10</div>
                                <span className="stc_running_text">Running Total</span> */}
                    </div>
                    <Typography
                      variant="div"
                      component="div"
                      style={{ height: "140px" }}
                    >
                      <Chart
                        type="bar"
                        data={this.state.cdata}
                        options={this.state.coptions}
                        height="140"
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Storage Calculator */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{
                  display: this.state.blocks.storage_calculator,
                }}
              >
                <Card className="main-card">
                  <CardContent className="main-card-content">
                    <Typography
                      variant="h5"
                      component="div"
                      className="main-card-title"
                    >
                      Storage Calculator
                    </Typography>
                    <div className="group_input_calc">
                      <TextField
                        className="width-three-fourth calculator-field margin-right st_calc_from calc_inputs"
                        label="Warehouse"
                        id="warehouse"
                        variant="filled"
                        size="small"
                        value={"New York, United States"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              From
                            </InputAdornment>
                          ),
                        }}
                        focused
                      />
                      <TextField
                        className="width-one-fourth calculator-field calc_inputs"
                        label="Packaging"
                        id="packaging"
                        variant="filled"
                        size="small"
                        focused
                      />
                    </div>
                    <div className="group_input_calc2">
                      <TextField
                        className="width-one-fourth calculator-field margin-right calc_inputs"
                        label="Weight"
                        id="weight"
                        variant="filled"
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">kg</InputAdornment>
                          ),
                        }}
                        focused
                      />
                      <TextField
                        className="width-three-fourth calculator-field calc_inputs stc_total_input"
                        label="Total"
                        id="total"
                        variant="filled"
                        size="small"
                        defaultValue="$74.85"
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              className="estimated-label"
                            >
                              Estimated cost excluding tax fees, custom fee and
                              shipping fee.
                            </InputAdornment>
                          ),
                        }}
                        focused
                      />
                    </div>
                    <Typography
                      variant="p"
                      component="div"
                      className="stc_bottom_text"
                    >
                      Calculate storage cost based on order value or total
                      weight of the item.
                    </Typography>
                    {/* <div style={{ marginTop: '10px' }}>
                                <Button variant="contained" className="primary-button-color">Calculate</Button>
                            </div> */}
                  </CardContent>
                </Card>
              </Grid>
              {/* Held */}
              {/* <Grid item xs={2} sm={4} md={4} style={{ display: this.state.blocks.held }} >
                    <Card className='main-card'>
                        <CardContent className='main-card-content order_blocks'>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" component="div" className='main-card-title'>
                                    Held
                                </Typography>

                                <Select
                                    value={this.state.held}
                                    onChange={this.handleHeldChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className='filter-by'
                                    IconComponent={KeyboardArrowDownIcon}
                                >
                                    <MenuItem value="thisweek">
                                        <em style={{ fontStyle: 'normal' }}>This Week</em>
                                    </MenuItem>
                                    <MenuItem value={'thismonth'}>This Month</MenuItem>
                                    <MenuItem value={'7days'}>Last 7 Days</MenuItem>
                                    <MenuItem value={'30days'}>Last 30 Days</MenuItem>
                                    <MenuItem value={'lastmonth'}>Last month</MenuItem>
                                    <MenuItem value={'thisquarter'}>This quarter</MenuItem>
                                    <MenuItem value={'lastquarter'}>Last quarter</MenuItem>
                                    <MenuItem value={'last12months'}>Last 12 Months</MenuItem>
                                </Select>
                            </div>
                            <Typography variant="h6" sx={{ mb: 1.5 }} className='card-total text--center' style={{ color: '#AA5539' }}>
                                <Link to={'held-orders'} style={{ color: '#AA5539' }}>
                                {this.state.heldcount}
                                </Link>
                            </Typography>
                            <Typography variant="body2" style={{ color: '#000000' }} className="content-details text--center">
                                Total Held Orders
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid> */}
              {/* OpenOrders */}
              {this.state.blockavailable && (
                <Grid
                  item
                  xs={2}
                  sm={4}
                  md={4}
                  style={{ display: this.state.blocks.openorders }}
                >
                  <Card className="main-card">
                    <CardContent className="main-card-content order_blocks">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="div"
                          className="main-card-title"
                        >
                          Bad Address
                        </Typography>
                      </div>
                      <Typography
                        variant="h6"
                        sx={{ mb: 1.5 }}
                        className="card-total text--center"
                        style={{ color: "#AA5539" }}
                      >
                        <Link
                          to={"all-orders?statusFilter=Bad Address"}
                          style={{ color: "#AA5539" }}
                        >
                          {this.state.openorderscount}
                        </Link>
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: "#000000" }}
                        className="content-details text--center"
                      >
                        Total Bad Address
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Shipped */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{
                  display: this.state.blockavailable ? "" : "none",
                }}
              >
                <Card className="main-card">{shippedBlock}</Card>
              </Grid>
              {/* postalHold */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{
                  display: this.state.blockavailable ? "" : "none",
                }}
              >
                <Card className="main-card">{postalHold}</Card>
              </Grid>
              {/* holdBrazilCPF */}
              {this.state.blockavailable &&
               this.state.company == "The Conqueror" ? (
                <Grid
                  item
                  xs={2}
                  sm={4}
                  md={4}
                  style={{
                    display: this.state.blockavailable ? "" : "none",
                  }}
                >
                  <Card className="main-card">{holdBrazilCPF}</Card>
                </Grid>
              ) : null}

              {/* awaitingShipments */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{
                  display: this.state.blockavailable ? "" : "none",
                }}
              >
                <Card className="main-card">{awaitingShipments}</Card>
              </Grid>
              {/* delayed */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{
                  display: this.state.blockavailable ? "" : "none",
                }}
              >
                <Card className="main-card">{delayed}</Card>
              </Grid>

              {/* Returns */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{ display: this.state.blocks.return }}
              >
                <Card className="main-card">{returnsblock}</Card>
              </Grid>
              {/* Receiving */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{ display: this.state.blocks.receiving }}
              >
                <Card className="main-card">
                  <CardContent className="main-card-content order_blocks">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="div"
                        className="main-card-title"
                      >
                        Receiving
                      </Typography>
                      {/* <Select
                                        value={this.state.receiving}
                                        onChange={this.handleReceiveChange}
                                        displayEmpty
                                        inputProps={{
                                            "aria-label": "Without label",
                                        }}
                                        className="filter-by"
                                        IconComponent={KeyboardArrowDownIcon}
                                    >
                                        <MenuItem value="thisweek">
                                            <em style={{ fontStyle: "normal" }}>
                                                This Week
                                            </em>
                                        </MenuItem>
                                        <MenuItem value={"thismonth"}>
                                            This Month
                                        </MenuItem>
                                        <MenuItem value={"7days"}>
                                            Last 7 Days
                                        </MenuItem>
                                        <MenuItem value={"30days"}>
                                            Last 30 Days
                                        </MenuItem>
                                        <MenuItem value={"lastmonth"}>
                                            Last month
                                        </MenuItem>
                                        <MenuItem value={"thisquarter"}>
                                            This quarter
                                        </MenuItem>
                                        <MenuItem value={"lastquarter"}>
                                            Last quarter
                                        </MenuItem>
                                        <MenuItem value={"last12months"}>
                                            Last 12 Months
                                        </MenuItem>
                                    </Select> */}
                    </div>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1.5 }}
                      color="text.secondary"
                      className="card-total text--center"
                      style={{ color: "#91B8E8" }}
                    >
                      <Link
                        to={"inventory-receiving"}
                        style={{ color: "#91B8E8" }}
                      >
                        {this.state.receivecounts}
                      </Link>
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: "#000000" }}
                      className="content-details text--center"
                    >
                      Total Shipments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Low Stock */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{ display: this.state.blocks.low_stock }}
              >
                <Card className="main-card center">
                  <CardContent className="main-card-content order_blocks">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="div"
                        className="main-card-title"
                      >
                        Low Stock
                      </Typography>

                      <Select
                        value={this.state.lowstock}
                        onChange={this.handleLowStockChange}
                        displayEmpty
                        inputProps={{
                          "aria-label": "Without label",
                        }}
                        className="filter-by"
                        IconComponent={KeyboardArrowDownIcon}
                      >
                        <MenuItem value="30">
                          <em style={{ fontStyle: "normal" }}>Last 30 Days</em>
                        </MenuItem>
                        <MenuItem value={60}>Last 60 Days</MenuItem>
                        <MenuItem value={90}>Last 90 Days</MenuItem>
                      </Select>
                    </div>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1.5 }}
                      color="text.secondary"
                      className="card-total text--center"
                      style={{ color: "#FCC354" }}
                    >
                      <Link
                        to={"inventory-low-stock"}
                        style={{ color: "#FCC354" }}
                      >
                        0
                      </Link>
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: "#000000" }}
                      className="content-details text--center"
                    >
                      Low Stock
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* No Stock */}
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
                style={{ display: this.state.blocks.no_stock }}
              >
                <Card className="main-card">
                  <CardContent className="main-card-content order_blocks">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="div"
                        className="main-card-title"
                      >
                        No Stock
                      </Typography>

                      {/* <Select
                                        value={this.state.nostock}
                                        onChange={this.handleNoStockChange}
                                        displayEmpty
                                        inputProps={{
                                            "aria-label": "Without label",
                                        }}
                                        className="filter-by"
                                        IconComponent={KeyboardArrowDownIcon}
                                    >
                                        <MenuItem value="30">
                                            <em style={{ fontStyle: "normal" }}>
                                                Last 30 Days
                                            </em>
                                        </MenuItem>
                                        <MenuItem value={60}>
                                            Last 60 Days
                                        </MenuItem>
                                        <MenuItem value={90}>
                                            Last 90 Days
                                        </MenuItem>
                                    </Select> */}
                    </div>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1.5 }}
                      color="text.secondary"
                      className="card-total text--center"
                      style={{ color: "#AA3939" }}
                    >
                      <Link
                        to={"inventory-no-stock"}
                        style={{ color: "#AA3939" }}
                      >
                        {this.state.nostockscounts}
                      </Link>
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        color: "#000000",
                      }}
                      className="content-details text--center"
                    >
                      Out of Stock
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        );
    }
}

export default Blocks;
