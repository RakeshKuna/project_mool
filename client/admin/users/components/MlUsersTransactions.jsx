// /**
//  * Created by vishwadeep on 26/7/17.
//  */
// import React, {Component, PropTypes} from 'react';
// import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// import moment from 'moment'
// import {findUserTransactions} from '../actions/findUserTransactionsHandler'
// import MlUsersTransactionDetailsComponent from './MlUsersTransactionDetailsComponent'
//
// export default class MlUsersTransactions extends Component {
//   constructor(props){
//     super(props);
//     this.state={
//       transactionInfo:[],
//       createRequest:false,
//     }
//     return this;
//   }
//   componentWillMount() {
//     const resp=this.findRequestDetails();
//     return resp;
//   }
//   async findRequestDetails(){
//     let registrationId = this.props.config.registrationId;
//     let portfolioId = this.props.config.portfolioId;
//     let requestDetails = await findUserTransactions(registrationId, portfolioId);
//     if(requestDetails) {
//       let requestInfo = []
//       for (let i = 0; i < requestDetails.length; i++) {
//         let json = {
//           status:requestDetails[i].status,
//           transactionId:requestDetails[i].transactionId,
//           transactionType:requestDetails[i].transactionType,
//           createdAt:moment(requestDetails[i].createdAt).format(Meteor.settings.public.dateFormat),
//           clusterName:requestDetails[i].cluster,
//           chapterName:requestDetails[i].chapter,
//           subChapterName:requestDetails[i].subChapter,
//           communityName:requestDetails[i].community
//         }
//         requestInfo.push(json)
//       }
//       this.setState({'transactionInfo':requestInfo})
//     }
//   }
//
//   // isExpandableRow(row) {
//   //   if (row.transactionCreatedDate!=undefined) return true;
//   //   else return false;
//   // }
//
//
//   // expandComponent(row) {
//   //   return (
//   //     <MlDetailsNotesComponent id={ row.transactionId } transaction={row} type={"approval"}/>
//   //   )
//   // }
//
//   render() {
//     // let MlActionConfig = [
//     //   {
//     //     showAction: true,
//     //     actionName: 'add',
//     //     iconID:'createRegistrationRequest',
//     //     handler: this.creatRequestType.bind(this)
//     //   }
//     // ];
//
//     /* const options = {
//      expandRowBgColor: 'rgb(242, 255, 163)'
//      };*/
//     const selectRow = {
//       mode: 'checkbox',
//       bgColor: '#feeebf',
//       clickToSelect: true,  // click to select, default is false
//       clickToExpand: true  // click to expand row, default is false// click to expand row, default is false
//     }
//     var WinHeight = $(window).height();
//     var tblHeight = WinHeight-(125+$('.admin_header').outerHeight(true));
//     const config = {
//       maxHeight: tblHeight+'px',
//       striped:true,
//       hover:true,
//     };
//     config['options']={
//       sizePerPage:10,
//       sizePerPageList: [10,20,50,100,200,300,500,700,1000,2000,3000],
//       clearSearch: false,
//       expandRowBgColor: 'rgb(242, 255, 163)'}
//     return (
//       <div className="admin_main_wrap">
//         <div className="admin_padding_wrap">
//           {/*<h2>Approvals</h2>*/}
//           <div className="main_wrap_scroll">
//
//             <BootstrapTable {...config} data={ this.state.transactionInfo }
//                             hover={true}
//                             // expandableRow={ this.isExpandableRow }
//                             // expandComponent={ this.expandComponent.bind(this) }
//                             selectRow={ selectRow }
//                             pagination
//                             bodyStyle={{overflow: 'overlay','overflowX':'hidden'}}
//             >
//               <TableHeaderColumn dataField="transactionId" isKey={true} dataSort={true} width='62px' dataAlign='center' hidden={true}>Id</TableHeaderColumn>
//               <TableHeaderColumn dataField="createdAt" >Date&Time</TableHeaderColumn>
//               <TableHeaderColumn dataField="transactionId">Requested Id</TableHeaderColumn>
//               <TableHeaderColumn dataField="transactionType">Type</TableHeaderColumn>
//               <TableHeaderColumn dataField="clusterName">Cluster</TableHeaderColumn>
//               <TableHeaderColumn dataField="chapterName">Chapter</TableHeaderColumn>
//               <TableHeaderColumn dataField="communityName">Community</TableHeaderColumn>
//               <TableHeaderColumn dataField="lastActionBy">Last Action By</TableHeaderColumn>
//               <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
//             </BootstrapTable>
//
//           </div>
//           {/*{this.state.createRequest?(<CreateRequestComponent openPopUp={true}/>):""}*/}
//           {/*<MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>*/}
//         </div>
//       </div>
//
//     )
//   }
// }

/**
 * Created by Rajat on 4/8/17.
 */

import React from 'react';
import MlTableViewContainer from "../../core/containers/MlTableViewContainer";
import {mlUserTransactions} from "../config/mlUsersTransactionConfig";

export default class MlUsersTransactions extends React.Component {

  render() {
    var config = mlUserTransactions;
    config.registrationId = this.props.config.registrationId;
    config.portfolioId = this.props.config.portfolioId;
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          {/*<h2>Office List</h2>*/}
          <MlTableViewContainer {...config}/>
        </div>
      </div>
    );
  }
};
