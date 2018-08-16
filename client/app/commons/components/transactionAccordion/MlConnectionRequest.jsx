/**
 * Created by Mohammed.Mohasin on 21/6/17.
 */
import React, {Component} from 'react';
import MlConnectionRequestPresentation from './MlConnectionRequestPresentation';
import MlLoader from '../../../../commons/components/loader/loader';
import {fetchConnectionRequestHandler,acceptConnectionActionHandler,rejectConnectionActionHandler} from '../../../appActions/actions/connectActionHandler';

export default class MlConnectionRequest extends Component{
  constructor(props){
    super(props);
    this.fetchConnectionDetails.bind(this);
    this.state = {'connectionId': null, 'data': {}, loading: true};
    this.acceptConnectionHandler = this.acceptConnectionHandler.bind(this);
    this.rejectConnectionHandler = this.rejectConnectionHandler.bind(this);
    return this;
  }

  async fetchConnectionDetails(){
    let transactionId=this.props.data&&this.props.data._id?this.props.data._id:null;
    if( transactionId && this.props.data.transactionType == "connectionRequest" ){
      let connection  = await fetchConnectionRequestHandler(transactionId);
      this.setState({data:connection||{},connectionId:(connection||{})._id,loading:false});
    }else
      this.setState({loading: false})
  };

  componentWillMount(){
    // await this.fetchConnectionDetails();
    const resp = this.fetchConnectionDetails();
    return resp
  }

  async acceptConnectionHandler(){
    var response=await acceptConnectionActionHandler({'connectionId':this.state.connectionId});
    if(response){
      toastr.success(response.result);
      await this.fetchConnectionDetails();
    }else{
      toastr.error("Failed to accept the connect request");
    }
  }

  async rejectConnectionHandler(){
    var response=await rejectConnectionActionHandler({'connectionId':this.state.connectionId});
    if(response){
      toastr.success(response.result);
      await this.fetchConnectionDetails();
    }else{
      toastr.error("Failed to reject the connection");
    }
  }

  render(){

    const {data} = this.props;
    // var data=this.state.data;
    let userDetails = {
      userId: data && data.fromProfileId ? data.fromProfileId : '',
      transactionId: data && data.transactionId ? data.transactionId : '',
      dateTime: data && data.createdAt ? data.createdAt : '',
      name: data && data.createdby ? data.createdby : '',
      email: data && data.email ? data.email : '',
      phoneNo: data && data.mobileNumber ? data.mobileNumber : '',
      cluster: data && data.chapter ? data.chapter : '',
      chapter: data && data.cluster ? data.cluster : '',
      subChapter: data && data.subChapter ? data.subChapter : '',
      community: data && data.community ? data.community : ''
    };

    let activityLog = {
      dateTime: data && data.createdAt ? data.createdAt : '',
      type: data && data.transactionType ? (data.transactionType == "interaction" ? data.activity : data.transactionType ): '',
      status: data && data.status ? data.status : ''
    };

    const showLoader=this.state.loading;
    return(
      <div>
        {showLoader===true?(<MlLoader/>):(
          <MlConnectionRequestPresentation
            userDetails={userDetails}
            activityLog={activityLog}
            canAccept={this.state.data.canAccept}
            canReject={this.state.data.canReject}
            acceptConnectionHandler={this.acceptConnectionHandler}
            rejectConnectionHandler={this.rejectConnectionHandler}
          />
        )}
      </div>
    )
  }
}
