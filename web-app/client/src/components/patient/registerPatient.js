import React, {Component} from 'react'
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {ADDRESS} from "../constants";
import {
    Button, Container, Divider, Grid, GridColumn, GridRow, Header, Icon,
    Image, List, Menu, Segment, Input
} from 'semantic-ui-react';

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
            type: 'Patient',
            isRegistered: false
        }

    }

    render() {
        if (this.state.isRegistered === true) {
            return <Redirect to='/'/>
        }
        return (
            <div>
                <form onSubmit={this.state.handleRegisterPatient}>
                    First Name : <input type="text" name="firstName" onChange={this.changeStateValues}
                                        placeholder={this.state.firstName}
                                        required/> <br/> <br/>

                    Last Name : <input type="text" name="lastName" onChange={this.changeStateValues}
                                       placeholder={this.state.lastName} required={}/>

                    Address : <input type="text" name="address" onChange={this.changeStateValues}
                                     placeholder={this.state.address}
                                     required/> <br/> <br/>

                    Aadhaar : <input type="number" name="aadhaar" onChange={this.changeStateValues}
                                     placeholder={this.state.aadhaar} required={}/>

                    DOB : <input type="text" name="DOB" onChange={this.changeStateValues}
                                        placeholder={this.state.DOB}
                                        required/> <br/> <br/>

                    Gender : <input type="text" name="gender" onChange={this.changeStateValues}
                                       placeholder={this.state.gender} required={}/>

                    First Name : <input type="text" name="firstName" onChange={this.changeStateValues}
                                        placeholder={this.state.firstName}
                                        required/> <br/> <br/>

                    Last Name : <input type="text" name="" onChange={this.changeStateValues}
                                       placeholder={this.state.lastName} required={}/>
                </form>
            </div>
        );
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

        let response = await axios.post(ADDRESS+`registerVoter`, this.state);
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