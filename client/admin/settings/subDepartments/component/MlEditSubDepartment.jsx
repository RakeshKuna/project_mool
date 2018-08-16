import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findSubDepartmentActionHandler} from '../actions/findSubDepartmentAction'
import {updateSubDepartmentActionHandler} from '../actions/updateSubDepartmentAction'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import MlAssignDepartments from './MlAssignDepartments'
import MlMoolyaAssignDepartment from './MlMoolyaAssignDepartment'
import {findDepartmentActionHandler} from '../actions/findDepartmentAction'
import ScrollArea from 'react-scrollbar';
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
class MlEditSubDepartment extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {id: props.config},
      departmentdata: {},
      department: '',
      subDepatmentAvailable: []
    };
    this.addEventHandler.bind(this);
    this.editSubDepartment.bind(this);
    this.findSubDepartment.bind(this);
    return this;
  }
  componentDidMount() {
    if(this.state.data.isAcive){
      $('#status').prop('checked', true);
    }
  }

  componentWillMount() {
    const resp=this.findSubDepartment();
      return resp;
  }

  componentDidUpdate(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));

    OnToggleSwitch(true,true);

  }

  async addEventHandler() {
    const resp=await this.editSubDepartment();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response) {
      if (response.success)
        FlowRouter.go("/admin/settings/subDepartmentsList");
      else
        toastr.error(response.result);
      FlowRouter.go("/admin/settings/subDepartmentsList");
    }
  }


  async  editSubDepartment() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let subDepartment = {
        subDepartmentName: this.refs.subDepartmentName.value,
        displayName: this.refs.displayName.value,
        aboutSubDepartment: this.refs.aboutSubDepartment.value,
        isActive: this.refs.subDepartmentStatus.checked,
        departmentId: this.state.department,
        isMoolya: this.state.data.isMoolya,   //    //this.refs.appType.checked
        subDepatmentAvailable: this.state.subDepatmentAvailable
      }
      let SubDepartmentDetails = {
        subDepartmentId: this.props.config,
        subDepartment: subDepartment
      }

      const response = await updateSubDepartmentActionHandler(SubDepartmentDetails)
      if (response) {

      }
      toastr.success("Sub-Department updated successfully")
      return response;

    }
  }
  async  findSubDepartment() {
    let id = this.props.config
    const response = await findSubDepartmentActionHandler(id);
    if (response) {
      this.setState({loading: false, data: response, "department": response.departmentId})
    }
  }

  optionsBySelectDepartment(val){
    this.setState({department:val})
    this.findDepartment(val);
  }
  async findDepartment(val){
    let departmentId=val
    const response = await findDepartmentActionHandler(departmentId);
    this.setState({departmentdata:response});
  }
  getDepartmentAvailability(details){
    this.setState({'subDepatmentAvailable':details})
  }
  getMoolyaDepartmentAvailability(details){
    this.setState({'subDepatmentAvailable':details})
  }
  onSubDepartmentStatusChange(e){
    let updatedData = this.state.data||{};
    updatedData=_.omit(updatedData,["isActive"]);
    if (e.currentTarget.checked) {
      var z=_.extend(updatedData,{isActive:true});
      this.setState({data:z,loading:false});
    } else {
      var z=_.extend(updatedData,{isActive:false});
      this.setState({data:z,loading:false});
    }
  }

  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.editSubDepartment.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/subDepartmentsList")
        }
      }
    ]
    const showLoader=this.state.loading;
    let departmentQuery=gql`query{ data:fetchDepartments{value:_id,label:displayName}}`;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

            <div className="admin_padding_wrap">
              <h2>Edit Sub Department</h2>
              <div className="main_wrap_scroll">
                <ScrollArea
                  speed={0.8}
                  className="main_wrap_scroll"
                  smoothScrolling={true}
                  default={true}
                >
                <div className="col-md-6 nopadding-left">
                  <div className="form_bg">
                    <form>
                      <div className="form-group mandatory">
                        <input type="text" ref="subDepartmentName"
                               defaultValue={this.state.data && this.state.data.subDepartmentName}
                               placeholder="Sub Department Name" className="form-control float-label" id="" data-required={true} data-errMsg="SubDepartment Name is required"/>
                      </div>
                      <div className="form-group mandatory">
                        <input type="text" ref="displayName"
                               defaultValue={this.state.data && this.state.data.displayName} placeholder="Display Name"
                               className="form-control float-label" id="" data-required={true} data-errMsg="Display Name is required"/>
                      </div>
                      <div className="form-group">
                        <textarea ref="aboutSubDepartment"
                                  defaultValue={this.state.data && this.state.data.aboutSubDepartment}
                                  placeholder="About" className="form-control float-label" id=""></textarea>
                      </div>
                      <div className="form-group switch_wrap inline_switch">
                        <label>Status</label>
                        <label className="switch">
                          <input type="checkbox" ref="subDepartmentStatus"
                                 checked={this.state.data && this.state.data.isActive}
                                 onChange={this.onSubDepartmentStatusChange.bind(this)}/>
                          <div className="slider"></div>
                        </label>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-6 nopadding-right">
                  <div className="form_bg">
                    <form>
                      <div className="form-group">
                        <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                      labelKey={'label'} disabled={true} selectedValue={this.state.department}
                                      queryType={"graphql"} query={departmentQuery} isDynamic={true} id={'department'}
                                      onSelect={this.optionsBySelectDepartment.bind(this)}/>
                      </div>
                      {this.state.data != '' && (<div>
                        <div className="form-group switch_wrap switch_names" disabled="true">
                          <label>Select Type</label><br/>
                          <span className="state_label acLabel">EcoSystem</span><label className="switch">
                          <input type="checkbox" ref="appType" checked={this.state.data && !this.state.data.isMoolya}
                                 disabled="true"/>
                          <div className="slider"></div>
                        </label>
                          <span className="state_label">SubChapter</span>
                        </div>
                        <br className="brclear"/>
                        {this.state.data && this.state.data.isMoolya ?
                          <MlMoolyaAssignDepartment
                            getMoolyaDepartmentAvailability={this.getMoolyaDepartmentAvailability.bind(this)}
                            moolya={this.state.data && this.state.data.subDepatmentAvailable}/> :
                          <MlAssignDepartments getDepartmentAvailability={this.getDepartmentAvailability.bind(this)}
                                               nonMoolya={this.state.data && this.state.data.subDepatmentAvailable}/>
                        }
                      </div> )}
                    </form>
                  </div>
                </div>
              </ScrollArea>
            </div>
            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>
        )}
      </div>
    )
  }
};

export default MlEditSubDepartment = formHandler()(MlEditSubDepartment);
