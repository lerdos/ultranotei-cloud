import React, { useContext, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { AppContext } from '../ContextProvider';
import ContactModal from '../modals/Contact';
import { maskAddress } from '../../helpers/utils';


const Contact = props => {
  const { userActions } = useContext(AppContext);
  const { contact } = props;

  const [contactModalOpen, toggleContactModal] = useState(false);
  const [addressCopied, setAddressCopied] = useState({});

  const copyClipboard = address => {
    setAddressCopied({ [address]: true });
    setTimeout((address) => setAddressCopied({ [address]: true }), 400);
  };

  return (
    <div className="list-group-item">
      <div className="user-name-address">
        <p>{contact.label}</p>
        <span>Address: {maskAddress(contact.address)}</span>
        <span>Payment ID: {contact.paymentID ? maskAddress(contact.paymentID) : '-'}</span>
      </div>

      <div className="btn-group" role="group">
        <OverlayTrigger overlay={<Tooltip id={`${contact.address}-copy`}>Copy Contact's Address</Tooltip>}>
          <CopyToClipboard
            text={contact.address}
            onCopy={() => copyClipboard(contact.address)}
          >
            <button
              className={`btn btn-no-focus ${addressCopied[contact.address] ? 'btn-outline-success' : 'btn-outline-dark'}`}
              type="button"
            >
              <FontAwesomeIcon icon={addressCopied[contact.address] ? 'check' : 'copy'} fixedWidth />
            </button>
          </CopyToClipboard>
        </OverlayTrigger>

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
              userActions.deleteContact(contact);
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
