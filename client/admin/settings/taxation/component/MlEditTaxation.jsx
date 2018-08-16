import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import ScrollArea from 'react-scrollbar'
import MlTaxTable from './MlTaxTable'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findTaxationActionHandler} from '../actions/findTaxationAction';
import {updateTaxationActionHandler} from '../actions/updateTaxationAction';
import {initalizeFloatLabel, OnToggleSwitch} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'

class MlAddTaxation extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      loading:true,
      data:{},
      taxInformation:[]
    }
    this.addEventHandler.bind(this);
    this.editTaxation.bind(this)
    return this;
  }
  componentWillMount() {

    const resp=this.findTaxation();
    return resp;
  }

  componentDidUpdate(){
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }

  getTaxTableDetails(taxTypeInfo){
    console.log(taxTypeInfo)
    this.setState({taxInformation:taxTypeInfo})
  }
  async addEventHandler() {
    const resp=await this.createTaxation();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {

    FlowRouter.go("/admin/settings/taxationList");
  };
  async findTaxation(){
    let TaxationId=this.props.config
    const response = await findTaxationActionHandler(TaxationId);
    this.setState({loading:false,data:response});
  }
  async  editTaxation() {
    let taxation = {
      taxationName: this.refs.taxationName.value,
      taxationValidityFrom: this.refs.taxationValidityFrom.value,
      taxationValidityTo: this.refs.taxationValidityTo.value,
      aboutTaxation: this.refs.aboutTaxation.value,
      isActive: this.refs.isActive.checked,
      taxInformation: this.state.taxInformation
    }
    if(taxation.taxationName){
      let TaxationDetails={
        id:this.props.config,
        taxation:taxation
      }
      const response = await updateTaxationActionHandler(TaxationDetails)
      return response;
    }else{
      toastr.error("'Tax Name' is mandatory");
      return false
    }


  }
  onClickDate(event){
    let filedName=event.target.name
    let fieldId=filedName+id
    $("#"+fieldId).datepicker({ format: this.state.dateformate });
    $("#"+fieldId).focus();
  }
  onStatusChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"data":{"isActive":true}});
    }else{
      this.setState({"data":{"isActive":false}});
    }
  }
  componentDidMount(){
    $('.switch input').change(function() {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      }else{
        $(this).parent('.switch').removeClass('on');
      }
    });
  }
  render(){
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.editTaxation.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/taxationList")

        }
      }
    ]
    const showLoader=this.state.loading;
    return (
      <div>
        {showLoader===true?(<MlLoader/>):(

      <div className="admin_main_wrap">


        <div className="admin_padding_wrap">
          <h2>Edit Taxation</h2>
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
                    <div className="form-group">
                      <input type="text" ref="taxationName" defaultValue={this.state.data&&this.state.data.taxationName} placeholder="Taxation Name" className="form-control float-label" id="cluster_name"/>

                    </div>
                    <div className="form-group">

                   <textarea ref="aboutTaxation"  defaultValue={this.state.data&&this.state.data.aboutTaxation} placeholder="About" className="form-control float-label" id="cl_about">
                    </textarea>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg">
                  <form>
                    <div className="form-group col-md-6 nopadding-left">
                      {/* <input type="text" ref="taxationValidityFrom" placeholder="Valid from" className="form-control float-label" id="cluster_name"/>*/}
                      <input type="text"  defaultValue={this.state.data&&this.state.data.taxationValidityFrom} placeholder="Valid from" ref="taxationValidityFrom" onClick={this.onClickDate.bind(this)} className="form-control float-label" name={'validFrom'}   id="#validFrom"/>
                      <FontAwesome name='calendar' className="password_icon" />
                    </div>
                    <div className="form-group col-md-6 nopadding-right">
                      <input type="text" defaultValue={this.state.data&&this.state.data.taxationValidityTo} ref="taxationValidityTo" placeholder="Valid to" className="form-control float-label" id="cluster_name"/>
                      <FontAwesome name='calendar' className="password_icon"/>
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
              <br className="brclear"/>

              < MlTaxTable getTaxTableDetails={this.getTaxTableDetails.bind(this)} taxTableDetails={this.state.data&&this.state.data.taxInformation}/>

            </ScrollArea>
          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

        </div>
      </div>)}
      </div>


    )
  }
};
export default MlAddTaxation = formHandler()(MlAddTaxation);
