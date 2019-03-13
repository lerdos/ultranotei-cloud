import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';


const Market = () => {
  const { state } = useContext(AppContext);
  const { markets } = state;

  const btcFormatOptions = { minimumFractionDigits: 8, maximumFractionDigits: 8 };
  const volumeFormatOptions = { minimumFractionDigits: 4, maximumFractionDigits: 4 };

  return (
    <div className="card card-sales">
      {Object.keys(markets).map(market =>
        <React.Fragment key={market}>
          <h6 className="slim-card-title tx-primary">
            {market.toUpperCase()}
          </h6>
          <div className="row">
            <div className="col">
              <label className="tx-12">Ask</label>
              <p>{parseFloat(markets[market].ask).toLocaleString(undefined, btcFormatOptions)}</p>
            </div>
            <div className="col">
              <label className="tx-12">Bid</label>
              <p>{parseFloat(markets[market].bid).toLocaleString(undefined, btcFormatOptions)}</p>
            </div>
            <div className="col">
              <label className="tx-12">Volume</label>
              <p>{parseFloat(markets[market].volume).toLocaleString(undefined, volumeFormatOptions)}</p>
            </div>
          </div>
        </React.Fragment>
      )}
      <small className="text-right">All values in BTC.</small>
    </div>
  )
};

export default Market;

