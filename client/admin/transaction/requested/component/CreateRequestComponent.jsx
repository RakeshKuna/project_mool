import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {addReqgistrationRequestInfo} from '../actions/addRegistrationRequestAction'
export default class CreateRequestComponent extends Component {

  constructor(props){
    super(props);
    this.state={
      show:true,
      requestType:null
    };
    return this;
  }
  optionsBySelectRequestType(value){
    this.setState({requestType:value})
  }
  componentWillReceiveProps(newProps){
    let popup=newProps.openPopUp
    if(popup){
      this.setState({show:true})
    }
  }
  async createRequest(){
    let transaction={
      requestTypeId:this.state.requestType,
      requestDescription:this.refs.about.value,
      transactionStatus:{
        code: 1,
        description:"requested"
      },
      status:"Pending"
    }
    const response = await addReqgistrationRequestInfo(transaction);
    if(response.success){
      this.setState({show:false,requestType:null})
      FlowRouter.go("/admin/transactions/requestedList");
      toastr.success("Request created successfully");
    }else{
      toastr.error(response.result);
      this.setState({show:false})
      FlowRouter.go("/admin/transactions/requestedList");
    }
  }

  cancel(){
    //this.state.show = false
    this.setState({show:false})
    FlowRouter.go("/admin/transactions/registrationRequested");/*/transactions/registrationRequested");*/
  }

  render() {
    let requestTypeQuery=gql`query{
  data:FetchRequestType {
    label:requestName
    value:_id
  }
}`;

    return (
      <div>
        {this.state.show==true?
          <div className="panel panel-default-bottom col-md-12">
            <div className="mrgn-btm">
              <label>Create Request</label>
            </div>
            <div className="form-group">
              <Moolyaselect multiSelect={false} placeholder="Request type" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.requestType} queryType={"graphql"} query={requestTypeQuery} onSelect={this.optionsBySelectRequestType.bind(this)} isDynamic={true}/>
            </div>
            <div className="form-group">
              <textarea ref="about" placeholder="About" className="form-control float-label" id=""></textarea>
            </div>

            <div className="assign-popup">
              <a data-toggle="tooltip" title="Submit" data-placement="top" onClick={this.createRequest.bind(this)} className="hex_btn hex_btn_in">
                <span className="ml ml-save"></span>
              </a>
              <a data-toggle="tooltip" title="Cancel" data-placement="top" href="" className="hex_btn hex_btn_in" onClick={this.cancel.bind(this)}>
                <span className="ml ml-delete"></span>
              </a>
            </div>


          </div>
          :<div></div>}
      </div>

    )
  }
}
