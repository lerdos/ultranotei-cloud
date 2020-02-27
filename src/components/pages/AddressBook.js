import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

import { AppContext } from '../ContextProvider';
import ContactModal from '../modals/Contact';
import Contact from '../elements/Contact';


const AddressBook = () => {
  const { state } = useContext(AppContext);
  const { layout, user } = state;
  const { userLoaded } = layout;
  const { addressBook } = user;

  const [filteredAddressBook, setFilteredAddressBook] = useState(addressBook);
  const [contactModalOpen, toggleContactModal] = useState(false);

  const handleChange = e => {
    const val = e.target.value;
    const regex = new RegExp(`.?${val}.?`, 'gi');
    setFilteredAddressBook(
      val !== ''
        ? addressBook
            .filter(contact =>
              contact.label.match(regex) || contact.address.match(regex) || contact.paymentID.match(regex)
            )
        : addressBook
    );
  };

  useEffect(() => {
    if (userLoaded) setFilteredAddressBook(addressBook);
  }, [addressBook, userLoaded]);

  return (
    <div>
      <div className="slim-mainpanel">
        <div className="container">

          <div className="slim-pageheader">
            <ol className="breadcrumb slim-breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Address Book</li>
            </ol>
            <h6 className="slim-pagetitle">Address Book</h6>
          </div>

          <div className="section-wrapper mg-t-20">
            <div className="d-flex flex-row width-100 justify-content-between mg-b-10">
              <label className="section-title d-inline-block">Address Book</label>
            </div>

            <div className="d-flex flex-row width-100 justify-content-between mg-b-10">
              <Form.Control
                type="text"
                placeholder="Search by label, address or payment ID..."
                onKeyUp={e => handleChange(e)}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => toggleContactModal(!contactModalOpen)}
              >
                ADD NEW CONTACT
              </button>
            </div>
            <div className="row">
              <div className="col-lg-12">
                {userLoaded && addressBook.length === 0
                  ? <div>
                      You have no contacts saved in your address book.
                      Add one by clicking on the button or when you are sending funds.
                    </div>
                  : <div className="list-group list-group-user">
                      {filteredAddressBook.map(contact =>
                        <Contact key={`${contact.label}-${contact.address}-${contact.paymentID}`} contact={contact} />
                      )}
                    </div>
                }
              </div>

              <ContactModal
                show={contactModalOpen}
                toggleModal={() => toggleContactModal(!contactModalOpen)}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AddressBook;
