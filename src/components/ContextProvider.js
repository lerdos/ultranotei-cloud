import React, { useEffect } from 'react';
import { withRouter } from 'react-router';

import AuthHelper from '../helpers/AuthHelper';
import ApiHelper from '../helpers/ApiHelper';
import useAppState from './useAppState';


export const AppContext = React.createContext();
const Auth = new AuthHelper();

const AppContextProvider = props => {
  const [state, dispatch] = useAppState(Auth);
  const Api = new ApiHelper({ Auth, state });

  const loginUser = options => {
    const { e, email, password, twoFACode, id } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Auth.login(email, password, twoFACode)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'REDIRECT_TO_REFERRER', value: true });
          initApp();
        } else {
          dispatch({ type: 'DISPLAY_MESSAGE', message: res.message, id });
        }
      })
      .catch(err => dispatch({ type: 'DISPLAY_MESSAGE', message: `ERROR ${err}`, id }))
      .finally(() => dispatch({ type: 'FORM_SUBMITTED', value: false }));
  };

  const signUpUser = options => {
    const { e, userName, email, password, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.signUpUser(userName, email, password)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow the instructions to activate your account.';
          return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPassword = options => {
    const { e, email, id } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    Api.resetPassword(email)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow instructions to reset password.';
          Auth.logout();
          clearApp();
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPasswordConfirm = options => {
    const { e, password, token, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.resetPasswordConfirm(password, token)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = (<>Password successfully changed.<br />Please log in.</>);
          return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const logoutUser = () => {
    clearApp();
    Auth.logout();
    return props.history.replace('/');
  };

  const getUser = () => {
    Api.getUser()
      .then(res => dispatch({ type: 'USER_LOADED', user: res.message }))
      .catch(e => console.error(e));
  };

  const updateUser = ({ e, id, email, avatar }) => {
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.updateUser({ email, file: avatar })
      .then(res => {
        if (res.result === 'success') {
          getUser();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const addContact = (contact, extras) => {
    const { e, label, address, paymentID, entryID, edit, id } = contact;
    if (e) e.preventDefault();
    let message;
    Api.addContact(label, address, paymentID, entryID, edit)
      .then(res => {
        if (res.result === 'success') {
          getUser();
          extras.forEach(fn => fn());
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message, id }));
  };

  const deleteContact = contact => {
    const { entryID } = contact;
    let message;
    Api.deleteContact(entryID)
      .then(res => {
        if (res.result === 'success') {
          getUser();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const getQRCode = () => {
    let message;
    Api.getQRCode()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'UPDATE_QR_CODE', qrCodeUrl: res.message.qrCodeUrl });
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const check2FA = () => {
    let message;
    Api.check2FA()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: '2FA_CHECK', value: res.message.enabled });
          if (!res.message.enabled) getQRCode();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const update2FA = (options, extras) => {
    const { e, twoFACode, enable, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.update2FA(twoFACode, enable)
      .then(res => {
        if (res.result === 'success') {
          message = `QR Code ${enable ? 'enabled' : 'disabled'}.`;
          check2FA();
          extras.forEach(fn => fn());
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message, id }));
  };

  const getIPNConfig = address => {
    Api.getIPNConfig(address)
      .then(res =>
        res.result === 'success' && res.message[0] !== false &&
        dispatch({ type: 'SET_IPN_CONFIG', ipn: res.message, address })
      )
      .catch(e => console.error(e));
  };

  const getIPNClient = client => {
    Api.getIPNClient(client)
      .then(res =>
        res.result === 'success' && res.message[0] !== false &&
        dispatch({ type: 'SET_IPN_CONFIG', ipn: res.message })
      )
      .catch(e => console.error(e));
  };

  const updateIPNConfig = options => {
    const { e, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.updateIPNConfig(options)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'UPDATE_IPN_CONFIG', clientKey: res.message.config })
        } else {
          message = res.message;
        }
      })
      .catch(e => console.error(e))
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message, id }));
  };

  const createWallet = () => {
    let message;
    Api.createWallet()
      .then(res => {
        if (res.result === 'success') {
          const address = res.message.wallet;
          dispatch({ type: 'CREATE_WALLET', address });
          getWalletDetails(address);
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const getWalletDetails = address => {
    const { location } = props;
    let message;
    Api.getWalletDetails(address)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'UPDATE_WALLET', address, walletData: res.message });
          dispatch({ type: 'APP_UPDATED' });
          if (!location.pathname.startsWith('/pay') && !location.pathname.startsWith('/donate')) {
            getIPNConfig(address);
          }
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const getWalletList = () => {
    Api.getWalletList()
      .then(res => {
        res.message.addresses && res.message.addresses.forEach(address => {
          dispatch({ type: 'CREATE_WALLET', address });
          getWalletDetails(address);
        });
      })
      .catch(e => console.error(e))
      .finally(() => dispatch({ type: 'WALLETS_LOADED' }));
  };

  const getWalletKeys = options => {
    const { e, address, code, id } = options;
    e.preventDefault();
    const { wallets } = state;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    if (!wallets[address].keys) {
      Api.getWalletKeys(address, code)
        .then(res => {
          if (res.result === 'success') {
            dispatch({ type: 'SET_WALLET_KEYS', keys: res.message, address });
          } else {
            message = res.message;
          }
        })
        .catch(err => { message = `ERROR ${err}` })
        .finally(() => {
          dispatch({ type: 'FORM_SUBMITTED', value: false });
          if (message) dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        });
    }
  };

  const downloadWalletKeys = keys => {
    const element = document.createElement('a');
    const file = new Blob(
      [JSON.stringify(keys, null, 2)],
      { type: 'text/plain' },
    );
    element.href = URL.createObjectURL(file);
    element.download = 'conceal.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const deleteWallet = address => {
    Api.deleteWallet(address)
      .then(res => res.result === 'success' && dispatch({ type: 'DELETE_WALLET', address }))
      .catch(e => console.error(e));
  };

  const sendTx = (options, extras) => {
    const { e, wallet, address, paymentID, amount, message, twoFACode, password, label, ref, id } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let layoutMessage;
    let sendTxResponse;
    Api.sendTx(wallet, address, paymentID, amount, message, twoFACode, password, ref)
      .then(res => {
        if (res.result === 'error' || res.message.error) {
          sendTxResponse = {
            status: 'error',
            message: `Wallet Error: ${res.message.error ? res.message.error.message : res.message}`,
          };
          dispatch({ type: 'SEND_TX', sendTxResponse });
          return;
        }
        sendTxResponse = {
          status: 'success',
          message: res.message.result,
          redirect: res.message.redirect,
        };
        dispatch({ type: 'SEND_TX', sendTxResponse });
        if (label && label !== '') addContact({ label, address, paymentID });
        extras.forEach(fn => fn());
        getWalletList();
      })
      .catch(err => { layoutMessage = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message: layoutMessage, id });
      });
  };

  const getBlockchainHeight = () => {
    Api.getBlockchainHeight()
      .then(res => dispatch({ type: 'UPDATE_BLOCKCHAIN_HEIGHT', blockchainHeight: res.message.height }))
      .catch(e => console.error(e));
  };

  const getMarketPrices = () => {
    const { markets } = state;
    Object.keys(markets).forEach(market => {
      Api.getMarketPrices(markets[market].apiURL)
        .then(res => {
          dispatch({ type: 'UPDATE_MARKET', market, marketData: res })
        })
        .catch(e => console.error(e));
    });
  };

  const getPrices = () => {
    const { appSettings } = state;
    Api.getPrices(appSettings.coingeckoAPI)
      .then(res => dispatch({ type: 'UPDATE_PRICES', pricesData: res }))
      .catch(e => console.error(e));
  };

  const getMarketData = () => {
    Api.getMarketData()
      .then(res => dispatch({ type: 'UPDATE_MARKET_DATA', marketData: res }))
      .catch(e => console.error(e));
  };

  const actions = {
    loginUser,
    signUpUser,
    resetPassword,
    resetPasswordConfirm,
    logoutUser,
    getUser,
    updateUser,
    check2FA,
    update2FA,
    getQRCode,
    createWallet,
    getWalletList,
    deleteWallet,
    getWalletKeys,
    downloadWalletKeys,
    updateIPNConfig,
    getIPNClient,
    sendTx,
    getBlockchainHeight,
    getMarketPrices,
    getPrices,
    addContact,
    deleteContact,
    getMarketData,
  };

  const initApp = () => {
    const { location } = props;
    const { appSettings, userSettings } = state;

    getUser();
    check2FA();
    getWalletList();
    getMarketData();

    const intervals = [];
    intervals.push(
      { fn: getWalletList, time: userSettings.updateWalletsInterval },
      { fn: getMarketData, time: appSettings.updateMarketPricesInterval },
    );

    if (!location.pathname.startsWith('/donate') && !location.pathname.startsWith('/pay')) {
      getBlockchainHeight();
      getMarketPrices();
      getPrices();
      intervals.push(
        { fn: getBlockchainHeight, time: appSettings.updateBlockchainHeightInterval },
        { fn: getMarketPrices, time: appSettings.updateMarketPricesInterval },
        { fn: getPrices, time: appSettings.updateMarketPricesInterval },
      )
    }

    if (location.pathname.startsWith('/pay')) {
      const params = new URLSearchParams(props.location.search);
      const client = params.get('client');
      if (client) getIPNClient(client);
    }

    dispatch({ type: 'SET_INTERVALS', intervals });
  };

  const clearApp = () => {
    dispatch({ type: 'CLEAR_APP' });
    dispatch({ type: 'REDIRECT_TO_REFERRER', value: false });
  };

  const onRouteChanged = location => {
    const isRedirect = props.history.action === 'REPLACE';
    if ((location.pathname !== '/signup' && !location.pathname.startsWith('/reset_password')) || !isRedirect) {
      dispatch({ type: 'DISPLAY_MESSAGE', message: null });
    }
    if (location.pathname === '/login' && location.search === '?activated') {
      const message = (<>Account successfully activated.<br />Please log in.</>);
      dispatch({ type: 'DISPLAY_MESSAGE', message });
    }
  };

  useEffect(() => {
    if (state.user.loggedIn()) initApp();
    return () => clearApp();
  }, []);

  useEffect(() => onRouteChanged(props.location), [props.location]);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {props.children}
    </AppContext.Provider>
  )
};

export default withRouter(AppContextProvider);
