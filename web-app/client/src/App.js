import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Home'
import patientLogin from './components/patient/patientLogin'
import registerPatient from "./components/patient/registerPatient";
import mediBlock from "./components/mediBlock";
import registerDoctor from "./components/doctor/registerDoctor";
import doctorLogin from "./components/doctor/doctorLogin";
import hospitalLogin from "./components/hospital/hospitalLogin";
import registerHospital from "./components/hospital/registerHospital";
import patientDashBoard from "./components/patient/patientDashBoard/patientDashBoard";
import hospitalDashBoard from "./components/hospital/hospitalDashBoard/hospitalDashBoard";
import Dashboard from "./components/DashBoard/DashBoard";
import doctorDashboard from "./components/doctor/doctorDashBoard/doctorDashboard";
import UploadButtons  from "./components/UploadButtons";
class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Route path="/" exact component={Home}/>
                    <Route path="/mediBlock" exact component={mediBlock}/>
                    <Route path="/patientLogin" exact component={patientLogin}/>
                    <Route path="/registerPatient" exact component={registerPatient}/>
                    <Route path="/registerDoctor" exact component={registerDoctor}/>
                    <Route path="/doctorLogin" exact component={doctorLogin}/>
                    <Route path="/registerHospital" exact component={registerHospital}/>
                    <Route path="/HospitalLogin" exact component={hospitalLogin}/>
                    <Route path="/patientDashBoard" exact component={patientDashBoard}/>
                    <Route path="/hospitalDashBoard" exact component={hospitalDashBoard}/>
                    <Route path="/dashboard" exact component={Dashboard}/>
                    <Route path="/doctorDashBoard" exact component={doctorDashboard}/>
                    <Route path="/uploadButton" exact component={UploadButtons}/>
                </Router>
            </div>
        );
    }
}

export default App;
