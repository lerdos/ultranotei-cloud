import React from 'react';
import { Link } from 'react-router-dom';


const UpcomingFeatures = () => (
  <div className="card card-info">
    <div className="card-body pd-40">
      <h5 className="tx-inverse mg-b-20">Upcoming Features</h5>
      <p>Click for a list of upcoming features, including encrypted messages, deposits, and
        investments.</p>
      <Link to="/upcoming_features" className="btn btn-primary btn-block">Take a Tour</Link>
    </div>
  </div>
);

export default UpcomingFeatures;
