import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const Settings = () => {
  const { layout, user, userActions, userSettings } = useContext(AppContext);
  const { formSubmitted, message } = layout;

  // const userName = useFormInput('');
  const email = useFormInput('');
  const [avatar, setAvatar] = useState(user.avatar);
  const twoFACode = useFormInput('');
  const [twoFADialogOpened, toggle2FADialog] = useState(false);

  // const userNameValidation = (userName.value !== user.name && userName.value.length >= 3);
  const emailValidation = (email.value !== user.email && email.value.length >= 3);
  const avatarValidation = (avatar && avatar.name);
  const twoFAFormValidation = (parseInt(twoFACode.value) && twoFACode.value.length === 6);

  // const userNameValid = useFormValidation(userNameValidation);
  const emailValid = useFormValidation(emailValidation);
  const avatarValid = useFormValidation(avatarValidation);
  const twoFAFormValid = useFormValidation(twoFAFormValidation);

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
		    {message &&
			  <div className="text-danger mg-b-20">{message}</div>
  		    }
            <div className="row">
              <div className="col-lg-12">
                <div className="form-layout form-layout-7">

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4">
                      User Name
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      {user.name}
                      {/*
                      <form onSubmit={(e) => userActions.updateUser({ e, userName: userName.value })}>
                        <div className="input-group">
                          <input
                            value={user.name}
                            placeholder={user.name}
                            type="text"
                            name="userName"
                            className="form-control"
                            minLength={3}
                            readOnly={}
                          />
                          <span className="input-group-btn">
                            <button
                              className="btn btn-no-focus btn-outline-dark btn-uppercase-sm"
                              type="submit"
                              disabled={!userNameValid || formSubmitted}
                            >
                              Change User Name
                            </button>
                          </span>
                        </div>
                      </form>
                      */}
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4">
                      Email
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      <form onSubmit={(e) => userActions.updateUser({ e, email: email.value })}>
                        <div className="input-group">
                          <input
                            {...email}
                            placeholder={user.email}
                            type="email"
                            name="email"
                            className="form-control"
                            minLength={3}
                          />
                          <span className="input-group-btn">
                            <button
                              className="btn btn-no-focus btn-outline-secondary btn-uppercase-sm"
                              type="submit"
                              disabled={!emailValid || formSubmitted}
                            >
                              Change E-mail
                            </button>
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start pd-t-25-force">
                      Avatar
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      <div className="input-group">
                        <input
                          type="file"
                          name="avatar"
                          className="form-control custom-file-input"
                          onChange={(e) => setAvatar(e.target.files[0])}
                        />
                        <span className="input-group-btn">
                          <button
                            className="btn btn-no-focus btn-outline-secondary btn-uppercase-sm"
                            type="submit"
                            disabled={!avatarValid || formSubmitted}
                            onClick={(e) => {
                              const data = new FormData();
                              data.append('file', avatar, avatar.name);
                              userActions.updateUser({ e, avatar: data });
                            }}
                          >
                            Change Avatar
                          </button>
                        </span>
                      </div>
                      {user.avatar &&
                        <img src={user.avatar} alt="avatar" className="mg-t-20" />
                      }
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4">
                      Password
                    </div>
                    <div className="col-7 col-sm-8 wallet-address row-text-button">
                      <div className="settingsText">
                        Click on the button to send reset password link to <strong>{user.email}</strong>
                      </div>
                      <div className="settingsButton">
                        <button
                          className="btn btn-outline-primary btn-uppercase-sm"
                          onClick={(e) =>
                            window.confirm('Send reset password email? You will be logged out!') &&
                            userActions.resetPassword(e, user.email)}
                          >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start pd-t-25-force">
                      2 Factor Authentication
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      <div className="row-text-button">
                        <div className="settingsText">
                          Your two-factor authentication is currently&nbsp;
                          <strong className={userSettings.twoFAEnabled ? 'text-success' : 'text-danger'}>
                            {userSettings.twoFAEnabled ? 'ENABLED' : 'DISABLED' }
                          </strong>.&nbsp;
                        </div>
                        <div className="settingsButton">
                          <button
                          className={`btn btn-uppercase-sm ${userSettings.twoFAEnabled ? 'btn-outline-danger' : 'btn-outline-success' }`}
                          onClick={() => {
                            toggle2FADialog(!twoFADialogOpened);
                            if (layout.qrCodeUrl === '') userActions.getQRCode();
                          }}
                          >
                          {userSettings.twoFAEnabled ? 'Disable' : 'Enable' }
                          </button>
                        </div>
                      </div>

                      {twoFADialogOpened &&
                        <div className="twofa-dialog">
                          {userSettings.twoFAEnabled &&
                          <>
                            <p>
                              Enter the passcode from your authenticator app to disable two-factor authentication.
                            </p>
                            <form onSubmit={(e) => userActions.update2FA(e, twoFACode.value, false)}>
                              <div className="form-layout form-layout-7">
                                <div className="row no-gutters">
                                  <div className="col-5 col-sm-4">
                                    2FA Key
                                  </div>
                                  <div className="col-7 col-sm-8 wallet-address">
                                    <input
                                      {...twoFACode}
                                      placeholder="2 Factor Authentication Key"
                                      type="number"
                                      name="twoFACode"
                                      className="form-control"
                                      minLength={6}
                                      maxLength={6}
                                    />
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  disabled={formSubmitted || !twoFAFormValid}
                                  className="btn btn-primary btn-block btn-signin"
                                >
                                  {formSubmitted ? 'Please wait...' : 'Disable'}
                                </button>
                              </div>
                            </form>
                          </>
                          }
                          {!userSettings.twoFAEnabled &&
                            <>
                              <p>
                                Scan the QR code with your two-factor authentication device to set up your account.
                                Submit the two-factor passcode which your device generates to enable 2FA.
                              </p>
                              <div>
                                <img src={layout.qrCodeUrl} alt="QR Code" />

                                <form onSubmit={(e) => userActions.update2FA(e, twoFACode.value, true)}>
                                  <div className="form-layout form-layout-7">
                                    <div className="row no-gutters">
                                      <div className="col-5 col-sm-4">
                                        2FA Key
                                      </div>
                                      <div className="col-7 col-sm-8 wallet-address">
                                        <input
                                          {...twoFACode}
                                          placeholder="2 Factor Authentication Key"
                                          type="number"
                                          name="twoFACode"
                                          className="form-control"
                                          max={999999}
                                        />
                                      </div>
                                    </div>
                                    <button
                                      type="submit"
                                      disabled={formSubmitted || !twoFAFormValid}
                                      className="btn btn-primary btn-block btn-signin"
                                    >
                                      {formSubmitted ? 'Please wait...' : 'Enable'}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </>
                          }
                        </div>
                      }
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
};

export default Settings;
