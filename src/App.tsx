import React from "react";
import "./App.css";
import {Web3Data} from "./components/Web3Data";

function App() {
  return (
    <div className="App">
      <div>
        <h1>Infura React Dapp with Components!</h1>
        <Web3Data title="Web3 Data" />
      </div>
    </div>
  );
}

export default App;
