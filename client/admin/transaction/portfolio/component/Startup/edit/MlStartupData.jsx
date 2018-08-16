import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ScrollArea from 'react-scrollbar';
var FontAwesome = require('react-fontawesome');
import {multipartASyncFormHandler} from '../../../../../../commons/MlMultipartFormAction'
import {putDataIntoTheLibrary,removePortfolioFileUrl} from '../../../../../../commons/actions/mlLibraryActionHandler'
import {fetchStartupPortfolioData} from '../../../actions/findPortfolioStartupDetails'
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';

export default class MlStartupData extends React.Component{
  constructor(props){
    super(props)
    this.state={uploadedData: {balanceSheet : [],profitAndLoss:[],quaterlyReport:[],yearlyReport:[],halfYearlyReport:[],annualReport:[],cashFlow:[],
      shareHoldings:[],ratio:[],capitalStructure:[]}};
    this.loopingTheUploadedData.bind(this);
    this.libraryAction = this.libraryAction.bind(this);

  }

  componentWillMount() {
    const resp = this.fetchPortfolioData()
    return resp
  }

  async fetchPortfolioData(){
    const resp = await fetchStartupPortfolioData(this.props.portfolioDetailsId,this.props.client)
    this.setState({
      uploadedData: resp
    })
  }
  componentDidUpdate(){
  var className = this.props.isAdmin?"admin_header":"app_header"
  var WinWidth = $(window).width();
  var WinHeight = $(window).height();
  $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
  if(WinWidth > 768){
    $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
  }
}

  componentDidMount()
  {
    $(function() {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function() {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      }else{
        $(this).parent('.switch').removeClass('on');
      }
    });

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
  }

  documentUpload(type, e) {
    let file = e.target.files[0];
    let updatedData = {
      moduleName: "PORTFOLIO",
      actionName: "UPLOAD",
      portfolioDetailsId: this.props.portfolioDetailsId,
      portfolio: {data: {[type]: [{fileUrl: '', fileName: file.name}]}}
    }
    let response =  multipartASyncFormHandler(updatedData, file, 'registration', this.onFileUploadCallBack.bind(this,type, file));
    // }else{
    //   toastr.error("Please select a Document Format")
    // }
  }
  async removeDataDocument(type,fileUrl){
    if(type && fileUrl){
      let portfolioDetailsId = this.props.portfolioDetailsId;
      const resp = await removePortfolioFileUrl(portfolioDetailsId , fileUrl, "data", type);
      this.fetchPortfolioData();
    }
  }


  onFileUploadCallBack(type, file, resp) {
    if (resp && type) {
      let result = JSON.parse(resp);

      Confirm('', "Do you want to add this file to your library?", 'Yes', 'No',(ifConfirm)=>{
        if(ifConfirm){
          let fileObjectStructure = {
            fileName: file.name,
            fileType: file.type,
            fileUrl: result.result,
            libraryType: "image"
          }
          this.libraryAction(fileObjectStructure);
        }
      });
      this.fetchPortfolioData();
    }
  }

  async libraryAction(file) {
    let portfolioDetailsId = this.props.portfolioDetailsId;
    const resp = await putDataIntoTheLibrary(portfolioDetailsId ,file, this.props.client)
    if(resp.code === 404) {
      toastr.error(resp.result)
    } else {
      toastr.success(resp.result)
      return resp;
    }
  }

  getThumbnailImage(doc) {
    let url = generateAbsolutePath(doc.fileUrl);

    if (doc.fileName && doc.fileName.split('.')[1]) {
      let type = doc.fileName.split('.')[1];
      if (type === 'pdf') {
        url = `/images/${type}.png`;
      } else if (type === 'xls' || type === 'xlsx') {
        url = `/images/${'xls'}.png`;
      } else if (type === 'doc' || type === 'docx') {
        url = `/images/${'doc'}.png`;
      }
    }
    return url;
  }

