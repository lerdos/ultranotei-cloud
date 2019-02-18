import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';


const Market = () => {
  const { markets } = useContext(AppContext);

  const btcFormatOptions = { minimumFractionDigits: 8, maximumFractionDigits: 8 };
  const volumeFormatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

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
              <p>{markets[market].ask.toLocaleString(undefined, btcFormatOptions)}</p>
            </div>
            <div className="col">
              <label className="tx-12">Bid</label>
              <p>{markets[market].bid.toLocaleString(undefined, btcFormatOptions)}</p>
            </div>
            <div className="col">
              <label className="tx-12">Volume</label>
              <p>{markets[market].volume.toLocaleString(undefined, volumeFormatOptions)}</p>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  )
};

export default Market;

