import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Home'


class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Route path="/" exact component={Home}/>
                </Router>
            </div>
        );
    }
}

export default App;
