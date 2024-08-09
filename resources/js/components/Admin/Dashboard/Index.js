import React, { Component } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
    Container,
    Grid,
    Paper,
    Typography,
    CssBaseline,
    IconButton,
    Box,
    Toolbar,
    Link,
    Badge,
    MenuItem,
    Divider,
    List,
    Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Chart from "./Chart";
import Deposits from "./Deposits";
import CommonSection from "./Common/CommonSection";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "dashboard",
            title: "Dashboard",
            isLoggedIn: false,
            user: {},
        };
    }

    componentDidMount() {
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            this.setState({
                isLoggedIn: AppState.isLoggedIn,
                user: AppState.user,
            });
        }
    }

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
                        <Container
                            maxWidth="lg"
                            sx={{ mt: 4, mb: 4 }}
                            className="dashboard_home_container"
                        >
                            <Grid container spacing={3}>
                                {/* Chart */}
                                <Grid item xs={12} md={12} lg={12}>
                                    {/* <Paper
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                          }}
                        >
                          <Chart />
                        </Paper> */}
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
