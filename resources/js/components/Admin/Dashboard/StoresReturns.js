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
import StoreReturnsForm from "./Stores/StoreReturnsForm";
import CommonSection from "./Common/CommonSection";

class StoresReturns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "admin-returns-form",
            title: "Returns Form",
        };
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
                                    {/* <StoreReturnsForm Title="Stores" /> */}
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }
}

export default StoresReturns;
