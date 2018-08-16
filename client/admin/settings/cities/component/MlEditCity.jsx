import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findCityActionHandler} from '../actions/findCityAction'
import {updateCityActionHandler} from '../actions/updateCityAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'
class MlEditCity extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.editCity.bind(this);
    this.findCity.bind(this);
    return this;
  }
  componentDidMount() {
    if(this.state.data.isAcive){
      $('#status').prop('checked', true);
    }
  }

  componentDidUpdate(){
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }

  componentWillMount() {
    const resp=this.findCity();
    return resp;
  }

  async addEventHandler() {
    const resp=await this.editCity();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/citiesList");
      else
        toastr.error(response.result);
    }
  };

  async  findCity() {
    let id = this.props.config
    const response = await findCityActionHandler(id);
    this.setState({loading:false,data:response});

  }

  async  editCity() {
    let CountryDetails = {
      id: this.refs.id.value,
      // name: this.refs.name.value,
      // countryCode: this.refs.countryName.value,
      // stateId: this.refs.stateName.value,
      displayName: this.refs.displayName.value,
      about: this.refs.about.value,
      isActive: this.refs.status.checked
    };
    const response = await updateCityActionHandler(CountryDetails)
    return response;

  }
  onStatusChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"data":{"isActive":true}});
    }else{
      this.setState({"data":{"isActive":false}});
    }
  }

  render(){
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.editCity.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      // {
      //   showAction: true,
      //   actionName: 'add',
      //   handler: null
      // },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          this.props.handler(" ");
          FlowRouter.go("/admin/settings/citiesList")
        }
      }
    ]
    const showLoader=this.state.loading;

    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(
          <div className="admin_padding_wrap">
            <h2>Edit City</h2>
            <div className="col-md-6 nopadding-left">
              <input type="text" ref="id" defaultValue={this.state.data._id} hidden="true"/>
              <div className="form_bg">
                <form>
                  <div className="form-group">
                    <input type="text" ref="countryName" defaultValue={this.state.data && this.state.data.countryCode} placeholder="Country Name" className="form-control float-label" readOnly="readOnly" disabled="disabled"/>

                  </div>
                  <div className="form-group">
                    <input type="text" ref="name" defaultValue={this.state.data && this.state.data.name} placeholder="City Name" className="form-control float-label" readOnly="readOnly" disabled="disabled"/>

                  </div>
                  <div className="form-group">
                    <textarea placeholder="About" ref="about" defaultValue={this.state.data && this.state.data.about} className="form-control float-label"></textarea>

                  </div>

                </form>
              </div>
            </div>
            <div className="col-md-6 nopadding-right">
              <div className="form_bg">
                <form>
                  <div className="form-group">
                    <input type="text" ref="stateName" defaultValue={this.state.data && this.state.data.stateId} placeholder="State Name" className="form-control float-label" id="" disabled="disabled"/>

                  </div>

                  <div className="form-group">
                    <input type="text" ref="displayName" defaultValue={this.state.data && this.state.data.displayName} placeholder="Display Name" className="form-control float-label" id=""/>

                  </div>

                  <div className="form-group switch_wrap inline_switch">
                    <label>Available on System</label>
                    <label className="switch">
                      <input type="checkbox" ref="status" checked={this.state.data && this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
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

export default MlEditCity = formHandler()(MlEditCity);
