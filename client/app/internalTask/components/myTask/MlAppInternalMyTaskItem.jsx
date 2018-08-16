/** ************************************************************
 * Date: 07 Jul, 2017
 * Programmer: Pankaj <pakajkumar.jatav@raksan.in>
 * Description : This will create my task
 * JavaScript XML file MlAppNewTask.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React from 'react';
import ScrollArea from 'react-scrollbar';
import Datetime from "react-datetime";
import moment from "moment";
import {fetchMasterTasks} from '../../actions/fetchMasterInternalTask';
import {createSelfInternalTask} from '../../actions/createSelfInternalTask';
import { fetchOfficeActionHandler, getTeamUsersActionHandler } from '../../actions/fetchOffices';
let FontAwesome = require('react-fontawesome');
import MlAccordion from "../../../commons/components/MlAccordion";
import formHandler from "../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../commons/components/MlAppActionComponent";
import {multipartASyncFormHandler} from '../../../../commons/MlMultipartFormAction';
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath';

let yesterday = Datetime.moment().subtract( 1, 'day' );
let valid = function( current ){
  return current.isAfter( yesterday );
};

/**
 * Initialize conversation types
 */
class MlAppInternalMyTaskItem extends React.Component{

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props){
    super(props);
    this.state ={
      basicData : {
        dueDate: '',
        resourceId: ''
      },
      taskList:[],
      offices:[],
      users:[],
      teamData: [{users: []}],
      docs: [],previewDocument:""

    };
    this.deleteDocs = this.deleteDocs.bind(this);
  }

  /**
   * Method :: textFieldSaves
   * Desc   :: update input and input area text in state
   * @param type :: String :: type of field in state data
   * @param evt  :: Object :: javascript event object
   * @returns Void
   */
  textFieldSaves(type,evt){
    let data = this.state.basicData;
    data[type] = evt.target.value;
    this.setState({
      basicData: data
    });
  }

  /**
   * Component Did Mount
   * Desc :: intilize float labels
   */
  componentDidMount() {

    $('.float-label').jvFloat();
    let WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(120+$('.app_header').outerHeight(true)));
    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
    // this.fetchMasterTasks();
    this.getOffices();

    $(".information").unbind("click").click(function () {
      if ($(this).hasClass('ml-information')) {
        $(this).removeClass('ml-information').addClass('ml-delete');
        $(this).parents('.panel').find('.panel-body').css({ 'overflow': 'hidden' });

      } else {
        $(this).removeClass('ml-delete').addClass('ml-information');
        $(this).parents('.panel').find('.panel-body').css({ 'overflow': 'auto' });
      }
      $(this).parents('.panel').find(".show-information").toggle(200);
    });
  }


  /**
   * Method :: getOffices
   * Desc   :: fetch the offices of user
   * @returns Void
   */
  async getOffices () {
    let response = await fetchOfficeActionHandler();
    if(response){
      this.setState({
        offices:response
      })
    }
  }

  /**
   * Method :: getUsers
   * Desc   :: fetch the users of current team
   * @returns Void
   */
  async getUsers(evt) {
    const that = this;
    console.log(evt);
    let officeId = evt.target.value;
    const resp = await getTeamUsersActionHandler(officeId);
    console.log(resp);
    let users = resp.map(function (user) {
      let userInfo = {
        name: user.name,
        profileId: user.profileId,
        profileImage: user.profileImage,
        userId: user.userId
      };
      // let isFind = team.users.find(function (teamUser) {
        // return teamUser.profileId == user.profileId && teamUser.userId == user.userId
      // });
      // if (isFind) {
      //   userInfo.isAdded = true;
      //   userInfo.isMandatory = isFind.isMandatory;
      // }
      return userInfo;
    });
    that.setState({
      users: users
    });
    console.log(users);
  }

  /**
   * Method :: addUser
   * Desc   :: add user in team
   * @param teamIndex :: Integer :: Index of specific team
   * @param userIndex :: Integer :: Index of specific user
   * @returns Void
   */
  addUser(teamIndex, userIndex){
    let teamData = this.state.teamData;
    teamData[teamIndex].users[userIndex].isAdded = teamData[teamIndex].users[userIndex].isAdded ? false : true;
    this.setState({
      teamData: teamData
    });
  }

  toggleUser(userIndex) {
    let users = this.state.users;
    users[userIndex].isAdded =  users[userIndex].isAdded ? false : true;
    this.setState({
      users: users
    });
  }

  async fetchMasterTasks(){
    let response = await fetchMasterTasks();
    if(response) {
      this.setState({
        taskList: response
      });
    }
  };

  // setTask(task) {
  //   let basicData = this.state.basicData;
  //   basicData.resourceId = task.value;
  //   this.setState({
  //     basicData: basicData
  //   });
  // }

  async saveDetails(){
    let dataToInsert = this.state.basicData;
    let users =  this.state.teamData.reduce((assignees, team) => {
      let users = team.users ? team.users : [] ;
      users.map((user) => {
        if(user.isAdded){
          let isfind = assignees.find( (assignee) => { return assignee.profileId === user.profileId } );
          if(!isfind){
            assignees.push(user)
          }
        }
      });
      return assignees;
    }, []).map( (user) => {
      return { userId: user.userId, profileId: user.profileId }
    });

    if(users.length) {
      dataToInsert.users = users;
    }

    let docs = this.state.docs;
    if(docs.length) {
      dataToInsert.docs = docs;
    }

    let response = await createSelfInternalTask(dataToInsert);
    if(response) {
      toastr.success(response.result);
      FlowRouter.setQueryParams({
        add: null,
        tab:null
      });
    }
  }

  dueDate(date){
    let basicData = this.state.basicData;
    basicData.dueDate = date;
    this.setState({
      basicData: basicData
    })
  }

  changePriority(evt){
    let basicData = this.state.basicData;
    basicData.priority = evt.target.value;
    this.setState({
      basicData: basicData
    });
  }

  /**
   * Method :: addTeam
   * Desc   :: add new team in activity
   * @returns Void
   */
  addTeam() {
    let teamData = this.state.teamData;
    teamData.push({users:[]});
    this.setState({
      teamData : teamData
    });
  }

  /**
   * Method :: addTeam
   * Desc   :: remove new team in activity
   * @returns Void
   */
  removeTeam(index) {
    let teamData = this.state.teamData;
    teamData.splice(index, 1);
    this.setState({
      teamData: teamData
    });
  }

  /**
   * Method :: chooseTeamType
   * Desc   :: update team type in specific team
   * @param evt   :: Object  :: javascript event object
   * @param index :: Integer :: Index of specific team
   * @returns Void
   */
  async chooseTeamType(evt, index){

    let teamData = this.state.teamData;
    let officeId = evt.target.value;
    teamData[index].resourceType="office";
    teamData[index].resourceId=evt.target.value;
    const resp = await getTeamUsersActionHandler(officeId);
    if(resp){
      teamData[index].users = resp.map(function (user) {
        return {
          name: user.name,
          profileId: user.profileId,
          profileImage: user.profileImage,
          userId: user.userId
        }
      });
    }
    this.setState({
      teamData:teamData
    });
  }

  /**
   * Method :: documentUpload
   * Desc   :: update team type in specific team
   * @param evt   :: Object  :: javascript event object
   * @param index :: Integer :: Index of specific team
   * @returns Void
   */
  documentUpload(e) {
    let file = e.target.files[0];
    this.setState({fileType:file.type,fileName:file.name });
    let fileType = file.type;
    let typeShouldBe = _.compact(fileType.split('/'));
    if (file  && typeShouldBe && typeShouldBe[1]==="pdf" ) {
      let data = {moduleName: "PROFILE", actionName: "UPDATE"}
      let response =  multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this, file.name));
    }else{
      toastr.error("Please select a Document Format")
    }
  }

  onFileUploadCallBack( fileName, resp ) {
    if ( resp ) {
      let documents = this.state.docs || [];
      let link = $.parseJSON(resp).result;
      let documentAttributes = {
        fileName: fileName,
        fileUrl: link
      };
      documents.push(documentAttributes);
      this.setState({docs: documents});
    }
  }

  deleteDocs(index) {
    let docs = this.state.docs || []
    docs.splice(index, 1);
    this.setState({docs: docs})
  }

  randomDocument(link, index) {
    let documentPreviewUrl = generateAbsolutePath(link.fileUrl);
    this.setState({ previewDocument: documentPreviewUrl });
  }

  attachedDocuments() {
    let that = this;
    let documents = that.state.docs || [];
    let documentsUploaded =  documents.map(function(docsToView, index){
      return(
        <div className="thumbnail" key={index} >
          <FontAwesome name='trash-o' onClick={that.deleteDocs.bind(that, index)} />
          <a data-toggle="modal" data-target=".documentpop" onClick={that.randomDocument.bind(that,docsToView,index)}><img src="/images/pdf.png"/></a>
          <div id="images" className="title">{docsToView.fileName}</div>
        </div>
      )
    });
    return documentsUploaded;
  }


  cancelDetails(){
    FlowRouter.setQueryParams({
      add: null,
      tab:null
    });
  }

  /**
   * Render
   * Desc   :: Render the HTML for this component
   * @returns {HTML}
   */
  render() {
    const that = this;
    /**
     * Setting up action handler for activity different event
     */
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => that.props.handler(that.saveDetails.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => that.props.handler(that.cancelDetails.bind(this))
      }
    ];
    export const genericPortfolioAccordionConfig = {
      id: 'portfolioAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: {'background': '#ef4647'},
          contentComponent: <MlAppActionComponent
            resourceDetails={{resourceId: 'mytask', resourceType: 'mytask'}}   //resource id need to be given
            actionOptions={appActionConfig}/>
        }]
    };
    /**
     * Return the html to render
     */
    return (
      <div className="step_form_wrap step1">
            <div className="modal fade bs-example-modal-sm library-popup documentpop"
      onContextMenu={(e) => e.preventDefault()} tabIndex="-1" role="dialog"
      aria-labelledby="mySmallModalLabel">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
          </div>
          <div className="modal-body">
            {this.state.previewDocument&&(this.state.previewDocument).endsWith('.pdf')?
              <iframe src={`https://docs.google.com/gview?url=${this.state.previewDocument}&embedded=true`} />
              :

              <iframe src={`https://view.officeapps.live.com/op/view.aspx?src=${this.state.previewDocument}`} />
            }
            {/*{<MlFileViewer/>}*/}
            {/*<div className="img_scroll"><MlDocViewer/></div>*/}
          </div>
        </div>
      </div>
    </div>
        <ScrollArea speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                {/*<div className="form-group">*/}
                  {/*<Select*/}
                    {/*name="form-field-name"*/}
                    {/*placeholder="Choose task"*/}
                    {/*value={that.state.basicData.resourceId}*/}
                    {/*options={that.state.taskList}*/}
                    {/*onChange={(value)=>that.setTask(value)}*/}
                  {/*/>*/}
                {/*</div>*/}
                <div className="form-group">
                  <input className="form-control float-label" placeholder="Task Name" value={that.state.basicData.name} onChange={that.textFieldSaves.bind(that,"name")}/>
                </div>

                <div className="form-group">
                  <span className={`placeHolder ${this.state.basicData && this.state.basicData.dueDate ? 'active' : ''}`}>Due Date</span>
                  <Datetime dateFormat="DD-MM-YYYY"
                            isValidDate={valid}
                            timeFormat={false}
                            inputProps={{placeholder: "Due Date",readOnly:true}}
                            closeOnSelect={true}
                            value={moment( this.state.basicData.dueDate ? this.state.basicData.dueDate : '' )}
                            onChange={(date)=> this.dueDate(date)}/>
                </div>
                <div className="form-group">
                  <textarea className="form-control float-label" placeholder="Expected Input" value={that.state.basicData.expectedInput} onChange={that.textFieldSaves.bind(that, "expectedInput")}></textarea>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <div className="input_types">
                    <label>Set Priority : </label>
                  </div>
                  <div className="input_types">
                    <input id="radio1" type="radio" checked={ that.state.basicData.priority == "low" } name="radio" value="low" onClick={(evt)=>that.changePriority(evt)} /><label htmlFor="radio1"><span><span></span></span>Low</label>
                  </div>
                  <div className="input_types">
                    <input id="radio2" type="radio" checked={ that.state.basicData.priority == "medium" } name="radio" value="medium" onClick={(evt)=>that.changePriority(evt)} /><label htmlFor="radio2"><span><span></span></span>Medium</label>
                  </div>
                  <div className="input_types">
                    <input id="radio3" type="radio" checked={ that.state.basicData.priority == "high" } name="radio" value="high"  onClick={(evt)=>that.changePriority(evt)} /><label htmlFor="radio3"><span><span></span></span>High</label>
                  </div>
                </div>
                <br className="brclear" />
                <div className="form-group">
                  <textarea className="form-control float-label" placeholder="Notes" value={ that.state.basicData && that.state.basicData.note ? that.state.basicData.note : ''} onChange={that.textFieldSaves.bind(that, "note")}></textarea>
                </div>
                <div className="form-group">
                  <textarea className="form-control float-label" placeholder="Expected Output" value={that.state.basicData.expectedOutput} onChange={that.textFieldSaves.bind(that, "expectedOutput")}></textarea>
                </div>
              </form>
            </div>
          </div>


          <div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-left">
            <div className="panel panel-default uploaded_files">
              <div className="panel-heading">
                Attached Documents
                <div className="pull-right block_action">
                  <div className="fileUpload upload_file_mask" id="create_video">
                    <a href="javascript:void(0);">
                      <span className="ml ml-upload">
                        <input type="file" className="upload_file upload" name="video_source" id="video_upload" onChange={that.documentUpload.bind(that)} />
                      </span>
                    </a>
                  </div>
                </div>
                <div className="pull-right block_action">
                  <span className="single_icon ml ml-information information"></span>
                </div>
              </div>
              <div className="panel-body">
                <p className="show-information" style={{ 'display': 'none' }}>Document Format : PDF <br />Document Size : 10 MB <br /></p>
                {this.attachedDocuments()}
              </div>
            </div>
          </div>

          {that.state.teamData.map(function (team, index) {
            return (
              <div className="col-md-6 nopadding-left" key={index}>
                <div className="panel panel-default cal_view_task">
                  <div className="panel-heading">
                    Select Users
                    <span className="see-more pull-right">
                    { that.state.offices && that.state.offices.length > 1 ?
                      (index == 0 ?
                        <a href="" onClick={()=>that.addTeam()}>
                          <FontAwesome name='plus'/>
                        </a>
                        :
                        <a href="" onClick={()=>that.removeTeam(index)}>
                          <FontAwesome name='minus'/>
                        </a>)
                      : ''
                    }

                  </span>
                  </div>
                  <div className="panel-body sug_teams">
                    <div className="col-md-12 nopadding">
                      <div className="col-md-6 nopadding-right">
                        <form>
                          <div className="form-group">
                            <span className="placeHolder active">Choose team Type</span>
                            <select defaultValue="chooseTeam" value={ team.resourceId } className="form-control" onChange={(evt)=>that.chooseTeamType(evt, index)}>
                              <option value="chooseTeam" disabled="disabled">Choose team Type</option>
                              {that.state.offices.map(function (office , index) {
                                return <option key={index} value={office._id}>{ office.officeName + " - " + office.branchType }</option>
                              })}
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <input type="text" name="search" className="search_field" placeholder="Search.."/>
                    </div>
                    <div className="col-md-12 nopadding att_members" >
                      <ul className="users_list">
                        {team.users.map(function (user, userIndex) {
                          return (
                            <li className={ user.isAdded ? "checkedClass" : "" }   key={userIndex} onClick={() => that.addUser(index, userIndex)}>
                              <a href="">
                                <img src={user.profileImage ? generateAbsolutePath(user.profileImage) : "/images/def_profile.png"} /><br />
                                <div className="tooltiprefer">
                                  <span>{user.name}</span>
                                </div>
                                <span className="member_status">
                                { user.isAdded ? <FontAwesome name="check" /> : <FontAwesome name="plus" /> }
                              </span>
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/*<div className="col-md-12 nopadding-left" hidden={ that.state.offices && that.state.offices.length ? false : true } >*/}
            {/*<div className="panel panel-default cal_view_task">*/}
              {/*<div className="panel-heading">*/}
                {/*Select Users*/}
              {/*</div>*/}
              {/*<div className="panel-body sug_teams">*/}
                {/*<div className="col-md-12 nopadding">*/}
                  {/*<div className="col-md-6 nopadding-right">*/}
                    {/*<form>*/}
                      {/*<div className="form-group">*/}
                        {/*<span className="placeHolder active">Choose team Type</span>*/}
                        {/*<select defaultValue="0" className="form-control" onChange={(evt)=>that.getUsers(evt)} >*/}
                          {/*<option selected="true" disabled="disabled" value="0">Select Office Team</option>*/}
                          {/*{ that.state.offices.map(function (office , index) {*/}
                            {/*return <option key={index} value={office._id}>{ office.officeName + " - " + office.branchType }</option>*/}
                          {/*})}*/}
                        {/*</select>*/}
                      {/*</div>*/}
                    {/*</form>*/}
                  {/*</div>*/}
                {/*</div>*/}
                {/*/!*<div className="col-md-12">*!/*/}
                  {/*/!*<input type="text" name="search" className="search_field" placeholder="Search.."/>*!/*/}
                {/*/!*</div>*!/*/}
                {/*<div className="col-md-12 nopadding att_members" >*/}
                  {/*<ul className="users_list">*/}
                    {/*{that.state.users.map(function (user, userIndex) {*/}
                      {/*return (*/}
                        {/*<li key={userIndex} onClick={() => that.toggleUser(userIndex)} >*/}
                          {/*<a href="">*/}
                            {/*<img src={user.profileImage ? user.profileImage : "/images/def_profile.png"} /><br />*/}
                            {/*<div className="tooltiprefer">*/}
                              {/*<span>{user.name}</span>*/}
                            {/*</div>*/}
                            {/*<span className="member_status" >*/}
                                {/*{ user.isAdded ? <FontAwesome name="check" /> : <FontAwesome name="plus" /> }*/}
                              {/*</span>*/}
                          {/*</a>*/}
                          {/*/!*<div className="input_types">*!/*/}
                            {/*/!*<br />*!/*/}
                            {/*/!*<input id={"mandatory"+index+userIndex} checked={ user.isMandatory ? true : false } name="Mandatory" type="checkbox" value="Mandatory" onChange={(evt)=>that.updateIsMandatory(evt, index, userIndex)} />*!/*/}
                            {/*/!*<label htmlFor={"mandatory"+index+userIndex}>*!/*/}
                              {/*/!*<span><span></span></span>*!/*/}
                              {/*/!*Mandatory*!/*/}
                            {/*/!*</label>*!/*/}
                          {/*/!*</div>*!/*/}
                        {/*</li>*/}
                      {/*)*/}
                    {/*})}*/}
                  {/*</ul>*/}
                {/*</div>*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}

        </ScrollArea>
        {/*<div className="ml_btn" style={{'textAlign':'center'}}>
          <a href="" className="save_btn" onClick={this.saveDetails.bind(this)}>Save</a>
          <a href="" className="cancel_btn" onClick={()=>that.props.updateType('list')} >Cancel</a>
        </div>*/}
        <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
      </div>
    )
  }
};

export default MlAppInternalMyTaskItem = formHandler()(MlAppInternalMyTaskItem);
