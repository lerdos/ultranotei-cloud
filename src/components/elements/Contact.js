import React, { useContext, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from '../ContextProvider';
import ContactModal from '../modals/Contact';
import SendModal from '../modals/Send';
import CopyButton from './CopyButton';
import { maskAddress } from '../../helpers/utils';


const Contact = props => {
  const { actions, state } = useContext(AppContext);
  const { deleteContact } = actions;
  const { layout, wallets } = state;
  const { contact } = props;
  const { walletsLoaded } = layout;

  const [contactModalOpen, toggleContactModal] = useState(false);
  const [sendModalOpen, toggleSendModal] = useState(false);

  const locked = Object.keys(wallets).reduce((acc, c) => acc + wallets[c].locked, 0);
  const balanceTotal = Object.keys(wallets).reduce((a, c) => a + wallets[c].total, 0);

  return (
    <div className="list-group-item">
      <div className="user-name-address">
        <p>{contact.label}</p>
        <span>Address: {maskAddress(contact.address)}</span>
        <span>Payment ID: {contact.paymentID ? maskAddress(contact.paymentID) : '-'}</span>
      </div>

      <div className="btn-group" role="group">

        <OverlayTrigger overlay={<Tooltip id={`${contact.address}-send`} trigger={['hover']}>Edit Contact</Tooltip>}>
          <button
            className="btn btn-outline-dark"
            onClick={() => toggleContactModal(!contactModalOpen)}
          >
            <FontAwesomeIcon icon="user-edit" fixedWidth />
          </button>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip id={`${props.address}-send`}>Send CCX</Tooltip>}>
          <span>
            <button
              className={`btn btn-outline-dark ${!walletsLoaded || balanceTotal === 0 || balanceTotal === locked ? 'disabled' : ''}`}
              onClick={() => toggleSendModal(!sendModalOpen)}
              disabled={!walletsLoaded || balanceTotal === 0 || balanceTotal === locked}
            >
              <FontAwesomeIcon icon="arrow-up" fixedWidth />
            </button>
          </span>
        </OverlayTrigger>

        <CopyButton text={contact.address} toolTipText="Copy Contact's Address" />
        <CopyButton text={contact.paymentID} toolTipText="Copy Contact's Payment ID" disabled={!contact.paymentID} />

        <OverlayTrigger overlay={<Tooltip id={`${contact.address}-send`} trigger={['hover']}>Delete Contact</Tooltip>}>
          <button
            className="btn btn-outline-dark"
            onClick={() => {
              window.confirm('You are about to delete this contact! Do you really wish to proceed?') &&
              deleteContact(contact);
            }}
          >
            <FontAwesomeIcon icon="trash-alt" fixedWidth />
          </button>
        </OverlayTrigger>
      </div>

      <ContactModal
        {...props}
        show={contactModalOpen}
        toggleModal={() => toggleContactModal(!contactModalOpen)}
        contact={contact}
      />

      <SendModal
        {...props}
        show={sendModalOpen}
        toggleModal={() => toggleSendModal(!sendModalOpen)}
      />
    </div>
  )
};

export default Contact;
