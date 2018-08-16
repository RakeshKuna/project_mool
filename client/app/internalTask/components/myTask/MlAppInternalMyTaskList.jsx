/**
 * Created by pankaj on 8/7/17.
 */

import React,{PropTypes} from 'react';
import {fetchSelfCreatedInternalTask} from '../../actions/fetchMyInternalTask';
import MlAppInternalAssignTaskItem from './../MlAppInternalAssignTaskItem';

export default class MlAppInternalMyTaskList extends React.Component{

  constructor(props){
    super(props);
    this.state={
      tasks:[],
      selectTask:'',
      selectedTaskType: ''
    };
    this.fetchTaskList = this.fetchTaskList.bind(this);
  }

  componentDidMount() {
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


    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    $(".swiper-slide .team-block").click(function(){
      $(this).toggleClass("active");
    });

    $("#show").click(function(){
      $("#details-div").show();

      var $frame = $('#centered');
      var $wrap  = $frame.parent();

      // Call Sly on frame
      $frame.sly({
        horizontal: 1,
        itemNav: 'centered',
        smart: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
      });
    });
    $(function() {
      $('.float-label').jvFloat();
    });
    $('.tab_wrap_scroll').height(WinHeight-($('.app_header').outerHeight(true)+20));
    if(WinWidth > 768){
      $(".tab_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
  }

  async fetchTaskList(status) {
    let response = await fetchSelfCreatedInternalTask(['pending']);
    if(response){
      this.setState({
        tasks: response,
        selectTask: null
      })
    }
    if(status){
      FlowRouter.setQueryParams({tab:capitalizeFirstLetter(status)});
      // this.context.taskStatus.updateTaskStatus();
      this.props.config.changeTab();
    }
  }

  selectTask(task) {
    console.log(task);
    this.setState({
      selectTask: task._id ? task._id : '',
    })
  }

  updateType () {
    FlowRouter.setQueryParams({
      add: true
    });
  }

  render(){
    const that = this;
    let tasks = this.props.data || [];
    return (
      <div>
        <div className="ideators_list">
          <div className="col-lg-12" id="show">
            { that.state.selectTask ?
                <div id="details-div">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="top_block_scroller" id="centered">
                      <ul className="topscroll_listblock ideators_list">
                        {tasks.map(function (task, index) {
                          return (
                            <li key={index} onClick={()=>that.selectTask(task)} className={task._id == that.state.selectTask ? "selected_block ideators_list_block" : 'ideators_list_block'}>
                              <div className="premium">
                                <span>{task.name}</span>
                              </div>
                              <h3>{task.ownerName ? task.ownerName : "" }</h3>
                              <div className="list_icon">
                                {/*<img src="/images/valuation.png" style={{ "margin": 0 }} className="c_image ml ml-ideator"/>*/}
                                <span className="ml my-ml-my_list_2"></span>
                              </div>
                              <p>{task.portfolioTitle ? task.portfolioTitle : "" }</p>
                              <div className="block_footer">
                            <span>
                              { ( task.clusterName ?  task.clusterName + " - " : '' ) + (task.communityName ? task.communityName : '') }
                            </span>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  {
                    (that.state.selectedTaskType === 'assign-task' || that.state.selectedTaskType === 'self-task' || that.state.selectTask )
                      ? <MlAppInternalAssignTaskItem taskId={that.state.selectTask} fetchTaskList={this.fetchTaskList} />
                      : <div></div>
                  }
                </div>
              </div>
              :
                <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-4" >
                  <a href="" onClick={()=>that.updateType('new')} >
                    <div className="ideators_list_block add_task">
                      <div><span className="ml ml-plus "></span></div>
                      <div className="block_footer"><span>Add a task</span></div>
                    </div>
                  </a>
                </div>
                {tasks.map(function (task, index) {
                  return (
                    <div className="col-md-2 col-sx-3 col-sm-4 col-lg-2" key={index} onClick={()=>that.selectTask(task)}>
                      <div className="ideators_list_block">
                        <div className="premium">
                          <span>{task.name}</span>
                        </div>
                        <h3>{task.ownerName ? task.ownerName : "" }</h3>
                        <div className="list_icon">
                          {/*<img src="/images/valuation.png" style={{ "margin": 0 }} className="c_image ml ml-ideator"/>*/}
                          <span className="ml my-ml-my_list_2"></span>
                        </div>
                        <p>{task.portfolioTitle ? task.portfolioTitle : "" }</p>
                        <div className="block_footer">
                          <span>
                            { ( task.clusterName ?  task.clusterName + " - " : '' ) + (task.communityName ? task.communityName : '') }
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
};


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


