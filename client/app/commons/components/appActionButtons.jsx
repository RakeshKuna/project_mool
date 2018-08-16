import React from "react";
import {render} from "react-dom";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import _ from "lodash";
import StarRatings from "./StarRatings";
var FontAwesome = require('react-fontawesome');


export default class AppActionButtons extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // popoverOpen_pop_connect: false
    };
    this.actionClick.bind(this);
    return this;
  }

  actionClick(value, e) {
    let icon = "popoverOpen_" + value;
    this.setState({
      [icon]: !(this.state[icon])
    })
  }

  cancelClick(value, e) {
    let icon = "popoverOpen_" + value;
    this.setState({
      [icon]: false
    })
  }

  connectRequest(){
    toastr.success("Connect request");
  }

  render() {
    let config = [
      {
        actionName: 'feedback',
        iconClass: 'ml flaticon-ml-note-1'
      },
      {
        actionName: 'Compare',
        iconClass: 'ml flaticon-ml-share-files'
      },
      {
        actionName: 'Share',
        iconClass: 'ml my-ml-share'
      },
      {
        actionName: 'Download',
        iconClass: 'ml flaticon-ml-cloud-computing-1'
      },
      {
        actionName: 'uplaod',
        iconClass: 'ml flaticon-ml-cloud-computing'
      },
      {
        actionName: 'Wishlist',
        iconClass: 'ml my-ml-wishlist'
      },
      {
        actionName: 'Favorites',
        iconName: 'ml my-ml-favourites'
      },
      {
        actionName: 'edit',
        iconClass: 'ml ml-edit'
      },
      {
        actionName: 'save',
        iconClass: 'ml ml-save'
      },
      {
        actionName: 'golive',
        iconClass: 'ml ml-save'
      }
    ]
    let ActionOptions= this.props.ActionOptions|| []
    let actionView = ActionOptions.map(function (option, id) {
      let activeClass = '';
      let action = _.find(config, {'actionName': option.actionName});
      for (let i = 0; i < config.length; i++) {
        console.log("success action")
        if (config[i].actionName == option.actionName && option.showAction == true) {
          activeClass = ""
        } else if (config[i].actionName == option.actionName && option.showAction != true) {
          activeClass = "hide"
        }
      }
      return (
        <li key={id} className={activeClass}>
          <a href="" onClick={option.handler && option.handler.bind(this, option)}> <span
            className={action['iconClass']}></span>
            <br />{option.actionName}</a>
        </li>
      )
    })
    return (
      <div>
        <div className="opacity"></div>
        <div className="panel-group bottom-buttons" id="accordion">
          <div className="panel">
            <div className="panel-heading clearfix">
              <h4 className="panel-title text-left">
                <a className="re-btn" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Related</a>
                <a className="act-btn" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Action</a>
              </h4>
            </div>
            <div id="collapseOne" className="panel-collapse collapse" style={{'background': '#273545'}}>

              <div className="related_buttons">
                <ul>
                  <li><a href=""><span className="ml flaticon-ml-handshake"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                </ul>
              </div>
            </div>

            <div id="collapseTwo" className="panel-collapse collapse appCommentBox" style={{'background': '#ef4647'}}>
              <div className="action_buttons">
                <ul>
                  <li><a href="" id="pop_connect"
                         onClick={this.actionClick.bind(this, "pop_connect")}>
                    <span className="ml flaticon-ml-handshake">
                    </span><br />Connect</a></li>
                  <li><a href="" id="pop_inquiry" onClick={this.actionClick.bind(this, "pop_inquiry")}>
                    <span className="ml flaticon-ml-support">
                    </span><br />Inquiry</a></li>
                  <li><a href="" id="pop_review" onClick={this.actionClick.bind(this, "pop_review")}>
                    <span className="ml flaticon-ml-note">
                    </span><br />Review</a></li>
                  <li><a href="" id="pop_conersation" onClick={this.actionClick.bind(this, "pop_conersation")}>
                    <span className="ml flaticon-ml-chat">
                    </span><br />Conversation</a></li>
                  <li><a href="" id="pop_collaborate" onClick={this.actionClick.bind(this, "pop_collaborate")}>
                    <span className="ml flaticon-ml-networking">
                    </span><br />Collaborate</a></li>
                  <li><a href="" id="Popover1">
                    <span className="ml flaticon-ml-networking">
                    </span><br />Comment</a></li>
                  {actionView}
                </ul>
              </div>
            </div>

          </div>
        </div>

        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_collaborate}
                 target="pop_collaborate"
                 toggle={this.toggle}>
          <PopoverTitle>Collaborate</PopoverTitle>
          <PopoverContent>Do you want to collaborate ?
            <div className="ml_btn">
              <a href="" className="save_btn">Yes</a>
              <a href="" className="cancel_btn" onClick={this.cancelClick.bind(this, 'pop_collaborate')}>No</a>
            </div>
          </PopoverContent>
        </Popover>

        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_review}
                 target="pop_review"
                 toggle={this.toggle}>
          <PopoverTitle>Reviews</PopoverTitle>
          <PopoverContent>
            <ul className="review_pop">
              <li>
                <div className="media">
                  <div className="media-left media-top">
                    <img src="/images/p_6.jpg" className="media-object"/>
                  </div>
                  <div className="media-body rating_xs">
                    <h4 className="media-heading">Media Top <span>27/03/2017, 08:10:15</span></h4>
                    <StarRatings/>
                    <p>Lorem ipsum...</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="media">
                  <div className="media-left media-top">
                    <img src="/images/p_6.jpg" className="media-object"/>
                  </div>
                  <div className="media-body rating_xs">
                    <h4 className="media-heading">Media Top <span>27/03/2017, 08:10:15</span></h4>
                    <StarRatings/>
                    <p>Lorem ipsum...</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="media">
                  <div className="media-left media-top">
                    <img src="/images/p_6.jpg" className="media-object"/>
                  </div>
                  <div className="media-body rating_xs">
                    <h4 className="media-heading">Media Top <span>27/03/2017, 08:10:15</span></h4>
                    <StarRatings/>
                    <p>Lorem ipsum...</p>
                  </div>
                </div>
              </li>
            </ul>
          </PopoverContent>
        </Popover>

        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_connect}
                 target="pop_connect"
                 toggle={this.toggle}>
          <PopoverTitle>Connect</PopoverTitle>
          <PopoverContent>
            Do you want to connect ?
            <div className="ml_btn">
              <a href="" className="save_btn" onClick={this.connectRequest.bind(this)}>Connect</a>
              <a href="" className="cancel_btn" onClick={this.cancelClick.bind(this, 'pop_connect')}>Cancel</a>
            </div>
          </PopoverContent>
        </Popover>

        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_conersation}
                 target="pop_conersation"
                 toggle={this.toggle}>
          <PopoverTitle>Connect</PopoverTitle>
          <PopoverContent>
            <ul className="list_style">
              <li>
                <a href="">
                  <FontAwesome name='envelope-o'/><br />
                  Mail
                </a>
              </li>
              <li>
                <a href="">
                  <FontAwesome name='comment-o'/><br />
                  Chat
                </a>
              </li>
              <li>
                <a href="">
                  <FontAwesome name='video-camera'/><br />
                  Video
                </a>
              </li>
              <li>
                <a href="">
                  <FontAwesome name='volume-up'/><br />
                  Audio
                </a>
              </li>
              <li>
                <a href="">
                  <FontAwesome name='mobile'/><br />
                  SMS
                </a>
              </li>
              <li>
                <a href="">
                  <FontAwesome name='phone'/><br />
                  Call
                </a>
              </li>
            </ul>
          </PopoverContent>
        </Popover>


        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_inquiry}
                 target="pop_inquiry"
                 toggle={this.toggle}>
          <PopoverTitle>Inquiry</PopoverTitle>
          <PopoverContent>
            <div className="form-group">
              <input type="text" placeholder="To" defaultValue="admin@moolya.in"
                     className="form-control float-label"/>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" defaultValue="Inquiry" className="form-control float-label"/>
            </div>
            <div className="form-group">
              <textarea placeholder="Subject" defaultValue="Inquiry" className="form-control float-label"></textarea>
            </div>
            <div className="ml_btn">
              <a href="" className="save_btn">Send</a>
              <a href="" className="cancel_btn" onClick={this.cancelClick.bind(this, 'pop_inquiry')}>Cancel</a>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }
};
