import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';


const ReceiveModal = (props) => {
  const { toggleModal, wallet, ...rest } = props;
  return (
    <Modal
      { ...rest }
      size="lg"
      onHide={() => toggleModal('receive')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Receive CCX</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Address: {wallet && wallet.address}</div>
        <div>QR Code...</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => toggleModal('receive')}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default ReceiveModal;
