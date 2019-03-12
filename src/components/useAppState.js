import { useReducer } from 'react';

import { constants as appSettings } from './constants';


const useAppState = Auth => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'FORM_SUBMITTED':
        const s = {
          ...state,
          layout: {
            ...state.layout,
            formSubmitted: action.value,
          },
        };
        if (action.value) s.layout.message = null;
        return s;
      case 'REDIRECT_TO_REFERRER':
        return {
          ...state,
          layout: {
            ...state.layout,
            redirectToReferrer: action.value,
          },
        };
      case 'DISPLAY_MESSAGE':
        return {
          ...state,
          layout: {
            ...state.layout,
            message: action.message,
          },
        };
      case 'SIGNUP_SUCCESS':
        return {
          ...state,
        };
      default:
        throw new Error();
    }
  };

  const initialState = {
    appSettings,
    layout: {
      lastUpdate: new Date(),
      redirectToReferrer: false,
      formSubmitted: false,
      message: null,
      userLoaded: false,
      walletsLoaded: false,
      sendTxResponse: null,
      qrCodeUrl: '',
      editContactData: {},
    },
    user: {
      userName: '',
      loggedIn: Auth.loggedIn(),
      addressBook: [],
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
  };
  return useReducer(reducer, initialState);
};


export default useAppState;
