import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import FormLabelDescription from '../elements/FormLabelDescription';
import AvatarForm from '../elements/Settings/AvatarForm';
import EmailForm from '../elements/Settings/EmailForm';
import TwoFAForm from '../elements/Settings/TwoFAForm';


const Settings = () => {
  const { actions, state } = useContext(AppContext);
  const { resetPassword } = actions;
  const { user } = state;

  return (
    <div>
      <div className="slim-mainpanel settings">
        <div className="container">

          <div className="slim-pageheader">
            <ol className="breadcrumb slim-breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Settings</li>
            </ol>
            <h6 className="slim-pagetitle">Settings</h6>
          </div>

          <div className="section-wrapper mg-t-20">
            <label className="section-title">General</label>
            <div className="row">
              <div className="col-lg-12">
                <div className="form-layout form-layout-7">

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4">
                      User Name
                      <FormLabelDescription>Your user name</FormLabelDescription>
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">{user.name}</div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4">
                      Email
                      <FormLabelDescription>Current E-mail</FormLabelDescription>
                    </div>
                    <div className="col-7 col-sm-8 wallet-address"><EmailForm /></div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start pd-t-25-force">
                      Avatar
                      <FormLabelDescription>Profile's avatar (JPG format only)</FormLabelDescription>
                    </div>
                    <div className="col-7 col-sm-8 wallet-address"><AvatarForm /></div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4">
                      Password
                      <FormLabelDescription>Change password</FormLabelDescription>
                    </div>
                    <div className="col-7 col-sm-8 wallet-address row-text-button">
                      <div className="settingsText">
                        Click on the button to send reset password link to <strong>{user.email}</strong>
                      </div>
                      <div className="settingsButton">
                        <button
                          className="btn btn-outline-primary btn-uppercase-sm"
                          onClick={e =>
                            window.confirm('Send reset password email? You will be logged out!') &&
                            resetPassword({
                              e,
                              email: user.email,
                              id: 'loginForm',
                            })
                          }
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start pd-t-25-force">
                      2 Factor Authentication
                      <FormLabelDescription>2 Factor Authentication for additional security</FormLabelDescription>
                    </div>
                    <div className="col-7 col-sm-8 wallet-address"><TwoFAForm /></div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
};

export default Settings;
