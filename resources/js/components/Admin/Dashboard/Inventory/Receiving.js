import React, { Component } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Container,
    Grid,
    Paper,
    CssBaseline,
    Box,
    Toolbar,
} from "@mui/material";
import CommonSection from "../Common/CommonSection";
import InventoryLists from "./InventoryReceivingLists";
import InventoryWholesaleLists from "./InventoryWholesaleLists";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "inventory-receiving",
            title: "Inventory Receiving",
            type: "receiving",
            stocktype: "receiving",
            wholesale: 0,
        };
    }

    componentDidMount() {
        let state = localStorage["appState"];
        let menustate = localStorage["menuState"];

        if (state) {
            let AppState = JSON.parse(state);
            let MenuAppState = JSON.parse(menustate);
            this.setState({
                wholesale:
                    MenuAppState.member_menu.add_receiving_wholesale_button,
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
                        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <h1
                                        style={{
                                            textAlign: "center",
                                            margin: "15%",
                                        }}
                                    >
                                        Under Development, will be available
                                        soon!!
                                    </h1>
                                    {/* <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {this.state.wholesale == 1 ? (
                                            <InventoryWholesaleLists
                                                Title={this.state.title}
                                                Type={this.state.type}
                                                stocktype={this.state.stocktype}
                                            />
                                        ) : (
                                            <InventoryLists
                                                Title={this.state.title}
                                                Type={this.state.type}
                                                stocktype={this.state.stocktype}
                                            />
                                        )}
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
