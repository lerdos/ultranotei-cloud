import React, { useContext, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from '../ContextProvider';
import ContactModal from '../modals/Contact';
import CopyButton from './CopyButton';
import { maskAddress } from '../../helpers/utils';


const Contact = props => {
  const { actions } = useContext(AppContext);
  const { deleteContact } = actions;
  const { contact } = props;

  const [contactModalOpen, toggleContactModal] = useState(false);

  return (
    <div className="list-group-item">
      <div className="user-name-address">
        <p>{contact.label}</p>
        <span>Address: {maskAddress(contact.address)}</span>
        <span>Payment ID: {contact.paymentID ? maskAddress(contact.paymentID) : '-'}</span>
      </div>

      <div className="btn-group" role="group">
        <CopyButton text={contact.address} toolTipText="Copy Contact's Address" />

        <OverlayTrigger overlay={<Tooltip id={`${contact.address}-send`} trigger={['hover']}>Edit Contact</Tooltip>}>
          <button
            className="btn btn-outline-dark"
            onClick={() => toggleContactModal(!contactModalOpen)}
          >
            <FontAwesomeIcon icon="user-edit" fixedWidth />
          </button>
        </OverlayTrigger>

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
    </div>
  )
};

export default Contact;
