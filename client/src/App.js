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
    num7: '0',
    num8: '0',
    num9: '0',
    num10: '0',
    num11: '0',
    num12: '0',
    num13: '0',
    numPlus: '0',
    numMinus: '0',
    numMul: '0',
    numDiv: '0',
    numPow: '0',
    numExp: '0',
    numFibo: '0',
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

    //let num1 = '3.14';
    //let num2 = 3; //-25110812.1163

    //let wp;
    //let dp;
    let res;
    //let res1;
    let res2;
    let pow;
    let powRoot;
    let num = "2.0";
    let N = 5;

    res = await contract.methods.expoSerie(num, N).call({ from: account });
    //res1 = await contract.methods.logSerie(num, N).call({ from: account });
    res2 = await contract.methods.exp(num).call({ from: account });
    pow = await contract.methods.toPowerOf(num, N).call({ from: account });
    powRoot = await contract.methods.powerRoot(3, "1.5").call({ from: account });
    //powRoot = await contract.methods.powerRoot(2, "1.5").call({ from: account });

    console.log(`logSerie(${num}) = ${res}`);
    //console.log(`expSerie(${num}) = ${res1}`);
    console.log(`exp(${num}) = ${res2}`);
    console.log(`pow(${num}) = ${pow[2]}`);
    console.log(`powRoot_2 (${num}) = ${powRoot}`);

    //wp = res[0];
    //dp = res[1];
    //num = res[2];

    //console.log(`${num1}^${num2} = ${num}`);
  };

  add = async () => {
    const { num1, num2, account, contract } = this.state;

    let res = await contract.methods.addFloat(num1, num2).call({ from: account });

    this.setState({ numPlus: res[2] });
  }

  sub = async () => {
    const { num3, num4, account, contract } = this.state;

    let res = await contract.methods.subFloat(num3, num4).call({ from: account });

    this.setState({ numMinus: res[2] });
  }

  mul = async () => {
    const { num5, num6, account, contract } = this.state;

    let res = await contract.methods.mulFloat(num5, num6).call({ from: account });

    this.setState({ numMul: res[2] });
  }

  div = async () => {
    const { num7, num8, account, contract } = this.state;

    let res = await contract.methods.divFloat(num7, num8).call({ from: account });

    this.setState({ numDiv: res[2] });
  }

  pow = async () => {
    const { num9, num10, account, contract } = this.state;

    let res = await contract.methods.toPowerOf(num9, num10).call({ from: account });

    this.setState({ numPow: res[2] });
  }

  exp = async () => {
    const { num12, num13, account, contract } = this.state;

    let res = await contract.methods.powerRoot(num12, num13).call({ from: account });

    this.setState({ numExp: res });
  }

  fibo = async () => {
    const { num11, account, contract } = this.state;

    let res = await contract.methods.fibonacci(num11).call({ from: account });

    this.setState({ numFibo: res });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="name"><strong>Samuel Gwlanold Edoumou</strong></div>
        <h1>Calculator</h1>
        <h4><strong>All input numbers must contain a comma separator expect the power in raising to a power operation</strong></h4>
        <h4>Check the end of the page for examples</h4>

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
          <div style={{ paddingTop: 60 }}>
            <span> <Input placeholder='number 1' onChange={e => this.setState({ num7: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}> <Icon name='percent' /> </span>
            <span> <Input placeholder='number 2' onChange={e => this.setState({ num8: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Button color='teal' onClick={this.div}>
                Calculate
              </Button>
            </span>
            <span> <Input disabled placeholder='result' value={this.state.numDiv} /> </span>
          </div>
          <div style={{ paddingTop: 60 }}>
            <span> <Input placeholder='number 1' onChange={e => this.setState({ num9: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}> <Icon name='angle up' /> </span>
            <span> <Input placeholder='number 2' onChange={e => this.setState({ num10: e.target.value })} /> </span>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Button color='teal' onClick={this.pow}>
                Calculate
              </Button>
            </span>
            <span> <Input disabled placeholder='result' value={this.state.numPow} /> </span>
          </div>
        </div>

        <div className="hr">
          <hr></hr>
        </div>

        <div className="desc">
          NB:
          <span className="warning">
            <strong>All input numbers must contain a comma separator expect the power in raising to a power operation</strong>
          </span>.
          <br></br>
          <br></br>
          The sum of two positive or two negative numbers must be calculated using the first row. Ex: 2.0 + 2.0 and -2.0 + (-3.0).
          <br></br>
          <br></br>
          The second row allows to subract a floatting points number from anoter one. Ex: 2.0 - 1.0
          <br></br>
          <br></br>
          For -2.0 + 1.0, use the second row and put 1.0 as the first input and 2.0 as the secons such tht to get 1.0 - 2.0.
          <br></br>
          <br></br>
          The third row allows to multiply two floating points numbers. Ex: 2.5 × 1.5 and 2.5 × (-1.5) and (-2.5) × 1.5 and (-2.5) × (-1.5)
          <br></br>
          <br></br>
          The fourth row allows to divide a floating point number by another floating point number. Ex: 2.5 / 1.5 and 2.5 / (-1.5) and (-2.5) / 1.5 and (-2.5) / (-1.5)
          <br></br>
          <br></br>
          The last row allows raise a floating point number to a integer power. Ex: 2.5^2 and -2.5^5
        </div>

      </div>
    );
  }
}

export default App;