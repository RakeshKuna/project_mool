import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlUserTypeTableConfig} from "../config/mlRegistrationApprovedConfig";
import  MlAssignComponent from "./MlAssignComponent"
import _ from 'lodash';
export default class MlRegistrtionApprovedList extends Component {
  constructor(props){
    super(props);
    this.state={show:false,requestId:null};
    this.assignActionHandler.bind(this);
  }
  componentDidMount() {
  }
  assignActionHandler(data){
    if(data&&data.id){
      this.setState({requestId:data.id,show:true});
      console.log(data);
      console.log("yipppe its working");
    }else{
      this.setState({requestId:null,show:false});
      alert("please select a record");
    }
  }

  render() {
    let actions= mlUserTypeTableConfig.actionConfiguration;
    let action = _.find(actions, {"actionName": "assign"});
    action.handler=this.assignActionHandler.bind(this);
    let showAssignComponent=this.state.show;
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Approved List</h2>

          <MlTableViewContainer {...mlUserTypeTableConfig} forceFetch={false}/>
          {showAssignComponent&&<MlAssignComponent />}
        </div>


      </div>
    )
  }
}
