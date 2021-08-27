import React, {FC, useState, useEffect, useCallback} from "react";
import Web3 from "web3";
import Web3Context from "@openzeppelin/network/lib/context/Web3Context";
import {useWeb3} from "@openzeppelin/network/lib/react";
import abi from "./abi.json";
import rootTokenABI from "./rootTokenABI.json";
import rootChainManagerABI from "./rootChainManagerABI.json";
import childTokenABI from "./childMintableAbi.json";
import marketplaceERC721ABI from "./MarketplaceERC721ABI.json";
import {AbiItem} from "web3-utils";
import {useInput} from "../use-input";

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

  const nftId = useInput(0);
  const amount = useInput(300);

  const [balERC20, setBalERC20] = useState(0);

  //const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;
  //const HDWalletProvider = require("@truffle/hdwallet-provider");
  const chains_config = require("./config.js");

  const marketplaceERC721Address = "0xCFf8E41C66C85e3163EA31BCA81cD54Be4062aD4"; //  rinkeby marketplace for ERC721 owner Account1
  const dummyMintableERC721Address = "0x69F7C46951655063DF0324145a12EC0D2dF11AbD"; //  rinkeby ERC721 owner Account2
  const dummyMintableERC20Address = "0xFE2F5be3c0dfdE26740a677f20B1B0ba86Fba4Aa"; //  rinkeby ERC70 owner Account1

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

  const balanceERC20 = async function () {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const ERC20Contract = new web3.eth.Contract(abi as AbiItem[], dummyMintableERC20Address);
    //const fromAddress = "0xB401bBf1CBC0032EA740219c4434b4A93a6b303A";
    //const toAddress = "0x5FDF7d568Af5768c68353A9407416a767d28aa16";
    const address = accounts && accounts.length ? accounts[0] : "Unknown";
    const balanceERC20 = ERC20Contract.methods.balanceOf(address).call();
    setBalERC20(balanceERC20);
  };

  const createOrder = async function () {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const marketplaceContract = new web3.eth.Contract(marketplaceERC721ABI as AbiItem[], marketplaceERC721Address);
    const address = accounts && accounts.length ? accounts[0] : "Unknown";
    //const toAddress = "0x5FDF7d568Af5768c68353A9407416a767d28aa16";
    marketplaceContract.methods
      .createOrder(dummyMintableERC721Address, nftId.value, amount.value, 1829897953)
      .send({from: address});
  };

  const executeOrder = async function () {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const marketplaceContract = new web3.eth.Contract(marketplaceERC721ABI as AbiItem[], marketplaceERC721Address);
    const address = accounts && accounts.length ? accounts[0] : "Unknown";
    marketplaceContract.methods
      .executeOrder(dummyMintableERC721Address, nftId.value, amount.value)
      .send({from: address});
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
    const childTokenContract = new maticWeb3.eth.Contract(childTokenABI as AbiItem[], chains_config.child.tokenAddress);

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
      <input type="number" placeholder="NFT ID" {...nftId} />
      <input type="number" placeholder="Amount" {...amount} />
      <div>{balERC20}</div>
      <div>
        <button onClick={createOrder}>Create order</button>
        <button onClick={executeOrder}>Execute order</button>
      </div>
      {accounts && accounts.length ? (
        <div>
          <p>Accounts & Signing Status: Access Granted</p>
          <button onClick={balanceERC20}>Balance of ERC20</button>
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
