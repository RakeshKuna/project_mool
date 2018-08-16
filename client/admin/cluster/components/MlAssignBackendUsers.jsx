import React from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import { Scrollbars } from 'react-custom-scrollbars';
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import MlActionComponent from "../../../commons/components/actions/ActionComponent";
import formHandler from "../../../commons/containers/MlFormHandler";
import Moolyaselect from "../../commons/components/MlAdminSelectWrapper";
import MlAssignBackendUserList from "./MlAssignBackendUserList";
import MlAssignBackednUserRoles from "./MlAssignBackendUserRoles";
import {mlClusterConfig} from "../config/mlClusterConfig";
import {multipartFormHandler, multipartASyncFormHandler} from "../../../commons/MlMultipartFormAction";
import {findAdminUserDetails} from "../../../commons/findAdminUserDetails";
import {fetchAdminUserRoles} from "../../../commons/fetchAdminUserRoles";
import {findClusterTypeActionHandler} from "../actions/findCluster";
import {OnToggleSwitch} from "../../utils/formElemUtil";
import {getAdminUserContext} from '../../../commons/getAdminUserContext'
let FontAwesome = require('react-fontawesome');
let Select = require('react-select');
import MlLoader from '../../../commons/components/loader/loader'
import {client} from '../../core/apolloConnection';
import CropperModal from '../../../commons/components/cropperModal';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';


