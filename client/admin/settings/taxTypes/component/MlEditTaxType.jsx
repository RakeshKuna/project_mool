import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findTaxTypeActionHandler} from '../actions/findTaxTypeAction'
import {updateTaxTypeActionHandler} from '../actions/updateTaxTypeAction'
import {initalizeFloatLabel,OnToggleSwitch} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'
class MlEditTaxType extends React.Component{

  componentDidMount(){


  }
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateTaxType.bind(this)
    this.findTaxType.bind(this);
    return this;
  }


  componentDidUpdate(){
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.admin_main_wrap ').height(WinHeight-$('.admin_header').outerHeight(true));
  }

  componentWillMount() {

    const resp=this.findTaxType();
    return resp;

  }

  async addEventHandler() {
    // const resp=await this.findRequestType
    //  return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    FlowRouter.go("/admin/settings/taxTypeList");
  };
  async findTaxType(){
    let TaxTypeId=this.props.config
    const response = await findTaxTypeActionHandler(TaxTypeId);
    this.setState({loading:false,data:response});
  }
  async  updateTaxType() {
    let TaxType = {
      id: this.props.config,
      taxName: this.refs.taxName.value,
      taxDisplayName: this.refs.taxDisplayName.value,
      aboutTax: this.refs.aboutTax.value,
      isActive: this.refs.isActive.checked
    }
    const response = await updateTaxTypeActionHandler(TaxType)
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
        handler: async(event) => this.props.handler(this.updateTaxType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/taxTypeList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div>
        {showLoader===true?( <MlLoader/>):(
          <div className="admin_main_wrap">

            <div className="admin_padding_wrap">
              <h2>Edit Tax Type</h2>
              <div className="col-md-6 nopadding-left">
                <div className="form_bg">
                  <form>
                  <div className="form-group">
                    <input type="text" ref="taxName" placeholder="Name" defaultValue={this.state.data&&this.state.data.taxName} className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group">
                    <textarea  ref="aboutTax" placeholder="About" defaultValue={this.state.data&&this.state.data.aboutTax}className="form-control float-label" id=""></textarea>

                  </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg">
                  <form>
                  <div className="form-group">
                    <input type="text" ref="taxDisplayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.taxDisplayName} className="form-control float-label" id=""/>
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
          </div>
        )}

      </div>

    )
  }
};

export default MlEditTransactionType = formHandler()(MlEditTaxType);
