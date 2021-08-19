import React, {FC, useState, useEffect, useCallback} from "react";
import Web3 from "web3";
import Web3Context from "@openzeppelin/network/lib/context/Web3Context";
import {useWeb3} from "@openzeppelin/network/lib/react";
import abi from "./abi.json";
import rootTokenABI from "./rootTokenABI.json";
import rootChainManagerABI from "./rootChainManagerABI.json";
import childTokenABI from "./childMintableAbi.json";
import {AbiItem} from "web3-utils";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface IWeb3DataProps {
  title: string;
}

export const Web3Data: FC<IWeb3DataProps> = props => {
  const {title} = props;
  //const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;
  //const HDWalletProvider = require("@truffle/hdwallet-provider");
  const chains_config = require("./config.js");

  const deployAddress = "0x9da5b38B668267e3171dBcBa769Ca83Da1015665"; //  rinkeby  deploy erc20
  //const deployAddress = "0xE18996E18b8beF6DaCe4D411805B4C0b492D7D8E"; //  Matic Mumbai deploy erc20
  const web3Context = useWeb3(`wss://goerli.infura.io/ws/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`);
  //const web3ContextMatic = useWeb3(`https://polygon-mumbai.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`);
  const {networkId, networkName, accounts, providerName, lib} = web3Context;
  const [balance, setBalance] = useState(0);
  const getBalance = useCallback(async () => {
    let balance =
      accounts && accounts.length > 0 ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), "ether") : "Unknown";
    setBalance(parseFloat(balance));
  }, [accounts, lib.eth, lib.utils]);

  useEffect(() => {
    getBalance();
  }, [accounts, getBalance, networkId]);

  const requestAuth = async (web3Context: Web3Context) => {
    try {
      await web3Context.requestAuth();
    } catch (e) {
      console.error(e);
    }
  };
  const requestAccess = useCallback(() => requestAuth(web3Context), [web3Context]);

  const getInt = async function (): Promise<number> {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const NameContract = new web3.eth.Contract(abi as AbiItem[], deployAddress);
    const i = NameContract.methods.getTest().call();
    return i.then((result: any) => {
      console.log("result: ", result);
      return result;
    });
  };

  const incrementInt = async function () {
    let i = await getInt();
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const NameContract = new web3.eth.Contract(abi as AbiItem[], deployAddress);
    i++;
    NameContract.methods.setTest(i).call();

    console.log("i++", i);
  };

  const transfer = async function () {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const NameContract = new web3.eth.Contract(abi as AbiItem[], deployAddress);
    const fromAddress = "0xB401bBf1CBC0032EA740219c4434b4A93a6b303A";
    const toAddress = "0x5FDF7d568Af5768c68353A9407416a767d28aa16";
    NameContract.methods.transfer(toAddress, 1).send({from: fromAddress});
  };

  /*const getMaticPOSClient = () => {
    return new MaticPOSClient({
      network: "testnet", // optional, default is testnet
      version: "mumbai", // optional, default is mumbai
      parentProvider: new HDWalletProvider(
          chains_config.user.privateKey,
          chains_config.root.RPC
      ),
      maticProvider: new HDWalletProvider(
          chains_config.user.privateKey,
          chains_config.child.RPC
      ),
      posRootChainManager: chains_config.root.POSRootChainManager,
      parentDefaultOptions: { from: chains_config.user.address }, // optional, can also be sent as last param while sending tx
      maticDefaultOptions: { from: chains_config.user.address }, // optional, can also be sent as last param while sending tx
    });
  };*/

  const depositAndWithdraw = async () => {
    const mainWeb3 = new Web3(chains_config.root.RPC);
    const maticWeb3 = new Web3();

    const rootTokenContract = new mainWeb3.eth.Contract(rootTokenABI as AbiItem[], chains_config.root.tokenAddress);
    const rootChainManagerContract = new mainWeb3.eth.Contract(
      rootChainManagerABI as AbiItem[],
      chains_config.root.chainManagerAddress,
    );
    const childTokenContract = new maticWeb3(childTokenABI as AbiItem[], chains_config.child.tokenAddress);

    await rootTokenContract.methods
      .approve(chains_config.child.erc20Predicate, 5000)
      .send({from: "0xB401bBf1CBC0032EA740219c4434b4A93a6b303A"});

    const depositData = mainWeb3.eth.abi.encodeParameter("uint256", 5000);
    await rootChainManagerContract.methods
      .depositFor("0xB401bBf1CBC0032EA740219c4434b4A93a6b303A", chains_config.root.tokenAddress, depositData)
      .send({from: "0xB401bBf1CBC0032EA740219c4434b4A93a6b303A"});

    await childTokenContract.methods.withdraw(5000).send({from: "0xB401bBf1CBC0032EA740219c4434b4A93a6b303A"});
    //const burnTxHash = burnTx.transactionHash

    /*const maticPOSClient = getMaticPOSClient();
    await maticPOSClient.depositEtherForUser("0xB401bBf1CBC0032EA740219c4434b4A93a6b303A", 1000000, {
      from: "0xB401bBf1CBC0032EA740219c4434b4A93a6b303A",
      gasPrice: "10000000000",
    });*/
  };
  return (
    <div>
      <h3> {title} </h3>
      <div>Network: {networkId ? `${networkId} – ${networkName}` : "No connection"}</div>
      <div>Your address: {accounts && accounts.length ? accounts[0] : "Unknown"}</div>
      <div>Your ETH balance: {balance}</div>
      <div>Provider: {providerName}</div>
      {accounts && accounts.length ? (
        <div>
          <p>Accounts & Signing Status: Access Granted</p>
          <button onClick={getInt}>Get int from contract</button>
          <button onClick={incrementInt}>Increment int from contract</button>
          <button onClick={transfer}>Transfer</button>
          <button onClick={depositAndWithdraw}>Deposit and withdrow</button>
        </div>
      ) : !!networkId && providerName !== "infura" ? (
        <div>
          <button onClick={requestAccess}>Request Access</button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
