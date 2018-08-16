import React from "react";
import {render} from "react-dom";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import Moolyaselect from "../../../commons/components/MlAdminSelectWrapper";
import {addSubDepartmentActionHandler} from "../actions/addSubDepartmentAction";
import MlActionComponent from "../../../../commons/components/actions/ActionComponent";
import formHandler from "../../../../commons/containers/MlFormHandler";
import MlAssignDepartments from "./MlAssignDepartments";
import {findDepartmentActionHandler} from "../actions/findDepartmentAction";
import MlMoolyaAssignDepartment from "./MlMoolyaAssignDepartment";
// import ScrollArea from "react-scrollbar";
import { Scrollbars } from 'react-custom-scrollbars';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
class MlAddSubDepartment extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      department: '',
      loading: true,
      data: {isMoolya: true},
      subdepartmentAvailability: [],
    }
    this.addEventHandler.bind(this);
    this.createSubDepartment.bind(this)
    return this;
  }

  async addEventHandler() {
    const resp=await this.createSubDepartment();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    //Fix for: MOOLYA-2601
    if(response&&!response.success){
      toastr.error(response.result);
    }else{
      toastr.success("Sub-Department added successfully");
      FlowRouter.go("/admin/settings/subDepartmentsList");
    }
  };

  async  createSubDepartment() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let SubDepartmentDetails = {
        subDepartmentName: this.refs.subDepartmentName.value,
        displayName: this.refs.displayName.value,
        aboutSubDepartment: this.refs.about.value,
        isActive: this.refs.subDepartmentStatus.checked,
        departmentId: this.state.department,
        isMoolya: this.state.data.isMoolya,  //this.refs.appType.checked
        subDepatmentAvailable: this.state.subdepartmentAvailability
      }

      const response = await addSubDepartmentActionHandler(SubDepartmentDetails);
      return response;
    }
  }
  optionsBySelectDepartment(val) {
    if (val) {
      this.findDepartment(val);
      this.setState({department: val})
    }
    else {
      this.setState({department: ''})
    }
  // else {
  //     this.setState({department: '', data: '',subdepartmentAvailability:[]})
  //   }
  }

  async findDepartment(val) {
    let departmentId = val
    const response = await findDepartmentActionHandler(departmentId);
    this.setState({data: response, subdepartmentAvailability: response.depatmentAvailable || []});
  }

  getDepartmentAvailability(details){
    this.setState({'subdepartmentAvailability':details})
  }
  getMoolyaDepartmentAvailability(details){
    this.setState({'subdepartmentAvailability':details})
  }

  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createSubDepartment.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
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
          <div className="admin_padding_wrap">
            <h2>Create Sub Department</h2>
            <div className="col-md-6 nopadding-left">
              <div className="form_bg">
                <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="subDepartmentName" placeholder="Sub Department Name"
                           className="form-control float-label" data-required={true} data-errMsg="subDepartment Name is required"/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" ref="displayName" placeholder="Display Name"
                           className="form-control float-label" data-required={true} data-errMsg="Display Name is required"/>
                  </div>
                  <div className="form-group">
                    <textarea ref="about" placeholder="About Sub Department"
                              className="form-control float-label"></textarea>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="subDepartmentStatus"/>
                      <div className="slider"></div>
                    </label>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6 nopadding-right">
              <div className="clearfix"></div>
              <div className="form_bg left_wrap">
                <Scrollbars
                  speed={0.8}
                  className="left_wrap"
                  smoothScrolling={true}
                  default={true}
                >
                  <form>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder={"Select Department"}
                                    className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                    selectedValue={this.state.department} queryType={"graphql"}
                                    query={departmentQuery} isDynamic={true} id={'department'}
                                    onSelect={this.optionsBySelectDepartment.bind(this)}/>
                    </div>
                    {this.state.data != '' && (<div>
                      <div className="form-group switch_wrap switch_names" disabled="true">
                        <label>Select Type</label><br/>
                        <span className="state_label acLabel">EcoSystem</span><label className="switch nocolor-switch">
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
                          moolya={this.state.data && this.state.data.depatmentAvailable}/> :
                        <MlAssignDepartments getDepartmentAvailability={this.getDepartmentAvailability.bind(this)}
                                             nonMoolya={this.state.data && this.state.data.depatmentAvailable}/>
                      }
                    </div> )}
                  </form>
                </Scrollbars>
              </div>
            </div>
            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>
        </div>
      )
  }
};

export default MoolyaAddSubDepartment = formHandler()(MlAddSubDepartment);
