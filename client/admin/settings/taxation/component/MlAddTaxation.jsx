import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import ScrollArea from 'react-scrollbar'
import MlTaxTable from './MlTaxTable'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {addTaxationActionHandler} from '../actions/addTaxationAction';
import {initalizeFloatLabel} from '../../../utils/formElemUtil';
import Datetime from "react-datetime";

class MlAddTaxation extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      taxInformation:[]
    }
    this.addEventHandler.bind(this);
    this.createTaxation.bind(this)
    return this;
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

  async  createTaxation() {
    let TaxationDetails = {
      taxationName: this.refs.taxationName.value,
      taxationValidityFrom: this.refs.taxationValidityFrom.state.inputValue,
      taxationValidityTo: this.refs.taxationValidityTo.state.inputValue,
      aboutTaxation: this.refs.aboutTaxation.value,
      isActive: this.refs.isActive.checked,
      taxInformation: this.state.taxInformation
    }
    if(TaxationDetails.taxationName){
      const response = await addTaxationActionHandler(TaxationDetails)
      return response;
    }else{
      toastr.error("'Tax Name' is mandatory");
      return false
    }
  }

  componentDidMount(){
    initalizeFloatLabel();
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
      // {
      //   actionName: 'edit',
      //   showAction: true,
      //   handler: null
      // },
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createTaxation.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/taxationList")
        }
      }
    ]
    return (

      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Taxation</h2>
          <div className="main_wrap_scroll">
           {/* <ScrollArea
              speed={0.8}
              className="main_wrap_scroll"
              smoothScrolling={true}
              default={true}
            >*/}

          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" ref="taxationName" placeholder="Taxation Name" className="form-control float-label" id="cluster_name"/>
                </div>
                <div className="form-group">
                   <textarea ref="aboutTaxation" placeholder="About" className="form-control float-label" id="cl_about">
                    </textarea>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group col-md-6 nopadding-left">
                  <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}
                            inputProps={{placeholder: "Valid From",readOnly:true}}
                            closeOnSelect={true} ref="taxationValidityFrom"/>
                  <FontAwesome name='calendar' className="password_icon" />
                </div>
                <div className="form-group col-md-6 nopadding-right">
                  <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}
                            inputProps={{placeholder: "Valid to",readOnly:true}}
                            closeOnSelect={true} ref="taxationValidityTo"/>
                  <FontAwesome name='calendar' className="password_icon"/>
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
          <br className="brclear"/>

         < MlTaxTable getTaxTableDetails={this.getTaxTableDetails.bind(this)}/>

        <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
            {/*</ScrollArea>*/}
          </div>
        </div>
      </div>
    )
  }
};
export default MlAddTaxation = formHandler()(MlAddTaxation);
