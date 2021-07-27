import React, {useEffect, useState} from 'react';
import './App.css';
//import { useWeb3 } from '@openzeppelin/network/react';
import Web3Data from './components/Web3Data.js';
const infuraProjectId = 'a53fefd958404285a3f9404eea3bb4b9';
function App() {
	const [x,setX]=useState(null);
	useEffect(()=>{
		const Web3 = require('web3');
		let web3 = new Web3('wss://rinkeby.infura.io/ws/v3/${infuraProjectId}');
		setX(web3);
	},[])
	//const web3Context = useWeb3(`wss://rinkeby.infura.io/ws/v3/${infuraProjectId}`);
return (
<div className="App">
	<div>
	<h1>Infura React Dapp with Components!</h1>
	<Web3Data title="Web3 Data" web3Context={x} />
	</div>
</div>
);
}
export default App;

