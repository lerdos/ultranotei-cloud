import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';
import CopyButton from '../elements/CopyButton';


const KeysModal = props => {
  const { toggleModal, wallet, ...rest } = props;
  const { actions, state } = useContext(AppContext);
  const { downloadWalletKeys, getWalletKeys } = actions;
  const { layout, userSettings } = state;
  const { formSubmitted, message } = layout;

  const { value: twoFACode, bind: bindTwoFACode } = useFormInput('');

  const twoFAFormValidation = (parseInt(twoFACode) && twoFACode.length === 6);
  const twoFAFormValid = useFormValidation(twoFAFormValidation);

  return (
    <Modal
      {...rest}
      size="lg"
      id="dlgExportKeys"
      onHide={() => toggleModal('receive')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Export Keys</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message.walletKeysForm &&
          <div className="alert alert-outline alert-danger text-center">{message.walletKeysForm}</div>
        }
        {!userSettings.twoFAEnabled &&
          <div className="text-center">
            <h5>You must enable 2-Factor Authentication to retrieve your keys.</h5>
            Please go to <Link to="/settings">settings</Link> to enable it.
          </div>
        }
        {userSettings.twoFAEnabled &&
          <>
            {wallet.keys && Object.keys(wallet.keys).length > 0
              ? <div className="form-layout form-layout-7">
                  <div className="row no-gutters">
                    <div className="col-5 col-sm-3">
                      Public Key
                    </div>
                    <div className="col-7 col-sm-9 wallet-address">
                      <div className="input-group">
                        <input
                          value={wallet.keys ? wallet.keys['Public Key'] : ''}
                          readOnly
                          className="form-control"
                        />
                        <span className="input-group-btn">
                          <CopyButton text={wallet.keys ? wallet.keys['Public Key'] : ''} toolTipText="Copy Key" />
                        </span>
                      </div>
                    </div>
                    </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-3">
                      Private Spend Key
                    </div>
                    <div className="col-7 col-sm-9 wallet-address">
                      <div className="input-group">
                        <input
                          value={wallet.keys ? wallet.keys['Private Spend Key'] : ''}
                          readOnly
                          className="form-control"
                        />
                        <span className="input-group-btn">
                          <CopyButton text={wallet.keys ? wallet.keys['Private Spend Key'] : ''} toolTipText="Copy Key" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-3">
                      Private View Key
                    </div>
                    <div className="col-7 col-sm-9 wallet-address">
                      <div className="input-group">
                        <input
                          value={wallet.keys ? wallet.keys['Private View Key'] : ''}
                          readOnly
                          className="form-control"
                        />
                        <span className="input-group-btn">
                          <CopyButton text={wallet.keys ? wallet.keys['Private View Key'] : ''} toolTipText="Copy Key" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-uppercase-sm btnExportKeys"
                    onClick={() => downloadWalletKeys(wallet.keys)}
                  >
                    DOWNLOAD AS FILE
                  </button>
                </div>
              : <>
                  <h5 className="text-center">
                    Please confirm with your 2-Factor Authentication code.
                  </h5>
                  <form
                    onSubmit={e =>
                      getWalletKeys({
                        e,
                        address: props.address,
                        code: twoFACode,
                        id: 'walletKeysForm',
                      })
                    }
                  >
                    <div className="form-layout form-layout-7">
                      <div className="row no-gutters">
                        <div className="col-5 col-sm-4">
                          2FA Key
                        </div>
                        <div className="col-7 col-sm-8">
                          <input
                            {...bindTwoFACode}
                            placeholder="2 Factor Authentication Key"
                            type="number"
                            name="twoFACode"
                            className="form-control"
                            max={999999}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={formSubmitted || !twoFAFormValid}
                          className="btn btn-primary btn-block btn-signin"
                        >
                          {formSubmitted ? 'Please wait...' : 'Get Wallet Keys'}
                        </button>
                      </div>
                    </div>
                  </form>
                </>
            }
          </>
        }
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('receive')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default KeysModal;
