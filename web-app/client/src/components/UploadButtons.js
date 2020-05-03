import React, {Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import axios from 'axios';
import {ADDRESS} from "./constants";
import {isYearAndMonthViews} from "@material-ui/pickers/_helpers/date-utils";

class UploadButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            loaded: 0,
            isTrue: false,
            files: ''
        }
    }

    handleSelectedFile = async (event) => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        });
        console.log(this.state);
    };
    handleUpload = async (event) => {
        event.preventDefault();
        try {
            const data = new FormData();
            console.log(this.state);
            data.append('file', this.state.selectedFile, this.state.selectedFile.name);
            data.append('name', this.state.selectedFile.name);

            console.log(data);
            // let response = await axios.post(ADDRESS + `uploadFile`, data);
            await axios.post(ADDRESS + `uploadFile`, {
                collectionName: 'EHRCollection',
                type: 'EHR'
            }, {responseType: "blob"})
                .then(res => {
                    console.log(res);
                    //let picture = new Buffer(res).toString('base64');
                    let url = URL.createObjectURL(res.data);
                    console.log(url);
                    this.setState({isTrue: true, files: url});
                });
            let imageURL = URL.createObjectURL(response.data);
            console.log(imageURL);
            console.log(response.data);
        } catch (e) {
            console.log(e);
        }

    };

    render() {
        console.log(this.state.isTrue);
        if (this.state.isTrue) {
            console.log("ksjbdfkl");
            return (<div><img src={this.state.files} alt="{{ image }}"/></div>)
        } else {
            return (
                <div className="App">
                    <input type="file" name="" id="" onChange={this.handleSelectedFile}/>
                    <button onClick={this.handleUpload}>Upload</button>
                    <div> {Math.round(this.state.loaded, 2)} %</div>
                </div>
            )
        }

    }
}

export default UploadButtons;