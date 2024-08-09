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
    TextField,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CommonSection from "../Common/CommonSection";
import Title from "../Common/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from "axios";
import { Input } from "postcss";

class Pricing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: "pricing-ustous-expedited",
            title: "PRICING",
            pricing: [],
            data: [],
            units: "lb",
            weight: 0,
            pricetotal: 0,
        };
    }

    componentDidMount() {
        this.getData({ page: 1, perpage: this.state.perpage });
    }

    getData = (data) => {
        axios
            .get("api/getpricingdata?pricingtype=ustous&shipping=expedited")
            .then((response) => {
                this.setState({
                    pricing: response.data.pricing.data,
                    data: response.data.pricing,
                });
            });
    };

    handleChangeWeight = (event) => {
        this.setState({ weight: event.target.value });
        axios
            .get(
                "api/getcalctotal?pricingtype=ustous&shipping=expedited&weight=" +
                    event.target.value +
                    "&units=" +
                    this.state.units
            )
            .then((response) => {
                this.setState({ pricetotal: response.data.pricing_total });
            });
    };

    handleChangeUnits = (event) => {
        this.setState({ units: event.target.value });
        axios
            .get(
                "api/getcalctotal?pricingtype=ustous&shipping=expedited&weight=" +
                    this.state.weight +
                    "&units=" +
                    event.target.value
            )
            .then((response) => {
                this.setState({ pricetotal: response.data.pricing_total });
            });
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
                                        {this.state.title}
                                    </Typography>
                                    <Typography
                                        component="h3"
                                        className="subpage_title_sub"
                                    >
                                        US to US | Expedited Shipping
                                    </Typography>

                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                        className="table_grid"
                                    >
                                        <Title></Title>

                                        <Typography
                                            component="div"
                                            className="pricing_div_calc"
                                        >
                                            <Typography
                                                component="h3"
                                                className="tableh3"
                                            >
                                                Pricing Calculator
                                            </Typography>
                                            <Table
                                                size="small"
                                                className="table_data"
                                            >
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            <TextField
                                                                id="pricing_weight"
                                                                label="Weight"
                                                                variant="filled"
                                                                value={
                                                                    this.state
                                                                        .weight
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleChangeWeight
                                                                }
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <FormControl
                                                                variant="filled"
                                                                sx={{
                                                                    m: 1,
                                                                    minWidth: 120,
                                                                }}
                                                                fullWidth
                                                                className="sel_formc"
                                                            >
                                                                <InputLabel id="demo-simple-select-label">
                                                                    Units
                                                                </InputLabel>
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="pricing_units"
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .units
                                                                    }
                                                                    label="Units"
                                                                    onChange={
                                                                        this
                                                                            .handleChangeUnits
                                                                    }
                                                                >
                                                                    <MenuItem value="kg">
                                                                        kg
                                                                    </MenuItem>
                                                                    <MenuItem value="lb">
                                                                        lb
                                                                    </MenuItem>
                                                                    <MenuItem value="oz">
                                                                        oz
                                                                    </MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <TextField
                                                                id="pricing_total"
                                                                label="Price"
                                                                variant="filled"
                                                                value={
                                                                    "$" +
                                                                    this.state
                                                                        .pricetotal
                                                                }
                                                                inputProps={{
                                                                    readOnly: true,
                                                                }}
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </Typography>
                                        <div className="pricing_table">
                                            <Typography
                                                component="h3"
                                                className="tableh3"
                                            >
                                                Expedited Shipping
                                            </Typography>
                                            <Table
                                                size="small"
                                                className="table_data"
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        {/* <TableCell><Checkbox /></TableCell> */}
                                                        <TableCell>
                                                            Weight (#)
                                                        </TableCell>
                                                        <TableCell>
                                                            Units
                                                        </TableCell>
                                                        <TableCell>
                                                            {" "}
                                                            Price{" "}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.pricing.map(
                                                        (row) => (
                                                            <TableRow
                                                                key={row.id}
                                                            >
                                                                {/* <TableCell><Checkbox /></TableCell> */}
                                                                <TableCell>
                                                                    {
                                                                        row.pricing_weight
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        row.pricing_units
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="td_price">
                                                                    $
                                                                    {parseFloat(
                                                                        row.price
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
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

export default Pricing;
