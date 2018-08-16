import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import {fetchCompanyDetailsHandler} from "../../../../actions/findCompanyPortfolioDetails";
import {multipartASyncFormHandler} from "../../../../../../../commons/MlMultipartFormAction";
import {dataVisibilityHandler, OnLockSwitch} from "../../../../../../utils/formElemUtil";
import {putDataIntoTheLibrary} from '../../../../../../../commons/actions/mlLibraryActionHandler'
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../../commons/utils/confirm';
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor"

import _ from "lodash";

var FontAwesome = require('react-fontawesome');
var Select = require('react-select');

const KEY = 'aboutUs'

export default class MlCompanyAboutUs extends React.Component {
  constructor(props, context) {
    super(props);
    // console.log(this.props);
    this.state = {
      loading: true,
      privateKey: {},
      data: this.props.aboutUsDetails || {},
      editorValue: createValueFromString(this.props.aboutUsDetails ? this.props.aboutUsDetails.companyDescription : null)
    }

    this.handleBlur = this.handleBlur.bind(this);
    this.fetchOnlyImages.bind(this);
    this.libraryAction.bind(this);
    return this;

  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();

    // var WinHeight = $(window).height();
    // $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    var className = this.props.isAdmin ? "admin_header" : "app_header"
    setTimeout(function () {
      $('.main_wrap_scroll').height(WinHeight - ($('.' + className).outerHeight(true) + 120));
      if (WinWidth > 768) {
        $(".main_wrap_scroll").mCustomScrollbar({theme: "minimal-dark"});
      }
    }, 200);
    this.fetchOnlyImages()
    this.props.getAboutUs(this.state.data)
  }

  componentWillMount() {

    let empty = _.isEmpty(this.context.companyPortfolio && this.context.companyPortfolio.aboutUs)
    const editorValue = createValueFromString(this.context.companyPortfolio && this.context.companyPortfolio.aboutUs ? this.context.companyPortfolio.aboutUs.companyDescription : null);
    if (!empty) {packa
      this.setState({loading: false, editorValue}, () => {
        this.lockPrivateKeys();
      });
    }
    else {
      this.setState({loading: false}, () => {
        this.lockPrivateKeys();
      })
    }

    // this.setState({loading: false}, () => {
    //   this.lockPrivateKeys();
    // })
  }

  lockPrivateKeys() {
    const privateValues = this.state.data.privateFields;
    const filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName})
    const filterRemovePrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName})
    const finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey');
    const keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey');
    console.log('keysssssssssssssssss', keys);
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  handleBlur(value, keyName) {
    let details = this.state.data;
    // let name  = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, {[keyName]: value.toString('html')});
    // details=_.extend(details,{[name]:e.target.value});
    this.setState({data: details, editorValue: value}, function () {
      this.sendDataToParent()
    })
  }

  sendDataToParent() {
    let data = this.state.data;
    for (var propName in data) {
      if (data[propName] === null || data[propName] === undefined || propName === 'privateFields') {
        delete data[propName];
      }
    }
    // data = _.omit(data, ["privateFields"])

    this.props.getAboutUs(data, this.state.privateKey)
    this.fetchOnlyImages()
  }

  onLogoFileUpload(e) {
    if (e.target.files[0].length == 0)
      return;
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data = {
      moduleName: "PORTFOLIO",
      actionName: "UPLOAD",
      portfolioDetailsId: this.props.portfolioDetailsId,
      portfolio: {aboutUs: {logo: [{fileUrl: '', fileName: fileName}]}}
    };
    let response = multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this, name, file));
  }

  onFileUploadCallBack(name, file, resp) {
    if (resp) {
      let result = JSON.parse(resp);

      Confirm('', "Do you want to add the file into the library", 'Ok', 'Cancel', (ifConfirm) => {
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

      if (result.success) {
        this.fetchOnlyImages();
      }
    }
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

  async fetchOnlyImages() {
    let that = this;
    let portfoliodetailsId = that.props.portfolioDetailsId;
    const response = await fetchCompanyDetailsHandler(portfoliodetailsId, KEY);
    if (response && response.aboutUs) {
      let dataDetails = this.state.data
      dataDetails['logo'] = response.aboutUs.logo
      this.setState({data: dataDetails});
      // setTimeout(function () {
      //   _.each(response.aboutUs.privateFields, function (pf) {
      //     $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      //   })
      // }, 10)
    }
    this.setState({loading: false})
  }

  onLockChange(fieldName, field, e) {
    let details = this.state.data || {};
    var isPrivate = false;
    let key = e.target.id;
    details = _.omit(details, [key]);
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      details = _.extend(details, {[key]: true});
      isPrivate = true
    } else {
      details = _.extend(details, {[key]: false});
    }

    var privateKey = {keyName: fieldName, booleanKey: field, isPrivate: isPrivate, tabName: KEY}
    this.setState({privateKey: privateKey})

    this.setState({data: details}, function () {
      this.sendDataToParent()
    })
  }

  /*
    async fetchPortfolioDetails() {
      let that = this;
      let portfoliodetailsId=that.props.portfolioDetailsId;
      const response = await fetchDetailsStartupActionHandler(portfoliodetailsId);
      if (response) {
        let dataDetails = this.state.data
        dataDetails['logo'] = response.aboutUs.logo
        this.setState({loading: false, data: dataDetails});
      }

    }
  */


  render() {
    const {editorValue} = this.state;
    const aboutUsImages = (this.state.data.logo && this.state.data.logo.map(function (m, id) {
      return (
        <div className="upload-image" key={id}>
          <img id="output" src={generateAbsolutePath(m.fileUrl)}/>
        </div>
      )
    }));

    return (
      <div className="requested_input">
        <div className="main_wrap_scroll">
          <div className="col-lg-12">
            <div className="row">
              <h2>
                About Us
              </h2>
              <div className="panel panel-default panel-form">
                <div className="panel-body">
                  <div className="form-group nomargin-bottom">
                    <MlTextEditor
                      value={editorValue}
                      handleOnChange={(value) => this.handleBlur(value, "companyDescription")}
                    />
                    {/* <textarea placeholder="Describe..." className="form-control"  name="companyDescription" id="companyDescription" defaultValue={this.state.data&&this.state.data.companyDescription} onBlur={this.handleBlur.bind(this)}></textarea> */}
                    <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                                 id="isCompanyDescriptionPrivate"
                                 onClick={this.onLockChange.bind(this, "companyDescription", "isCompanyDescriptionPrivate")}/>
                  </div>

                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading">Add Images</div>
                <div className="panel-body nopadding">
                  <div className="upload-file-wrap">
                    <input type="file" name="logo" id="logoFileinput" className="inputfile inputfile-upload"
                           data-multiple-caption="{count} files selected" accept="image/*"
                           onChange={this.onLogoFileUpload.bind(this)} multiple/>
                    <label htmlFor="logoFileinput">
                      <figure>
                        <i className="fa fa-upload" aria-hidden="true"></i>
                      </figure>
                    </label>
                  </div>
                  {aboutUsImages}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
MlCompanyAboutUs.contextTypes = {
  companyPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
