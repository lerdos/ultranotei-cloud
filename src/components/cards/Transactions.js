import React from 'react';


const Transactions = (props) => {
  const { wallets } = props;
  const totalTx = Object.keys(wallets)
    .reduce((acc, curr) => wallets[curr].transactions ? acc + wallets[curr].transactions.length : acc, 0)
    .toLocaleString();

  return (
    <div className="dash-content">
      <label className="tx-primary">TRANSACTIONS</label>
      <h2>{totalTx}</h2>
    </div>
  )
};

export default Transactions;
