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
import ProfileList from "./Profile/Index";
import CommonSection from "./Common/CommonSection";

class Stores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "adminprofile",
            title: "Profile",
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
                                    {/* <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}> */}
                                    <ProfileList Title="Profile" />
                                    {/* </Paper> */}
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }
}

export default Stores;
