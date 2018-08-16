import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import ScrollArea from 'react-scrollbar'
import gql from 'graphql-tag'
import Moolyaselect from  '../../commons/components/MlAdminSelectWrapper'
let Select = require('react-select');
import MlActionComponent from "../../../commons/components/actions/ActionComponent";
import {updateSettings} from '../actions/addSettingsAction';
import {findMyProfileActionHandler} from '../actions/getProfileDetails'



//import ContactDetails from '../../transaction/requested/component/contactDetails';

export default class MyProfileSettings extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currencySymbol: " ",
      measurementSystem: " ",
      currencyTypes: " ",
      numericalFormat:" ",
      clusterId: " ",
      languages: "",
      timeZone:""
    }
    this.optionsBySelectCurrencySymbol.bind(this);
    this.optionsBySelectMeasurementSystem.bind(this);
    this.dataSaving.bind(this);
    this.onSave.bind(this);
    this.getValue.bind(this);
  }

  componentWillMount(){
    // console.log(this.props.clusterId)
    const resp=this.getValue();
    return resp;
  }

  componentDidMount()
  {
    $(function() {
      $('.float-label').jvFloat();
    });
    $('.switch input').change(function() {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      }else{
        $(this).parent('.switch').removeClass('on');
      }
    });


    $('.myprofile_left a').click(function(){
      $('.myprofile_left a').removeClass("active");
      $(this).addClass("active");
    });


    var swiper = new Swiper('.profile_container', {
      pagination: '.swiper-pagination',
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      initialSlide:1,
      slidesPerView: 'auto',
      coverflow: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows : true
      }
    });


  }


  optionsBySelectCurrencySymbol(val){
    this.setState({currencySymbol:val})
  }

  optionsBySelectMeasurementSystem(data){
    this.setState({measurementSystem:data.value})
  }
  optionsBySelectTimeZone(val){
    this.setState({timeZone:val})
  }

  optionsBySelectLanguage(val) {
    this.setState({languages: val})
  }

 async onSave(){

    this.dataSaving();
  }

  async getValue() {
   let that = this
    let userType = Meteor.userId();
    let response = await findMyProfileActionHandler(userType);
    console.log(response);
    that.setState({measurementSystem : response.profile.numericalFormat,
      currencySymbol:response.profile.currencyTypes, clusterId: response.profile.InternalUprofile.moolyaProfile.userProfiles,
      languages: response.profile.languages, timeZone: response.profile.timeZone
    });

    let temp = that.state.clusterId || [];
    temp.map(function(data) {
      if(data.isDefault){
        let cluster = data.clusterId;
        that.setState({clusterId: cluster})
      }
    })
  }

  async dataSaving(){

    let Details = {
      currencySymbol : this.state.currencySymbol,
      measurementSystem :this.state.measurementSystem,
      languages: this.state.languages,
      timeZone: this.state.timeZone
    }
    const dataresponse = await updateSettings(Details);
    console.log(dataresponse);
    toastr.success("Update successful")
    return dataresponse;
  }

  render(){

    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.onSave()
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => FlowRouter.go('/admin/myprofile/AddressBook')
      }
    ];
    //
    // let languagequery =gql`
    //
    // `;
    //
    // let timezonequery =gql`
    //
    // `;


    let currencyquery=gql` query{  
      data:fetchCurrency{
        value:_id
        label:currencyName
      }  
    }`;

    let timeZonequery=gql`
    query($clusterId:String){  
      data:findTimeZones(clusterId:$clusterId){
        value:_id
        label:timeZone
      }  
    }
    `;

    let languagesquery=gql`
    query{  
      data:findLanguages{
        value:lang_code
        label:language_name
      }  
    }
    `

    let measurementType = [
      {value: 'US System', label: 'US System'},
      {value: 'Metric System', label: 'Metric System'},
    ]

    let isExternaluser = Meteor.user().profile.isExternaluser;
    let timeZoneOptions = {options: { variables: {clusterId:this.props.clusterId}}};
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>My Profile Settings</h2>
          <form>
              <div className="col-md-6 nopadding-left">
                <div className="form-group">
                  <Moolyaselect multiSelect={false}  placeholder={"Type Of Currency"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.currencySymbol} queryType={"graphql"} query={currencyquery}  isDynamic={true} id={'currencyquery'}  onSelect={this.optionsBySelectCurrencySymbol.bind(this)}  />
                  {/*<FontAwesome name='inr' className="password_icon"/>*/}
                </div>
                <Select
                  name="form-field-name"  options={measurementType} placeholder={"Numerical Format"}
                  value={this.state.measurementSystem} onChange={this.optionsBySelectMeasurementSystem.bind(this)}
                  className="float-label" />
                <br className="brclear"/>
                <br className="brclear"/>
                <br className="brclear"/>
                <br className="brclear"/>

              </div>
              <div className="col-md-6">

                <div className="form-group">
                  <div className="form-group">
                    <Moolyaselect multiSelect={false}  placeholder={"Language"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.languages} queryType={"graphql"} query={languagesquery} isDynamic={true} id={'languagesquery'}  onSelect={this.optionsBySelectLanguage.bind(this)} />
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-group">
                    <Moolyaselect multiSelect={false}  placeholder={"Time zone"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.timeZone} queryType={"graphql"} query={timeZonequery} queryOptions={timeZoneOptions} isDynamic={true} id={'tzquery'}  onSelect={this.optionsBySelectTimeZone.bind(this)} />
                  </div>
                <br className="brclear"/>
                <br className="brclear"/>
                <br className="brclear"/>
                <br className="brclear"/>

              </div>
              </div>
            </form>




        </div>
        {/*<span className="actions_switch"></span>*/}
        {/*<div className="bottom_actions_block">*/}
          {/*<div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/edit_icon.png"/> </a></div>*/}
          {/*<div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/act_add_icon.png"/> </a></div>*/}
          {/*<div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/act_logout_icon.png"/> </a></div>*/}
          {/*<div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/act_progress_icon.png"/> </a></div>*/}
          {/*<div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/act_select_icon.png"/> </a></div>*/}
        {/*</div>*/}
        {isExternaluser ? <div></div> :
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
        }
      </div>
    )
  }
};
