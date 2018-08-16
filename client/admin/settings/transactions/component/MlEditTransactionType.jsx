import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findTransactionTypeActionHandler} from '../actions/findTransactionypeAction'
import {updateTransactionTypeActionHandler} from '../actions/updateTransactionTypeAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'
class MlEditTransactionType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.addEventHandler.bind(this);
    this.updateTransactionType.bind(this)
    this.findTransactionType.bind(this);
    return this;
  }

  componentWillMount() {

    const resp=this.findTransactionType();
    return resp;

  }
  componentDidMount(){
    /*if(this.state.data.isActive){
      $('#status').prop('checked', true);
    }*/
  }

  componentDidUpdate(){
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }

  async addEventHandler() {
   // const resp=await this.findRequestType
  //  return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/transactionTypeList");
      else
        toastr.error(response.result);
    }
  };

  async findTransactionType(){
    let TransactionTypeId=this.props.config
    const response = await findTransactionTypeActionHandler(TransactionTypeId);
    this.setState({loading:false,data:response});
  }
  async  updateTransactionType() {
    let TransactionType = {
      id: this.refs.id.value,
      transactionName: this.refs.transactionName.value,
      transactionDisplayName: this.refs.transactionDisplayName.value,
      transactionDescription: this.refs.transactionDescription.value,
      // isActive: this.refs.isActive.checked
    }
    const response = await updateTransactionTypeActionHandler(TransactionType)
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
        handler: async(event) => this.props.handler(this.updateTransactionType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
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
          FlowRouter.go("/admin/settings/transactionTypeList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(

        <div className="admin_padding_wrap">
          <h2>Edit Transaction Type</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                  <input type="text" ref="transactionName" placeholder="Name" defaultValue={this.state.data&&this.state.data.transactionName} className="form-control float-label"  disabled="disabled"/>

                </div>
                <div className="form-group">
                  <textarea  ref="transactionDescription" placeholder="About" defaultValue={this.state.data&&this.state.data.transactionDescription}className="form-control float-label" id=""></textarea>

                </div>
                </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" ref="transactionDisplayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.transactionDisplayName} className="form-control float-label"  disabled="disabled"/>
                </div>
               {/*<div className="form-group switch_wrap inline_switch">*/}
                  {/*<label>Status</label>*/}
                  {/*<label className="switch">*/}
                    {/*<input type="checkbox" ref="isActive" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>*/}
                    {/*<div className="slider"></div>*/}
                  {/*</label>*/}
                {/*</div>*/}
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

export default MlEditTransactionType = formHandler()(MlEditTransactionType);
