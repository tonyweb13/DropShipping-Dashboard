import React, { Component } from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    CssBaseline,
    Typography,
    Alert,
} from "@mui/material";

class Maintenance extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container maxWidth={"xs"} className="login_full_container">
                <CssBaseline />
                <Typography
                    component={"div"}
                    className="half_width_float left_login"
                >
                    <Box className="loginform_box">
                        <Typography component={"h1"} variant={"h5"}>
                            Maintenance Mode
                        </Typography>
                        <Typography component={"div"} className="left_subtext">
                            Sorry, we're down for scheduled maintenance right
                            now. Please login back around 1 to 2 hours. Thank
                            you!
                        </Typography>
                    </Box>
                </Typography>
                <Typography
                    component={"div"}
                    className="half_width_float right_login"
                >
                    <Typography
                        component={"div"}
                        className="bottom_right_login"
                    >
                        <Typography component="h2" className="login_intro_text">
                            Selling online is full of ups and downs.You handle
                            the ups, and we’ll handle the downs.
                        </Typography>
                        <Typography
                            component={"div"}
                            className="bottom_right_image"
                        ></Typography>
                    </Typography>
                </Typography>
            </Container>
        );
    }
}

export default Maintenance;
