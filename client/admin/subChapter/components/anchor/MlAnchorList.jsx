/**
 * Created by vishwadeep on 12/9/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import ScrollArea from 'react-scrollbar';
var FontAwesome = require('react-fontawesome');
import omitDeep from 'omit-deep-lodash';
import { findAnchorUserActionHandler } from '../../actions/fetchAnchorUsers'
import { findBackendUserActionHandler } from '../../../transaction/internalRequests/actions/findUserAction'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper';
import CDNImage from '../../../../commons/components/CDNImage/CDNImage';
import MlAnchorUserGrid from '../../../../commons/components/anchorInfo/MlAnchorUserGrid';
import CropperModal from '../../../../commons/components/cropperModal';
import {multipartASyncFormHandler} from '../../../../commons/MlMultipartFormAction';
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath';

//todo:// floatlabel initialize
export default class MlAnchorList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      userData: {
        profile: {
          internalProfile: {
            moolyaProfile: {
              socialLinksInfo: [],
            }
          }
        },
        socialLinksInfo: [],
      },
      socialLinkForm: {
        socialLinkType: '',
        socialLinkTypeName: '',
        socialLinkUrl: '',
      },
      selectedSocialTab: 0,
      showUploadPicModal: false,
      uploadingPic: false,
    };
    this.selectedUser = null;
    this.getAnchorUserDetails = this.getAnchorUserDetails.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.updateProfileData = this.updateProfileData.bind(this);
    this.updateInternalUprofileData = this.updateInternalUprofileData.bind(this);
    this.renderSocialForm = this.renderSocialForm.bind(this);
    this.renderAvailableSocialForm = this.renderAvailableSocialForm.bind(this);
    this.removeSocialLink = this.removeSocialLink.bind(this);
    this.onSocialFormChange = this.onSocialFormChange.bind(this);
    this.onSaveSocialLink = this.onSaveSocialLink.bind(this);
    this.onChangeSocialLinkTab = this.onChangeSocialLinkTab.bind(this);
    this.onClearSocialLink = this.onClearSocialLink.bind(this);
    this.onToggleUploadPic = this.onToggleUploadPic.bind(this);
    this.onUploadPic = this.onUploadPic.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    return this
  }
  componentDidMount(){
    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight-(160+$('.admin_header').outerHeight(true)));
  }

  componentWillMount() {
    const resp = this.getAnchorUsers()
    this.props.setModule('users');
    return resp
  }

  componentWillReceiveProps(newProps){
    if(newProps && newProps.isUserUpdated){
      const resp = this.getAnchorUsers()
      return resp
    }
  }

  handleUserClick(id, event) {
    const resp = this.getAnchorUserDetails(id);
    this.setState({
      socialLinkForm: {
        socialLinkType: '',
        socialLinkTypeName: '',
        socialLinkUrl: '',
      },
      selectedSocialTab: 0,
    });
    this.selectedUser = id;
    return resp;
  }

  updateInternalUprofileData(field, value) {
    const state = JSON.parse(JSON.stringify(this.state));
    if (!state.userData) state.userData = {};
    if (!state.userData.profile) state.userData.profile = {};
    if (!state.userData.profile.InternalUprofile) state.userData.profile.InternalUprofile = {};
    if (!state.userData.profile.InternalUprofile.moolyaProfile) {
      state.userData.profile.InternalUprofile.moolyaProfile = {};
    }
    state.userData.profile.InternalUprofile.moolyaProfile[field] = value;
    this.setState(state, () => {
      this.sendDatatoParent(this.state.userData);
    });
  }

  updateProfileData(field, value) {
    const state = JSON.parse(JSON.stringify(this.state));
    if (!state.userData) state.userData = {};
    if (!state.userData.profile) state.userData.profile = {};
    state.userData.profile[field] = value;
    this.setState(state, () => {
      this.sendDatatoParent(this.state.userData);
    });
  }

  deepClone(obj) {
    if (!obj || obj === true) { // this also handles boolean as true and false
      return obj;
    }
    const objType = typeof (obj);
    if (objType === 'number' || objType === 'string') { // add your immutables here
      return obj;
    }
    let result = Array.isArray(obj) ? [] : !obj.constructor ? {} : new obj.constructor();
    if (obj instanceof Map) {
      for (let key of obj.keys())
        result.set(key, this.deepClone(obj.get(key)));
    }
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && key !== '__typename'
      && key !== 'clusterName' && key !== 'chapterName'
     && key !== 'communityName' && key !== 'subChapterName')
        result[key] = this.deepClone(obj[key]);
    }
    return result;
  }

  // filterObject(obj, key) {
  //   for (var i in obj) {
  //     if (!obj.hasOwnProperty(i)) continue;
  //     if (typeof obj[i] == 'object') {
  //       filterObject(obj[i], key);
  //     } else if (i == key) {
  //       delete key;
  //     }
  //   }
  //   return obj;
  // }

  async getAnchorUserDetails(id) {
    var response = await findBackendUserActionHandler(id);
    response = this.deepClone(response);
    this.setState({ userData: omitDeep(response, '__typename') });
    return response;
  }

  async getAnchorUsers() {
    var data = this.props.data
    var response = await findAnchorUserActionHandler(data)
    const userDetails = response.userDetails && response.userDetails.map && response.userDetails.map((d) => omitDeep(d, '__typename'));
    this.setState({ data: userDetails })
    return response
  }

  sendDatatoParent(data) {
    this.props.getUserDetails(data)
  }

  removeSocialLink(index) {
    let userData = this.state.userData;
    userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo.splice(index, 1);
    this.setState({
      userData,
      selectedSocialTab: 0,
      socialLinkForm: {
        socialLinkType: '',
        socialLinkTypeName: '',
        socialLinkUrl: '',
      },
    }, () => this.sendDatatoParent(this.state.userData));
  }

  onChangeSocialLinkTab(index, dataIndex) {
    let socialLinkForm;
    const { userData } = this.state;
    if (userData && userData.profile && userData.profile.InternalUprofile && userData.profile.InternalUprofile.moolyaProfile && userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo) {
      socialLinkForm = userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo[dataIndex] || {};
    }
    this.setState({ selectedSocialTab: index, socialLinkForm })
  }

  renderAvailableSocialForm(socialLinks) {
    const linkTabs = socialLinks.map((link, i) => {
      const { socialLinkTypeName, socialLinkType, socialLinkUrl } = link;
      return (
        <li onClick={() => this.onChangeSocialLinkTab(i+1, i)} className={i + 1 === this.state.selectedSocialTab ? "active": ""} key={i}>
          <a>{socialLinkTypeName}&nbsp;<b><FontAwesome name='minus-square' onClick={(evt) => { evt.stopPropagation(); this.removeSocialLink(i) }} /></b></a>
        </li>
      )
    });
    let length = 1;
    const { userData } = this.state;
    if (userData && userData.profile && userData.profile.InternalUprofile && userData.profile.InternalUprofile.moolyaProfile && userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo) {
      length = userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo.length || 1;
    }
    addSocialLinkTab = (
      <li onClick={() => this.onChangeSocialLinkTab(0, length)} className={this.state.selectedSocialTab === 0 ? "active": ""}>
        <a> <FontAwesome name='plus-square' /> Add Social Links </a>
      </li>
    )
    return [addSocialLinkTab, ...linkTabs];
  }

  onSaveSocialLink() {
    const selectedIndex = this.state.selectedSocialTab;
    const userData = this.state.userData;
    if (!this.state.socialLinkForm.socialLinkUrl || !this.state.socialLinkForm.socialLinkType) {
      return null;
    }
    if (selectedIndex) {
      if (userData && userData.profile && userData.profile.InternalUprofile && userData.profile.InternalUprofile.moolyaProfile) {
        if (userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo) {
          userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo[selectedIndex - 1] = this.state.socialLinkForm;
        } else {
          userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo = [this.state.socialLinkForm];
        }
      }
    } else {
      if (userData && userData.profile && userData.profile.InternalUprofile && userData.profile.InternalUprofile.moolyaProfile) {
        if (userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo && userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo.length) {
          userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo.push(this.state.socialLinkForm);
        } else {
          userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo = [this.state.socialLinkForm];
        }
      }
    }
    this.setState({
      userData,
      socialLinkForm: selectedIndex ? this.state.socialLinkForm : { },
    }, () => this.sendDatatoParent(this.state.userData));
  }

  onSocialFormChange(key, value, label) {
    let socialLinkForm = { ...this.state.socialLinkForm };
    socialLinkForm[key] = value;
    if (key === 'socialLinkType' && label )
      if(label) {
        socialLinkForm.socialLinkTypeName = label;
      }
    let currentInfo = [];
    const { userData } = this.state;
    if (userData && userData.profile && userData.profile.InternalUprofile && userData.profile.InternalUprofile.moolyaProfile) {
      currentInfo = this.state.userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo || [];
    }
    if (currentInfo && currentInfo.length) {
      for (let i=0; i<currentInfo.length; i++) {
        if (currentInfo[i] && currentInfo[i].socialLinkType === value) {
          this.setState({
            selectedSocialTab: i+1,
          });
          socialLinkForm = userData && userData.profile && userData.profile.InternalUprofile && userData.profile.InternalUprofile.moolyaProfile && userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo ? userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo[i] : {};
          break;
        }
      }
    }
    this.setState({
      socialLinkForm,
    });
  }

  onClearSocialLink() {
    if (this.state.selectedSocialTab !== 0) {
      const socialLinkForm = this.state.socialLinkForm;
      socialLinkForm.socialLinkUrl = ''
      return this.setState({
        socialLinkForm,
      })
    }
    this.setState({
      socialLinkForm: {
        socialLinkType: '',
        socialLinkTypeName: '',
        socialLinkUrl: '',
      },
    });
  }

  renderSocialForm(){
    const socialLinkTypeQuery=gql`query($type:String,$hierarchyRefId:String){
      data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
        label
        value
      }
    }`;
    const socialLinkTypeOption={options: { variables: {type : "SOCIALLINKS", hierarchyRefId: this.props.data.clusterId } } };
    return (
      <div className="tab-content clearfix">
        <div className="tab-pane active">
          <div className="form-group">
            <Moolyaselect multiSelect={false} ref={'socialLinkType'}
              placeholder="Select Social Link" disabled={this.state.selectedSocialTab !== 0}
              className="form-control float-label" onSelect={(value, cb, socialOption) => {this.onSocialFormChange('socialLinkType', value, socialOption ? socialOption.label : '');} }
              valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={socialLinkTypeQuery}
              queryOptions={socialLinkTypeOption} selectedValue={this.state.socialLinkForm.socialLinkType}
              isDynamic={true} />
          </div>
          <div className="form-group">
            <input type="text" value={this.state.socialLinkForm.socialLinkUrl || ''} onChange={(evt) => this.onSocialFormChange('socialLinkUrl', evt.target.value)} placeholder="Enter URL" className="form-control float-label"/>
          </div>
          <div className="ml_icon_btn">
            <a onClick={this.onSaveSocialLink}
               className="save_btn">
              <span className="ml ml-save"></span>
            </a>
            <a className="cancel_btn" onClick={this.onClearSocialLink}><span className="ml ml-delete"></span></a>
          </div>
          {/*<div className="form-group">*/}
            {/*<button onClick={this.onSaveSocialLink} type="button">Save</button>*/}
            {/*<button type="button" onClick={this.onClearSocialLink}>Clear</button>*/}
          {/*</div>*/}
        </div>
      </div>
    );
  }

  renderSocialLinkForm(socialLinks) {
    return (
      <div className="ml_tabs">
        <ul className="nav nav-pills">
          {this.renderAvailableSocialForm(socialLinks)}
        </ul>
        {this.renderSocialForm()}
      </div>
    );
  }

  onToggleUploadPic() {
    this.setState({
      showUploadPicModal: !this.state.showUploadPicModal
    })
  }

  async onFileUpload(imageFile){
    let user = {
      profile: {
        InternalUprofile: {moolyaProfile: {profileImage:" " }}
      }
    }
    let file=imageFile || document.getElementById("profilePic").files[0];
    if(file) {
      let data = {moduleName: "PROFILE", actionName: "UPDATE", userId: this.state.userData._id, user: user}
      let response = await multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this));
      // this.storeImage();
      return response;
    }
    else{
      this.storeImage();
      this.setState({
        uploadingPic: false,
      });
    }
  }

  onFileUploadCallBack(output) {
    console.log(output);
    const { userData } = this.state;
    if ( userData && userData.profile ) {
      userData.profile.profileImage = JSON.parse(output).result;
    }
    this.setState({
      userData,
      uploadingPic: false,
      showUploadPicModal: false,
    })
  }

  onUploadPic(pic) {
    this.onFileUpload(pic);
    this.setState({
      uploadingPic: true,
    });
  }

  render() {
    const socialLinkTypeQuery=gql`query($type:String,$hierarchyRefId:String){
      data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
        label
        value
      }
    }`;
    const socialLinkTypeOption={options: { variables: {type : "SOCIALLINKS", hierarchyRefId: this.props.data.clusterId } } };
    const { userData } = this.state;
    let socialLinks = [];
    if (userData && userData.profile && userData.profile.InternalUprofile && userData.profile.InternalUprofile.moolyaProfile) {
      socialLinks = this.state.userData.profile.InternalUprofile.moolyaProfile.socialLinksInfo || [];
    }
    const _this = this
    let profilePic = this.state.userData && this.state.userData.profile && this.state.userData.profile.genderType == 'female' ? '/images/female.jpg' : '/images/def_profile.png';
    let Img = this.state.userData && this.state.userData.profile && this.state.userData.profile.profileImage ? this.state.userData.profile.profileImage : profilePic;
    const isActive = this.state.userData && this.state.userData.profile && this.state.userData.profile.isActive;
    var urlCreator = window.URL || window.webkitURL;
    let imageUrl = '';
    if (this.state.croppedPic)
      imageUrl = urlCreator.createObjectURL(this.state.croppedPic);
    return (
      <div>
        <div className="col-lx-6 col-sm-6 col-md-6 nopadding-left">
          <div className="row">
            <div className="left_wrap left_user_blocks">
              <MlAnchorUserGrid users={_this.state.data} classnames="col-md-4 col-sm-6" clickHandler={_this.handleUserClick} selectedUserId={_this.selectedUser}/>
            </div>
          </div>
        </div>
        <div className="col-lx-6 col-sm-6 col-md-6 nopadding-right">

          {/*<h3>User Details</h3>*/}
          <div className="left_wrap">
            <ScrollArea
              speed={0.8}
              className="left_wrap"
            >
              <form>
                <div className="form-group">
                  <div onClick={this.onToggleUploadPic} className="fileUpload mlUpload_btn">
                    <span>Upload Pic</span>
                  </div>
                  <div className="previewImg ProfileImg">
                    <img
                      src={this.state.userData.profile.profileImage ? generateAbsolutePath(this.state.userData.profile.profileImage) : "/images/def_profile.png"}/>
                  </div>
                </div>
                <br className="brclear" />
                <div className="form-group">
                  <input type="text" placeholder="First Name" className="form-control float-label"
                    value={this.state.userData && this.state.userData.profile && this.state.userData.profile.firstName}
                    onChange={event => this.updateProfileData('firstName', event.target.value)} />

                </div>
                <div>
                  <div className="form-group">
                    <input type="text" placeholder="Middle Name" className="form-control float-label"
                      value={this.state.userData && this.state.userData.profile && this.state.userData.profile.middleName}
                      onChange={event => this.updateProfileData('middleName', event.target.value)} />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Last Name" className="form-control float-label"
                      value={this.state.userData && this.state.userData.profile && this.state.userData.profile.lastName}
                      onChange={event => this.updateProfileData('lastName', event.target.value)} />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Display Name" className="form-control float-label"
                      value={this.state.userData && this.state.userData.profile && this.state.userData.profile.InternalUprofile &&
                        this.state.userData.profile.InternalUprofile.moolyaProfile && this.state.userData.profile.InternalUprofile.moolyaProfile.displayName ?
                        this.state.userData.profile.InternalUprofile.moolyaProfile.displayName : ""}
                      onChange={event => this.updateInternalUprofileData('displayName', event.target.value)} />
                  </div>
                  <div className="form-group">
                    <textarea placeholder="About" className="form-control float-label"
                              value={this.state.userData && this.state.userData.profile && this.state.userData.profile.about ? this.state.userData.profile.about : ''}
                              onChange={event => this.updateProfileData('about', event.target.value)}></textarea>
                  </div>
                  <div className="form-group">
                    <input disabled type="text" placeholder="Contact Number" className="form-control float-label" readOnly
                      value={this.state.userData && this.state.userData.profile && this.state.userData.profile.InternalUprofile &&
                        this.state.userData.profile.InternalUprofile.moolyaProfile && this.state.userData.profile.InternalUprofile.moolyaProfile.contact
                        && this.state.userData.profile.InternalUprofile.moolyaProfile.contact.length ?
                        this.state.userData.profile.InternalUprofile.moolyaProfile.contact[0].number : ""} />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Email Id" className="form-control float-label" readOnly
                      value={this.state.userData && this.state.userData.profile && this.state.userData.profile.email}
                       />
                  </div>

                  <div className="panel panel-default new_profile_tabs">
                    <div className="panel-heading">
                      Social Links
                    </div>
                    <div className="panel-body">
                      {this.renderSocialLinkForm(socialLinks)}
                    </div>
                  </div>
                </div>
                <br className="brclear" />
                <div className="form-group switch_wrap inline_switch">
                  <label className="">Status</label>
                  <label className={`switch ${isActive ? 'on' : ''}`}>
                    <input checked={isActive} onChange={event => this.updateProfileData('isActive', !isActive)} type="checkbox"/>
                    <div className="slider"></div>
                  </label>
                </div>
              </form>
              <CropperModal
                toggleShow={this.onToggleUploadPic}
                show={this.state.showUploadPicModal}
                uploadingImage={this.state.uploadingPic}
                cropperStyle="circle"
                handleImageUpload={this.onUploadPic}
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    )
  }
};

