/**
 * Created by vishwadeep on 12/9/17.
 */

import React from 'react';
import ScrollArea from 'react-scrollbar';
import gql from 'graphql-tag';
// import { findSubChapterActionHandler } from '../../actions/findSubChapter';
import Moolyaselect from '../../../commons/components/MlAdminSelectWrapper';
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath';
import { valueFromAST } from 'graphql/utilities/valueFromAST';

//todo:// replace set-time out for sending data to parent need to change
export default class MlAnchorContact extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   lat:'',
    //   lng:''
    // }
    this.sendDataToParent = this.sendDataToParent.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.selectUser = this.selectContact.bind(this);
    this.resetFormData = this.resetFormData.bind(this);
    this.onOptionSelectedCountry = this.onOptionSelectedCountry.bind(this);
    this.onOptionSelectedStates = this.onOptionSelectedStates.bind(this);
    this.onOptionSelectedCities = this.onOptionSelectedCities.bind(this);
  }

  componentDidMount() {
    $(function () {
      $('.float-label').jvFloat();
    });
    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight - (150 + $('.admin_header').outerHeight(true)));
  }
  componentWillMount()
  {
    this.props.setModule('subchapter');
    // let that = this;
    // if (navigator.geolocation) {
    // navigator.geolocation.getCurrentPosition((position)=>{
    // let lat = position.coords.latitude;
    // let lng = position.coords.longitude;
    // that.setState({lat,lng});
    // });
    // }

  }
  sendDataToParent(data) {
    this.props.getContactDetails(data);
  }

  // selectContact(index) {
  //   // this.setState({ formData: this.state.contactDetails[index], selectedContact: index });
  //   this.sendDataToParent({ formData: this.props.contactDetails[index] });
  // }

  onOptionSelectedCountry(val) {
    this.onChange("countryId", val);
    setTimeout(() => {
      this.onChange("stateId", "")
    }, 10);
    setTimeout(() => {
      this.onChange("cityId", "");
    }, 20);
  }

  onOptionSelectedStates(val) {
    this.onChange("stateId", val);
    setTimeout(() => {
      this.onChange("cityId", "");
    }, 10);
  }

  onOptionSelectedCities(val) {
    this.onChange("cityId", val);
  }

  resetFormData() {
    const data = {
      // selectedIndex: -1,
      formData: {
        // name :'',
        addressTypeName:'Subchapter',
        contactNumber: '',
        buildingNumber: '',
        street: '',
        landmark: '',
        area: '',
        cityId: '',
        stateId: '',
        countryId: '',
        pincode: '',
        latitude: '',
        longitude: '',
        // emailId: '',
        // contactPersonRole: '',
        // addressTypeId: '',
        // status: false,
      },
    };
    this.sendDataToParent(data);
  }

  // onOptionSelectedAddressType(val, callback, label) {
  //   this.props.onContactChange('addressTypeId', val)
  //   setTimeout(() => {
  //     this.props.onContactChange('addressTypeName', label.label);
  //   }, 10);
  // }

  onChange(field, value) {
    this.props.onContactChange(field, value);
  }

  render() {
    // let addressTypeQuery=gql`query($type:String,$hierarchyRefId:String){
    //  data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
    //  label
    //  value
    //  }
    //  }
    //  `;
    let countryQuery = gql`query{
      data:fetchCountries {
         value:_id
         label:country
       }
     }`
    let statesQuery = gql`query ($countryId: String) {
       data: fetchStatesPerCountry(countryId: $countryId) {
       value: _id
       label: name
     }
   }`;
    let citiesQuery = gql`query ($stateId: String) {
       data: fetchCitiesPerState(stateId: $stateId) {
       value: _id
       label: name
     }
   }`;
   let type = [
     {value:'Subchapter', label:'Subchapter'}
   ]
    let statesOption = { options: { variables: { countryId: this.props.formData.countryId } } };
    let citiesOption = { options: { variables: { stateId: this.props.formData.stateId } } };
    // let addressTypeOption={options: { variables: {type : "ADDRESSTYPE",hierarchyRefId:this.props.clusterId}}};
    return (
      <div className="main_wrap_scroll">
        <ScrollArea speed={0.8} className="main_wrap_scroll" smoothScrolling={true} default={true}>
          {/* <div className="col-lx-6 col-sm-6 col-md-6 nopadding-left">
            <div className="row"> */}
              { /* <h3>Users List</h3> */}
              {/* <div className="left_user_blocks"> */}

                {/*<div className="col-md-4 col-sm-6" onClick={this.resetFormData}>*/}
                  {/*<div className="list_block provider_block">*/}
                    {/*<div className="provider_mask"><img src="/images/funder_bg.png" />*/}
                      {/*<span className="ml ml-plus "></span>*/}
                    {/*</div>*/}
                    {/*<h3>Add New</h3>*/}
                  {/*</div>*/}
                {/*</div>*/}
                {
                  // this.props.contactDetails && this.props.contactDetails.map((user, index) => (
                  //   <div key={index} onClick={this.selectContact.bind(this, index)} className="col-md-4 col-sm-6">
                  //     <div className="list_block provider_block">
                  //       <div className="cluster_status active_cl"></div>
                  //       <div className="provider_mask"><img src="/images/funder_bg.png" />
                  //         <img className="user_pic" src={user.picURL ? generateAbsolutePath(user.picURL) : "/images/def_profile.png"}/>
                  //       </div>
                  //       <h3>{user.addressTypeName || 'No address name'}</h3>
                  //     </div>
                  //   </div>
                  // ))
                }
              {/* </div> */}
            {/* </div>
          </div> */}
          <div className="col-lx-6 col-sm-6 col-md-6 nopadding-left">
          <form>
          <div className="form-group">
                <input type="text" placeholder="Address Type"
                    value="Subchapter" option={type}
                    className="form-control float-label" disabled={true}
                    //onChange={event => this.onChange('addressTypeName', event.target.value)} 
                    />
                </div>
                {/* <div className="form-group mandatory">
                <input type="text" placeholder="Name"
                    value={this.props.formData.name}
                    className="form-control float-label"
                    onChange={event => this.onChange('name', event.target.value)} />
                </div> */}
                <div className="form-group mandatory">
                  <input type="text" placeholder="Flat/House/floor/Building No"
                    className="form-control float-label"
                    value={this.props.formData.buildingNumber}
                    onChange={event => this.onChange('buildingNumber', event.target.value)} />
                </div>
                <div className="form-group mandatory">
                  <input type="text" placeholder="Colony/Street/Locality "
                    className="form-control float-label"
                    value={this.props.formData.street}
                    onChange={event => this.onChange('street', event.target.value)} />
                </div>
                <div className="form-group mandatory">
                  <input type="text" placeholder="Landmark" className="form-control float-label"
                    value={this.props.formData.landmark}
                    onChange={event => this.onChange('landmark', event.target.value)} />
                </div>
                <div className="form-group mandatory">
                  <input type="text" placeholder="Area" className="form-control float-label"
                    value={this.props.formData.area}
                    onChange={event => this.onChange('area', event.target.value)} />
                </div>
                <div className="form-group">
                  <Moolyaselect multiSelect={false} ref="country" className="form-control float-label"
                    valueKey={'value'} labelKey={'label'} placeholder="Your Country"
                    mandatory={true}selectedValue={this.props.formData.countryId} queryType={"graphql"} query={countryQuery}
                    isDynamic={true} onSelect={this.onOptionSelectedCountry.bind(this)} />
                </div>
            </form>
          </div>
          <div className="col-lx-6 col-sm-6 col-md-6 nopadding-right">
            <div>
              <form>                
                <div className="form-group">
                  <Moolyaselect multiSelect={false} ref="state" className="form-control float-label"
                    valueKey={'value'} labelKey={'label'} placeholder="State" queryOptions={statesOption}
                     mandatory={true}selectedValue={this.props.formData.stateId} queryType={"graphql"} query={statesQuery}
                    isDynamic={true} onSelect={this.onOptionSelectedStates.bind(this)} />
                </div>
                <div className="form-group">
                  <Moolyaselect multiSelect={false} ref="cityId" className="form-control float-label"
                    valueKey={'value'} labelKey={'label'} placeholder="Town/City" queryOptions={citiesOption}
                    mandatory={true}selectedValue={this.props.formData.cityId} queryType={"graphql"} query={citiesQuery}
                    isDynamic={true} onSelect={this.onOptionSelectedCities.bind(this)} />
                </div>
                <div className="form-group mandatory">
                  <input type="text" placeholder="Contact Number"
                    value={this.props.formData.contactNumber}
                    className="form-control float-label"
                    onChange={event => this.onChange('contactNumber', event.target.value)} />
                </div>
                <div className="form-group mandatory">
                  <input type="number" placeholder="Pincode" className="form-control float-label"
                    value={this.props.formData.pincode}
                    onChange={event => this.onChange('pincode', event.target.value)} />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Lattitude" className="form-control float-label"
                    value={this.props.formData.latitude}
                    onChange={event => this.onChange('latitude', event.target.value)} disabled={true} />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Longitude" className="form-control float-label"
                    value={this.props.formData.longitude}
                    onChange={event => this.onChange('longitude', event.target.value)} disabled={true} />
                </div>
                {/* <div className="form-group">
                  <input type="text" placeholder="Email Id" className="form-control float-label"
                    value={this.props.formData.emailId}
                    onChange={event => this.onChange('emailId', event.target.value)} />
                </div> */}
                {/* <div className="form-group"> */}
                {/* <input type="text" placeholder="Role Type"
                    value={this.props.formData.contactPersonRole}
                    className="form-control float-label"
                    onChange={event => this.onChange('contactPersonRole', event.target.value)} /> */}
                {/* </div> */}
                 {/* <Moolyaselect multiSelect={false} ref="addressTypeId" className="form-control float-label"
                    valueKey={'value'} labelKey={'label'} placeholder="Address Type" queryOptions={addressTypeOption}
                    selectedValue={this.props.formData.addressTypeId} queryType="graphql" query={addressTypeQuery}
                    isDynamic={true} onSelect={this.onOptionSelectedAddressType.bind(this)}/> */}
                {/* <br className="brclear" /> */}
                {/* <div className="form-group switch_wrap inline_switch">
                  <label className="">Status</label>
                  <label className={`switch ${this.props.formData.status ? 'on' : ''}`}>
                    <input type="checkbox"
                      checked={this.props.formData.status}
                      onChange={event => this.onChange('status', event.target.checked)} />
                    <div className="slider"></div>
                  </label>
                </div> */}
              </form>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }
}


MlAnchorContact.propTypes = {
  contactDetails: React.PropTypes.array,
  selectedIndex: React.PropTypes.number,
  formData: React.PropTypes.any,
  onContactChange: React.PropTypes.func,
  getContactDetails: React.PropTypes.func,
};