class MlAssignBackendUsers extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          loading: false,
          cluster: {},
          alsoAssignedAs: "",
          selectedBackendUser: '',
          users: [{username: '', _id: ''}],
          userDisplayName: '',
          username: '',
          showProfileModal: false,
      }

      this.addEventHandler.bind(this);
      this.assignBackendUsers.bind(this);
      this.updateSelectedBackEndUser.bind(this);
      this.filterClusterBasedRoles.bind(this);
      this.onFileUpload = this.onFileUpload.bind(this);
      this.toggleProfileModal = this.toggleProfileModal.bind(this);
      this.onUploadAvatar = this.onUploadAvatar.bind(this);
      // this.findCluster.bind(this);
      return this;
  }

  componentWillMount() {
      // const resp = this.findCluster();
      // return resp;
  }
  componentDidUpdate(){
    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight-(90+$('.admin_header').outerHeight(true)));
    OnToggleSwitch(true, true);
  }

  // async findCluster() {
  //     let clusterId = this.props.params.clusterId;
  //     const response = await findClusterTypeActionHandler(clusterId);
  //     this.setState({loading: false, cluster: response});
  // }

  enableAssignUser() {
  }

  optionsBySelectUser(index, selectedIndex) {
      this.setState({loading: true});
      this.setState({selectedBackendUser: index})
      const resp = this.findUserDetails(index);
    // const assigned = this.findRoleDetails();
  }

  getAssignedRoles(roles) {
    console.log("parent");
    this.setState({'mlroleDetails': roles})
  }

  async addEventHandler() {
      const resp = await this.assignBackendUsers();
      return resp;
  }

  async findUserDetails(userId)
  {
      const userDetails = await findAdminUserDetails(userId,client);
      if (userDetails){
          // this.setState({selectedBackendUser:userId})
          // this.setState({username:userDetails.userName})
          // this.setState({userDisplayName:userDetails.displayName})
          // this.setState({isActive:userDetails.deActive})
          this.setState({
            selectedBackendUser: userId,
            username: userDetails.userName,
            userDisplayName: userDetails.displayName,
            isActive: userDetails.deActive,
            genderType: userDetails.genderType,
            profileImage: userDetails.profileImage
          })
          let alsoAs = userDetails.alsoAssignedas;
          if(alsoAs){
            let alsoArray = _.compact(alsoAs.split(','));
            this.setState({alsoAssignedAs: alsoArray})
          }else{
            this.setState({alsoAssignedAs: []})
          }
          this.find_Cluster_Roles(userId);
          return userDetails;
      }
  }

  async find_Cluster_Roles(userId)
  {
      let roles = [];
      const userRoles = await fetchAdminUserRoles(userId,client);
      if (userRoles)
          roles = userRoles || [];
      this.setState({loading:false, user_Roles: roles, selectedBackendUser: userId, mlroleDetails: roles});
      return roles
  }

  /**
   * assign backed user with the context of data to assign
   * */
  async assignBackendUsers() {
      let userProfile = {};
    if(this.state.mlroleDetails.length == 0)
    {
      toastr.error('Please select a role');
      return;
    }

    let roles = this.filterClusterBasedRoles();
      var params = this.props.params || {}
      userProfile['clusterId'] = this.props.params.clusterId;
      userProfile['userRoles'] = roles;
      userProfile['displayName'] = this.refs.displayName.value;
      let user = {
          profile: {
              InternalUprofile: {moolyaProfile: {userProfiles: userProfile}},
              // deActive: this.refs.deActive.checked
          }
      }
    let data = {
      moduleName: "USERS",
      actionName: "UPDATE",
      userId: this.state.selectedBackendUser,
      user: user,
      clusterId: params.clusterId,
      chapterId: params.chapterId,
      subChapterId: params.subChapterId,
      communityId: params.communityId
    }
      let response = await multipartFormHandler(data, this.state.profilePic)
      return response;
  }

  async onFileUpload(imageFile){
    let user = {
      profile:{
       profileImage:" "
      }
    }
    let file=imageFile || document.getElementById("profilePic").files[0];
    if(file) {
      let data = {moduleName: "PROFILE", actionName: "UPDATE", userId: this.state.selectedBackendUser, user: user}
      let response = await multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this));
      return response;
    }
  }

  onFileUploadCallBack(output) {
    if ( output ) {
      this.setState({
        profileImage: JSON.parse(output).result,
        profilePic: null
      })
    }
  }

  /**
   * @handlerSuccess under different conditions
   * */
  handleSuccess(response) {
    console.log(response)
    if (response && response.unAuthorized)
      toastr.error(response.message);
    else if (response && response.success)
      toastr.success(response.result);
    else if (response && !response.success)
      toastr.error(response.result);
    this.resetBackendUers();
  }

  handleError(response) {
    console.log('error handle');
    console.log(response);
  }

  filterClusterBasedRoles(){
    let roles = [];
    let clusterId = this.props.params.clusterId
    let allRoles = this.state.mlroleDetails
    _.each(allRoles, function (item, key) {
      if (item.roleId && item.clusterId == clusterId) {
        roles.push(item)
      }
    })
    return roles;
  }

  updateSelectedBackEndUser(userId) {
      this.setState({loading: true});
      const resp = this.findUserDetails(userId);
  }

  resetBackendUers() {
      this.setState({loading: true});
      this.setState({profileImage:null, selectedBackendUser:'', userDisplayName:'', username:'', alsoAssignedAs:"", loading: false});
  }

  onUploadAvatar(image) {
    this.onFileUpload(image);
    this.setState({
      profilePic: image,
    });
    this.toggleProfileModal();
  }

  toggleProfileModal() {
    this.setState({
      showProfileModal: !this.state.showProfileModal,
    });
  }


  render() {
      let MlActionConfig = [
          {
            showAction: true,
            actionName: 'save',
            handler: async(event) => this.props.handler(this.assignBackendUsers.bind(this),this.handleSuccess.bind(this), this.handleError.bind(this))
          },
          {
            showAction: true,
            actionName: 'cancel',
            handler: async(event) => {
              // let pararms = FlowRouter._current.params;
              // FlowRouter.go("/admin/clusters/"+
              //   pararms.clusterId+"/clusterDetails");
              let pararms = FlowRouter._current.params;
              let path = FlowRouter._current.path;
              if (path.indexOf("clusters") != -1) {
                FlowRouter.go("/admin/clusters/"+
                  pararms.clusterId+"/clusterDetails");
              } else {
                FlowRouter.go("/admin/chapters/"+
                  pararms.clusterId+"/"+pararms.chapterId+"/"+
                  pararms.subChapterId+"/"+pararms.subChapterName+"/subChapterDetails");
              }
            }
          }
      ]
      let loggedInUser = getAdminUserContext();
      let that = this;
      let queryOptions = {options: {variables: {
        clusterId: that.props.params.clusterId,
        chapterId: that.props.params.chapterId?that.props.params.chapterId:"",
        subChapterId: that.props.params.subChapterId?that.props.params.subChapterId:"",
        communityId: that.props.params.communityId?that.props.params.communityId:""
      }}};
      let query = gql`query($clusterId:String, $chapterId:String, $subChapterId:String, $communityId:String){data:fetchUsersByClusterDepSubDep(clusterId:$clusterId, chapterId:$chapterId, subChapterId:$subChapterId, communityId:$communityId){label:username,value:_id}}`;
      let userid = this.state.selectedBackendUser || "";
      let userDisplayName = this.state.userDisplayName || "";
      let username = this.state.username || "";
      let deActive = that.state.deActive;
      let contextHeader =  "";
      if(that.props.params.communityId){
        contextHeader = "Community"
      } else if (that.props.params.chapterId && that.props.params.subChapterId){
        contextHeader = "Sub Chapter"
      } else{
        contextHeader = "Cluster"
      }

      const alsoUser = this.state.alsoAssignedAs && this.state.alsoAssignedAs.length > 0 ? this.state.alsoAssignedAs : [" "];
      const alsoAssignList = alsoUser.map(function (userAlso, id) {
        return (
          <li key={id}>
            <span className="form-control float-label">{userAlso}</span>
          </li>
        )
      });

      const showLoader = this.state.loading;
      let gImage = this.state.genderType==='female'?"/images/female.jpg":"/images/def_profile.png";
      let genderImage = (!this.state.profileImage || this.state.profileImage == " "?gImage:generateAbsolutePath(this.state.profileImage))
    console.log(this.state.profilePic);
    var urlCreator = window.URL || window.webkitURL;
    let imageUrl = '';
    if (this.state.profilePic)
      imageUrl = urlCreator.createObjectURL(this.state.profilePic);
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? ( <MlLoader/>) : (
          <div className="admin_padding_wrap">
            <h2>Assign Backend User to {contextHeader}</h2>

            <div className="col-md-6 nopadding-left">
              <div className="row">
                <div className="left_wrap left_user_blocks">
                  <Scrollbars speed={0.8} className="left_wrap">
                    <div className="col-lg-4 col-md-6 col-sm-6" onClick={this.resetBackendUers.bind(that)}>
                      <div className="list_block provider_block">
                        <div className="cluster_status assign_cl">{/*<span className="ml ml-assign"></span>*/}</div>
                        <div className="provider_mask"><img src="/images/funder_bg.png"/> <img className="user_pic"
                                                                                               src={genderImage}/>
                        </div>
                        <h3>Assign <br/> Backend Users</h3>
                      </div>
                    </div>
                    {/*{that.state.cluster.isActive ? */}
                      <MlAssignBackendUserList clusterId={that.props.params.clusterId} chapterId={that.props.params.chapterId}
                      subChapterId={that.props.params.subChapterId} communityId={that.props.params.communityId} updateSelectedBackEndUser={this.updateSelectedBackEndUser.bind(this)}/>
                      {/*:*/}
                      {/*<div></div>}*/}
                  </Scrollbars>
                </div>
              </div>
            </div>
            <div className="col-md-6 nopadding-right">
              <div className="left_wrap">
                <Scrollbars speed={0.8} className="left_wrap">

                  {/*<h2>Details</h2>*/}
                  <form>
                    <div className="form-group">
                      <div className="fileUpload mlUpload_btn">
                        <span onClick={this.toggleProfileModal}>Profile Pic</span>

                      </div>
                      <div className="previewImg ProfileImg">
                        <img src={this.state.profilePic ? generateAbsolutePath(imageUrl) : genderImage}/>
                      </div>
                      <CropperModal
                        handleImageUpload={this.onUploadAvatar}
                        uploadingImage={false}
                        show={this.state.showProfileModal}
                        toggleShow={this.toggleProfileModal}
                        cropperStyle="circle"
                      />
                    </div>
                    <br className="brclear"/>
                    {/*{that.state.cluster.isActive ?*/}
                      <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                    labelKey={'label'} queryType={"graphql"} query={query} queryOptions={queryOptions}
                                    isDynamic={true} onSelect={that.optionsBySelectUser.bind(that)}
                                    selectedValue={this.state.selectedBackendUser}/>
                      {/*:*/}
                      {/*<Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}*/}
                                    {/*labelKey={'label'} queryType={"graphql"}/>}*/}
                    {/*<Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={query}  queryOptions={queryOptions}  isDynamic={true} onSelect={that.optionsBySelectUser.bind(that)} selectedValue={this.state.selectedBackendUser}/>*/}
                    <div className="form-group">
                      {/*<input type="text" id="AssignedAs" placeholder="Also Assigned As"*/}
                      <b>Also Assigned As</b>
                      <ul>
                        {alsoAssignList}
                      </ul>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Display Name" ref="displayName" readOnly="true" defaultValue={userDisplayName}
                             className="form-control float-label" id="dName"/>
                    </div>
                    <div className="form-group">
                      <input type="text" readOnly="true" placeholder="User Name" className="form-control float-label"
                             id="userName" ref="userName" defaultValue={username}/>
                    </div>

                    {userid ? (<MlAssignBackednUserRoles userId={userid} clusterId={that.props.params.clusterId} chapterId={that.props.params.chapterId} subChapterId={that.props.params.subChapterId} communityId={that.props.params.communityId}
                                                         assignedRoles={this.state.user_Roles}
                                                         isActive = {this.state.isActive}
                                                         getAssignedRoles={this.getAssignedRoles.bind(this)}/>) :
                      <div></div>}
                    <div className="form-group switch_wrap inline_switch">
                      <label className="">De-Activate User</label>
                      <label className="switch">
                        <input type="checkbox" checked={this.state.isActive} disabled="disabled"/>
                        {/*{(loggedInUser.hierarchyCode=="PLATFORM")?<input type="checkbox" ref="deActive" checked={deActive}/>:<input type="checkbox" ref="deActive" checked={deActive} disabled="disabled"/>}*/}
                        <div className="slider"></div>
                      </label>
                    </div>
                  </form>

                </Scrollbars>
              </div>
            </div>
            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>
          )}
      </div>
    )
  }
}

export default MlAssignBackendUsers = formHandler()(MlAssignBackendUsers);
