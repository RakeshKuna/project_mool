/**
 * Created by pankaj on 13/9/17.
 */

import React from 'react';
import AppointmentSes from './appointmentSession';
import { fetchAdminServiceAppointment } from "../../action/fetchAdminServiceAppointment";
import MlServiceCardsDetailsComponent from '../mlAppServiceDetails/MlserviceCardsDetailsComponent';
import moment from "moment";

export default class MlAppServicePurchasedDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orderId: props.orderId,
      data: {
        client: {},
        owner: {},
        sessionInfo: [],
        service: {}
      }
    };
  }

  componentWillReceiveProps({ orderId }) {
    this.setState({ orderId }, () => {
      this.fetchAdminServiceAppointment();
    })
  }

  componentWillMount() {
    this.fetchAdminServiceAppointment();
  }

  async fetchAdminServiceAppointment() {
    let orderId = this.state.orderId;
    const that = this;
    if (orderId) {
      let response = await fetchAdminServiceAppointment(orderId);
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
    }
  }

  render() {

    const { data } = this.state;

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
          <li>
            <a href={`#${data.orderId}7a`} data-toggle="tab">Device Details</a>
          </li>
        </ul>

        <div className="tab-content clearfix">
          <div className="tab-pane active" id={`${data.orderId}1a`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="User Id" value={data.client.userId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Date & Time" value={data.createdAt ? moment(data.createdAt).format(Meteor.settings.public.dateFormat) : ' ' } defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Name" value={data.client.name} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email ID" value={data.client.email} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Phone no" value={data.client.phoneNo} defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">

                <div className="form-group">
                  <input type="text" placeholder="Cluster" value={data.client.cluster} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Chapter" value={data.client.chapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Sub Chapter" value={data.client.subChapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community" value={data.client.community} defaultValue="" className="form-control float-label" id="" />
                </div>
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
                  <input type="text" placeholder="Appointment Date & Time" value={data.createdAt ? moment(data.createdAt).format(Meteor.settings.public.dateFormat) : ' ' } defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Transaction ID" value={data.orderId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Appointment With" value={data.owner.name} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="User Id" value={data.owner.userId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community" value={data.owner.community} defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">

                <div className="form-group">
                  <input type="text" placeholder="subChater" value={data.owner.subChapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Chapter" value={data.owner.chapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Cluster" value={data.owner.cluster} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Contact Number" value={data.owner.phoneNo} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email Id" value={data.owner.email} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Gender" value={data.owner.gender} defaultValue="" className="form-control float-label" id="" />
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
            {/* <p>Take from this page "appFunderMyAppointment"</p> */}
            <MlServiceCardsDetailsComponent data={{ profileId: this.state.data.service.profileId, _id: this.state.data.service._id, userDetails: {} }} />
          </div>
          {/*fivth tab*/}
          <div className="tab-pane" id={`${data.orderId}5a`}>
            <h3>Total Amount: 25,000 INR</h3>
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="col-md-3 nopadding-left"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span>  <select className="form-control"><option>Select Community</option></select></div></div></div>
                <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Search Person Name" /></div></div></div>
                <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Enter Units" /></div></div></div>
                <div className="col-md-3 nopadding-right"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Status" /></div></div></div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="col-md-3 nopadding-left"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span>  <select className="form-control"><option>Service Provider</option></select></div></div></div>
                <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Mohan Kumar" /></div></div></div>
                <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="5000 Units" /></div></div></div>
                <div className="col-md-3 nopadding-right"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Status" /></div></div></div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="col-md-3 nopadding-left"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span>  <select className="form-control"><option>Investor</option></select></div></div></div>
                <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Ramesh Jain" /></div></div></div>
                <div className="col-md-3"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="5600 Units" /></div></div></div>
                <div className="col-md-3 nopadding-right"><div className="form-group"><div className="jvFloat"><span className="placeHolder">Date</span><input type="text" className="form-control float-label" placeholder="Status" /></div></div></div>
              </div>
            </div>
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
