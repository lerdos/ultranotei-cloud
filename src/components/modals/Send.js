import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const SendModal = (props) => {
  const { appSettings, layout, userSettings, walletActions } = useContext(AppContext);
  const { coinDecimals, defaultFee, feePerChar } = appSettings;
  const { sendTxResponse } = layout;
  const { toggleModal, wallet, ...rest } = props;

  const address = useFormInput('');
  const paymentID = useFormInput('');
  const amount = useFormInput('');
  const message = useFormInput('');
  const twoFACode = useFormInput('');
  const password = useFormInput('');

  const formValidation = (
    address.value !== props.address &&
    address.value.length === 98 &&
    address.value.startsWith('ccx7') &&
    parseFloat(amount.value) >= feePerChar &&
    amount.value.toString().length <= 7 &&
    wallet.balance &&
    (parseFloat(amount.value) + defaultFee) + (message.value.length * feePerChar) <= wallet.balance &&
    (paymentID.value === '' || paymentID.value.length === 64) &&
    (userSettings.twoFAEnabled
      ? (parseInt(twoFACode.value) && twoFACode.value.toString().length === 6)
      : (password.value !== '' && password.value.length >= 8)
    )
  );
  const formValid = useFormValidation(formValidation);

  let totalAmount = (parseFloat(amount.value) > 0) ? parseFloat(amount.value) : 0;
  if (message.value.length > 0) {
    totalAmount = (parseFloat(amount.value) > 0)
      ? parseFloat(amount.value) + (message.value.length * feePerChar)
      : (message.value.length * feePerChar);
  }

  const formatOptions = {
    minimumFractionDigits: coinDecimals,
    maximumFractionDigits: coinDecimals,
  };

  const maxValue = (wallet.balance - defaultFee - (message.value.length * feePerChar));
  const calculateMax = () => {
    const value = maxValue.toLocaleString(undefined, formatOptions);
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
          onSubmit={(e) => walletActions.sendTx({
            e,
            wallet: props.address,
            address: address.value,
            paymentID: paymentID.value,
            amount: amount.value,
            message: message.value,
            twoFACode: twoFACode.value,
            password: password.value,
          })}
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
                    step={Math.pow(10, -(coinDecimals - 1))}
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
                            MESSAGE FEE: {(message.value.length * feePerChar).toLocaleString(undefined, formatOptions)} CCX
                          </strong>
                        </small>
                      </span>
                  </div>
                </div>
              </div>
            </div>

            {userSettings.twoFAEnabled
              ? <div className="row no-gutters">
                  <div className="col-5 col-sm-4">
                    2 Factor Authentication
                  </div>
                  <div className="col-7 col-sm-8">
                    <input
                      {...twoFACode}
                      size={6}
                      placeholder="2 Factor Authentication"
                      className="form-control"
                      name="twoFACode"
                      type="number"
                      minLength={6}
                      maxLength={6}
                    />
                  </div>
                </div>
              : <div className="row no-gutters">
                  <div className="col-5 col-sm-4">
                    Password
                  </div>
                  <div className="col-7 col-sm-8">
                    <input
                      {...password}
                      size={6}
                      placeholder="Password"
                      className="form-control"
                      name="password"
                      type="password"
                      minLength={8}
                    />
                  </div>
                </div>
            }
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
                    {totalAmount.toLocaleString(undefined, formatOptions)} CCX
                  </span>
                </h2>
                <div>
                  <span className="tx-available-text">AVAILABLE</span>&nbsp;
                  <strong>
                    {wallet.balance && wallet.balance.toLocaleString(undefined, formatOptions)}
                  </strong> CCX
                </div>
                <div className="tx-default-fee-text">
                    TRANSACTION FEE: {defaultFee.toLocaleString(undefined, formatOptions)} CCX
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