  loopingTheUploadedData(type) {
    let data = this.state.uploadedData[`${type}`];
    let that=this;
    switch(type){
      case 'balanceSheet':
        if(data) {
          const display = data.map(function(docs){
            return(
              <div className="thumbnail">
                <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"balanceSheet",docs.fileUrl)}/>
                <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'profitAndLoss':
        if(data) {
          const display = data.map(function(docs){
            return(
              <div className="thumbnail">
                <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"profitAndLoss",docs.fileUrl)}/>
                <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'quaterlyReport':
        if(data) {
          const display = data.map(function(docs){
            return(
              <div className="thumbnail">
                <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"quaterlyReport",docs.fileUrl)}/>
                <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'yearlyReport':
        if(data) {
         const display = data.map(function(docs){
          return(
            <div className="thumbnail">
              <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"yearlyReport",docs.fileUrl)}/>
              <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
              <div id="images" className="title">{docs.fileName}</div>
            </div>
          )
        })
        return display;
      }
      break;
      case 'halfYearlyReport':
        if(data) {
        const display = data.map(function(docs){
          return(
            <div className="thumbnail">
              <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"halfYearlyReport",docs.fileUrl)}/>
              <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
              <div id="images" className="title">{docs.fileName}</div>
            </div>
          )
        })
        return display;
      }
      break;
        case 'annualReport':
      if(data) {
        const display = data.map(function(docs){
          return(
            <div className="thumbnail">
              <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"annualReport",docs.fileUrl)} />
              <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
              <div id="images" className="title">{docs.fileName}</div>
            </div>
          )
        })
        return display;
      }
      break;
      case 'cashFlow':
      if(data) {
        const display = data.map(function(docs){
          return(
            <div className="thumbnail">
              <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"cashFlow",docs.fileUrl)}/>
              <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
              <div id="images" className="title">{docs.fileName}</div>
            </div>
          )
        })
        return display;
      }
      break;
      case 'shareHoldings':
      if(data) {
        const display = data.map(function(docs){
          return(
            <div className="thumbnail">
              <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"shareHoldings",docs.fileUrl)}/>
              <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
              <div id="images" className="title">{docs.fileName}</div>
            </div>
          )
        })
        return display;
      }
      break;
      case 'capitalStructure':
        if(data) {
          const display = data.map(function(docs){
            return(
              <div className="thumbnail">
                <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"capitalStructure",docs.fileUrl)}/>
                <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'ratio':
        if(data) {
          const display = data.map(function(docs){
            return(
              <div className="thumbnail">
                <FontAwesome className="fa fa-trash-o" onClick={that.removeDataDocument.bind(that,"ratio",docs.fileUrl)}/>
                <img src={that.getThumbnailImage(docs)} style={{'width':'100px'}} />
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
    }
  }

  render(){
    return (
      <div>
        <div className="portfolio-main-wrap">
          <h2>Data</h2>
          <div className="main_wrap_scroll">
            <div className="col-md-6 col-sm-6 nopadding-left library-wrap">
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Balance Sheet
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'balanceSheet' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" onContextMenu={(e)=>e.preventDefault()}>
                  {this.loopingTheUploadedData('balanceSheet')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Quaterly Report
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'quaterlyReport' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" onContextMenu={(e)=>e.preventDefault()}>
                  {this.loopingTheUploadedData('quaterlyReport')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Yearly Report
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'yearlyReport' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" onContextMenu={(e)=>e.preventDefault()}>
                  {this.loopingTheUploadedData('yearlyReport')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Half Yearly Report
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'halfYearlyReport' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" onContextMenu={(e)=>e.preventDefault()}>
                  {this.loopingTheUploadedData('halfYearlyReport')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Annual Report
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'annualReport' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" onContextMenu={(e)=>e.preventDefault()}>
                  {this.loopingTheUploadedData('annualReport')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 nopadding-right library-wrap">
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Profit and Loss
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'profitAndLoss' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" >
                  {this.loopingTheUploadedData('profitAndLoss')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Cash Flow
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'cashFlow' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" onContextMenu={(e)=>e.preventDefault()}>
                  {this.loopingTheUploadedData('cashFlow')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Share Holdings
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'shareHoldings' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" onContextMenu={(e)=>e.preventDefault()}>
                  {this.loopingTheUploadedData('shareHoldings')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Capital Structure
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'capitalStructure' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" onContextMenu={(e)=>e.preventDefault()}>
                  {this.loopingTheUploadedData('capitalStructure')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
              <div className="panel panel-default panel-form-view uploaded_files">
                <div className="panel-heading">
                  Ratio
                  <div className="fileUpload upload_file_mask pull-right" id="create_document">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload"><input type="file" className="upload_file upload" name="image_source" id="document_upload" onChange={this.documentUpload.bind(this,'ratio' )} /></span></a>
                  </div>
                  <div className="pull-right block_action">
                    <span className="single_icon ml ml-information information"></span>
                  </div>
                </div>
                <div className="panel-body" onContextMenu={(e)=>e.preventDefault()}>
                  {this.loopingTheUploadedData('ratio')}
                  <p className="show-information" style={{ 'display': 'none', 'color':'black' }}>Document Format : .png, .jpg, .jpeg , .doc, .docx, .xls, .xlsx, .pdf <br />Document Size : 10 MB <br /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};
