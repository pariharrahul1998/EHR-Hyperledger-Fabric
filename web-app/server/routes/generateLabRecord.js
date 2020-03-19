const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');


router.post('/', async (req, res) => {

    try {
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: req.body.laboratoryId,
            discovery: {enabled: true, asLocalhost: true}
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('EHR');

        // Submit the specified transaction.
        let response = await contract.submitTransaction('generateLabRecord', JSON.stringify(req.body));
        response = JSON.stringify(response.toString());
        console.log(response);

        // Disconnect from the gateway.
        await gateway.disconnect();

        return response;


    } catch (error) {
        console.error(`Failed to generate the lab record for the patient  ${req.body.patientId}: ${error}`);
        res.send("Failed to generate lab record ");
        process.exit(1);
    }
});


module.exports = router;
