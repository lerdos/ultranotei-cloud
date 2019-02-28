import React from 'react';
import { withRouter } from 'react-router';

import AuthHelper from '../helpers/AuthHelper';
import Api from '../helpers/Api';


export const AppContext = React.createContext();

class AppContextProvider extends React.Component {

  Auth = new AuthHelper();
  Api = new Api({ auth: this.Auth });

  constructor(props) {
    super(props);

    this.loginUser = (e, email, password, twoFACode) => {
      e.preventDefault();
      const { layout } = this.state;
      layout.formSubmitted = true;
      layout.message = null;
      this.setState({ layout });
      this.Auth.login(email, password, twoFACode)
        .then(res => {
          if (res.result === 'success') {
            layout.redirectToReferrer = true;
            this.initApp();
          } else {
            layout.message = res.message;
          }
        })
        .catch(err => {
          layout.message = `ERROR ${err}`;
        })
        .finally(() => {
          layout.formSubmitted = false;
          this.setState({ layout });
        });
    };

    this.signUpUser = (e, userName, email, password) => {
      e.preventDefault();
      const { layout } = this.state;
      layout.formSubmitted = true;
      layout.message = null;
      this.setState({ layout });
      this.Api.signUpUser(userName, email, password)
        .then(res => {
          if (res.result === 'success') {
            layout.message = 'Please check your email and follow the instructions to activate your account.';
            return props.history.replace('/login');
          } else {
            layout.message = res.message;
          }
        })
        .catch(err => {
          layout.message = `ERROR ${err}`;
        })
        .finally(() => {
          layout.formSubmitted = false;
          this.setState({ layout });
        });
    };

    this.resetPassword = (e, email) => {
      e.preventDefault();
      const { layout } = this.state;
      layout.formSubmitted = true;
      layout.message = null;
      this.setState({ layout });
      this.Api.resetPassword(email)
        .then(res => {
          if (res.result === 'success') {
            this.Auth.logout();
            this.clearApp();
            layout.message = 'Please check your email and follow instructions to reset password.';
            this.setState({ layout });
            return props.history.replace('/login');
          } else {
            layout.message = res.message;
          }
        })
        .catch(err => {
          layout.message = `ERROR ${err}`;
        })
        .finally(() => {
          // layout.message = 'Please check your email and follow instructions to reset password.';
          layout.formSubmitted = false;
          this.setState({ layout });
        });
    };

    this.resetPasswordConfirm = (e, password, token) => {
      e.preventDefault();
      const { layout } = this.state;
      layout.formSubmitted = true;
      layout.message = null;
      this.setState({ layout });
      this.Api.resetPasswordConfirm(password, token)
        .then(res => {
          if (res.result === 'success') {
            layout.message = (<>Password successfully changed.<br />Please log in.</>);
            this.setState({ layout });
            return props.history.replace('/login');
          } else {
            layout.message = res.message;
          }
        })
        .catch(err => {
          layout.message = `ERROR ${err}`;
        })
        .finally(() => {
          layout.formSubmitted = false;
          this.setState({ layout });
        });
    };

    this.logoutUser = () => {
      this.Auth.logout();
      this.clearApp();
      props.history.replace('/login');
    };

    this.updateUser = ({ e, email, avatar }) => {
      e.preventDefault();
      const { layout } = this.state;
      layout.formSubmitted = true;
      layout.message = null;
      this.setState({ layout });
      this.Api.updateUser({ email, file: avatar })
        .then(res => {
          layout.message = res.message[0];
        })
        .catch(err => {
          layout.message = `ERROR ${err}`;
        })
        .finally(() => {
          layout.formSubmitted = false;
          this.setState({ layout });
          this.getUser();
        });
    };

    this.getUser = () => {
      this.Api.getUser()
        .then(res => this.setState({ user: res.message }))
        .catch(e => console.error(e));
    };

    this.check2FA = () => {
      const { userSettings } = this.state;
      this.Api.check2FA()
        .then(res => {
          userSettings.twoFAEnabled = res.message.enabled;
          this.setState({ userSettings });
        })
        .catch(e => console.error(e));
    };

    this.update2FA = (e, code, enable) => {
      e.preventDefault();
      const { layout, userSettings } = this.state;
      layout.formSubmitted = true;
      layout.message = null;
      this.setState({ layout });
      this.Api.update2FA(code, enable)
        .then(res => {
          this.check2FA();
          layout.formSubmitted = false;
          layout.message = res.message[0];
          this.setState({ layout, userSettings });
        })
        .catch(e => console.error(e));
    };

    this.getQRCode = () => {
      const { layout } = this.state;
      this.Api.getQRCode()
        .then(res => {
          layout.qrCodeUrl = res.message.qrCodeUrl;
          this.setState({ layout });
        })
        .catch(e => console.error(e));
    };

    this.getBlockchainHeight = () => {
      const { network } = this.state;
      this.Api.getBlockchainHeight()
        .then(res => {
          network.blockchainHeight = res.message.height;
          this.setState({ network });
        })
        .catch(e => console.error(e));
    };

    this.getWalletList = () => {
      const { appSettings, layout, wallets } = this.state;
      this.Api.getWalletList()
        .then(res => {
          res.message.addresses && res.message.addresses.forEach(address => {
            if (!wallets.hasOwnProperty(address)) {
              wallets[address] = {};
              this.setState({ wallets });
            }
            this.Api.getWalletDetails(address)
              .then(res => {
                wallets[address] = { ...wallets[address], ...res.message };
                appSettings.lastUpdate = new Date();
                this.setState({ appSettings, wallets });
              })
              .catch(e => console.error(e));
          });
        })
        .catch(e => console.error(e))
        .finally(() => {
          layout.walletsLoaded = true;
          this.setState({ layout });
        });
    };

    this.getWalletDetails = (address) => {
      this.Api.getWalletDetails(address)
        .then(res => res)
        .catch(e => console.error(e));
    };

    this.createWallet = () => {
      const { appSettings, wallets } = this.state;
      this.Api.createWallet()
        .then(res => {
          const address = res.message.wallet;
          wallets[address] = {};
          this.Api.getWalletDetails(address)
            .then(res => {
              wallets[address] = res.message;
              appSettings.lastUpdate = new Date();
              this.setState({ appSettings, wallets });
            })
            .catch(e => console.error(e));
        })
        .catch(e => console.error(e));
    };

    this.getWalletKeys = (address) => {
      const { wallets } = this.state;
      if (!wallets[address].keys) {
        this.Api.getWalletKeys(address)
          .then(res => {
            wallets[address].keys = res.message;
            this.setState({ wallets });
          })
          .catch(e => console.error(e));
      }
    };

    this.sendTx = (options) => {
      const { e, wallet, address, paymentID, amount, message, twoFACode, password } = options;
      e.preventDefault();
      const { layout } = this.state;
      this.Api.sendTx(wallet, address, paymentID, amount, message, twoFACode, password)
        .then(res => {
          if (res.result === 'error' || res.message.error) {
            layout.sendTxResponse = {
              status: 'error',
              message: `Wallet Error: ${res.message.error ? res.message.error.message : res.message}`,
            };
            this.setState({ layout });
            return;
          }
          layout.sendTxResponse = {
            status: 'success',
            message: res.message.result,
          };
          this.setState({ layout });
          e.target.reset();
        })
        .catch(e => console.error(e));
    };

    this.getMarketPrices = () => {
      const { markets } = this.state;
      Object.keys(markets).forEach(market => {
        this.Api.getMarketPrices(markets[market].apiURL)
          .then(res => {
            markets[market].ask = parseFloat(market === 'tradeogre' ? res.ask : res.message[0].ask);
            markets[market].bid = parseFloat(market === 'tradeogre' ? res.bid : res.message[0].bid);
            markets[market].volume = parseFloat(market === 'tradeogre' ? res.volume : res.message[0].vol_market);
            this.setState({ markets });
          })
          .catch(e => console.error(e));
      });
    };

    this.getPrices = () => {
      const { appSettings, prices } = this.state;
      this.Api.getPrices(appSettings.coingeckoAPI)
        .then(res => {
          prices.priceCCXBTC = res.conceal && res.conceal.btc ? res.conceal.btc : 0;
          this.setState({ prices });
        })
        .catch(e => console.error(e));
    };

    this.onRouteChanged = (prevProps) => {
      const { location } = prevProps;
      const isRedirect = this.props.history.action === 'REPLACE';
      if ((location.pathname !== '/signup' && !location.pathname.startsWith('/reset_password')) || !isRedirect) {
        const { layout } = this.state;
        layout.message = null;
        this.setState({ layout });
      }
    };

    this.state = {
      appSettings: {
        appVersion: process.env.REACT_APP_VERSION,
        apiURL: process.env.REACT_APP_API_ENDPOINT,
        homePage: 'https://conceal.network',
        explorerURL: 'https://explorer.conceal.network',
        poolURL: 'https://pool.conceal.network',
        coingeckoAPI: 'https://api.coingecko.com/api/v3',
        discord: 'https://discord.gg/QY4ksas',
        twitter: 'https://twitter.com/ConcealNetwork',
        reddit: 'https://www.reddit.com/r/ConcealNetwork',
        telegram: 'https://t.me/concealnetworkusers',
        medium: 'https://medium.com/@ConcealNetwork',
        coinGecko: 'https://coingecko.com/en/coins/conceal',
        coinMarketCap: 'https://coinmarketcap.com/currencies/conceal',
        updateBlockchainHeightInterval: 15,  // seconds
        updateMarketPricesInterval: 30,  // seconds
        maxWallets: 10,
        lastUpdate: new Date(),
        coinDecimals: 5,
        defaultFee: 0.0001,
        messageFee: 0.001,
        selfDestructMessageFee: 0.0001,
        feePerChar: 0.00001,
        depositFee: 0.001,
        investmentFee: 0.001,
        withdrawalFee: 0.0001,
      },
      layout: {
        redirectToReferrer: false,
        formSubmitted: false,
        message: null,
        walletsLoaded: false,
        sendTxResponse: null,
        qrCodeUrl: '',
      },
      user: {
        userName: '',
        loggedIn: this.Auth.loggedIn(),
      },
      userSettings: {
        updateWalletsInterval: 10,  // seconds
        qrCodeURL: '',
        twoFACode: '',
        twoFAEnabled: false,
        minimumPasswordLength: 8,
      },
      wallets: {},
      network: {
        blockchainHeight: 0,
      },
      prices: {
        priceBTCUSD: 0,
        priceCCXBTC: 0,
      },
      markets: {
        stex: {
          apiURL: 'https://api.wallet.conceal.network/api/stex/status',
          ask: 0,
          bid: 0,
          volume: 0,
        },
        tradeogre: {
          apiURL: 'https://tradeogre.com/api/v1/ticker/BTC-CCX',
          ask: 0,
          bid: 0,
          volume: 0,
        },
      },
      userActions: {
        loginUser: this.loginUser,
        signUpUser: this.signUpUser,
        resetPassword: this.resetPassword,
        resetPasswordConfirm: this.resetPasswordConfirm,
        logoutUser: this.logoutUser,
        getUser: this.getUser,
        check2FA: this.check2FA,
        update2FA: this.update2FA,
        getQRCode: this.getQRCode,
        updateUser: this.updateUser,
      },
      walletActions: {
        createWallet: this.createWallet,
        getWalletList: this.getWalletList,
        getWalletDetails: this.getWalletDetails,
        getWalletKeys: this.getWalletKeys,
        sendTx: this.sendTx,
      },
      networkActions: {
        getBlockchainHeight: this.getBlockchainHeight,
      },
      pricesActions: {
        getPrices: this.getPrices,
      },
      marketActions: {
        getMarketPrices: this.getMarketPrices,
      },
    };
  }

