import React from 'react';
import QRCode from'qrcode.react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


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
        <div>
          <QRCode value={`ccx:${wallet.address}`} size={256} />
        </div>
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
