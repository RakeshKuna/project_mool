  import React from "react";
  import {render} from "react-dom";
  import ScrollArea from "react-scrollbar";
  import {graphql} from "react-apollo";
  import gql from "graphql-tag";
  import _ from "lodash";
  import formHandler from "../../../../commons/containers/MlFormHandler";
  import {updateRoleActionHandler} from "../actions/updateRoleAction";
  import {findRoleActionHandler} from "../actions/findRoleAction";
  import MlAssignClustersToRoles from "./MlAssignClustersToRoles";
  import MlAssignModulesToRoles from "./MlAssignModulesToRoles";
  import MlActionComponent from "../../../../commons/components/actions/ActionComponent";
  import {OnToggleSwitch, initalizeFloatLabel} from "../../../utils/formElemUtil";
  import MlLoader from "../../../../commons/components/loader/loader";
  let Select = require('react-select');

  class MlEditRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      assignRoleToClusters: [],
      assignModulesToRoles: [],
      selectedUserType: '',
      selectedBackendUser: '',
      selectedSubChapter: ''
    }
    this.onStatusChange.bind(this);
    this.addEventHandler.bind(this);
    this.handleAvailability.bind(this);
    return this;
  }

  componentDidMount() {
    initalizeFloatLabel();
  }
  componentDidUpdate() {
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight-(90+$('.admin_header').outerHeight(true)));
  }
  async addEventHandler() {
    const resp = await this.createBackendUser();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response) {
      if (response.success)
        FlowRouter.go("/admin/settings/rolesList");
      else
        toastr.error(response.result);
    }
  };

  getassignRoleToClusters(details) {
    this.setState({'assignRoleToClusters': details})
  }

  getassignModulesToRoles(details) {
    this.setState({'assignModulesToRoles': details})
  }

  onStatusChange(e) {
    if (e.currentTarget.checked) {
      this.setState({"isActive": true})
    } else {
      this.setState({"isActive": false})
    }
  }

    /**
     * handler for giving the availabilty to the non-moolya subchapters
     * */
    handleAvailability(e) {
      this.setState({"isNonMoolyaAvailable": e.currentTarget.checked})
    }

  async  updateRole() {

    var modules = _.cloneDeep(this.state.assignModulesToRoles);
    for(var i = 0; i < modules.length; i++){
      if(modules[i].actions.length == 0){
        toastr.error("Please select an action");
        return;
      }
    }

    let uniqModule = _.uniqBy(modules, 'moduleId');
    if (modules && uniqModule && uniqModule.length !== modules.length) {
      toastr.error('Please select a different module');
      return;
    }

    let roleObject = {
      roleName: this.refs.roleName.value,
      displayName: this.refs.diplayName.value,
      roleType: this.state.selectedUserType,
      userType: this.state.selectedBackendUser,
      about: this.refs.about.value,
      assignRoles: this.state.assignRoleToClusters,
      modules: modules,
      isActive: this.refs.isActive.checked,
      isNonMoolyaAvailable : this.refs.isNonMoolyaAvailable.checked
    }
    let roleDetails = {
      id: this.props.config,
      roleObject: roleObject
    }

    var emptyCluster = _.filter(roleObject.assignRoles, ['cluster', ''])
    var emptyChapter = _.filter(roleObject.assignRoles, ['chapter', ''])
    var emptySubChapter = _.filter(roleObject.assignRoles, ['subChapter', ''])
    var emptyCommunity = _.filter(roleObject.assignRoles, ['community', ''])
    var emptyDepartment = _.filter(roleObject.assignRoles, ['department', ''])
    var emptySubDepartment = _.filter(roleObject.assignRoles, ['subDepartment', ''])

    if (_.isEmpty(emptyCluster) && _.isEmpty(emptyChapter) && _.isEmpty(emptySubChapter) && _.isEmpty(emptyCommunity) && _.isEmpty(emptyDepartment) && _.isEmpty(emptySubDepartment)) {
      const response = await updateRoleActionHandler(roleDetails)
      if(response.success === false){
       // toastr.error("Hierarchy associated for this role");
      }
      return response;
    } else {
      toastr.error("Please fill all mandatory fields to proceed. Mandatory fields are marked with a red dot.");
    }
  }

  getAssignedDepartments(departments) {
    this.setState({'mlAssignDepartmentDetails': departments})
  }

  onUserTypeSelect(val) {
    if(val)
      this.setState({selectedUserType:val.value})
    else{
      this.setState({selectedUserType:''})
    }
  }

  onBackendUserSelect(val) {
    this.setState({selectedBackendUser: val.value})
  }

  optionsBySelectSubChapter(val) {
    this.setState({selectedSubChapter: val})
  }

  async findRole() {
    let roleid = this.props.config;
    const response = await findRoleActionHandler(roleid);
    this.setState({loading: false, data: response});
    if (response) {
      this.setState({
        isActive: this.state.data.isActive,
        selectedUserType: this.state.data.roleType,
        selectedBackendUser: this.state.data.userType,
        selectedSubChapter: this.state.data.subChapter,
        isNonMoolyaAvailable : this.state.data&&this.state.data.isNonMoolyaAvailable?this.state.data.isNonMoolyaAvailable:false
      })
    }
  }

  componentWillMount() {
    const resp = this.findRole();
    return resp;
  }

  render() {
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateRole.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/rolesList")
        }
      }
    ]
    let UserTypeOptions = [
      {value: 'moolya', label: 'EcoSystem', clearableValue: true},
      {value: 'non-moolya', label: 'non-moolya subchapter', clearableValue: true}
    ];
    let BackendUserOptions = [
      {value: 'Internal User', label: 'Internal User'},
      {value: 'External User', label: 'External User'}
    ]
    let query = gql` query{
      data:fetchCountriesSearch{label:country,value:countryCode}
    }
    `;
    let subChapterQuery = gql` query{
      data:fetchActiveSubChapters{label:subChapterName,value:_id}
    }
    `;
    const showLoader = this.state.loading;

    return (
      <div>
        {showLoader === true ? (<div className="loader_container">
          <MlLoader/>
        </div>) : (
          <div className="admin_main_wrap">
            <div className="admin_padding_wrap">
              <h2>Edit Roles & Permissions</h2>
              <div className="col-md-6 nopadding-left">
                <div className="left_wrap">
                  <ScrollArea
                    speed={0.8}
                    className="left_wrap"
                    smoothScrolling={true}
                    default={true}
                  >
                    <div className="form_bg">
                      <form>
                        <div className="form-group">
                          <input type="text" ref="roleName" placeholder="Role Name"
                                 defaultValue={this.state.data && this.state.data.roleName}
                                 className="form-control float-label"/>

                        </div>
                        <div className="form-group">
                          <input type="text" ref="diplayName" placeholder="Display Name"
                                 defaultValue={this.state.data && this.state.data.displayName}
                                 className="form-control float-label"/>

                        </div>
                        <div className="form-group">
                          <Select name="form-field-name" ref="userType" options={UserTypeOptions}
                                  value={this.state.selectedUserType} onChange={this.onUserTypeSelect.bind(this)}
                                  className="float-label"/>
                        </div>
                        {/*{this.state.selectedUserType == 'non-moolya' && (<div className="form-group">*/}
                          {/*<Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}*/}
                                        {/*labelKey={'label'} placeholder="Select Subchapter"*/}
                                        {/*selectedValue={this.state.selectedSubChapter} queryType={"graphql"}*/}
                                        {/*query={subChapterQuery} isDynamic={true}*/}
                                        {/*onSelect={this.optionsBySelectSubChapter.bind(this)}/>*/}
                        {/*</div>)}*/}
                        <div className="form-group">
                          <Select
                            name="form-field-name" ref="roleType" options={BackendUserOptions}
                            value={this.state.selectedBackendUser} onChange={this.onBackendUserSelect.bind(this)}
                            className="float-label" disabled={true}/>
                        </div>
                        <div className="form-group">
                          <textarea placeholder="About" ref="about"
                                    defaultValue={this.state.data && this.state.data.about}
                                    className="form-control float-label"></textarea>
                        </div>

                        {this.state.data && this.state.data.assignRoles ? (
                          <MlAssignClustersToRoles getassignRoleToClusters={this.getassignRoleToClusters.bind(this)}
                                                   selectedBackendUserType={this.state.data && this.state.selectedUserType}
                                                   assignedClusterDetails={this.state.data && this.state.data.assignRoles}/>) : ""}
                        {/*selectedSubChapter={this.state.data && this.state.selectedSubChapter}*/}
                        <div className="form-group switch_wrap inline_switch">
                          <label className="">Overall Role Status</label>
                          <label className="switch">
                            <input type="checkbox" ref="isActive" checked={this.state.isActive}
                                   onChange={this.onStatusChange.bind(this)}/>
                            <div className="slider"></div>
                          </label>
                        </div>

                        <div className="form-group">
                          <div className="input_types">
                            <div className="input_types"><input id="checkbox1" type="checkbox" ref="isNonMoolyaAvailable"
                                                                onChange={this.handleAvailability.bind(this)}
                                                                checked={this.state.isNonMoolyaAvailable}
                                                                value="1"/><label
                              htmlFor="checkbox1"><span></span>Is Available for non-moolya ?</label></div>
                          </div>
                        </div>
                        <br className="brclear"/>
                      </form>
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg">
                  <div className="left_wrap">
                    <ScrollArea
                      speed={0.8}
                      className="left_wrap"
                      smoothScrolling={true}
                      default={true}
                    >
                      <form style={{marginTop: '0px'}}>

                        {this.state.data && this.state.data.modules ? (
                          <MlAssignModulesToRoles getassignModulesToRoles={this.getassignModulesToRoles.bind(this)}
                                                  assignModulesToRolesData={this.state.data && this.state.data.modules}/>) : ""}
                      </form>
                    </ScrollArea>
                  </div>
                </div>
              </div>
              <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

            </div>
          </div>)}
      </div>
    )
  }
}
;
export default MlEditRole = formHandler()(MlEditRole);

