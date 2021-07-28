import React, {FC, useState, useEffect, useCallback} from "react";
import Web3 from "web3";
import Web3Context from "@openzeppelin/network/lib/context/Web3Context";
import {useWeb3} from "@openzeppelin/network/lib/react";
import abi from "./abi.json";
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

  const address = "0x2e65BE69EBF5bE821CC15F49DDa58e2E26533844";

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
    const NameContract = new web3.eth.Contract(abi as AbiItem[], address);
    const i = NameContract.methods.getTest().call();
    i.then((result: any) => {
      console.log("result: ", result);
      return result;
    });
    //console.log(i);

    return 0;
  };

  const incrementInt = async function () {
    let i = await getInt();
    console.log("i=", ++i);
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
