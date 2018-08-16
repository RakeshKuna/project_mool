import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlUserTypeTableConfig} from "../config/mlRequestedConfig";
import  MlAssignComponent from "./MlAssignComponent"
import CreateRequestComponent from './CreateRequestComponent'
import _ from 'lodash';
export default class MlRequestedList extends Component {
  constructor(props){
     super(props);
     this.state={show:false,showCreateComponent:false,requestId:null,transactionId:null,clusterId:null,filActive:'all'};
     this.assignActionHandler.bind(this);
     this.onPriorityChange = this.onPriorityChange.bind(this);
  }
  showPopUp(value) {
    this.setState({'show': value})
  }

  componentDidMount() {

    /*$("#Reg_Request").popover({
      'title' : 'Title Here',
      'html' : true,
      'placement' : 'top',
      'container' : '.admin_main_wrap',
      'content' : $(".ml_assignrequest").html()
    });*/

  }
  assignActionHandler(data){
    if(data&&data.id){
    this.setState({requestId:data.id,show:true,transactionId:data.registrationId,clusterId:data.clusterId});
    console.log(data);
    console.log("yipppe its working");
    }else {
      this.setState({requestId:null,show:false});
      toastr.error("Please select a record");
    }
  }
  assignAddActionHandler(){
    this.setState({show:true});
  }

  onPriorityChange(e,priority){
    e.preventDefault();
    let priorityFilter = [];
    switch(priority){
      case 'all':
        break;
      case 'priority-1':
        priorityFilter = [
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_EMAIL_V"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_KYC_U_PEND"
          }
        ]
        break;
      case 'priority-2':
        priorityFilter =[
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$and",
            value:"REG_PORT_PEND"
          }
        ]
        break;
      case 'priority-3':
        priorityFilter =[
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$and",
            value:"REG_EMAIL_P"
          }
        ]
        break;
      case 'others':
        priorityFilter =[
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_USER_REJ"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_USER_APR"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_KYC_A_APR"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_ADM_REJ"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_KYC_A_REJ"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_KYC_U_KOFF"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_SOFT_APR"
          },
        ]
        break;
    }
    //

    this.setState({priorityFilter,filActive:priority});
  }

  render() {
   let actions= mlUserTypeTableConfig.actionConfiguration;
   let action = _.find(actions, {"actionName": "assign"});
   action.handler=this.assignActionHandler.bind(this);
    let addAction = _.find(actions, {"actionName": "add"});
    if(addAction){
      addAction.handler=this.assignAddActionHandler.bind(this);
    }
    let showAssignComponent=this.state.show;
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
        <div className="ml_inner_btn">
          <a className={"h_btn "+(this.state.filActive==='all'?'fil_active':'')}
             onClick={e=>{this.onPriorityChange(e,'all')}}>All </a>

          <a className={"h_btn ml_red "+(this.state.filActive==='priority-1'?'fil_active':'')}
             onClick={e=>this.onPriorityChange(e,'priority-1')}>1<sup>st</sup> Priority </a>

          <a className={"h_btn ml_orange "+(this.state.filActive==='priority-2'?'fil_active':'')}
             onClick={e=>this.onPriorityChange(e,'priority-2')}>2<sup>nd</sup> Priority </a>

          <a className={"h_btn ml_green "+(this.state.filActive==='priority-3'?'fil_active':'')}
             onClick={e=>this.onPriorityChange(e,'priority-3')}>3<sup>rd</sup> Priority</a>

          <a className={"h_btn "+(this.state.filActive==='others'?'fil_active':'')}
             onClick={e=>this.onPriorityChange(e,'others')}>Others</a>
          </div>
          <h2>Requested List</h2>

          <MlTableViewContainer {...mlUserTypeTableConfig} priorityFilter={this.state.priorityFilter} forceFetch={false}/>
          {showAssignComponent&&<MlAssignComponent transactionType={"registration"} transactionId={this.state.transactionId} clusterId={this.state.clusterId} showPopUp={this.showPopUp.bind(this)}/>}
         </div>
      </div>
    )
  }
}
