import React, { useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCheck, FaCopy } from 'react-icons/fa';


const CopyButton = props => {
  const { classNames, disabled, text, toolTipText } = props;
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
          className={`btn btn-no-focus ${textCopied[id] ? 'btn-outline-success' : 'btn-outline-dark'} ${classNames ? classNames.join(' ') : ''}`}
          type="button"
          disabled={disabled}
        >
          {textCopied[id] ? <FaCheck /> : <FaCopy />}
        </button>
      </CopyToClipboard>
    </OverlayTrigger>
  )
};

export default CopyButton;
