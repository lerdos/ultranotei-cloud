import React from 'react';


class Market extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      coingeckoData: {},
      graviexData: {},
      // stexData: {},
      updateInterval: 30,  // in seconds
      tickers: [],
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
    fetch('https://api.coingecko.com/api/v3/coins/conceal/tickers')
      .then(r => r.json())
      .then(coingeckoData => this.setState({ coingeckoData }))
      .catch(err => console.error(err));
    fetch('https://graviex.net/api/v2/tickers/ccxbtc.json')
      .then(r => r.json())
      .then(graviexData => this.setState({ graviexData }))
      .catch(err => console.error(err));
    /*fetch('https://app.stex.com/api2/prices')
      .then(r => r.json())
      .then(stexData => this.setState({ stexData }, () => console.log(this.state.stexData)))
      .catch(err => console.error(err));*/
  }

  render() {
    const {
      // coingeckoData,
      graviexData,
      // stexData,
    } = this.state;

    return (
      <div className="card card-sales">
        <h6 className="slim-card-title tx-primary">GRAVIEX</h6>
        <div className="row">
          <div className="col">
            <label className="tx-12">Ask</label>
            <p>{graviexData.ticker && parseFloat(graviexData.ticker.sell).toFixed(8)}</p>
          </div>
          <div className="col">
            <label className="tx-12">Buy</label>
            <p>{graviexData.ticker && parseFloat(graviexData.ticker.buy).toFixed(8)}</p>
          </div>
          <div className="col">
            <label className="tx-12">Volume</label>
            <p>{graviexData.ticker && parseInt(graviexData.ticker.vol).toLocaleString()}</p>
          </div>
        </div>
        {/*markets.map(market =>
          <React.Fragment key={`${market.market.identifier}-${market.target}`}>
            <h6 className="slim-card-title tx-primary">
              {market.market.name}
            </h6>
            <div className="row">
              <div className="col">
                <label className="tx-12">Ask</label>
                <p>{market.last.toFixed(8)}</p>
              </div>
              <div className="col">
                <label className="tx-12">Buy</label>
                <p></p>
              </div>
              <div className="col">
                <label className="tx-12">Volume</label>
                <p>{market.volume.toFixed(5)}</p>
              </div>
            </div>
          </React.Fragment>
        )*/}
      </div>
    );
  }
}

export default Market;
