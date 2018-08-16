/**
 * Created by pankaj on 6/6/17.
 */
import React, {Component} from "react";
import {findOfficeAction} from "../actions/findOfficeAction";
import MlLoader from "../../../../commons/components/loader/loader";
import {getOfficeTransactionPaymentLinkActionHandler} from './../actions/getOfficeTransactionPaymentLink';
export default class MlAppPayOfficeSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, office: {}, transaction:{},"data":""};
    this.officeDetails.bind(this);
    this.getPaymentData = this.getPaymentData.bind(this);
    return this;
  }
  componentDidMount() {
    var swiper = new Swiper('.profile_container', {
      pagination: '.swiper-pagination',
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      initialSlide: 1,
      slidesPerView: 'auto',
      coverflow: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      },
      paymentObject:{},
      paymentObjectLoading:true,
      paymentError:false
    });
    let status = FlowRouter.getQueryParam('status');
    if(status.toLowerCase() == "canceled"){
      toastr.error("Payment was cancelled");
    }else if(status.toLowerCase() == "success"){
      toastr.success("Payment was processed successfully");
    }
    //this.payClick();
  }

  componentWillMount() {
    const resp = this.officeDetails();

    return resp;

  }

  async officeDetails() {
    let officeId = this.props.config
    let response = await findOfficeAction(officeId);
    if (response && response.success) {
      let data = JSON.parse(response.result)
      console.log(data)
      let obj = data [0];
      this.setState({loading: false, office: obj.office, transaction: obj.officeTransaction})
      this.getPaymentData();
    } else {
      this.setState({loading: false})
    }
  }

  async getPaymentData(){
    let transactionId = this.state && this.state.transaction && this.state.transaction.transactionId ? this.state.transaction.transactionId : '';
    if(transactionId){
      let resposne = await getOfficeTransactionPaymentLinkActionHandler(transactionId);
      if(resposne.success){
        this.setState({"paymentObjectLoading":false})

        let result = JSON.parse(resposne.result);
        console.log(result);
        this.setState({"paymentObject":result});
      }else{
        this.setState({"paymentError":true})
      }
    }
  }

  payClick() {

    // let transactionId = this.state && this.state.transaction && this.state.transaction.transactionId ? this.state.transaction.transactionId : '';
    // if(transactionId){
    //   let resposne = await getOfficeTransactionPaymentLinkActionHandler(transactionId);
    //   if(resposne.success){
    //     let result = JSON.parse(resposne.result);
    //     //window.location = resposne.result;
    //     // axios.post(result.paymentUrl,result.paymentInfo).then(function (response) {
    //     //     console.log(response);
    //     //   })
    //     //   .catch(function (error) {
    //     //     console.log(error);
    //     //   });
    //     //this.setState({"data":{"sign":result.paymentInfo.secSignature,merchantTxnId:result.paymentInfo.merchantTxnId}})

    //     //$("[name='merchantTxnId']").val(result.paymentInfo.merchantTxnId);
    //     //$("[name='secSignature']").val(result.paymentInfo.secSignature);
    //     setTimeout(function (){
    //       $("#testForm").trigger("submit");
    //     },500)

    //   } else {
    //     toastr.error(resposne.result);
    //   }
    // } else {
    //   // TransactionId is missing
    //   toastr.error('Unable to proceed payment.');
    // }
    if(!this.state.paymentError){
       $("#paymentForm").trigger("submit");
    }else{
      toastr.error('Unable to process payment');
    }


    // let officeAmount = this.state.transaction && this.state.transaction.orderSubscriptionDetails && this.state.transaction.orderSubscriptionDetails.cost ? this.state.transaction.orderSubscriptionDetails.cost : "00"
    // var data = {
    //   officeId: this.props.config,
    //   amount: officeAmount,
    //   transactionId: this.state.transaction && this.state.transaction.transactionId
    // }
    // var header = {apiKey: "741432fd-8c10-404b-b65c-a4c4e9928d32"};
    // $.ajax({
    //   type: 'POST',
    //   dataType: 'json',
    //   url: Meteor.absoluteUrl('moolyaPaymentStatus'),
    //   data: JSON.stringify(data),
    //   headers: header,
    //   contentType: "application/json; charset=utf-8",
    //   success: function (response) {
    //     if (response.success) {
    //       toastr.success(response.result);
    //       FlowRouter.go("/app/myOffice")
    //     } else {
    //       toastr.error(response.result);
    //     }
    //   }
    // });
  }

  render() {
    const showLoader = this.state.loading;
    return (
      <div className="app_main_wrap">
        {showLoader === true ? ( <MlLoader/>) : (
        <div className="app_padding_wrap no_padding">
          <div className="list_view_block">
            <div className="col-md-12 text-center">
              <div className="col-md-offset-3 col-md-6 col-sm-6 col-xs-6 new-ideas3">
                <div className="col-md-6">
                </div>
                <div className="col-md-6 subscription">
                  <h3>Subscription</h3>

                  <ul>
                    <li>Validity</li>
                    <li>: 1Year</li>
                    <li>Includes</li>
                    <li>:</li>
                    <li>Principal</li>
                    <li>: {this.state.office && this.state.office.principalcount?this.state.office.principalcount:"00"}</li>
                    <li>Team</li>
                    <li>: {this.state.office && this.state.office.teamMembercount?this.state.office.teamMembercount:"00"}</li>
                    <li>Cost</li>
                    <li>
                      : {this.state.transaction && this.state.transaction.orderSubscriptionDetails && this.state.transaction.orderSubscriptionDetails.cost ? this.state.transaction.orderSubscriptionDetails.cost : "00"}
                      {this.state.transaction && this.state.transaction.orderSubscriptionDetails && this.state.transaction.orderSubscriptionDetails.isTaxInclusive?<b> tax inclusive</b>:<b> tax exclusive</b>}
                    </li>
                  </ul>

                  <br />
                  <a className="ideabtn" onClick={this.payClick.bind(this)}>Pay</a>
                  <form id="paymentForm" method="post" action={this.state.paymentObject ? this.state.paymentObject.paymentUrl : ""}>
                    <input type="hidden" id="merchantTxnId" name="merchantTxnId" value={this.state.paymentObject && this.state.paymentObject.paymentInfo ? this.state.paymentObject.paymentInfo.merchantTxnId : ""} />
                    <input type="hidden" id="orderAmount" name="orderAmount" value={this.state.paymentObject && this.state.paymentObject.paymentInfo ? this.state.paymentObject.paymentInfo.orderAmount : ""} />
                    <input type="hidden" id="currency" name="currency" value="INR" />
                      <input type="hidden" id="email" name="email" value={this.state.paymentObject && this.state.paymentObject.paymentInfo ? this.state.paymentObject.paymentInfo.email : ""} />
                    <input type="hidden" id="phoneNumber" name="phoneNumber" value={this.state.paymentObject && this.state.paymentObject.paymentInfo ? this.state.paymentObject.paymentInfo.phoneNumber : ""} />
                    <input type="hidden" name="returnUrl" value={this.state.paymentObject && this.state.paymentObject.paymentInfo ? this.state.paymentObject.paymentInfo.returnUrl : ""} />
                    <input type="hidden" id="notifyUrl" name="notifyUrl" value={this.state.paymentObject && this.state.paymentObject.paymentInfo ? this.state.paymentObject.paymentInfo.returnUrl: ""} />
                    <input type="hidden" id="secSignature" name="secSignature" value={this.state.paymentObject && this.state.paymentObject.paymentInfo ? this.state.paymentObject.paymentInfo.secSignature : ""} />
                    <input type="hidden" id="mode" name="mode" value="LIVE" />

     </form>
                </div>
              </div>
            </div>
          </div>
        </div>)}
      </div>
    )
  }
};
