import React, {Component} from "react";
var FontAwesome = require('react-fontawesome');
import generateAbsolutePath from '../../../../../../../../../lib/mlGenerateAbsolutePath';
import MlVideoPlayer from '../../../../../../../../commons/videoPlayer/MlVideoPlayer';

export default class BeSpokeAttachment extends Component {
    constructor(props){
        super(props);
        this.state={previewTemplate:""}
    }

componentDidMount(){
  (function (a) {
    a.createModal = function (b) {
      defaults = { scrollable: false };
      var b = a.extend({}, defaults, b);
      var c = (b.scrollable === true) ? 'style="max-height: 420px;overflow-y: auto;"' : "";
      html = '<div class="modal fade library-popup" id="myModal">';
      html += '<div class="modal-dialog">';
      html += '<div class="modal-content">';
      html += '<div class="modal-header">';
      html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">Ã—</button>';
      if (b.title.length > 0) {
        html += '<h4 class="modal-title">' + b.title + "</h4>"
      }
      html += "</div>";
      html += '<div class="modal-body" ' + c + ">";
      html += b.message;
      html += "</div>";
      a("body").prepend(html);
      a("#myModal").modal().on("hidden.bs.modal", function () {
        a(this).remove()
      })
    }
  })(jQuery);
    $(".information").unbind("click").click(function () {
        if ($(this).hasClass('ml-information')) {
          $(this).removeClass('ml-information').addClass('ml-delete');
          $(this).parents('.panel').find('.panel-body').css({ 'overflow': 'hidden' });
  
        } else {
          $(this).removeClass('ml-delete').addClass('ml-information');
          $(this).parents('.panel').find('.panel-body').css({ 'overflow': 'auto' });
        }
        $(this).parents('.panel').find(".show-information").toggle(200);
      });
      setTimeout(function(){
        var mySwiper = new Swiper('.manage_tasks', {
          slidesPerView: 'auto',
          speed: 400,
          spaceBetween: 5
      });
    },300);
}

previewHandler(link) {
  if(link.endsWith('.pdf') || link.endsWith('.doc') || link.endsWith('.docx') || link.endsWith('.xls') || link.endsWith('.xlsx')) this.setState({fileFormat: "Document"})
  else if(link.endsWith('.jpg') || link.endsWith('.jpeg') || link.endsWith('.png')) this.setState({fileFormat: "Image"})
  else if(link.endsWith('.mp4')) this.setState({fileFormat: "Video"})
  this.setState({previewTemplate: generateAbsolutePath(link)})
}

    render() {
      var videoJsOptions = [{
        autoplay: true,
        controls: true,
        sources: [{ src: this.state.previewTemplate, type: 'video/mp4' }]
      }]
      let that = this;
        return(
          <div>
          <div className="modal fade bs-example-modal-sm library-popup templatepop"
          onContextMenu={(e) => e.preventDefault()} tabIndex="-1" role="dialog"
          aria-labelledby="mySmallModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
              </div>
              <div className="modal-body moolya pdf-view">
                <div className="img_scroll">
                {(this.state.fileFormat === "Document") ?
                 this.state.previewTemplate&&(this.state.previewTemplate).endsWith('.pdf')?
                 <iframe src={`https://docs.google.com/gview?url=${this.state.previewTemplate}&embedded=true`} />
                 :<iframe src={`https://view.officeapps.live.com/op/view.aspx?src=${this.state.previewTemplate}`} />
                 :(this.state.fileFormat === "Video")?<MlVideoPlayer videoAttributes={videoJsOptions} />:<img src={this.state.previewTemplate} />}
                </div>
              </div>
            </div>
          </div>
        </div>
            <div className="col-lg-21 col-md-21 col-sm-21 library-wrap nopadding-left hide_panel">
            <div className="panel panel-default uploaded_files">
              <div className="panel-heading">
              Attachments if any ?
                <span className="see-more pull-right" onClick={this.props.toggleSeeMore}>See Less</span>
                <div className="pull-right block_action">
                  <div className="fileUpload upload_file_mask pull-right" id="create_client">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload">
                        <input type="file" className="upload_file upload"
                            name="video_source" id="video_upload"
                            onChange={e=>this.props.fileUpload(e)} 
                            />
                      </span>
                    </a>
                  </div>
                </div>
                <div className="pull-right block_action">
                  <span className="single_icon ml ml-information information"></span>
                </div>
              </div>
              <div className="panel-body" style={{"height": "-webkit-fill-available"}} onContextMenu={(e) => e.preventDefault()}>
              <p className="show-information" style={{ 'display': 'none' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf<br/>Document Size : 10 MB <br/></p>
                <div className="swiper-container manage_tasks">
                  <div className="manage_swiper swiper-wrapper">
                  {this.props.attach.map(function(details, index){return(
                    details.fileUrl ?
                   <div className="upload-image">
                      <a href="" data-toggle="modal" data-target=".templatepop">
                      {details.fileUrl.endsWith('.pdf') || details.fileUrl.endsWith('.doc') || details.fileUrl.endsWith('.docx') || details.fileUrl.endsWith('.xls') || details.fileUrl.endsWith('.xlsx') ?
                      <img src={`/images/${details.fileUrl.split(".").pop()}.png`} onClick={that.previewHandler.bind(that,details.fileUrl)}/>
                      :details.fileUrl.endsWith('.png') || details.fileUrl.endsWith('.jpg') || details.fileUrl.endsWith('.jpeg') ? <img src={generateAbsolutePath(details.fileUrl)} id="output" onClick={that.previewHandler.bind(that,details.fileUrl)}/>
                      :details.fileUrl.endsWith('.mp4')?<a onClick={that.previewHandler.bind(that,details.fileUrl)}><video style={{"width": "100%","height":"100%"}} onContextMenu={(e) => e.preventDefault()} width="120" height="100" controls><source src={generateAbsolutePath(details.fileUrl)} type="video/mp4"></source></video></a>
                      :<div></div>}
                      </a>
                      <div className="title">{details.fileName}</div>
                  </div> :"")})}        
                               
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        )
    }
}