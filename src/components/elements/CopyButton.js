import React, { useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const CopyButton = props => {
  const { text, toolTipText } = props;
  const id = props.id || text;
  const [textCopied, setTextCopied] = useState({});

  const copyClipboard = id => {
    setTextCopied({ [id]: true });
    setTimeout(id => setTextCopied({ [id]: true }), 400);
  };

  return (
    <OverlayTrigger overlay={<Tooltip id={`${id}-copy`}>{toolTipText}</Tooltip>}>
      <CopyToClipboard text={text} onCopy={() => copyClipboard(text)} >
        <button
          className={`btn btn-no-focus ${textCopied[id] ? 'btn-outline-success' : 'btn-outline-dark'}`}
          type="button"
        >
          <FontAwesomeIcon icon={textCopied[id] ? 'check' : 'copy'} fixedWidth />
        </button>
      </CopyToClipboard>
    </OverlayTrigger>
  )
};

export default CopyButton;
