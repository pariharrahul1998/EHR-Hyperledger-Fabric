// noinspection BadExpressionStatementJS
'use-strict';
const args = require('yargs').argv;

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'Blockchain-Network', 'first-network', 'connection-org1.json');

async function main() {

    try {

        console.log("The entered registrationIds will be quered from the ledger");
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
        const contract = network.getContract('contract');
        let response = await contract.evaluateTransaction('readMyAsset', 'warangal');
        response = JSON.parse(response.toString());
        console.log(response);

        console.log(Date.parse(response.startDate) + "   " + Date.now());
        

        gateway.disconnect();

    } catch (error) {
        console.error(`Failed to delete voter ${error}`);
        process.exit(1);
    }
}

main();
