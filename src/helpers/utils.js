import React, { useContext } from 'react';
import { store } from 'react-notifications-component';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { AppContext } from '../components/ContextProvider';


export const maskAddress = (address, maskingChar='.', maskedChars=8, charsPre=7, charsPost=7) => {
  const pre = address.substring(0, charsPre);
  const post = address.substring(address.length - charsPost);
  return `${pre}${maskingChar.repeat(maskedChars)}${post}`;
};

export const showNotification = options => {
  const {
    duration = 600 * 1000, // Dismiss after 10 minutes
    message,
    title = 'ERROR',
    type = 'danger',
  } = options;

  store.addNotification({
    message,
    title,
    type,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],
    dismiss: { duration },
  });
};

export const CCXAmount = props => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  const { amount } = props;

  const formatOptions = {
    minimumFractionDigits: appSettings.coinDecimals,
    maximumFractionDigits: appSettings.coinDecimals,
  };

  return (<>{amount.toLocaleString(undefined, formatOptions)} CCX</>);
};

export const CCXExplorerLink = props => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  const {
    hash,
    type = 'transaction',
  } = props;

  return (
    <a
      href={`${appSettings.explorerURL}/index.html?hash=${hash}#blockchain_${type}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {hash} <FaExternalLinkAlt className="tx-link-icon" />
    </a>
  );
};
