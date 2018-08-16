/**
 * Created by pankaj on 18/8/17.
 */
import React from 'react';
import Datetime from "react-datetime";
var FontAwesome = require('react-fontawesome');
import {fetchInternalTaskInfo} from '../actions/fetchInternalTaskInfo';
import {updateInternalTaskInfo} from '../actions/updateInternalTask';
import moment from "moment";
import MlAccordion from "../../commons/components/MlAccordion";
import formHandler from "../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../commons/components/MlAppActionComponent";
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';

class MlAppInternalAssignTaskItem extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      taskInfo: {
        docs:[],
        userInfo:[],
        community:{},
        expectedInput:'',
        note:'',
        expectedOutput:'',
        name:''
      },
      taskId: props.taskId ? props.taskId : '',
      previewDocument:""
    };
  }

  componentDidMount(){
    this.fetchTaskInfo();
    setTimeout(function () {
      $('.float-label').jvFloat();
    },200);


    (function (a) {
      a.createModal = function (b) {
        defaults = { scrollable: false };
        var b = a.extend({}, defaults, b);
        var c = (b.scrollable === true) ? 'style="max-height: 420px;overflow-y: auto;"' : "";
        html = '<div class="modal fade library-popup" id="myModal">';
        html += '<div class="modal-dialog">';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">Ã—</button>';
        if (b.title.length > 0) {
          html += '<h4 class="modal-title">' + b.title + "</h4>"
        }
        html += "</div>";
        html += '<div class="modal-body" ' + c + ">";
        html += b.message;
        html += "</div>";
        a("body").prepend(html);
        a("#myModal").modal().on("hidden.bs.modal", function () {
          a(this).remove()
        })
      }
    })(jQuery);

  }

  componentWillReceiveProps(nextProps) {
    if(this.state.taskId !== nextProps.taskId){
      this.setState({
        taskId: nextProps.taskId
      }, function () {
        this.fetchTaskInfo();
      }.bind(this));

    }
  }

  async fetchTaskInfo() {
    if(this.state.taskId){
      let response = await fetchInternalTaskInfo(this.state.taskId);
      if(response){
        response.attendees = response.attendees ? response.attendees : [];
        response.docs = response.docs ? response.docs : [];
        this.setState({
          taskInfo:response
        }, function () {
          $('.float-label').jvFloat();
        })
      };
    }
  }

  randomDocument(link, index) {
    let documentPreviewUrl = generateAbsolutePath(link.fileUrl);
    this.setState({ previewDocument: documentPreviewUrl });
  }

  async updateStatus(status){
    let taskId = this.state.taskId;
    let dataToUpdata = {
      status: status
    };
    let response = await updateInternalTaskInfo(taskId, dataToUpdata);
    if(response.success){
      toastr.success('Task successfully moved to '+ status);
      //toastr.success('Task Updated Successfully');
      this.props.fetchTaskList(status);
    }
  }

  render(){
    let task = this.state.taskInfo;
    task.docs = task.docs ? task.docs : [];
    const that = this;
    /**
     * Setting up action handler for activity different event
     */
    let appActionConfig = [];
    if( task.status == 'pending') {
      appActionConfig = [
        {
          showAction: true,
          actionName: 'accept',
          handler: async(event) => that.props.handler(that.updateStatus.bind(this, 'accepted'))
        },
        {
          showAction: true,
          actionName: 'reject',
          handler: async(event) => that.props.handler(that.updateStatus.bind(this, 'rejected'))
        }
      ];
    } else if (task.status == 'accepted') {
      appActionConfig = [
        {
          showAction: true,
          actionName: 'start',
          handler: async(event) => that.props.handler(that.updateStatus.bind(this, 'started'))
        }
      ];
    } else if (task.status == 'started') {
      appActionConfig = [
        {
          showAction: true,
          actionName: 'complete',
          handler: async(event) => that.props.handler(that.updateStatus.bind(this, 'completed'))
        }
      ];
    } else if (task.status == 'rejected') {
      appActionConfig = [
        {
          showAction: true,
          actionName: 'accept',
          handler: async(event) => that.props.handler(that.updateStatus.bind(this, 'accepted'))
        }
      ];
    }
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
    /*const renderActions = function () {
      if( task.status == 'pending') {
        return <div className="form-group ml_btn">
          <a href="" onClick={()=>that.updateStatus('accepted')} className="cancel_btn">Accept</a>
          <a href="" onClick={()=>that.updateStatus('rejected')} className="save_btn">Reject</a>
        </div>
      } else if ( task.status == 'accepted' ) {
        return <div className="form-group ml_btn">
          <a href="" onClick={()=>that.updateStatus('started')} className="cancel_btn">Start</a>
        </div>
      } else if (  task.status == 'started' ) {
        return <div className="form-group ml_btn">
          <a href="" onClick={()=>that.updateStatus('completed')} className="cancel_btn">Complete</a>
        </div>
      }
    };*/
    return(
      <div className="">

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

        <div className="col-md-6 nopadding-left">
          <div className="form_bg">
            <form>
              <div className="form-group">
                <input className="form-control float-label" placeholder="Task Name" value={task.name ? task.name : ''} />
              </div>

              <div className="form-group">
                <Datetime dateFormat="DD-MM-YYYY"
                          timeFormat={false}
                          inputProps={{placeholder: "Due Date", className:"form-control float-label",readOnly:true}}
                          closeOnSelect={true}
                          value={ task.dueDate ? moment(task.dueDate) : '' }
                          onChange={(date)=> this.dueDate(date)}/>
              </div>
              <div className="form-group">
                <textarea className="form-control float-label" placeholder="Expected Input" value={task.expectedInput ? task.expectedInput :''} ></textarea>
              </div>
              <div className="panel panel-default mart20">
                <div className="panel-heading"> Attached Documents </div>
                <div className="panel-body">
                  <div className="swiper-container conversation-slider blocks_in_form">
                    <div className="swiper-wrapper">
                      {task.docs && task.docs.map(function(doc, index) {
                        return(
                          <div className="swiper-slide">
                            <a href="" data-toggle="modal" data-target=".documentpop" onClick={that.randomDocument.bind(that,doc,index)}>
                              <FontAwesome name='eye'/>
                            </a>
                            <a href={generateAbsolutePath(doc.fileUrl)} download={doc.fileName}>
                              <FontAwesome name='download'/>
                            </a>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
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
                  <input id="radio1" type="radio" checked={ task.priority == "low" } name="radio" value="low" /><label htmlFor="radio1"><span><span></span></span>Low</label>
                </div>
                <div className="input_types">
                  <input id="radio2" type="radio" checked={ task.priority == "medium" } name="radio" value="medium" /><label htmlFor="radio2"><span><span></span></span>Medium</label>
                </div>
                <div className="input_types">
                  <input id="radio3" type="radio" checked={ task.priority == "high" } name="radio" value="high" /><label htmlFor="radio3"><span><span></span></span>High</label>
                </div>
              </div>
              <br className="brclear" />
              <div className="form-group">
                <textarea className="form-control float-label" placeholder="Notes" value={task.note ? task.note : ''} ></textarea>
              </div>
              <div className="form-group">
                <textarea className="form-control float-label" placeholder="Expected Output" value={task.expectedOutput ? task.expectedOutput : '' } ></textarea>
              </div>

              <div className="panel panel-default">
                <div className="panel-heading"> Attendees </div>
                <div className="panel-body">
                  <ul className="users_list well well-sm">
                    {task.userInfo && task.userInfo.map(function(user, index){
                      return(
                        <li key={index}>
                          <a href="">
                            <span></span>
                            <img src={ user.profileUrl ? generateAbsolutePath(user.profileUrl) : "/images/def_profile.png"} /><br />
                            <div className="tooltiprefer">
                              <span>{user.name}</span>
                            </div>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </form>
            {/*{renderActions()}*/}
          </div>
        </div>
        <div>
          {task.status !== 'completed' &&
          <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
          }
        </div>
      </div>


    )
  }

}

export default MlAppInternalAssignTaskItem = formHandler()(MlAppInternalAssignTaskItem);
