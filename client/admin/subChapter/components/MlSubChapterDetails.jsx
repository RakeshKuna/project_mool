import React, { Component } from "react";
import _ from "lodash";
import ScrollArea from "react-scrollbar";
import gql from "graphql-tag";
import MlActionComponent from "../../../commons/components/actions/ActionComponent";
import MlLoader from "../../../commons/components/loader/loader";
import {findSubChapterActionHandler} from "../actions/findSubChapter";
import {updateSubChapterActionHandler} from "../actions/updateSubChapter";
import formHandler from "../../../commons/containers/MlFormHandler";
import {OnToggleSwitch, initalizeFloatLabel} from "../../utils/formElemUtil";
import {multipartASyncFormHandler} from "../../../../client/commons/MlMultipartFormAction";
import MlInternalSubChapterAccess from "../components/MlInternalSubChapterAccess";
import MlMoolyaSubChapterAccess from "../components/MlMoolyaSubChapterAccess";
import CropperModal from '../../../commons/components/cropperModal';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';
import Moolyaselect from "../../commons/components/MlAdminSelectWrapper";
var Select = require('react-select');
var FontAwesome = require('react-fontawesome');


const fetchUserCategory = gql`query($id:String,$displayAllOption:Boolean){
  data:FetchUserType(communityCode:$id,displayAllOption:$displayAllOption){
  label:userTypeName
  value:_id
  }
}
`;
const userCategoryOption = { options: { variables: { id: "SPS", displayAllOption: false } } };

class MlSubChapterDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      internalSubChapterAccess: {},
      moolyaSubChapterAccess: {},
      backendUser: {},
      externalUser: {},
      data: {},
      showImageUploadModal: false,
      uploadingImage: false,
    };
    this.onStatusChangeActive = this.onStatusChangeActive.bind(this);
    this.onStatusChangeMap = this.onStatusChangeMap.bind(this);
    this.onStatusChangeNotify = this.onStatusChangeNotify.bind(this);
    this.onStatusBespokeWorkFlow = this.onStatusBespokeWorkFlow.bind(this);
    this.onStatusChangeBespokeRegistration = this.onStatusChangeBespokeRegistration.bind(this);
    this.findSubChapter.bind(this);
    this.updateSubChapter.bind(this)
    this.anchorRedirect = this.anchorRedirect.bind(this);
    this.toggleImageUpload = this.toggleImageUpload.bind(this);
    this.onImageFileUpload = this.onImageFileUpload.bind(this);
    this.optionsBySelectUserType = this.optionsBySelectUserType.bind(this);
    return this;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response && response.success)
      window.history.back()
    else
      toastr.error(response.result);
  }

  onStatusChangeActive(e) {
    let updatedData = this.state.data || {};
    updatedData = _.omit(updatedData, ["isActive"]);
    if (e.currentTarget.checked) {
      var z = _.extend(updatedData, {isActive: true});
      this.setState({data: z, loading: false});
    } else {
      var z = _.extend(updatedData, {isActive: false});
      this.setState({data: z, loading: false});
    }
  }

  onStatusChangeMap(e) {
    let updatedData = this.state.data || {};
    updatedData = _.omit(updatedData, ["showOnMap"]);
    if (e.currentTarget.checked) {
      var z = _.extend(updatedData, {showOnMap: true});
      this.setState({data: z, loading: false});
    } else {
      var z = _.extend(updatedData, {showOnMap: false});
      this.setState({data: z, loading: false});
    }
  }

  onStatusChangeNotify(e) {
    let updatedData = this.state.data || {};
    updatedData = _.omit(updatedData, ["isEmailNotified"]);
    if (e.currentTarget.checked) {
      var z = _.extend(updatedData, {isEmailNotified: true});
      this.setState({data: z, loading: false});
    } else {
      var z = _.extend(updatedData, {isEmailNotified: false});
      this.setState({data: z, loading: false});
    }
  }

  onStatusChangeBespokeRegistration(e) {
    let updatedData = this.state.data || {};
    updatedData = _.omit(updatedData, ["isBespokeRegistration"]);
    if (e.currentTarget.checked) {
      var z = _.extend(updatedData, {isBespokeRegistration: true});
      this.setState({data: z, loading: false});
    } else {
      var z = _.extend(updatedData, {isBespokeRegistration: false});
      this.setState({data: z, loading: false});
    }
  }

  onStatusBespokeWorkFlow(e) {
    let updatedData = this.state.data || {};
    updatedData = _.omit(updatedData, ["isBespokeWorkFlow"]);
    if (e.currentTarget.checked) {
      var z = _.extend(updatedData, {isBespokeWorkFlow: true});
      this.setState({data: z, loading: false});
    } else {
      var z = _.extend(updatedData, {isBespokeWorkFlow: false});
      this.setState({data: z, loading: false});
    }
  }

  /**
   * creating Object to be saved
   * @Note condition based moolya and non-moolya subchapter
   * */
  async updateSubChapter() {
    let subChapterDetailsExtend = {}
    let basicObj = {
      subChapterId: this.refs.id.value,
      subChapterDisplayName: this.refs.subChapterDisplayName.value,
      aboutSubChapter: this.refs.aboutSubChapter.value,
      subChapterEmail: this.refs.subChapterEmail.value,
      isEmailNotified: this.state.data.isEmailNotified,
      showOnMap: this.refs.showOnMap.checked,
      isActive: this.refs.isActive.checked
    }
    if (!this.state.data.isDefaultSubChapter) {
      let chapterId = this.props.chapterId
      let associatedObjAry = []
      _.each(this.state.associatedObj, function (item, say) {
        _.remove(item.subChapters, {subChapterId: null})
        item.subChapters.push({subChapterId: basicObj.subChapterId, chapterId: chapterId})
        let value = _.omit(item, ['disabled', 'type'])
        associatedObjAry.push(value);
      })

      var aryFinal = []
      _.each(associatedObjAry, function (item, say) {
        if (item && item.subChapters && item.subChapters.length > 1)
          aryFinal.push(item)
      })
      this.state.associatedObj = aryFinal
      // this.state.associatedObj = associatedObjAry
      subChapterDetailsExtend = {
        subChapterUrl: this.refs.subChapterUrl.value,
        isBespokeWorkFlow: this.refs.isBespokeWorkFlow.checked,
        isBespokeRegistration: this.refs.isBespokeRegistration.checked,
        associatedObj: this.state.associatedObj,
        moolyaSubChapterAccess: this.state.moolyaSubChapterAccess,
        userCategoryId: this.state.data.userCategoryId
      }
    }
    let detailsObj = _.extend(basicObj, subChapterDetailsExtend);
    const response = await updateSubChapterActionHandler(this.props.clusterId, this.props.chapterId, detailsObj)
    return response;
  }

  componentWillMount() {
    const resp = this.findSubChapter();
    return resp;
  }

  componentDidUpdate() {
    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight - (90 + $('.admin_header').outerHeight(true)));
    OnToggleSwitch(true, true);
    initalizeFloatLabel();
  }

  async findSubChapter() {
    let clusterId = this.props.clusterId
    let chapterId = this.props.chapterId
    let subChapterId = this.props.params;
    const response = await findSubChapterActionHandler(clusterId, chapterId, subChapterId);
    if (response && !response.isDefaultSubChapter) {
      var objNonMoolya = response.associatedObj || {}
      var objMoolya = response.moolyaSubChapterAccess || {}
      this.setState({data: response, associatedObj: objNonMoolya, moolyaSubChapterAccess: objMoolya, loading: false});
    } else {
      this.setState({loading: false, data: response});
    }
  }

  getInternalAccessStatus(details) {
    this.setState({associatedObj: details})
  }

  getMoolyaAccessStatus(details) {
    let moolyaSubChapterAccess = {
      externalUser: details.externalUser ? details.externalUser : this.state.moolyaSubChapterAccess.externalUser
    }
    this.setState({moolyaSubChapterAccess: moolyaSubChapterAccess})
  }

  anchorRedirect() {
    console.log('info hit', this.props)
    var basePath = 'chapters'
    var locationIndex = window.location.pathname.indexOf('chapters')
    if (locationIndex < 0)
      basePath = "clusters"
    FlowRouter.go('/admin/' + '/' + basePath + '/' + this.props.clusterId + '/' + this.props.chapterId + '/' + this.props.params + '/' + this.props.subChapterName + '/' + "anchorDetails")
  }

  async onImageFileUpload(file) {

    this.setState({
      uploadingImage: true,
    });

    if (file) {
      const data = {moduleName: "SUBCHAPTER", actionName: "UPDATE", subChapterId: this.state.data.id}
      const response = await multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this));
      return response;
    }
  }

  async onFileUploadCallBack(resp) {
    if (resp) {
      let result = JSON.parse(resp)
      if (result.success) {
        let subChapterId = this.props.params;
        let clusterId = this.props.clusterId
        let chapterId = this.props.chapterId
        const response = await findSubChapterActionHandler(clusterId, chapterId, subChapterId);
        let dataDetails = this.state.data
        let cloneBackUp = _.cloneDeep(dataDetails);
        cloneBackUp['subChapterImageLink'] = response['subChapterImageLink']
        this.setState({data: cloneBackUp, uploadingImage: false, showImageUploadModal: false});
      }
    }
    this.setState({
      uploadingImage: false,
    });
  }

  toggleImageUpload() {
    this.setState({
      showImageUploadModal: !this.state.showImageUploadModal,
    });
  }

  /**
   * @usage for non-moolya sub-chapter only
   * @param {*userCategory} val 
   */
  optionsBySelectUserType(val) {
    let data = this.state.data;
    data["userCategoryId"] = val ? val : null
    this.setState({ data })
  }

  render() {
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateSubChapter.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          let clusterId = FlowRouter.getParam('clusterId');
          let chapterId = FlowRouter.getParam('chapterId');
          FlowRouter.go('/admin/chapters/' + clusterId + '/' + chapterId + '/' + 'subChapters');

        }
      }
    ]
    // var subChapterQuery = gql`query($subChapterId:String){data:fetchSubChaptersSelectNonMoolya(subChapterId:$subChapterId) { value:_id, label:subChapterName}}`;
    // var subChapterOption = {options: {variables: {subChapterId: this.props.params}}};
    const { userCategoryId } = this.state.data;
    const showLoader = this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? ( <MlLoader/>) : (

          <div className="admin_padding_wrap">
            <h2>Sub-Chapter Details</h2>
                  <img src="/images/anchor.png" title="Add SC contact dtls / View Anchor dtls" className="hanging_img"  onClick={this.anchorRedirect} />
            <div className="col-md-6 nopadding-left">
              <div className="form_bg left_wrap">
                <ScrollArea
                  speed={0.8}
                  className="left_wrap"
                  smoothScrollling={true}
                  default={true}
                >
                  <form>
                    <div className="form-group ">
                      <input type="text" ref="id" defaultValue={this.state.data && this.state.data.id} hidden="true"/>
                      <input type="text" placeholder="Cluster Name" ref="clusterName" readOnly
                             defaultValue={this.state.data && this.state.data.clusterName}
                             className="form-control float-label" disabled="disabled"/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="state" placeholder="State" className="form-control float-label"
                             defaultValue={this.state.data && this.state.data.stateName} readOnly="true"/>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Chapter Name" ref="chapterName"
                             className="form-control float-label"
                             readOnly defaultValue={this.state.data && this.state.data.chapterName}
                             disabled="disabled"/>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Enter the ‘Registered Name" ref="subChapterName" readOnly
                             className="form-control float-label"
                             defaultValue={this.state.data && this.state.data.subChapterName} disabled="disabled"/>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Display Name" ref="subChapterDisplayName"
                             className="form-control float-label"
                             defaultValue={this.state.data && this.state.data.subChapterDisplayName}/>
                    </div>
                    {(this.state && this.state.data && this.state.data.isDefaultSubChapter) ? <div></div> : <div>
                      <Moolyaselect multiSelect={false} placeholder="Select User Category" className="form-control float-label" valueKey={'value'}
                                  labelKey={'label'} queryType={"graphql"} query={fetchUserCategory}
                                  isDynamic={true}
                                  queryOptions={userCategoryOption}
                                  onSelect={this.optionsBySelectUserType}
                                  selectedValue={userCategoryId} />

                      <div className="form-group">
                        <input type="text" ref="subChapterEmail" placeholder="Sub-Chapter Email Id"
                               defaultValue={this.state.data && this.state.data.subChapterEmail}
                               className="form-control float-label"/>
                        <div className="email_notify">
                          <div className="input_types">
                            <input ref="isEmailNotified" type="checkbox" name="checkbox"
                                   checked={this.state.data.isEmailNotified}
                                   onChange={this.onStatusChangeNotify.bind(this)}/>
                            <label htmlFor="checkbox1"><span> </span>Notify</label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <input type="text" ref="subChapterUrl" placeholder="Sub-Chapter URL"
                               defaultValue={this.state.data && this.state.data.subChapterUrl}
                               className="form-control float-label"/>
                      </div>
                    </div>
                    }
                    <div className="form-group">
                  <textarea placeholder="About" ref="aboutSubChapter"
                            defaultValue={this.state.data && this.state.data.aboutSubChapter}
                            className="form-control float-label">
                  </textarea>
                    </div>

                  </form>
                </ScrollArea>
              </div>
            </div>
            {(this.state.data.isDefaultSubChapter) ?
              <div className="col-md-6 nopadding-right">
                <div className="form_bg left_wrap">
                  <ScrollArea
                    speed={0.8}
                    className="left_wrap"
                    smoothScrollling={true}
                    default={true}
                  >
                    <form>
                      <div className="form-group">
                        <div onClick={this.toggleImageUpload} className="fileUpload mlUpload_btn">
                          <span>Upload Pic</span>
                        </div>
                        <div className="previewImg ProfileImg">
                          <img
                            src={this.state.data && this.state.data.subChapterImageLink ? generateAbsolutePath(this.state.data.subChapterImageLink) : '/images/def_profile.png'}/>
                        </div>
                      </div>
                      <CropperModal handleImageUpload={this.onImageFileUpload} toggleShow={this.toggleImageUpload}
                                    show={this.state.showImageUploadModal} uploadingImage={this.state.uploadingImage}
                                    cropperStyle={"circle"}/>
                      <br className="brclear"/>
                      <div className="form-group">
                        <input type="text" ref="state" placeholder="State" className="form-control float-label"
                               defaultValue={this.state.data && this.state.data.stateName} readOnly="true"/>
                      </div>
                      <div className="form-group">
                        <input type="text" ref="subChapterEmail" placeholder="Sub-Chapter Email Id"
                               defaultValue={this.state.data && this.state.data.subChapterEmail}
                               className="form-control float-label"/>
                        <div className="email_notify">
                          <div className="input_types">
                            <input ref="isEmailNotified" type="checkbox" name="checkbox"
                                   checked={this.state.data.isEmailNotified}
                                   onChange={this.onStatusChangeNotify.bind(this)}/>
                            <label htmlFor="checkbox1"><span> </span>Notify</label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group switch_wrap inline_switch">
                        <label>Show on Map</label>
                        <label className="switch">
                          <input type="checkbox" ref="showOnMap" checked={this.state.data && this.state.data.showOnMap}
                                 onChange={this.onStatusChangeMap.bind(this)}/>
                          <div className="slider"></div>
                        </label>
                      </div>
                      <div className="form-group switch_wrap inline_switch">
                        <label>Status</label>
                        <label className="switch">
                          <input type="checkbox" ref="isActive" checked={this.state.data && this.state.data.isActive}
                                 onChange={this.onStatusChangeActive.bind(this)}/>
                          <div className="slider"></div>
                        </label>
                      </div>
                    </form>
                  </ScrollArea>
                </div>
              </div>
              :
              <div className="col-md-6 nopadding-right">
                <div className="form_bg left_wrap">
                  <ScrollArea
                    speed={0.8}
                    className="left_wrap"
                    smoothScrollling={true}
                    default={true}
                  >
                    <form>
                      <div className="form-group">
                        <div onClick={this.toggleImageUpload} className="fileUpload mlUpload_btn">
                          <span>Upload Pic</span>
                        </div>
                        <div className="previewImg ProfileImg">
                          <img
                            src={this.state.data && this.state.data.subChapterImageLink ? generateAbsolutePath(this.state.data.subChapterImageLink) : '/images/def_profile.png'}/>
                        </div>
                      </div>
                      <CropperModal handleImageUpload={this.onImageFileUpload} toggleShow={this.toggleImageUpload}
                                    show={this.state.showImageUploadModal} uploadingImage={this.state.uploadingImage}
                                    cropperStyle={"circle"}/>
                      <br className="brclear"/>

                      <div className="panel panel-default">
                        <div className="panel-body">
                          <div className="col-md-6">
                            <div className="form-group switch_wrap inline_switch">
                              <label className="">Status</label>
                              <label className="switch">
                                <input type="checkbox" ref="isActive"
                                       checked={this.state.data && this.state.data.isActive}
                                       onChange={this.onStatusChangeActive.bind(this)}/>
                                <div className="slider"></div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group switch_wrap inline_switch">
                              <label className="">Show on Map</label>
                              <label className="switch">
                                <input type="checkbox" ref="showOnMap"
                                       checked={this.state.data && this.state.data.showOnMap}
                                       onChange={this.onStatusChangeMap.bind(this)}/>
                                <div className="slider"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="panel panel-default">
                        <div className="panel-body">
                          <div className="col-md-6">
                            <div className="form-group">
                              <div className="input_types">
                                <input type="checkbox" ref="isBespokeRegistration"
                                       checked={this.state.data && this.state.data.isBespokeRegistration}
                                       onChange={this.onStatusChangeBespokeRegistration.bind(this)}/>
                                <label htmlFor="bespoke_reg"><span></span>Bespoke Registration</label></div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <div className="input_types">
                                <input type="checkbox" ref="isBespokeWorkFlow"
                                       checked={this.state.data && this.state.data.isBespokeWorkFlow}
                                       onChange={this.onStatusBespokeWorkFlow.bind(this)}/>
                                <label htmlFor="bespoke_workflow"><span></span>Bespoke Workflow</label></div>
                            </div>
                          </div>
                        </div>
                      </div>                    
                        <MlInternalSubChapterAccess getInternalAccessStatus={this.getInternalAccessStatus.bind(this)}
                                                    curSubChapter = {this.props.params}
                                                    {...this.props}
                                                    assignedDetails={this.state.associatedObj}/>
                      <div className="panel panel-default">
                        <div className="panel-heading">Moolya Subchapter Access</div>
                        <MlMoolyaSubChapterAccess getMoolyaAccessStatus={this.getMoolyaAccessStatus.bind(this)}
                                                  assignedDetails={this.state.moolyaSubChapterAccess}/>
                      </div>
                    </form>
                  </ScrollArea>
                </div>
              </div>}
            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>
        )}
      </div>
    )
  }
}
;

export default MoolyaUpdateSubChapter = formHandler()(MlSubChapterDetails);
