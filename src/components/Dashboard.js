import React, { Component } from 'react';
import update from 'immutability-helper';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';
import Menu from './Menu';
import Wallet from './Wallet';


class Dashboard extends Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: {},
      wallets: {},
      updateInterval: 10,  // in seconds
      lastUpdate: new Date(),
      maxWallets: 10,
    };

    this.createWallet = this.createWallet.bind(this);
    this.getWalletDetails = this.getWalletDetails.bind(this);
    this.updateWallets = this.updateWallets.bind(this);
  }

  _handleLogout = () => {
    this.Auth.logout();
    this.props.history.replace('/login');
  };

  componentWillMount() {
    fetch('http://wallet.conceal.network/api/user', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken(),
      },
    })
      .then(r => r.json())
      .then(res => this.setState({ user: res.message }));
    fetch('http://wallet.conceal.network/api/wallet/list', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken(),
      },
    })
      .then(r => r.json())
      .then(res => {
        res.message.addresses.length > 0 && res.message.addresses.forEach(address => {
          this.setState(prevState =>
            update(prevState, {
              wallets: {
                [address]: { $set: { address } },
              }
            }));
          this.getWalletDetails(address);
        });
      });
  }

  componentDidMount() {
    this.updateWalletsInterval = setInterval(this.updateWallets, this.state.updateInterval * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateWalletsInterval);
  }

  getWalletDetails(address) {
    fetch(`http://wallet.conceal.network/api/wallet/get/address/${address}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken(),
      },
    })
      .then(r => r.json())
      .then(res => {
        const { balance, transactions } = res.message;
        this.setState(prevState =>
          update(prevState, {
            wallets: { [address]: { $merge: { balance, transactions } } },
            lastUpdate: { $set: new Date() },
          }));
      });
  }

  updateWallets() {
    const { wallets } = this.state;
    Object.keys(wallets).forEach(wallet => this.getWalletDetails(wallets[wallet].address));
  }

  createWallet() {
    fetch('http://wallet.conceal.network/api/wallet/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken(),
      },
    })
      .then(r => r.json())
      .then(res => {
        const address = res.message.wallet;
        this.setState(prevState =>
          update(prevState, {
            wallets: {
              [address]: { $set: { address } },
            }
          }));
        this.getWalletDetails(address);
      });
  }

  render() {
    const {
      user,
      wallets,
      lastUpdate,
      maxWallets,
    } = this.state;

    return (
      <div className="main-page">
        <h1>Welcome {user.name}!</h1>
        <Menu />
        <h2>Your Wallets</h2>
        {
          Object.keys(wallets).length > 0
            ? Object.keys(wallets).map(wallet => <Wallet key={wallet} wallet={wallets[wallet]}/>)
            : <span>You have no wallets, please create one!</span>
        }
        <div>
          <small>Last Update: {lastUpdate.toUTCString()}</small>
        </div>
        {Object.keys(wallets).length < maxWallets &&
          <button onClick={this.createWallet}>Create New Wallet</button>
        }
        <div>
          <button onClick={this._handleLogout}>LOGOUT</button>
        </div>
      </div>
    );
  }
}

export default withAuth(Dashboard);
