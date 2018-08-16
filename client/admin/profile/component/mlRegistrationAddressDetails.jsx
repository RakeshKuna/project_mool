import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import { graphql } from 'react-apollo';
import Moolyaselect from  '../../commons/components/MlAdminSelectWrapper';
import {updateRegistrationInfoDetails} from '../actions/updateRegistration'
import update from 'immutability-helper';
import {updateContactDetails} from '../actions/addAddressBookAction'
import {getContactDetails} from '../actions/getAddressBookAction'
import gql from 'graphql-tag';
import __ from "lodash";  // double underscore
import { initalizeFloatLabel } from '../../../commons/utils/formElemUtil';

export default class AddressDetails extends React.Component{
  constructor(props){
    super(props);
    let addressInfoObject = {"addressType" : " ","addressTypeName": "Add New",'name' : '','phoneNumber' : '','addressFlat' : '',
      'addressLocality': '','addressLandmark':'','addressArea': '',
      'addressCity': '','addressState':'','addressCountry':'','addressPinCode':''}
    this.state={
      loading:true,
      selectedTab : null,
      selectedAddressLabel : null,
      selectedValue : null,
      /* selectedValuesList : [],*/
      addressInformation : addressInfoObject,
      addressDetails: this.props.registrationInfo.addressInfo || [],
      activeTab : "active"

    }
    //this.optionsBySelectNumberType.bind(this)
    this.findRegistration.bind(this)
    return this;
  }


  optionsBySelectAddressType(selectedIndex,handler,selectedObj){
    this.setState({selectedValue : selectedIndex,selectedAddressLabel:selectedObj.label});
  }
  updateOptions(index, did, selectedValue, selObject,callback){
    /* let selectedSocialLinkArray =  this.state.socialLinkArray || []
     let selectedArrayObject = selectedSocialLinkArray[index] || {};
     selectedArrayObject =  JSON.parse(JSON.stringify(selectedArrayObject));*/
    if (index !== -1) {
      // do your stuff here

      let updatedComment = update(this.state.addressDetails[index], {
        addressTypeName : {$set: selObject.label},
        addressType : {$set: did},
        name : {$set: this.refs["name"+index].value},
        phoneNumber : {$set: this.refs["phoneNumber"+index].value},
        addressFlat : {$set: this.refs["addressFlat"+index].value},
        addressLocality : {$set: this.refs["addressLocality"+index].value},
        addressLandmark : {$set: this.refs["addressLandmark"+index].value},
        addressArea : {$set: this.refs["addressArea"+index].value},
        addressCity : {$set: this.refs["addressCity"+index].value},
        addressState : {$set: this.refs["addressState"+index].value},
        addressCountry : {$set: this.refs["addressCountry"+index].value},
        addressPinCode : {$set: this.refs["addressPinCode"+index].value},
        latitude : {$set: this.refs["latitude"+index].value},
        longitude : {$set: this.refs["longitude"+index].value}
      });

      let newData = update(this.state.addressDetails, {
        $splice: [[index, 1, updatedComment]]
      });

      this.setState({addressDetails : newData,selectedValue : did,selectedAddressLabel : selObject.label});

    }

  }
  addressTabSelected(index,value){
    this.setState({selectedTab : true});
    this.setState({activeTab : ""});
  }



  async onDeleteAddress(index,value){

    let listArray = update(this.state.addressDetails, {
      $splice: [[index, 1]]
    });
    let detailsType = "ADDRESSTYPE";
    let registerid = this.props.registerId;
    const response = await updateRegistrationInfoDetails(listArray,detailsType,registerid);
    if(response){
      this.setState({loading:false,addressDetails:response.addressInfo});
      // this.findRegistration();
      // this.props.registrationDetails();
      this.props.addressUpdated()
      this.setState({activeTab : "active"});
    }
  }


