import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
    
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({
      message: 'Waiting on transaction success...'
    });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })
    
    this.setState({
      message: 'You have been entered!'
    });
  }

  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    
    
    this.setState({
      message: 'Picking winner...'
    });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    
    this.setState({
      message: `A winner has been picked`
    });
  }

  render() {
    return (
      <div>
        <h2>Lottery contract</h2>
        <p>
          this contract is managed by {this.state.manager}. <br />
          There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck</h4>
          <div>
            <label>Amount of ether to enter:</label>
            <input 
              onChange = { event => this.setState({ value: event.target.value })}
              value = { this.state.value }
            />
            <br/>
            <button>Enter</button>
          </div>
        </form>
        <hr />
        <h4>Let's pick a winner</h4>
        <button onClick={this.pickWinner}>Enter</button>

        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
