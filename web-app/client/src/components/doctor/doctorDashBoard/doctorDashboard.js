import React, {useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PersonIcon from '@material-ui/icons/Person';
import DoctorPersonalInfo from './doctorPersonalInfo';
import ExitToApp from "@material-ui/icons/ExitToApp";
import {Redirect} from "react-router-dom";
import axios from "axios";
import {ADDRESS} from "../../constants";
import copyright from '../../copyright';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import ListSubheader from "@material-ui/core/ListSubheader";
import AssignmentIcon from "@material-ui/icons/Assignment";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import GenerateEHR from "./generateEHR";


const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: '100%',
    },
}));
var doctorFormat = {
    DOB: '',
    aadhaar: '',
    address: '',
    appointments: [],
    currentHospital: '',
    firstName: '',
    gender: '',
    id: '',
    lastName: '',
    medicalRegistrationNo: '',
    patients: [],
    patientsAttended: [],
    phone: '',
    sessionKey: '',
    specialisation: '',
    type: 'Doctor',
    userName: ''
};

export default function DoctorDashBoard() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [doctorData, setDoctorData] = React.useState(doctorFormat);
    const [open, setOpen] = React.useState(true);
    const [logOut, setLogOut] = React.useState(false);
    const [doctorInfoDisplay, setDoctorInfoDisplay] = React.useState(false);
    const [generateEHRDisplay, setGenerateEHRDisplay] = React.useState(false);

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                let doctorCredentials = JSON.parse(localStorage.getItem('doctorToken'));
                console.log(doctorCredentials);
                if (!doctorCredentials) {
                    setLogOut(true);
                } else {
                    doctorCredentials.type = "Doctor";
                    console.log(doctorCredentials);
                    let response = await axios.post(ADDRESS + `readAsset`, doctorCredentials);
                    if (response !== null) {
                        response = response.data;
                        console.log(response);
                        response = JSON.parse(response);
                        response.sessionKey = doctorCredentials.sessionKey;
                        console.log(response);
                        setDoctorData(response || {});
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchDoctorData();
    }, []);
    console.log(doctorData + 1);

    const handleLogOut = async () => {
        console.log("herer");
        try {
            let doctorCredentials = JSON.parse(localStorage.getItem('doctorToken'));
            doctorCredentials.id = doctorCredentials.registrationId;
            let response = await axios.post(ADDRESS + `logOut`, doctorCredentials);
            response = response.data;
            console.log(response);
            if (response === 'Correct') {
                setLogOut(true);
                localStorage.removeItem("doctorToken");
            } else {
                //handle the failure by a error message stating why it failed
            }
        } catch (e) {
            //handle the error by giving out a error messeage saying the logOUt failed
        }
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const visibilityHandlerDoctorInfo = () => {
        var x = document.getElementById("doctorInfo");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setDoctorInfoDisplay(true);
            } else {
                x.style.display = "none";
                setDoctorInfoDisplay(false);
            }
        }
    };
    const visibilityHandlerGenerateEHR = () => {
        var x = document.getElementById("generateEHR");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setGenerateEHRDisplay(true);
            } else {
                x.style.display = "none";
                setGenerateEHRDisplay(false);
            }
        }
    };

    console.log(doctorInfoDisplay);
    if (doctorInfoDisplay) {
        console.log("here");
        var doctorInfo = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <DoctorPersonalInfo data={JSON.stringify(doctorData)}/>
            </Paper>
        );
    }
    console.log(generateEHRDisplay);
    if (generateEHRDisplay) {
        console.log("there");
        var generateEHR = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <GenerateEHR data={JSON.stringify(doctorData)}/>
            </Paper>
        );
    }


    const mainListItems = (
        <div>
            <ListItem button onClick={visibilityHandlerDoctorInfo}>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="DoctorDashBoard"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerGenerateEHR}>
                <ListItemIcon>
                    <NoteAddIcon/>
                </ListItemIcon>
                <ListItemText primary="Generate EHR"/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <PeopleIcon/>
                </ListItemIcon>
                <ListItemText primary="Customers"/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <BarChartIcon/>
                </ListItemIcon>
                <ListItemText primary="Reports"/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <LayersIcon/>
                </ListItemIcon>
                <ListItemText primary="Integrations"/>
            </ListItem>
        </div>
    );
    const secondaryListItems = (
        <div>
            <ListSubheader inset>Saved reports</ListSubheader>
            <ListItem button>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="Current month"/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="Last quarter"/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="Year-end sale"/>
            </ListItem>
        </div>
    );

    if (logOut) {
        return <Redirect to={{
            pathname: '/',
        }}/>;
    }

    return (
        <div className={classes.root} id='mainDiv'>
            <CssBaseline/>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Doctor Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={visibilityHandlerDoctorInfo}>
                        <PersonIcon/>
                    </IconButton>
                    <IconButton color="secondary" onClick={handleLogOut}>
                        <ExitToApp/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List>{mainListItems}</List>
                <Divider/>
                <List>{secondaryListItems}</List>
            </Drawer>

            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>

                    <Grid container spacing={3} justify='center' alignContent='center'>
                        {/*Recent DoctorPersonalInfo */}
                        <Grid item xs={12} style={{display: 'none'}} id="doctorInfo">
                            {doctorInfo}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="generateEHR">
                            {generateEHR}
                        </Grid>

                    </Grid>
                    <Box pt={4}>
                        <copyright.Copyright/>
                    </Box>
                </Container>
            </main>
        </div>
    );
}