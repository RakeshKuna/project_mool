import React, {Component, PropTypes} from "react";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import {render} from "react-dom";
import {fetchCommunitiesHandlerReg} from "../actions/fetchCommunitiesActionHandler";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import Moolyaselect from "../../commons/components/MlAppSelectWrapper";
import {fetchUserDetailsHandler} from "../actions/fetchUserDetails";
import {registerAsInfo} from "../../../admin/transaction/requested/actions/registrationAs";
let Select = require('react-select');
export default class MlAppCommunitiesList extends Component {
    constructor(props){
        super(props);
        this.state={communities:[], popoverOpen:false, selectedCommunity:"",
          country:'',
          selectedCity:'',
          userType:null,
          clusterId:null,
          registrationType:'',
        }
        this.fetchCommunities.bind(this)
        this.setSelectedCommunity.bind(this)
        this.toggle.bind(this);
        return this;
    }

    componentWillMount(){
      const resp = this.fetchUserDetails();
      return resp
    }

  async fetchUserDetails() {
    let response = await fetchUserDetailsHandler()
    if (response) {
      this.isAllowRegisterAs = response.isAllowRegisterAs
      if(response.isAllowRegisterAs){
        let registrationInfo = response.registrationInfo
        // toastr.success("set another registerAs");

        this.setState({
          status: response.status,
          registerId: response._id,
          firstName: registrationInfo.firstName,
          lastName: registrationInfo.lastName,
          contactNumber: registrationInfo.contactNumber,
          email: registrationInfo.email,
          userName: registrationInfo.userName,
          country: registrationInfo.countryId,
          communityId: registrationInfo.registrationType,
          subChapterId: registrationInfo.subChapterId
        });
        this.fetchCommunities();
      }
      else{
        FlowRouter.go("/app/register/"+response.pendingRegId);
        toastr.error("Complete one or more profile hard registration");
      }
    }
  }

    setSelectedCommunity(selCommunity,idx, e){
      /**reducing one setState*/
      // this.setState({selectedCommunity:selCommunity, popoverOpen : !(this.state.popoverOpen)})
      this.setState({selectedCommunity:selCommunity, popoverOpen : !(this.state.popoverOpen), identity:null,registrationType:null,clusterId:null})
    }

    toggle() {
        this.setState({popoverOpen: !this.state.popoverOpen});
    }
  cancel(){
      this.toggle()
    FlowRouter.go("/app/myProfile/registerAs");
  }
  async registerAs(){
    let registrationInfo={
      userName:this.state.userName,
      firstName:this.state.firstName,
      lastName:this.state.lastName,
      contactNumber:this.state.contactNumber,
      email:this.state.email,
      registrationType:this.state.selectedCommunity,
      identityType:this.state.identity,
      clusterId:this.state.clusterId,
      cityId:this.state.selectedCity,
      countryId:this.state.country

    }
    let registrationId=this.state.registerId
    const response = await registerAsInfo(registrationInfo,registrationId);
    if(response.success){
      let registrtionId=response.result
     let registrtion= JSON.parse(registrtionId)
      toastr.success("User registration successful");
      FlowRouter.go("/app/register/"+registrtion.registrationId);
    }else{
      this.toggle()
      toastr.error(response.result);
      FlowRouter.go("/app/myProfile/registerAs");
    }
  }

  /**
   * @Note checking user registration status on "clientSite" for showing community for registerAs
   * */
    async fetchCommunities() {
      var communities = await fetchCommunitiesHandlerReg();
        let userCommunity=this.state.communityId
      let status=this.state.status
      if(communities && communities.length){
        if(status=="REG_USER_APR"){
          if(userCommunity=="CMP"){
            let communitilist= _.filter(communities, function(community) {
              return community.code==="CMP"
            });
            this.setState({communities:communitilist})
          }else if(userCommunity=="INS"){
            let communitilist= _.filter(communities, function(community) {
              return community.code==="INS"
            });
            this.setState({communities:communitilist})
          }else if(userCommunity=="BRW"){
            let communitilist = _.filter(communities, function (community) {
              return community.code != "BRW" && community.code != "OFB"
            });
            this.setState({communities:communitilist})
          }else{
            let communitilist= _.filter(communities, function(community) {
              return community.code==="FUN" ||community.code==="IDE"||community.code==="STU"||community.code==="SPS"
            });
            this.setState({communities:communitilist})
          }
        }else{
          let communitilist = _.filter(communities, function (community) {
            return community.code != "BRW" && community.code != "OFB"
          });
          this.setState({communities:communitilist})
        }
        return communities;
      }
    }

  optionsBySelectCountry(value){
    this.setState({country:value})
  }

