import React, { useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from '../ContextProvider';


const MarketStats = () => {
  const { state } = useContext(AppContext);
  const { marketData } = state;

  const ccxToUSD =  marketData ? marketData.market_data.current_price.usd : 0;
  const ccxToBTC =  marketData ? marketData.market_data.current_price.btc : 0;
  const marketCap =  marketData ? marketData.market_data.market_cap.usd : 0;
  const marketCapRank =  marketData ? marketData.market_cap_rank : 0;
  const dailyVolume = marketData ? marketData.market_data.total_volume.usd : 0;

  const data = {
    labels: marketData ? marketData.market_data.sparkline_7d.price : [],
    datasets: [
      {
        fill: true,
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        borderColor: 'rgb(255, 165, 0)',
        borderWidth: 1,
        pointRadius: 0,
        data: marketData ? marketData.market_data.sparkline_7d.price : [],
      }
    ]
  };

  const options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          beginAtZero: true,
          fontSize: 10,
          callback: value => `$ ${value.toFixed(2)}`
        },
        gridLines: {
          color: 'rgba(255, 255, 255, .08)'
        },
      }],
      xAxes: [{
        display: false,
      }],
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        title: () => {},
        label: item => `$ ${parseFloat(item.value).toFixed(2)}`,
      }
    },
  };

  const format2Decimals = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const format8Decimals = { minimumFractionDigits: 8, maximumFractionDigits: 8 };

  return (
    <div>
      <div className="nav-statistics-wrapper mg-t-20">
        <nav className="nav">Market</nav>
      </div>

      <div id="blockStats" className="card card-dash-one mg-b-20">
        <div className="row no-gutters">
          <div className="col-lg-3">
            <div className="dash-content dash-small-info">
              <div className="icon icon-info">
                <FontAwesomeIcon icon="dollar-sign" fixedWidth />
              </div>
              <label className="tx-primary">CCX to USD</label>
              <h2>$ {ccxToUSD.toLocaleString(undefined, format2Decimals)}</h2>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="dash-content dash-small-info">
              <div className="icon icon-info">
                <FontAwesomeIcon icon={['fab', 'bitcoin']} fixedWidth />
              </div>
              <label className="tx-primary">CCX to BTC</label>
              <h2>{ccxToBTC.toLocaleString(undefined, format8Decimals)}</h2>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="dash-content dash-small-info">
              <div className="icon icon-info" />
              <label className="tx-primary">Marketcap</label>
              <h2>$ {parseInt(marketCap).toLocaleString()} ({marketCapRank})</h2>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="dash-content dash-small-info">
              <div className="icon icon-info">
                <FontAwesomeIcon icon={['far', 'money-bill-alt']} fixedWidth />
              </div>
              <label className="tx-primary">Daily Volume</label>
              <h2>$ {parseInt(dailyVolume).toLocaleString()}</h2>
            </div>
          </div>

        </div>
        </div>

      <div className="card card-info">
        <div className="card-body pd-40">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default MarketStats;
