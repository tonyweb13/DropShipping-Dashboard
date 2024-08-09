import React, { Component } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
    Box,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Link,
    Badge,
    MenuItem,
    Divider,
    List,
    Menu,
    TextField,
} from "@mui/material";
import PrepsLogo from "../../../../../img/prep-logo.svg";
import PrepsLogoAdmin from "../../../../../img/admin_logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import SearchIcon from "@mui/icons-material/Search";
import MainListItems from "./ListItems";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowDownIcon from "../../../../../img/arrow_down.png";
import Prepslogonew from "../../../../../img/Logo_new.png";
import PrepKangatext from "../../../../../img/PrepKanga_text.png";
import accountcircleinfo from "../../../../../img/account_circle_info.png";
import topsearchicon from "../../../../../img/search_icon.png";
import accounticontop from "../../../../../img/top_account_icn.png";
import nofityicontop from "../../../../../img/notification_icon.png";
import profileicon from "../../../../../img/profile_icon.png";
import passwordicon from "../../../../../img/password_icon.png";
import settingicontop from "../../../../../img/setting_icon_top.png";
import logouttopicon from "../../../../../img/logout_top_icon.png";

class CommonSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: props.location,
            title: props.title,
            isLoggedIn: false,
            user: {},
            open: true,
            anchorEl: false,
            mobileMoreAnchorEl: false,
            company: "",
        };
    }

    componentDidMount() {
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            this.setState({
                isLoggedIn: AppState.isLoggedIn,
                user: AppState.user,
                company: "Prep Kanga Admin",
            });
        }
    }

    toggleDrawer = () => {
        let state = localStorage["appState"];
        let toggle = false;
        if (!this.state.open) {
            toggle = true;
        }
        if (state) {
            let AppState = JSON.parse(state);
            let NewState = {
                isLoggedIn: AppState.isLoggedIn,
                user: AppState.user,
                open: toggle,
            };
            localStorage["appState"] = JSON.stringify(NewState);
            this.setState(NewState);
        }
    };

    handleProfileMenuOpen = (event) => {
        this.setState({ anchorEl: true });
    };

    handleMenuClose = (event) => {
        this.setState({ anchorEl: false });
    };

    handleMobileMenuOpen = (event) => {
        this.setState({ mobileMoreAnchorEl: true });
    };

    handleMobileMenuClose = () => {
        this.setState({ mobileMoreAnchorEl: false });
    };

    logout(e) {
        e.preventDefault();
        axios
            .post("api/logout")
            .then((response) => {
                return response;
            })
            .then((json) => {
                if (json.data.success) {
                    let userData = {};
                    let appState = {
                        isLoggedIn: false,
                        user: userData,
                    };
                    localStorage["appState"] = JSON.stringify(appState);
                    location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    gotoProfile() {
        window.location = "/adminprofile";
    }
    render() {
        const drawerWidth = 240;
        const AppBar = styled(MuiAppBar, {
            shouldForwardProp: (prop) => prop !== "open",
        })(({ theme, open }) => ({
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            ...(open && {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            }),
        }));
        const Drawer = styled(MuiDrawer, {
            shouldForwardProp: (prop) => prop !== "open",
        })(({ theme, open }) => ({
            "& .MuiDrawer-paper": {
                position: "relative",
                whiteSpace: "nowrap",
                width: drawerWidth,
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                boxSizing: "border-box",
                ...(!open && {
                    overflowX: "hidden",
                    transition: theme.transitions.create("width", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    width: theme.spacing(7),
                    [theme.breakpoints.up("sm")]: {
                        width: theme.spacing(9),
                    },
                }),
            },
        }));

        const renderMenu = (
            <Menu
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                id="primary-search-account-menu"
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={this.state.anchorEl}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={this.logout}>Logout</MenuItem>
            </Menu>
        );

        const renderMobileMenu = (
            <Menu
                anchorEl={this.state.mobileMoreAnchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                id="primary-search-account-menu-mobile"
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={this.state.mobileMoreAnchorEl}
                onClose={this.handleMobileMenuClose}
            >
                <MenuItem>
                    <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                    >
                        <Badge badgeContent={17} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <span>Notifications</span>
                </MenuItem>
                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-profile-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <span>Profile</span>
                </MenuItem>
                <MenuItem onClick={this.logout}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-logout-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <ArrowCircleRightIcon />
                    </IconButton>
                    <span>Logout</span>
                </MenuItem>
            </Menu>
        );

        return (
            <React.Fragment>
                <AppBar
                    position="absolute"
                    color="transparent"
                    className="header-section"
                    open={this.state.open}
                >
                    <Typography component="div" className="main_topbar">
                        <Toolbar className="top_toolbar admin_top_bar">
                            {/* <IconButton edge="start" color="inherit" aria-label="menu">
					      <MenuIcon className="primary-text-color" />
					    </IconButton> */}
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                className="primary-text-color"
                                noWrap
                            >
                                {this.state.title}
                            </Typography>
                            {/* &nbsp; | &nbsp; 
              <Typography
                component="h2"
                variant="h6"
                color="inherit"
                noWrap
				className="admin_top_cname"
              >
                {this.state.company}
              </Typography> */}
                            <Box sx={{ flexGrow: 1 }} />
                            <Box
                                sx={{ display: { xs: "none", md: "flex" } }}
                                className="topmenuicons adminicons"
                            >
                                {/* <IconButton size="large" aria-label="search" color="inherit">
							<SearchIcon className="icon_gray" />
						</IconButton>
					<IconButton color="inherit">
					<Badge badgeContent={4} color="secondary">
						<NotificationsIcon className="icon_gray" />
					</Badge>
					</IconButton> */}
                                {/* <img src={topsearchicon} alt="Top search icon" className="topiconsearch" />
					<TextField
							id="search"
							name="search"
							hiddenLabel
							placeholder="SEARCH"
							className="top_search_field"
						/> */}
                                {/* <img src={nofityicontop} alt="Notification icon"  className="topiconnotify" /> */}
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls="primary-search-account-menu"
                                    aria-haspopup="true"
                                    // onClick={this.handleProfileMenuOpen}
                                    color="inherit"
                                    className="top_acc_btn"
                                >
                                    {/* <AccountCircle className="icon_gray"/> */}
                                    <img
                                        src={accounticontop}
                                        alt="Account icon"
                                        className="topiconaccount"
                                    />
                                    {/* <Typography component="span" className="topacc_text">Hi {this.state.user.name} 
							<img src={ArrowDownIcon} alt="Arrow Down" /></Typography> */}
                                    <Typography
                                        component="div"
                                        className="dropdown-menu usermenu"
                                    >
                                        <div className="triup"></div>
                                        <div className="dropdown_container">
                                            <div
                                                className="adropdiv dropheader"
                                                onClick={this.gotoProfile}
                                            >
                                                <span>
                                                    Profile Information{" "}
                                                    <img
                                                        src={profileicon}
                                                        alt="profile icon"
                                                    />
                                                </span>
                                            </div>
                                            {/* <div className="adropdiv"  onClick={this.gotoProfile}>Change Password <img src={passwordicon} alt="password icon" /></div>
									<div className="adropdiv"  onClick={this.gotoProfile}>Settings <img src={settingicontop} alt="settings icon" /></div> */}
                                            <div
                                                className="adropdiv"
                                                onClick={this.logout}
                                            >
                                                Logout{" "}
                                                <div className="navtop_icons toplogout_icon"></div>
                                            </div>
                                        </div>
                                    </Typography>
                                </IconButton>
                                {/* <Typography component="span" className="top_pk_circle">PK</Typography> */}
                            </Box>
                            <Box sx={{ display: { xs: "flex", md: "none" } }}>
                                <IconButton
                                    size="large"
                                    aria-label="show more"
                                    aria-controls="primary-search-account-menu"
                                    aria-haspopup="true"
                                    onClick={this.handleMobileMenuOpen}
                                    color="inherit"
                                >
                                    <MoreIcon />
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </Typography>
                </AppBar>
                <div className="cust-sidebar admin_sidebar">
                    <Drawer
                        variant="permanent"
                        open={this.state.open}
                        className="sidebar_drawer"
                    >
                        <div className="sidebar_logo_div">
                            <div className="sidebar_logo_contents">
                                <div className="sblogo_group">
                                    <img src={Prepslogonew} alt="logo" />
                                </div>
                                <div className="sblogo_group">
                                    <div className="sidebar_logo_text">
                                        <img
                                            src={PrepKangatext}
                                            alt="Prep Kanga Logo text"
                                        />
                                    </div>
                                    <div className="sidebar_logo_sub_text">
                                        ADMIN DASHBOARD
                                    </div>
                                </div>
                            </div>
                        </div>
                        <MainListItems location={this.state.location} />
                    </Drawer>
                    <div className="footer_accountinfo">
                        <div className="foot_groups">
                            <div className="sblogo_group">
                                <div className="admin_account_foot_logo"></div>
                            </div>
                            <div className="sblogo_group">
                                <div className="sidebar_logo_text">
                                    {this.state.company}
                                </div>
                                <div className="sidebar_logo_sub_text"> </div>
                            </div>
                        </div>
                    </div>
                </div>
                {renderMobileMenu}
                {renderMenu}
            </React.Fragment>
        );
    }
}

export default CommonSection;
