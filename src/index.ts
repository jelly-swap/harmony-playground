const { ContractFactory } = require('@harmony-js/contract');
const { Wallet } = require('@harmony-js/account');
const { Messenger, WSProvider } = require('@harmony-js/network');
const { ChainID, ChainType, hexToNumber } = require('@harmony-js/utils');
const ws = new WSProvider('wss://ws.s0.b.hmny.io');

const wallet = new Wallet(new Messenger(ws, ChainType.Harmony, ChainID.HmyTestnet));
const factory = new ContractFactory(wallet);

const contractJson = require('./Counter.json');
const contractAddr = '0x8ada52172abda19b9838eb00498a40952be6a019';

const contract = factory.createContract(contractJson.abi, contractAddr);
contract.wallet.addByPrivateKey('1f054c21a0f57ebc402c00e14bd1707ddf45542d4ed9989933dbefc4ea96ca68');

contract.methods
    .incrementCounter()
    .send({
        gasPrice: 1000000000,
        gasLimit: 210000,
    })
    .then((response) => {
        console.log(response.transaction.receipt);
    })
    .catch((err) => {
        console.log(err);
    });

try {
    contract.events
        .IncrementedBy()
        .on('data', (event) => {
            console.log(event);
        })
        .on('error', console.error);
} catch (error) {
    console.log(error);
}
