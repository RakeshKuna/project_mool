import React from 'react';
var FontAwesome = require('react-fontawesome');
import MlVideoPlayer from '../../../commons/videoPlayer/MlVideoPlayer';

class MlFilePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  render() {
    return (
      <div className={`modal fade bs-example-modal-sm library-popup ${this.props.fileType}pop`}
           onContextMenu={(e) => e.preventDefault()} tabindex="-1" role="dialog"
           aria-labelledby="mySmallModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            </div>
            <div className="modal-body">

              {(this.props.fileType === 'image' || this.props.fileType === 'template')?<div className="img_scroll"><img src={this.props.filePath} /></div>:<div></div>}

              {this.props.fileType === 'video' ? <MlVideoPlayer videoAttributes={
                [{
                  autoplay: true,
                  controls: true,
                  sources: [{ src: this.props.filePath, type: 'video/mp4' }]
                }]
              } /> : <div></div>}

              {this.props.fileType === 'document'? <iframe src={`https://docs.google.com/gview?url=${this.props.filePath}&embedded=true`} />:<div></div>}

            </div>
          </div>
        </div>
      </div>
    );
  }
}



