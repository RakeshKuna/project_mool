import React from "react";
import {render} from "react-dom";
import {addDepartmentActionHandler} from "../actions/addDepartmentAction";
import MlActionComponent from "../../../../commons/components/actions/ActionComponent";
import formHandler from "../../../../commons/containers/MlFormHandler";
import MlAssignDepartments from "./MlAssignDepartments";
import MlMoolyaAssignDepartment from "./MlMoolyaAssignDepartment";
// import ScrollArea from "react-scrollbar";
import { Scrollbars } from 'react-custom-scrollbars';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
class MlAddDepartment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      departmentAvailability: [],
      isMoolya: true
    }
    this.addEventHandler.bind(this);
    this.createDepartment.bind(this)
    return this;
  }

  componentDidMount() {
    $(function () {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function () {
      if ($(this).parent().hasClass('nocolor-switch')) {

        if ($(this).is(':checked')) {
          $('.state_label:nth-of-type(1)').removeClass('acLabel');
          $('.state_label:nth-of-type(2)').addClass('acLabel');
        } else {
          $('.state_label:nth-of-type(2)').removeClass('acLabel');
          $('.state_label:nth-of-type(1)').addClass('acLabel');
        }
      } else {
        if ($(this).is(':checked')) {
          $(this).parent('.switch').addClass('on');
        } else {
          $(this).parent('.switch').removeClass('on');
        }
      }
    });
  }

  async addEventHandler() {
    const resp = await this.createDepartment();
    return resp;
  }

  async handleError(response) {
    toastr.error(response);
  };

  async handleSuccess(response) {
    if (response) {
      if (response.success)
        FlowRouter.go("/admin/settings/departmentsList");
      else
        toastr.error(response.result);
      FlowRouter.go("/admin/settings/departmentsList");
    }
  };

  async  createDepartment() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let DepartmentDetails = {
        departmentName: this.refs.departmentName.value,
        displayName: this.refs.displayName.value,
        aboutDepartment: this.refs.aboutDepartment.value,
        departmentStatus: this.refs.departmentStatus.checked,
        isMoolya: this.state.isMoolya,
        departmentAvailablity: this.state.departmentAvailability
      }
      if (!DepartmentDetails.departmentName) {
        toastr.error("Department Name is mandatory");
      } else {
        const response = await addDepartmentActionHandler(DepartmentDetails)
        toastr.success("'Department' added successfully")
        return response;
      }
    }
  }
  getMoolyaDepartmentAvailability(details) {
    for (var i = 0; i < details.length; i++) {
      details[i].clusters;
    }
    this.setState({'departmentAvailability': details})
  }

  getDepartmentAvailability(details) {
    this.setState({'departmentAvailability': details})
  }

  onStatusChange(e) {
    this.setState({"isMoolya": !e.currentTarget.checked});
  }

  render() {
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createDepartment.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/departmentsList")
        }
      }
    ]

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Department</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group mandatory">
                  <input type="text" ref="departmentName" placeholder="Department Name"
                         className="form-control float-label" data-required={true} data-errMsg="Department Name is required"/>
                </div>
                <div className="form-group mandatory">
                  <input ref="displayName" placeholder="Display Name" className="form-control float-label" data-required={true} data-errMsg="Display Name is required" ></input>
                </div>
                <div className="form-group">
                  <textarea ref="aboutDepartment" placeholder="About Department" className="form-control float-label" ></textarea>
                </div>

                <div className="form-group switch_wrap inline_switch">
                  <label>Status</label>
                  <label className="switch">
                    <input type="checkbox" ref="departmentStatus"/>
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

                  <div className="form-group switch_wrap switch_names">
                    <label>Select Type</label><br/>
                    <span className="state_label acLabel">EcoSystem</span><label className="switch nocolor-switch">
                    <input type="checkbox" ref="appType" onChange={this.onStatusChange.bind(this)}/>
                    <div className="slider"></div>
                  </label>
                    <span className="state_label">SubChapter</span>
                  </div>
                  <br className="brclear"/>

                  {this.state.isMoolya ?
                  <MlMoolyaAssignDepartment
                    getMoolyaDepartmentAvailability={this.getMoolyaDepartmentAvailability.bind(this)}/>:
                    <MlAssignDepartments getDepartmentAvailability={this.getDepartmentAvailability.bind(this)}/>
                  }

                </form>
              </Scrollbars>
            </div>
          </div>
        </div>

        <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

      </div>
    )
  }
}
;

export default MoolyaAddDepartment = formHandler()(MlAddDepartment);