  componentDidMount() {
    // console.log('PROVIDER MOUNTED.');
    const { layout, user } = this.state;
    const { location } = this.props;
    if (location.pathname === '/login' && location.search === '?activated') {
      layout.message = (<>Account successfully activated.<br />Please log in.</>);
      this.setState({ layout });
    }
    if (user.loggedIn) this.initApp();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) this.onRouteChanged(prevProps);
  }

  componentWillUnmount() {
    this.clearApp();
    // console.log('PROVIDER UNMOUNTED.');
  }

  initApp = () => {
    const {
      appSettings,
      marketActions,
      networkActions,
      pricesActions,
      userSettings,
      userActions,
      walletActions,
    } = this.state;
    userActions.getUser();
    userActions.check2FA();
    walletActions.getWalletList();
    networkActions.getBlockchainHeight();
    marketActions.getMarketPrices();
    pricesActions.getPrices();
    this.updateWalletsInterval = setInterval(walletActions.getWalletList, userSettings.updateWalletsInterval * 1000);
    this.updateBlockchainHeightInterval = setInterval(networkActions.getBlockchainHeight, appSettings.updateBlockchainHeightInterval * 1000);
    this.updateMarketPricesInterval = setInterval(marketActions.getMarketPrices, appSettings.updateMarketPricesInterval * 1000);
    this.updatePricesInterval = setInterval(pricesActions.getPrices, appSettings.updateMarketPricesInterval * 1000);
    // console.log('APP INITIALIZED.');
  };

  clearApp = () => {
    const { layout } = this.state;
    const wallets = {};
    layout.redirectToReferrer = false;

    this.setState({ layout, wallets });

    if (this.updateWalletsInterval) clearInterval(this.updateWalletsInterval);
    if (this.updateBlockchainHeightInterval) clearInterval(this.updateBlockchainHeightInterval);
    if (this.updateMarketPricesInterval) clearInterval(this.updateMarketPricesInterval);
    if (this.updatePricesInterval) clearInterval(this.updatePricesInterval);
    // console.log('APP CLEARED.');
  };

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default withRouter(AppContextProvider);
