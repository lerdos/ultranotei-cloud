import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const KeysModal = (props) => {
  const { toggleModal, wallet, ...rest } = props;

  const [spendPublicKeyCopied, setSpendPublicKeyCopied] = useState(false);
  const [spendSecretKeyCopied, setSpendSecretKeyCopied] = useState(false);
  const [viewSecretKeyCopied, setViewSecretKeyCopied] = useState(false);

  const copyClipboard = (elem) => {
    if (elem === 'spendPublicKey') setSpendPublicKeyCopied(true);
    if (elem === 'spendSecretKey') setSpendSecretKeyCopied(true);
    if (elem === 'viewSecretKey') setViewSecretKeyCopied(true);
    setTimeout(() => {
      if (elem === 'spendPublicKey') setSpendPublicKeyCopied(false);
      if (elem === 'spendSecretKey') setSpendSecretKeyCopied(false);
      if (elem === 'viewSecretKey') setViewSecretKeyCopied(false);
    }, 400);
  };

  return (
    <Modal
      { ...rest }
      size="lg"
 	  id="dlgExportKeys"
      onHide={() => toggleModal('receive')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Export Keys</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-layout form-layout-7">

          <div className="row no-gutters">
            <div className="col-5 col-sm-3">
              Public Spend Key
            </div>
            <div className="col-7 col-sm-9 wallet-address">
              <div className="input-group">
                <input
                  value={wallet.keys ? wallet.keys.spendPublicKey : ''}
                  readOnly
                  className="form-control"
                />
                <span className="input-group-btn">
                    <CopyToClipboard
                      text={wallet.keys ? wallet.keys.spendPublicKey : ''}
                      onCopy={() => copyClipboard('spendPublicKey')}
                    >
                      <button
                        className={`btn btn-no-focus ${spendPublicKeyCopied ? 'btn-outline-success' : 'btn-outline-dark'}`}
                        type="button"
                      >
                        <FontAwesomeIcon icon={spendPublicKeyCopied ? 'check' : 'copy'} fixedWidth />
                      </button>
                    </CopyToClipboard>
                  </span>
              </div>
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-5 col-sm-3">
              Secret Spend Key
            </div>
            <div className="col-7 col-sm-9 wallet-address">
              <div className="input-group">
                <input
                  value={wallet.keys ? wallet.keys.spendSecretKey : ''}
                  readOnly
                  className="form-control"
                />
                <span className="input-group-btn">
                    <CopyToClipboard
                      text={wallet.keys ? wallet.keys.spendSecretKey : ''}
                      onCopy={() => copyClipboard('spendSecretKey')}
                    >
                      <button
                        className={`btn btn-no-focus ${spendSecretKeyCopied ? 'btn-outline-success' : 'btn-outline-dark'}`}
                        type="button"
                      >
                        <FontAwesomeIcon icon={spendSecretKeyCopied ? 'check' : 'copy'} fixedWidth />
                      </button>
                    </CopyToClipboard>
                  </span>
              </div>
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-5 col-sm-3">
              Private View Key
            </div>
            <div className="col-7 col-sm-9 wallet-address">
              <div className="input-group">
                <input
                  value={wallet.keys ? wallet.keys.viewSecretKey : ''}
                  readOnly
                  className="form-control"
                />
                <span className="input-group-btn">
                  <CopyToClipboard
                    text={wallet.keys ? wallet.keys.viewSecretKey : ''}
                    onCopy={() => copyClipboard('viewSecretKey')}
                  >
                    <button
                      className={`btn btn-no-focus ${viewSecretKeyCopied ? 'btn-outline-success' : 'btn-outline-dark'}`}
                      type="button"
                    >
                      <FontAwesomeIcon icon={viewSecretKeyCopied ? 'check' : 'copy'} fixedWidth />
                    </button>
                  </CopyToClipboard>
                </span>
              </div>
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

export default KeysModal;
