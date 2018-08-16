/**
 * Created by vishwadeep on 28/7/17.
 */
import React, {Component} from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import "react-responsive-tabs/styles.css";
import {fetchIdeaActionHandler} from "../actions/findUsersHandlers";
import MlLoader from "../../../commons/components/loader/loader";
import MlPortfolio from "../../transaction/portfolio/component/commons/MlPortfolio";

/**
 * Export of Ideator Ideas UI
 * */
export default class MlUsersIdeatorIdeas extends Component {
  constructor(props, context) {
    super(props);
    this.state = {loading: true, userIdeas: [], initialSlide: 1, showWithPortfolioId: false}
    this.fetchIdeas.bind(this)
    return this;
  }

  /**
   * To initialise the swiper
   * */
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
      var GetIdeaId = $(this).attr('name');
      $('.idea_details .portfolio-main-wrap .panel').slideUp();
      $('#' + GetIdeaId).slideDown();
    });
    $('#' + this.state.initialSlide).slideDown();
  }

  componentDidMount() {
    const resp = this.fetchIdeas();
    return resp
  }

  /**
   * @params "portfolioId"
   * Fetching users Ideas
   * */
  async fetchIdeas() {
    let portfolioId = this.props.portfolioId
    const response = await fetchIdeaActionHandler(portfolioId);
    if (response) {
      this.setState({loading: false, userIdeas: response});
    } else {
      toastr.info('Not a valid Idea');
      this.setState({loading: false});
    }
  }

  viewIdea(portfolioId, e) {
    console.log('portfolioId', portfolioId)
    this.setState({showWithPortfolioId: portfolioId})
    $('.swiper-menu').addClass('hide');
  }

  /**
   * UI to be render
   * */
  render() {
    let that = this
    const showLoader = this.state.loading;
    return (
      <div>
        {this.state.showWithPortfolioId === false ? (
          <div className="admin_main_wrap">
            <div className="admin_padding_wrap">
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
                            let url = idea && idea.imageUrl ? idea.imageUrl : '';
                            return (
                              <div className="swiper-slide ideas_block" name={idx}
                                   style={{'backgroundImage': 'url(' + {url} + ')'}} key={idx}>
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
                      <div className="col-lg-12 col-md-12 col-sm-12 portfolio-main-wrap">
                        <div className="panel panel-default" style={{'display': 'block'}}>
                          <a className="mlUpload_btn pull-left">User No Idea Available</a>
                        </div>
                      </div>
                      :
                      <div className="col-lg-12 col-md-12 col-sm-12 portfolio-main-wrap">
                        {this.state.userIdeas.map(function (idea, idx) {
                          return (
                            <div className="panel panel-default panel-form-view" id={idx} style={{'display': 'none'}}
                                 key={idx}>
                              <div className="panel-heading">{idea.title}</div>
                              <div className="panel-body">
                                <p>{idea.description}</p>
                                <a className="mlUpload_btn pull-left"
                                   onClick={that.viewIdea.bind(that, idea.portfolioId)}>View Idea</a>
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
        ) : (<div>{<MlPortfolio viewMode={true} config={this.state.showWithPortfolioId} communityType={"Ideators"} isHideAction={true}/>}</div>)}
      </div>
    )
  }
};
