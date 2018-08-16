/**
 * Created by vishwadeep on 12/5/17.
 */
import React from "react";
// import ScrollArea from "react-scrollbar";
import { Scrollbars } from 'react-custom-scrollbars';
import MlAppNewBSpokeOffice from "./MlAppNewBSpokeOffice";
import MlAppBSpokeOfficeDetails from "./MlAppBSpokeOfficeDetails";
import {fetchOfficePackages} from "../actions/findOfficeAction";

export default class MlAppAddOffice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showNewSpokePerson: true, data: []};;
    this.showNewSpokePerson = this.showNewSpokePerson.bind(this)
    return this;
  }

  initializeMount(index) {
    $('#details-div').show();
    $('.requested_input').hide();
    var $frame = $('#forcecentered');
    var $wrap = $frame.parent();

    // Call Sly on frame
    $frame.sly({
      horizontal: 1,
      itemNav: 'forceCentered',
      smart: 1,
      activateOn: 'click',
      mouseDragging: 1,
      touchDragging: 1,
      releaseSwing: 1,
      startAt: index ? index+1 : 0,
      scrollBar: $wrap.find('.scrollbar'),
      scrollBy: 1,
      speed: 300,
      elasticBounds: 1,
      easing: 'easeOutExpo',
      dragHandle: 1,
      dynamicHandle: 1,
      clickBar: 1,
    });
  }

  componentWillMount() {
    const resp = this.getUserPackages()
    return resp
  }

  async getUserPackages() {
    var response = await fetchOfficePackages()
    this.setState({data: response})
  }

  nextDetailPage() {
    FlowRouter.go('/app/officeMembersDetails');
  }

  showNewSpokePerson() {
    this.initializeMount()
    this.setState({showNewSpokePerson: true})
  }

  showDetails(value, index, event) {
    this.initializeMount(index);
    console.log(value)
    this.detailData = value;
    this.setState({showNewSpokePerson: false})
  }

  render() {
    let that = this
    let isShowNewSpoke = this.state.showNewSpokePerson ? true : false
    const data = this.state.data && this.state.data.length > 0 ? this.state.data : []
    const list = data.map(function (value, idx) {
      return (
        <div className="col-lg-2 col-md-4 col-sm-4" onClick={that.showDetails.bind(that, value, idx)} key={idx}>
          <div className="list_block notrans funding_list">
            <div><p className="fund">{value.totalCount} Members</p>
              <span>Principal: {value.principalUserCount}</span><span>Team: {value.teamUserCount}</span><span>(Limited Community)</span>
            </div>
            <h3>{value.serviceCardName}</h3>
          </div>
        </div>
      )
    })
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap portfolio-main-wrap main_wrap_scroll">
          <Scrollbars
            speed={0.8}
            className="main_wrap_scroll"
            smoothScrolling={true}
            default={true}
          >
            <div className="requested_input">

              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-2 col-md-4 col-sm-4" onClick={this.showNewSpokePerson}>
                    <div className="list_block notrans">
                      <div className="hex_outer"><span className="ml ml-plus "></span></div>
                      <h3>Add Bespoke Office</h3>
                    </div>
                  </div>

                  {list}

                </div>
              </div>
            </div>


            {/**
             *if onces Options are clicked UI
             * */}
            <div id="details-div" style={{'display': 'none'}}>
              <div className="col-lg-12">
                <div className="row">

                  <div className="top_block_scroller" id="forcecentered">
                    <ul>
                      <li>
                        <a onClick={this.showNewSpokePerson}>
                          <div className="team-block details-add-block">
                            <h2>Bespoke Office</h2>
                            <span className="ml ml-plus "></span>
                          </div>
                        </a>
                      </li>
                      {this.state.data.map(function (item, say) {
                        return (
                          <li key={say}>
                            <div className="team-block" onClick={that.showDetails.bind(that, item, say)}>
                              <h2>{item.serviceCardName}</h2>
                              <h3>
                                <p className="fund">{item.totalCount} Mem</p><p>Principal
                                : {item.principalUserCount}</p><p>Team : {item.teamUserCount}</p>
                              </h3>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              {isShowNewSpoke ? <MlAppNewBSpokeOffice/> : <MlAppBSpokeOfficeDetails officeData={this.detailData}/>}

            </div>
          </Scrollbars>
        </div>
      </div>
    )
  }
};

//onClick={this.nextDetailPage.bind(this)}
