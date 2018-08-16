import React from "react";
import {render} from "react-dom";
import StarRatings from '../../../app/commons/components/StarRatings';
import {reviewActionHandler,fetchReviewsActionHandler} from "../actions/reviewActionHandler";
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath'
var FontAwesome = require('react-fontawesome');
import moment from "moment";
export default class Review extends React.Component {

  constructor(props) {
    super(props);
    this.state={reviewRating:0,reviews:[],viewType:'view','selectedReview':{}};
    this.reviewHandler.bind(this);
    this.fetchReviews.bind(this);
    this.toggleView.bind(this);
    return this;
  }

  async componentWillMount(){
    await this.fetchReviews();
  }

  async reviewHandler(){
    var resourceDetails=this.props.data||{};
    var message=this.refs.message.value&&this.refs.message.value.trim()!==""?this.refs.message.value.trim():null;
    var response=await reviewActionHandler({'resourceId':resourceDetails.resourceId,'resourceType':resourceDetails.resourceType,'message':message,
                                            'rating':this.state.reviewRating||0 });

    if(response&&response.success){
      toastr.success("Your review has been sent successfully");
      this.setState({"viewType":"view","reviewRating":0});
      this.fetchReviews();
    }else{
      if(response&&!response.success&&response.code===401){
        toastr.error(response.result);
      }else{
        toastr.error("Your review could not be submitted");
      }
    }
    //this.props.toggle();
  }

  async onRatingsChange(rating){
    console.log(rating);
    this.setState({reviewRating:rating});
  }

  async fetchReviews(){
    var resourceDetails=this.props.data||{};
    var reviews=await fetchReviewsActionHandler({resourceId:resourceDetails.resourceId,resourceType:resourceDetails.resourceType,cursor:''});
    this.setState({reviews:reviews});
  }

  toggleView(viewType,review){
    if(viewType==='viewDetails')this.setState({viewType:viewType||"view",'selectedReview':review});
    this.setState({viewType:viewType||"view"});
  }

  isEllipseRequired(message){
    let msg=message?message.trim():"";
    let defaultLength=30;
    if(msg.length>defaultLength) return true;
    return false;
  }

  applyEllipse(message){
    let defaultLength=30;
    let msg=message||"";
    msg=msg.substring(0,defaultLength)+"...";
    return msg;
  }

  render() {
     var that=this;
    return (
      <div className="footer_popover pop_review">
          {this.state.viewType==="create"&&
            <div className="text-left create_review rating_xs">
          <div className="form-group">
            <label>Rating</label>
            <div className="clearfix"/>
            <StarRatings onRatingsChange={this.onRatingsChange.bind(this)} initialRate={this.state.reviewRating}/>
          </div>
          <div className="form-group">
            <textarea ref="message" placeholder="Comments" defaultValue="" className="form-control float-label" id=""></textarea>
          </div>
          <div className="ml_btn">
            <a href="" className="save_btn" onClick={this.reviewHandler.bind(this)}>Submit</a>
            <a href="" className="cancel_btn rev_cancel" onClick={this.toggleView.bind(this,"view")}>Cancel</a>
          </div></div>}

        {this.state.viewType==="view"&&<div>
             <ul className="review_pop main_review text-left">
               {this.state.reviews.map(function(review,id){
               return (<li className="click_full" key={id}>
                 <div className="media">
                   <div className="media-left media-top">
                     <img src={review&&review.userProfileImage?generateAbsolutePath(review.userProfileImage):"/images/img2.png"} className="media-object" />
                   </div>
                   <div className="media-body rating_xs">
                     <h4 className="media-heading">{review.userName}<span>{review.createdOn&& moment(review.createdOn).format(Meteor.settings.public.dateFormat)}</span></h4>
                     <StarRatings initialRate={review.rating||0} readonly={true} /><div className="clearfix" />
                     {that.isEllipseRequired(review.message)?<p onClick={that.toggleView.bind(that,'viewDetails',review)}>{that.applyEllipse(review.message)}</p>:<p>{review.message}</p>}
                   </div>
                 </div>
               </li>)})}
               <span className="add_review rounded_btn" onClick={this.toggleView.bind(this,"create")}><FontAwesome name='pencil' /></span>
             </ul>
             </div>}

        {this.state.viewType==="viewDetails"&&<div>
          <ul className="review_pop main_review text-left">
            <li className="click_full">
                <div className="media">
                  <div className="media-left media-top">
                    <img src={this.state.selectedReview&&this.state.selectedReview.userProfileImage?generateAbsolutePath(this.state.selectedReview.userProfileImage):"/images/img2.png"} className="media-object" />
                  </div>
                  <div className="media-body rating_xs">
                    <h4 className="media-heading">{this.state.selectedReview.userName}<span>{this.state.selectedReview.createdOn&& moment(this.state.selectedReview.createdOn).format(Meteor.settings.public.dateFormat)}</span></h4>
                    <StarRatings initialRate={this.state.selectedReview.rating||0} readonly={true} /><div className="clearfix" />
                    <p>{this.state.selectedReview.message}</p>
                  </div>
                  <span className="close_full rounded_btn" onClick={this.toggleView.bind(this,'view')}><span aria-hidden="true" className="fa fa-times"></span></span>
                </div>
              </li>
          </ul>
        </div>}
      </div>
    );
  }

}
