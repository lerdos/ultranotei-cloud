import React, { useState, useEffect, useContext } from 'react';
import QRCode from'qrcode.react';
import Modal from 'react-bootstrap/Modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from '../ContextProvider';
import { useFormInput } from '../../helpers/hooks';


const ReceiveModal = props => {
  const { toggleModal, ...rest } = props;
  const { appSettings } = useContext(AppContext);

  const [addressCopied, setAddressCopied] = useState(false);
  const [qrCodeString, setQrCodeString] = useState(`ccx:${props.address}`);
  const amount = useFormInput('');
  const paymentID = useFormInput('');
  const message = useFormInput('');

  // ccx:ADDRESS?tx_payment_id=PAYMENT_ID&tx_amount=AMOUNT&recipient_name=NAME&tx_description=DESCRIPTION
  useEffect(() => {
    const paramsObject = {};
    if (amount.value !== '' && parseFloat(amount.value)) paramsObject.tx_amount = amount.value;
    if (paymentID.value !== '') paramsObject.tx_payment_id = paymentID.value;
    if (message.value !== '') paramsObject.tx_message = message.value;
    const params = Object.keys(paramsObject).length > 0
      ? `?${Object.keys(paramsObject).map(param => `${param}=${paramsObject[param]}`).join('&')}`
      : '';
    setQrCodeString(`conceal:${props.address}${params}`);
  });

  const copyClipboard = () => {
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 400);
  };

  return (
    <Modal
      { ...rest }
      size="lg"
	    id="dlgReceiveCoins"
      onHide={() => toggleModal('receive')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Receive CCX</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-layout form-layout-7">

          <div className="row no-gutters">
            <div className="col-5 col-sm-3">
              Address
            </div>
            <div className="col-7 col-sm-9 wallet-address receive-address">
              <div className="input-group">
                <input
                  value={props.address}
                  readOnly
                  className="form-control"
                />
                <span className="input-group-btn">
                  <CopyToClipboard
                    text={props.address}
                    onCopy={copyClipboard}
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
            <div className="col-5 col-sm-3">
              Amount (optional)
            </div>
            <div className="col-7 col-sm-9 wallet-address">
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
            <div className="col-5 col-sm-3">
              Payment ID (optional)
            </div>
            <div className="col-7 col-sm-9 wallet-address">
              <input
                {...paymentID}
                size={6}
                placeholder="Payment ID"
                className="form-control"
                name="paymentID"
                type="text"
                minLength={64}
                maxLength={64}
              />
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-5 col-sm-3">
              Message (optional)
            </div>
            <div className="col-7 col-sm-9 wallet-address">
              <input
                {...message}
                size={6}
                placeholder="Message"
                className="form-control"
                name="message"
                type="text"
              />
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-12 col-sm-12 justify-content-center">
              <QRCode value={qrCodeString} size={256} includeMargin />
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
