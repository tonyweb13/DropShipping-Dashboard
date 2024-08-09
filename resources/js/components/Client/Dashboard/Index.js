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
import Blocks from "./Blocks";
import CommonSection from "./Common/CommonSection";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "client/dashboard",
            title: "Dashboard",
            maintitle: "",
        };
    }

    componentDidMount() {
        axios
            .get("api/loginuser")
            .then((response) => {
                return response;
            })
            .then((json) => {
                console.log(json.data.success);
                if (json.data.success) {
                    let localState = localStorage["appState"];
                    let AppState = JSON.parse(localState);
                    let appState = {
                        isLoggedIn: true,
                        role: AppState.role,
                        maintenance: AppState.maintenance,
                        base: AppState.base,
                        user: AppState.user,
                        store: AppState.store,
                        country: AppState.country,
                        member_menu: AppState.member_menu,
                        loginasurl: json.data.login_as ? "/userdashboard" : "/",
                    };
                    localStorage["appState"] = JSON.stringify(appState);
                } else {
                    let userData = {
                        id: 0,
                        name: "",
                        email: "",
                        role: "",
                    };
                    let appState = {
                        isLoggedIn: false,
                        role: userData.role,
                        base: "",
                        user: userData,
                        store: "",
                    };
                    localStorage["appState"] = JSON.stringify(appState);
                    location.reload();
                }
            })
            .catch((error) => {
                if (error.response) {
                    this.setState({
                        isLoggedIn: false,
                    });
                } else if (error.request) {
                    this.setState({
                        isLoggedIn: false,
                    });
                } else {
                    this.setState({
                        isLoggedIn: false,
                    });
                }
            })
            .finally();
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
                        maintitle={this.state.maintitle}
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
                            <Blocks />
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }
}

export default Index;
