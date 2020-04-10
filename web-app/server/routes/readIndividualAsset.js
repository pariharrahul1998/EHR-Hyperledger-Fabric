const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');

router.get('/', async (req, res) => {

    try {
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = new FileSystemWallet(walletPath);
        let id;
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        //now according to the various entities present check for the request type
        if (req.body.type === 'Doctor') {
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.medicalRegistrationNo,
                discovery: {enabled: true, asLocalhost: true}
            });
            id = req.body.medicalRegistrationNo;
        } else if (req.body.type === 'Patient') {
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.userName,
                discovery: {enabled: true, asLocalhost: true}
            });
            id = req.body.userName;
        } else if (req.body.type === 'Laboratory' || req.body.type === 'Pharmacy' || req.body.type === 'Hospital' || req.body.type === 'Researcher' || req.body.type === 'Insurance') {
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.registrationId,
                discovery: {enabled: true, asLocalhost: true}
            });
            id = req.body.registrationId;
        }
        let sessionKeyExists = await handler.verifySessionKey(id, req.body.sessionKey);
        if (!sessionKeyExists) {
            res.send("Incorrect");
        } else {
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('EHR');

            //now according to the various entities present check for the request type
            let response;
            if (req.body.type === 'Doctor') {
                // Submit the specified transaction.
                req.body.doctorId = req.body.medicalRegistrationNo;
                response = await contract.submitTransaction('readDoctorAssets', JSON.stringify(req.body));
            } else if (req.body.type === 'Patient') {
                // Submit the specified transaction.
                req.body.patientId = req.body.userName;
                response = await contract.submitTransaction('readPatientAssets', JSON.stringify(req.body));
            } else if (req.body.type === 'Laboratory') {
                // Submit the specified transaction.
                req.body.laboratoryId = req.body.registrationId;
                response = await contract.submitTransaction('readLaboratoryAssets', JSON.stringify(req.body));
            } else if (req.body.type === 'Pharmacy') {
                // Submit the specified transaction.
                req.body.pharmacyId = req.body.registrationId;
                response = await contract.submitTransaction('readPharmacyAssets', JSON.stringify(req.body));
            } else if (req.body.type === 'Hospital') {
                // Submit the specified transaction.
                req.body.hospitalId = req.body.registrationId;
                response = await contract.submitTransaction('readHospitalAssets', JSON.stringify(req.body));
            } else if (req.body.type === 'Researcher') {
                // Submit the specified transaction.
                req.body.researcherId = req.body.registrationId;
                response = await contract.submitTransaction('readResearcherAssets', JSON.stringify(req.body));
            } else if (req.body.type === 'Insurance') {
                // Submit the specified transaction.
                req.body.insurerId = req.body.registrationId;
                response = await contract.submitTransaction('readInsurerAssets', JSON.stringify(req.body));
            }

            console.log(JSON.stringify(response.toString()));

            // Disconnect from the gateway.
            await gateway.disconnect();

            res.send(response);
        }
    } catch (error) {
        console.error(`Failed to fetch asset the user : ${error}`);
        res.send("Failed to fetch asset");
        process.exit(1);
    }
});


module.exports = router;
