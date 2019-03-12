import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';


const Transactions = () => {
  const { state } = useContext(AppContext);
  const { wallets } = state;

  const totalTx = Object.keys(wallets).reduce((acc, curr) => wallets[curr].transactions ? acc + wallets[curr].transactions.length : acc, 0);

  return (
    <div className="dash-content">
      <label className="tx-primary">TRANSACTIONS</label>
      <h2>{totalTx.toLocaleString()}</h2>
    </div>
  )
};

export default Transactions;
