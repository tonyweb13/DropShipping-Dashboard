import React, { Component } from "react";
import { Pagination } from "react-laravel-paginex";
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
    Select,
    MenuItem,
    Button,
    Checkbox,
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
import CommonSection from "../Common/CommonSection";
import Title from "../Common/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import downloadicon from "../../../../../img/dl.png";
import printericon from "../../../../../img/printer_icon.png";
import uploadicon from "../../../../../img/upload_icon.png";
import settingsicon from "../../../../../img/settings_icon.png";

class OrderLists extends Component {
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
        let labels = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const linedata = labels.map(() => Math.floor(Math.random() * 1000));

        const chartdata = {
            labels,
            datasets: [
                {
                    type: "line",
                    label: "TOTAL NUMBERS OF RETURNS",
                    borderColor: "#AA5539",
                    backgroundColor: "#AA5539",
                    fill: true,
                    data: linedata,
                    lineTension: 0.1,
                    borderWidth: 2,
                    pointRadius: 5,
                },
            ],
        };
        const chartoptions = {
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        usePointStyle: true,
                    },
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            maintainAspectRatio: false,
        };
        this.state = {
            title: props.Title,
            data: [],
            orders: [],
            cdata: chartdata,
            coptions: chartoptions,
        };

        this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
    }

    componentDidMount() {
        this.getData({ page: 1 });
    }

    getData = (data) => {
        axios.get("api/orders?page=" + data.page).then((response) => {
            this.setState({
                orders: response.data.orders.data,
                data: response.data.orders,
            });
        });
    };

    handleOrderSubmit(e) {}

    render() {
        return (
            <React.Fragment>
                <Container className="gridcnt">
                    <Typography component="h2" className="subpage_title">
                        {this.state.title}
                    </Typography>
                    <Typography
                        component="div"
                        className="subpage_graph_sort_cnt"
                    >
                        <Select
                            value={""}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            className="filter-graph-by filter_selects"
                            IconComponent={KeyboardArrowDownIcon}
                        >
                            <MenuItem value="">
                                <em style={{ fontStyle: "normal" }}>
                                    This Week
                                </em>
                            </MenuItem>
                            <MenuItem value={31}>This Month</MenuItem>
                            <MenuItem value={30}>Last 30 Days</MenuItem>
                            <MenuItem value={62}>Last month</MenuItem>
                            <MenuItem value={3}>This quarter</MenuItem>
                            <MenuItem value={3}>Last quarter</MenuItem>
                            <MenuItem value={3}>Last 12 Months</MenuItem>
                            <MenuItem value={3}>Rolling last Months</MenuItem>
                        </Select>
                        <Button className="export_button">
                            {" "}
                            <img src={downloadicon} alt="download" /> Export
                            Data
                        </Button>
                    </Typography>
                    <Typography
                        variant="div"
                        component="div"
                        className="graph_container"
                    >
                        <Chart
                            type="bar"
                            data={this.state.cdata}
                            options={this.state.coptions}
                            height="400"
                        />
                    </Typography>
                    <Paper
                        sx={{ p: 2, display: "flex", flexDirection: "column" }}
                        className="table_grid"
                    >
                        <Title></Title>
                        <div className="table_filter_options">
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
                                <Select
                                    value={""}
                                    displayEmpty
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
                                    className="table-filters filter_selects"
                                    IconComponent={KeyboardArrowDownIcon}
                                >
                                    <MenuItem value="">
                                        <em style={{ fontStyle: "normal" }}>
                                            Filter
                                        </em>
                                    </MenuItem>
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
                                    <img
                                        src={settingsicon}
                                        alt="settings icon"
                                    />
                                </Link>
                            </Typography>
                        </div>
                        <Pagination
                            count={10}
                            changePage={this.getData}
                            data={this.state.data}
                            variant="outlined"
                            shape="rounded"
                            prevButtonClass="prev_pbtn"
                            nextButtonClass="next_pbtn"
                        />
                        <Table size="small" className="table_data">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Order Number</TableCell>
                                    <TableCell>Order Age</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    {/* <TableCell align="right">Sale Amount</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.orders.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.order_date}</TableCell>
                                        <TableCell>
                                            {row.order_number}
                                        </TableCell>
                                        <TableCell>{row.order_age}</TableCell>
                                        <TableCell>
                                            {row.customer_name}
                                        </TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        {/* <TableCell align="right">{`$${row.amount}`}</TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>
            </React.Fragment>
        );
    }
}

export default OrderLists;
