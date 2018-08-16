/**
 * All Services list component
 * @Author :: Mukhil P
 * @Dated :: 20/06/2017
 */

// import NPM module(s)
import React, { Component } from 'react';

// import custom method(s) and component(s)
import MlAppScheduleHead from "../../commons/components/MlAppScheduleHead";
import { fetchServicesActionHandler } from '../actions/MlServiceActionHandler';
import { fetchCurrencyTypeActionHandler } from '../../../../../commons/actions/mlCurrencySymbolHandler'
import {appClient} from '../../../../core/appConnection';

export default class MlAppServiceList extends Component {

  constructor(props){
    super(props);
    this.state = {
      services:[]
    };
    this.profileId = FlowRouter.getParam('profileId');
    this.fetchServices = this.fetchServices.bind(this);
  }

  componentDidMount(){
    this.getCurrencyType();
    this.fetchServices();
  }

  /**
   * Method :: fetchServices
   * Desc :: Get all services from server
   * @returns {Promise.<void>}
   */
  async fetchServices(){
    let response = await fetchServicesActionHandler(this.profileId);
    if(response){
      this.setState({ services: response });
    }
  }

  /**
   * Method :: createService
   * Desc :: Redirect with creating service component
   */
  createService() {
    FlowRouter.go(`/app/calendar/manageSchedule/${this.profileId}/createService`);
  }

  /**
   * Method :: updateService
   * Desc :: Redirect with updating service component
   * @param id :: current service id
   */
  updateService(id, selectedProfileId) {
    this.profileId = this.profileId === "all" ? selectedProfileId : this.profileId;
    FlowRouter.go(`/app/calendar/manageSchedule/${this.profileId}/editService?id=${id}`);
  }

  async getCurrencyType() {
    const response = await fetchCurrencyTypeActionHandler(appClient, null, null, this.profileId);
    this.setState({currencySymbol: response.symbol})
    return response;
  }

  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render() {
    const { services } = this.state;
    const that = this;
    return (
      <div className="app_main_wrap" style={{'overflow':'auto'}}>
        <div className="app_padding_wrap">
          <MlAppScheduleHead type="service" />
          <div className="col-lg-12" id="show">
            <div className="row">
              {this.profileId !== "all" ? <div className="col-lg-2 col-md-4 col-sm-4">
                <div className="card_block">
                <a href=" " onClick={() => this.createService()}>
                  <div className="add_task">
                    <div><span className="ml ml-plus "></span></div>
                    <div className="block_footer"><span>Create a service</span></div>
                  </div>
                </a>
                </div>
              </div>: <div></div> }

              {services && services.map((service, index) => {
                return (
                  <div className="col-lg-2 col-md-4 col-sm-4" key={index}>
                    <div className="card_block"  onClick={()=>that.updateService(service._id, service.profileId)}><h3>{service.displayName}</h3>
                      <div
                        className={ service.status === "Gone Live" ? 'active' : (service.status === "In Active" ? 'inactive' : '' )}
                        style={ (service.status === "Gone Live" || service.status === "In Active" ? {} : {
                          background: "#ffa500",
                          width: "20px",
                          height: "20px",
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          borderRadius: "50%",
                          border: "1px solid #fff",
                          lineHeight: "18px",
                          color: "#fff",
                          fontSize: "12px"
                        }) }
                      >
                      </div>
                      <div className="clearfix"></div>
                      <div className="list_icon mart0">
                        <span className="price">{service && service.payment && service.payment.currencyType ? service.payment.currencyType: this.state.currencySymbol} {service.finalAmount ? service.finalAmount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : '0.00'}</span>
                        <span className="price pull-right">{service.status ? service.status.toUpperCase() : ''}</span>
                        <div className="clearfix"></div>
                        <i className="c_image ml my-ml-service"></i>
                        <div className="clearfix"></div>
                        <span className="price">{service.duration ? `${service.duration.hours ? service.duration.hours : 0} Hrs ${service.duration.minutes ? service.duration.minutes : 0} Mins` : ''}</span>
                        <span className="price pull-right">{`${service.noOfSession ? service.noOfSession : '0'} Sessions`}</span>
                      </div><div className="block_footer"><span>{(service.termsAndCondition && service.termsAndCondition.isCancelable) ? 'CAN BE CANCELLED' : 'NON - CANCELLABLE'}</span></div></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
};
