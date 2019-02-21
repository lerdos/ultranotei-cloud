import React, { useState, useContext } from 'react';
import QRCode from'qrcode.react';
import Modal from 'react-bootstrap/Modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from '../ContextProvider';
import { useFormInput } from '../../helpers/hooks';


const ReceiveModal = (props) => {
  const { toggleModal, ...rest } = props;
  const { appSettings } = useContext(AppContext);

  const [addressCopied, setAddressCopied] = useState(false);
  const amount = useFormInput('');

  // ccx:ADDRESS?tx_payment_id=PAYMENT_ID&tx_amount=AMOUNT&recipient_name=NAME&tx_description=DESCRIPTION
  const qrCodeString = `ccx:${props.address}${(amount.value !== '' && parseFloat(amount.value) && `&tx_amount=${amount.value}`)}`;

  const copyClipboard = () => {
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 400);
  };

  return (
    <Modal
      { ...rest }
      size="lg"
      onHide={() => toggleModal('receive')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Receive CCX</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-layout form-layout-7">

          <div className="row no-gutters">
            <div className="col-5 col-sm-4">
              Address
            </div>
            <div className="col-7 col-sm-8 wallet-address">
              <div className="input-group">
                <input
                  value={props.address}
                  readOnly
                  className="form-control"
                />
                <span className="input-group-btn">
                  <CopyToClipboard
                    text={props.address}
                    onCopy={() => copyClipboard()}
                  >
                    <button
                      className={`btn btn-no-focus ${addressCopied ? 'btn-outline-success' : 'btn-outline-dark'}`}
                      type="button"
                    >
                      <FontAwesomeIcon icon={addressCopied ? 'check' : 'copy'} fixedWidth />
                    </button>
                  </CopyToClipboard>
                </span>
              </div>
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-5 col-sm-4">
              Value
            </div>
            <div className="col-7 col-sm-8 wallet-address">
              <input
                {...amount}
                size={2}
                placeholder="Amount"
                className="form-control"
                name="amount"
                type="number"
                min={0}
                step={Math.pow(10, -(appSettings.coinDecimals - 1))}
              />
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-12 col-sm-12 justify-content-center">
              <QRCode value={qrCodeString} size={256} />
            </div>
          </div>

        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('receive')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default ReceiveModal;
