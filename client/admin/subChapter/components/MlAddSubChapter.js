/**
 * Created by vishwadeep on 18/5/17.
 */

import React from "react";
import {render} from "react-dom";
import MlActionComponent from "../../../commons/components/actions/ActionComponent";
import MlLoader from "../../../commons/components/loader/loader";
import {findChapterActionHandler} from "../actions/findChapterDetails";
import formHandler from "../../../commons/containers/MlFormHandler";
import _ from "lodash";
import {OnToggleSwitch, initalizeFloatLabel} from "../../utils/formElemUtil";
import ScrollArea from "react-scrollbar";
import {addSubChapterActionHandler} from "../actions/addSubChapter";
import MlInternalSubChapterAccess from "../components/MlInternalSubChapterAccess";
import MlMoolyaSubChapterAccess from "../components/MlMoolyaSubChapterAccess";
import Moolyaselect from "../../commons/components/MlAdminSelectWrapper";
import {multipartASyncFormHandler} from "../../../../client/commons/MlMultipartFormAction";
import CropperModal from "../../../../client/commons/components/cropperModal";
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';
import gql from "graphql-tag";
// var Select = require('react-select');
// var FontAwesome = require('react-fontawesome');

const fetchUserCategory = gql`query($id:String,$displayAllOption:Boolean){
  data:FetchUserType(communityCode:$id,displayAllOption:$displayAllOption){
  label:userTypeName
  value:_id
  }
}
`;
const userCategoryOption = { options: { variables: { id: "SPS", displayAllOption: false } } };

class MlAddSubChapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      associatedObj: {},
      moolyaSubChapterAccess: {},
      backendUser: {},
      externalUser: {},
      data: {},
      showAddPicModal: false,
      uploadingPic: false,
      userCategory: null
    };
    this.onStatusChangeActive = this.onStatusChangeActive.bind(this);
    this.onStatusChangeMap = this.onStatusChangeMap.bind(this);
    this.onStatusChangeNotify = this.onStatusChangeNotify.bind(this);
    this.onStatusBespokeWorkFlow = this.onStatusBespokeWorkFlow.bind(this);
    this.onStatusChangeBespokeRegistration = this.onStatusChangeBespokeRegistration.bind(this);
    this.findChapterDetails.bind(this);
    this.toggleAddPicModal = this.toggleAddPicModal.bind(this);
    this.onPicUpload = this.onPicUpload.bind(this);
    this.onImageFileUpload = this.onImageFileUpload.bind(this);
    this.optionsBySelectUserType = this.optionsBySelectUserType.bind(this);
    // this.findChapterActionHandler.bind(this);
    // this.updateSubChapter.bind(this)
    return this;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response && !response.success)
      toastr.error(response.result);
    else
      window.history.back()
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

  async addSubChapter() {
    var dataGet = this.state.data;
    dataGet = _.omit(dataGet, '__typename')
    dataGet.subChapterDisplayName = this.refs.subChapterDisplayName.value
    dataGet.aboutSubChapter = this.refs.aboutSubChapter.value
    dataGet.subChapterName = this.refs.subChapterName.value
    dataGet.subChapterEmail = this.refs.subChapterEmail.value
    dataGet.subChapterUrl = this.refs.subChapterUrl.value
    dataGet.subChapterImageLink = this.state.data.subChapterImageLink || ''
    dataGet.showOnMap = this.refs.showOnMap.checked
    dataGet.isActive = this.refs.isActive.checked
    dataGet.isEmailNotified = this.state.data.isEmailNotified
    dataGet.isBespokeWorkFlow = this.refs.isBespokeWorkFlow.checked
    dataGet.isBespokeRegistration = this.refs.isBespokeRegistration.checked
    dataGet.associatedObj = this.state.associatedObj
    dataGet.moolyaSubChapterAccess = this.state.moolyaSubChapterAccess;
    dataGet.userCategoryId = this.state.userCategory;

    if (dataGet.subChapterName) {
      let data = dataGet;
      for (var propName in data) {
        if (data[propName] === null || data[propName] === undefined || data[propName] === '') {
          delete data[propName];
        }
      }

      if (!_.isEmpty(data.associatedObj)) {
        let associatedObjAry = []
        _.each(data.associatedObj, function (item, say) {
          _.remove(item.subChapters, {subChapterId: null})
          let value = _.omit(item, 'type')
          associatedObjAry.push(value);
        });
        var aryFinal = []
        _.each(associatedObjAry, function (item, say) {
          if (item && item.subChapters && item.subChapters.length > 0)
            aryFinal.push(item)
        })
        data.associatedObj = aryFinal
      } else {
        data = _.omit(data, 'associatedObj')
      }

      if (_.isEmpty(data.moolyaSubChapterAccess)) {
        data = _.omit(data, 'moolyaSubChapterAccess')
      }
      const response = await addSubChapterActionHandler(this.props.clusterId, this.props.chapterId, data)
      return response;
    } else {
      toastr.error('Sub-Chapter name is mandatory')
    }
  }

  componentWillMount() {
    const resp = this.findChapterDetails();
    return resp;
  }


  componentDidUpdate() {
    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight - (90 + $('.admin_header').outerHeight(true)));
    OnToggleSwitch(true, true);
    initalizeFloatLabel();
  }

  async findChapterDetails() {
    console.log(this.props);
    const clusterId = this.props ? this.props.clusterId : ''
    const chapterId = this.props ? this.props.chapterId : ''
    if (chapterId) {
      const response = await findChapterActionHandler(clusterId, chapterId);
      this.setState({loading: false, data: response});
    } else {
      this.setState({loading: false, data: ''})
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

  async onImageFileUpload(e) {
    if (e.target && e.target.files[0].length == 0)
      return;
    let file = e.target ? e.target.files[0] : e;
    if (file) {
      let data = {moduleName: "SUBCHAPTER", actionName: "UPDATE", subChapterId: ''}
      let response = await multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this));
      return response;
    }
  }

  async onFileUploadCallBack(resp) {
    if (resp) {
      let result = JSON.parse(resp)
      if (result.success) {
        let dataDetails = this.state.data
        let cloneBackUp = _.cloneDeep(dataDetails);
        cloneBackUp['subChapterImageLink'] = result.result
        this.setState({data: cloneBackUp, uploadingPic: false, showAddPicModal: false});
      }
    }
  }

  toggleAddPicModal() {
    this.setState({
      showAddPicModal: !this.state.showAddPicModal,
    });
  }

  onPicUpload(image) {
    this.setState({
      uploadingPic: true,
    });
    this.onImageFileUpload(image);
  }

  optionsBySelectUserType(val) {
    this.setState({ userCategory: val ? val : null })
  }

  render() {
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.addSubChapter.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          let clusterId = this.props.clusterId;
          let chapterId = this.props.chapterId;
          FlowRouter.go('/admin/chapters/' + clusterId + '/' + chapterId + '/' + 'subChapters');
        }
      }
    ]
    const showLoader = this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? ( <MlLoader/>) : (

          <div className="admin_padding_wrap">
            <h2>Add Sub-Chapter Details</h2>
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
                      <input type="text" placeholder="State" className="form-control float-label"
                             defaultValue={this.state.data && this.state.data.stateName} disabled="disabled"/>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Chapter Name" ref="chapterName"
                             className="form-control float-label"
                             readOnly defaultValue={this.state.data && this.state.data.chapterName}
                             disabled="disabled"/>
                    </div>


                    <Moolyaselect multiSelect={false} placeholder="Select User Category" className="form-control float-label" valueKey={'value'}
                                  labelKey={'label'} queryType={"graphql"} query={fetchUserCategory}
                                  isDynamic={true}
                                  queryOptions={userCategoryOption}
                                  onSelect={this.optionsBySelectUserType}
                                  selectedValue={this.state.userCategory} />

                    <div className="form-group">
                      <input type="text" placeholder="Enter the ‘Registered Name’ here" ref="subChapterName"
                             className="form-control float-label mandatory"/>
                    </div>
                    <br className="brclear"/>
                    <div className="form-group">
                      <input type="text" placeholder="Display Name" ref="subChapterDisplayName"
                             className="form-control float-label"/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="subChapterUrl" placeholder="Sub-Chapter URL"
                             className="form-control float-label"/>
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
                    <div className="form-group">
                      <textarea placeholder="About" ref="aboutSubChapter"
                                className="form-control float-label"></textarea>
                    </div>
                  </form>
                </ScrollArea>
              </div>
            </div>
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
                      <div onClick={this.toggleAddPicModal} className="fileUpload mlUpload_btn">
                        Add Pic
                        { /* <input type="file" className="upload" onChange={this.onImageFileUpload.bind(this)}/> */}
                      </div>
                      <CropperModal
                        toggleShow={this.toggleAddPicModal}
                        show={this.state.showAddPicModal}
                        cropperStyle="square"
                        uploadingImage={this.state.uploadingPic}
                        handleImageUpload={this.onPicUpload}
                      />
                      <div className="previewImg ProfileImg">
                        <img
                          src={this.state.data && this.state.data.subChapterImageLink ? generateAbsolutePath(this.state.data.subChapterImageLink) : '/images/def_profile.png'} />
                      </div>
                    </div>

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
                    <MlInternalSubChapterAccess getInternalAccessStatus={this.getInternalAccessStatus.bind(this)} {...this.props}
                                                assignedDetails={this.state.associatedObj}/>

                    <div className="panel panel-default">
                      <div className="panel-heading">Moolya Subchapter Access</div>
                      <MlMoolyaSubChapterAccess getMoolyaAccessStatus={this.getMoolyaAccessStatus.bind(this)}
                                                assignedDetails={this.state.moolyaSubChapterAccess}/>
                    </div>
                  </form>
                </ScrollArea>
              </div>
            </div>
            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>
        )}
      </div>
    )
  }
}
;

export default MoolyaUpdateSubChapter = formHandler()(MlAddSubChapter);
