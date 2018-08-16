import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlProcessSetupRequestsTableConfig} from "../config/MlProcessSetupRequestsConfig";
// import CreateRequestComponent from './CreateRequestComponent'
import _ from 'lodash';

export default class MlProcessSetupRequestsList extends Component {
  constructor(props){
    super(props);
    this.state={showCreateRequestComponent:false, time: new Date(),filActive:'all'};

    this.onPriorityChange = this.onPriorityChange.bind(this);
    // this.refreshList = this.refreshList.bind(this);

  }

  addRequestHandler(){
    this.setState({showCreateRequestComponent:true});
  }

  onPriorityChange(e,priority){
    e.preventDefault();
    let priorityFilter = [];
    switch(priority){
      case 'all':
        break;
      case 'priority-2':
        priorityFilter = [
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"Yet To Start"
          }
        ]
        break;
      case 'others':
        priorityFilter =[
          {
            fieldName:"status",
            fieldType:"List",
            operator:"$or",
            value:"Completed"   //not yet defined in status
          }
        ]
        break;
    }
    //

    this.setState({priorityFilter,filActive:priority});
  }

  render() {
    let actions= mlProcessSetupRequestsTableConfig.actionConfiguration;
    let action = _.find(actions, {"actionName": "add"});
    action.handler=this.addRequestHandler.bind(this);
    // let showCreateRequestComponent=this.state.showCreateRequestComponent;
    // let refreshList = this.refreshList.bind(this);
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <div className="ml_inner_btn">
            <a className={"h_btn "+(this.state.filActive==='all'?'fil_active':'')}
               onClick={e=>{this.onPriorityChange(e,'all')}}>All </a>

            <a className={"h_btn ml_red "+(this.state.filActive==='priority-1'?'fil_active':'')}
               // onClick={e=>this.onPriorityChange(e,'priority-1')}
            >1<sup>st</sup> Priority </a>

            <a className={"h_btn ml_orange "+(this.state.filActive==='priority-2'?'fil_active':'')}
               onClick={e=>this.onPriorityChange(e,'priority-2')}>2<sup>nd</sup> Priority </a>

            <a className={"h_btn ml_green "+(this.state.filActive==='priority-3'?'fil_active':'')}
               // onClick={e=>this.onPriorityChange(e,'priority-3')}
            >3<sup>rd</sup> Priority</a>

            <a className={"h_btn "+(this.state.filActive==='others'?'fil_active':'')}
               onClick={e=>this.onPriorityChange(e,'others')}>Others</a>
          </div>
          <h2>Process Setup </h2>
          <MlTableViewContainer {...mlProcessSetupRequestsTableConfig} priorityFilter={this.state.priorityFilter} forceFetch={false}/>
          {/*{showCreateRequestComponent?<CreateRequestComponent refreshList={refreshList} openPopUp={true}/>:<div></div>}*/}
        </div>
      </div>
    )
  }
}
