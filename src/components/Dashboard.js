import React from 'react';
import update from 'immutability-helper';
import { Link } from 'react-router-dom';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';
import Height from './cards/Height';
import Market from './cards/Market';
import PortfolioBTC from './cards/PortfolioBTC';
import PortfolioCCX from './cards/PortfolioCCX';
import Transactions from './cards/Transactions';
import Wallet from './Wallet';


class Dashboard extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      maxWallets: 10,
      priceCCXBTC: 0,
      updateInterval: 30,  // in seconds
      wallets: {},
      walletsLoaded: false,
    };

    this.getWalletList = this.getWalletList.bind(this);
    this.getWalletDetails = this.getWalletDetails.bind(this);
    this.updateWallets = this.updateWallets.bind(this);
    this.createWallet = this.createWallet.bind(this);
    this.fetchPrices = this.fetchPrices.bind(this);
  }

  componentWillMount() {
    this.getWalletList();
    this.fetchPrices();
  }

  componentDidMount() {
    this.updatePricesInterval = setInterval(this.fetchPrices, this.state.updateInterval * 1000);
    this.updateWalletsInterval = setInterval(this.updateWallets, this.state.updateInterval * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updatePricesInterval);
    clearInterval(this.updateWalletsInterval);
  }

  getWalletList() {
    // console.log('GETTING WALLET LIST...');
    fetch(`${this.props.appSettings.apiEndpoint}/wallet/list`, {
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
              },
              walletsLoaded: { $set: true },
            }));
          this.getWalletDetails(address);
        });
      });
  }

  getWalletDetails(address) {
    // console.log(`GETTING WALLET DETAILS... ${address}`);
    fetch(`${this.props.appSettings.apiEndpoint}/wallet/get/address/${address}`, {
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
    fetch(`${this.props.appSettings.apiEndpoint}/wallet/`, {
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
    // console.log('UPDATING PRICES...');
    const { appSettings } = this.props;
    fetch(`${appSettings.coingeckoAPI}/simple/price?ids=conceal&vs_currencies=btc&include_last_updated_at=true`)
      .then(r => r.json())
      .then(res => this.setState({ priceCCXBTC: res.conceal && res.conceal.btc ? res.conceal.btc : 0 }))
      .catch(err => console.error(err));
  }

  render() {
    const {
      maxWallets,
      priceCCXBTC,
      wallets,
      walletsLoaded,
    } = this.state;
    const { appSettings } = this.props;

    return (
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
                <Height appSettings={appSettings} />
              </div>
            </div>
          </div>

          <div className="section-wrapper mg-t-20">
            <label className="section-title">Your Wallets</label>
            <div className="row">
              <div className="col-lg-12">
                <div className="list-group list-group-user">
                  {Object.keys(wallets).length < maxWallets && walletsLoaded &&
                    <button className="btn btn-primary btn-block" onClick={this.createWallet}>Create New Wallet</button>
                  }
                  {
                    Object.keys(wallets).length > 0 &&
                    Object.keys(wallets).map(wallet =>
                      <Wallet key={wallet} wallet={wallets[wallet]} appSettings={appSettings}/>
                    )
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
    );
  }
}

export default withAuth(Dashboard);