  async onSavingAddress(index,value){
    const detailsType = "ADDRESSTYPE";
    const registerid = this.props.registerId;

    let addressDetailsObject = this.state.addressInformation;
      addressDetailsObject.addressType = this.state.selectedValue,
      addressDetailsObject.addressTypeName = this.state.selectedAddressLabel,
      addressDetailsObject.name = this.refs["name"].value,
      addressDetailsObject.phoneNumber = this.refs["phoneNumber"].value,
      addressDetailsObject.addressFlat = this.refs["addressFlat"].value,
      addressDetailsObject.addressLocality = this.refs["addressLocality"].value,
      addressDetailsObject.addressLandmark = this.refs["addressLandmark"].value,
      addressDetailsObject.addressArea = this.refs["addressArea"].value,
      addressDetailsObject.addressCity = this.refs["addressCity"].value,
      addressDetailsObject.addressState = this.refs["addressState"].value,
      addressDetailsObject.addressCountry =  this.refs["addressCountry"].value,
      addressDetailsObject.addressPinCode = this.refs["addressPinCode"].value;
      const response = await updateContactDetails(addressDetailsObject,detailsType);
      if(response){
        //this.props.getRegistrationContactInfo();
        if(!response.success){
          toastr.error(response.result);
          // this.findRegistration();
          // this.props.registrationDetails();
          this.props.addressUpdated()
        }else{
          // this.findRegistration();
          // this.props.registrationDetails();
          this.refs["name"].value=""
          this.refs["phoneNumber"].value = "";
          this.refs["addressFlat"].value = "";
          this.refs["addressLocality"].value="";
          this.refs["addressLandmark"].value="";
          this.refs["addressArea"].value = "";
          this.refs["addressCity"].value = "";
          this.refs["addressState"].value = "";
          this.refs["addressCountry"].value = "";
          this.refs["addressPinCode"].value = "";
          this.setState({selectedValue : "",selectedAddressLabel : ""});

          this.props.addressUpdated()
          toastr.success("Address updated successfully")
        }
      }
  }

  async onEditAddress(index,value){
    const detailsType = "ADDRESSTYPE";
    const registerid = this.props.registerId;
    if (index !== -1) {
      // do your stuff here
      let registrationDetails = this.props.registrationInfo.addressInfo
      let dbData = _.pluck(registrationDetails, 'addressType') || [];
      let contactExist = null;
      if(this.state.selectedValue){
        contactExist = _.contains(dbData,this.state.selectedValue );
      }
      if(contactExist){
        toastr.error("'Address Type' already exists");
        this.props.addressUpdated()
        // this.findRegistration();
        // this.props.registrationDetails();
      }else{
        let labelValue = this.state.selectedAddressLabel ? this.state.selectedAddressLabel : this.state.addressDetails[index].addressTypeName;
        let valueSelected = this.state.selectedValue ? this.state.selectedValue : this.state.addressDetails[index].addressType;
        let updatedComment = update(this.state.addressDetails[index], {
          addressTypeName : {$set: labelValue},
          addressType : {$set: valueSelected},
          name : {$set: this.refs["name"+index].value},
          phoneNumber : {$set: this.refs["phoneNumber"+index].value},
          addressFlat : {$set: this.refs["addressFlat"+index].value},
          addressLocality : {$set: this.refs["addressLocality"+index].value},
          addressLandmark : {$set: this.refs["addressLandmark"+index].value},
          addressArea : {$set: this.refs["addressArea"+index].value},
          addressCity : {$set: this.refs["addressCity"+index].value},
          addressState : {$set: this.refs["addressState"+index].value},
          addressCountry : {$set: this.refs["addressCountry"+index].value},
          addressPinCode : {$set: this.refs["addressPinCode"+index].value},
          latitude : {$set: this.refs["latitude"+index].value},
          longitude : {$set: this.refs["longitude"+index].value}
        });

        let newData = update(this.state.addressDetails, {
          $splice: [[index, 1, updatedComment]]
        });
        newData = __.cloneDeep(newData);
        let newArr = [];
        _.each(newData, function (item) {
          for (var propName in item) {
            if (propName == "__typename") {
              delete item[propName];
            }
          }
          newArr.push(item)
        })
        newData = newArr
        const response = await updateContactDetails(newData,detailsType);
        if(response){
          if(!response.success){
            toastr.error(response.result);
          }else{
            toastr.success(response.result);
          }
          // this.findRegistration();
          // this.props.registrationDetails();
          this.props.addressUpdated()
        }
      }
    }
  }
  componentWillMount(){
    this.findRegistration()
  }

  componentDidMount(){
    initalizeFloatLabel();
  }

  async findRegistration(){
    const response = await getContactDetails();
    this.setState({loading:false,addressDetails:response.addressInfo});
  }



