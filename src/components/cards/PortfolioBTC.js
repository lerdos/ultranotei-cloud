import React from 'react';


const PortfolioBTC = (props) => {
  const { priceCCXBTC, wallets } = props;
  const totalCCX = Object.keys(wallets)
    .reduce((acc, curr) => acc + wallets[curr].balance || acc, 0)
    .toLocaleString();

  return (
    <div className="dash-content">
      <label className="tx-primary">PORTFOLIO BTC</label>
      <h2>{(priceCCXBTC * totalCCX).toFixed(8)} BTC</h2>
    </div>
  )
};

export default PortfolioBTC;
