import React from 'react';


const PortfolioCCX = (props) => {
  const { wallets } = props;
  const totalCCX = Object.keys(wallets)
    .reduce((acc, curr) => acc + wallets[curr].balance || acc, 0)
    .toLocaleString();

  return (
    <div className="dash-content">
      <label className="tx-primary">PORTFOLIO CCX</label>
      <h2>{totalCCX} CCX</h2>
    </div>
  )
};

export default PortfolioCCX;
