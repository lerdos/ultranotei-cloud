import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';
import { FormattedAmount } from '../../helpers/utils';


const PortfolioBTC = () => {
  const { state } = useContext(AppContext);
  const { prices, wallets } = state;

  const totalCCX = Object.keys(wallets).reduce((acc, curr) => acc + wallets[curr].balance + wallets[curr].locked || acc, 0);

  return (
    <div className="dash-content">
      <label className="tx-primary">PORTFOLIO BTC</label>
      <h2><FormattedAmount amount={prices.priceCCXBTC * totalCCX} currency="BTC" /></h2>
    </div>
  )
};

export default PortfolioBTC;
