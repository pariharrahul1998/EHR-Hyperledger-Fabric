// noinspection BadExpressionStatementJS
'use-strict';
const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');

async function main() {

    try {

        const walletPath = path.join(process.cwd(), '../../wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`************** Wallet path: ${walletPath} **************************`);


        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('Please run enrollAdmin.js file first ... ');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, {wallet, identity: 'admin', discovery: {enabled: true, asLocalhost: true}});

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.

        const contract = network.getContract('EHR');
        let asset = {};
        //asset.id = "testingHospital1";
        asset.password = "password";
        asset.id = "hiRahul";
        let response = ["Incorrect"];
        response = await contract.evaluateTransaction('readMyAsset', JSON.stringify(asset));
        // var patient = 'Patient';
        // console.log(typeof patient);
        // let requestType = 'pariharrahul2002';
        // if (requestType === 'pariharrahul2002') {
        //     let queryString = {
        //         "selector": {
        //             "userName": requestType
        //         }
        //     };
        //
        //     response = await contract.evaluateTransaction('queryWithQueryString', JSON.stringify(queryString));
        //     response = JSON.parse(response.toString());
        //     console.log(response);
        // }
        console.log(JSON.parse(response.toString()));
        gateway.disconnect();
        //
        // let sessionKey = await handler.generateSessionKey(asset.id);
        // console.log(sessionKey);
        // response = await handler.verifySessionKey(asset.id, sessionKey);
        // console.log(response);
        // await handler.removeSessionKey(asset.id, sessionKey);


    } catch (error) {
        console.error(`Failed to fetch data ${error}`);
        process.exit(1);
    }
}

main();
