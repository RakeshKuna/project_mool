import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import _ from "lodash";
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch} from "../../../../../utils/formElemUtil";
import {findServiceProviderAboutActionHandler} from "../../../actions/findPortfolioServiceProviderDetails";
import {multipartASyncFormHandler} from "../../../../../../commons/MlMultipartFormAction";
import {putDataIntoTheLibrary} from '../../../../../../commons/actions/mlLibraryActionHandler'
import MlLoader from "../../../../../../commons/components/loader/loader";
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';
import MlTextEditor, {createValueFromString} from "../../../../../../commons/components/textEditor/MlTextEditor";

export default class MlServiceProviderAbout extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      privateKey: {},
      privateValues:[]
    }
    this.onClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleEditorBlur = this.handleEditorBlur.bind(this);
    this.onAboutImageFileUpload.bind(this)
    this.fetchPortfolioInfo.bind(this);
    this.fetchOnlyImages.bind(this);
    this.libraryAction.bind(this);
  }

  componentWillMount() {
    const resp = this.fetchPortfolioInfo();
    return resp
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  onClick(fieldName, field, e) {
    var isPrivate = false;
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true;
    }
    var privateKey = { keyName: fieldName, booleanKey: field, isPrivate: isPrivate, tabName: this.props.tabName }
    this.setState({ privateKey: privateKey }, function () {
      this.sendDataToParent()
    })
  }

  handleEditorBlur(value, name) {
    let details = this.state.data;
    details = _.omit(details, [name]);
    details = _.extend(details, { [name]: value.toString('html') });
    this.setState({ data: details, editorValue: value }, function () {
      this.sendDataToParent()
    })
  }

  handleBlur(e) {
    let details = this.state.data;
    let name = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: e.target.value});
    this.setState({data: details}, function () {
      this.sendDataToParent()
    })
  }

  sendDataToParent() {
    let data = this.state.data;
    data = _.omit(data, 'aboutImages')
    for (var propName in data) {
      if (data[propName] === null || data[propName] === undefined) {
        delete data[propName];
      }
    }
    data = _.omit(data, ["privateFields"]);
    this.props.getAboutus(data, this.state.privateKey)
  }

  async fetchPortfolioInfo() {
    let that = this;
    let portfoliodetailsId = that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.serviceProviderPortfolio && that.context.serviceProviderPortfolio.about)
    if (empty) {
      const response = await findServiceProviderAboutActionHandler(portfoliodetailsId);
      if (response) {
        const editorValue = createValueFromString(response && response.aboutDescription ? response.aboutDescription : null);
        this.setState({ loading: false, data: response, editorValue });
        _.each(response.privateFields, function (pf) {
          $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
        })
      } 
    } else {
      this.fetchOnlyImages();
      const editorValue = createValueFromString(that.context.serviceProviderPortfolio.about && that.context.serviceProviderPortfolio.about.aboutDescription ? that.context.serviceProviderPortfolio.about.aboutDescription : null);
      this.setState({ loading: true, data: that.context.serviceProviderPortfolio.about, editorValue });
    }
  }

/**
   * UI creating lock function
   * */
  lockPrivateKeys() {
    var filterPrivateKeys = _.filter(this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName})
    var finalKeys = _.unionBy(filterPrivateKeys, this.state.privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  onAboutImageFileUpload(e) {
    if (e.target.files[0].length == 0)
      return;
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data = {
      moduleName: "PORTFOLIO",
      actionName: "UPLOAD",
      portfolioDetailsId: this.props.portfolioDetailsId,
      portfolio: {about: {aboutImages: [{fileUrl: '', fileName: fileName}]}}
    };
    let response = multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this, name, file));
  }

  async fetchOnlyImages() {
    const response = await findServiceProviderAboutActionHandler(this.props.portfolioDetailsId);
    if (response) {
      let dataDetails = this.state.data
      dataDetails['aboutImages'] = response.aboutImages
      this.setState({loading: false, data: dataDetails,privateValues: response.privateFields}, () =>{
        this.lockPrivateKeys();
      });
    }
  }

  onFileUploadCallBack(name, file, resp) {
    if (resp) {
      let result = JSON.parse(resp);

      Confirm('', "Do you want to add this file to your library?", 'Yes', 'No',(ifConfirm)=>{
        if(ifConfirm){
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
      const resp = await putDataIntoTheLibrary(portfolioDetailsId ,file, this.props.client)
      if(resp.code === 404) {
        toastr.error(resp.result)
      } else {
        toastr.success(resp.result)
        return resp;
      }
    }

  render() {
    const showLoader = this.state.loading;
    const aboutImageArray = this.state.data.aboutImages && this.state.data.aboutImages.length > 0 ? this.state.data.aboutImages : [];
    const aboutImages = aboutImageArray.map(function (m, id) {
      return (
        <div className="upload-image" key={id}>
          <img id="output" src={generateAbsolutePath(m.fileUrl)}/>
        </div>
      )
    });
    // let description = this.state.data.aboutDescription ? this.state.data.aboutDescription : ''
    let isDescriptionPrivate = this.state.data.isDescriptionPrivate ? this.state.data.isDescriptionPrivate : false
    const { editorValue } = this.state;
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
          <div className="requested_input">
            <h2>About</h2>
            <div className="col-lg-12">
              <div className="row">
                <div className="panel panel-default panel-form">
                  <div className="panel-heading">
                    <div className="form-group nomargin-bottom">
                      <input type="text" placeholder="Title Here..." className="form-control"
                             defaultValue={this.state.data ? this.state.data.aboutTitle : ''}
                             name="aboutTitle" onBlur={this.handleBlur}/>
                      <FontAwesome name='unlock' className="input_icon req_input_icon un_lock" id="isAboutTitlePrivate"
                                   onClick={this.onClick.bind(this, "aboutTitle", "isAboutTitlePrivate")}/>
                    </div>
                  </div>
                  <div className="panel-body">
                    <div className="form-group nomargin-bottom">
                      {/* <textarea placeholder="Describe..." className="form-control" id="cl_about"
                                defaultValue={description} name="aboutDescription"
                                onBlur={this.handleBlur.bind(this)}></textarea> */}
                      <MlTextEditor
                        value={editorValue}
                        handleOnChange={(value, name) => this.handleEditorBlur(value, "aboutDescription")}
                      />
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                                   id="isDescriptionPrivate"
                                   onClick={this.onClick.bind(this, "aboutDescription", "isDescriptionPrivate")}/>
                    </div>

                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-heading">Add Images</div>
                  <div className="panel-body nopadding">
                    <div className="upload-file-wrap">
                      <input type="file" id="siFileinput" name="aboutImages" className="inputfile inputfile-upload"
                             data-multiple-caption="{count} files selected" accept="image/*"
                             onChange={this.onAboutImageFileUpload.bind(this)} multiple/>
                      <label htmlFor="siFileinput">
                        <figure>
                          <i className="fa fa-upload" aria-hidden="true"></i>
                        </figure>
                      </label>
                    </div>

                    {aboutImages}

                  </div>
                </div>

              </div>
            </div>
          </div>)}
      </div>
    )
  }
};
MlServiceProviderAbout.contextTypes = {
  serviceProviderPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
