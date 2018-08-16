import React, { PureComponent } from 'react';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import Button from 'reactstrap/lib/Button';

export default class AppointmentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: props.showModal
    }
  }

  componentWillReceiveProps({ showModal }) {
    this.setState({ showModal });
  }

  render() {
    return (
      <Modal isOpen={this.state.showModal} onHide={this.onClose}>
        <ModalBody>
          <div>{this.props.message}</div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => this.props.onOkClick()}>Ok</Button>{' '}
          <Button color="secondary" onClick={() => this.props.onCancelClick()}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}