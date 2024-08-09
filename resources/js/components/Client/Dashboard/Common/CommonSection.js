import React, { Component } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
    Alert,
    AlertTitle,
    Box,
    Grid,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Badge,
    MenuItem,
    Divider,
    List,
    Menu,
    Button,
    TextField,
    Container,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog,
} from "@mui/material";
import PrepsLogo from "../../../../../img/prep-logo.svg";
import UnitedStatesFlag from "../../../../../img/united-states-flag.png";
import UnitedKingdomFlag from "../../../../../img/united-kingdom-flag.png";
import Prepslogonew from "../../../../../img/Logo_new.png";
import PrepKangatext from "../../../../../img/PrepKanga_text.png";
import accountcircleinfo from "../../../../../img/account_circle_info.png";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import SearchIcon from "@mui/icons-material/Search";
import MainListItems from "./ListItems";
import ArrowDownIcon from "../../../../../img/arrow_down.png";
import topsearchicon from "../../../../../img/search_icon.png";
import accounticontop from "../../../../../img/top_account_icn.png";
import nofityicontop from "../../../../../img/notification_icon.png";
import profileicon from "../../../../../img/profile_icon.png";
import passwordicon from "../../../../../img/password_icon.png";
import settingicontop from "../../../../../img/setting_icon_top.png";
import logouttopicon from "../../../../../img/logout_top_icon.png";
import notifycheckicon2 from "../../../../../img/notify_check_icon.png";
import notifyinfoicon from "../../../../../img/notify_info_icon.png";
import notifytimeicon from "../../../../../img/notify_time_icon.png";
import nofityiconred from "../../../../../img/notification_red.png";
import nofityunreadicon from "../../../../../img/notify_red_icon.png";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);
import "../Client.css";

class CommonSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: props.location,
            title: props.title,
            maintitle: props.maintitle,
            isLoggedIn: false,
            user: {},
            userDisplay: "",
            open: true,
            anchorEl: false,
            mobileMoreAnchorEl: false,
            company: "",
            mode: "",
            country: "US",
            searchval: "",
            shownotify: false,
            formSubmitting: false,
            showreadnotify: "inline-block",
            showunreadnotify: "none",
            latestnotifyid: 0,
            showremindtext: "none",
            notificationdata: [],
            inventoryAllocatedCount: 0,
            fileurl: "",
            userrole: "",
            notifyinfo: {
                countunread: 0,
                readnotifyids: [],
            },
        };
        this.keyPress = this.keyPress.bind(this);
    }

    componentDidMount() {
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            let displayname = AppState.user.name;
            if (AppState.role == "Admin") {
                displayname = "Prep Admin";
            }
            this.setState({
                userDisplay: displayname,
                isLoggedIn: AppState.isLoggedIn,
                user: AppState.user,
                country: AppState.country,
            });
            this.checkidletime();

            let nstate = localStorage["notifyState"];
            let notifyState = JSON.parse(nstate);

            let notifyid = notifyState.notifyid;
            let readnotify = notifyState.readnotify;
            let userreadnotify = notifyState.userreadnotify;
            let remindnotify = notifyState.remindnotify;
            this.setState({ userrole: AppState.role });
            if (AppState.role != "Admin") {
                this.getReadUnreadNotification();
                if (
                    notifyid > 0 &&
                    readnotify == 0 &&
                    !userreadnotify &&
                    !remindnotify
                ) {
                    this.setState({
                        shownotify: true,
                        latestnotifyid: notifyid,
                    });
                }
                if (!userreadnotify || this.state.notifyinfo.countunread >= 1) {
                    this.setState({
                        showreadnotify: "none",
                        showunreadnotify: "inline-block",
                    });
                }

                if (remindnotify) {
                    this.setState({ showremindtext: "inline-block" });
                }
                this.getAllNotification();
                this.getInventoryAllocatedNotification();
            }
        }
        this.handleReadNotification = this.handleReadNotification.bind(this);

        axios.get("api/getsysteminformation").then((response) => {
            this.setState({
                company: response.data.store,
                mode: response.data.mode,
            });
        });
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

    handleSelectCountry = (country) => {
        axios.get("api/select-store?country=" + country).then((response) => {
            this.setState({ country: response.data.country });

            let localState = localStorage["appState"];
            let AppState = JSON.parse(localState);
            let appState = {
                isLoggedIn: true,
                role: AppState.role,
                base: AppState.base,
                user: AppState.user,
                store: AppState.store,
                country: country,
                member_menu: AppState.member_menu,
                loginasurl: AppState.loginasurl,
            };
            localStorage["appState"] = JSON.stringify(appState);

            location.reload();
        });
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
            .catch((error) => {});
    }
    gotoProfile() {
        window.location = "/profile";
    }

    checkidletime = () => {
        const idleDurationSecs = 2700;
        const redirectUrl = "/dashboard";
        let idleTimeout;

        const resetIdleTimeout = function () {
            if (idleTimeout) clearTimeout(idleTimeout);
            idleTimeout = setTimeout(
                () => logoutIdleUser(),
                idleDurationSecs * 1000
            );
        };

        // Key events for reset time
        resetIdleTimeout();
        window.onmousemove = resetIdleTimeout;
        window.onkeypress = resetIdleTimeout;
        window.click = resetIdleTimeout;
        window.onclick = resetIdleTimeout;
        window.touchstart = resetIdleTimeout;
        window.onfocus = resetIdleTimeout;
        window.onchange = resetIdleTimeout;
        window.onmouseover = resetIdleTimeout;
        window.onmouseout = resetIdleTimeout;
        window.onmousemove = resetIdleTimeout;
        window.onmousedown = resetIdleTimeout;
        window.onmouseup = resetIdleTimeout;
        window.onkeypress = resetIdleTimeout;
        window.onkeydown = resetIdleTimeout;
        window.onkeyup = resetIdleTimeout;
        window.onsubmit = resetIdleTimeout;
        window.onreset = resetIdleTimeout;
        window.onselect = resetIdleTimeout;
        window.onscroll = resetIdleTimeout;
        const logoutIdleUser = function () {
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
                .catch((error) => {});
        };
    };

    keyPress(e) {
        if (e.key === "Enter") {
            let searchState = {
                searchtext: e.target.value,
            };
            localStorage["searchState"] = JSON.stringify(searchState);
            location.href = "/searchresults";
        }
    }
    handleCloseModal = () => {
        this.setState({ shownotify: false });
    };
    handleReadNotification(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        const notifyData = new FormData();
        notifyData.append("notifyid", this.state.latestnotifyid);

        axios
            .post("api/read-notification", notifyData)
            .then((response) => {
                let localnotifydata = {
                    notifyid: this.state.latestnotifyid,
                    readnotify: 1,
                    userreadnotify: true,
                    remindnotify: false,
                };
                localStorage.setItem(
                    "notifyState",
                    JSON.stringify(localnotifydata)
                );
                this.setState({
                    shownotify: false,
                    formSubmitting: false,
                    global_msg: {
                        type: "success",
                        message: "Opening notification information!",
                    },
                });
                if (response.data.filename != "") {
                    window.open(response.data.file_url, "_blank", "noreferrer");
                    window.location.reload(true);
                }
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                msg = "Error found on submit.";
                this.setState({ formSubmitting: false, form_message: msg });
            });
    }
    handleRemindLater = () => {
        const notifyData = new FormData();
        let localnotifydata = {
            notifyid: this.state.latestnotifyid,
            readnotify: 1,
            userreadnotify: false,
            remindnotify: true,
        };
        localStorage.setItem("notifyState", JSON.stringify(localnotifydata));
        this.setState({ shownotify: false, showremindtext: "block" });
    };
    getAllNotification = () => {
        axios.get("api/getallnotification").then((response) => {
            this.setState({
                notificationdata: response.data.notifydata,
                file_url: response.data.file_url,
            });
        });
    };
    getInventoryAllocatedNotification = () => {
        axios.get("api/getInventoryAllocatedNotification").then((response) => {
            this.setState({ inventoryAllocatedCount: response.data.count });
        });
    };
    handleRedirectToFile = (notify_id) => {
        const notifyData = new FormData();
        notifyData.append("notifyid", notify_id);
        let totalunread = parseInt(this.state.notifyinfo.countunread);
        let deductunread = totalunread > 0 ? totalunread - 1 : 0;

        axios.post("api/read-notification", notifyData).then((response) => {
            if (response.data.filename != "") {
                window.open(response.data.file_url, "_blank", "noreferrer");
                window.location.reload(true);
            }
        });
    };
    getReadUnreadNotification = () => {
        axios.get("api/getallreadunread").then((response) => {
            this.setState({
                notifyinfo: {
                    countunread: response.data.countunread,
                    readnotifyids: response.data.notify_readids,
                },
            });
            if (response.data.countunread == 0) {
                this.setState({
                    showreadnotify: "inline-block",
                    showunreadnotify: "none",
                });
            } else {
                this.setState({
                    showreadnotify: "none",
                    showunreadnotify: "inline-block",
                });
            }
        });
    };
    checkIfRead = (notifyid) => {
        let returnClass = "";

        if (this.state.notifyinfo.readnotifyids?.length > 0) {
            let readnotifyids = this.state.notifyinfo.readnotifyids;

            for (let i = 0; i < readnotifyids.length; i++) {
                if (readnotifyids[i] == notifyid) {
                    returnClass = "drop_read_notify";
                    return returnClass;
                }
            }
        }

        return returnClass;
    };
    render() {
        const fullWidth = true;
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
                <MenuItem onClick={this.gotoProfile}>
                    Hi {this.state.userDisplay}
                </MenuItem>
                <MenuItem onClick={this.gotoProfile}>Profile</MenuItem>
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
        const divider = <span className="dividerspan"> &nbsp; | &nbsp; </span>;

        let bannermessage = "";
        let modeclass = "";
        if (this.state.mode != "") {
            modeclass = "mode-turn-on";
            bannermessage = (
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Typography component="div" className="banner-message">
                        <Alert severity="warning">
                            <AlertTitle>Maintenance Mode is ON</AlertTitle>
                            To turn it off{" "}
                            <Link to={"settings"}>Click Here!</Link>
                        </Alert>
                    </Typography>
                </Container>
            );
        }

        let getInventoryQtyAllocated = "";
        if (this.state.inventoryAllocatedCount > 0) {
            getInventoryQtyAllocated = (
                <div class="drop_notify_items drop_read_notify">
                    <div class="notify_items_content">
                        <img
                            src="/images/notify_red_icon.png"
                            alt="Notification icon"
                            class="notify_info_icon"
                        />
                        <div class="nic_title">
                            <span class="nic_span_title">
                                ({this.state.inventoryAllocatedCount}) Items out
                                of stock
                            </span>
                            <span class="nic_span_subtitle">
                                Click{" "}
                                <a href="/inventory-master-lists?qtyAllocatedList">
                                    here
                                </a>{" "}
                                for more details.
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        const modalNotifyContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={"xs"}
                open={this.state.shownotify}
                onClose={this.handleCloseModal}
                className="ordermodal"
            >
                <Box
                    id="notifyForm"
                    component={"form"}
                    onSubmit={this.handleReadNotification}
                >
                    <AppBar sx={{ position: "relative" }}>
                        <Toolbar>
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="h6"
                                component="div"
                            ></Typography>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={this.handleCloseModal}
                                aria-label="close"
                                className="close_dialog_button"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <DialogContent>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Notification
                        </Typography>
                        <DialogContentText id="alert-dialog-description">
                            A new update on your dashboard is available. Click
                            here to learn more
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <TextField
                            hiddenLabel
                            id="store_id"
                            type="hidden"
                            variant="standard"
                            // defaultValue={this.state.user.customer_id}
                        />
                        <div className="form_btns form_btns_del notify_modal_btn">
                            <Button
                                type={"button"}
                                color="inherit"
                                disabled={this.state.formSubmitting}
                                onClick={this.handleRemindLater}
                            >
                                Remind Me Later
                            </Button>
                            <Button
                                type={"submit"}
                                color="inherit"
                                disabled={this.state.formSubmitting}
                                variant="contained"
                            >
                                {this.state.formSubmitting
                                    ? "Opening..."
                                    : "Show Me"}
                            </Button>
                        </div>
                    </DialogActions>
                </Box>
            </Dialog>
        );
        return (
            <React.Fragment>
                <AppBar
                    position="absolute"
                    color="transparent"
                    className={"header-section " + modeclass}
                    open={this.state.open}
                >
                    <Typography component="div" className="main_topbar">
                        <Toolbar className="top_toolbar">
                            {/* <IconButton edge="start" color="inherit" aria-label="menu">
							<MenuIcon className="primary-text-color" />
							</IconButton> */}
                            {(() => {
                                if (this.state.maintitle != "") {
                                    return (
                                        <Typography
                                            component="h1"
                                            variant="h6"
                                            color="inherit"
                                            className="primary-text-color"
                                            noWrap
                                        >
                                            {this.state.maintitle}
                                        </Typography>
                                    );
                                }
                            })()}
                            {this.state.maintitle != "" &&
                            typeof this.state.maintitle !== "undefined"
                                ? divider
                                : ""}
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                className="primary-text-color"
                                noWrap
                            >
                                {this.state.title}
                            </Typography>
                            {divider}
                            <Typography
                                component="h2"
                                variant="h6"
                                color="inherit"
                                noWrap
                            >
                                {this.state.country}
                            </Typography>
                            <span className="top_company_title">
                                {this.state.company}
                            </span>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box
                                sx={{ display: { xs: "none", md: "flex" } }}
                                className="topmenuicons"
                            >
                                {/* <IconButton size="large" aria-label="united states flag" color="inherit" onClick={() => this.handleSelectCountry('US')}>
							<img src={UnitedStatesFlag} alt="Flag" className="flag-icon" />
						</IconButton>
						<IconButton size="large" aria-label="united kingdom flag" color="inherit" onClick={() => this.handleSelectCountry('UK')}>
							<img src={UnitedKingdomFlag} alt="Flag" className="flag-icon" />
						</IconButton> */}
                                <Typography
                                    component="div"
                                    className="topsearchdiv"
                                >
                                    <img
                                        src={topsearchicon}
                                        alt="Top search icon"
                                        className="topiconsearch"
                                    />
                                    {/* <form method="post" id="searchform" action="/searchresults"> */}
                                    <TextField
                                        id="search"
                                        name="search"
                                        hiddenLabel
                                        placeholder="SEARCH"
                                        className="top_search_field"
                                        onKeyDown={this.keyPress}
                                    />
                                </Typography>
                                {/* </form> */}
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls="primary-search-account-menu"
                                    aria-haspopup="true"
                                    // onClick={this.handleProfileMenuOpen}
                                    color="inherit"
                                    className="top_notify_btn"
                                >
                                    <img
                                        src={nofityiconred}
                                        alt="Notification icon"
                                        className="topiconnotify client_notify"
                                        style={{
                                            display:
                                                this.state.showunreadnotify,
                                        }}
                                    />
                                    <img
                                        src={nofityicontop}
                                        alt="Notification icon"
                                        className="topiconnotify client_notify"
                                        style={{
                                            display: this.state.showreadnotify,
                                        }}
                                    />
                                    <Typography
                                        component="div"
                                        className="dropdown-menu notifymenu"
                                        style={{
                                            display:
                                                this.state.userrole ==
                                                    "Admin" && "none",
                                        }}
                                    >
                                        <div className="triup"></div>
                                        <div className="dropdown_container">
                                            <div className="drop_main_header">
                                                <span className="drop_span_main_title">
                                                    NOTIFICATIONS
                                                </span>
                                                <span
                                                    className="drop_span_right"
                                                    style={{
                                                        display:
                                                            this.state
                                                                .notifyinfo
                                                                .countunread ==
                                                                0 && "none",
                                                    }}
                                                >
                                                    {
                                                        this.state.notifyinfo
                                                            .countunread
                                                    }{" "}
                                                    NEW
                                                </span>
                                            </div>
                                            {/* <div className={`drop_notify_items`} key={index}>
									<div className="notify_items_content">
										<div className="nic_title">
											<span className="nic_span_title">Inventory QTY Allocated (10)</span>
                                                <span className="nic_span_time">
                                                    3 days ago
                                                </span>
										</div>
									</div>
								</div> */}
                                            {getInventoryQtyAllocated}
                                            {this.state.notificationdata?.map(
                                                (notifyrow, index) => (
                                                    <div
                                                        className={`drop_notify_items ${this.checkIfRead(
                                                            notifyrow.id
                                                        )}`}
                                                        key={index}
                                                    >
                                                        <div className="notify_items_content">
                                                            {this.state.notifyinfo.readnotifyids.includes(
                                                                notifyrow.id
                                                            ) ? (
                                                                <img
                                                                    src={
                                                                        notifycheckicon2
                                                                    }
                                                                    alt="Notification icon"
                                                                    className="notify_info_icon"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        nofityunreadicon
                                                                    }
                                                                    alt="Notification icon"
                                                                    className="notify_info_icon"
                                                                />
                                                            )}
                                                            <div className="nic_title">
                                                                <span className="nic_span_title">
                                                                    {
                                                                        notifyrow.notification_title
                                                                    }
                                                                </span>
                                                                <span className="nic_span_subtitle">
                                                                    Click{" "}
                                                                    <a
                                                                        href="#"
                                                                        onClick={this.handleRedirectToFile.bind(
                                                                            this,
                                                                            notifyrow.id
                                                                        )}
                                                                    >
                                                                        here
                                                                    </a>{" "}
                                                                    for more
                                                                    details.
                                                                </span>
                                                                <span className="nic_span_time">
                                                                    <img
                                                                        src={
                                                                            notifytimeicon
                                                                        }
                                                                        alt="Notification time icon"
                                                                        className="notify_time_icon"
                                                                    />
                                                                    <ReactTimeAgo
                                                                        date={Date.parse(
                                                                            notifyrow.created_at
                                                                        )}
                                                                        locale="en-US"
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            {/* <div className="drop_notify_items drop_read_notify">
									<div className="notify_items_content">
										<img src={notifycheckicon2} alt="Notification check icon" className="notify_info_icon"  />
										<div className="nic_title">
											<span className="nic_span_title">New Dashboard Update</span>
											<span className="nic_span_subtitle">Click <a href="#">here</a> for more details.</span>
											<span className="nic_span_time"><img src={notifytimeicon} alt="Notification time icon" className="notify_time_icon"  />1 hour ago</span>
										</div>
									</div>
								</div>								 */}
                                            {this.state.notificationdata
                                                .length > 0 ? (
                                                <div className="drop_see_all_notify">
                                                    <a href="/usernotifications">
                                                        See all notifications
                                                    </a>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </Typography>
                                </IconButton>
                                {/* <IconButton size="large" aria-label="search" color="inherit">
								<SearchIcon className="icon_gray" />
							</IconButton> */}
                                {/* <IconButton color="inherit">
						<Badge badgeContent={4} color="secondary">
							<NotificationsIcon className="icon_gray" />
						</Badge>
						</IconButton> */}
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
                                        className="topiconaccount client_usericon"
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
                                                    Hi {this.state.userDisplay}{" "}
                                                    <img
                                                        src={profileicon}
                                                        alt="profile icon"
                                                    />
                                                </span>
                                            </div>
                                            <div
                                                className="adropdiv"
                                                onClick={this.gotoProfile}
                                            >
                                                Change Password{" "}
                                                <div className="navtop_icons password_icon"></div>
                                            </div>
                                            {/* <div className="adropdiv"  onClick={this.gotoProfile}>Settings <div className='navtop_icons settings_icon'></div></div> */}
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
                            <Box
                                className="notify_remind_notice"
                                style={{ display: this.state.showremindtext }}
                            >
                                <a href="/usernotifications">
                                    You have {this.state.notifyinfo.countunread}{" "}
                                    unread notifications.
                                </a>
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
                    {bannermessage}
                </AppBar>
                <div className="cust-sidebar">
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
                                        CUSTOMER DASHBOARD
                                    </div>
                                </div>
                            </div>
                        </div>
                        <MainListItems location={this.state.location} />
                    </Drawer>
                    {/* <div className="footer_copyright">© 2022 Prep Kanga</div> */}
                    {/* <div className="footer_accountinfo">
				<div className="foot_groups">
					<div className="sblogo_group">
						<img src={accountcircleinfo} alt="account logo" />
					</div>
					<div className="sblogo_group">
						<div className="sidebar_logo_text">{this.state.company}</div>
					</div>
				</div>
			</div> */}
                </div>
                {renderMobileMenu}
                {renderMenu}
                {modalNotifyContainer}
            </React.Fragment>
        );
    }
}

export default CommonSection;
