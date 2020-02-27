import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';
import { FormattedAmount } from '../../helpers/utils';


const PortfolioCCX = () => {
  const { state } = useContext(AppContext);
  const { wallets } = state;

  const totalCCX = Object.keys(wallets)
    .reduce((acc, curr) => acc + wallets[curr].balance + wallets[curr].locked || acc, 0);

  return (
    <div className="dash-content">
      <label className="tx-primary">PORTFOLIO CCX</label>
      <h2><FormattedAmount amount={totalCCX}/></h2>
    </div>
  )
};

export default PortfolioCCX;
