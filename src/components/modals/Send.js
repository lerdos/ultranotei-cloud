import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const SendModal = (props) => {
  const { appSettings, layout, walletActions } = useContext(AppContext);
  const { coinDecimals, defaultFee, feePerChar } = appSettings;
  const { sendTxResponse } = layout;
  const { toggleModal, wallet, ...rest } = props;

  const address = useFormInput('');
  const paymentID = useFormInput('');
  const amount = useFormInput('');
  const message = useFormInput('');

  const formValidation = (
    address.value !== props.address &&
    address.value.length === 98 &&
    address.value.startsWith('ccx7') &&
    parseFloat(amount.value) > 0 &&
    wallet.balance &&
    (parseFloat(amount.value) + defaultFee) + (message.value.length * feePerChar) <= wallet.balance &&
    (paymentID.value === '' || paymentID.value.length === 64)
  );
  const formValid = useFormValidation(formValidation);

  let totalAmount = 0;
  if (message.value.length > 0) {
    totalAmount = parseFloat(amount.value) + (message.value.length * feePerChar);
  } else {
    if (parseFloat(amount.value) > 0) totalAmount = parseFloat(amount.value);
  }

  const maxValue = (wallet.balance - defaultFee - (message.value.length * feePerChar));
  const calculateMax = () => {
    const value = maxValue.toLocaleString(undefined, { minimumFractionDigits: coinDecimals });
    amount.onChange({ target: { value } });
  };

  return (
    <Modal
      { ...rest }
      size="lg"
      onHide={() => toggleModal('send')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Send CCX</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={(e) => walletActions.sendTx(e, props.address, address.value, paymentID.value, amount.value, message.value)}
          className="send-form"
        >
          <div className="form-layout form-layout-7">
            <div className="row no-gutters">
              <div className="col-5 col-sm-4">
                From
              </div>
              <div className="col-7 col-sm-8 wallet-address">
                {props.address}
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-5 col-sm-4">
                To
              </div>
              <div className="col-7 col-sm-8">
                <input
                  {...address}
                  size={8}
                  placeholder="Address"
                  className="form-control"
                  name="address"
                  type="text"
                  minLength={98}
                  maxLength={98}
                />
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-5 col-sm-4">
                Payment ID (optional)
              </div>
              <div className="col-7 col-sm-8">
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
              <div className="col-5 col-sm-4">
                Amount
              </div>
              <div className="col-7 col-sm-8">
                <div className="input-group">
                  <input
                    {...amount}
                    size={2}
                    placeholder="Amount"
                    className="form-control"
                    name="amount"
                    type="number"
                    min={0}
                    max={maxValue}
                    step={Math.pow(10, -coinDecimals)}
                  />
                  <span className="input-group-btn">
                      <button className="btn btn-outline-secondary btn-max" onClick={calculateMax} type="button">
                        <small><strong>SEND MAX</strong></small>
                      </button>
                    </span>
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-5 col-sm-4">
                Message (optional)
              </div>
              <div className="col-7 col-sm-8">
                <div className="input-group">
                  <input
                    {...message}
                    size={6}
                    placeholder="Message"
                    className="form-control"
                    name="message"
                    type="text"
                  />
                  <div className="input-group-append">
                      <span className="input-group-text">
                        <small>
                          <strong>
                            MESSAGE FEE: {(message.value.length * feePerChar).toLocaleString(undefined, { minimumFractionDigits: coinDecimals })} CCX
                          </strong>
                        </small>
                      </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="tx-total">
            <button
              type="submit"
              disabled={!formValid}
              className={`btn btn-send ${formValid ? 'btn-outline-success' : 'btn-outline-danger'}`}
            >
              SEND
            </button>
            <span className="tx-right">
                <h2>
                  <span className="tx-total-text">TOTAL</span>&nbsp;
                  <span className={`${totalAmount > wallet.balance ? 'text-danger' : ''}`}>
                    {totalAmount.toLocaleString(undefined, { minimumFractionDigits: coinDecimals })} CCX
                  </span>
                </h2>
                <div>
                  <span className="tx-available-text">AVAILABLE</span>&nbsp;
                  <strong>
                    {wallet.balance && wallet.balance.toLocaleString(undefined, { minimumFractionDigits: coinDecimals })}
                  </strong> CCX
                </div>
                <div className="tx-default-fee-text">
                    TRANSACTION FEE: {defaultFee.toLocaleString(undefined, { minimumFractionDigits: coinDecimals })} CCX
                </div>
              </span>
          </div>
          {sendTxResponse &&
          <div className={`${sendTxResponse.status}-message`}>
            {
              sendTxResponse.status === 'error'
                ? <div className="text-danger">{sendTxResponse.message}</div>
                : <>
                    TX Hash: <a
                      href={`${appSettings.explorerURL}/?hash=${sendTxResponse.message.transactionHash}#blockchain_transaction`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sendTxResponse.message.transactionHash}
                    </a><br />
                    Secret Key: {sendTxResponse.message.transactionSecretKey}
                  </>
            }
          </div>
          }
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('send')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default SendModal;
