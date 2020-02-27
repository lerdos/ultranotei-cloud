import React, { useContext, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Typeahead } from 'react-bootstrap-typeahead';
import Moment from 'react-moment';
import WAValidator from 'multicoin-address-validator';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation, useTypeaheadInput } from '../../helpers/hooks';
import { maskAddress } from '../../helpers/utils';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';


const MessagesModal = props => {
  const { actions, state } = useContext(AppContext);
  const { sendMessage } = actions;
  const { appSettings, layout, user, userSettings } = state;
  const { coinDecimals, messageFee, messageLimit } = appSettings;
  const { formSubmitted, sendMessageResponse } = layout;
  const { messages, toggleModal, wallet, ...rest } = props;

  const { value: address, bind: bindAddress, reset: resetAddress } = useTypeaheadInput('');
  const { value: message, bind: bindMessage, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');

  let addressInput = null;
  const [sdm,] = useState(0);

  const totalMessageFee = message.length > 0 ? messageFee : 0;

  const formValidation = (
    address !== props.address &&
    (WAValidator.validate(address, 'CCX') || new RegExp(/^[a-z0-9]*\.conceal\.id/).test(address)) &&
    message.length > 0 &&
    message.length <= messageLimit &&
    totalMessageFee > 0 &&
    totalMessageFee <= wallet.balance &&
    (userSettings.twoFAEnabled
        ? (parseInt(twoFACode) && twoFACode.toString().length === 6)
        : (password !== '' && password.length >= 8)
    )
  );
  const formValid = useFormValidation(formValidation);

  const formatOptions = {
    minimumFractionDigits: coinDecimals,
    maximumFractionDigits: coinDecimals,
  };

  return (
    <Modal
      {...rest}
      size="lg"
	    id="dlgMessages"
      onHide={() => toggleModal('messages')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Messages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label className="section-title d-inline-block">Your Messages</label>
        <div className="list-group tx-details">
          {messages.length > 0 && messages
            .sort((a, b) => (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
            .map(message =>
              <div key={new Date(message.timestamp).getTime()} className="list-group-item pd-y-20">
                <div className="media">
                  <div className="d-flex mg-r-10 wd-50">
                    {message.type === 'in'
                      ? <FaArrowDown className="text-success tx-icon" />
                      : <FaArrowUp className="text-danger tx-icon" />
                    }
                  </div>
                  <div className="media-body">
                    <small className="mg-b-10 tx-timestamp"><Moment>{message.timestamp}</Moment></small>
                    <p className="mg-b-5">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>

        <label className="section-title d-inline-block">Send New Message</label>

        <div className="form-layout form-layout-7">
          <form
            className="send-form"
            onSubmit={e =>
              sendMessage(
                {
                  e,
                  wallet: props.address,
                  address,
                  message,
                  sdm,
                  twoFACode,
                  password,
                  id: 'sendMessageForm',
                },
                [
                  resetAddress,
                  resetMessage,
                  resetTwoFACode,
                  resetPassword,
                ],
              )
            }
          >
            <div className="form-layout form-layout-7">

              <div className="row no-gutters">
                <div className="col-5 col-sm-3">
                  From
                </div>
                <div className="col-7 col-sm-9 wallet-address">
                  {props.address}
                </div>
              </div>

              <div className="row no-gutters">
                <div className="col-5 col-sm-3">
                  To
                </div>
                <div className="col-7 col-sm-9">
                  <Typeahead
                    ref={component => addressInput = component ? component.getInstance() : addressInput}
                    {...bindAddress}
                    id="address"
                    labelKey="address"
                    filterBy={['address', 'label', 'paymentID']}
                    options={user.addressBook}
                    placeholder="Address"
                    emptyLabel="No records in Address Book"
                    highlightOnlyResult
                    selectHintOnEnter
                    minLength={1}
                    renderMenuItemChildren={option =>
                      <>
                        <strong className="addrDropdownLabel" key="name">
                          {option.label}
                        </strong>
                        <div className="addrDropdownLabel" key="address">
                          <small>
                            Address: <span className="addrDropdownAddress">{maskAddress(option.address)}</span>
                            {option.paymentID &&
                            <span> ( Payment ID: <span className="addrDropdownAddress">{maskAddress(option.paymentID)}</span> )</span>
                            }
                          </small>
                        </div>
                      </>
                    }
                  />
                </div>
              </div>

              <div className="row no-gutters">
                <div className="col-5 col-sm-3">
                  Message
                </div>
                <div className="col-7 col-sm-9">
                  <div className="input-group">
                    <input
                      {...bindMessage}
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
                            MESSAGE FEE: {(totalMessageFee).toLocaleString(undefined, formatOptions)} CCX
                          </strong>
                        </small>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {userSettings.twoFAEnabled
              ? <div className="row no-gutters">
                <div className="col-5 col-sm-3">
                  2 Factor Authentication
                </div>
                <div className="col-7 col-sm-9">
                  <input
                    {...bindTwoFACode}
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
                <div className="col-5 col-sm-3">
                  Password
                </div>
                <div className="col-7 col-sm-9">
                  <input
                    {...bindPassword}
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

            <hr />

            <div className="tx-total sendSection">
              <div className="tx-total-btns">
                <button
                  type="submit"
                  disabled={formSubmitted || !formValid}
                  className={`btn btn-send ${formValid ? 'btn-outline-success' : 'btn-outline-danger'}`}
                >
                  {formSubmitted ? 'SENDING' : 'SEND'}
                </button>
              </div>
              <span className="tx-right sendSummary">
                <h2>
                  <span className="tx-total-text">TOTAL</span>&nbsp;
                  <span className={`${totalMessageFee > wallet.balance ? 'text-danger' : ''}`}>
                    {totalMessageFee.toLocaleString(undefined, formatOptions)} CCX
                  </span>
                </h2>
                <div>
                  <span className="tx-available-text">AVAILABLE: </span>
                  <strong>
                    {wallet.balance && wallet.balance.toLocaleString(undefined, formatOptions)}
                  </strong> CCX
                </div>
              </span>
            </div>
            {sendMessageResponse &&
              <div className={`${sendMessageResponse.status}-message`}>
                {
                  sendMessageResponse.status === 'error'
                    ? <div className="text-danger">{sendMessageResponse.message}</div>
                    : <>
                      TX Hash: <a
                      href={`${appSettings.explorerURL}/index.html?hash=${sendMessageResponse.message.transactionHash}#blockchain_transaction`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sendMessageResponse.message.transactionHash}
                    </a><br />
                      Secret Key: {sendMessageResponse.message.transactionSecretKey}
                    </>
                }
              </div>
            }
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('messages')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default MessagesModal;
