import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
import {findAccountTypeActionHandler} from '../actions/findAccountTypeAction'
import {updateAccountTypeActionHandler} from '../actions/updateAccountTypeAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'
class MlEditTransactionType extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading:true,data:{}};
    this.updateAccountType.bind(this)
    this.findAccountType.bind(this);
    return this;
  }

  componentWillMount() {
    const resp=this.findAccountType();
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

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/accountTypeList");
      else
        toastr.error(response.result);
    }
  };

  async findAccountType(){
    let AccountTypeId = this.props.config
    const response = await findAccountTypeActionHandler(AccountTypeId);
    this.setState({loading:false,data:response});
  }
  async  updateAccountType() {
    let AccountType = {
      id: this.refs.id.value,
      accountName: this.refs.accountName.value,
      accountDisplayName: this.refs.accountDisplayName.value,
      accountDescription: this.refs.accountDescription.value,
      isActive: this.refs.isActive.checked
    }
    const response = await updateAccountTypeActionHandler(AccountType)
    toastr.success("'Account type' updated successfully")
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
        handler: async(event) => this.props.handler(this.updateAccountType.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
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
          FlowRouter.go("/admin/settings/accountTypeList")
        }
      }
    ];

    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(
            <div className="admin_padding_wrap">
              <h2>Edit Account Type</h2>
              <div className="col-md-6 nopadding-left">
                <div className="form_bg">
                  <form>
                  <div className="form-group">
                    <input type="text" ref="id" defaultValue={this.state.data&&this.state.data.id} hidden="true"/>
                    <input type="text" ref="accountName" placeholder="Name" defaultValue={this.state.data&&this.state.data.accountName} className="form-control float-label" id=""/>

                  </div>
                  <div className="form-group">
                    <textarea  ref="accountDescription" placeholder="About" defaultValue={this.state.data&&this.state.data.accountDescription}className="form-control float-label" id=""></textarea>

                  </div>
                    </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg">
                  <form>
                  <div className="form-group">
                    <input type="text" ref="accountDisplayName" placeholder="Display Name" defaultValue={this.state.data&&this.state.data.accountDisplayName} className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group switch_wrap">
                    <label>Status</label><br/>
                    <label className="switch">
                      <input type="checkbox" ref="isActive" checked={this.state.data&&this.state.data.isActive} onChange={this.onStatusChange.bind(this)}/>
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

export default MlEditTransactionType = formHandler()(MlEditTransactionType);
