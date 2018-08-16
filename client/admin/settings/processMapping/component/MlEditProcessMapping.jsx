
import React, { Component } from 'react';
// import ScrollArea from 'react-scrollbar';
import { Scrollbars } from 'react-custom-scrollbars';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import formHandler from '../../../../commons/containers/MlFormHandler'
import {updateProcessActionHandler} from '../actions/updateProcessMappingAction'
import {findProcessActionHandler} from '../actions/findProcessAction'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import MlAssignDocument from './MlAssignDocument'
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
let Select = require('react-select');

class MlEditProcessMapping extends React.Component{
  constructor(props){
    super(props);
    this.state={
      data:{},
      id          : '',
      loading:true,
      processId   : '',
      assignDocument:[],
      process     : '',
      communities : [],
      identity    : '',
      industries  : [],
      professions : [],
      clusters    : [],
      states      : [],
      chapters    : [],
      subChapters : [],
      isActive    : ''
    }
    this.addEventHandler.bind(this);
    this.getAssignedDocuments.bind(this)
    return this;
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
  }

  componentDidUpdate(){
    OnToggleSwitch(true, true);
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    $('.main_wrap_scroll ').height(WinHeight-(168+$('.admin_header').outerHeight(true)));


  }
  componentWillMount() {
    const resp=this.findProcess();
    return resp;

  }
  async addEventHandler() {
    const resp=await this.createBackendUser();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/documentProcess/processList");
      else
        toastr.error(response.result);
    }
  };


  async findProcess(){
    let pid=this.props.config
    const response = await findProcessActionHandler(pid);
    this.setState({loading: false, data: response});
    if(response) {

      this.setState({processId: this.state.data.processId});
      this.setState({id: this.state.data._id});
      this.setState({isActive: this.state.data.isActive});
      if (this.state.data.process) {
        this.setState({process: this.state.data.process});
      }
      if (this.state.data.communities) {
        let communityId = this.state.data.communities
        this.setState({communities:communityId});
      }
      if (this.state.data.userTypes) {
        let userTypesId = this.state.data.userTypes;
        this.setState({userTypes:userTypesId });
      }
      if (this.state.data.identity) {
        let identity = this.state.data.identity;
        this.setState({identity: identity});
      }
      if (this.state.data.industries) {
        let industriesId = this.state.data.industries;
        this.setState({industries: industriesId});
      }
      if (this.state.data.professions) {
        let professionsId = this.state.data.professions;
        this.setState({professions: professionsId});
      }
      if (this.state.data.clusters) {
        let clustersId = this.state.data.clusters;
        this.setState({clusters: clustersId});
      }
      if (this.state.data.states) {
        let statesId = this.state.data.states;
        this.setState({states: statesId});
      }
      if (this.state.data.chapters) {
        let chaptersId = this.state.data.chapters;
        this.setState({chapters: chaptersId});
      }
      if (this.state.data.subChapters) {
        let subChaptersId = this.state.data.subChapters;
        this.setState({subChapters: subChaptersId});
      }
    }

  }
  async  updateProcess() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let type=this.state.assignDocument[0].type;
      let category=this.state.assignDocument[0].category;
      if(!type) {
        toastr.error("'Document type' is mandatory");
      }else if(!category){
        toastr.error("'KYC category' is mandatory");
      }else {
        let processDetails = {
          processId: this.state.processId,
          process: this.state.process,
          communities: this.state.communities,
          userTypes: this.state.userTypes,
          identity: this.state.identity,
          industries: this.state.industries,
          professions: this.state.professions,
          clusters: this.state.clusters,
          states: this.state.states,
          chapters: this.state.chapters,
          subChapters: this.state.subChapters,
          isActive: this.state.isActive,
          documents: this.state.assignDocument
        }
        let id = this.state.id;
        let process = processDetails;
        const response = await updateProcessActionHandler(id, process)
        return response;
      }
    }
  }
  getAssignedDocuments(departments){
    this.setState({'assignDocument':departments})
  }

  optionsBySelectProcess(val){
    this.setState({process:val})
  }

  optionsBySelectCommunities(val){
   /* let community=this.state.communities
    community[0]['id']=val;*/
    this.setState({communities:val})
  }

  optionsBySelectUserType(val){
    let userTypes=this.state.userTypes
    //userTypes[0]['id']=val;
    this.setState({userTypes:val})
  }

  optionsBySelectIdentity(val){
    this.setState({identity:val})
  }

  optionsBySelectIndustries(val){
   /* let industries=this.state.industries
    industries[0]['id']=val;*/
    this.setState({industries:val})
  }

  optionsBySelectProfessions(val){
    /*let professions=this.state.professions
    professions[0]['id']=val;*/
    this.setState({professions:val})
  }

  optionsBySelectClusters(val){
    /*let clusters=this.state.clusters
    clusters[0]['id']=val;*/
    this.setState({clusters:val})
  }

  optionsBySelectStates(val){
  /*  let states=this.state.states
    states[0]['id']=val;*/
    this.setState({states:val})
  }

  optionsBySelectChapters(val){
   /* let chapters=this.state.chapters
    chapters[0]['id']=val;*/
    this.setState({chapters:val})
  }

  optionsBySelectSubChapters(val){
    /*let subChapters=this.state.subChapters
    subChapters[0]['id']=val;*/
    this.setState({subChapters:val})
  }
  onStatusChange(event){
    if(event.target.checked){
      this.setState({"isActive":true})
    }else{
      this.setState({"isActive":false})
    }
  }

  render(){
    let MlActionConfig = [
      // {
      //   actionName: 'add',
      //   showAction: true,
      //   handler: null
      // },
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.updateProcess.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/documentProcess/processList")
        }
      }
    ]
    let IdentityOptions = [
      {value: 'Company', label: 'Company'},
      {value: 'Individual', label: 'Individual'}
    ];
   /* let query=gql` query{
    data:fetchCountriesSearch{label:country,value:countryCode}
    }
    `;*/
    let processQuery=gql`query{
 data: FetchProcessType {
    label:processName
		value:_id
  }
}
`;
    let fetchcommunities = gql` query{
  data:fetchCommunityDefinitionForProcessMapping{label:name,value:code}
}
`;
  /*  let fetchUsers = gql`query{
  data:FetchUserType {
    label:userTypeName
    value:_id
  }
}
`;*/
    let fetchUsers = gql` query($communityId:[String]) {  
    data:FetchUserTypeForMultiSelect(communityId:$communityId) {
      value:_id
      label:displayName
  }  }
    `;
    let industriesquery=gql` query {
    data:fetchIndustries{label:industryDisplayName,value:_id}
    }
    `;
    let professionquery=gql` query($industry:[String]!) {
    data:FetchProfessionIndustry(industry:$industry){label:professionDisplayName,value:_id}
    }
`; let clusterquery=gql`  query{
  data:fetchActiveClusters{label:countryName,value:_id}
}`;
    let statesQuery=gql`query($clusters:[String]){ 
        data:FetchActiveStatesForCluster(clusters:$clusters) {
          value:_id
          label:name
        }  
    }`;
    let chapterquery=gql`query($states:[String],$clusters:[String]){  
        data:fetchActiveStatesChapters(states:$states,clusters:$clusters) {
          value:_id
          label:chapterName
        }  
    }`;
    let subChapterquery=gql`query($chapters:[String],$clusters:[String],$displayAllOption:Boolean){  
        data:fetchActiveChaptersSubChapters(chapters:$chapters,clusters:$clusters,displayAllOption:$displayAllOption) {
          value:_id
          label:subChapterName
        }  
    }`;
    let fetchIdentity=gql`
          query($communities:[String]){
        data:FetchCommunityIdentity(communities:$communities) {
          label:identityTypeName
          value:identityTypeName
        }
      }
    `;

    let stateOption={options: { variables: {clusters:this.state.clusters}}};
    let chapterOption={options: { variables: {states:this.state.states,clusters:this.state.clusters}}};
    let subChapterOption={options: { variables: {chapters:this.state.chapters,clusters:this.state.clusters,displayAllOption:true}}};
    let professionOption={options: { variables: {industry:this.state.industries}}};
    const userTypeOption = { options: { variables: { communityId: this.state.communities } } };
    let identityOption={options: { variables: {communities:this.state.communities}}}
    const showLoader=this.state.loading;
   return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Edit Process</h2>
          <div className="main_wrap_scroll">

          <div className="col-md-6 nopadding-left">
            <div className="left_wrap">
              <Scrollbars
                speed={0.8}
                className="left_wrap"
                smoothScrolling={true}
                default={true}
              >

                <div className="form_bg">
                  <form>

                    <div className="form-group">
                      <input type="text"   readOnly="true" value={this.state.data&&this.state.data.processId} placeholder="process Id" className="form-control float-label" id="" disabled="disabled"/>
                    </div>


                    <div className="form-group">
                      <Moolyaselect ref="process" multiSelect={false} mandatory={true} placeholder={"process"} disabled={true} className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.process} queryType={"graphql"} query={processQuery}  isDynamic={true} id={'query'} onSelect={this.optionsBySelectProcess.bind(this)}data-required={true} data-errMsg="Process is required" />
                    </div>

                    <div className="form-group">
                      <Moolyaselect ref="communities" multiSelect={true} mandatory={true} placeholder={"Community"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.communities} queryType={"graphql"} query={fetchcommunities}  isDynamic={true} id={'query'} onSelect={this.optionsBySelectCommunities.bind(this)} data-required={true} data-errMsg="Community Needed"/>
                    </div>

                    <div className="form-group">
                      <Moolyaselect ref="userType" multiSelect={true} mandatory={true}  placeholder={"UserType"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.userTypes} queryType={"graphql"} query={fetchUsers} queryOptions={userTypeOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectUserType.bind(this)} data-required={true} data-errMsg="UserType is required"/>
                    </div>

                    <div className="form-group">
                      {/*<Select name="form-field-name"  placeholder={"Identity"}  className="float-label"  options={IdentityOptions}  value={this.state.identity}  onChange={this.optionsBySelectIdentity.bind(this)}/>*/}
                      <Moolyaselect ref="identity" multiSelect={false}  mandatory={true} placeholder={"Identity"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.identity} queryType={"graphql"} query={fetchIdentity} queryOptions={identityOption} isDynamic={true} id={'fetchuserTypes'} onSelect={this.optionsBySelectIdentity.bind(this)} data-required={true} data-errMsg="Identity is required" />
                    </div>

                    <div className="form-group">
                      <Moolyaselect ref="industries" multiSelect={true} mandatory={true} placeholder={"Industries"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.industries} queryType={"graphql"} query={industriesquery}  isDynamic={true} id={'query'} onSelect={this.optionsBySelectIndustries.bind(this)} data-required={true} data-errMsg="Industry is required" />
                    </div>

                    <div className="form-group">
                      <Moolyaselect ref="profession"multiSelect={true} mandatory={true} placeholder={"Profession"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.professions} queryType={"graphql"} query={professionquery}   queryOptions={professionOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectProfessions.bind(this)}data-required={true} data-errMsg="Profession is required" />
                    </div>

                    <div className="form-group switch_wrap inline_switch">
                      <label className="">Over All Status</label>
                      <label className="switch">
                        <input type="checkbox" checked={this.state.isActive} onChange={this.onStatusChange.bind(this)} ref="status"/>
                        <div className="slider"></div>
                      </label>
                    </div>
                    <br className="brclear"/>


                  </form>
                </div>
              </Scrollbars>
            </div>
          </div>
          <div className="col-md-6 nopadding-right"  >
            <div className="form_bg" >
              <div className="left_wrap">
                <Scrollbars
                  speed={0.8}
                  className="left_wrap"
                  smoothScrolling={true}
                  default={true}
                >
                <form>
                  <Moolyaselect ref="cluster" multiSelect={true} mandatory={true} placeholder={"Cluster"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.clusters} queryType={"graphql"} query={clusterquery}  isDynamic={true} id={'clusterquery'} onSelect={this.optionsBySelectClusters.bind(this)} data-required={true} data-errMsg="Cluster is required" />



                  <Moolyaselect  ref="state" multiSelect={true}  mandatory={true} placeholder={"State"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.states} queryType={"graphql"} query={statesQuery}  queryOptions={stateOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectStates.bind(this)} data-required={true} data-errMsg="State is required"/>



                  <Moolyaselect  ref="chapter" multiSelect={true} mandatory={true}  placeholder={"Chapter"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.chapters} queryType={"graphql"} query={chapterquery} queryOptions={chapterOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectChapters.bind(this)} data-required={true} data-errMsg="Chapter is required"/>

                  <Moolyaselect  ref="subChapter" multiSelect={true} mandatory={true} placeholder={"SubChapter"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.subChapters} queryType={"graphql"} query={subChapterquery} queryOptions={subChapterOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectSubChapters.bind(this)} data-required={true} data-errMsg="SubChapter is required"/>
                  {this.state.data&&this.state.data.documents?(<MlAssignDocument getAssignedDocuments={this.getAssignedDocuments.bind(this)} documents={this.state.data&&this.state.data.documents} clusterId={this.state.clusters} chapterId={this.state.chapters} subChapterId={this.state.subChapters}/>):''}
                  </form>
                </Scrollbars>
              </div>
            </div>
          </div>
          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>

        </div>


      </div>
    )
  }
};
export default MlEditProcessMapping = formHandler()(MlEditProcessMapping);

