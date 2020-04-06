// noinspection BadExpressionStatementJS
'use-strict';
const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');

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
        asset.id = "testingHospital1";
        asset.assetId = "pariharrahul2002";
        asset = JSON.stringify(asset);
        let response = await contract.evaluateTransaction('getModifiedAsset', asset);
        response = JSON.parse(response.toString());
        console.log(response);

        console.log(Date.parse(response.startDate) + "   " + Date.now());

        gateway.disconnect();

    } catch (error) {
        console.error(`Failed to fetch data ${error}`);
        process.exit(1);
    }
}

main();
