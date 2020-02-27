import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaQuestionCircle } from 'react-icons/fa';


const FormLabelDescription = props =>
  <OverlayTrigger overlay={<Tooltip id="conceal-id-tooltip">{props.children}</Tooltip>}>
    <FaQuestionCircle className="mg-l-5 form-label-description" />
  </OverlayTrigger>;

export default FormLabelDescription;
