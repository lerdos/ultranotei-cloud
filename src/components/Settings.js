import React from 'react';
import { Link } from 'react-router-dom';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';


class Settings extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <div className="slim-mainpanel">
          <div className="container">

            <div className="slim-pageheader">
              <ol className="breadcrumb slim-breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Settings</li>
              </ol>
              <h6 className="slim-pagetitle">Settings</h6>
            </div>

            <div className="section-wrapper mg-t-20">
              <label className="section-title">Settings</label>
              <div className="row">
                <div className="col-lg-12">
                  Settings...
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Settings);
