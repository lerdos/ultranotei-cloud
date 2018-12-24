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
import Market from './cards/Market';


class Dashboard extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      coingeckoAPI: 'https://api.coingecko.com/api/v3',
      lastUpdate: new Date(),
      maxWallets: 10,
      priceCCXBTC: 0,
      updateInterval: 10,  // in seconds
      updateBTCPriceInterval: 30,  // in seconds
      updateCCXPriceInterval: 30,  // in seconds
      user: {},
      wallets: {},
    };

    this.createWallet = this.createWallet.bind(this);
    this.getWalletDetails = this.getWalletDetails.bind(this);
    this.updateWallets = this.updateWallets.bind(this);
    this.fetchPrices = this.fetchPrices.bind(this);
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
    this.fetchPrices();
  }

  componentDidMount() {
    this.fetchPricesInterval = setInterval(this.updateWallets, this.state.updateInterval * 1000);
    this.updatePricesInterval = setInterval(this.fetchPrices, this.state.updatePricesInterval * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchPricesInterval);
    clearInterval(this.updatePricesInterval);
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

  fetchPrices() {
    const { coingeckoAPI } = this.state;
    fetch(`${coingeckoAPI}/simple/price?ids=conceal&vs_currencies=btc&include_last_updated_at=true`)
      .then(r => r.json())
      .then(res => this.setState({ priceCCXBTC: res.conceal && res.conceal.btc ? res.conceal.btc : 0 }))
      .catch(err => console.error(err));
  }

  render() {
    const {
      lastUpdate,
      maxWallets,
      priceCCXBTC,
      user,
      wallets,
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
                  <PortfolioBTC wallets={wallets} priceCCXBTC={priceCCXBTC}  />
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
                <Market />
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
