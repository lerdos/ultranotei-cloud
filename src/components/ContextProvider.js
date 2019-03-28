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

  const loginUser = (e, email, password, twoFACode) => {
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Auth.login(email, password, twoFACode)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'REDIRECT_TO_REFERRER', value: true });
          initApp();
        } else {
          dispatch({ type: 'DISPLAY_MESSAGE', message: res.message });
        }
      })
      .catch(err => dispatch({ type: 'DISPLAY_MESSAGE', message: `ERROR ${err}` }))
      .finally(() => dispatch({ type: 'FORM_SUBMITTED', value: false }));
  };

  const signUpUser = (e, userName, email, password) => {
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
        dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPassword = (e, email) => {
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
        dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPasswordConfirm = (e, password, token) => {
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
        dispatch({ type: 'DISPLAY_MESSAGE', message });
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

  const updateUser = ({ e, email, avatar }) => {
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
        dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const addContact = (contact, extras) => {
    const { e, label, address, paymentID, entryID, edit } = contact;
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
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
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
    const { e, twoFACode, enable } = options;
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
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
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
    let message;
    Api.getWalletDetails(address)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'UPDATE_WALLET', address, walletData: res.message });
          dispatch({ type: 'APP_UPDATED' });
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

  const getWalletKeys = (e, address, code) => {
    e.preventDefault();
    const { wallets } = state;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    if (!wallets[address].keys) {
      Api.getWalletKeys(address, code)
        .then(res => {
          if (res.result === 'success') {
            dispatch({ type: 'SET_WALLET_KEYS', keys: res.message });
          } else {
            message = res.message;
          }
        })
        .catch(err => { message = `ERROR ${err}` })
        .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
    }
  };

  const deleteWallet = address => {
    Api.deleteWallet(address)
      .then(res => res.result === 'success' && dispatch({ type: 'DELETE_WALLET', address }))
      .catch(e => console.error(e));
  };

  const sendTx = (options, extras) => {
    const { e, wallet, address, paymentID, amount, message, twoFACode, password, label } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let layoutMessage;
    let sendTxResponse;
    Api.sendTx(wallet, address, paymentID, amount, message, twoFACode, password)
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
        };
        dispatch({ type: 'SEND_TX', sendTxResponse });
        if (label && label !== '') addContact({ label, address, paymentID });
        extras.forEach(fn => fn());
      })
      .catch(err => { layoutMessage = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message: layoutMessage });
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
    sendTx,
    getBlockchainHeight,
    getMarketPrices,
    getPrices,
    addContact,
    deleteContact,
    getMarketData,
  };

  const initApp = () => {
    const { appSettings, userSettings } = state;

    getUser();
    check2FA();
    getWalletList();
    getBlockchainHeight();
    getMarketPrices();
    getPrices();
    getMarketData();

    const intervals = [
      { fn: getWalletList, time: userSettings.updateWalletsInterval },
      { fn: getBlockchainHeight, time: appSettings.updateBlockchainHeightInterval },
      { fn: getMarketPrices, time: appSettings.updateMarketPricesInterval },
      { fn: getPrices, time: appSettings.updateMarketPricesInterval },
      { fn: getMarketData, time: appSettings.updateMarketPricesInterval },
    ];

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
