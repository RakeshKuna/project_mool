import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {addLookingForActionHandler} from '../actions/addLookingForTypeAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader'
class MlAddLookingFor extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selectedCommunity:''
    }
    this.addEventHandler.bind(this);
    this.CreateLookingFor.bind(this)
    this.onCommunitySelect.bind(this)
    return this;
  }

  async addEventHandler() {
    const resp = await this.CreateLookingFor();
    return resp;
  }

  onCommunitySelect(val) {
    this.setState({selectedCommunity: val})
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/registration/lookingForList");
      else
        toastr.error(response.result);
    }
  };

  async  CreateLookingFor() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let LookingForDetails = {
        lookingForName: this.refs.lookingForName.value,
        lookingForDisplayName: this.refs.lookingForDisplayName.value,
        communityCode: this.state.selectedCommunity,
        communityName: '',
        about: this.refs.about.value,
        isActive: this.refs.isActive.checked
      }

      const response = await addLookingForActionHandler(LookingForDetails)
      if (!response.success) {
        toastr.error("'Looking For' already exists")
      } else if (response.success) {
        toastr.success("New 'Looking For' added successfully");
        FlowRouter.go("/admin/settings/registration/lookingForList");
      }
      // toastr.success("Created Successfully");
      // return response;
    }
  }
  componentDidMount()  {
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
  }
  render() {
    let query = gql` query{
  data:fetchCommunityDefinition{label:name,value:code}
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
        handler: async(event) => this.props.handler(this.CreateLookingFor.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/registration/lookingForList")
        }
      }
    ]

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?( <MlLoader/>):(

            <div className="admin_padding_wrap">
              <h2>Create Looking For</h2>
              <div className="col-md-6 nopadding-left">
                <div className="form_bg">
                  <form>

                    <Moolyaselect multiSelect={false} ref="community" className="form-control float-label" mandatory={true} valueKey={'value'}
                                  labelKey={'label'} queryType={"graphql"} placeholder="Select Community"
                                  selectedValue={this.state.selectedCommunity}
                                  query={query} isDynamic={true} onSelect={this.onCommunitySelect.bind(this)} data-required={true} data-errMsg="Community is required"/>

                  <div className="form-group mandatory">
                    <input type="text" ref="lookingForDisplayName" placeholder="Display Name"
                           className="form-control float-label" data-required={true} data-errMsg="Display Name is required"/>
                  </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg">
                  <form>
                  <div className="form-group mandatory">
                    <input type="text" ref="lookingForName" placeholder="Looking For Name"
                           className="form-control float-label" data-required={true} data-errMsg="Looking For Name is required"/>
                  </div>
                  <div className="form-group">
                    <textarea ref="about" placeholder="About" className="form-control float-label" id=""></textarea>
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

export default MlAddLookingFor = formHandler()(MlAddLookingFor);
