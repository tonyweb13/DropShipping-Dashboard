import React, { Component } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Container,
    Typography,
    CssBaseline,
    Box,
    Toolbar,
    Grid,
    Paper,
    List,
    ListItemButton,
    ListItemText,
    Button,
} from "@mui/material";

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "client/store",
            title: "Stores",
            isLoggedIn: false,
            user: {},
            store: false,
            stores: [],
        };
    }

    componentDidMount() {
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            this.setState({
                isLoggedIn: AppState.isLoggedIn,
                user: AppState.user,
                store: AppState.store,
            });
            this.getData(AppState.user.id);
        }
    }

    getData = (uid) => {
        axios.get("api/customerstores?ref=" + uid).then((response) => {
            if (response.data.success) {
                this.setState({ stores: response.data.stores });
            }
        });
    };

    handleSetStore = (storeid) => {
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            let NewAppState = {
                isLoggedIn: AppState.isLoggedIn,
                role: AppState.role,
                user: AppState.user,
                store: storeid,
            };
            localStorage["appState"] = JSON.stringify(NewAppState);
            this.setState({
                isLoggedIn: AppState.isLoggedIn,
                user: AppState.user,
                store: storeid,
            });
        }
        return this.props.history.push("/");
    };

    render() {
        const mdTheme = createTheme();

        return (
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />
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
                            <Paper
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 240,
                                }}
                            >
                                <List
                                    sx={{
                                        width: "100%",
                                        maxWidth: 360,
                                        bgcolor: "background.paper",
                                    }}
                                >
                                    {this.state.stores.map((row) => (
                                        <ListItemButton
                                            key={row.id}
                                            onClick={this.handleSetStore.bind(
                                                this,
                                                row.id
                                            )}
                                        >
                                            <ListItemText
                                                primary={row.store_name}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Paper>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }
}

export default Store;
