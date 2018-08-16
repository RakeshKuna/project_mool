
import React from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import formHandler from "../../../../commons/containers/MlFormHandler";
import {addRoleActionHandler} from "../actions/addRoleAction";
import MlAssignClustersToRoles from "./MlAssignClustersToRoles";
import MlAssignModulesToRoles from "./MlAssignModulesToRoles";
import MlActionComponent from "../../../../commons/components/actions/ActionComponent";
import {OnToggleSwitch, initalizeFloatLabel} from "../../../utils/formElemUtil";
import {mlFieldValidations} from "../../../../commons/validations/mlfieldValidation";
import _ from "lodash";
let Select = require('react-select');

class MlAddRole extends React.Component{
  constructor(props){
    super(props);
    this.state={
      assignRoleToClusters:[],
      assignModulesToRoles:[],
      selectedUserType:'',
      selectedBackendUser:'Internal User',
      selectedSubChapter:'',
      selectedCommunity:'',
      isNonMoolyaAvailable: false
    }
    this.addEventHandler.bind(this);
    return this;
  }
  componentDidMount()
  {
    initalizeFloatLabel();
    OnToggleSwitch(false,true);
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
  }
  async addEventHandler() {
    const resp=await this.createBackendUser();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/rolesList");
      else
        toastr.error(response.result);
    }
  };

  getassignRoleToClusters(details){
    this.setState({'assignRoleToClusters':details})
  }

  getassignModulesToRoles(details){
    this.setState({'assignModulesToRoles':details})
  }


  async  addRole() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
       var modules = _.cloneDeep(this.state.assignModulesToRoles);
      _.remove(modules, {moduleId: ""});
      if(modules && modules.length == 0){
        toastr.error("Please select atleast one module");
        return;
      }

      for(var i = 0; i < modules.length; i++){
        if(modules[i].actions.length == 0){
          toastr.error("Please select atleast one action");
          return;
        }
      }

      let uniqModule = _.uniqBy(modules, 'moduleId');
      if (modules && uniqModule && uniqModule.length !== modules.length) {
        toastr.error('Please select a different module');
        return;
      }

      let roleDetails = {
        roleName: this.refs.roleName.value,
        displayName: this.refs.diplayName.value,
        roleType: this.state.selectedUserType,
        // subChapter: this.state.selectedSubChapter,
        userType: this.state.selectedBackendUser,
        about: this.refs.about.value,
        assignRoles: this.state.assignRoleToClusters,
        modules: modules,
        isActive: this.refs.isActive.checked,
        isNonMoolyaAvailable: this.refs.isNonMoolyaAvailable.checked
      };

      var emptyCluster = _.filter(roleDetails.assignRoles, ['cluster', ''])
      var emptyChapter = _.filter(roleDetails.assignRoles, ['chapter', ''])
      var emptySubChapter = _.filter(roleDetails.assignRoles, ['subChapter', ''])
      var emptyCommunity = _.filter(roleDetails.assignRoles, ['community', ''])
      var emptyDepartment = _.filter(roleDetails.assignRoles, ['department', ''])
      var emptySubDepartment = _.filter(roleDetails.assignRoles, ['subDepartment', ''])

      if (_.isEmpty(emptyCluster) && _.isEmpty(emptyChapter) && _.isEmpty(emptySubChapter) && _.isEmpty(emptyCommunity) && _.isEmpty(emptyDepartment) && _.isEmpty(emptySubDepartment)) {
        const response = await addRoleActionHandler(roleDetails)
        if(!response.success){
          toastr.error("Role already exists")
        }
        else if(response.success){
          toastr.success("Role created successfully");
          return response;
        }
      } else {
        toastr.error("Please fill all mandatory fields to proceed");
      }
    }
  }

  getAssignedDepartments(departments){
    this.setState({'mlAssignDepartmentDetails':departments})
  }

  onUserTypeSelect(val){
    if(val)
      this.setState({selectedUserType:val.value})
    else{
      this.setState({selectedUserType:''})
    }
  }
  onBackendUserSelect(val){
    this.setState({selectedBackendUser:val.value})
  }

  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.addRole.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
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
    let query=gql` query{
  data:fetchCountriesSearch{label:country,value:countryCode}
}
`;
//     let subChapterQuery=gql` query{
//   data:fetchActiveSubChapters{label:subChapterName,value:_id}
// }
// `;


   return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Roles & Permissions</h2>
          <div className="main_wrap_scroll">
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
                    <div className="form-group mandatory">
                      <input type="text"  ref="roleName" placeholder="Role Name" className="form-control float-label" id="" data-required={true} data-errMsg="Role Name is required"/>

                    </div>
                    <div className="form-group mandatory">
                      <input type="text" ref="diplayName" placeholder="Display Name" className="form-control float-label" id="" data-required={true} data-errMsg="Display Name is required"/>

                    </div>
                    <div className="form-group mandatory">
                      <Select name="form-field-name" ref="userType" placeholder="Backend User Role Type" options={UserTypeOptions}  value={this.state.selectedUserType}  onChange={this.onUserTypeSelect.bind(this)} className="float-label" data-required={true} data-errMsg=" Backend User Role Type is required"/>
                    </div>
                    {/*{this.state.selectedUserType=='non-moolya'&&(*/}
                      {/*<Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'} labelKey={'label'} placeholder="Select Subchapter"  selectedValue={this.state.selectedSubChapter} queryType={"graphql"} query={subChapterQuery} isDynamic={true}  onSelect={this.optionsBySelectSubChapter.bind(this)} />*/}
                    {/*)}*/}
                    <div className="form-group mandatory">
                      <Select name="form-field-name" placeholder="Role Type"  className="float-label"  options={BackendUserOptions}  value={this.state.selectedBackendUser}  onChange={this.onBackendUserSelect.bind(this)} disabled={true} />
                    </div>
                    <div className="form-group">
                      <textarea placeholder="About" ref="about" className="form-control float-label"></textarea>
                    </div>

                    {/*<MlAssignClustersToRoles getassignRoleToClusters={this.getassignRoleToClusters.bind(this)} selectedBackendUserType={this.state.selectedUserType} selectedSubChapter={this.state.selectedSubChapter}/>*/}
                    <MlAssignClustersToRoles getassignRoleToClusters={this.getassignRoleToClusters.bind(this)} selectedBackendUserType={this.state.selectedUserType} />

                    <div className="form-group switch_wrap inline_switch">
                      <label className="">Overall Role Status</label>
                      <label className="switch">
                        <input type="checkbox" ref="isActive" />
                        <div className="slider"></div>
                      </label>
                    </div>
                    <div className="form-group">
                      <div className="input_types">
                        <div className="input_types"><input id="checkbox1" type="checkbox" ref="isNonMoolyaAvailable"
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
          <div className="col-md-6 nopadding-right"  >
            <div className="form_bg">
              <div className="left_wrap">
                <ScrollArea
                  speed={0.8}
                  className="left_wrap"
                  smoothScrolling={true}
                >
          <MlAssignModulesToRoles getassignModulesToRoles={this.getassignModulesToRoles.bind(this)}/>
                </ScrollArea>
          </div>
          </div>
          </div>
          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

        </div>


      </div>
    )
  }
};
export default MlAddRole = formHandler()(MlAddRole);

