import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';


const PortfolioCCX = () => {
  const { state } = useContext(AppContext);
  const { appSettings, wallets } = state;

  const totalCCX = Object.keys(wallets)
    .reduce((acc, curr) => acc + wallets[curr].balance + wallets[curr].locked || acc, 0);
  const formatOptions = {
    minimumFractionDigits: appSettings.coinDecimals,
    maximumFractionDigits: appSettings.coinDecimals,
  };
  return (
    <div className="dash-content">
      <label className="tx-primary">PORTFOLIO CCX</label>
      <h2>{totalCCX.toLocaleString(undefined, formatOptions)} CCX</h2>
    </div>
  )
};

export default PortfolioCCX;
