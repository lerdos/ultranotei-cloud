import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../ContextProvider';


const Profile = () => {
  const { user } = useContext(AppContext);

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
                <p>Avatar: {user.avatar}</p>
                <p>User name: {user.name}</p>
                <p>E-mail: {user.email}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
};

export default Profile;