  render(){

    let that=this;
    let addressTypeQuery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;

    let addressTypeOption={options: { variables: {type : "ADDRESSTYPE",hierarchyRefId:this.props.clusterId}}};

    return (
      <div className="panel-body">


        <div className="ml_tabs">
          <ul  className="nav nav-pills">
             <li className={this.state.activeTab}>
                <a  href="#1a" data-toggle="tab">Add New&nbsp;<b><FontAwesome name='plus-square' /></b></a>
             </li>
            {that.state.addressDetails && (that.state.addressDetails.map(function(options,key){

              return(
                <li key={key} onClick={that.addressTabSelected.bind(that,key)}>
                  <a data-toggle="pill" href={'#adressType'+key} className="add-contact">
                    <FontAwesome name='minus-square'/>{options.addressTypeName}</a>
                </li>)


            }))}
          </ul>

          <div className="tab-content clearfix">

              <div className={"tab-pane"+this.state.activeTab} id="1a">
                <div className="form-group">
                  <Moolyaselect multiSelect={false} ref={'address'}
                                placeholder="Select Address Type" query={addressTypeQuery} queryOptions={addressTypeOption}
                                className="form-control float-label" selectedValue={this.state.selectedValue}
                                valueKey={'value'} labelKey={'label'} queryType={"graphql"} onSelect={this.optionsBySelectAddressType.bind(this)}
                                isDynamic={true}/>
                </div>
                <div className="form-group">
                  <input type="text"  ref={'name'} placeholder="Name" className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" ref={'phoneNumber'} placeholder="Phone Number" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" ref={'addressFlat'} placeholder="Flat/House/Floor/Bulding No" className="form-control float-label" id="" a/>
                </div>
                <div className="form-group">
                  <input type="text" ref={'addressLocality'} placeholder="Colony/Street/Locality" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" ref={'addressLandmark'} placeholder="Landmark" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" ref={'addressArea'} placeholder="Area" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" ref={'addressCity'} placeholder="Town/City" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" ref={'addressState'} placeholder="State" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" ref={'addressCountry'} placeholder="Country" name ={'addressCountry'}
                         className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" ref={'addressPinCode'} placeholder="Pincode" name ={'addressPinCode'}
                         className="form-control float-label" id="" />
                </div>
                <div className="ml_icon_btn">
                  <a href="#" className="save_btn" onClick={this.onSavingAddress.bind(this)}><span
                    className="ml ml-save"></span></a>
                </div>
              </div>




            {that.state.addressDetails && (that.state.addressDetails.map(function(options,key) {

              return(
                <div className="tab-pane" id={'adressType' + key} key={key}>
                  <div className="form-group">
                    <Moolyaselect multiSelect={false} ref={'address' + key}
                                  placeholder="Select NumberType"
                                  className="form-control float-label" selectedValue={options.addressType}
                                  valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={addressTypeQuery}
                                  queryOptions={addressTypeOption} onSelect={that.updateOptions.bind(that,key)}
                                  isDynamic={true}/>
                  </div>
                  <div className="form-group">
                    <input type="text" name ={'name'} ref={'name' + key} placeholder="Name"
                           className="form-control float-label" id="" defaultValue={options.name}/>
                  </div>

                  <div className="form-group">
                    <input type="text" name ={'phoneNumber'} ref={'phoneNumber' + key} placeholder="Phone Number"
                           className="form-control float-label" id="" defaultValue={options.phoneNumber} />
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressFlat' + key} name ={'addressFlat'} className="form-control float-label"
                           placeholder="Flat/House/Floor/Bulding No" defaultValue={options.addressFlat} id=""/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressLocality' + key} name ={'addressLocality'}
                           placeholder="Colony/Street/Loculaty" className="form-control float-label" id=""
                           defaultValue={options.addressLocality}/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressLandmark' + key} placeholder="Landmark" name ={'addressLandmark'}
                           className="form-control float-label" id="" defaultValue={options.addressLandmark}/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressArea' + key} placeholder="Area" name ={'addressArea'}
                           className="form-control float-label" id="" defaultValue={options.addressArea}/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressCity' + key} placeholder="Town/City" name ={'addressCity'}
                           className="form-control float-label" id="" defaultValue={options.addressCity}/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressState' + key} placeholder="State" name ={'addressState'}
                           className="form-control float-label" id="" defaultValue={options.addressState} />
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressCountry' + key} placeholder="Country" name ={'addressCountry'}
                           className="form-control float-label" id="" defaultValue={options.addressCountry}/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressPinCode' + key} placeholder="Pincode" name ={'addressPinCode'}
                           className="form-control float-label" id="" defaultValue={options.addressPinCode}/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'latitude' + key} placeholder="Latitude" name ={'latitude'}
                           className="form-control float-label" id="" defaultValue={options.latitude}/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'longitude' + key} placeholder="Longitude" name ={'longitude'}
                           className="form-control float-label" id="" defaultValue={options.longitude}/>
                  </div>

                  <div className="ml_icon_btn">
                    <a href="#" className="save_btn">Save</a>
                    <a href="#" onClick={that.onEditAddress.bind(that,key)}
                       className="save_btn"><span
                      className="ml ml-save"></span></a>
                    <a href="#" className="cancel_btn" onClick={that.onDeleteAddress.bind(that,key)}><span className="ml ml-delete"></span></a>
                  </div>
                </div>)
            }))}
          </div>

        </div>
      </div>
    )}
}