  optionBySelectRegistrationType(value, calback, selObject){
    this.setState({registrationType:value, coummunityName:selObject.label})
  }
  optionsBySelectIdentity(val){
    this.setState({identity:val})
  }
  optionsBySelectOperationCountry(val){
    this.setState({clusterId:val})
  }


    render(){

      let countryQuery = gql`query{
        data:fetchCountries {
          value:_id
          label:country
        }
      }`

      let fetchcommunities = gql` query{
        data:fetchCommunityDefinition{label:name,value:code}
      } 
      `;
      let fetchIdentity=gql`query($communityId:String){
        data:FetchCommunityBasedIdentity(communityId:$communityId) {
          value: identityTypeName
          label: identityTypeName
        }
      }`;

      let clusterQuery = gql`query($subChapterId: String){data:fetchClustersForMap(subChapterId:$subChapterId){label:displayName,value:_id}}`;

      let identityOptions={options: {variables: {communityId:this.state.selectedCommunity}}};
      var clusterOptions = {options: {variables: {subChapterId: this.state.subChapterId}}};

        const data = this.state.communities || [];
        const list=  data.map((prop, idx) =>
            <div className="col-lg-2 col-md-4 col-sm-4" key={prop.code}>
                <div className="list_block">
                    {/*<div className={`cluster_status ${prop.isActive?"active":"inactive"}_cl `}></div>*/}
                        <a href="" onClick={this.setSelectedCommunity.bind(this, prop.code,idx)} id={"selCommunity"+prop.code}>
                            <div className={"hex_outer"}>
                                <span className={prop.communityImageLink}></span>
                            </div>
                        </a>
                        <h3>{prop.name}</h3>
                </div>
            </div>
        );
        return(
            <div className="app_main_wrap">
                <div className="app_padding_wrap">
                    <h2>Select your Community to Register</h2>
                    {list}
                </div>
                <Popover placement="right" isOpen={this.state.popoverOpen} target={"selCommunity"+this.state.selectedCommunity} toggle={this.toggle.bind(this)}>
                  <PopoverTitle>Register As </PopoverTitle>
                    <PopoverContent>
                      <div className="form-group">
                        <Moolyaselect multiSelect={false} placeholder="Registration Type" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedCommunity} queryType={"graphql"} query={fetchcommunities}  isDynamic={true} onSelect={this.optionBySelectRegistrationType.bind(this)} disabled={true}/>
                      </div>
                      <div className="form-group">
                        <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'} labelKey={'label'} placeholder="Identity"  selectedValue={this.state.identity} queryType={"graphql"} query={fetchIdentity} queryOptions={identityOptions} isDynamic={true}  onSelect={this.optionsBySelectIdentity.bind(this)}   />
                      </div>
                      <div className="col-md-6 nopadding-left">
                        <div className="form-group ">
                          <input type="text" ref="firstName" value={this.state.firstName} placeholder="First Name" className="form-control float-label" disabled="true" />
                        </div>
                        <div className="form-group ">
                          <input type="text" ref="contactNumber" value={this.state.lastName} placeholder="Contact number" className="form-control float-label" id="" disabled="true"/>
                        </div>
                      <div className="form-group">
                        <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'} labelKey={'label'} placeholder="Country of Residence"  selectedValue={this.state.country} queryType={"graphql"} query={countryQuery} isDynamic={true}  onSelect={this.optionsBySelectCountry.bind(this)}  disabled={true} />
                      </div>

                      </div>
                      <div className="col-md-6 nopadding-right">
                        <div className="form-group ">
                          <input type="text" ref="lastName" value={this.state.contactNumber} placeholder="Last Name"className="form-control float-label" id="" disabled="true"/>
                        </div>
                        <div className="form-group ">
                          <input type="text" ref="email"   value={this.state.email} placeholder="Email Id" className="form-control float-label" id="" disabled="true" />
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                        labelKey={'label'} placeholder="Country of Operations" mandatory={true}
                                        selectedValue={this.state.clusterId} queryType={"graphql"} query={clusterQuery}
                                        isDynamic={true} queryOptions={clusterOptions}
                                        onSelect={this.optionsBySelectOperationCountry.bind(this)}/>
                        </div>
                      </div>
                      <div className="assign-popup">
                        <a data-toggle="tooltip" title="Save" data-placement="top"  className="hex_btn hex_btn_in" onClick={this.registerAs.bind(this)}>
                          <span className="ml ml-save"></span>
                        </a>
                        <a data-toggle="tooltip" title="Cancel" data-placement="top"  className="hex_btn hex_btn_in" onClick={this.cancel.bind(this)} >
                          <span className="ml ml-delete"></span>
                        </a>
                      </div>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
}
