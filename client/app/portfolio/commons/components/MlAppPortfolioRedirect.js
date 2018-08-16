/**
 * Created by vishwadeep on 11/7/17.
 */
import React from "react";
// import {render} from 'react-dom';
import ScrollArea from 'react-scrollbar';
import 'react-responsive-tabs/styles.css'
import moment from "moment";

export default class MlAppPortfolioRedirect extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {initialSlide: 0}
    return this;
  }

  componentDidMount() {
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

  viewPortfolio(e) {
    let portfolioId = this.props.data.portfolioId;
    let community = this.props.data.communityType;
    FlowRouter.go("/app/portfolio/view/" + portfolioId + "/" + community);
  }

  editPortfolio(e) {
    let portfolioId = this.props.data.portfolioId
    let community = this.props.data.communityType
    FlowRouter.go("/app/portfolio/edit/" + portfolioId + "/" + community);
  }

  render() {
    let that = this
    var data = [this.props.data]
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <h2>Portfolios</h2>
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
                    {data.map(function (pf, idx) {
                      let url = pf && pf.portfolioImage ? pf.portfolioImage : '/images/no_image.png';
                      return (
                        <div className="swiper-slide ideas_block" name={idx}
                             style={{'backgroundImage': 'url(' + url + ')'}} key={idx}>
                          <h3
                            className="rating_xs"> {pf && pf.portfolioUserName ? pf.portfolioUserName : ''}<br/>
                          </h3>
                        </div>
                      )
                    })}
                  </div>
                  <div className="swiper-pagination"></div>
                </div>
              </div>
              <div className="col-md-2"></div>
              <br/>
              <div className="col-lg-12 col-md-12 col-sm-12 portfolio-main-wrap">
                {data.map(function (pf, idx) {
                  return (
                    <div className="panel panel-default panel-form-view" id={idx} style={{'display': 'none'}}
                         key={idx}>
                      <div className="panel-heading">
                        <div className="row">
                          <div className="col-md-6"><b>Portfolio&nbsp; : &nbsp;</b> {pf.portfolioUserName}</div>
                          <div className="col-md-6"><b>Created
                            Date&nbsp; : &nbsp;</b> {pf.transactionCreatedDate ? moment(pf.transactionCreatedDate).format(Meteor.settings.public.dateFormat) : ' '}
                          </div>
                          <hr/>
                          <div className="col-md-6"><b>Community Type&nbsp; : &nbsp;</b> {pf.communityType}</div>
                          <div className="col-md-6"><b>Live
                            Date&nbsp; : &nbsp;</b> {pf.lastLiveDate ? moment(pf.lastLiveDate).format(Meteor.settings.public.dateFormat) : ' '}
                          </div>
                        </div>
                      </div>
                      <div className="panel-body">
                        <a className="mlUpload_btn pull-left"
                           onClick={that.viewPortfolio.bind(that)}>View</a>
                        <a className="mlUpload_btn pull-left"
                           onClick={that.editPortfolio.bind(that)}>Edit</a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    )
  }
}
