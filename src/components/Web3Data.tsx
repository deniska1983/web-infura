import React, {FC, useState, useEffect, useCallback} from "react";
import Web3 from "web3";
import Web3Context from "@openzeppelin/network/lib/context/Web3Context";
import {useWeb3} from "@openzeppelin/network/lib/react";
import abi from "./abi.json";
import {AbiItem} from "web3-utils";

import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
import Matic from "maticjs";

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
  //const address = "0x9C57f35cd3525B8ad808aa5dA078620669E11404";
  //const deployAddress = "0xD01fee98acC7142fF51886F6AB586791174F64d1"; //  rinkeby  deploy erc20
  const deployAddress = "0xb0AFa0a7F0Af9836e2009aE1185a7E3b213Cc9F0"; //  Matic Mumbai deploy erc20
  const web3Context = useWeb3(`wss://rinkeby.infura.io/ws/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`);
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
  const requestAccess = useCallback(() => requestAuth(web3Context), []);

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
    NameContract.methods.transfer(fromAddress, 1).send({from: toAddress});
  };

  const depositAndWithdraw = async function () {
    const mainWeb3 = new Web3(window.ethereum);
    const maticWeb3 = new Web3(window.ethereum);
    const rootTokenContract = new mainWeb3.eth.Contract(rootTokenABI, rootTokenAddress);
    const rootChainManagerContract = new mainWeb3.eth.Contract(rootChainManagerABI, rootChainManagerAddress);
    const childTokenContract = new maticWeb3(childTokenABI, childTokenAddress);
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
          <button onClick={depositAndWithdraw}>Deposit and Withdraw</button>
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
