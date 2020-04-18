import React, {Component} from 'react'
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {ADDRESS} from "../constants";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import copyright from '../copyright';
import MenuItem from "@material-ui/core/MenuItem";

const theme = createMuiTheme();

const avatar = {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
};
const paper = {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};
const form = {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
};
const submit = {
    margin: theme.spacing(3, 0, 2),
};

class registerPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            address: '',
            aadhaar: '',
            DOB: '',
            gender: '',
            bloodGroup: '',
            userName: '',
            password: '',
            phone: '',
            type: 'Patient',
            SMSUpdates: false,
            isRegistered: false
        }

    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    submitForm = async (event) => {

        this.setState({
            spinner: true
        });
        const patientDetails = {
            userName: this.state.userName,
            password: this.state.password
        };
        let response = await axios.post(ADDRESS + `registerPatient`, patientDetails);
        if (typeof response.data === "object") {
            localStorage.setItem("token", this.state.userName);
            this.setState({
                loggedIn: true,
            });
        } else {
            this.setState({
                spinner: false,
                alertShow: true,
                alertType: "danger",
                alertData: response.data,
            });
        }
    };

    render() {
        if (this.state.isRegistered === true) {
            return <Redirect to='/'/>
        } else {
            return (
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div style={paper}>
                        <Avatar style={avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Patient SignUp
                        </Typography>
                        <form style={form} noValidate onSubmit={this.submitForm}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        defaultValue={this.state.firstName}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                        defaultValue={this.state.lastName}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField variant="outlined"
                                               required
                                               fullWidth
                                               select
                                               id="select"
                                               label="Gender"
                                               name="gender"
                                               autoComplete="gender"
                                               defaultValue={this.state.gender}
                                               onChange={this.handleChange}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="date"
                                        label="Date of Birth"
                                        type="date"
                                        defaultValue={this.state.DOB}
                                        onChange={this.handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="phone"
                                        label="Phone No."
                                        name="phone"
                                        autoComplete="phone"
                                        defaultValue={this.state.phone}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="bloodGroup"
                                        name="bloodGroup"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="bloodGroup"
                                        label="Blood Group"
                                        autoFocus
                                        defaultValue={this.state.bloodGroup}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="aadhaar"
                                        label="Aadhaar"
                                        name="aadhaar"
                                        autoComplete="45454545455"
                                        defaultValue={this.state.aadhaar}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="address"
                                        label="Address"
                                        name="address"
                                        autoComplete="India"
                                        defaultValue={this.state.aadhaar}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="userName"
                                        label="UserName"
                                        name="userName"
                                        autoComplete="userName"
                                        defaultValue={this.state.userName}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        defaultValue={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value="allowExtraEmails" color="primary"/>}
                                        label="I want to receive information and updates via sms."
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={submit}
                            >
                                Sign Up
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link href="/patientLogin" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={5}>
                        <copyright.Copyright/>
                    </Box>
                </Container>
            );
        }

    }

    handleRegisterPatient = async (event) => {

        event.preventDefault();

        if (validateName(event.target.firstName.value) === false) {
            alert("First Name of Register Voter is not compatible");
            return;
        }

        if (validateName(event.target.lastName.value) === false) {
            alert("Last Name of Register Voter is not compatible");
            return;
        }

        if (validateMobilNo(event.target.aadhaar.value) === false) {
            alert("Mobile Number is Invalid");
            return;
        }

        let response = await axios.post(ADDRESS + `registerVoter`, this.state);
        if (response.data === 'Correct') {
            alert("Voter Successfully Registered");
            this.setState({
                isRegistered: true
            });
        }
        console.log(response.data);
    };

    changeStateValues = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };
}

export default registerPatient;