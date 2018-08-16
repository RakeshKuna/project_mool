import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {findTemplatesActionHandler} from '../actions/findTemplatesAction'
import {findStepTemplatesAssignmentActionHandler} from '../actions/findTemplatesAssignmentAction'
import {findTemplateStepsActionHandler} from '../actions/findTemplateAssignmentStepsAction'
import {updateTemplateAssignmentActionHandler} from '../actions/updateTemplateAssignmentAction'
import MlActionComponent from '../../../commons/components/actions/ActionComponent'
import formHandler from '../../../commons/containers/MlFormHandler';
import ScrollArea from 'react-scrollbar';
import gql from 'graphql-tag'
import Moolyaselect from  '../../commons/components/MlAdminSelectWrapper'
import MlStepAvailability from './MlStepAvailabilityComponent'
import MlLoader from '../../../commons/components/loader/loader'
var FontAwesome = require('react-fontawesome');
var Select = require('react-select');


let IdentityOptions = [
  {value: 'Company', label: 'Company'},
  {value: 'Individual', label: 'Individual'},
  {value:'all',label:'All'}
];

class MlEditAssignTemplate extends React.Component{
  constructor(props){
    super(props);
    this.state={
      process     : '',
      processName : '',
      subProcess  : '',
      subProcessName : '',
      userTypes   : '',
      identity    : '',
      clusters    : '',
      clusterName : '',
      chapters    : '',
      chapterName : '',
      subChapters : '',
      subChapterName : '',
      communities : '',
      communitiesName : '',
      templateInfo: [],
      steps       : [],
      data        : '',
      stepAvailability:[],
      loading:true
    }
    this.findTemplate.bind(this);
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
  componentWillMount() {
    console.log(this.props)
    const resp=this.findTemplate();
    return resp;
  }

  getStepAvailability(details){
    console.log(details);
    this.setState({'stepAvailability':details})
  }
  async addEventHandler() {
    const resp=await this.updateAddressType();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if(response.success) {
      FlowRouter.go("/admin/templates/templateList");
    }else{
      toastr.error(response.result);
    }
  };

  async findTemplate(){
    let Id=this.props.config;
    const response = await findStepTemplatesAssignmentActionHandler(Id);
    let subProcessId = response.templatesubProcess;
    if(response){
      const steps=await this.findSteps(subProcessId);
      this.setState({steps:steps||[]});
      let stepDetails=[];
      stepDetails= steps;
      let stepName=''
      for(i=0;i<1;i++){
        stepName = stepDetails[i].stepCode;
      }
      const templates=await this.findTemplates(subProcessId,stepName);
      this.setState({templateInfo:templates||[]})
      this.setState({
        loading           : false,
        process           : response.templateprocess,
        subProcess        : response.templatesubProcess,
        processName       : response.processName,
        subProcessName    : response.subProcessName,
        templateGroupName : response.templateGroupName,
        communities       : response.templatecommunityCode,
        userTypes         : response.templateuserType,
        identity          : response.templateidentity,
        clusters          : response.templateclusterId,
        chapters          : response.templatechapterId,
        subChapters       : response.templatesubChapterId,
        stepAvailability  : response.assignedTemplates,
        clusterName       : response.templateclusterName,
        chapterName       : response.templatechapterName,
        subChapterName    : response.templatesubChapterName,
        communitiesName   : response.templatecommunityName,
        data              : response
      })
    }
  }

  async  updateTemplateAssignment() {
    let id                       = this.props.config;
    let Details = {
      templateprocess           : this.state.process,
      templatesubProcess        : this.state.subProcess,
      templateProcessName       : this.state.processName,
      templateSubProcessName    : this.state.subProcessName,
      templateGroupName         : this.refs.templateGroupName.value,
      templateclusterId         : this.state.clusters,
      templateclusterName       : this.state.clusterName,
      templatechapterId         : this.state.chapters,
      templatechapterName       : this.state.chapterName,
      templatesubChapterId      : this.state.subChapters,
      templatesubChapterName    : this.state.subChapterName,
      templatecommunityCode       : this.state.communities,
      templatecommunityName     : this.state.communitiesName,
      templateuserType          : this.state.userTypes,
      templateidentity          : this.state.identity,
      assignedTemplates         : this.state.stepAvailability
    }
    const response = await updateTemplateAssignmentActionHandler(id,Details);
    return response;
  }

  onStatusChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"data":{"isActive":true}});
    }else{
      this.setState({"data":{"isActive":false}});
    }
  }
  async findSteps(subProcessId) {
    const response = await findTemplateStepsActionHandler(subProcessId,this.props.stepCode);
    if(response){
      let steps = response.steps||[];
      return steps;
    }
    return [];
  }


  async findTemplates(subProcessId,stepName) {
    const response = await findTemplatesActionHandler(subProcessId,stepName);
    console.log(response);
    let templates=[];
    if(response){
      templates = response.templates||[];
    }
    return templates;
  }

  optionsBySelectProcess(value, calback, selObject){
    this.setState({process:value})
    this.setState({processName:selObject.label})
  }

  async optionsBySelectSubProcess(value, calback, selObject){
    this.setState({subProcess:value})
    this.setState({subProcessName:selObject.label})
    const templates=await this.findTemplates(value);
    this.setState({templateInfo:templates||[]})
    const steps=await this.findSteps();
    this.setState({steps:steps||[]});
  }

  optionsBySelectUserType(val){
    this.setState({userTypes:val})
  }

  optionsBySelectIdentity(val){
    this.setState({identity:val.value})
  }

  optionsBySelectClusters(value, calback, selObject){
    this.setState({clusters:value,chapters:null})
    this.setState({clusterName:selObject.label})
    this.setState({chapterName:null});
  }

  optionsBySelectChapters(value, calback, selObject){
    this.setState({chapters:value,subChapters:null})
    this.setState({chapterName:selObject.label})
    this.setState({subChapterName:null})
  }

  optionsBySelectSubChapters(value, calback, selObject){
    this.setState({subChapters:value})
    this.setState({subChapterName:selObject.label})
  }

  optionsBySelectCommunities(value, calback, selObject){
    this.setState({communities:value})
    this.setState({communitiesName:selObject.label})
  }
  async switchTabEvent(stepName){
    console.log("switch tab step"+stepName)
    const templates=await this.findTemplates(this.state.subProcess,stepName);
    this.setState({templateInfo:templates||[]})
  }
  showTemplateImage(row){

    console.log(row);
    window.open(row.templateImage)
  }

  render(){
    let that=this;
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateTemplateAssignment.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        actionName: 'cancel',
        showAction: true,
        handler: async(event) => {
            FlowRouter.go("/admin/templates/templateList");
        }
      }
    ]

    let processQuery=gql`query{
     data: FetchProcessType {
        label:processName
        value:_id
      }
    }
    `;
    let subProcessQuery=gql`query($id:String){  
      data:fetchSubProcess(id:$id) {
        value:_id
        label:subProcessName
      }  
    }`;
    let fetchcommunities = gql` query{
      data:fetchCommunityDefinitionForSelect{label:name,value:code}
    }
    `;
    let fetchUsers = gql`query($id:String,$displayAllOption:Boolean){
      data:FetchUserType(communityCode:$id,displayAllOption:$displayAllOption){
      label:userTypeName
      value:_id
      }
    }
    `;
    let clusterquery=gql` query{data:fetchActiveClusters{label:countryName,value:_id}}`;
    let chapterquery=gql`query($id:String){data:fetchChapters(id:$id) {
    value:_id
    label:chapterName
      }  
    }`;
    let subChapterquery=gql`query($id:String,$displayAllOption:Boolean){  
      data:fetchSubChaptersSelect(id:$id,displayAllOption:$displayAllOption) {
        value:_id
        label:subChapterName
      }  
    }`;
    let subprocessOption={options:{variables: {id:this.state.process}}};
    let chapterOption={options: { variables: {id:this.state.clusters}}};
    let subChapterOption={options: { variables: {id:this.state.chapters,displayAllOption:true}}};
    let usertypeOption={options: { variables: { id: this.state.communities,displayAllOption:true}}};
    let identityActive=''
    if(this.state.identity){
      identityActive='active'
    }
    const showLoader=this.state.loading;
    return (
      <div>
        {showLoader===true?(<MlLoader/>):(

            <div className="admin_main_wrap">
              <div className="admin_padding_wrap">
                <h2>Edit Template Assignment</h2>
                <div className="col-md-6 nopadding-left">
                  <div className="form_bg left_wrap">
                    <ScrollArea
                      speed={0.8}
                      className="left_wrap"
                      smoothScrolling={true}
                      default={true}
                    >
                      <form>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} placeholder={"Process"} className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.process} queryType={"graphql"} query={processQuery}  isDynamic={true} id={'query'} onSelect={this.optionsBySelectProcess.bind(this)} />
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false}  placeholder={"Sub Process"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.subProcess} queryType={"graphql"} query={subProcessQuery} queryOptions={subprocessOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectSubProcess.bind(this)} />
                        </div>
                        <div className="form-group">
                          <input ref="templateGroupName" value={this.state.templateGroupName&&this.state.templateGroupName} readOnly="true"
                                 placeholder="Group Name" className="form-control float-label"></input>
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false}  placeholder={"Cluster"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.clusters} queryType={"graphql"} query={clusterquery}  isDynamic={true} id={'clusterquery'} onSelect={this.optionsBySelectClusters.bind(this)} />
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false}  placeholder={"Chapter"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.chapters} queryType={"graphql"} query={chapterquery} queryOptions={chapterOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectChapters.bind(this)} />
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false}  placeholder={"SubChapter"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.subChapters} queryType={"graphql"} query={subChapterquery} queryOptions={subChapterOption} isDynamic={true} id={'query'} onSelect={this.optionsBySelectSubChapters.bind(this)} />
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false}  placeholder={"Communities"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.communities} queryType={"graphql"} query={fetchcommunities}  isDynamic={true} id={'fetchcommunities'} onSelect={this.optionsBySelectCommunities.bind(this)} />
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false}  placeholder={"User Types"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.userTypes} queryType={"graphql"} query={fetchUsers}  queryOptions={usertypeOption} isDynamic={true} id={'fetchuserTypes'} onSelect={this.optionsBySelectUserType.bind(this)} />
                        </div>
                        <div className="form-group">
                          <span className={`placeHolder ${identityActive}`}>Identity</span>
                          <Select name="form-field-name"  placeholder={"Identity"}  className="float-label"  options={IdentityOptions}  value={this.state.identity}  onChange={this.optionsBySelectIdentity.bind(this)}/>
                          <br className="clearfix"/><br className="clearfix"/><br className="clearfix"/>
                        </div>
                      </form>
                    </ScrollArea>
                  </div>
                </div>
                <div className="col-md-6 nopadding-right">
                  <div className="form_bg left_wrap">
                    <ScrollArea
                      speed={0.8}
                      className="left_wrap"
                      smoothScrolling={true}
                      default={true}>
                      {this.state.data&&this.state.stepAvailability?(<MlStepAvailability getStepAvailability={this.getStepAvailability.bind(this)} subProcessConfig={this.state.subProcess} stepDetails={this.state.data&&this.state.stepAvailability}/>):""}
                      <div className="panel panel-default">
                        <div className="panel-heading">Template Step Details</div>
                        <div className="panel-body">
                          <div className="ml_tabs">
                            <ul  className="nav nav-pills">
                              {that.state.steps.map(function(options,key) {
                                return(
                                  <li className="active" key={key} onClick={that.switchTabEvent.bind(that,options.stepName)}>
                                    <a  href={'#template'+key} data-toggle="tab"  >{options.stepName} </a>
                                  </li>
                                )})}
                            </ul>

                            <div className="tab-content clearfix">

                              {that.state.templateInfo.map(function(options,key) {
                                return(
                                  <div className="tab-pane active" id={'template'+key} key={key}>
                                    <div className="list-group nomargin-bottom">
                                      <a className="list-group-item" key={key} id={"template"}>{options.templateName}
                                        <FontAwesome className="btn btn-xs btn-mlBlue pull-right" name='eye' onClick={that.showTemplateImage.bind(that,options)}/>
                                      </a>
                                    </div>
                                  </div>
                                )})}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                {/*<span className="actions_switch show_act"></span>
                 <div className="bottom_actions_block show_block">
                 <div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/edit_icon.png"/> </a></div>
                 <div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/act_add_icon.png"/> </a></div>
                 <div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/act_logout_icon.png"/> </a></div>
                 <div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/act_progress_icon.png"/> </a></div>
                 <div className="hex_btn"><a href="#" className="hex_btn hex_btn_in"> <img src="/images/act_select_icon.png"/> </a></div>
                 </div>*/}
              </div>
              <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
            </div>
          )}
      </div>
    )
  }
};
export default MlAssignTemplate = formHandler()(MlEditAssignTemplate);
