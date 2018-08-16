import React from 'react';
import {multipartASyncFormHandler} from '../../../../../../../commons/MlMultipartFormAction'
import {fetchInstitutionPortfolioReports} from '../../../../actions/findPortfolioInstitutionDetails'
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import {putDataIntoTheLibrary} from '../../../../../../../commons/actions/mlLibraryActionHandler'
import Confirm from '../../../../../../../commons/utils/confirm';


export default class MlInstitutionCSRReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedData: {
        balanceSheet: [],
        profitAndLoss: [],
        quaterlyReport: [],
        yearlyReport: [],
        halfYearlyReport: [],
        annualReport: [],
        cashFlow: [],
        shareHoldings: [],
        ratio: [],
        capitalStructure: []
      }
    };
    this.loopingTheUploadedData.bind(this)
    this.fetchInstitutionPortfolioData.bind(this)
  }


  async fetchInstitutionPortfolioData() {
    const resp = await fetchInstitutionPortfolioReports(this.props.portfolioDetailsId, this.props.client)
    this.setState({
      uploadedData: resp
    });
  }

  async libraryAction(file) {
    let portfolioDetailsId = this.props.portfolioDetailsId;
    const resp = await putDataIntoTheLibrary(portfolioDetailsId, file, this.props.client)
    if (resp.code === 404) {
      toastr.error(resp.result)
    } else {
      toastr.success(resp.result)
      return resp;
    }
  }

  componentWillMount() {
    let portfolioId = FlowRouter.getRouteName();
    let path = FlowRouter.current().path
    if (path.indexOf("view") > 0) {
      this.setState({explore: false})
    }
    if (portfolioId !== "portfolio" || path.indexOf("view") > 0) {
      this.setState({explore: true})
    }
    if (portfolioId !== "portfolio" || path.indexOf("edit") > 0) {
      this.setState({deleteOption: true, isEndUserEdit: true})
    }
    if (portfolioId === "library") {
      this.setState({explore: false, isLibrary: true, hideLock: true, deleteOption: false})
    }
    if (portfolioId === "transaction_portfolio_EditRequests") {
      this.setState({explore: false, isAdminEdit: true})
      this.setState({hideLock: true})
    }
    this.fetchInstitutionPortfolioData()
  }

  componentDidMount() {
    $(function () {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    $('.tab_wrap_scroll').height(WinHeight - ($('.app_header').outerHeight(true) + 120));
    if (WinWidth > 768) {
      $(".tab_wrap_scroll").mCustomScrollbar({theme: "minimal-dark"});
    }
  }

  documentUpload(type, e) {
    this.setState({uploadType: type})
    let file = e.target.files[0];
    this.setState({fileType: file.type, fileName: file.name});
    let fileType = file.type
    let typeShouldBe = _.compact(fileType.split('/'));
    // if (file  && typeShouldBe && typeShouldBe[1]==="pdf" && typeShouldBe[1]==="image") {
    let data = {moduleName: "PROFILE", actionName: "UPDATE"}
    let response = multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this, type, file));
    // }else{
    //   toastr.error("Please select a Document Format")
    // }
  }


  onFileUploadCallBack(type, file, resp) {
    let that = this;
    let data = this.state.uploadedData;
    let result = JSON.parse(resp);
    if (resp && type) {

      Confirm('', "Do you want to add this file to your library?", 'Yes', 'No', (ifConfirm) => {
        if (ifConfirm) {
          let fileObjectStructure = {
            fileName: file.name,
            fileType: file.type,
            fileUrl: result.result,
            libraryType: "image"
          }
          this.libraryAction(fileObjectStructure)
        }
      });

      var link = $.parseJSON(resp).result;
      if (data && data[`${type}`]) {
        data[`${type}`].push({fileUrl: link, fileName: file.name})
      } else {
        let tempArray = [];
        tempArray.push({fileUrl: link, fileName: file.name})
        data[`${type}`] = tempArray;
      }
      this.setState({uploadedData: data}, function () {
        that.props.getInstitutionReports(this.state.uploadedData)
      });
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

    let that = this;
    switch (type) {
      case 'balanceSheet':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'profitAndLoss':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'quaterlyReport':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'yearlyReport':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'halfYearlyReport':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'annualReport':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'cashFlow':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'shareHoldings':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'capitalStructure':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
      case 'ratio':
        if (data) {
          const display = data.map(function (docs) {
            return (
              <div className="thumbnail">
                <img src={that.getThumbnailImage(docs)} style={{'width': '100px'}}/>
                <div id="images" className="title">{docs.fileName}</div>
              </div>
            )
          })
          return display;
        }
        break;
    }
  }

  render() {
    return (
      <div>
        <div className="portfolio-main-wrap">
          <h2>Data</h2>
          <div className="tab_wrap_scroll">
            <div className="col-md-6 col-sm-6 nopadding-left">
              <div className="panel panel-default">
                <div className="panel-heading">
                  Balance Sheet
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'balanceSheet')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                  {this.loopingTheUploadedData('balanceSheet')}
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Quaterly Report
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'quaterlyReport')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                  {this.loopingTheUploadedData('quaterlyReport')}
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Yearly Report
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'yearlyReport')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                  {this.loopingTheUploadedData('yearlyReport')}
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Half Yearly Report
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'halfYearlyReport')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                  {this.loopingTheUploadedData('halfYearlyReport')}
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Annual Report
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'annualReport')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                  {this.loopingTheUploadedData('annualReport')}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 nopadding-right">
              <div className="panel panel-default">
                <div className="panel-heading">
                  Profit and Loss
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'profitAndLoss')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body">
                  {this.loopingTheUploadedData('profitAndLoss')}
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Cash Flow
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'cashFlow')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                  {this.loopingTheUploadedData('cashFlow')}
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Share Holdings
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'shareHoldings')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                  {this.loopingTheUploadedData('shareHoldings')}
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Capital Structure
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'capitalStructure')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                  {this.loopingTheUploadedData('capitalStructure')}
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">
                  Ratio
                  {this.state.explore ? "" : this.state.isLibrary || this.state.isAdminEdit || this.state.isEndUserEdit ?
                    <div className="fileUpload upload_file_mask pull-right" id="create_document">
                      <a href="javascript:void(0);">
                        <span className="ml ml-upload"><input type="file" className="upload_file upload"
                                                              name="image_source" id="document_upload"
                                                              onChange={this.documentUpload.bind(this, 'ratio')}/></span></a>
                    </div> : ""}
                </div>
                <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
                  {this.loopingTheUploadedData('ratio')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};
