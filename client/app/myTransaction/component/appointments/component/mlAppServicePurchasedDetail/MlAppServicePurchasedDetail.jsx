/**
 * Created by pankaj on 13/9/17.
 */

import React from 'react';
import AppointmentSes from './appointmentSession';
import { fetchAppAppointmentByTransactionId } from "../../action/fetchAppointment";
import MlServiceCardsDetailsComponent from '../mlAppServiceDetails/MlserviceCardsDetailsComponent';
import AppointmentModal from './../AppointmentModal';
import { cancelUserServiceCardOrder } from './../../action/cancelUserServiceCardOrder';
import { signOffUserServiceCardOrder } from './../../action/signOffUserServiceCardOrder';
import {fetchServiceByServiceId} from '../../action/findServiceCardDetails';
import moment from 'moment';

export default class MlAppServicePurchasedDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orderId: props.orderId,
      releasePayComponents:[],
      amount:0,
      data: {
        client: {},
        owner: {},
        sessionInfo: [],
        service: {},
      }
    };
    this.setPaymentAmount = this.setPaymentAmount.bind(this);
    this.updateReleasePayCount = this.updateReleasePayCount.bind(this);
  }

  componentWillReceiveProps({ orderId }) {
    this.setState({ orderId }, () => {
      this.fetchAppServiceAppointmentByTransactionId();
    })

    // this.setPaymentAmount();
  }

  updateReleasePayCount(){
    let releasePayComponents = this.state.releasePayComponents;
    releasePayComponents.push(
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="pull-right block_action"  onClick={e=>this.decreaseReleasePayCount()}><img
            src="/images/remove.png"/></div>
        </div>
        <div className="panel-body">
          <div className="col-md-3 nopadding-left"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span>  <select className="form-control"><option>Select Community</option></select></div></div></div>
          <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Search Person Name" /></div></div></div>
          <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Enter Units" /></div></div></div>
          <div className="col-md-3 nopadding-right"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Status" /></div></div></div>
        </div>
      </div>
    );
    this.setState({releasePayComponents});
  }

  decreaseReleasePayCount(){
    let releasePayComponents = this.state.releasePayComponents;
    if(releasePayComponents && releasePayComponents.length>0){
      releasePayComponents.splice(releasePayComponents.length-1,1);
    }
      this.setState({releasePayComponents});
  }
  componentWillMount() {
    this.fetchAppServiceAppointmentByTransactionId();

  }

  async setPaymentAmount(){
    let resp = await fetchServiceByServiceId(this.state.data.service._id);
    let amount = 0;
    if(resp.finalAmount) amount = resp.finalAmount;
    this.setState({amount});
  }

  async signOffOrder() {
    let response = await signOffUserServiceCardOrder(this.state.data.orderId);
    if (response && response.success) {
      toastr.success(response.result);
    } else {
      toastr.error(response.result);
    }
  }

  async cancelOrder() {
    let response = await cancelUserServiceCardOrder(this.state.data.orderId);
    if (response && response.success) {
      toastr.success(response.result);
    } else {
      toastr.error(response.result);
    }
  }

  async fetchAppServiceAppointmentByTransactionId() {
    let orderId = this.state.orderId;
    const that = this;
    if (orderId) {
      let response = await fetchAppAppointmentByTransactionId(orderId);
      if (response && response.success) {
        let data = JSON.parse(response.result);
        data = data[0] ? data[0] : {};
        data.client = data.client ? data.client : {};
        data.owner = data.owner ? data.owner : {};
        data.sessionInfo = data.sessionInfo ? data.sessionInfo : [];
        data.service = data.service ? data.service : {};
        that.setState({
          data: data
        });
      }
      // this.setPaymentAmount();
    }
  }

  render() {

    const { data } = this.state;
    let appointmentWith = data.owner;
    let label = 'Purchased from';
    let currentUser = data.client;
    if(Meteor.userId()===data.owner.userId) {
      appointmentWith = data.client;
      label = "Purchased By";
      currentUser = data.owner;
    }
    // console.log("This Props", this.props);
    return (
      <div className="ml_tabs">
        <ul className="nav nav-pills">
          <li className="active">
            <a href={`#${data.orderId}1a`} data-toggle="tab">Details</a>
          </li>
          <li>
            <a href={`#${data.orderId}2a`} data-toggle="tab">Activity Log</a>
          </li>
          <li>
            <a href={`#${data.orderId}3a`} data-toggle="tab">Sessions</a>
          </li>
          <li>
            <a href={`#${data.orderId}4a`} data-toggle="tab">Service Details</a>
          </li>
          <li>
            <a href={`#${data.orderId}5a`} data-toggle="tab">Release Pay</a>
          </li>
          <li>
            <a href={`#${data.orderId}6a`} data-toggle="tab">Payment Details</a>
          </li>
          {/*<li>*/}
          {/*<a href={`#${data.orderId}7a`} data-toggle="tab">Device Details</a>*/}
          {/*</li>*/}
        </ul>

        <div className="tab-content clearfix">
          <div className="tab-pane active" id={`${data.orderId}1a`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="User Id" value={currentUser.userId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Purchased Date & Time" value={moment(data.createdAt).format("DD-MMM-YYYY HH:mm:ss")} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Name" value={currentUser.name} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email ID" value={currentUser.email} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Phone no" value={currentUser.phoneNo} defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">

                <div className="form-group">
                  <input type="text" placeholder="Cluster" value={currentUser.cluster} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Chapter" value={currentUser.chapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Sub Chapter" value={currentUser.subChapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community" value={currentUser.community} defaultValue="" className="form-control float-label" id="" />
                </div>
                <a className="fileUpload mlUpload_btn" onClick={() => { this.setState({ showCancelModal: true }) }}>Cancel</a>
                <AppointmentModal
                  message="Are you sure to cancel the order?"
                  onOkClick={() => { this.cancelOrder(); this.setState({ showCancelModal: false }) }}
                  onCancelClick={() => { this.setState({ showCancelModal: false }) }}
                  showModal={this.state.showCancelModal}
                />
                <a className="fileUpload mlUpload_btn" onClick={() => { this.setState({ showSignOffModal: true }) }}>Sign Off</a>
                <AppointmentModal
                  message="Are you sure to signoff the order?"
                  onOkClick={() => { this.signOffOrder(); this.setState({ showSignOffModal: false }) }}
                  onCancelClick={() => { this.setState({ showSignOffModal: false }) }}
                  showModal={this.state.showSignOffModal}
                />
              </div>

            </div>
          </div>
          {/*second tab*/}
          <div className="tab-pane" id={`${data.orderId}2a`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Appointment Id" defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Purchased Date & Time" value={moment(data.createdAt).format("DD-MMM-YYYY HH:mm:ss")} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Transaction ID" value={data.orderId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder={label} defaultValue="" className="form-control float-label" id=""
                         value={appointmentWith.name}/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="User Id" value={appointmentWith.userId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community" value={appointmentWith.community} defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">

                <div className="form-group">
                  <input type="text" placeholder="subChater" value={appointmentWith.subChapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Chapter" value={appointmentWith.chapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Cluster" value={appointmentWith.cluster} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Contact Number" value={appointmentWith.phoneNo} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email Id" value={appointmentWith.email} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Gender" value={appointmentWith.gender} defaultValue="" className="form-control float-label" id="" />
                </div>
                {/*<a href="#" className="fileUpload mlUpload_btn">Cancel</a> <a href="#" className="fileUpload mlUpload_btn">Sign Off</a>*/}
              </div>

            </div>
          </div>
          {/*third tab*/}
          <div className="tab-pane" id={`${data.orderId}3a`}>
            <AppointmentSes appointment={this.state.data} />
          </div>

          {/*fourth tab*/}
          <div className="tab-pane" id={`${data.orderId}4a`}>
            <MlServiceCardsDetailsComponent data={this.state.data.service}
              profileId={this.state.data.service.profileId}
              _id={this.state.data.service._id} />
          </div>
          {/*fivth tab*/}
          <div className="tab-pane" id={`${data.orderId}5a`}>
            <h3>{`Total Amount: ${data.totalAmount} INR`}</h3>
            <div className="panel panel-default">
              <div className="panel-heading">
                <div className="pull-right block_action"  onClick={e=>this.updateReleasePayCount()}><img src="/images/add.png"/></div>
              </div>
              <div className="panel-body">
                <div className="col-md-3 nopadding-left"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span>  <select className="form-control"><option>Select Community</option></select></div></div></div>
                <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Search Person Name" /></div></div></div>
                <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Enter Units" /></div></div></div>
                <div className="col-md-3 nopadding-right"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Status" /></div></div></div>
              </div>
            </div>
            {this.state.releasePayComponents&&this.state.releasePayComponents.map(obj=>{
              return obj;
            })}
          </div>

          <div className="tab-pane" id={`${data.orderId}6a`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Transaction Date & Time" defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Transaction ID" defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Total amount paid" value={data.totalAmount} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Payment mode" defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Card number" defaultValue="" className="form-control float-label" id="" />
                </div>

              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Card Holder name" value={data.client.name} defaultValue="Kiran Kumar" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Promotion Code" defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Code Amount" defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Status" defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Voucher Code" defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>
            </div>
          </div>

          <div className="tab-pane" id={`${data.orderId}7a`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device name" defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Device ID" defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device IP" defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="IP Location" defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    );
  }
}

const selectRow = {
  mode: 'checkbox',
  bgColor: '#fff',
  clickToSelect: true, // click to select, default is false
  clickToExpand: true // click to expand row, default is false
};

// export default class MlAppServicePurchasedDetail extends React.Component {
//   componentDidMount() {
//     $('.switch input').change(function() {
//       if ($(this).is(':checked')) {
//         $(this).parent('.switch').addClass('on');
//       } else {
//         $(this).parent('.switch').removeClass('on');
//       }
//     });
//   }
//   constructor(props) {
//     super(props);
//   }
//
//   isExpandableRow(row) {
//     if (row.id <= 1) {
//       return true;
//     } else {
//       return false;
//     }
//   }
//
//   expandComponent(row) {
//     return (
//       <InnerTable data={ row.expand } />
//     );
//   }
//   render() {
//     const options = {
//       expandRowBgColor: 'rgb(242, 255, 163)'
//     };
//     return (
//       <div className="admin_main_wrap">
//         <div className="admin_padding_wrap">
//           <h2>Appointments</h2>
//           <div className="main_wrap_scroll">
//             <ScrollArea
//               speed={0.8}
//               className="main_wrap_scroll"
//               smoothScrolling={true}
//               default={true}
//             >
//
//
//               <br className="brclear"/>
//               <BootstrapTable  data={ taxes }
//                                options={ options }
//                                expandableRow={ this.isExpandableRow }
//                                expandComponent={ this.expandComponent }
//                                selectRow={ selectRow }
//                                pagination
//                                search
//               >
//                 <TableHeaderColumn dataField="id" isKey={true} dataSort={true} width='62px' dataAlign='center'>S.No</TableHeaderColumn>
//                 <TableHeaderColumn dataField="info">ID</TableHeaderColumn>
//                 <TableHeaderColumn dataField="dateTime">Created By</TableHeaderColumn>
//                 <TableHeaderColumn dataField="userId">Email ID</TableHeaderColumn>
//                 <TableHeaderColumn dataField="name">Source</TableHeaderColumn>
//                 <TableHeaderColumn dataField="tarId">Transaction Type</TableHeaderColumn>
//                 <TableHeaderColumn dataField="cluster">Cluster</TableHeaderColumn>
//                 <TableHeaderColumn dataField="chapter">Chapter</TableHeaderColumn>
//                 <TableHeaderColumn dataField="subChater">Sub Chapter</TableHeaderColumn>
//                 <TableHeaderColumn dataField="community">Community</TableHeaderColumn>
//                 <TableHeaderColumn dataField="payment">Date & Time</TableHeaderColumn>
//                 <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
//               </BootstrapTable>
//
//             </ScrollArea>
//           </div>
//         </div>
//
//
//       </div>
//     )
//   }
// }
// ;
