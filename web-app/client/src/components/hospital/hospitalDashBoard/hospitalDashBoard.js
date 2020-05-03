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
import HospitalPersonalInfo from './hospitalPersonalInfo';
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
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AssignDoctor from "./assignDoctor";

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
var hospitalFormat = {
    address: "",
    appointments: [],
    bills: [],
    doctors: [],
    laboratories: [],
    name: "",
    patients: [],
    pharmacies: [],
    phone: "",
    registrationId: "",
    sessionKey: "",
    type: "Hospital",
    userName: ""
};

export default function HospitalDashBoard() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [hospitalData, setHospitalData] = React.useState(hospitalFormat);
    const [open, setOpen] = React.useState(true);
    const [logOut, setLogOut] = React.useState(false);
    const [hospitalInfoDisplay, setHospitalInfoDisplay] = React.useState(false);
    const [assignDoctorDisplay, setAssignDoctorDisplay] = React.useState(false);

    useEffect(() => {
        const fetchHospitalData = async () => {
            try {
                let hospitalCredentials = JSON.parse(localStorage.getItem('hospitalToken'));
                console.log(hospitalCredentials);
                if (!hospitalCredentials) {
                    setLogOut(true);
                } else {
                    hospitalCredentials.type = "Hospital";
                    console.log(hospitalCredentials);
                    let response = await axios.post(ADDRESS + `readAsset`, hospitalCredentials);
                    if (response !== null) {
                        response = response.data;
                        response = JSON.parse(response);
                        response.sessionKey = hospitalCredentials.sessionKey;
                        console.log(response);
                        setHospitalData(response || {});
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchHospitalData();
    }, []);
    console.log(hospitalData + 1);

    const handleLogOut = async () => {
        console.log("herer");
        try {
            let hospitalCredentials = JSON.parse(localStorage.getItem('hospitalToken'));
            hospitalCredentials.id = hospitalCredentials.registrationId;
            let response = await axios.post(ADDRESS + `logOut`, hospitalCredentials);
            response = response.data;
            console.log(response);
            if (response === 'Correct') {
                setLogOut(true);
                localStorage.removeItem("hospitalToken");
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

    const visibilityHandlerHospitalInfo = () => {
        var x = document.getElementById("hospitalInfo");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setHospitalInfoDisplay(true);
            } else {
                x.style.display = "none";
                setHospitalInfoDisplay(false);
            }
        }
    };
    const visibilityHandlerAssignDoctor = () => {
        var x = document.getElementById("assignDoctor");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setAssignDoctorDisplay(true);
            } else {
                x.style.display = "none";
                setAssignDoctorDisplay(false);
            }
        }
    };


    console.log(hospitalInfoDisplay);
    if (hospitalInfoDisplay) {
        console.log("here");
        var hospitalInfo = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <HospitalPersonalInfo data={JSON.stringify(hospitalData)}/>
            </Paper>
        );
    }

    if (assignDoctorDisplay) {
        var assignDoctor = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <AssignDoctor data={JSON.stringify(hospitalData)}/>
            </Paper>
        );
    }

    const mainListItems = (
        <div>
            <ListItem button onClick={visibilityHandlerHospitalInfo}>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="HospitalDashBoard"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerAssignDoctor}>
                <ListItemIcon>
                    <PersonAddIcon/>
                </ListItemIcon>
                <ListItemText primary="Assign Doctor"/>
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
                        Hospital Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={visibilityHandlerHospitalInfo}>
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
                        {/* Recent HospitalPersonalInfo */}
                        <Grid item xs={12} style={{display: 'none'}} id="hospitalInfo">
                            {hospitalInfo}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="assignDoctor">
                            {assignDoctor}
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