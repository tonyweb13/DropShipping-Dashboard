import React, { Component } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {
    Container, 
    Grid, 
    Paper,  
    CssBaseline,
    AppBar,
    Divider,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Typography,
    IconButton,
    Button,
    Box,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Slide,
    Dialog,
    Toolbar,
    Alert,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    FormHelperText
} from "@mui/material"
import CommonSection from '../Common/CommonSection'
import axios from "axios"
import CloseIcon from '@mui/icons-material/Close'
import { isEmpty } from "lodash"


class Index extends Component {
    constructor(props){
        super(props)       
        
        this.state = {
          location: 'adminprofile',
          title: 'Admin Profile',
          firstname:'',
          emailaddress:'',
          econfirmpass:'',
          eoldpass:'',
          formSubmitting:true,
          user: {
            old_password:'',
            new_password:'',
            confirm_password:'',
            first_name:'',
            email:''
          },
          openModal:false,
          reloginmsg:'',
          etakenemail:'',
          company:'',
          companydisable:false
        }
        this.handleOldPassword = this.handleOldPassword.bind(this);
        this.handleNewPassword = this.handleNewPassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
        this.handleProfileSubmit = this.handleProfileSubmit.bind(this);
        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
    }

    componentDidMount(){
      this.getUserAccountInfo();
      let state = localStorage["appState"];
      if (state) {
        let AppState = JSON.parse(state);
        let disablecompany = (AppState.user.role=='Member')?true:false;
        this.setState({ company: AppState.store, companydisable:disablecompany });
      }
    }
    getUserAccountInfo = (data) => {
      axios.get("api/profile").then(response=>{
          let userinfo = response.data.user;
          let cname = (userinfo.first_name!='' && !isEmpty(userinfo.first_name))?userinfo.first_name:'';
          this.setState({firstname:cname, emailaddress:userinfo.email});
      });
    }
    handleProfileSubmit(e) {
      e.preventDefault();      
      
      this.setState({formSubmitting:true});
      this.setState({eoldpass:'', econfirmpass:'', etakenemail:''});
      let userData = this.state.user;
      let haserrormsg = false;
      
      if(userData.confirm_password != userData.new_password){
        this.setState({econfirmpass:'New password and confirm password is not the same.'});
        haserrormsg = true;
      }else if(userData.old_password!='' && (userData.confirm_password=='' && userData.new_password=='') ){
        this.setState({econfirmpass:'Please input new password and confirm password.'});
        haserrormsg = true;
      }else{
        this.setState({econfirmpass:''}); 
        haserrormsg = false;
      }
      if((userData.confirm_password!='' || userData.new_password!='') && userData.old_password==''){
        this.setState({eoldpass:'Enter current password.'});
        haserrormsg = true; 
      }
      if(userData.confirm_password=='' && userData.new_password=='' && userData.old_password==''){
        this.setState({eoldpass:'', econfirmpass:''}); 
      }
      if(haserrormsg){
          this.setState({formSubmitting:false});
          // haserrormsg = true;
      }
      
      userData.first_name = (userData.first_name=='') ?this.state.firstname:userData.first_name;
      userData.email = (userData.email=='') ?this.state.emailaddress:userData.email;
      
      if(haserrormsg==false){
        axios.post('api/updateadminprofile', userData).then(response => {
            this.setState({formSubmitting: false});
            if(response.data.errormsg=='oldpasserror'){
              this.setState({eoldpass:'Old password is incorrect.'});
            }else{
              if(response.data.success=="EmailTaken"){
                this.setState({etakenemail:'Email is already taken.'});
              }else{
                if(response.data.success=="ChangeEmail"){
                  this.setState({reloginmsg:'You will be redirect to the login page.'});
                }
                this.handleOpenModal();
                this.setState({eoldpass:''});
              }
              
              // location.reload();
            }
        });
      }
    }
    handleFirstName(e){
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, first_name: value
            }, firstname:value
        }));
    }
    handleEmail(e){
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, email: value
            },emailaddress: value
        }));
    }
    handleOldPassword(e){
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, old_password: value
            }
        }));
    }
    handleNewPassword(e){
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, new_password: value
            }
        }));
    }
    handleConfirmPassword(e){
        let value = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, confirm_password: value
            }
        }));
    }
    handleOpenModal = () => {
      this.setState({ openModal:true });
    }

    handleCloseUpdateModal = () => {
      this.setState({ openModal:false});

      if(this.state.reloginmsg!=''){
        axios.post('api/logout').then(response=> {
          return response;
        }).then(json => {
            if (json.data.success) {
                let userData = {};
                let appState = {
                    isLoggedIn: false,
                    user: userData
                };
                localStorage["appState"] = JSON.stringify(appState);
                location.reload()
            }
        }).catch(error=> {
        });
      }else{
        location.reload();
      }
    }
    
    render() {
        const mdTheme = createTheme();
        const modalContainer = (
          <Dialog                
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                className="ordermodal"
              >
              <Box component={"form"} >
                <AppBar sx={{ position: 'relative' }}>
                  <Toolbar>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" className="alertTopHeader">Prep kanga</Typography>   
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={this.handleCloseUpdateModal}
                      aria-label="close"
                      className="close_dialog_button"
                    >
                      <CloseIcon />
                    </IconButton>
                                     
                  </Toolbar>
                </AppBar>
                <DialogContent>  
                  <Typography component="div" className="dlg_msg">
                    Successfully updated profile.
                    {this.state.reloginmsg!='' ? <div>{this.state.reloginmsg}</div>:'' }
                  </Typography>  
                  <div class="form_btns">            
                    <Button type={"button"} color="inherit" onClick={this.handleCloseUpdateModal}>
                    Close							
                    </Button>
                  </div> 
                </DialogContent>
                </Box>
              </Dialog>
        );
        return (
          <ThemeProvider theme={mdTheme}>
               <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <CommonSection title={this.state.title} location={this.state.location} />
                <Box
                  component="main"
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                  }}
                >
                  
                  <Toolbar />
                  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="dashboard_home_container">
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography component="h2" className="subpage_title">{this.state.title}</Typography>
                   <Box component={"form"} onSubmit={this.handleProfileSubmit}>
                        <Typography component="div" className="profile_container">
                            <TextField
                                autoFocus
                                margin="dense"
                                id="first_name"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={this.handleFirstName}
                                value={this.state.firstname}
                                disabled={this.state.companydisable}
                              />                            
                              <TextField
                                autoFocus
                                margin="dense"
                                id="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="standard"
                                onChange={this.handleEmail}
                                value={this.state.emailaddress}
                              />
                              {this.state.etakenemail != '' && <Alert severity="error">{this.state.etakenemail}</Alert>} 
                            <TextField
                                autoFocus
                                margin="dense"
                                id="old_password"
                                fullWidth
                                label="Old Password (if blank, password will not be changed)"
                                type="password"
                                autoComplete="current-password"
                                variant="standard"
                                onChange={this.handleOldPassword}
                              />     
                              {this.state.eoldpass != '' && <Alert severity="error">{this.state.eoldpass}</Alert>} 
                            <TextField
                                autoFocus
                                margin="dense"
                                id="password"
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                variant="standard"
                                onChange={this.handleNewPassword}
                              />     
                            <TextField
                                autoFocus
                                margin="dense"
                                id="confirm_password"
                                fullWidth
                                label="Confirm password"
                                type="password"
                                autoComplete="current-password"
                                variant="standard"
                                onChange={this.handleConfirmPassword}
                              />   
                              {this.state.econfirmpass != '' && <Alert severity="error">{this.state.econfirmpass}</Alert>}  
                              <div className="form_btns">
                                  <Button type={"submit"} color="inherit">
                                    Save
                                  </Button>    
                              </div>                       
                        </Typography>
                    </Box>
                 </Grid>
               </Grid>
             </Container>
           </Box>
         </Box>
         {modalContainer}
       </ThemeProvider>       
        )
    }
}

export default Index