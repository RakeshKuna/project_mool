import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {addTechnology} from '../actions/addTechnologyAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader'
class MlAddTechnology extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selectedCommunity:''
    }

    this.createTechnology.bind(this)
    return this;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/technologiesList");
      else
        toastr.error(response.result);
    }
  };

  async createTechnology() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let techInfo = {
        technologyName: this.refs.name.value,
        displayName: this.refs.displayName.value,
        about: this.refs.about.value,
        isActive: this.refs.isActive.checked,
        // icon:this.refs.assetIcon.files
      }

      const response = await addTechnology(techInfo)
      return response;
    }
  }
  componentDidMount()  {
    OnToggleSwitch(false,true);
    initalizeFloatLabel();
  }
  render() {
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createTechnology.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          this.props.handler(" ");
          FlowRouter.go("/admin/settings/technologiesList")
        }
      }
    ]

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

            <div className="admin_padding_wrap">
                <h2>Create Technology</h2>
                <div className="col-md-6 nopadding-left">
                    <div className="form_bg">
                        <form>
                            <div className="form-group mandatory">
                                <input type="text" ref="name" placeholder="Name" className="form-control float-label" data-required={true} data-errMsg="Name is required"/>
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
                        <input type="text" ref="displayName" placeholder="Display Name" className="form-control float-label" data-required={true} data-errMsg="Display Name is required"/>
                    </div>

                    <div className="form-group">
                        <div className="fileUpload mlUpload_btn">
                            <span>Profile Pic</span>
                            <input type="file" className="upload" ref="assetIcon"/>
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
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

export default MlAddTechnology = formHandler()(MlAddTechnology);
