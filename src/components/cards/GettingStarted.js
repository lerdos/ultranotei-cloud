import React from 'react';
import { Link } from 'react-router-dom';


const GettingStarted = () => (
  <div className="card card-info">
    <div className="card-body pd-40">
      <h5 className="tx-inverse mg-b-20">How the wallet works</h5>
      <p>An introductory tour of all the elements that currently make up the online wallet. Click for more
        information.</p>
      <Link to="/getting_started" className="btn btn-primary btn-block">Getting Started</Link>
    </div>
  </div>
);

export default GettingStarted;
