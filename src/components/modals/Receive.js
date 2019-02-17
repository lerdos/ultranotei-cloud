import React from 'react';
import QRCode from'qrcode.react';
import Modal from 'react-bootstrap/Modal';


const ReceiveModal = (props) => {
  const { toggleModal, ...rest } = props;

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
        <div className="form-layout form-layout-7">
          <div className="row no-gutters">
            <div className="col-5 col-sm-4">
              Address
            </div>
            <div className="col-7 col-sm-8 wallet-address">
              {props.address}
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-12 col-sm-12 justify-content-center">
              <QRCode value={`ccx:${props.address}`} size={256} />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('receive')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default ReceiveModal;
