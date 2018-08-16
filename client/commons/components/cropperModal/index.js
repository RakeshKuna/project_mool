import React from 'react';
import { Modal } from 'react-bootstrap';
import Cropper from 'react-cropper';

import MlLoader from '../../../commons/components/loader/loader';
import '../../../../node_modules/cropperjs/dist/cropper.min.css';
import '../../../stylesheets/css/cropper.css';


export default class CropperModal extends React.PureComponent {

  constructor() {
    super();
    this.state = { };
    this.onChangeImageSrc = this.onChangeImageSrc.bind(this);
    this.onImageUpload = this.onImageUpload.bind(this);
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type:mimeString });
  }

  onImageUpload() {
    if (!this.state.imageSrc) {
      return;
    }
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    this.props.handleImageUpload(this.dataURItoBlob(this.cropper.getCroppedCanvas().toDataURL()), this.state.file);
  }

  onChangeImageSrc(evt) {
    if (evt && evt.preventDefault) { evt.preventDefault(); }
    let files;
    if (evt.dataTransfer) {
      files = evt.dataTransfer.files;
    } else if (evt.target) {
      files = evt.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({
        imageSrc: reader.result,
        imageEvt: evt,
        file: files[0],
      });
    };
    reader.readAsDataURL(files[0]);
  }

  render() {
    const { show, toggleShow, uploadingImage, imageSrc, cropperStyle } = this.props;
    const CModal = (
      <Modal show={show}>
        <Modal.Header>
         <center> Choose the image to upload. </center>
        </Modal.Header>
        <Modal.Body>
          {uploadingImage ? <MlLoader /> : ''}
          <div style={{ width: '100%' }}>
            <center>
              <label htmlFor="avatar" className="">
                <a className="mlUpload_btn">Browse Image</a>
              </label>
            </center>
            <p className="text-center small">Scroll to zoom in or zoom out of the image. You can crop your image using the blue square.</p>
            <input accept=".jpeg,.png,.jpg," id="avatar" type="file" onChange={this.onChangeImageSrc} style={{ display: 'none' }} />
            <br />
            <br />
            <div className="circle-cropper">
              <Cropper
                zoomTo={1}
                viewMode={1}
                style={{ height: 350, width: '100%' }}
                aspectRatio={cropperStyle !== 'any' ? 1 / 1 : undefined}
                guides={false}
                src={this.state.imageSrc || imageSrc}
                ref={(cropper) => { this.cropper = cropper; }}
                center
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="form-group">
            <a disabled={uploadingImage} className="mlUpload_btn" onClick={toggleShow}>
              Close
            </a>
            <a onClick={this.onImageUpload} disabled={uploadingImage} className="mlUpload_btn" >
              {this.props.submitText || 'Upload'}
            </a>
          </div>
        </Modal.Footer>
      </Modal>
    );
    if (cropperStyle === 'circle') {
      return (
        CModal
      );
    }
    return CModal;
  }
}

CropperModal.propTypes = {
  handleImageUpload: React.PropTypes.func.isRequired,
  toggleShow: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool.isRequired,
  uploadingImage: React.PropTypes.bool.isRequired,
  cropperStyle: React.PropTypes.oneOf(['circle', 'square', 'any']).isRequired,
  imageSrc: React.PropTypes.string,
  submitText: React.PropTypes.string,
};
