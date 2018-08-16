import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import ScrollArea from 'react-scrollbar';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import MlDetailsNotesComponent from './MlDetailsNotesComponent'
import {findTransactionApprovalActionHandler} from '../actions/findRequestsApproval'
import moment from 'moment'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import CreateRequestComponent from '../../requested/component/CreateRequestComponent'
export default class MlTransactionApprovals extends Component {
  constructor(props){
    super(props);
    this.state={
      requetsInfo:[],
      createRequest:false,
    }
    return this;
  }
  componentWillMount() {
    // this.setState({requetsInfo:[{transactionCreatedDate:'',transactionTypeId:'',transactionTypeName:'',status:''}]})
    const resp=this.findRequestDetails();
    return resp;
  }
  async findRequestDetails(){

    let requestDetails = await findTransactionApprovalActionHandler('ML-REQ-00000053');
    let requestInfo = []
    for (let i = 0; i < requestDetails.length; i++) {
      let json = {
        transactionCreatedDate: moment(requestDetails[i].transactionCreatedDate).format(Meteor.settings.public.dateFormat),
        requestDescription:requestDetails[i].requestDescription,
        requestTypeName:requestDetails[i].requestTypeName,
        requestId: requestDetails[i].requestId,
        userId: requestDetails[i].userId,
        transactionTypeName: requestDetails[i].transactionTypeName,
        status:requestDetails[i].status,
        transactionId:requestDetails[i]._id
      }
      requestInfo.push(json)
    }
    this.setState({'requetsInfo':requestInfo})
  }

  isExpandableRow(row) {
    if (row.transactionCreatedDate!=undefined) return true;
    else return false;
  }


  expandComponent(row) {
    return (
      <MlDetailsNotesComponent id={ row.transactionId } transaction={row} type={"approval"}/>
    )
  }
  creatRequestType(){
    this.setState({createRequest:true});
  }

  render() {
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'add',
        iconID:'createRegistrationRequest',
        handler: this.creatRequestType.bind(this)
      }
    ];
   /* const options = {
      expandRowBgColor: 'rgb(242, 255, 163)'
    };*/
    const selectRow = {
      mode: 'checkbox',
      bgColor: '#feeebf',
      clickToSelect: true,  // click to select, default is false
      clickToExpand: true  // click to expand row, default is false// click to expand row, default is false
    }
    var WinHeight = $(window).height();
    var tblHeight = WinHeight-(125+$('.admin_header').outerHeight(true));
    const config = {
      maxHeight: tblHeight+'px',
      striped:true,
      hover:true,
    };
    config['options']={
      sizePerPage:10,
      sizePerPageList: [10,20,50,100,200,300,500,700,1000,2000,3000],
      clearSearch: false,
      expandRowBgColor: 'rgb(242, 255, 163)'}
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Approvals</h2>
          <div className="main_wrap_scroll">

              <BootstrapTable {...config} data={ this.state.requetsInfo }
                              hover={true}
                               expandableRow={ this.isExpandableRow }
                               expandComponent={ this.expandComponent.bind(this) }
                               selectRow={ selectRow }
                               pagination
                              bodyStyle={{overflow: 'overlay','overflowX':'hidden'}}
              >
                <TableHeaderColumn dataField="transactionId" isKey={true} dataSort={true} width='62px' dataAlign='center' hidden={true}>Id</TableHeaderColumn>
                <TableHeaderColumn dataField="transactionCreatedDate" >Date&Time</TableHeaderColumn>
                <TableHeaderColumn dataField="requestId">ApprovalId</TableHeaderColumn>
                <TableHeaderColumn dataField="requestTypeName">Type</TableHeaderColumn>
                <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
              </BootstrapTable>

          </div>
          {this.state.createRequest?(<CreateRequestComponent openPopUp={true}/>):""}
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
        </div>
      </div>

    )
  }
};

