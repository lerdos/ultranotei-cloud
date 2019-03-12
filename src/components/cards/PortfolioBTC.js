import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';


const PortfolioBTC = () => {
  const { state } = useContext(AppContext);
  const { prices, wallets } = state;

  const totalCCX = Object.keys(wallets).reduce((acc, curr) => acc + wallets[curr].balance || acc, 0);

  const formatOptions = { minimumFractionDigits: 8, maximumFractionDigits: 8 };

  return (
    <div className="dash-content">
      <label className="tx-primary">PORTFOLIO BTC</label>
      <h2>{(prices.priceCCXBTC * totalCCX).toLocaleString(undefined, formatOptions)} BTC</h2>
    </div>
  )
};

export default PortfolioBTC;
