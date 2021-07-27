import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';

export default function Web3Data(props) {
    //var path = require('path');
    //var fs = require('fs');
    //const contractPath = path.resolve(__dirname, 'abi.json');
    //const contractJson = fs.readFileSync(contractPath);
    const  contractJson = '[\n' +
        '\t{\n' +
        '\t\t"constant": false,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_spender",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_value",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "approve",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "success",\n' +
        '\t\t\t\t"type": "bool"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "nonpayable",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": false,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_spender",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_value",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_extraData",\n' +
        '\t\t\t\t"type": "bytes"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "approveAndCall",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "success",\n' +
        '\t\t\t\t"type": "bool"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "nonpayable",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": false,\n' +
        '\t\t"inputs": [],\n' +
        '\t\t"name": "BitGuildToken",\n' +
        '\t\t"outputs": [],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "nonpayable",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": false,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_value",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "burn",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "success",\n' +
        '\t\t\t\t"type": "bool"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "nonpayable",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": false,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_from",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_value",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "burnFrom",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "success",\n' +
        '\t\t\t\t"type": "bool"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "nonpayable",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": false,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "x",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "setTest",\n' +
        '\t\t"outputs": [],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "nonpayable",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": false,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_to",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_value",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "transfer",\n' +
        '\t\t"outputs": [],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "nonpayable",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": false,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_from",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_to",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "_value",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "transferFrom",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "success",\n' +
        '\t\t\t\t"type": "bool"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "nonpayable",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"anonymous": false,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"indexed": true,\n' +
        '\t\t\t\t"name": "from",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"indexed": true,\n' +
        '\t\t\t\t"name": "to",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"indexed": false,\n' +
        '\t\t\t\t"name": "value",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "Transfer",\n' +
        '\t\t"type": "event"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"anonymous": false,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"indexed": true,\n' +
        '\t\t\t\t"name": "from",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"indexed": false,\n' +
        '\t\t\t\t"name": "value",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "Burn",\n' +
        '\t\t"type": "event"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": true,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t},\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "allowance",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "view",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": true,\n' +
        '\t\t"inputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "address"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"name": "balanceOf",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "view",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": true,\n' +
        '\t\t"inputs": [],\n' +
        '\t\t"name": "decimals",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "uint8"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "view",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": true,\n' +
        '\t\t"inputs": [],\n' +
        '\t\t"name": "getTest",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "view",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": true,\n' +
        '\t\t"inputs": [],\n' +
        '\t\t"name": "name",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "string"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "view",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": true,\n' +
        '\t\t"inputs": [],\n' +
        '\t\t"name": "symbol",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "string"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "view",\n' +
        '\t\t"type": "function"\n' +
        '\t},\n' +
        '\t{\n' +
        '\t\t"constant": true,\n' +
        '\t\t"inputs": [],\n' +
        '\t\t"name": "totalSupply",\n' +
        '\t\t"outputs": [\n' +
        '\t\t\t{\n' +
        '\t\t\t\t"name": "",\n' +
        '\t\t\t\t"type": "uint256"\n' +
        '\t\t\t}\n' +
        '\t\t],\n' +
        '\t\t"payable": false,\n' +
        '\t\t"stateMutability": "view",\n' +
        '\t\t"type": "function"\n' +
        '\t}\n' +
        ']';
    const abi = JSON.parse(contractJson);

    const address = '0x2e65BE69EBF5bE821CC15F49DDa58e2E26533844';

const { web3Context } = props;
const { networkId, networkName, accounts, providerName, lib } = web3Context;
const [balance, setBalance] = useState(0);
const getBalance = useCallback(async () => {
    let balance = accounts && accounts.length > 0 ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), 'ether') : 'Unknown';
    setBalance(balance);
}, [accounts, lib.eth, lib.utils]);

useEffect(() => {
    getBalance();
}, [accounts, getBalance, networkId]);

const requestAuth = async web3Context => {
    console.log("requestAuth");
    try {
	await web3Context.requestAuth();
    } catch (e) {
	console.error(e);
    }
};
const requestAccess = useCallback((web3Context) => requestAuth(web3Context), []);


const  getInt = async function() {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const NameContract = new web3.eth.Contract(abi, address);
    var i = NameContract.methods.getTest().call() ;
    i.then((result) => {
            console.log("result: ", result);
            return result;
        })
    //console.log(i);

    return 0;
}

const incrementInt = async function() {
    var i = getInt();
    i=i+1;
    console.log("i=",i);
}
return (
<div>
<h3> {props.title} </h3>
    <div>
        Network: {networkId ? `${networkId} – ${networkName}` : 'No connection'}
    </div>
    <div>
        Your address: {accounts && accounts.length ? accounts[0] : 'Unknown'}
    </div>
    <div>
        Your ETH balance: {balance}
    </div>
    <div>
        Provider: {providerName}
    </div>
    {accounts && accounts.length ? (
    <div>
        <p>Accounts & Signing Status: Access Granted</p>
        <button onClick={getInt}>Get int from contract</button>
        <button onClick={incrementInt}>Increment int from contract</button>
    </div>
    ) : !!networkId && providerName !== 'infura' ? (
    <div>
    <button onClick={requestAccess}>Request Access</button>
    </div>
    ) : (
    <div></div>
    )}
</div>
);
}
