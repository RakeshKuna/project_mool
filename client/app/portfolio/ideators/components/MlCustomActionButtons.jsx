import React from "react";
import {render} from "react-dom";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
var FontAwesome = require('react-fontawesome');
import StarRatings from '../../../commons/components/StarRatings';
import {fetchIdeaActionHandler} from '../actions/ideatorActionHandler'
import MlLoader from '../../../../commons/components/loader/loader'

/**
 * Note: This file seems to be used no where
 * need to check the dependency and remmove it
* */
export default class MlCustomActionButtons extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // popoverOpen_pop_connect: false
      loading:true,
    };
    this.actionClick.bind(this);
    this.fetchIdeatorIdeas.bind(this)
    return this;
  }

  actionClick(value, e) {
    // $('.overlay').toggle();
    let icon = "popoverOpen_"+value;
    this.setState({
        [icon]: !(this.state[icon])
      }
      //, function () {
      // if(this.state[icon]){
      //   $('.overlay').show();
      // }else{
      //   $('.overlay').hide();
      // }
      // }
    );
  }

  cancelClick(value, e){
    // $('.overlay').hide();
    let icon = "popoverOpen_"+value;
    this.setState({
      [icon]: false
    });

  }
  // componentWillUpdate(nextProps, nextState){
  //   let state = this.state
  //     for (var propName in nextState) {
  //       if (nextState[propName] != state[propName]) {
  //         this.setState({propName: false})
  //       }
  //     }
  // }


  componentDidMount() {
    // $('.actions-button').click(function () {
    //   $(this).toggleClass('open');
    //   $('.action-buttons').toggle();
    //   $('.related-buttons').hide();
    // });
    // $('.related-button').click(function () {
    //   $(this).toggleClass('open');
    //   $('.action-buttons').hide(200);
    //   $('.related-buttons').toggle();
    // });
  }
  componentWillMount(){
    this.fetchIdeatorIdeas();
  }
  async fetchIdeatorIdeas() {
    const response = await fetchIdeaActionHandler();
    if(response){
      this.setState({loading:false, ideas:response})
    }
  }

  selectedIdea(ideaId, portfolioId, e){
    FlowRouter.go('/app/ideator/'+portfolioId);
  }

  render() {
    let that = this;
    const showLoader = this.state.loading;
    return (
      <div className="admin_padding_wrap">
        {showLoader === true ? (<MlLoader/>) : (
      <div>
        <div className="opacity"></div>
        <div className="panel-group bottom-buttons" id="accordion">
          <div className="panel">
            <div className="panel-heading clearfix">
              <h4 className="panel-title text-left">
                <a className="re-btn" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Related</a>
                <a className="act-btn" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Action</a>
                <a className="re-btn" data-toggle="collapse" data-parent="#accordion" href="#collapseThree">All Ideas</a>
              </h4>
            </div>
            <div id="collapseOne" className="panel-collapse collapse" style={{'background': '#273545'}}>

              <div className="related_buttons">
                <ul>
                  <li><a href=""><span className="ml flaticon-ml-handshake"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml ml-calls"></span><br />Connect</a></li>
                </ul>
              </div>

            </div>
            <div id="collapseTwo" className="panel-collapse collapse" style={{'background': '#ef4647'}}>

              <div className="action_buttons">
                <ul>
                  <li><a href="" id="pop_connect" onClick={this.actionClick.bind(this, "pop_connect")}><span
                    className="ml flaticon-ml-handshake"></span><br />Connect</a></li>
                  <li><a href=""><span className="ml my-ml-favourites"></span><br />Favorites</a></li>
                  <li><a href="" id="pop_inquiry" onClick={this.actionClick.bind(this, "pop_inquiry")}><span
                    className="ml flaticon-ml-support"></span><br />Inquiry</a></li>
                  <li><a href="" id="pop_review" onClick={this.actionClick.bind(this, "pop_review")}><span
                    className="ml flaticon-ml-note"></span><br />Review</a></li>
                  <li><a href=""><span className="ml my-ml-mywishlist"></span><br />Wishlist</a></li>
                  <li><a href=""><span className="ml flaticon-ml-cloud-computing"></span><br />Upload</a></li>
                  <li><a href=""><span className="ml flaticon-ml-cloud-computing-1"></span><br />Download</a></li>
                  <li><a href=""><span className="ml flaticon-ml-share-arrow"></span><br />Share</a></li>
                  <li><a href=""><span className="ml flaticon-ml-share-files"></span><br />Compare</a></li>
                  <li><a href="" id="pop_conersation" onClick={this.actionClick.bind(this, "pop_conersation")}><span
                    className="ml flaticon-ml-chat"></span><br />Conversation</a></li>
                  <li><a href="" id="pop_collaborate" onClick={this.actionClick.bind(this, "pop_collaborate")}><span
                    className="ml flaticon-ml-networking"></span><br />Collaborate</a></li>
                  <li><a href=""><span className="ml flaticon-ml-note-1"></span><br />Feedback</a></li>
                </ul>

              </div>

            </div>
            <div id="collapseThree" className="panel-collapse collapse" style={{'background': '#273545'}}>

              <div className="related_buttons">
                <ul>
                  {that.state.ideas.map(function (idea, idx) {
                    return(
                      <li onClick={that.selectedIdea.bind(that, idea._id, idea.portfolioId)} key={idx}><a href=""><span className="ml flaticon-ml-handshake"></span><br />{idea.title}</a></li>
                    )
                  })}
                </ul>
              </div>

            </div>
          </div>
        </div>

        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_collaborate} target="pop_collaborate"
                 toggle={this.toggle}>
          <PopoverTitle>Collaborate</PopoverTitle>
          <PopoverContent>Do you want to collaborate ?
            <div className="ml_btn">
              <a href="" className="save_btn">Yes</a>
              <a href="" className="cancel_btn" onClick={this.cancelClick.bind(this, 'pop_collaborate')}>No</a>
            </div>
          </PopoverContent>
        </Popover>

        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_review} target="pop_review"
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

        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_connect} target="pop_connect"
                 toggle={this.toggle}>
          <PopoverTitle>Connect</PopoverTitle>
          <PopoverContent>
            Do you want to connect ?
            <div className="ml_btn">
              <a href="" className="save_btn">Connect</a>
              <a href="" className="cancel_btn" onClick={this.cancelClick.bind(this, 'pop_connect')}>Cancel</a>
            </div>
          </PopoverContent>
        </Popover>

        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_conersation} target="pop_conersation"
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


        <Popover placement="top" className="footer_popover" isOpen={this.state.popoverOpen_pop_inquiry} target="pop_inquiry"
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
      </div>)}
      </div>
    )
  }
};
