import React from 'react';
import update from 'immutability-helper';


class Market extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      markets: {
        graviex: { apiURL: 'https://graviex.net/api/v2/tickers/ccxbtc.json' },
        stex: { apiURL: 'https://api.wallet.conceal.network/api/stex/status' },
      },
      updateInterval: 30,  // in seconds
    };

    this.fetchPrices = this.fetchPrices.bind(this);
  }

  componentWillMount() {
    this.fetchPrices();
  }

  componentDidMount() {
    this.fetchPricesInterval = setInterval(this.fetchPrices, this.state.updateInterval * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchPricesInterval);
  }

  fetchPrices() {
    const { markets } = this.state;
    Object.keys(markets).forEach(market => {
      fetch(markets[market].apiURL)
        .then(r => r.json())
        .then(res => {
          this.setState(prevState =>
            update(prevState, {
              markets: {
                [market]: {
                  $merge: {
                    ask: parseFloat(market === 'graviex' ? res.ticker.sell : res.message[0].ask),
                    buy: parseFloat(market === 'graviex' ? res.ticker.buy : res.message[0].bid),
                    volume: parseFloat(market === 'graviex' ? res.ticker.vol : res.message[0].vol),
                  },
                },
              },
            }));
        })
        .catch(err => console.error(err));
    });
  }

  render() {
    const { markets } = this.state;

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
                <p>{markets[market].ask && markets[market].ask.toFixed(8)}</p>
              </div>
              <div className="col">
                <label className="tx-12">Buy</label>
                <p>{markets[market].buy && markets[market].buy.toFixed(8)}</p>
              </div>
              <div className="col">
                <label className="tx-12">Volume</label>
                <p>{markets[market].volume && markets[market].volume.toFixed(2)}</p>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Market;
