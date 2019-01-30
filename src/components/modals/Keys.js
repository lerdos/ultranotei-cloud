import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';


const KeysModal = (props) => {
  const { toggleModal, ...rest } = props;
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
        ...
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => toggleModal('keys')}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default KeysModal;
