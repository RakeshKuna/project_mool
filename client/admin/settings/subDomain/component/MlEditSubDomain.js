import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag'
import Moolyaselect from '../../../commons/components/MlAdminSelectWrapper'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findSubDomainActionHandler} from '../actions/findSubDomainAction'
import {updateSelectedSubDomainActionHandler} from '../actions/updateSubDomainAction'
import {OnToggleSwitch, initalizeFloatLabel} from '../../../utils/formElemUtil';
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader'

class MlEditSubDomain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, data: {}, industryId: " ", industry: "  "};
    this.updateSelectedSubDomain.bind(this)
    this.findSubDomain.bind(this);
    this.onStatusChange.bind(this);
    this.optionsBySelectTypeOfIndustry.bind(this);
    return this;
  }

  componentWillMount() {
    const resp = this.findSubDomain();
    return resp;
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    OnToggleSwitch(true, true);
    initalizeFloatLabel();
  }

  optionsBySelectTypeOfIndustry(value) {
    this.setState({industryId: value})
  }

  async handleError(response) {
    alert(response)
  };

  onStatusChange(e) {
    const data = this.state.data;
    if (e.currentTarget.checked) {
      this.setState({"data": {"isActive": true}});
    } else {
      this.setState({"data": {"isActive": false}});
    }
  }

  async handleSuccess(response) {
    if (response) {
      if (response.success)
        FlowRouter.go("/admin/settings/documentProcess/subDomainList");
      else
        toastr.error(response.result);
    }
  }

  async findSubDomain() {
    let subDomainId = this.props.config
    const response = await findSubDomainActionHandler(subDomainId);
    this.setState({loading: false, data: response, industryId: response.industryId});
    // const industryDetails = await findIndustryActionHandler(industryId)
    // this.setState({industry:industryDetails.industryName})
  }

  async updateSelectedSubDomain() {
    let ret = mlFieldValidations(this.refs);
    if (ret) {
      toastr.error(ret);
    }
    else {
      let subDomainDetails = {
        name: this.refs.name.value,
        displayName: this.refs.displayName.value,
        about: this.refs.about.value,
        industryId: this.state.industryId,
        isActive: this.refs.isActive.checked
      };

      const response = await updateSelectedSubDomainActionHandler(this.props.config, subDomainDetails);
      if (response.success) {
        //toastr.success("Sub-Domain updated successfully")
        FlowRouter.go("/admin/settings/documentProcess/subDomainList");
      }
      return response;
    }
  }

  render() {
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async (event) => this.props.handler(this.updateSelectedSubDomain.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },

      {
        showAction: true,
        actionName: 'cancel',
        handler: async (event) => {
          FlowRouter.go("/admin/settings/documentProcess/subDomainList")
        }
      }
    ];
    let industriesquery = gql` query{
    data:fetchIndustries{label:industryDisplayName,value:_id}
    }`;

    const showLoader = this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? (<MlLoader/>) : (

          <div className="admin_padding_wrap">
            <h2>Edit Sub Domain</h2>
            <div className="col-md-6 nopadding-left">
              <div className="form_bg">
                <form>
                  <div className="form-group mandatory">
                    {/*<input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>*/}
                    <input type="text" ref="name" placeholder="Name" className="form-control float-label"
                           defaultValue={this.state.data.name} data-required={true} data-errMsg="Name is required"/>
                  </div>
                  <br className="clearfix"/>
                  <div className="form-group mandatory">
                    <input type="text" ref="displayName" placeholder="Display Name" className="form-control float-label"
                           defaultValue={this.state.data.displayName} data-required={true}
                           data-errMsg="Display Name is required"/>
                  </div>

                </form>
              </div>
            </div>
            <div className="col-md-6 nopadding-right">
              <div className="form_bg">
                <form>

                  <div className="form-group">
                    <Moolyaselect multiSelect={false} ref="indutryType" placeholder="Select Industry" mandatory={true}
                                  className="form-control float-label" selectedValue={this.state.industryId}
                                  valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={industriesquery}
                                  onSelect={this.optionsBySelectTypeOfIndustry.bind(this)}
                                  defaultValue={this.state.industry}
                                  isDynamic={true} data-required={true} data-errMsg="Industry Type is required"/>
                    {console.log(this.state.data)}
                  </div>
                  <div className="form-group">
                    <textarea ref="about" placeholder="About" className="form-control float-label" id=""
                              defaultValue={this.state.data.about}></textarea>
                  </div>


                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="isActive" checked={this.state.data.isActive}
                             onChange={this.onStatusChange.bind(this)}/>
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

};

export default MlEditSubDomain = formHandler()(MlEditSubDomain);
