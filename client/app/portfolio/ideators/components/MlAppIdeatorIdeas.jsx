import React from 'react';
import {render} from 'react-dom';
import ScrollArea from 'react-scrollbar';
import 'react-responsive-tabs/styles.css'
import {fetchIdeaActionHandler} from '../actions/ideatorActionHandler'
import MlLoader from '../../../../commons/components/loader/loader'
import moment from "moment";

export default class MlAppIdeatorIdeas extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {loading: true, userIdeas: [], initialSlide: 1},
      this.fetchIdeas.bind(this)
    return this;
  }

  componentDidMount() {
    const resp = this.fetchIdeas();
    return resp
  }

  componentDidUpdate() {
    let swiper = new Swiper('.ideas_swiper', {
      pagination: '.swiper-pagination',
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      initialSlide: this.state.initialSlide,
      slidesPerView: 'auto',
      coverflow: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      }
    });
    $('.idea_details .ideas_block').click(function () {
      GetIdeaId = $(this).attr('name');
      $('.idea_details .portfolio-main-wrap .panel').slideUp();
      $('#' + GetIdeaId).slideDown();
    });
    $('#' + this.state.initialSlide).slideDown();
  }

  async fetchIdeas() {
    const response = await fetchIdeaActionHandler();
    if (response) {
      this.setState({loading: false, userIdeas: response});
    } else {
      this.setState({loading: false});
    }
  }

  viewIdea(portfolioId, community, e) {
    FlowRouter.go("/app/portfolio/view/" + portfolioId + "/" + community);
  }

  editIdea(portfolioId, community, e) {
    FlowRouter.go("/app/portfolio/edit/" + portfolioId + "/" + community);
  }

  addNewIdea(e) {
    FlowRouter.go('/app/portfolio/addIdea');
  }

  render() {
    let that = this
    const showLoader = this.state.loading;
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <h2>Ideas</h2>
          {showLoader === true ? (<MlLoader/>) : (
            <div className="main_wrap_scroll idea_details">
              <ScrollArea
                speed={0.8}
                className="main_wrap_scroll"
                smoothScrolling={true}
                default={true}
              >
                <div className="col-md-2"></div>
                <div className="col-md-8">
                  <div className="swiper-container ideas_swiper">
                    <div className="swiper-wrapper">
                      {this.state.userIdeas.map(function (idea, idx) {
                        let url = idea && idea.ideaImage && idea.ideaImage.fileUrl ? idea.ideaImage.fileUrl : '/images/no_image.png';
                        return (
                          <div className="swiper-slide ideas_block" name={idx}
                               style={{'backgroundImage': 'url(' + url + ')'}} key={idx}>
                            <h3 className="rating_xs"> {idea && idea.title ? idea.title : ''}<br/></h3>
                          </div>
                        )
                      })}
                    </div>
                    <div className="swiper-pagination"></div>
                  </div>
                </div>
                <div className="col-md-2"></div>
                <br/>
                {(!this.state.userIdeas || this.state.userIdeas.length < 1) ?
                  <div className="col-md-offset-3 col-md-6 col-sm-6 col-xs-6 new-ideas">
                    <div className="col-md-4">
                      <img src="/images/ideas2.png"/>
                    </div>
                    <div className="col-md-8 text-center">
                      <h3>Get Started with your ideas and grow your wings</h3>
                      <p>Build your ideas on <span className="m_red">m</span><span className="m_yellow">oo</span><span
                        className="m_red">lya</span>
                      </p>
                      <a href="" className="ideabtn" onClick={this.addNewIdea.bind(this)}>Click to pen your ideas</a>
                    </div>
                  </div>
                  :
                  <div className="col-lg-12 col-md-12 col-sm-12 portfolio-main-wrap">
                    {this.state.userIdeas.map(function (idea, idx) {
                      return (
                        <div className="panel panel-default panel-form-view" id={idx} style={{'display': 'none'}}
                             key={idx}>
                          <div className="panel-heading">
                            <div className="row">
                              <div className="col-md-6"><b>Portfolio&nbsp; : &nbsp;</b> {idea.title}</div>
                              <div className="col-md-6"><b>Created
                                Date&nbsp; : &nbsp;</b> {idea.createdAt ? moment(idea.createdAt).format(Meteor.settings.public.dateFormat) : ' '}
                              </div>
                              <hr/>
                              <div className="col-md-6"><b>Type&nbsp; : &nbsp;</b> Basic</div>
                              <div className="col-md-6"><b>Live
                                Date&nbsp; : &nbsp;</b> {idea.updatedAt ? moment(idea.updatedAt).format(Meteor.settings.public.dateFormat) : ' '}
                              </div>
                            </div>
                          </div>
                          <div className="panel-body">
                            <p>{idea.ideaDescription}</p>
                            <a className="mlUpload_btn pull-left"
                               onClick={that.viewIdea.bind(that, idea.portfolioId, "Ideators")}>View</a>
                            <a className="mlUpload_btn pull-left"
                               onClick={that.editIdea.bind(that, idea.portfolioId, "Ideators")}>Edit</a>
                            <a className="mlUpload_btn pull-left" onClick={that.addNewIdea.bind(that)}>Add New Idea</a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                }
              </ScrollArea>
            </div>)}
        </div>
      </div>
    )
  }
};
