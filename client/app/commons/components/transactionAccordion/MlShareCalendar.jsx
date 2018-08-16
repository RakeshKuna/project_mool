import React from "react";
import MlShareCalendarPresentation from './MlShareCalendarPresentation';
import MlShareDetailsComponent from "../../../../admin/transaction/share/component/MlShareDetailsComponent";
// import {render} from "react-dom";
// import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
// // import {initalizeFloatLabel,OnToggleSwitch} from "../../../utils/formElemUtil";
// import {graphql} from "react-apollo";
import {fetchSharedCalendarDetails, deactivateSharedDetailsHandler} from '../../../../admin/transaction/share/actions/MlShareUserActionHandler'
// import moment from "moment";
// import gql from "graphql-tag";
// import MoolyaSelect from "../../../commons/components/MlAdminSelectWrapper";
// import {getAdminUserContext} from '../../../../commons/getAdminUserContext'
// import _ from "lodash";
var FontAwesome = require('react-fontawesome');

export default class MlShareCalendar extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      sharedData: {}
    }
    this.getShareDetails.bind(this);
    this.deactivateCalendar.bind(this);
    this.deactivateLink = this.deactivateLink.bind(this);
    return this;
  }

  // componentDidMount() {
  //   initalizeFloatLabel();
  // }
  // componentDidUpdate(){
  //   initalizeFloatLabel();
  //   OnToggleSwitch(true,true);
  // }
  //
  componentWillMount() {
    console.log('The props recieved are: ', this.props);
    let shareId= this.props && this.props.data ? this.props.data.transactionTypeId : '';
    if(shareId){
      this.setState({shareId: shareId}, function () {
        const resp = this.getShareDetails()
        return resp;
      }.bind(this));
    }
  }

  async getShareDetails() {
    const response  = await fetchSharedCalendarDetails(this.state.shareId)
    this.setState({sharedData: response})
    return response;
  }

  deactivateLink(item) {
    this.deactivateCalendar(item._id)
  }

  async deactivateCalendar(sharedId) {
    const resp = await deactivateSharedDetailsHandler(sharedId)
    if(resp) {
    if(resp.success) {
      toastr.success(resp.result)
    } else {
      toastr.error('Error Deactivating')
    }
    }
  }


  render() {
    let that = this;
    let data = that.state && that.state.sharedData? that.state.sharedData : {};
    return (
      <div>
        <MlShareCalendarPresentation
          propsData={that.state.sharedData}
          deactivateLink={this.deactivateLink}/>
      </div>
    );
  }
}



