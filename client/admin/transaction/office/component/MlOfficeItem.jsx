/**
 * Created by pankaj on 6/6/17.
 */

import React from 'react'
import{initalizeFloatLabel} from '../../../utils/formElemUtil'
import {findOfficeTransactionHandler} from '../actions/findOfficeTranscation'
import {updateSubcriptionDetail} from '../actions/updateSubscriptionDetail'
import {updateOfficeStatus} from '../actions/updateOfficeStatus'
import moment from 'moment'
import {getAdminUserContext} from '../../../../commons/getAdminUserContext'
import { fetchCurrencyTypeActionHandler } from '../../../../commons/actions/mlCurrencySymbolHandler'
var Select = require('react-select');
import {client} from '../../../core/apolloConnection';

export default class MlOfficeItem extends React.Component {
  constructor(props){
    super(props);
    this.state={
      transId:props.data.id,
      transInfo:{},
      currentSlideIndex:0,
      userInfo:{},
      officeInfo:{},
      officeSC:{
        availableCommunities: []
      },
      officeSCDef:{},
      cost: 0,
      tax:false,
      about:'',
      isGenerateLinkDisable: false,
      duration : ' ', currencySymbol:""
    }
    this.getTransaction.bind(this);
    this.initializeSwiper=this.initializeSwiper.bind(this);
    this.onSlideIndexChange.bind(this);
    return this;
  }

  onSlideIndexChange(swiper){
    if(this.state.currentSlideIndex!==swiper.activeIndex){
      this.setState({'currentSlideIndex':swiper.activeIndex});
    }
  }

