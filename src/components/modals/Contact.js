import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const ContactModal = props => {
  const { contact, toggleModal, ...rest } = props;
  const { userActions } = useContext(AppContext);

  const label = useFormInput(contact ? contact.label : '');
  const address = useFormInput(contact ? contact.address : '');
  const paymentID = useFormInput(contact && contact.paymentID === '' ? contact.paymentID : '');

  const formValidation = (
    label.value.length > 0 &&
    address.value.length === 98 &&
    address.value.startsWith('ccx7') &&
    (paymentID.value === '' || paymentID.value.length === 64)
  );
  const formValid = useFormValidation(formValidation);

  return (
    <Modal
      {...rest}
      size="lg"
      id="dlgAddContact"
      onHide={() => toggleModal('contact')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={e => userActions.addContact({
          e,
          label: label.value,
          address: address.value,
          paymentID: paymentID.value,
          edit: !!props.contact,
          editingContact: contact,
        })}>
          <div className="form-layout form-layout-7">
            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Label
              </div>
              <div className="col-7 col-sm-9 wallet-address">
                <input
                  {...label}
                  size={2}
                  placeholder="Label"
                  className="form-control"
                  name="label"
                  type="text"
                  minLength={1}
                />
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Address
              </div>
              <div className="col-7 col-sm-9 wallet-address receive-address">
                <input
                  {...address}
                  size={2}
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
                  maxLength={64}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!formValid}
            className="btn btn-outline-primary"
          >
            SAVE
          </button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('contact')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default ContactModal;
