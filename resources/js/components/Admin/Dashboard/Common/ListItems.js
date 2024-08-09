import React, { Component } from "react";
import { useLocation } from "react-router-dom";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StoreIcon from "@mui/icons-material/Store";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ListRemoveIcon from "@mui/icons-material/PlaylistRemove";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CompleteCheckIcon from "@mui/icons-material/FactCheck";
import HeldOrderIcon from "@mui/icons-material/Reorder";
import ListOrderIcon from "@mui/icons-material/PlaylistAdd";
import SettingsIcon from "@mui/icons-material/Tune";
import LogoutIcon from "@mui/icons-material/Logout";

class MainListItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            path: props.location,
            openSub: false,
            is_admin: false,
        };
    }

    componentDidMount() {
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            this.setState({ is_admin: AppState.user.is_admin });
        }
    }

    handleOpenChild = () => {
        let toggleSub = false;
        if (!this.state.openSub) {
            toggleSub = true;
        }
        this.setState({ openSub: toggleSub });
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

    render() {
        const isLoggedAdmin = this.state.is_admin;
        return (
            <React.Fragment>
                <List component="nav" className="sidebar_main_menu_container">
                    <ListSubheader
                        component="div"
                        className="list_item_title_admin"
                    >
                        Management
                    </ListSubheader>
                    <ListItemButton
                        className="list-item"
                        component="a"
                        href="/dashboard"
                        selected={this.state.path === "dashboard"}
                    >
                        <ListItemIcon>
                            <div className="nav_icons dashadmin_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Dashboard"
                            className="list-item-text"
                        />
                    </ListItemButton>
                    <ListItemButton
                        className="list-item"
                        component="a"
                        href="/customers"
                        selected={this.state.path === "customers"}
                    >
                        <ListItemIcon>
                            <div className="nav_icons peopleadmin_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Customers"
                            className="list-item-text"
                        />
                    </ListItemButton>
                    <ListItemButton
                        className="list-item"
                        component="a"
                        href="/stores"
                        selected={this.state.path === "stores"}
                    >
                        <ListItemIcon>
                            <div className="nav_icons storeadmin_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Stores"
                            className="list-item-text"
                        />
                    </ListItemButton>
                    <Collapse
                        in={true}
                        timeout="auto"
                        unmountOnExit
                        className={"nestedmenu2"}
                    >
                        <List
                            component="div"
                            disablePadding
                            className={this.state.current_ustous}
                        >
                            <ListItemButton
                                className="list-item"
                                component="a"
                                href="/admin-order-history"
                                selected={
                                    this.state.path === "admin-order-history"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon></ListItemIcon>
                                <ListItemText
                                    primary="Edit History"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                            <ListItemButton
                                className="list-item"
                                component="a"
                                href="/admin-returns-form"
                                selected={
                                    this.state.path === "admin-returns-form"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon>
                                    <div className="navsubmenu_circle"></div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Returns Form"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton className="list-item" component="a">
                        <ListItemIcon>
                            <div className="nav_icons inventory_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Inventory"
                            className="list-item-text"
                        />
                    </ListItemButton>

                    <Collapse
                        in={true}
                        timeout="auto"
                        unmountOnExit
                        className={"nestedmenu2"}
                    >
                        <List
                            component="div"
                            disablePadding
                            className={this.state.current_ustous}
                        >
                            <ListItemButton
                                className="list-item"
                                component="a"
                                href="/admin-inventory-receiving"
                                selected={
                                    this.state.path ===
                                    "admin-inventory-receiving"
                                }
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon></ListItemIcon>
                                <ListItemText
                                    primary="Receiving"
                                    className="list-item-text"
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton
                        className="list-item"
                        component="a"
                        href="/notifications"
                        selected={this.state.path === "notifications"}
                    >
                        <ListItemIcon>
                            <div className="nav_icons notifyadmin_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Notifications"
                            className="list-item-text"
                        />
                    </ListItemButton>
                    <ListItemButton
                        className="list-item"
                        component="a"
                        href="/zendesk-notifications"
                        selected={this.state.path === "zendesk-notifications"}
                    >
                        <ListItemIcon>
                            <div className="nav_icons notifyadmin_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Ticket Logs"
                            className="list-item-text"
                        />
                    </ListItemButton>
                    <ListItemButton
                        className="list-item"
                        component="a"
                        href="/settings"
                        selected={this.state.path === "settings"}
                    >
                        <ListItemIcon>
                            <div className="nav_icons settingadmin_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Settings"
                            className="list-item-text"
                        />
                    </ListItemButton>
                    <ListItemButton
                        className="list-item"
                        component="a"
                        href="/users"
                        selected={this.state.path === "users"}
                    >
                        <ListItemIcon>
                            <div className="nav_icons peopleadmin_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Admin Users"
                            className="list-item-text"
                        />
                    </ListItemButton>
                    <ListItemButton
                        className="list-item"
                        component="a"
                        href="#"
                        onClick={this.logout}
                    >
                        <ListItemIcon>
                            <div className="nav_icons logoutadmin_icon"></div>
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            className="list-item-text"
                        />
                    </ListItemButton>
                </List>
            </React.Fragment>
        );
    }
}

export default MainListItems;
