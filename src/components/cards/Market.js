import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';


const Market = () => {
  const { markets } = useContext(AppContext);

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
              <p>{markets[market].ask.toLocaleString(undefined, { minimumFractionDigits: 8 })}</p>
            </div>
            <div className="col">
              <label className="tx-12">Bid</label>
              <p>{markets[market].bid.toLocaleString(undefined, { minimumFractionDigits: 8 })}</p>
            </div>
            <div className="col">
              <label className="tx-12">Volume</label>
              <p>{markets[market].volume.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  )
};

export default Market;

