/**
 * Created by pankaj on 20/6/17.
 */
import React from "react";
var FontAwesome = require('react-fontawesome');
import {fetchAllOfficeMembers} from '../actions/fetchAllTeamMember';
let Select = require('react-select');
import {createInternalTaskActionHandler} from '../actions/createInternalTask'

export default class MlAssignTask extends React.Component {

  constructor(props){
    super(props);
    console.log(props);
    this.state={
      showAdd : true,
      users: [],
      members:[],
      selectedUser:[],
      docs:[]
    }
  }
  componentDidMount(){
    this.fetchAllOfficeMembers();
  }

  async submit(){
    if( !this.props.data.state.selected || !this.props.data.state.selected.resourceId ){
      toastr.error("Select a portfolio");
      return false;
    }
    if(!this.state.selectedUser.length){
      toastr.error("Select atleast one user");
      return false;
    }
    let members = this.state.members;
    let dataToInsert = {
      name : this.props.config.actionName,
      stage : this.props.data.props.currentStage.stageId,
      attendees: this.state.selectedUser.map(function (userId) {
        let user = members.find(function (user) {
          return user.userId == userId;
        });
        return {
          userId: userId,
          profileId: user.profileId
        }
      }),
      resourceId: this.props.data.state.selected.resourceId,
      community: {
        code: this.props.data.state.selected.portfolio.communityCode,
        name: this.props.data.state.selected.portfolio.communityName,
        type: this.props.data.state.selected.portfolio.communityType
      },
      docs:this.state.docs,
      note:this.refs.note.value
    };
    let response = await createInternalTaskActionHandler(dataToInsert);
    if(response.success) {
      toastr.success('Internal task created successfully');
      this.props.toggle();
    } else {
      toastr.error(response.result);
    }
  }

  async fetchAllOfficeMembers(){
    let response = await fetchAllOfficeMembers();
    if(response){
      console.log(response);
      let options = response.map(function (user) {
        return {
          value:user.userId,
          label:user.name + (user.officeName ? (" - " + user.officeName ) : '' )
        }
      });
      this.setState({
        users:options,
        members:response
      });
    }
  }

  toggleAddUser(){
    this.setState({
      showAdd : !this.state.showAdd
    });
  }

  addUser(user){
    let seletectUsers = this.state.selectedUser;
    let isAlready = seletectUsers.find(function (userId) {
      return userId == user.value;
    });
    if(!isAlready){
      seletectUsers.push(user.value);
      this.setState({
        selectedUser: seletectUsers
      });
    }
  }

  removeUser(userId) {
    let seletectUsers = this.state.selectedUser;
    seletectUsers.splice(seletectUsers.indexOf(userId), 1);
    this.setState({
      selectedUser: seletectUsers
    });
  }

  render(){
    const that = this;
    return(
      <div className="popover-lg">
        <div className="pop_review" >
          <div className="comments-container cus_scroll">
            <ul id="comments-list" className="comments-list">
              <li>
                <ul className="comments-list reply-list">
                  <li>
                    <div className="comment-avatar"><img src="/images/p_2.jpg" alt=""/></div>
                    <div className="comment-box">
                      <div className="comment-head">
                        <h6 className="comment-name">Pavani</h6>
                        <span>02 Nov 2016, 03:50:33 </span>
                      </div>
                      <div className="comment-content">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit omnis animi et iure laudantium vitae, praesentium optio, sapiente distinctio illo?
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="comment-avatar"><img src="/images/p_3.jpg" alt=""/></div>
                    <div className="comment-box">
                      <div className="comment-head">
                        <h6 className="comment-name">Agustin Ortiz</h6>
                        <span>02 Nov 2016, 03:50:33 </span>
                      </div>
                      <div className="comment-content">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit omnis animi et iure laudantium vitae, praesentium optio, sapiente distinctio illo?
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="comment-avatar"><img src="/images/p_4.jpg" alt=""/></div>
                    <div className="comment-box">
                      <div className="comment-head">
                        <h6 className="comment-name">Agustin Ortiz</h6>
                        <span>02 Nov 2016, 03:50:33 </span>
                      </div>
                      <div className="comment-content">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit omnis animi et iure laudantium vitae, praesentium optio, sapiente distinctio illo?
                      </div>
                    </div>
                  </li>

                </ul>
              </li>
            </ul>
          </div>
          <div className="clearfix" />
          <hr/>
          <div className="form-group">
            <textarea placeholder="Write your Comment" className="form-control float-label" id=""></textarea>
          </div>
          <div className="clearfix" />
          <a href="" className="save_btn add-question">Add Question </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="" className="save_btn">Submit</a>
        </div>
        <div className="pop_review_question" style={{'display':'none'}}>
          <div className="comments-container cus_scroll">
            <ul className="pop-questions">
              <li>
                <img src="/images/add.png"/>
                <div className="form-group">
                  <textarea placeholder="Add question" className="form-control float-label" id=""></textarea>
                </div>
              </li>
              <li>
                <img src="/images/remove.png"/>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </li>
              <li>
                <img src="/images/remove.png"/>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </li>
              <li>
                <img src="/images/remove.png"/>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </li>
            </ul>
          </div>
          <div className="clearfix" />
          <hr/>
          <h2>
            <span className="pull-left popover-search">
              <div className="form-group">
                <input type="text" placeholder="Search here" className="form-control float-label" id=""></input>
              </div>
            </span>
          </h2>
          <div className="clearfix" />
          <div className="col-md-6">
            <ul className="img_upload">
              <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/><span>test text here</span></li>
              <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/><span>test text here</span></li>
              <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/><span>test text here</span></li>
            </ul>
          </div>
          <div className="col-md-6">
            <ul className="img_upload">
              <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/><span>test text here</span></li>
              <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/><span>test text here</span></li>
              <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/><span>test text here</span></li>
            </ul>
          </div>
          <div className="clearfix" />
          <a href="" className="save_btn send-btn">Send </a>
        </div>
      </div>
    )
  }
}
