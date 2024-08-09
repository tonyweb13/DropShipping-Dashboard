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
import InventoryLists from "./InventoryLists";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import downloadicon from "../../../../../img/dl.png";
import printericon from "../../../../../img/printer_icon.png";
import uploadicon from "../../../../../img/upload_icon.png";
import settingsicon from "../../../../../img/settings_icon.png";
import axios from "axios";

class Index extends Component {
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

        let labels = [" "];
        const linedata = labels.map(() => 0);

        const getOrCreateTooltip = (chart) => {
            let tooltipEl = chart.canvas.parentNode.querySelector("div");

            if (!tooltipEl) {
                tooltipEl = document.createElement("div");
                tooltipEl.style.background = "#AA5539";
                tooltipEl.style.borderRadius = "3px";
                tooltipEl.style.color = "white";
                tooltipEl.style.opacity = 1;
                tooltipEl.style.pointerEvents = "none";
                tooltipEl.style.position = "absolute";
                tooltipEl.style.transform = "translate(-50%, 0)";
                tooltipEl.style.transition = "all .1s ease";
                tooltipEl.style.zIndex = 99;

                const table = document.createElement("table");
                table.style.margin = "0px";

                tooltipEl.appendChild(table);
                chart.canvas.parentNode.appendChild(tooltipEl);
            }

            return tooltipEl;
        };

        const externalTooltipHandler = (context) => {
            // Tooltip Element
            const { chart, tooltip } = context;
            const tooltipEl = getOrCreateTooltip(chart);

            // Hide if no tooltip
            if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
            }

            // Set Text
            if (tooltip.body) {
                const titleLines = tooltip.title || [];
                const bodyLines = tooltip.body.map((b) => b.lines);

                const tableHead = document.createElement("thead");

                titleLines.forEach((title) => {
                    const tr = document.createElement("tr");
                    tr.style.borderWidth = 0;
                    tr.style.backgroundColor = "#333333";
                    tr.style.borderRadius = "10px 10px 0px 0px";

                    const th = document.createElement("th");
                    th.style.borderWidth = 0;
                    th.style.backgroundColor = "#333333";
                    th.style.padding = "14px 20px";
                    th.style.borderRadius = "10px 10px 0px 0px";
                    th.style.fontSize = "15px";
                    th.style.fontFamily = "'Open Sans', sans-serif";
                    th.style.fontWeight = "500";
                    const text = document.createTextNode(title);

                    th.appendChild(text);
                    tr.appendChild(th);
                    tableHead.appendChild(tr);
                });

                const tableBody = document.createElement("tbody");
                bodyLines.forEach((body, i) => {
                    const colors = tooltip.labelColors[i];

                    const tr = document.createElement("tr");
                    tr.style.backgroundColor = "inherit";
                    tr.style.borderWidth = 0;
                    tr.style.padding = "14px 20px";

                    const td = document.createElement("td");
                    td.style.borderWidth = 0;
                    td.style.padding = "14px 20px 0";
                    td.style.fontSize = "12px";
                    td.style.fontFamily = "'Open Sans', sans-serif";
                    td.style.fontWeight = "500";

                    const text = document.createTextNode(body);

                    // td.appendChild(span);
                    td.appendChild(text);
                    tr.appendChild(td);
                    tableBody.appendChild(tr);
                });

                const tableRoot = tooltipEl.querySelector("table");

                // Remove old children
                while (tableRoot.firstChild) {
                    tableRoot.firstChild.remove();
                }

                // Add new children
                tableRoot.appendChild(tableHead);
                tableRoot.appendChild(tableBody);
            }

            const { offsetLeft: positionX, offsetTop: positionY } =
                chart.canvas;

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 1;
            tooltipEl.style.left = positionX + tooltip.caretX + "px";
            tooltipEl.style.top = positionY + tooltip.caretY + "px";
            tooltipEl.style.font = tooltip.options.bodyFont.string;
            tooltipEl.style.borderRadius = "10px";
            tooltipEl.style.paddingBottom = "14px";
            // tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
        };

        const chartdata = {
            labels,
            datasets: [
                {
                    type: "line",
                    label: " ",
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
                },
                tooltip: {
                    enabled: false,
                    position: "nearest",
                    external: externalTooltipHandler,
                },
            },
            scales: {
                y: {
                    ticks: {
                        color: "black",
                        font: {
                            size: 14,
                            family: "'Open Sans',sans-serif",
                            style: "normal",
                            weight: 400,
                        },
                    },
                },
                x: {
                    ticks: {
                        color: "black",
                        font: {
                            size: 14,
                            family: "'Open Sans',sans-serif",
                            style: "normal",
                            weight: 400,
                        },
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
            location: "inventory",
            title: "Inventory",
            cdata: chartdata,
            coptions: chartoptions,
            returns: "thisweek",
            type: "stock",
            stocktype: "stock",
        };
    }

    componentDidMount() {
        this.getChartData({ datefilter: this.state.returns });
    }

    getChartData = (data) => {
        this.datefilter =
            data.datefilter !== undefined
                ? data.datefilter
                : this.state.returns;
        axios
            .get("api/inventorychartdata?datefilter=" + this.datefilter)
            .then((response) => {
                this.newchart = {
                    labels: response.data.chartlabel,
                    datasets: [response.data.chartdataset],
                };
                this.setState({ cdata: this.newchart });
            });
    };

    handleChangeDateFilter = (event) => {
        this.setState({ returns: event.target.value });
        this.getChartData({ datefilter: event.target.value });
    };

    render() {
        const mdTheme = createTheme();

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
                                        {this.state.title} Summary
                                    </Typography>
                                    <Typography
                                        component="div"
                                        className="subpage_graph_sort_cnt"
                                    >
                                        <Select
                                            value={this.state.returns}
                                            onChange={
                                                this.handleChangeDateFilter
                                            }
                                            displayEmpty
                                            inputProps={{
                                                "aria-label": "Without label",
                                            }}
                                            className="filter-graph-by filter_selects"
                                            IconComponent={
                                                KeyboardArrowDownIcon
                                            }
                                        >
                                            <MenuItem value="thisweek">
                                                <em
                                                    style={{
                                                        fontStyle: "normal",
                                                    }}
                                                >
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
                                        </Select>
                                        <Button className="export_button">
                                            {" "}
                                            <img
                                                src={downloadicon}
                                                alt="download"
                                            />{" "}
                                            Export Data
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
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <InventoryLists
                                            Title={this.state.title}
                                            Type={this.state.type}
                                            stocktype={this.state.stocktype}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }
}

export default Index;
