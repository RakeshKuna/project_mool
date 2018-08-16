import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {addProfessionActionHandler} from '../actions/addProfessionTypeAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader'
class MlAddProfession extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selectedIndustry:''
    }
    this.addEventHandler.bind(this);
    this.createProfession.bind(this)
    this.onIndustrySelect.bind(this)
    return this;
  }

  async addEventHandler() {
    const resp = await this.createProfession();
    return resp;
  }

  onIndustrySelect(val) {
    this.setState({selectedIndustry: val})
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/documentProcess/professionList");
      else
        toastr.error(response.result);
    }
  };

  async  createProfession() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let ProfessionDetails = {
        professionName: this.refs.professionName.value,
        professionDisplayName: this.refs.professionDisplayName.value,
        industryId: this.state.selectedIndustry,
        industryName: '',
        about: this.refs.about.value,
        isActive: this.refs.isActive.checked
      }

      const response = await addProfessionActionHandler(ProfessionDetails)
      toastr.success("'Profession' added successfully");
      return response;
    }
  }
  componentDidMount()  {
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
  }
  render() {
    let query = gql` query{
      data:fetchIndustries{label:industryDisplayName,value:_id}
}
`;

    let MlActionConfig = [
      // {
      //   actionName: 'edit',
      //   showAction: true,
      //   handler: null
      // },
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createProfession.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/professionList")
        }
      }
    ]

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?( <MlLoader/>):(

        <div className="admin_padding_wrap">
          <h2>Create Profession</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
              <div className="form-group mandatory">
                <input type="text" ref="professionName" placeholder="Profession Name"
                       className="form-control float-label" data-required={true} data-errMsg="Name is required"/>
              </div>
              <div className="form-group">
                <textarea ref="about" placeholder="About" className="form-control float-label" id=""></textarea>
              </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
              <div className="form-group mandatory">
                <input type="text" ref="professionDisplayName" placeholder="Display Name"
                       className="form-control float-label" id="" data-required={true} data-errMsg="Display Name is required"/>
              </div>
              <div className="form-group">
                <Moolyaselect multiSelect={false} ref="industry" placeholder="Select Industry" mandatory={true} className="form-control float-label" valueKey={'value'}
                              labelKey={'label'} queryType={"graphql"}
                              selectedValue={this.state.selectedIndustry}
                              query={query} isDynamic={true} onSelect={this.onIndustrySelect.bind(this)} data-required={true} data-errMsg="Industry is required"/>
              </div>
              <div className="form-group switch_wrap inline_switch">
                <label>Status</label>
                <label className="switch">
                  <input type="checkbox" ref="isActive"/>
                  <div className="slider"></div>
                </label>
              </div>
              </form>
            </div>
          </div>

        <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
        />
      </div>)}
    </div>
    )
  }
}
;

export default MlAddProfession = formHandler()(MlAddProfession);
