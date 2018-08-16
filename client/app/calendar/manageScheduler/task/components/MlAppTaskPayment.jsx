import React, {Component} from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import MlLoader from "../../../../../commons/components/loader/loader";
import {findTaskActionHandler} from "../actions/saveCalanderTask";
import { fetchCurrencyTypeActionHandler } from '../../../../../commons/actions/mlCurrencySymbolHandler'

export default class MlAppTaskPayment extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {}, currencySymbol:""
    }
    this.findTaskDetails.bind(this);
    this.handleBlurAmount.bind(this);
    this.handleBlurPercent.bind(this);
    return this;
  }
  isUpdated(){
    return true;
  }
  componentWillMount() {
    const resp = this.findTaskDetails();
    this.getCurrencyType();
    this.props.activeComponent(3);
    return resp;
  }

  async getCurrencyType() {
    let profileId = FlowRouter.getParam('profileId');
    const response = await fetchCurrencyTypeActionHandler(this.props.client, null, null, profileId);
    this.setState({currencySymbol: response.symbol})
    return response;
  }

  async findTaskDetails() {
    let taskId = this.props.taskId
    if (taskId) {
      var response = await findTaskActionHandler(taskId);
      if (!_.isEmpty(response)) {
        console.log(response)
        this.setState({loading: false, data: response, prevDerivedAmount: response.payment && response.payment.derivedAmount});
      }
      return response
    } else {
      this.setState({loading: false});
    }
  }

  handleBlurAmount(e) {
    let details = this.state.data
    let name = 'discountValue';
    let value = e.target.value || 0;
    let amount = this.state.data.payment ? this.state.data.payment.activitiesDerived : 0;
    let derivedAmount = 0;
    if (!isNaN(value)) {
      derivedAmount = Number(amount) - Number(value)
    }
    details['payment'] = _.omit(details['payment'], [name]);
    details['payment'] = _.omit(details['payment'], ['derivedAmount']);
    details['payment'] = _.extend(details['payment'], {[name]: value, 'derivedAmount': derivedAmount});
    this.setState({data: details}, function () {
      this.sendTaskPaymentToParent()
    })
  }

  handleBlurPercent(e) {
    let details = this.state.data
    let name = 'discountValue';
    let value = e.target.value || 0;
    let amount = this.state.data.payment ? this.state.data.payment.activitiesDerived : 0;
    let derivedAmount = 0;
    if (!isNaN(value)) {
      derivedAmount = Number(amount) - Number((Number(value)/100)*Number(amount))
    }
    details['payment'] = _.omit(details['payment'], [name]);
    details['payment'] = _.omit(details['payment'], ['derivedAmount']);
    details['payment'] = _.extend(details['payment'], {[name]: value, 'derivedAmount': derivedAmount});
    this.setState({data: details}, function () {
      this.sendTaskPaymentToParent()
    })
  }

  onStatusChange(e) {
    let details = this.state.data;
    let name = e.target.name;
    details['payment'] = _.omit(details['payment'], [name]);
    details['payment'] = _.extend(details['payment'], {[name]: !e.currentTarget.checked});
    if (!details.payment.isDiscount) {
      details['payment'] = _.extend(details['payment'], {
        discountType: '',
        discountValue: 0,
        derivedAmount: details.payment.activitiesDerived
      });
    }
    this.setState({data: details}, function () {
      this.sendTaskPaymentToParent()
    })
  }

  discountAmount() {
    let details = this.state.data
    let name = 'discountType';
    details['payment'] = _.omit(details['payment'], [name]);
    details['payment'] = _.omit(details['payment'], ['derivedAmount']);
    details['payment'] = _.extend(details['payment'], {[name]: 'amount', 'derivedAmount': this.state.prevDerivedAmount, discountValue: 0});
    this.setState({data: details}, function () {
      this.sendTaskPaymentToParent()
    })
    console.log('amount click')
  }

  discountPercent() {
    let details = this.state.data
    let name = 'discountType';
    details['payment'] = _.omit(details['payment'], [name]);
    details['payment'] = _.omit(details['payment'], ['derivedAmount']);
    details['payment'] = _.extend(details['payment'], {[name]: 'percent', 'derivedAmount': this.state.prevDerivedAmount, discountValue: 0});
    this.setState({data: details}, function () {
      this.sendTaskPaymentToParent()
    })
    console.log('percent click')
  }

  sendTaskPaymentToParent() {
    let data = this.state.data;
    this.errorMsg = '';
    if (data.payment && data.payment.isDiscount) {
      if(data.payment.activitiesDerived === '' || typeof data.payment.activitiesDerived === 'undefined' || data.payment.activitiesDerived === null ){
        this.errorMsg = 'Payable amount is required';
        toastr.error(this.errorMsg);
        return false;
      }
      switch (data.payment.discountType) {
        case 'amount':
          if(isNaN(data.payment.discountValue)) {
            this.errorMsg = 'Please enter a valid number';
          } else if (parseFloat(data.payment.discountValue) > parseFloat(data.payment.activitiesDerived)) {
            this.errorMsg = 'Amount must be equal or less than the payable amount'
          }
          break;
        case 'percent':
          if(isNaN(data.payment.discountValue)) {
            this.errorMsg = 'Please enter a valid number';
          } else if (parseFloat(data.payment.discountValue) > 100) {
            this.errorMsg = 'Percent must be equal or less than 100'
          }
          break;
        default:
          this.errorMsg = '';
      }
    }
    if (!this.errorMsg) {
     this.props.getPaymentDetails(data);
    } else {
      toastr.error(this.errorMsg);
    }
  }
  handleNull(){
    console.log('null')
  }

  componentDidMount() {
    $('.float-label').jvFloat();
    setTimeout(function () {
      let WinHeight = $(window).height();
      $('.step_form_wrap').height(WinHeight - (300 + $('.app_header').outerHeight(true)));
    },100);

  }

  render() {
    const showLoader = this.state.loading;
    const data = this.state.data;
    return (
      <div className="step_form_wrap step1">
        {showLoader === true ? ( <MlLoader/>) : (
          <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
            <div className="centered_form">
              <form>
                <div className="form-group">
                  <label>Activity gross payable amount &nbsp;<label>{data.payment && data.payment.currencyType ? data.payment.currencyType : this.state.currencySymbol}</label>&nbsp;<input className="form-control inline_input medium_in"
                                                         defaultValue={(data.payment && data.payment.activitiesAmount) ? parseFloat(data.payment.activitiesAmount).toFixed(2) : '' } disabled="true"/>
                  </label>
                </div>
                <div className="form-group">
                  <label>Activity discount payable amount &nbsp;<label>{data.payment && data.payment.currencyType ? data.payment.currencyType : this.state.currencySymbol}</label>&nbsp;<input className="form-control inline_input medium_in"
                                                         defaultValue={(data.payment && data.payment.activitiesDiscount) ? parseFloat(data.payment.activitiesDiscount).toFixed(2) : '' } disabled="true"/>
                  </label>
                </div>
                <div className="form-group">
                  <label>Activity net payable amount &nbsp;<label>{data.payment && data.payment.currencyType ? data.payment.currencyType : this.state.currencySymbol}</label>&nbsp;<input className="form-control inline_input medium_in"
                                                         defaultValue={(data.payment && data.payment.activitiesDerived) ? parseFloat(data.payment.activitiesDerived).toFixed(2) : '' } disabled="true"/>
                  </label>
                </div>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label>Is Eligible for discount</label>
                  <span  htmlFor="discount" className={(data.payment && data.payment.isDiscount) ? 'state_label acLabel' : 'state_label'}>Yes</span><label className="switch nocolor-switch">
                  <input id="discount" type="checkbox" name="isDiscount"
                         checked={!(data.payment && data.payment.isDiscount)}
                         onChange={this.onStatusChange.bind(this)}/>
                  <div className="slider"></div>
                </label>
                  <span className={(data.payment && data.payment.isDiscount) ? 'state_label' : 'state_label acLabel'}>No</span>
                </div>
                <br className="brclear"/>
                <div className="form-group">
                  <div className="input_types">
                    <input id="radio1" type="radio" name="radio1" value="1"
                           disabled={!(data.payment && data.payment.isDiscount)}
                           checked={(data.payment && data.payment.discountType == 'amount') ? true : false}
                           onChange={this.discountAmount.bind(this)}/><label
                    htmlFor="radio1"><span><span></span></span>Amount
                     {(data.payment && data.payment.discountType == 'amount') ? <input
                      className="form-control inline_input"
                      disabled={!(data.payment && data.payment.isDiscount)}
                      defaultValue={(data.payment && data.payment.discountValue)}
                      onChange={this.handleBlurAmount.bind(this)}/> : ''}</label>
                  </div>
                  <div className="input_types">
                    <input id="radio2" type="radio" name="radio1" value="2"
                           checked={(data.payment && data.payment.discountType == 'percent') ? true : false}
                           disabled={!(data.payment && data.payment.isDiscount)}
                           onChange={this.discountPercent.bind(this)}/><label
                    htmlFor="radio2"><span><span></span></span>Percentage {(data.payment && data.payment.discountType == 'percent') ?
                    <input className="form-control inline_input"
                           disabled={!(data.payment && data.payment.isDiscount)}
                           defaultValue={(data.payment && data.payment.discountValue)}
                           onChange={this.handleBlurPercent.bind(this)}/> : ''}
                    %
                  </label>
                  </div>
                  <br className="brclear"/>
                </div>
                <div className="form-group">
                  <label>Net payable amount &nbsp;<label>{data.payment && data.payment.currencyType ? data.payment.currencyType :this.state.currencySymbol}</label>&nbsp;<input className="form-control inline_input medium_in"
                                                   onChange={this.handleNull.bind(this)}
                                                   value={(data.payment && data.payment.derivedAmount) ? parseInt(data.payment.derivedAmount).toFixed(2) :''}
                                                   disabled />
                  </label>
                </div>
              </form>
            </div>
          </ScrollArea>)}
      </div>
    )
  }
  // key={(this.state.data.payment && this.state.data.payment.derivedAmount)? 'notLoadedYet' : 'loaded'}
};
