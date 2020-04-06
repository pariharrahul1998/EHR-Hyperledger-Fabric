import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import {Navbar, Nav} from "react-bootstrap";
import './Home.css';

class Home extends Component {
    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="/"><span style={{fontSize: "1.8em"}}>HealthCare</span> </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link active href="/#home"><span style={{fontSize: "1.2em"}}>Home</span></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Home;