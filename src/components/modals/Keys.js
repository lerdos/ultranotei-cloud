import React from 'react';
import Modal from 'react-bootstrap/Modal';


const KeysModal = (props) => {
  const { toggleModal, wallet, ...rest } = props;

  return (
    <Modal
      { ...rest }
      size="lg"
      onHide={() => toggleModal('keys')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Export Keys</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-layout form-layout-7">
          <div className="row no-gutters">
            <div className="col-5 col-sm-4">
              Public Spend Key
            </div>
            <div className="col-7 col-sm-8 wallet-address">
              {wallet.keys && wallet.keys.spendPublicKey}
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-5 col-sm-4">
              Secret Spend Key
            </div>
            <div className="col-7 col-sm-8 wallet-address">
              {wallet.keys && wallet.keys.spendSecretKey}
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-5 col-sm-4">
              Private View Key
            </div>
            <div className="col-7 col-sm-8 wallet-address">
              {wallet.keys && wallet.keys.viewSecretKey}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('keys')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default KeysModal;
