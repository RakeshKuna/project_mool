import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findCompanyTypeActionHandler} from '../actions/findCompanyTypeAction'
import {updateCompanyTypeActionHandler} from '../actions/updateCompanyTypeAction';
import {initalizeFloatLabel, OnToggleSwitch} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'

class MlEditCompanyType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateCompanyType.bind(this)
    this.findCompanyType.bind(this);
    return this;
  }

  componentWillMount() {

    const resp=this.findCompanyType();
    return resp;

  }
  componentDidMount(){
    /*if(this.state.data.isActive){
     $('#status').prop('checked', true);
     }*/
  }


  componentDidUpdate(){
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }

  async addEventHandler() {
    // const resp=await this.findRequestType
    //  return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    FlowRouter.go("/admin/settings/companyTypesList");
  };
  async findCompanyType(){
    let CompanyTypeId=this.props.config
    const response = await findCompanyTypeActionHandler(CompanyTypeId);
    this.setState({loading:false,data:response});
  }
  async  updateCompanyType() {
    let CmpType = {
      id: this.props.config,
      companyName: this.refs.companyName.value,
      companyDisplayName: this.refs.companyDisplayName.value,
      aboutCompany: this.refs.aboutCompany.value,
      isActive: this.refs.isActive.checked
    }
    const response = await updateCompanyTypeActionHandler(CmpType)
    toastr.success("Company type updated successfully")
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
        showAction: true,
        actionName: 'save',
        handler:(data) => {
          if (data) {
            this.updateCompanyType();
            FlowRouter.go("/admin/settings/companyTypesList")

          }
        }
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/companyTypesList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div>
        {showLoader===true?(<MlLoader/>):(
            <div className="admin_main_wrap">
              <div className="admin_padding_wrap">
                <h2>Edit Company Type</h2>
                <div className="col-md-6 nopadding-left">
                  <div className="form_bg">
                    <form>
                    <div className="form-group">
                      <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                      <input type="text" ref="companyName" placeholder="Name" defaultValue={this.state.data&&this.state.data.companyName} className="form-control float-label" id=""/>

                    </div>
                    <div className="form-group">
                      <textarea  ref="aboutCompany" placeholder="About" defaultValue={this.state.data&&this.state.data.aboutCompany}className="form-control float-label" id=""></textarea>

                    </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-6 nopadding-right">
                  <div className="form_bg">
                    <form>
                    <div className="form-group">
                      <input type="text" ref="companyDisplayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.companyDisplayName} className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group switch_wrap inline_switch">
                      <label>Status</label>
                      <label className="switch">
                        <input type="checkbox" ref="isActive" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
                        <div className="slider"></div>
                      </label>
                    </div>
                    </form>
                  </div>
                </div>
              </div>
              <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
              />

            </div>)}
      </div>

    )
  }
};

export default MlEditCompanyType = formHandler()(MlEditCompanyType);
