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
    num3: '0',
    num4: '0',
    num5: '0',
    num6: '0',
    numPlus: '0',
    numMinus: '0',
    numMul: '0',
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

  add = async () => {
    const { num1, num2, account, contract } = this.state;

    let res = await contract.methods.addFloat(num1, num2).call({ account: account });

    this.setState({ numPlus: res[2] });
  }

  sub = async () => {
    const { num3, num4, account, contract } = this.state;

    let res = await contract.methods.subFloat(num3, num4).call({ account: account });

    this.setState({ numMinus: res[2] });
  }

  mul = async () => {
    const { num5, num6, account, contract } = this.state;

    let res = await contract.methods.mulFloat(num5, num6).call({ account: account });

    this.setState({ numMul: res[2] });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Calculator</h1>

        <div className="segment">
          <div>
            <span> <Input placeholder='number 1' onChange={e => this.setState({ num1: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}> <Icon name='plus' /> </span>
            <span> <Input placeholder='number 2' onChange={e => this.setState({ num2: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Button color='teal' onClick={this.add}>
                Calculate
              </Button>
            </span>
            <span> <Input disabled placeholder='result' value={this.state.numPlus} /> </span>
          </div>
          <div style={{ paddingTop: 60 }}>
            <span> <Input placeholder='number 1' onChange={e => this.setState({ num3: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}> <Icon name='minus' /> </span>
            <span> <Input placeholder='number 2' onChange={e => this.setState({ num4: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Button color='teal' onClick={this.sub}>
                Calculate
              </Button>
            </span>
            <span> <Input disabled placeholder='result' value={this.state.numMinus} /> </span>
          </div>
          <div style={{ paddingTop: 60 }}>
            <span> <Input placeholder='number 1' onChange={e => this.setState({ num5: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}> <Icon name='close' /> </span>
            <span> <Input placeholder='number 2' onChange={e => this.setState({ num6: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Button color='teal' onClick={this.mul}>
                Calculate
              </Button>
            </span>
            <span> <Input disabled placeholder='result' value={this.state.numMul} /> </span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
