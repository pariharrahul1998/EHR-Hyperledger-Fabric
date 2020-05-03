import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import {ADDRESS} from "../../constants";
import PublishIcon from '@material-ui/icons/Publish';
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";


const theme = createMuiTheme();
const avatar = {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
};
const paper = {
    marginTop: theme.spacing(2),
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
const useStyles = makeStyles(theme => ({
    root: {},
}));
var appointmentFormat = {
    appointmentId: '',
    hospitalId: '',
    patientId: '',
    time: '',
    description: '',
};
export default function GenerateEHR(props) {
    const classes = useStyles();
    const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
    const [appointmentId, setAppointmentId] = React.useState("");
    const [selectedEHRFile, setSelectedEHRFile] = React.useState('');
    const [appointment, setAppointment] = React.useState(appointmentFormat);
    var EHRSchema = {
        appointmentId: appointmentId,
        hospitalId: updatedData.currentHospital,
        patientId: appointment.patientId,
        doctorId: updatedData.medicalRegistrationNo,
        documentType: 'EHR',
    };
    let chosenFilename = "No File Selected";
    var doctor = updatedData;
    var appointments = doctor.appointments;
    console.log(updatedData);

    const manageAppointmentDisplay = () => {
        var x = document.getElementById("currentAppointment");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    };

    const handleChange = async (event) => {
        event.preventDefault();
        if (event.target.name === 'appointmentId') {
            setAppointmentId(event.target.value);
            let response = "";
            try {
                console.log(EHRSchema);
                doctor.listType = 'appointments';
                doctor.assetId = event.target.value;
                response = await axios.post(ADDRESS + `readIndividualAsset`, doctor);
                response = response.data;
                console.log(response);
                if (response !== 'Failed to fetch asset') {
                    response = JSON.parse(response);
                    setAppointment(response);
                    console.log(response);
                    manageAppointmentDisplay();
                } else {
                    //show error message
                    console.log(response);
                }
            } catch (e) {
                //show error message
                console.log("failed to connect to the server");
            }
        } else if (event.target.name === 'EHR') {
            console.log(event.target.files[0].name);
            setSelectedEHRFile(event.target.files[0]);
        }
        console.log("asd");
    };

    const uploadEHR = async (event) => {
        event.preventDefault();

        let response = "";
        try {
            let data = new FormData();
            data.append('file', selectedEHRFile, selectedEHRFile.name);
            data.append('appointmentId', EHRSchema.appointmentId);
            data.append('hospitalId', EHRSchema.hospitalId);
            data.append('patientId', EHRSchema.patientId);
            data.append('doctorId', EHRSchema.doctorId);
            data.append('time', new Date().toLocaleString());
            data.append('documentType', EHRSchema.documentType);
            data.append('sessionKey', doctor.sessionKey);
            response = await axios.post(ADDRESS + `generateEHR`, data);
            response = response.data;
            if (response === 'Correct') {
                manageAppointmentDisplay();
                setSelectedEHRFile('');
                setAppointmentId('');
                setAppointment(appointmentFormat);
            } else {
                console.log(response);
            }
        } catch (e) {
            //show error message
            console.log(e);
        }
    };

    function createAppointmentMenuItems() {
        console.log("hert");
        console.log(appointments);
        let items = [];
        for (let i = 0; i < appointments.length; i++) {
            items.push(<MenuItem
                key={i}
                value={appointments[i]}>{appointments[i]}</MenuItem>);
        }
        return items;
    }

    return (
        <React.Fragment>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div style={paper}>
                    <Avatar style={avatar}>
                        <PublishIcon/>
                    </Avatar>
                    <Title>Upload EHR</Title>
                    <form style={form} onSubmit={uploadEHR}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField variant="outlined"
                                           required
                                           fullWidth
                                           select
                                           id="select"
                                           label="Appointment"
                                           name="appointmentId"
                                           autoComplete="appointment"
                                           classes={{root: classes.root}}
                                           defaultValue={EHRSchema.appointmentId}
                                           onChange={handleChange}
                                >
                                    {createAppointmentMenuItems()}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} id='currentAppointment' style={{display: 'none'}}>
                            <Grid item xs={12}>
                                <Typography component="p" variant="h6" align='center'>
                                    Patient Name : {localStorage.getItem(appointment.patientId)}
                                    <br/>
                                    Time: {appointment.time}
                                    <br/>
                                    Description : {appointment.description}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                    color="primary"
                                >
                                    Choose EHR
                                    <input
                                        type="file"
                                        style={{display: "none"}}
                                        onChange={handleChange}
                                        name="EHR"
                                    />
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align='center'>
                                    {selectedEHRFile === '' ? chosenFilename : selectedEHRFile.name}
                                </Typography>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={submit}
                            >
                                Upload EHR
                            </Button>
                        </Grid>
                    </form>
                </div>
            </Container>

        </React.Fragment>
    );
}
