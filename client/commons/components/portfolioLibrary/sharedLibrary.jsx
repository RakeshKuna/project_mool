/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This will manage the library actions across all the porfolios
 * JavaScript XML file PortfolioLibrary.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */

import React from 'react';
var FontAwesome = require('react-fontawesome');
var Select = require('react-select');
import { Modal, ModalHeader, ModalBody} from 'reactstrap';
import _ from 'lodash'
import MlVideoPlayer from  '../../videoPlayer/MlVideoPlayer';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';


export default class  SharedLibrary extends React.Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      previewImage: "",
      previewDocument:"",
      previewTemplate:"",
      previewVideo:"",
      templateDetails: [],
      documentDetails: [],
      imageDetails: [],
      videoDetails: [],
      videoUrl: '',
      showSharedFiles: false,
      sharedFiles: []
    };
    this.toggle = this.toggle.bind(this);
  }

  /**
   * componentWillMount
   * Desc :: data to be loaded on the mounting
   * @param props :: Object - Parents data
   */

  componentWillMount() {
    let data = this.props.data || [];
    let that = this;
    let Image = [];
    let Video = [];
    let Template = [];
    let Document = [];
    data.map(function(fileInfo){
      let type = fileInfo.file.fileType;
      if(type === 'image') {
        Image.push(fileInfo)
        that.setState({imageDetails: Image})
      } else if(type === 'video') {
        Video.push(fileInfo)
        that.setState({videoDetails: Video})
      } else if(type === 'document') {
        Document.push(fileInfo)
        that.setState({documentDetails: Document})
      } else {
        Template.push(fileInfo)
        that.setState({templateDetails: Template})
      }
    })
  }

  componentWillReceiveProps(newProps) {
    let data = newProps && newProps.data ? newProps.data : [] ;
    let that = this;
    let Image = [];
    let Video = [];
    let Template = [];
    let Document = [];
    if(_.isEmpty(data)){
      this.setState({imageDetails: [], videoDetails:[],documentDetails:[], templateDetails:[]  })
    } else{
      data.map(function(fileInfo){
        let type = fileInfo.file.fileType;
        if(type === 'image') {
          Image.push(fileInfo)
          that.setState({imageDetails: Image})
        } else if(type === 'video') {
          Video.push(fileInfo)
          that.setState({videoDetails: Video})
        } else if(type === 'document') {
          Document.push(fileInfo)
          that.setState({documentDetails: Document})
        } else {
          Template.push(fileInfo)
          that.setState({templateDetails: Template})
        }
      })
    }
  }

  /**
   * Method :: toggle
   * Desc   :: toggles the Modal component
   * @returns Void
   */

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

   /**
   * Method :: preview
   * Desc   :: Handles all the previewing operations
   */

  preview(link, type) {
    if(type === "Image")this.setState({previewImage: link});
    else if(type === "Video") this.setState({previewVideo: link, videoUrl: link});
    else if(type === "Document") this.setState({previewDocument: link});
  }

  randomTemplate(link, index) {
    let templatePreviewUrl ;
    templatePreviewUrl = generateAbsolutePath(link);
    let isDocument = (templatePreviewUrl.endsWith('.pdf') || templatePreviewUrl.endsWith('.doc') || templatePreviewUrl.endsWith('.docx') || templatePreviewUrl.endsWith('.xls') || templatePreviewUrl.endsWith('.xlsx')) ? true : false;
    this.setState({ previewTemplate: templatePreviewUrl, validDocFormat: isDocument});
  }

  /**
   * Method :: images
   * Desc   :: Handles all the image looping activities
   * @returns Images - type:: Object
   */

  images() {
    let that = this;
    let imageData = that.state.imageDetails ||  [] ;
    const Images = imageData.map(function (show, id) {
      return (
        <div className="thumbnail" key={id}>
          <div className="icon_count_times"> <FontAwesome name="clock-o"></FontAwesome>{show.daysToExpire}</div>
          {show.isDownloadable ? <a href={generateAbsolutePath(show.file.url)} download={show.file.fileName}><FontAwesome  name='download'/></a>:<div></div>}
            <a href="" data-toggle="modal" data-target=".imagespop" onClick={that.preview.bind(that, show.file.url, "Image")}>
              <img src={generateAbsolutePath(show.file.url)} /></a>
          <div id="images" className="title">{show.file.fileName}</div>

        </div>
      )
    });
    return Images
  }

  /**
   * Method :: templates
   * Desc   :: Handles all the template looping activities
   * @returns Templates - type:: Object
   */

  templates() {
    let that = this;
    let templateData = that.state.templateDetails  || [];
    const Templates = templateData.map(function (show, id) {
      let docType = null;
      if(show.file && show.file.fileName) {
        let type = show.file.fileName.split('.')[1];
        if(type === 'pdf'){
          docType = type;
        }else if(type === 'xls' ||type === 'xlsx' ){
          docType = 'xls';
        }else if(type === 'doc' || type === 'docx' ){
          docType = 'doc';
        }
      }
      return (
        <div className="thumbnail" key={id}>
          <div className="icon_count_times"> <FontAwesome name="clock-o"></FontAwesome>{show.daysToExpire}</div>
          {show.isDownloadable ? <a href={generateAbsolutePath(show.file.url)} download={show.file.fileName}><FontAwesome  name='download'/></a>:<div></div>}
          <a href="" data-toggle="modal" data-target=".templatespop"
             onClick={that.randomTemplate.bind(that, show.file.url, id)}>
            {docType ? <img src={`/images/${docType}.png`}/> :<img src={generateAbsolutePath(show.file.url)} />}</a>
          <div id="templates" className="title">{show.file.fileName}</div>
        </div>
      )
    });
    return Templates
  }


  /**
   * Method :: videos
   * Desc   :: Handles all the video looping activities
   * @returns videos - type:: Object
   */

  videos() {
    let that = this;
    let videodata = that.state.videoDetails || [];
    const videos = videodata.map(function (show, id) {
      return (
        <div className="thumbnail" key={id}>
          <div className="icon_count_times"> <FontAwesome name="clock-o"></FontAwesome>{show.daysToExpire}</div>
          {show.isDownloadable ? <a href={generateAbsolutePath(show.file.url)} download={show.file.fileName}><FontAwesome  name='download' /></a>:<div></div>}
          <br/>
          <a href="" data-toggle="modal" data-target=".videospop"
             onClick={that.preview.bind(that, show.file.url, "Video")}>
            <video width="120" height="100" controls>
              <source src={generateAbsolutePath(show.file.url)} type="video/mp4"></source>
            </video>
          </a>
          <div className="title">{show.file.fileName}</div>
        </div>
      )
    });
    return videos;
  }

  /**
   * Method :: documents
   * Desc   :: Handles all the documents looping activities
   * @returns Documents - type:: Object
   */

  documents() {
    let that = this;
    let documentData = that.state.documentDetails || [];
    const Documents = documentData.map(function (show, id) {
      var docType = 'doc';
      if(show.file.fileName && show.file.fileName.split('.')[1]) {
        let type = show.file.fileName.split('.')[1];
        if(type === 'pdf'){
          docType = type;
        }else if(type === 'xls' ||type === 'xlsx' ){
          docType = 'xls';
        }else if(type === 'ppt'){
          docType = type;
        }
      }
      return (
        <div className="thumbnail" key={id}>
          <div className="icon_count_times"> <FontAwesome name="clock-o"></FontAwesome>{show.daysToExpire}</div>
          {show.isDownloadable ? <a href={generateAbsolutePath(show.file.url)} download={show.file.fileName}><FontAwesome  name='download'/></a>:<div></div>}
          <a href="" data-toggle="modal" data-target=".documentspop"
             onClick={that.preview.bind(that, generateAbsolutePath(show.file.url), "Document")}>
            <img src={`/images/${docType}.png`}/></a>
          <div id="images" className="title">{show.file.fileName}</div>
        </div>
      )
    });
    return Documents;
  }


  componentDidMount() {
    (function (a) {
      a.createModal = function (b) {
        defaults = {scrollable: false};
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
    $('.view-pdf').on('click', function () {
      var pdf_link = $(this).attr('href');
      var iframe = '<div class="iframe-container"><iframe src="' + pdf_link + '"></iframe></div>'
      $.createModal({
        title: 'My Title',
        message: iframe,
        scrollable: false
      });
      return false;
    });
  }


  connectionManagement(userId) {
    this.getSharedFiles(userId);
  }

  render() {
    var videoJsOptions = [{
      autoplay: true,
      controls: true,
      sources: [{src: generateAbsolutePath(this.state.previewVideo), type: 'video/mp4'}]
    }]


    return (
      <div>
        {/*<h2>Library</h2>*/}
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={'library-popup'}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
            <img src="/images/video_1.jpg"/>
          </ModalBody>
        </Modal>
        <div className="modal fade bs-example-modal-sm library-popup imagespop"
             onContextMenu={(e) => e.preventDefault()} tabindex="-1" role="dialog"
             aria-labelledby="mySmallModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
              </div>
              <div className="modal-body">
                <div className="img_scroll"><img src={generateAbsolutePath(this.state.previewImage)}/></div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade bs-example-modal-sm library-popup templatespop"
             onContextMenu={(e) => e.preventDefault()} tabindex="-1" role="dialog"
             aria-labelledby="mySmallModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
              </div>
              <div className="modal-body pdf-view">
              {this.state.validDocFormat ?
                 this.state.previewTemplate&&(this.state.previewTemplate).endsWith('.pdf')?
                 <iframe src={`https://docs.google.com/gview?url=${this.state.previewTemplate}&embedded=true`} />
                 :
                 <iframe src={`https://view.officeapps.live.com/op/view.aspx?src=${this.state.previewTemplate}`} />

                :<div className="img_scroll"><img src={this.state.previewTemplate} /></div>}
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade bs-example-modal-sm library-popup documentspop"
             onContextMenu={(e) => e.preventDefault()}
             tabindex="-1"
             role="dialog"
             aria-labelledby="mySmallModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body pdf-view">
             
                 {this.state.previewDocument&&(this.state.previewDocument).endsWith('.pdf')?
                 <iframe src={`https://docs.google.com/gview?url=${this.state.previewDocument}&embedded=true`} />
                 :
                 <iframe src={`https://view.officeapps.live.com/op/view.aspx?src=${this.state.previewDocument}`} />}

              </div>
            </div>
          </div>
        </div>
        <div className="modal fade bs-example-modal-sm library-popup videospop"
             onContextMenu={(e) => e.preventDefault()}
             tabindex="-1"
             role="dialog"
             aria-labelledby="mySmallModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.state.previewVideo ? <MlVideoPlayer videoAttributes={videoJsOptions}/> : <div></div>}
              </div>
            </div>
          </div>
        </div>
          <div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-left">
            <div className="panel panel-default">
              <div className="panel-heading">
                Images
                <div className="fileUpload upload_file_mask pull-right" id="create_client">
                </div>
              </div>
              <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                {this.images()}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-right">
            <div className="panel panel-default">
              <div className="panel-heading">
                Videos
                <div className="fileUpload upload_file_mask pull-right" id="create_video">
                </div>
              </div>
              <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                {this.videos()}
              </div>
            </div>
          </div>
          <br className="brclear"/>
          <div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-left">
            <div className="panel panel-default">
              <div className="panel-heading">
                Templates
                <div className="fileUpload upload_file_mask pull-right" id="create_template">
                </div>
              </div>
              <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                {this.templates()}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-right">
            <div className="panel panel-default">
              <div className="panel-heading">
                Documents
                <div className="fileUpload upload_file_mask pull-right" id="create_document">
                </div>
              </div>
              <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                {this.documents()}
              </div>
            </div>
          </div>
        </div>
    )
  }
}



