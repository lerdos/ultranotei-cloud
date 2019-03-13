import { useReducer } from 'react';

import { constants as appSettings } from './constants';


const useAppState = Auth => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'USER_LOADED':
        return {
          ...state,
          layout: {
            ...state.layout,
            userLoaded: true,
          },
          user: {
            ...state.user,
            ...action.user,
          },
        };
      case '2FA_CHECK':
        return {
          ...state,
          userSettings: {
            ...state.userSettings,
            twoFAEnabled: action.value,
          },
        };
      case 'UPDATE_QR_CODE':
        return {
          ...state,
          layout: {
            ...state.layout,
            qrCodeUrl: action.qrCodeUrl,
          },
        };
      case 'WALLETS_LOADED':
        return {
          ...state,
          layout: {
            ...state.layout,
            walletsLoaded: true,
          },
        };
      case 'SET_WALLET_KEYS':
        return {
          ...state,
          wallets: {
            ...state.wallets,
            [action.address]: {
              ...state.wallets[action.address],
              keys: action.keys,
            }
          }
        };
      case 'CREATE_WALLET':
        if (!(action.address in state.wallets)) state.wallets[action.address] = {};
        return {
          ...state,
          wallets: {
            ...state.wallets,
          },
        };
      case 'UPDATE_WALLET':
        return {
          ...state,
          wallets: {
            ...state.wallets,
            [action.address]: {
              ...state.wallets[action.address],
              ...action.walletData,
              loaded: true,
            }
          },
        };
      case 'DELETE_WALLET':
        const { address } = action;
        delete state.wallets[address];
        return {
          ...state,
          wallets: {
            ...state.wallets,
          },
        };
      case 'SEND_TX':
        return {
          ...state,
          layout: {
            ...state.layout,
            sendTxResponse: action.sendTxResponse,
          },
        };
      case 'UPDATE_BLOCKCHAIN_HEIGHT':
        return {
          ...state,
          network: {
            ...state.network,
            blockchainHeight: action.blockchainHeight,
          },
        };
      case 'UPDATE_MARKET':
        const { market, marketData } = action;
        const data = marketData.result !== 'error'
          ? { ...state.markets[market], ...marketData }
          : { ...state.markets[market] };
        if (market === 'stex') marketData.volume = marketData.vol_market || 0;
        return {
          ...state,
          markets: {
            ...state.markets,
            [market]: {
              ...data,
            },
          },
        };
      case 'UPDATE_PRICES':
        const { pricesData } = action;
        return {
          ...state,
          prices: {
            ...state.prices,
            priceCCXBTC: pricesData.conceal && pricesData.conceal.btc ? pricesData.conceal.btc : 0,
          },
        };
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
      case 'DISPLAY_MESSAGE':
        return {
          ...state,
          layout: {
            ...state.layout,
            message: action.message,
          },
        };
      case 'REDIRECT_TO_REFERRER':
        return {
          ...state,
          layout: {
            ...state.layout,
            redirectToReferrer: action.value,
          },
        };
      case 'APP_UPDATED':
        return {
          ...state,
          layout: {
            ...state.layout,
            lastUpdate: new Date(),
          },
        };
      case 'SET_INTERVALS':
        const intervals = action.intervals.map(i => setInterval(i.fn, i.time * 1000));
        return {
          ...state,
          intervals,
        };
      case 'CLEAR_APP':
        state.intervals.forEach(interval => clearInterval(interval));
        return {
          ...state,
          wallets: {},
          intervals: [],
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
      loggedIn: () => Auth.loggedIn(),
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
    intervals: [],
  };

  return useReducer(reducer, initialState);
};


export default useAppState;