  componentDidMount() {
    initalizeFloatLabel();
    $('.ml_tabs ul li a').click(function(){
      $('input').blur();
    });
    // $(function() {
    //   $('.float-label').jvFloat();
    // });

    $('.switch input').change(function() {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      }else{
        $(this).parent('.switch').removeClass('on');
      }
    });
    //this.initializeSwiper();
  }

  async getCurrencyType() {
    const response = await fetchCurrencyTypeActionHandler(client, this.props.data.userId, null, this.props.data.profileId);
    this.setState({currencySymbol: response.symbol})
    return response;
  }

  initializeSwiper(){
    const transId = this.state.transId;
      setTimeout(function () {
        let swiper =  new Swiper('#office_item'+transId, {
          effect: 'coverflow',
          slidesPerView: 3,
          grabCursor: true,
          centeredSlides: true,
          initialSlide: 0
        });
      },1000);
  };

  async componentWillMount() {
    this.getCurrencyType();
    this.loggedUserDetails = getAdminUserContext();                                      /*getting user context*/
    await this.getTransaction(this.state.transId);
  }

  componentWillReceiveProps(){

 }

  async getTransaction(id){
    let response = await findOfficeTransactionHandler(id, this.loggedUserDetails);           /*adding user context fro auth*/
    if(response){
      let duration = ' ';
      let result = JSON.parse(response.result)[0];
      if(result){
        // console.log(result);
        if(result.trans.duration){
          let dbDuration = result.trans.duration;
            duration = dbDuration.years+' Year'; // To do for month and all
        }
        result.officeSC.availableCommunities = result.officeSC.availableCommunities && result.officeSC.availableCommunities.length ? result.officeSC.availableCommunities : [];
        result.office.availableCommunities = result.office.availableCommunities && result.office.availableCommunities.length ? result.office.availableCommunities : [];
        this.setState({
          duration: duration,
          transInfo: result.trans,
          userInfo: result.user,
          officeInfo: result.office,
          officeSC: result.officeSC,
          officeSCDef: result.officeSCDef ? result.officeSCDef : {},
          currentSlideIndex:0,
          tax: result.trans.orderSubscriptionDetails && result.trans.orderSubscriptionDetails.isTaxInclusive ? result.trans.orderSubscriptionDetails.isTaxInclusive : false,
          cost: result.trans.orderSubscriptionDetails && result.trans.orderSubscriptionDetails.cost ? result.trans.orderSubscriptionDetails.cost : '',
          about: result.trans.orderSubscriptionDetails && result.trans.orderSubscriptionDetails.about ? result.trans.orderSubscriptionDetails.about : '',
          isGenerateLinkDisable: result.trans.orderSubscriptionDetails ? true : false
        });
      }
    }
  }

  updateCost(e){
    if(e.currentTarget.value >= 0) {
      this.setState({"cost":e.currentTarget.value});
    } else {
      this.setState({"cost":0});
    }
  }

  updateTax(e){
    this.setState({"tax":e.currentTarget.checked});
  }

  updateAbout(e){
    this.setState({"about":e.currentTarget.value});
  }

  async generateLink(){
    if(this.state.isGenerateLinkDisable){
      toastr.error('Payment Link is already generated');
      return false;
    }
    this.setState({
      isGenerateLinkDisable:true
    })
    if(!this.state.cost){
      toastr.error("'Cost' field is mandatory");
      this.setState({
        isGenerateLinkDisable:false
      })
      return false;
    }
    if(this.state.cost < 1){
      toastr.error('Enter a valid cost');
      this.setState({
        isGenerateLinkDisable:false
      })
      return false;
    }
    let generateLinkInfo = {
      SubscriptionName: this.state.officeInfo && this.state.officeInfo.subscriptionName ? this.state.officeInfo.subscriptionName : '' ,
      cost: this.state.cost,
      isTaxInclusive: this.state.tax,
      about: this.state.about
    }
    let id = this.state.transId;
    let response = await updateSubcriptionDetail(id ,generateLinkInfo);
    if(response.success){
      toastr.success(response.result);
    } else {
      toastr.error(response.result);
      this.setState({
        isGenerateLinkDisable:false
      })
    }
  }

  async acitvateOffice(){
    if(this.state.officeInfo.isActive){
      toastr.error('Office already activated');
      return false;
    }
    let response = await updateOfficeStatus(this.state.officeInfo._id, this.loggedUserDetails);
    if(response.success){
      toastr.success(response.result);
    } else {
      toastr.error(response.result);
    }
  }

  render() {
    let statusOptions = [
      {value: 'WIP', label: 'WIP' , clearableValue: true},
      {value: 'Approved', label: 'Approved',clearableValue: true}
    ];
    let transId = this.state.transId;
    return (
      <div className="ml_tabs">
        <ul className="nav nav-pills">
          <li className="active">
            <a href={"#1a"+transId} data-toggle="tab">Customer Details</a>
          </li>
          <li>
            <a href={"#2a"+transId} onClick={this.initializeSwiper} data-toggle="tab">Order Details</a>
          </li>
          <li>
            <a href={"#3a"+transId} data-toggle="tab">Payment Details</a>
          </li>
          <li>
            <a href={"#4a"+transId} data-toggle="tab">Device Details</a>
          </li>
          <li>
            <a href={"#5a"+transId} data-toggle="tab">History</a>
          </li>
        </ul>
        <div className="tab-content clearfix">
          <div className="tab-pane active" id={"1a"+transId}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  {/*<input type="text" placeholder="User Id" defaultValue=' ' value={this.state.transInfo.userId} className="form-control float-label"/>*/}
                  <input type="text" placeholder="User Id" defaultValue=' ' value={ this.state.officeSCDef && this.state.officeSCDef.profileId?this.state.officeSCDef.profileId:''} className="form-control float-label"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Transaction Id" defaultValue=" " value={this.state.transInfo.transactionId} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Date & Time" defaultValue=" " value={this.state.userInfo.createdAt ? moment(this.state.userInfo.createdAt).format(Meteor.settings.public.dateFormat) : ' ' } className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Name" defaultValue=" " value={this.state.userInfo.name} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email Id" defaultValue=" " value={this.state.userInfo.email} className="form-control float-label" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Phone no" defaultValue=" " value={this.state.userInfo.mobile} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Cluster" defaultValue=" " value={this.state.transInfo.clusterName} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Chapter" defaultValue=" " value={this.state.transInfo.chapterName} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Sub Chapter" defaultValue=" " value={this.state.transInfo.subChapterName} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community" defaultValue=" " value={this.state.transInfo.communityName} className="form-control float-label" />
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id={"2a"+transId}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Order ID" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Subscription Name" value={this.state.officeSCDef.serviceCardName} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Total number of users" value={this.state.officeSC.totalusercount} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Total number of principal" value={this.state.officeSC.principalcount} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Total number of Team" value={this.state.officeSC.teamMembercount} className="form-control float-label" />
                </div>
                <div className="form-group switch_wrap switch_names">
                  <span className="state_label acLabel">Specific</span><label className="switch nocolor-switch">
                  <input type="checkbox" checked={this.state.officeSC.availableCommunities.length > 2 ? true : false} />
                  <div className="slider"></div>
                </label>
                  <span className="state_label">All Communities</span>
                  <div className="clearfix" />
                </div>
                <br className="clearfix" />
                <br className="clearfix" />
                <div className="clearfix" />

                <div className="swiper-container office_item" id={'office_item'+transId}>
                  <div className="swiper-wrapper">
                    {this.state.officeSC.availableCommunities.map(function (item, i) {
                      return(
                      <div className="swiper-slide" key={i}>
                        <div className="team-block marb0">
                          <span className="ml ml-moolya-symbol"></span>
                          <h3>
                            {item.communityName}
                          </h3>
                        </div>
                        <div className="form-group mart20">
                          <input type="text" value={item.userCount} placeholder="Enter Total Numbers" className="form-control float-label" id="cluster_name"/>
                        </div>
                      </div>
                      )
                    })}

                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-heading">Office location</div>
                  <div className="panel-body">
                    <div className="form-group">
                      <input type="text" defaultValue=" " placeholder="Plot no/Flat no/Door no" value={this.state.officeInfo.officeLocation} className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" defaultValue=" " placeholder="Street no / Locality" value={this.state.officeInfo.streetLocality} className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" defaultValue=" " placeholder="Landmark" value={this.state.officeInfo.landmark} className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" defaultValue=" " placeholder="Area" value={this.state.officeInfo.area} className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" defaultValue=" " placeholder="town /city" value={this.state.officeInfo.city} className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" defaultValue=" " placeholder="State" value={this.state.officeInfo.state} className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" defaultValue=" " placeholder="Country" value={this.state.officeInfo.country} className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" defaultValue=" " placeholder="Zip Code" value={this.state.officeInfo.zipCode} className="form-control float-label" />
                    </div>
                    <div className="form-group">
                      <input type="text" defaultValue=" " value={this.state.duration} placeholder ="" className="form-control float-label" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="panel panel-default">
                  <div className="panel-heading">Generate payment link</div>
                  <div className="panel-body">
                    <div className="form-group">
                      <input type="text" value={this.state.officeInfo.subscriptionName} placeholder="Subscription Name" className="form-control float-label"  />
                    </div>
                    <br className="brclear"/>
                    <div className="form-group ">
                      <input type="number" onChange={(e)=>this.updateCost(e)} value={this.state.cost} placeholder="Cost" className="form-control float-label"/>
                      <div className="email_notify" style={{right:'20px'}}>
                        <div className="input_types">
                          <input id="checkbox1" onChange={(e)=>this.updateTax(e)} checked={this.state.tax} type="checkbox" name="checkbox" value="1" /><label htmlFor="checkbox1"><span></span>TAX inclusive</label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <textarea defaultValue=" " onChange={(e)=>this.updateAbout(e)} value={this.state.about} placeholder="About" className="form-control float-label" ></textarea>
                    </div>
                    <a href="#" className="fileUpload mlUpload_btn" onClick={()=>this.generateLink()}>Generate Link</a>
                    <a href="#" className="fileUpload mlUpload_btn" onClick={()=>this.acitvateOffice()}>Activate office</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id={"3a"+transId}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Transaction Date & Time"
                         value={(this.state.transInfo.paymentDetails && this.state.transInfo.paymentDetails.datetime )?
                           moment(this.state.transInfo.paymentDetails.datetime).format(Meteor.settings.public.dateFormat):''} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Transaction ID"
                         value={(this.state.transInfo.paymentDetails && this.state.transInfo.paymentDetails.transactionId )?
                    this.state.transInfo.paymentDetails.transactionId:''} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Total amount paid"
                         value={(this.state.transInfo.paymentDetails && this.state.transInfo.paymentDetails.totalAmountPaid )?
                           `${this.state.currencySymbol} ${this.state.transInfo.paymentDetails.totalAmountPaid}`:''}
                         className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Payment mode"
                         value={(this.state.transInfo.paymentDetails && this.state.transInfo.paymentDetails.paymentMode )?
                           this.state.transInfo.paymentDetails.paymentMode:''} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Card number"  className="form-control float-label" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Card Holder name" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Promotion Code" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Code Amount" className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Status"
                         value={(this.state.transInfo.paymentDetails && this.state.transInfo.paymentDetails.paymentStatus )?
                           this.state.transInfo.paymentDetails.paymentStatus:''} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Voucher Code" className="form-control float-label" />
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id={"4a"+transId}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device name"  className="form-control float-label"
                         value={(this.state.transInfo.deviceDetails && this.state.transInfo.deviceDetails.deviceName )?
                           this.state.transInfo.deviceDetails.deviceName:''}/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Device ID" className="form-control float-label"
                         value={(this.state.transInfo.deviceDetails && this.state.transInfo.deviceDetails.deviceId )?
                           this.state.transInfo.deviceDetails.deviceId:''}/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device IP"  className="form-control float-label"
                         value={(this.state.transInfo.deviceDetails && this.state.transInfo.deviceDetails.ipAddress )?
                           this.state.transInfo.deviceDetails.ipAddress:''}/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="IP Location"  className="form-control float-label"
                         value={(this.state.transInfo.deviceDetails && this.state.transInfo.deviceDetails.ipAddress )?
                           this.state.transInfo.deviceDetails.ipAddress:''}/>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id={"5a"+transId}>
            <div className="row">
              <div className="col-md-6">
                One
              </div>
              <div className="col-md-6">
                Two
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
