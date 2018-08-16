/**
 * Created by pankaj on 7/6/17.
 */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ScrollArea from 'react-scrollbar';
var Select = require('react-select');
var FontAwesome = require('react-fontawesome');




export default class MlUpgradeOffice extends React.Component{
  componentDidMount()
  {
    $(function() {
      $('.float-label').jvFloat();
    });
    $('.list_block').click(function(){
      $('#details-div').show();
      $('.requested_input').hide();
      var $frame = $('#forcecentered');
      var $wrap  = $frame.parent();

      // Call Sly on frame
      $frame.sly({
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt:0,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,

      });
    });


  }
  render(){
    return (
      <div>

        <div className="requested_input main_wrap_scroll">

          <ScrollArea
            speed={0.8}
            className="main_wrap_scroll"
            smoothScrolling={true}
            default={true}
          >
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-4">
                  <a href="" id="create_client" data-placement="top" data-class="large_popover" >
                    <div className="list_block notrans">
                      <div className="hex_outer"><span className="ml ml-plus "></span></div>
                      <h3>Bespoke Members</h3>
                    </div>
                  </a>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4">
                  <div className="list_block notrans funding_list">
                    <div><p className="fund">10 Members</p><span>Principal(s): 2</span><span>Team Size: 2</span><span>(Limited Communities)</span></div>
                    <h3>Basic Office</h3>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4">
                  <div className="list_block notrans funding_list">
                    <div><p className="fund">15 Members</p><span>Principal(s): 2</span><span>Team Size: 13</span><span>(All Communities)</span></div>
                    <h3>Advance Office</h3>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4">
                  <div className="list_block notrans funding_list">
                    <div><p className="fund">20 Members</p><span>Principal(s): 5</span><span>Team Size: 15</span><span>(All Communities)</span></div>
                    <h3>Pro Office</h3>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4">
                  <div className="list_block notrans funding_list">
                    <div><p className="fund">10 Members</p><span>Principal(s): 2</span><span>Team Size: 2</span><span>(Limited Communities)</span></div>
                    <h3>Basic Office</h3>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4">
                  <div className="list_block notrans funding_list">
                    <div><p className="fund">15 Members</p><span>Principal(s): 2</span><span>Team Size: 13</span><span>(All Communities)</span></div>
                    <h3>Advance Office</h3>
                  </div>
                </div>


              </div>
            </div>

          </ScrollArea>






        </div>
        <div id="details-div" style={{'display':'none'}}>
          <div className="col-lg-12">
            <div className="row">

              <div className="top_block_scroller" id="forcecentered">
                <ul>
                  <li>
                    <a href="appMyProfileAddNewSubscription">
                      <div className="team-block details-add-block">
                        <h2>Bespoke Memb</h2>
                        <span className="ml ml-plus "></span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="team-block">
                      <h2>Basic Office</h2>
                      <h3>
                        <p className="fund">10 Mem</p><p>Principal : 2</p><p>Team : 2</p>
                      </h3>
                    </div>
                  </li>
                  <li>
                    <div className="team-block">
                      <h2>Advance Office</h2>
                      <h3>
                        <p className="fund">15 Mem</p><p>Principal : 2</p><p>Team : 13</p>
                      </h3>
                    </div>
                  </li>
                  <li>
                    <div className="team-block">
                      <h2>Pro Office</h2>
                      <h3>
                        <p className="fund">20 Mem</p><p>Principal : 5</p><p>Team : 15</p>
                      </h3>
                    </div>
                  </li>
                  <li>
                    <div className="team-block">
                      <h2>Basic Office</h2>
                      <h3>
                        <p className="fund">10 Mem</p><p>Principal : 2</p><p>Team : 2</p>
                      </h3>
                    </div>
                  </li>
                  <li>
                    <div className="team-block">
                      <h2>Advance Office</h2>
                      <h3>
                        <p className="fund">15 Mem</p><p>Principal : 2</p><p>Team : 13</p>
                      </h3>
                    </div>
                  </li>

                </ul>
              </div>


            </div>

          </div>

          <div className="col-lg-12">
            <div className="row">
              <div className="investement-view-content">


                <div className="col-md-6">
                  <div className="form_bg">
                    <form>
                      <div className="panel panel-default">
                        <div className="panel-heading"> Subscription: Basic Office </div>

                        <div className="panel-body">
                          <div className="col-lg-6 col-md-6 col-sm-12 nopadding-left">
                            <p>Total Users: 10</p>
                          </div>
                          <div className="clearfix"></div>
                          <div className="col-lg-6 col-md-6 col-sm-12 nopadding-left">
                            <p>Principal Users: 2</p>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 nopadding-right">
                            <p>Team Users: 8</p>
                          </div>

                        </div>
                      </div>

                      <div className="panel panel-default mart20">
                        <div className="panel-heading"> User Type </div>

                        <div className="panel-body">
                          <div className="col-lg-4 col-md-4 col-sm-4">
                            <div className="team-block marb0">
                              <span className="ml ml-moolya-symbol"></span>
                              <h3>
                                Office Bearer
                              </h3>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-4">
                            <div className="team-block marb0">
                              <span className="ml ml-moolya-symbol"></span>
                              <h3>
                                Service Provider
                              </h3>
                            </div>
                          </div>

                        </div>
                      </div>
                      <div className="clearfix"></div>
                      <div className="form-group">
                        <textarea rows="4" placeholder="About" className="form-control float-label" id=""></textarea>

                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-6">


                  <div className="form_bg">
                    <form>

                      <div className="form-group">
                        <input type="text" placeholder="Branch Type" className="form-control float-label" id="cluster_name" />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Office Location" className="form-control float-label" id="cluster_name"/>
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="Street No/Locality" className="form-control float-label" id="cluster_name"/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Landmark" className="form-control float-label" id="cluster_name" />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Area" className="form-control float-label" id="cluster_name" />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Town/City" className="form-control float-label" id="cluster_name"/>
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="State" className="form-control float-label" id="cluster_name"/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Country" className="form-control float-label" id="cluster_name" />
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="Zip Code" className="form-control float-label" id="cluster_name" />
                      </div>
                      <div className="form-group">
                        <a href="/app/appMyProfileAddOfficeMembersDetail" className="mlUpload_btn">Next</a> <a href="" className="mlUpload_btn">Cancel</a>
                      </div>
                    </form>
                  </div>

                </div>



              </div>
            </div>
          </div>


        </div>
      </div>
    )
  }
};
