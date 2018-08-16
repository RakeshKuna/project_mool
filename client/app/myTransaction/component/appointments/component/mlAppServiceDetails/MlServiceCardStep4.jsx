/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This is the list view
 * JavaScript XML file MlserviceCardsList.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React from 'react';
import FontAwesome from 'react-fontawesome';
import ScrollArea from 'react-scrollbar';
import { MoolyaToggleSwitch } from '../../../../../../commons/utils/formElemUtil';

export default class MlServiceCardStep4 extends React.Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */

  constructor(props) {
    super(props);
  }

  /**
   * ComponentDidMount
   * Desc :: Initializing the float labels
   */

  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (310 + $('.admin_header').outerHeight(true)));
  }

  /**
   * componentDidUpdate
   * Desc :: Updates the Toggle Switch
   */

  componentDidUpdate() {
    MoolyaToggleSwitch(true, true);
  }

  /**
   * Render
   * Desc   :: Render the HTML for this component
   * @returns {HTML}
   */

  render() {
    const {
      servicePayment,
      facilitationCharge,
      taxStatus,
      finalAmount } = this.props.data;
    const { checkChargeStatus, calculateCharges, saveServicePaymentDetails } = this.props;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <div className="centered_form">
            <form>
              <div className="form-group">
                <label>
                  Tasks gross payable amount &nbsp;<label>Rs</label>&nbsp;
                  <input type="number" disabled value={servicePayment.tasksAmount} className="form-control inline_input medium_in" />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Task discount payable amount &nbsp;<label>Rs</label>&nbsp;
                  <input type="number" disabled value={servicePayment.tasksDiscount} className="form-control inline_input medium_in" />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Task net payable amount &nbsp;<label>Rs</label>&nbsp;
                  <input type="number" disabled value={servicePayment.tasksDerived} className="form-control inline_input medium_in" />
                </label>
              </div>
              <div className="form-group switch_wrap switch_names inline_switch">
                <label htmlFor="discount">Is Eligible for discount</label>
                <span className={servicePayment.isDiscount ? 'state_label acLabel' : 'state_label'}>Yes</span><label htmlFor="discount" className="switch nocolor-switch">
                  <input type="checkbox" id="discount"
                    checked={!servicePayment.isDiscount}
                    value={servicePayment.isDiscount} disabled />
                  <div className="slider"></div>
                </label>
                <span className={servicePayment.isDiscount ? 'state_label' : 'state_label acLabel'}>No</span>
              </div>
              <br className="brclear" />
              <div className="form-group">
                <div className="input_types">
                  <input id="amount" type="radio" name="amount"
                    value="Amount" checked={servicePayment.discountType === 'amount' ? true : false}
                    disabled />
                  <label htmlFor="amount"><span><span></span></span>Amount
                    {servicePayment.discountType === 'amount' ?
                      <input className="form-control inline_input"
                        disabled
                        value={servicePayment.discountValue} /> : <div></div>}
                  </label>
                </div>
                <div className="input_types">
                  <input id="percent" type="radio" name="percent"
                    value="Percentage" checked={servicePayment.discountType === 'percent' ? true : false}
                    disabled />
                  <label htmlFor="percent"><span><span></span></span>
                    Percentage{servicePayment.discountType === 'percent' ?
                      <input className="form-control inline_input" disabled
                        value={servicePayment.discountValue} /> : <div></div>}
                  </label>
                </div>
                <br className="brclear" />
              </div>
              <div className="form-group">
                <div className="input_types">
                  <input id="taxinclusive" type="radio" name="taxinclusive"
                    value="taxinclusive" checked={taxStatus === 'taxinclusive' ? true : false}
                    disabled />
                  <label htmlFor="taxinclusive"><span><span></span></span>Tax Inclusive</label>
                </div>
                <div className="input_types">
                  <input id="taxexclusive" type="radio" name="taxexclusive"
                    value="taxexclusive" checked={taxStatus === 'taxexclusive' ? true : false}
                    disabled />
                  <label htmlFor="taxexclusive"><span><span></span></span>Tax Exclusive </label>
                </div>
                <br className="brclear" />
              </div>
              <div className="form-group switch_wrap switch_names inline_switch">
                <label htmlFor="promo">Is Applicable for PROMOCODE</label>
                <span className={servicePayment.isPromoCodeApplicable ? 'state_label acLabel' : 'state_label'}>Yes</span><label htmlFor="promo" className="switch nocolor-switch">
                  <input id="promo" type="checkbox" checked={!servicePayment.isPromoCodeApplicable}
                    value={servicePayment.isPromoCodeApplicable} disabled />
                  <div className="slider"></div>
                </label>
                <span className={servicePayment.isPromoCodeApplicable ? 'state_label' : 'state_label acLabel'}>No</span>
              </div>
              <br className="brclear" />
              <div className="form-group">
                <label>Enter facilitation charges &nbsp; &nbsp;</label>
                <div className="input_types">
                  <input id="amount" type="radio"
                    name="facilitationamount"
                    checked={facilitationCharge.type === 'amount' ? true : false}
                    onChange={(event) => checkChargeStatus(event)}
                    disabled={true}
                    value="amount" />
                  <label htmlFor="facilitationamount"><span><span></span></span>Amount
                    {facilitationCharge.type === 'amount' ?
                      <input className="form-control inline_input"
                        disabled={true}
                        defaultValue={facilitationCharge.type === 'amount' ? facilitationCharge.amount : ''}
                        onChange={(event) => calculateCharges(event)} /> : <div></div>
                    }
                  </label>
                </div>
                <div className="input_types">
                  <input id="percent" type="radio" disabled={true}
                    name="facilitationpercent"
                    checked={facilitationCharge.type === 'percent' ? true : false}
                    onChange={(event) => checkChargeStatus(event)}
                    value="percent" />
                  <label htmlFor="radio2"><span><span></span></span>Percentage
                    {facilitationCharge.type === 'percent' ?
                      <input className="form-control inline_input" disabled={true}
                        defaultValue={facilitationCharge.type === 'percent' ? facilitationCharge.amount : ''}
                        onChange={(event) => calculateCharges(event)}
                      /> : <div></div>
                    }
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Net payable amount &nbsp;<label>Rs</label>&nbsp;<input className="form-control inline_input medium_in"
                  value={finalAmount} disabled />
                </label>
              </div>
            </form>
          </div>
          {/* <div className="ml_btn" style={{ 'textAlign': 'center' }}>
            <div className="save_btn" onClick={() => saveServicePaymentDetails('saved')}>Save</div>
            <div className="save_btn" onClick={() => saveServicePaymentDetails('approved')}>Approve</div>
            <div className="cancel_btn" onClick={() => saveServicePaymentDetails('rejected')}>Reject</div>
          </div> */}
        </ScrollArea>
      </div>
    )
  }
};
