import React from 'react';
import { Link } from 'react-router-dom';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';


class Settings extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      formSubmitted: false,
      formValid: false,
      message: null,
      qrCodeUrl: '',
      twoFACode: '',
      twoFADialogOpened: false,
    };

    this.getQRCode = this.getQRCode.bind(this);
  }

  componentDidMount() {
    if (!this.props.userSettings.twoFAEnabled) this.getQRCode();
  }

  getQRCode() {
    fetch(`${this.props.appSettings.apiEndpoint}/two-factor-authentication/`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken(),
      },
    })
      .then(r => r.json())
      .then(res => this.setState({ qrCodeUrl: res.message.qrCodeUrl }));
  };

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => this._validateForm())
  };

  _validateForm = () => {
    const { twoFACode } = this.state;
    const formValid = parseInt(twoFACode) && twoFACode.length === 6;
    this.setState({ formValid });
  };

  _toggle2FADialog = () => {
    this.setState({ twoFADialogOpened: !this.state.twoFADialogOpened })
  };

  render() {
    const {
      formSubmitted,
      formValid,
      qrCodeUrl,
      twoFACode,
      twoFADialogOpened
    } = this.state;
    const { update2FA, userSettings } = this.props;

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
                  <div className="form-layout form-layout-7">
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-4 align-items-start">
                        2 Factor Authentication
                      </div>
                      <div className="col-7 col-sm-8 wallet-address">
                        Your two-factor authentication is currently&nbsp;
                        <strong className={userSettings.twoFAEnabled ? 'text-success' : 'text-danger'}>
                          {userSettings.twoFAEnabled ? 'ENABLED' : 'DISABLED' }
                        </strong>.

                        <button
                          className="btn btn-primary"
                          onClick={this._toggle2FADialog}
                        >
                          {userSettings.twoFAEnabled ? 'DISABLE' : 'ENABLE' }
                        </button>

                        {twoFADialogOpened &&
                          <>
                            {userSettings.twoFAEnabled &&
                              <>
                                <p>
                                  Enter the passcode from your authenticator app to disable two-factor authentication.
                                </p>
                                <form onSubmit={(e) => update2FA(e, twoFACode, false)}>
                                  <div className="form-layout form-layout-7">
                                    <div className="row no-gutters">
                                      <div className="col-5 col-sm-4">
                                        2FA Key
                                      </div>
                                      <div className="col-7 col-sm-8 wallet-address">
                                        <input
                                          placeholder="2 Factor Authentication Key"
                                          type="number"
                                          name="twoFACode"
                                          className="form-control"
                                          value={twoFACode}
                                          minLength={6}
                                          maxLength={6}
                                          onChange={this._handleChange}
                                        />
                                      </div>
                                    </div>
                                    <button
                                      type="submit"
                                      disabled={formSubmitted || !formValid}
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
                                  Scan the QR code with your two-factor authentication device to set up your account. Submit
                                  the two-factor passcode which your device generates to enable 2FA.
                                </p>
                                <div>
                                  <img src={qrCodeUrl} alt="QR Code" />

                                  <form onSubmit={(e) => update2FA(e, twoFACode, true)}>
                                    <div className="form-layout form-layout-7">
                                      <div className="row no-gutters">
                                        <div className="col-5 col-sm-4">
                                          2FA Key
                                        </div>
                                        <div className="col-7 col-sm-8 wallet-address">
                                          <input
                                            placeholder="2 Factor Authentication Key"
                                            type="number"
                                            name="twoFACode"
                                            className="form-control"
                                            value={twoFACode}
                                            minLength={6}
                                            maxLength={6}
                                            onChange={this._handleChange}
                                          />
                                        </div>
                                      </div>
                                      <button
                                        type="submit"
                                        disabled={formSubmitted || !formValid}
                                        className="btn btn-primary btn-block btn-signin"
                                      >
                                        {formSubmitted ? 'Please wait...' : 'Enable'}
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </>
                            }
                          </>
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
    );
  }
}

export default withAuth(Settings);
