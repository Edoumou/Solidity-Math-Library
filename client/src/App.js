import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import { Input, Icon, Button } from 'semantic-ui-react';
import MathLibrary from "./contracts/MathLibrary.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    num1: '0',
    num2: '0',
    num: '0',
    web3: null,
    account: null,
    contract: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MathLibrary.networks[networkId];
      const instance = new web3.eth.Contract(
        MathLibrary.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account: accounts[0], contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract, account } = this.state;

    let num1 = '3.14';
    let num2 = '14.30'; //-25110812.1163

    //let wp;
    //let dp;
    let res;
    let num;

    res = await contract.methods.subFloat(num1, num2).call({ account: account });

    //wp = res[0];
    //dp = res[1];
    num = res[2];

    console.log(`${num1} - ${num2} = ${num}`);

  };

  calculate = async () => {
    const { num1, num2, account, contract } = this.state;

    let res = await contract.methods.subFloat(num1, num2).call({ account: account });

    this.setState({ num: res[2] });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Calculator</h1>

        <div className="segment">
          <span> <Input placeholder='number 1' onChange={e => this.setState({ num1: e.target.value })} /> </span>
          <span> <Icon name='minus' /> </span>
          <span> <Input placeholder='number 2' onChange={e => this.setState({ num2: e.target.value })} /> </span>
          <span style={{ paddingLeft: 10, paddingRight: 10 }}>
            <Button color='teal' onClick={this.calculate}>
              Calculate
            </Button>
          </span>
          <span> <Input disabled placeholder='result' value={this.state.num} /> </span>
        </div>
      </div>
    );
  }
}

export default App;
