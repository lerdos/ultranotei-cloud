import React from 'react';
import { Link } from 'react-router-dom';


const UpcomingFeatures = () => (
  <div>
    <div className="slim-mainpanel">
      <div className="container">

        <div className="slim-pageheader">
          <ol className="breadcrumb slim-breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Upcoming Features</li>
          </ol>
          <h6 className="slim-pagetitle">Upcoming Features</h6>
        </div>

        <div className="section-wrapper mg-t-20">
          <label className="section-title">Upcoming Features</label>
          <div className="row">
            <div className="col-lg-12">
              ...
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default UpcomingFeatures;
