import React, { Component } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
    AppBar,
    Typography,
    Container,
    Grid,
    Paper,
    CssBaseline,
    Box,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    TextField,
    Button,
    Link,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import ArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import CommonSection from "./Common/CommonSection";
import helpIcon from "../../../../img/helpIcon.png";
import plus_icon from "../../../../img/plus_icon.png";
import edit_icon from "../../../../img/edit_icon_new.png";
import trash_icon from "../../../../img/trash_icon.png";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "settings",
            title: "Settings",
            openGoogleSheetModal: false,
            openQuickbooksModal: false,
            formSubmitting: false,
            googlesheet: {
                type: "googlesheet",
                held: "",
                delayed: "",
                return: "",
                inventory: "",
                receiving: "",
            },
            quickbooks: {
                type: "quickbooks",
                us: "",
                uk: "",
            },
            message: "",
            showdesc: "block",
            maintenancemode: false,
        };

        // Google sheet
        this.handleGoogleSheetSubmit = this.handleGoogleSheetSubmit.bind(this);
        this.handleHeld = this.handleHeld.bind(this);
        this.handleDelayed = this.handleDelayed.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleInventory = this.handleInventory.bind(this);
        this.handleInventoryReceiving =
            this.handleInventoryReceiving.bind(this);

        // Quickbooks
        this.handleQuickbooksSubmit = this.handleQuickbooksSubmit.bind(this);
        this.handleUS = this.handleUS.bind(this);
        this.handleUK = this.handleUK.bind(this);
        this.handleMaintenanceMode = this.handleMaintenanceMode.bind(this);
    }

    componentDidMount() {
        axios.get("api/get-system-settings").then((response) => {
            this.setState({
                googlesheet: {
                    held: response.data.held,
                    delayed: response.data.delayed,
                    return: response.data.return,
                    inventory: response.data.inventory,
                    receiving: response.data.receiving,
                },
                maintenancemode: response.data.mode,
            });
        });
    }

    /* Google Sheet Settings */
    handleOpenGoogleSheetModal = () => {
        this.setState({ openGoogleSheetModal: true });
    };

    handleCloseGoogleSheetModal = () => {
        this.setState({ openGoogleSheetModal: false });
    };

    handleGoogleSheetSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let googleSheetData = this.state.googlesheet;

        axios
            .post("api/set-google-settings", googleSheetData)
            .then((response) => {
                this.setState({
                    openGoogleSheetModal: false,
                    formSubmitting: false,
                });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (
                    typeof errors.held !== "undefined" &&
                    errors.held.length > 0
                ) {
                    msg += errors.held[0] + "\r\n";
                }
                if (
                    typeof errors.return !== "undefined" &&
                    errors.return.length > 0
                ) {
                    msg += errors.return[0] + "\r\n";
                }
                if (
                    typeof errors.inventory !== "undefined" &&
                    errors.inventory.length > 0
                ) {
                    msg += errors.inventory[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, message: msg });
            });
    }

    handleHeld(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            googlesheet: {
                ...prevState.googlesheet,
                held: value,
            },
        }));
    }

    handleDelayed(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            googlesheet: {
                ...prevState.googlesheet,
                delayed: value,
            },
        }));
    }

    handleReturn(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            googlesheet: {
                ...prevState.googlesheet,
                return: value,
            },
        }));
    }

    handleInventory(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            googlesheet: {
                ...prevState.googlesheet,
                inventory: value,
            },
        }));
    }

    handleInventoryReceiving(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            googlesheet: {
                ...prevState.googlesheet,
                receiving: value,
            },
        }));
    }

    /* Quickbooks Settings */
    handleOpenQuickbooksModal = () => {
        this.setState({ openQuickbooksModal: true });
    };

    handleCloseQuickbooksModal = () => {
        this.setState({ openQuickbooksModal: false });
    };

    handleQuickbooksSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        let quickbooksData = this.state.quickbooks;

        axios
            .post("api/set-settings", quickbooksData)
            .then((response) => {
                this.setState({
                    openQuickbooksModal: false,
                    formSubmitting: false,
                });
            })
            .catch((error) => {
                let msg = "";
                const errors = error.response.data.errors;
                if (typeof errors.us !== "undefined" && errors.us.length > 0) {
                    msg += errors.us[0] + "\r\n";
                }
                if (typeof errors.uk !== "undefined" && errors.uk.length > 0) {
                    msg += errors.uk[0] + "\r\n";
                }
                this.setState({ formSubmitting: false, message: msg });
            });
    }

    handleUS(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            quickbooks: {
                ...prevState.quickbooks,
                us: value,
            },
        }));
    }

    handleUK(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            quickbooks: {
                ...prevState.quickbooks,
                uk: value,
            },
        }));
    }
    showdescription = () => {
        let showtoggle = this.state.showdesc == "none" ? "block" : "none";
        this.setState({ showdesc: showtoggle });
    };

    handleMaintenanceMode(e) {
        const mode = e.target.checked;
        axios
            .post("api/set-maintenance-mode", { maintenance_mode: mode })
            .then((response) => {
                this.setState({ maintenancemode: mode });
            });
    }

    render() {
        const mdTheme = createTheme();

        const AntSwitch = styled(Switch)(({ theme }) => ({
            width: 28,
            height: 16,
            padding: 0,
            display: "flex",
            "&:active": {
                "& .MuiSwitch-thumb": {
                    width: 15,
                },
                "& .MuiSwitch-switchBase.Mui-checked": {
                    transform: "translateX(9px)",
                },
            },
            "& .MuiSwitch-switchBase": {
                padding: 2,
                "&.Mui-checked": {
                    transform: "translateX(12px)",
                    color: "#fff",
                    "& + .MuiSwitch-track": {
                        opacity: 1,
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "#177ddc"
                                : "#1890ff",
                    },
                },
            },
            "& .MuiSwitch-thumb": {
                boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
                width: 12,
                height: 12,
                borderRadius: 6,
                transition: theme.transitions.create(["width"], {
                    duration: 200,
                }),
            },
            "& .MuiSwitch-track": {
                borderRadius: 16 / 2,
                opacity: 1,
                backgroundColor:
                    theme.palette.mode === "dark"
                        ? "rgba(255,255,255,.35)"
                        : "rgba(0,0,0,.25)",
                boxSizing: "border-box",
            },
        }));

        const fullWidth = true;
        const maxWidth = "md";

        const modalGoogleSheetContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openGoogleSheetModal}
                onClose={this.handleCloseGoogleSheetModal}
                className="ordermodal adminmodal"
            >
                <Box component={"form"} onSubmit={this.handleGoogleSheetSubmit}>
                    {/* <DialogTitle id="responsive-dialog-title" className="modal_dia_title">Set Google Sheet ID's
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.handleCloseGoogleSheetModal}
                        aria-label="close"
                        className="close_dialog_button"
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent> */}
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
                                onClick={this.handleCloseGoogleSheetModal}
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
                            Set Google Sheet ID's
                        </Typography>
                        {this.state.message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.message}
                            </Alert>
                        )}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="held"
                            label="Held Orders"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleHeld}
                            defaultValue={this.state.googlesheet.held}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="delayed"
                            label="Delayed Orders"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleDelayed}
                            defaultValue={this.state.googlesheet.delayed}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="return"
                            label="Return Orders"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleReturn}
                            defaultValue={this.state.googlesheet.return}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="inventory"
                            label="Inventory"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleInventory}
                            defaultValue={this.state.googlesheet.inventory}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="inventory-receiving"
                            label="Inventory Receiving"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleInventoryReceiving}
                            defaultValue={this.state.googlesheet.receiving}
                        />
                        <div className="form_btns">
                            <Button
                                type={"button"}
                                color="inherit"
                                onClick={this.handleCloseGoogleSheetModal}
                            >
                                Cancel
                            </Button>
                            <Button
                                type={"submit"}
                                autoFocus
                                color="inherit"
                                disabled={this.state.formSubmitting}
                            >
                                {this.state.formSubmitting
                                    ? "Saving..."
                                    : "Save"}
                            </Button>
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );

        const modalQuickbooksContainer = (
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={this.state.openQuickbooksModal}
                onClose={this.handleCloseQuickbooksModal}
                className="ordermodal"
            >
                <Box component={"form"} onSubmit={this.handleQuickbooksSubmit}>
                    {/* <DialogTitle id="responsive-dialog-title" className="modal_dia_title">Set Quickbooks settings
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.handleCloseQuickbooksModal}
                        aria-label="close"
                        className="close_dialog_button"
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>                    
                    <DialogContent> */}
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
                                onClick={this.handleCloseQuickbooksModal}
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
                            Set Quickbooks settings
                        </Typography>
                        {this.state.message != "" && (
                            <Alert
                                style={{ marginBottom: "20px" }}
                                severity="error"
                            >
                                {this.state.message}
                            </Alert>
                        )}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="us"
                            label="US"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleUS}
                            defaultValue={this.state.quickbooks.us}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="uk"
                            label="UK"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleUK}
                            defaultValue={this.state.quickbooks.uk}
                        />
                        <div className="form_btns">
                            <Button
                                type={"button"}
                                color="inherit"
                                onClick={this.handleCloseQuickbooksModal}
                            >
                                Cancel
                            </Button>
                            <Button
                                type={"submit"}
                                autoFocus
                                color="inherit"
                                disabled={this.state.formSubmitting}
                            >
                                {this.state.formSubmitting
                                    ? "Saving..."
                                    : "Save"}
                            </Button>
                        </div>
                    </DialogContent>
                </Box>
            </Dialog>
        );

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
                        <Container
                            maxWidth="lg"
                            sx={{ mt: 4, mb: 4 }}
                            className="dashboard_home_container"
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Container className="settings_container">
                                        <Box
                                            m={1}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            {/* <Typography component="h2" className="admin_page_title">{this.state.title} <img src={helpIcon} alt="help icon" className="helpicon" onClick={this.showdescription}/></Typography> */}
                                        </Box>
                                        <Typography
                                            component="div"
                                            className="pagedescription"
                                            display={this.state.showdesc}
                                        >
                                            <div className="admin_desc_info">
                                                In the settings section, you can
                                                find the google sheets ID’s of
                                                each ID type and license key for
                                                held orders, delayed orders,
                                                return orders, inventory, and
                                                receiving. Access to this area
                                                is limited and only
                                                administrators can access this
                                                page.
                                            </div>
                                        </Typography>

                                        <Typography
                                            component="div"
                                            className="settingsBlock"
                                            xs={12}
                                        >
                                            <Box
                                                m={1}
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                className="boxsettingtop"
                                            >
                                                <Typography
                                                    component="h2"
                                                    variant="h6"
                                                    color="primary"
                                                    gutterBottom
                                                >
                                                    Advance Settings
                                                </Typography>
                                            </Box>
                                            <List
                                                sx={{
                                                    width: "100%",
                                                    bgcolor: "background.paper",
                                                }}
                                                className="setting_block_list"
                                            >
                                                <ListItem key={1}>
                                                    <ListItemText
                                                        id="setting-1"
                                                        primary="Maintenance"
                                                    />
                                                    <Typography
                                                        edge="end"
                                                        aria-label="right"
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            alignItems="center"
                                                        >
                                                            <Typography>
                                                                Off
                                                            </Typography>
                                                            <AntSwitch
                                                                onChange={
                                                                    this
                                                                        .handleMaintenanceMode
                                                                }
                                                                checked={
                                                                    this.state
                                                                        .maintenancemode
                                                                }
                                                                inputProps={{
                                                                    "aria-label":
                                                                        "ant design",
                                                                }}
                                                            />
                                                            <Typography>
                                                                On
                                                            </Typography>
                                                        </Stack>
                                                    </Typography>
                                                </ListItem>
                                            </List>
                                        </Typography>
                                    </Container>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }
}

export default Settings;
