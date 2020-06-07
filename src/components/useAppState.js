import { useReducer, useRef } from 'react';

import { constants as appSettings } from './constants';


const initialState = Auth => ({
  appSettings,
  layout: {
    lastUpdate: new Date(),
    redirectToReferrer: false,
    formSubmitted: false,
    message: {},
    userLoaded: false,
    idLoaded: false,
    messagesLoaded: false,
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
    updateWalletsInterval: 60,  // seconds
    updateMessagesInterval: 60,  // seconds
    updateIdInterval: 60,  // seconds
    qrCodeURL: '',
    twoFACode: '',
    twoFAEnabled: false,
    minimumPasswordLength: 8,
  },
  wallets: {},
  messages: {},
  id: [],
  network: {
    blockchainHeight: 0,
  },
  prices: {
    priceBTCUSD: 0,
    priceCCXBTC: 0,
  },
  intervals: [],
});

let updatedState;

const reducer = (state, action) => {
  let result = {};
  switch (action.type) {
    case 'USER_LOADED':
      result = {
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
      break;
    case '2FA_CHECK':
      result = {
        ...state,
        userSettings: {
          ...state.userSettings,
          twoFAEnabled: action.value,
        },
      };
      break;
    case 'SET_IPN_CONFIG':
      result = {
        ...state,
        wallets: {
          ...state.wallets,
          [action.address]: {
            ...state.wallets[action.address],
            ipn: {
              ...state.wallets[action.address].ipn,
              ...action.ipn
            },
          },
        },
      };
      break;
    case 'UPDATE_IPN_CONFIG':
      result = {
        ...state,
        userSettings: {
          ...state.userSettings,
          ipn: {
            ...state.userSettings.ipn,
            ...action.ipn,
          },
        }
      };
      break;
    case 'UPDATE_QR_CODE':
      result = {
        ...state,
        layout: {
          ...state.layout,
          qrCodeUrl: action.qrCodeUrl,
        },
      };
      break;
    case 'WALLETS_LOADED':
      result = {
        ...state,
        layout: {
          ...state.layout,
          walletsLoaded: true,
        },
      };
      break;
    case 'SET_WALLET_KEYS':
      result = {
        ...state,
        wallets: {
          ...state.wallets,
          [action.address]: {
            ...state.wallets[action.address],
            keys: action.keys,
          }
        }
      };
      break;
    case 'CREATE_WALLET':
      if (!(action.address in state.wallets)) state.wallets[action.address] = {};
      result = {
        ...state,
        wallets: {
          ...state.wallets,
        },
      };
      break;
    case 'UPDATE_WALLETS':
      result = {
        ...state,
        wallets: {
          ...state.wallets,
          ...action.wallets,
        },
      };
      break;
    case 'DELETE_WALLET':
      const { address } = action;
      delete state.wallets[address];
      result = {
        ...state,
        wallets: {
          ...state.wallets,
        },
      };
      break;
    case 'CLEAR_WALLETS':
      result = {
        ...state,
        wallets: {},
      };
      break;
    case 'SEND_TX':
      result = {
        ...state,
        layout: {
          ...state.layout,
          sendTxResponse: action.sendTxResponse,
        },
      };
      break;
    case 'SET_ID':
      result = {
        ...state,
        id: action.id,
        layout: {
          ...state.layout,
          idLoaded: true,
        },
      };
      break;
    case 'SET_ID_CHECK':
      result = {
        ...state,
        layout: {
          ...state.layout,
          idAvailable: action.idAvailable,
        },
      };
      break;
    case 'SET_MESSAGES':
      result = {
        ...state,
        layout: {
          ...state.layout,
          messagesLoaded: true,
        },
        messages: { ...action.messages },
      };
      break;
    case 'SEND_MESSAGE':
      result = {
        ...state,
        layout: {
          ...state.layout,
          sendMessageResponse: action.sendMessageResponse,
        },
      };
      break;
    case 'UPDATE_BLOCKCHAIN_HEIGHT':
      result = {
        ...state,
        network: {
          ...state.network,
          blockchainHeight: action.blockchainHeight,
        },
      };
      break;
    case 'UPDATE_MARKET':
      const { market, marketData } = action;
      const data = marketData.result !== 'error'
        ? { ...state.markets[market], ...marketData }
        : { ...state.markets[market] };
      if (market === 'stex') marketData.volume = marketData.vol_market || 0;
      result = {
        ...state,
        markets: {
          ...state.markets,
          [market]: {
            ...data,
          },
        },
      };
      break;
    case 'UPDATE_PRICES':
      const { pricesData } = action;
      result = {
        ...state,
        prices: {
          ...state.prices,
          priceCCXBTC: pricesData.conceal && pricesData.conceal.btc ? pricesData.conceal.btc : 0,
        },
      };
      break;
    case 'UPDATE_MARKET_DATA':
      result = {
        ...state,
        marketData: {
          ...state.marketData,
          ...action.marketData,
        },
      };
      break;
    case 'FORM_SUBMITTED':
      result = {
        ...state,
        layout: {
          ...state.layout,
          formSubmitted: action.value,
        },
      };
      if (action.value) result.layout.message = {};
      break;
    case 'DISPLAY_MESSAGE':
      if (!action.message) action.message = {};
      result = {
        ...state,
        layout: {
          ...state.layout,
          message: action.id ? { [action.id]: action.message } : action.message,
        },
      };
      break;
    case 'REDIRECT_TO_REFERRER':
      result = {
        ...state,
        layout: {
          ...state.layout,
          redirectToReferrer: action.value,
        },
      };
      break;
    case 'APP_UPDATED':
      result = {
        ...state,
        layout: {
          ...state.layout,
          lastUpdate: new Date(),
        },
      };
      break;
    case 'SET_INTERVALS':
      const intervals = action.intervals.map(i => setInterval(i.fn, i.time * 1000));
      result = {
        ...state,
        intervals,
      };
      break;
    case 'CLEAR_APP':
      state.intervals.forEach(interval => clearInterval(interval));
      result = {
        ...state,
        wallets: {},
        intervals: [],
      };
      break;
    default:
      throw new Error();
  }

  updatedState.current = result;
  return result;
};

const useAppState = Auth => {
  const state = initialState(Auth);
  updatedState = useRef(state);
  return [...useReducer(reducer, state), updatedState];
};


export default useAppState;
