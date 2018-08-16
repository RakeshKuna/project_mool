import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../../core/containers/MlTableViewContainer";
import {mlRequestedPortfolioTableConfig} from "../../config/mlRequestedPortfolioConfig";
import  MlAssignComponent from "../../../requested/component/MlAssignComponent"
import _ from 'lodash';
export default class MlRequestedPortfolioList extends Component {
  constructor(props){
    super(props);
    this.state={show:false,requestId:null,filActive:'all'};
    this.assignActionHandler.bind(this);
    this.onPriorityChange = this.onPriorityChange.bind(this);
  }

  assignActionHandler(data){
    if(data&&data.id){
      this.setState({requestId:data.id,show:true});
      console.log(data);
      console.log("yipppe its working");
    }else{
      this.setState({requestId:null,show:false});
      toastr.error("please select a record");
    }
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
            value:"PORT_GO_LIVE_PEND"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"INV_PRC_PEND"
          }
        ]
        break;
      case 'priority-2':
        priorityFilter = [
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_PORT_PEND"
          }
        ]
        break;
      case 'others':
        priorityFilter =[
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_PORT_KICKOFF"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"REG_PORT_APR"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"PORT_LIVE_NOW"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"PORT_INACT"
          },
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"PORT_REVIEW_INPRO"
          },
        ]
        break;
    }
    //

    this.setState({priorityFilter,filActive:priority});
  }

  render() {
    let actions= mlRequestedPortfolioTableConfig.actionConfiguration;
    let action = _.find(actions, {"actionName": "assign"});
    action.handler=this.assignActionHandler.bind(this);
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
               // onClick={e=>this.onPriorityChange(e,'priority-3')}
            >3<sup>rd</sup> Priority</a>

            <a className={"h_btn "+(this.state.filActive==='others'?'fil_active':'')}
               onClick={e=>this.onPriorityChange(e,'others')}>Others</a>
          </div>
          <h2>Requested List</h2>

          <MlTableViewContainer {...mlRequestedPortfolioTableConfig} priorityFilter={this.state.priorityFilter} forceFetch={false}/>

        </div>


      </div>
    )
  }
}
