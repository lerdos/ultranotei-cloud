import React from 'react';
import { Link } from 'react-router-dom';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';


class Profile extends React.Component {

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
                <li className="breadcrumb-item active" aria-current="page">Profile</li>
              </ol>
              <h6 className="slim-pagetitle">Profile</h6>
            </div>

            <div className="section-wrapper mg-t-20">
              <label className="section-title">Profile</label>
              <div className="row">
                <div className="col-lg-12">
                  Profile...
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Profile);
