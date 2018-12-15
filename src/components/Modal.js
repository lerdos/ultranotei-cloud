import React from 'react';


class Modal extends React.Component {
  render() {
    if(!this.props.show) {
      return null;
    }

    return (
      <div className="backdrop">
        <div className="modal">
          <div className="modal-header"><h1>{this.props.title}</h1></div>
          <div className="modal-content">{this.props.children}</div>
          <div className="modal-footer">
            <button name={this.props.name} onClick={this.props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
