import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';


const Height = () => {
  const { state } = useContext(AppContext);
  const { network } = state;

  return (
    <div className="dash-content">
      <label className="tx-primary">CURRENT HEIGHT</label>
      <h2>{network.blockchainHeight.toLocaleString()}</h2>
    </div>
  )
};

export default Height;
