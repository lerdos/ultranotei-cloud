import React from 'react';
import update from 'immutability-helper';
import { Link } from 'react-router-dom';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';
import Header from './Header';
import Footer from './Footer';
import Wallet from './Wallet';
import Height from './cards/Height';
import PortfolioBTC from './cards/PortfolioBTC';
import PortfolioCCX from './cards/PortfolioCCX';
import Transactions from './cards/Transactions';


class Dashboard extends React.Component {

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
      <div>
        <Header user={user} handleLogout={this._handleLogout} />

        <div className="slim-mainpanel">
          <div className="container">

            <div className="slim-pageheader">
              <ol className="breadcrumb slim-breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
              </ol>
              <h6 className="slim-pagetitle">Dashboard</h6>
            </div>

            <div className="card card-dash-one mg-t-20">
              <div className="row no-gutters">
                <div className="col-lg-3">
                  <PortfolioCCX wallets={wallets} />
                </div>
                <div className="col-lg-3">
                  <PortfolioBTC />
                </div>
                <div className="col-lg-3">
                  <Transactions wallets={wallets}/>
                </div>
                <div className="col-lg-3">
                  <Height />
                </div>
              </div>
            </div>

            <div className="section-wrapper mg-t-20">
              <label className="section-title">Your Wallets</label>
              <div className="row">
                <div className="col-lg-12">
                  <div className="list-group list-group-user">
                    {
                      Object.keys(wallets).length > 0
                        ? Object.keys(wallets).map(wallet => <Wallet key={wallet} wallet={wallets[wallet]}/>)
                        : ''
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="row row-sm mg-t-20">
              <div className="col-lg-4">
                <div className="card card-info">
                  <div className="card-body pd-40">
                    <h5 className="tx-inverse mg-b-20">How the wallet works</h5>
                    <p>An introductory tour of all the elements that currently make up the online wallet. Click for more
                      information.</p>
                    <Link to="#" className="btn btn-primary btn-block">Getting Started</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mg-t-20 mg-lg-t-0">
                <div className="card card-info">
                  <div className="card-body pd-40">

                    <h5 className="tx-inverse mg-b-20">Upcoming Features</h5>
                    <p>Click for a list of upcoming features, including encrypted messages, deposits, and
                      investments.</p>
                    <Link to="#" className="btn btn-primary btn-block">Take a Tour</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mg-t-20 mg-lg-t-0">
                <div className="card card-sales">
                  <h6 className="slim-card-title tx-primary">Graviex</h6>
                  <div className="row">
                    <div className="col">
                      <label className="tx-12">Ask</label>
                      <p>1,898</p>
                    </div>
                    <div className="col">
                      <label className="tx-12">Buy</label>
                      <p>1,112</p>
                    </div>
                    <div className="col">
                      <label className="tx-12">Volume</label>
                      <p>72,067</p>
                    </div>
                  </div>
                  <h6 className="slim-card-title tx-primary">STEX</h6>
                  <div className="row">
                    <div className="col">
                      <label className="tx-12">Ask</label>
                      <p>1,598</p>
                    </div>
                    <div className="col">
                      <label className="tx-12">Buy</label>
                      <p>1,212</p>
                    </div>
                    <div className="col">
                      <label className="tx-12">Volume</label>
                      <p>62,067</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <Footer lastUpdate={lastUpdate} />

        {/*
        {Object.keys(wallets).length < maxWallets &&
          <button onClick={this.createWallet}>Create New Wallet</button>
        }
        */}
      </div>
    );
  }
}

export default withAuth(Dashboard);
