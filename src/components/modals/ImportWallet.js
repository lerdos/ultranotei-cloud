import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const ImportWalletModal = props => {
  const { toggleModal, ...rest } = props;
  const { actions, state } = useContext(AppContext);
  const { importWallet } = actions;
  const { layout } = state;
  const { formSubmitted, message } = layout;

  const { value: privateSpendKey, bind: bindPrivateSpendKey, reset: resetPrivateSpendKey } = useFormInput('');

  const privateSpendKeyValidation = (privateSpendKey.length === 64);
  const privateSpendKeyValid = useFormValidation(privateSpendKeyValidation);

  return (
    <Modal
      {...rest}
      size="lg"
      id="dlgExportKeys"
      onHide={() => toggleModal('importWallet')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Import Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {message.importWalletForm &&
          <div className="alert alert-outline alert-danger text-center">{message.importWalletForm}</div>
        }

        <div className="mg-b-20">
          Importing of the keys <strong className="tx-primary">works only if the wallet was created via
          conceal.cloud</strong>. If you import any other private key, this will just create a new wallet for you.
        </div>
        <form
          onSubmit={e =>
            importWallet(
              {
                e,
                privateSpendKey,
                id: 'importWalletForm',
              },
              [
                resetPrivateSpendKey,
                toggleModal,
              ],
            )
          }
        >
          <div className="form-layout form-layout-7">
            <div className="row no-gutters">
              <div className="col-5 col-sm-4">
                Private Spend Key
              </div>
              <div className="col-7 col-sm-8">
                <input
                  {...bindPrivateSpendKey}
                  placeholder="Private Spend Key"
                  type="text"
                  name="privateSpendKey"
                  className="form-control"
                  minLength={64}
                  maxLength={64}
                />
              </div>
              <button
                type="submit"
                disabled={formSubmitted || !privateSpendKeyValid}
                className="btn btn-primary btn-block btn-signin"
              >
                {formSubmitted ? 'Please wait...' : 'Import'}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('importWallet')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default ImportWalletModal;
