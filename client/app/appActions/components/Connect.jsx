/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import React from "react";
import {render} from "react-dom";
import {connectActionHandler,acceptConnectionActionHandler,rejectConnectionActionHandler} from '../actions/connectActionHandler';

export default class Connect extends React.Component {

  constructor(props) {
    super(props);
    return this;
  }

  async connectHandler(){
    var resourceDetails=this.props.data||{};
    console.log(resourceDetails);
    var response=await connectActionHandler({'resourceId':resourceDetails.resourceId,'resourceType':resourceDetails.resourceType});
    if(response && response.success){
      toastr.success(response.result);
    }else{
      toastr.error("Failed to send the connection request");
    }
    this.props.toggle();
  }

  async acceptConnectionHandler(){
    var response=await acceptConnectionActionHandler({'connectionId':'yQqsrA5TaXptNJGEr'});
    if(response){
      toastr.success("connection accepted");
    }else{
      toastr.error("Failed to accept the connect request");
    }
    this.props.toggle();
  }

  async rejectConnectionHandler(){
    var response=await rejectConnectionActionHandler({'connectionId':'yQqsrA5TaXptNJGEr'});
    if(response){
      toastr.success("connection rejected");
    }else{
      toastr.error("Failed to reject the connection");
    }
    this.props.toggle();
  }

  render() {

    return (
      <div>
        Do you want to connect ?
        <div className="ml_btn">
          <a href="" className="save_btn" onClick={this.connectHandler.bind(this)}>Connect</a>
          <a href="" className="cancel_btn" onClick={this.props.toggle}>Cancel</a>
        </div>

      </div>

    );
  }

}
