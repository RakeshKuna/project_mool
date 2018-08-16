/**
 * Created by Rajat
 */
import React from 'react';
import { render } from 'react-dom';
import {findAddressBookActionHandler} from '../../actions/findUserAddressBookHandler'
var FontAwesome = require('react-fontawesome');
import gql from 'graphql-tag';

export default class MlUserEmailDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      details:this.props.emailInfoDetails || [],
      selectedEmailTab: null,
      selectedEmailTypeLabel: null,
      selectedEmailTypeValue: null,
      emailDetailsObject: {"emailIdType": " ", "emailIdTypeName": " ", 'emailId': ''},
      activeTab: "active",
    }
    return this;
  }


  componentDidMount() {
    this.findRegistration.bind(this);
    $('#emailTab0').addClass('active');
    $('#emailIdType0').addClass('active');
  }

  async findRegistration() {
    let registrationId = this.props.registerId;

    const response = await findAddressBookActionHandler(registrationId);

    this.setState({loading: false, details: response.emailInfo});

  }

  emailTabSelected() {
    this.setState({selectedEmailTab: true});
    this.findRegistration();
    this.setState({activeTab: ""});
  }

  render(){
    let details=this.state.details;
    let that=this;
    let emailTypeQuery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
       label
       value
       }
     }
     `;
    let emailTypeOption={options: { variables: {type : "EMAILTYPE",hierarchyRefId:this.props.clusterId}}};

    return (<div className="panel-body">
        <div className="ml_tabs">
          <ul  className="nav nav-pills">
            {details && (details.map(function(options,key){
              return(
                <li key={key} onClick={that.emailTabSelected.bind(that,key)} id={"emailTab"+key}>
                  <a data-toggle="pill" href={'#emailIdType'+key} className="add-contact">
                    {options.emailIdTypeName}</a>
                </li>)
            }))}
          </ul>
          <div className="tab-content clearfix">
            {details && (details.map(function(options,key) {
              return(<div className="tab-pane" id={'emailIdType'+key} key={key}>
                {/*<div className="form-group">*/}
                  {/*<Moolyaselect multiSelect={false} ref={'emailIdType' + key}*/}
                                {/*placeholder="Select Email Type" mandatory={true}*/}
                                {/*className="form-control float-label" selectedValue={options.emailIdType}*/}
                                {/*valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={emailTypeQuery}*/}
                                {/*queryOptions={emailTypeOption} disabled="disabled"*/}
                                {/*isDynamic={true} data-required={true} data-errMsg="Email Type is required"/>*/}
                {/*</div>*/}
                <div className="form-group mandatory">
                  <input type="text" ref={'emailId' + key} placeholder="Enter URL" valueKey={options.emailId}
                         className="form-control float-label" defaultValue={options.emailId} data-required={true}
                         data-errMsg="Email Id is required" disabled={true}/>
                </div>
              </div>)
            }))}
          </div>
        </div>
      </div>
    )}
}
