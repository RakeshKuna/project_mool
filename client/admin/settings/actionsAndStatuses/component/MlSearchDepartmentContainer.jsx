/**
 * Created by pankaj on 23/5/17.
 */

import React from 'react';
import ScrollArea from 'react-scrollbar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import formHandler from '../../../../commons/containers/MlFormHandler'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';
import {client} from '../../../../admin/core/apolloConnection';

class MlSearchDepartmentContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      process         : props.data.processId,
      subProcess      : props.data.subProcessId,
      clusters        : props.data.clusterId,
      chapters        : props.data.chapterId,
      subChapters     : props.data.subChapterId,
      isMoolya        : props.data.isMoolya,
      departmentsList : props.data.departmentsList ? props.data.departmentsList : []
    };
    this.addEventHandler.bind(this);
    this.updateDepartmentsList();
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

  componentDidUpdate()
  {
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
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
        FlowRouter.go("/admin/settings/actionsAndStatusesList");
      else
        toastr.error(response.result);
    }
  };

  async findDepartment(){
    let processId=this.props.config
    const response = await findProcessActionHandler(processId);
    this.setState({loading:false,data:response});
  }

  createActionsAndStatuses() {
    let ret = mlFieldValidations(this.refs);
    if (ret) {
      toastr.error(ret);
    } else {
      let DataToInsert = {
        "processId": this.state.process,
        "subProcessId": this.state.subProcess,
        "clusterId": this.state.clusters,
        "chapterId": this.state.chapters,
        "subChapterId": this.state.subChapters,
        "isMoolya": this.state.isMoolya
      };
      this.props.submit(DataToInsert);
    }
  }
  getAssignedDocuments(departments){
    this.setState({'assignDocument':departments})
  }

  optionsBySelectProcess(val){
    let that = this;
    this.setState({process:val}, function () {
      that.updateDepartmentsList();
    })
  }

  optionsBySelectSubProcess(val){
    let that = this;
    this.setState({subProcess:val}, function () {
      that.updateDepartmentsList();
    });
  }

  optionsBySelectUserType(val){
    let that = this;
    this.setState({userTypes:val}, function () {
      that.updateDepartmentsList();
    });
  }

  optionsBySelectClusters(val){
    let that = this;
    this.setState({clusters:val}, function () {
      that.updateDepartmentsList();
    });
  }

  optionsBySelectChapters(val){
    let that = this;
    this.setState({chapters:val}, function () {
      that.updateDepartmentsList();
    });
  }

  optionsBySelectSubChapters(val){
    let that = this;
    this.setState({subChapters:val}, function () {
      that.updateDepartmentsList();
    });
  }

  optionsByChangeIsMoolya(val){
    let that = this;
    this.setState({
      isMoolya : !this.state.isMoolya
    }, function () {
      that.updateDepartmentsList();
    });
  }

  updateDepartmentsList(){

    let state = this.state;

    if(!state.clusters || !state.chapters || !state.subChapters || typeof state.isMoolya == undefined ) {
      this.setState({
        departmentsList: []
      });
      return false;
    }

    let departmentAndSubDeparmentQuery = gql`query ($isMoolya: Boolean, $cluster:String, $chapter: String, $subChapter: String) {
      data: fetchClusterChapterSubChapterBasedDepartmentRoles(isMoolya: $isMoolya, cluster:$cluster, chapter:$chapter, subChapter:$subChapter) {
        departmentId
        departmentName
        subDepartmentId
        subDepartmentName
      }
    }`;

    let departmentAndSubDeparmentOption={
      options: {
        variables:{
          isMoolya: state.isMoolya,
          cluster: state.clusters,
          chapter: state.chapters,
          subChapter: state.subChapters
        }
      }
    };

    client.query({
      query: departmentAndSubDeparmentQuery,
      fetchPolicy: 'network-only',
      variables:departmentAndSubDeparmentOption.options.variables
    }).then(data =>{
      this.setState({
        departmentsList:data.data.data
      }, function () {
      }.bind(this));
    });
  }

  redirect(deparment){
    let Id = FlowRouter.getParam('id');
    if(Id) {
      FlowRouter.go('/admin/settings/editActionsAndStatuses/' + Id + '/' + deparment.subDepartmentId);
    }
  }

  render(){
    const that = this;
    const departmentInfo = that.props.data.departmentInfo;
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.createActionsAndStatuses.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          this.props.handler(" ");
          FlowRouter.go("/admin/settings/actionsAndStatusesList")
        }
      }
    ]

    let query=gql` query{
       data:fetchCountriesSearch{label:country,value:countryCode}
    }`;
    let processQuery=gql`query{
      data: FetchProcessType {
        label:processName
		    value:_id
      }
    }`;

    let clusterquery=gql`query{ data:fetchActiveClusters{label:countryName,value:_id}}`;
    let chapterquery=gql`query($id:String){  
    data:fetchChapters(id:$id) {
        value:_id,
        label:chapterName
      }  
    }`;

    let subChapterquery=gql`query($chapterId:String,$clusterId:String){
        data:fetchSubChaptersSelectMoolya(chapterId:$chapterId,clusterId:$clusterId) {
          value:_id
          label:subChapterName
        }
      }`;

    let subProcessquery=gql`query($id:String){  
      data:fetchSubProcess(id:$id) {
        value:_id
        label:subProcessName
      }  
    }`;
    let subProcessOption={
      options: {
        variables: {
          id: this.state.process
        }
      }
    };
    let chapterOption={
      options: {
        variables: {
          id:this.state.clusters
        }
      }
    };
    let subChapterOption={
      options: {
        variables: {
          chapterId:this.state.chapters,
          clusterId:this.state.clusters,
          displayAllOption:true
        }
      }
    };

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Create Process</h2>
          <div className="main_wrap_scroll">
            <ScrollArea
              speed={0.8}
              className="main_wrap_scroll"
              smoothScrolling={true}
              default={true}
            >
              <div className="col-md-6 nopadding-left">
                <div className="">
                  <ScrollArea
                    speed={0.8}
                    className=""
                    smoothScrolling={true}
                    default={true}
                  >

                    <div className="form_bg">
                      <form>
                        <Moolyaselect ref="process" multiSelect={false} mandatory={true} placeholder={"Process"} className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.process} queryType={"graphql"} query={processQuery}  isDynamic={true} id={'query'} onSelect={this.optionsBySelectProcess.bind(this)} data-required={true} data-errMsg="Process is required" />
                        <Moolyaselect ref="cluster"  multiSelect={false} mandatory={true} placeholder={"Select Cluster"} className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.clusters} queryType={"graphql"} query={clusterquery}  isDynamic={true} id={'country'} onSelect={this.optionsBySelectClusters.bind(this)} data-required={true} data-errMsg="Cluster is required" />
                        <Moolyaselect ref="chapter"  multiSelect={false} mandatory={true} placeholder={"Select Chapter"} className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.chapters} queryType={"graphql"} query={chapterquery}  isDynamic={true} id={'chapter'} reExecuteQuery={true} queryOptions={chapterOption} onSelect={this.optionsBySelectChapters.bind(this)}   data-required={true} data-errMsg="Chapter is required" />
                      </form>
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="col-md-6 nopadding-right"  >
                <div className="form_bg" >
                  <div className="">
                    <ScrollArea
                      speed={0.8}
                      className=""
                      smoothScrolling={true}
                      default={true}
                    >
                      <form>
                        <Moolyaselect ref="subProcess" multiSelect={false} mandatory={true} placeholder={"Sub Process"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.subProcess} queryType={"graphql"} query={subProcessquery} queryOptions={subProcessOption}  isDynamic={true} id={'subProcessquery'} onSelect={this.optionsBySelectSubProcess.bind(this)}  data-required={true} data-errMsg="Sub process is required"/>
                        <div className="form-group switch_wrap inline_switch">
                          <label className="">Moolya</label>
                          <label className="switch">
                            <input type="checkbox" ref="status" defaultChecked={this.state.isMoolya} onChange={this.optionsByChangeIsMoolya.bind(this)}/>
                            <div className="slider"></div>
                          </label>
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <div className="form-group">
                          <Moolyaselect ref={"subChapter"} multiSelect={false}  mandatory={true} placeholder="Select SubChapter" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.subChapters} queryType={"graphql"} query={subChapterquery}  isDynamic={true} id={'subChapter'} reExecuteQuery={true} queryOptions={subChapterOption} onSelect={this.optionsBySelectSubChapters.bind(this)}  data-required={true} data-errMsg="SubChapter is required" />
                        </div>
                      </form>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="react-bs-table-container">
              <div className="react-bs-table" style={{heigh:"100%"}}>
                <div className="react-bs-container-header table-header-wrapper">
                  <table className="table table-hover table-bordered">
                    <colgroup>
                      <col style={{width: "30px", minWidth: "30px"}} />
                      <col className="" style={{display: "none", width: "62px", minWidth: "62px"}} />
                      <col className="" />
                      <col className="" />
                      <col className="" />
                    </colgroup>
                    <thead>
                    <tr>
                      <th rowSpan={1} data-is-only-head="false" style={{textAlign: "center"}}>
                        {/*<input type="checkbox" className="react-bs-select-all" value="on" />*/}
                      </th>
                      <th className="sort-column" data-is-only-head="false" title="Id" data-field="transactionId" style={{textAlign: "center", display: "none"}}>
                        Id
                        <span className="order">
                      <span className="dropdown">
                        <span className="caret" style={{margin: "10px 0px 10px 5px", color: "rgb(204, 204, 204)"}}></span>
                      </span>
                      <span className="dropup">
                        <span className="caret" style={{margin: "10px 0px", color: "rgb(204, 204, 204)"}}></span>
                      </span>
                    </span>
                        <div></div>
                      </th>
                      <th className="" data-is-only-head="false" title="Date&amp;Time" data-field="transactionCreatedDate" style={{textAlign: "left"}}>
                        Department
                        <div></div>
                      </th>
                      <th className="" data-is-only-head="false" title="RequestId" data-field="requestId" style={{textAlign: "left"}}>
                        Sub Department
                        <div></div>
                      </th>
                      <th className="" data-is-only-head="false" title="Type" data-field="requestTypeName" style={{textAlign: "left"}}>
                        Status
                        <div></div>
                      </th>
                    </tr>
                    </thead>
                  </table>
                </div>
                <div className="react-bs-container-body" style={{"height": "100%"}}>
                  <div className="table table-bordered table-hover">
                    <table className="table table-hover table-bordered">
                      <colgroup>
                        <col style={{width: "30px", minWidth: "30px"}} />
                        <col style={{display: "none", width: "62px", minWidth: "62px"}} />
                        <col />
                        <col />
                        <col />
                      </colgroup>
                      <tbody>
                      {that.state.departmentsList.map(function (deparment,i) {
                        return (
                          <tr key={i} onClick={()=>that.redirect(deparment)}>
                            <td style={{"textAlign": "center;"}}>
                              <input type="radio" checked={departmentInfo && departmentInfo.subDepartmentId == deparment.subDepartmentId} name="radio" />
                            </td>
                            <td style={{"textAlign": "center", display: "none"}}>{deparment.id}</td>
                            <td style={{"textAlign": "left;"}}>{deparment.departmentName}</td>
                            <td style={{"textAlign": "left;"}}>{deparment.subDepartmentName}</td>
                            <td style={{"textAlign": "left;"}}>Active</td>
                          </tr>
                        )
                      })}
                      </tbody>
                    </table>
                  </div>
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
export default MlSearchDepartmentContainer = formHandler()(MlSearchDepartmentContainer);
