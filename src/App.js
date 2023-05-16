// import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

function App() {
  const [address, setAddress] = useState(0);
  const [providers, setProviders] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;
  const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
  const web3 = createAlchemyWeb3(API_URL);
  const getProvider = () => {
    console.log("Here is the Check Of MetaMask");
    if (window.ethereum) {
      const provider = window.ethereum;

      if (provider?.isMetaMask) {
        return provider;
      }
    }

    window.open("https://metamask.io", "_blank");
  };
  async function connect() {
    const provider = getProvider();
    const resp = await provider.request({
      method: "eth_requestAccounts",
    });
    console.log("Here is the Key Address of MetaMask", resp);
    setProviders(provider);
    setAddress(resp[0]);
  }
  const deposit = async () => {
    const transactionParameters = {
      // nonce: "0x00", // customizable by user during MetaMask confirmation.
      //Set Your Master Wallet Address to Deposit the Ether from your MataMask Wallet
      to: "0x***********************************8", // add your master wallet Public key address here
      // Master Wallet Required except during contract publications.
      from: address, // must match user's active address.
      //set here the value of Ether By Passing the ETH value as a argument in the deposit Funtion
      value: "38D7EA4C68000", // Only required to send ether to the recipient from the initiating external account.
      gas: "21000",
      chainId: "0x5", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      // add chain id of main net of ethereum 0x1	1	Ethereum Main Network (Mainnet)
    };
    const txHash = await providers
      .request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
    console.log("here is the transfer", txHash);
  };
  const withdraw = async () => {
    //add your master wallet public key here here
    const myAddress = "0x**************************8"; //Master Wallet Address  //TODO: replace this address with your own public address

    const nonce = await web3.eth.getTransactionCount(myAddress); // nonce starts counting from 0
    console.log(nonce);

    const transaction = {
      to: address, // faucet address to return eth
      value: 100000000000000000, // 0.01 ETH
      gas: 21000,
      nonce: nonce,
      chainId: "0x5",
      // add chain id of main net of ethereum 0x1	1	Ethereum Main Network (Mainnet)
      // optional data field to send message or execute smart contract
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      PRIVATE_KEY
    );

    web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      function (error, hash) {
        if (!error) {
          console.log(
            "🎉 The hash of your transaction is: ",
            hash,
            "\n Check Alchemy's Mempool to view the status of your transaction!"
          );
        } else {
          console.log(
            "Something went wrong while submitting your transaction:\n",
            error
          );
        }
      }
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={connect}>Click for MetaMask Connectivity</button>
        </div>
        <div>
          <button onClick={deposit}>
            Click for Deposit into Master Wallet
          </button>
        </div>
        <div>
          <button onClick={withdraw}>
            WithDraw To Master Account to your MataMask Account
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
