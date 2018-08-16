import React, {Component} from "react";
import BeSpokeHandler from '../Container/beSpokeHandler'
import FunderAboutView from '../../MlFunderServiceBooking'
import MlAppServiceManageSchedule from '../../../../../../../../app/calendar/manageScheduler/service/components/MlAppServiceManageSchedule'
import generateAbsolutePath from '../../../../../../../../../lib/mlGenerateAbsolutePath'
import NoData from "../../../../../../../../commons/components/noData/noData";

export default class  MlFunderServicesListView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      componentToView: 'landingPage',
      myPortfolio: false
    }
    this.servicesListView.bind(this);
  }
  componentWillMount(){
    let path = FlowRouter._current.path
    if(path.indexOf('edit') > 0 || path.indexOf('view') > 0){
      this.setState({myPortfolio: true})
    }else{
      this.setState({myPortfolio: false})
    }
  }

  servicesListView(){
    let that = this;
    return(
      <div>
        <div>
          <div  id="show">
            {!this.state.myPortfolio? <div className="col-lg-2 col-md-3 col-sm-4">
              <a href=" " onClick={() => that.props.componentToView('createBeSpoke')}>
                <div className="list_block notrans">
                  <div className="hex_outer"><span className="ml ml-plus "></span></div>
                  <h3>Request BeSpoke</h3>
                </div>
              </a>
            </div>:<div></div>}
            {this.props.services.map(function (service, index) {
              return (
              <div className="col-lg-2 col-md-4 col-sm-4" key={index}>
                <div className="card_block"  onClick={()=>that.props.viewMode(index,service._id, service.profileId)}><h3>{service.displayName}</h3>
                  <div className="clearfix"></div>
                  <div className="list_icon mart0">
                    <span className="price">Rs. {service.finalAmount ? service.finalAmount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : '0.00'}</span>
                    <span className="price pull-right">{service.status ? 'TRUE' : 'FALSE'}</span>
                    <div className="clearfix"></div>
                    <i className="c_image ml my-ml-Ideator"></i>
                    <div className="clearfix"></div>
                    <span className="price">{service.duration ? `${service.duration.hours ? service.duration.hours : 0} Hrs ${service.duration.minutes ? service.duration.minutes : 0} Mins` : ''}</span>
                    <span className="price pull-right">{`${service.noOfSession ? service.noOfSession : '0'} Sessions`}</span>
                  </div><div className="block_footer"><span>{(service.termsAndCondition && service.termsAndCondition.isCancelable) ? 'CAN BE CANCELLED' : 'NON - CANCELLABLE'}</span></div></div>
              </div>
              )})}
            {this.props.beSpokeServices.map(function (service, index) {
              return (
              <div className="col-lg-2 col-md-4 col-sm-4" key={index}>
                <div className="card_block"  onClick={()=>that.props.viewModeBeSpoke(index, service._id, service.profileId)}><h3>{service.displayName}</h3>
                  <div className="clearfix"></div>
                  <div className="list_icon mart0">
                   {/*<span className="price">Rs. {service.finalAmount ? service.finalAmount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : '0.00'}</span>*/}
                    <button className={`btn ${service.mode === 'online' ? 'btn-danger' : 'btn-success'} pull-right`}>{service.mode}</button>
                    <div className="clearfix"></div>
                    <img className="c_image" src={service.beSpokeCreatorProfileImage?generateAbsolutePath(service.beSpokeCreatorProfileImage):'/images/def_profile.png'}/>
                    <div className="clearfix"></div>
                    <span className="price">{service.duration ? `${service.duration.hours ? service.duration.hours : 0} Hrs ${service.duration.minutes ? service.duration.minutes : 0} Mins` : ''}</span>
                    <span className="price pull-right">{`${service.noOfSession ? service.noOfSession : '0'} Sessions`}</span>
                  </div><div className="block_footer"><span>{"BeSpoke"}</span></div></div>
              </div>
              )})}
              {
                this.props.view  &&(!this.props.beSpokeServices || !this.props.beSpokeServices.length)
              && (!this.props.services || !this.props.services.length)
              && <NoData tabName={'Services'}/>

              }
          </div>
        </div>
      </div>
    )
  }

  render(){
    switch(this.props.viewComponent){
      case 'createBeSpoke':
        return(<BeSpokeHandler portfolioDetailsId={this.props.portfolioDetailsId} componentToView={this.props.componentToView}/>)
        break;
      case 'landingPage':
        return(this.servicesListView())
        break;
      case 'updateBeSpoke':
        return(
          <div className="app_main_wrap" style={{'overflow':'auto'}}>
            <div className="app_padding_wrap">
              <BeSpokeHandler beSpokeDetails={this.props.beSpokeService} componentToView={this.props.componentToView} beSpokeIndex={this.props.beSpokeIndex}/>
            </div>
          </div>
        )
        break;
      case 'services':
        return(
          <MlAppServiceManageSchedule
            viewMode={true}
            viewingMode={this.props.viewingMode?this.props.viewingMode: false}
            editingMode={this.props.editingMode?this.props.editingMode:false}
            serviceId={this.props.serviceId}
            profileId={this.props.profileId}
            serviceInfo={this.props.serviceInfo}
            bookService={this.props.bookService}
          />
        )
      break;
      case 'bookService':
        return(
          <div className="app_main_wrap" style={{'overflow':'auto'}}>
            <div className="app_padding_wrap">
              <FunderAboutView componentToView={this.props.componentToView} serviceDetails={this.props.serviceDetails}/>
            </div>
          </div>
        )
        break;
      default:
        return <div></div>
    }
  }
}

