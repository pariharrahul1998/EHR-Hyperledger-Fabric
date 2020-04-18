import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Home'
import patientLogin from './components/patient/patientLogin'
import registerPatient from "./components/patient/registerPatient";
import mediBlock from "./components/mediBlock";

class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Route path="/" exact component={Home}/>
                    <Route path="/mediBlock" exact component={mediBlock}/>
                        <Route path="/patientLogin" exact component={patientLogin}/>
                        <Route path="/registerPatient" exact component={registerPatient}/>
                </Router>
            </div>
    );
    }
    }

    export default App;
