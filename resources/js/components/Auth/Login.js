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
import { withRouter, Link, Redirect } from "react-router-dom";
import axios from "axios";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            store: "",
            storeid: "",
            role: "",
            error: "",
            formSubmitting: false,
            user: {
                email: "",
                password: "",
            },
            redirect: props.location,
            show_maintenance: "none",
            hide_loginform: "block",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    UNSAFE_componentWillMount() {
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState });
        }
    }

    componentDidMount() {
        this.checkmaintenancemode();
        const { prevLocation } = this.state.redirect.state || {
            prevLocation: {
                pathname: this.state.role == "Admin" ? "/dashboard" : "/",
            },
        };
        if (prevLocation && this.state.isLoggedIn) {
            return this.props.history.push(prevLocation);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let userData = this.state.user;

        axios
            .post("api/login", userData)
            .then((response) => {
                return response;
            })
            .then((json) => {
                if (json.data.success) {
                    let userData = {
                        id: json.data.id,
                        name: json.data.name,
                        email: json.data.email,
                        role: json.data.role,
                    };
                    let appState = {
                        isLoggedIn: true,
                        maintenance: json.data.mode,
                        role: userData.role,
                        base: json.data.base,
                        user: userData,
                        store: json.data.store,
                        storeid: json.data.storeid,
                        country: json.data.country,
                        member_menu: json.data.member_menu,
                        loginasurl: "/",
                    };
                    let menuState = {
                        member_menu: json.data.member_menu,
                    };

                    let notifyState = {
                        notifyid: json.data.notifyid,
                        readnotify: json.data.readnotify,
                        userreadnotify: false,
                        remindnotify: false,
                    };
                    localStorage["withUK"] = json.data.withuk;
                    localStorage["appState"] = JSON.stringify(appState);
                    localStorage["menuState"] = JSON.stringify(menuState);
                    localStorage["notifyState"] = JSON.stringify(notifyState);
                    localStorage["accessUserLevel"] = json.data.access_level;

                    this.setState({
                        isLoggedIn: appState.isLoggedIn,
                        role: appState.role,
                        user: appState.user,
                        error: "",
                    });
                    axios.get("api/clear-cache");
                    axios.get("api/view-clear");
                    location.href = "/";
                    // window.location.reload(true);
                } else {
                    this.setState({
                        error: 1,
                        formSubmitting: false,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    let err = error.response.data;
                    this.setState({
                        error: err.message,
                        errorMessage: err.errors,
                        formSubmitting: false,
                    });
                } else if (error.request) {
                    let err = error.request;
                    this.setState({
                        error: err,
                        formSubmitting: false,
                    });
                } else {
                    let err = error.message;
                    this.setState({
                        error: err,
                        formSubmitting: false,
                    });
                }
            })
            .finally(this.setState({ error: "" }));
    }

    handleEmail(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                email: value,
            },
        }));
    }

    handlePassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                password: value,
            },
        }));
    }
    checkmaintenancemode = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const forcelogin = urlParams.get("forcelogin");

        if (forcelogin != 1) {
            axios.get("api/check_maintenance_mode").then((response) => {
                let mode = parseInt(response.data.mode);
                if (mode != 0) {
                    this.setState({
                        show_maintenance: "block",
                        hide_loginform: "none",
                    });
                }
            });
        }
    };
    render() {
        let error = this.state.error;

        return (
          <Container maxWidth={"xs"} className="login_full_container">
            <CssBaseline />
            {error != "" && (
              <Alert style={{ marginBottom: "20px" }} severity="error">
                Wrong Credentials
              </Alert>
            )}
            <Typography
              component={"div"}
              className="half_width_float left_login"
            >
              <Box
                className="loginform_box"
                style={{ display: this.state.hide_loginform }}
              >
                <Typography component={"h1"} variant={"h5"}>
                  Login
                </Typography>
                <Typography component={"div"} className="left_subtext">
                  Enter your credentials to access your account.
                </Typography>
                <Box component={"form"} onSubmit={this.handleSubmit}>
                  <label className="loginform_label">Email Address</label>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    hiddenLabel
                    variant="filled"
                    onChange={this.handleEmail}
                    placeholder="name@company.com"
                  />
                  <div className="label_group">
                    <label className="loginform_label">Password</label>
                    <a href="#" className="a_floatright">
                      Forgot Password?
                    </a>
                  </div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    type="password"
                    id="password"
                    hiddenLabel
                    autoComplete="current-password"
                    variant="filled"
                    onChange={this.handlePassword}
                  />
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox sx={{ color: "#E9E9E9" }} />}
                      label="Remember information"
                    />
                  </FormGroup>
                  <Button
                    disabled={this.state.formSubmitting}
                    fullWidth
                    variant={"outlined"}
                    type={"submit"}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {this.state.formSubmitting ? "Logging You In..." : "Log In"}
                  </Button>
                </Box>
              </Box>
              <Box
                className="loginform_box"
                style={{ display: this.state.show_maintenance }}
              >
                <Typography component={"h1"} variant={"h5"}>
                  System is Updating.
                </Typography>
                <Typography component={"div"} className="left_subtext">
                  We are currently upgrading your system.
                  <br></br> We will resume on or before 9:00 AM EST.
                  <br></br>
                  Thank you.
                </Typography>
              </Box>
            </Typography>
            <Typography
              component={"div"}
              className="half_width_float right_login"
            >
              <Typography component={"div"} className="bottom_right_login">
                <Typography component="h2" className="login_intro_text">
                  Selling online is full of ups and downs.You handle the ups,
                  and we’ll handle the downs.
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

export default withRouter(Login);
