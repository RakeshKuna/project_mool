import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moolyaselect from  '../../commons/components/MlAdminSelectWrapper'
import update from 'immutability-helper';
import {updateContactDetails} from '../actions/addAddressBookAction'
import {getContactDetails} from '../actions/getAddressBookAction'
import { initalizeFloatLabel } from '../../../commons/utils/formElemUtil';

export default class ContactDetails extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading : true,
      selectedNumberTypeValue : null,
      selectedContactTab: null,
      selectedNumberTypeLabel: null,
      contactNumberObject:{numberType : "",numberTypeName: "",countryCode: "",contactNumber: ""},
      contactNumberArray : this.props.registrationInfo.contactInfo|| [],
      activeTab : "active"
    }
    this.findRegistration.bind(this);
    return this;
  }
  componentDidMount(){
    // this.findRegistration.bind(this);
    initalizeFloatLabel();
  }

  componentWillMount(){
    this.findRegistration()
  }
  componentWillUpdate(nextProps, nextState) {
  }
  updateContactOptions(index, did, selectedValue, selObject,callback){
    if (index !== -1) {
      // do your stuff here
      let updatedComment = update(this.state.contactNumberArray[index], {
        numberTypeName : {$set: selObject.label},/**/
        numberType :   {$set: did},
        countryCode : {$set: this.refs["countryCode"+index].value},
        contactNumber : {$set: this.refs["contactNumber"+index].value}});

      let newData = update(this.state.contactNumberArray, {
        $splice: [[index, 1, updatedComment]]
      });
      this.setState({contactNumberArray : newData,selectedNumberTypeValue : did,selectedNumberTypeLabel : selObject.label});

    }

  }
   async onSavingContact(index,value){
     let detailsType = "CONTACTTYPE";
     let registerid = this.props.registerId;

      let contactList = this.state.contactNumberObject;
        contactList.numberType = this.state.selectedNumberTypeValue,
        contactList.numberTypeName = this.state.selectedNumberTypeLabel,
        contactList.countryCode = this.refs["countryCode"].value,
        contactList.contactNumber = this.refs["contactNumber"].value;
      const response = await updateContactDetails(contactList,detailsType);
      if(response){
        if(!response.success){
          toastr.error(response.result);
          this.findRegistration();
          this.props.registrationDetails();
        }else{
          this.findRegistration();
          this.props.registrationDetails();
          this.refs.countryCode.value="";
          this.refs["contactNumber"].value="";
          this.setState({selectedNumberTypeValue : "",selectedNumberTypeLabel : ""});
        }
      }
  }
  async onEditingContact(index,value){
    let detailsType = "CONTACTTYPE";
    let registerid = this.props.registerId;

    let registrationDetails = this.props.registrationInfo.contactInfo
    let dbData = _.pluck(registrationDetails, 'numberType') || [];
    let contactExist = null;
    if(this.state.selectedNumberTypeValue){
      contactExist = _.contains(dbData,this.state.selectedNumberTypeValue );
    }
    if(contactExist){
      toastr.error("'Contact Type' already exists");
      this.findRegistration();
      this.props.registrationDetails();
    }else{
      let labelValue = this.state.selectedNumberTypeLabel ? this.state.selectedNumberTypeLabel : this.state.contactNumberArray[index].numberTypeName;
      let valueSelected = this.state.selectedNumberTypeValue ? this.state.selectedNumberTypeValue : this.state.contactNumberArray[index].numberType;
      let updatedComment = update(this.state.contactNumberArray[index],{
        numberTypeName : {$set: labelValue},
        numberType :   {$set: valueSelected},
        countryCode : {$set: this.refs["countryCode"+index].value},
        contactNumber : {$set: this.refs["contactNumber"+index].value}});

      let newData = update(this.state.contactNumberArray, {
        $splice: [[index, 1, updatedComment]]
      });
      const response = await updateContactDetails(newData,detailsType);
      if(response){
        if(!response.success){
          toastr.error(response.result);
        }
        this.findRegistration();
        this.props.registrationDetails();
      }
    }



  }
  async findRegistration(){
    const response = await getContactDetails();
    this.setState({loading:false,contactNumberArray:response.contactInfo});
    //this.setState({'isMoolyaChecked':this.state.data&&this.state.data.isMoolya})
    //return response;
  }
  tabSelected(index,value){
    this.setState({selectedContactTab : true});
    this.setState({activeTab : ""});
    this.findRegistration();
  }



  optionsBySelectNumberType(selectedIndex,handler,selectedObj){
    this.setState({selectedNumberTypeValue : selectedIndex,selectedNumberTypeLabel:selectedObj.label});
  }
  async onDeleteContact(index,value){

    let listArray = update(this.state.contactNumberArray, {
      $splice: [[index, 1]]
    });

    let detailsType = "CONTACTTYPE";
    const response = await updateContactDetails(listArray,detailsType);
    if(response){
      this.setState({loading:false,contactNumberArray:response.contactInfo});
      this.findRegistration();
      this.props.registrationDetails();
      this.setState({activeTab : "active"});
    }
  }



  render(){
    let that=this;
    let numberTypeQuery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    {console.log(this.props)}
     let numberTypeOption={options: { variables: {type : "CONTACTTYPE",hierarchyRefId:this.props.clusterId}}};


    return (

      <div className="panel-body">

        <div className="ml_tabs">
          <ul  className="nav nav-pills">
            <li className={this.state.activeTab}>
              <a  href="#contactA" data-toggle="tab">Add New&nbsp;<b><FontAwesome name='plus-square'/></b></a>
            </li>

            {that.state.contactNumberArray && (that.state.contactNumberArray.map(function(options,key){

              return(
                <li key={key} onClick={that.tabSelected.bind(that,key)}>
                  <a data-toggle="pill" href={'#numberType'+key} className="add-contact">
                    <FontAwesome name='minus-square'/>{options.numberTypeName}</a>
                </li>)


            }))}
          </ul>

          <div className="tab-content clearfix">
            <div className={"tab-pane"+this.state.activeTab} id="contactA">
              <div className="form-group">
                <Moolyaselect multiSelect={false} ref="numberType" placeholder="Select Number Type" query={numberTypeQuery}
                              queryOptions={numberTypeOption} className="form-control float-label" selectedValue = {this.state.selectedNumberTypeValue}
                              valueKey={'value'} labelKey={'label'} queryType={"graphql"}
                              onSelect={this.optionsBySelectNumberType.bind(this)}
                              isDynamic={true}/>
              </div>
              <div className="form-group">
                <input type="text" placeholder="Enter Country Code" defaultValue={this.state.contactNumberObject.countryCode} ref={'countryCode'} className="form-control float-label" id=""/>
              </div>
              <div className="form-group">
                <input type="text" ref={"contactNumber"} placeholder="Enter Number" id="phoneNumber" className="form-control float-label"/>
              </div>
              <div className="ml_icon_btn">
                <a href="#"  onClick={this.onSavingContact.bind(this)}  className="save_btn" ><span
                  className="ml ml-save"></span></a>
                {/*<a href="#" id="cancel_contact" className="cancel_btn"><span className="ml ml-delete"></span></a>*/}
              </div>
            </div>
            {that.state.contactNumberArray && (that.state.contactNumberArray.map(function(options,key) {
              let test = that.state.contactNumberArray;
              return(<div className="tab-pane" id={'numberType'+key} key={key} >
                <div className="form-group">
                  <Moolyaselect multiSelect={false} ref={"numberType"+key} placeholder="Select NumberType"
                                className="form-control float-label" selectedValue={options.numberType}
                                valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={numberTypeQuery}
                                queryOptions={numberTypeOption} onSelect={that.updateContactOptions.bind(that,key)}
                                isDynamic={true}/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Enter Country Code" ref={'countryCode'+key} defaultValue={options.countryCode} valueKey={options.countryCode}
                         className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" ref={'contactNumber'+key} placeholder="Enter Number" valueKey={options.contactNumber} id="phoneNumber" defaultValue={options.contactNumber}
                         className="form-control float-label"/>
                </div>
                <div className="ml_icon_btn">
                  <a href="#" onClick={that.onEditingContact.bind(that,key)} className="save_btn"><span
                    className="ml ml-save"></span></a>
                  <a href="#" id="cancel_contact" className="cancel_btn" onClick={that.onDeleteContact.bind(that,key)} ><span className="ml ml-delete"></span></a>
                </div>
              </div>)
            }))}

          </div>
        </div>
      </div>
    )}
}
