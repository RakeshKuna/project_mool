/**
 * Created by vishwadeep on 12/5/17.
 */
import React from "react";
import {render} from "react-dom";
var Select = require('react-select');
var options = [
  {value: 'role', label: 'User Type 1'},
  {value: 'role', label: 'User Type 2'}
];
function logChange(val) {
  console.log("Selected: " + val);
}


export default class MlAppOfficeMembersDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, data: {}};
    this.findMyOffice.bind(this);
    return this;
  }

  componentDidMount() {
    $(function () {
      $('.float-label').jvFloat();
    });

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
      startAt: 0,
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
    const resp = this.findMyOffice();
    return resp;
  }

  async findMyOffice() {
    let myOfficeId = this.props.config
    // const response = await findOfficeActionHandler(myOfficeId);
    // this.setState({loading:false,data:response});
    console.log(myOfficeId)
  }

  addNewSpokePerson() {
    FlowRouter.go('/app/newSpokePerson')
  }

  render() {
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap portfolio-main-wrap">
          <div className="col-lg-12">
            <div className="row">

              <div className="top_block_scroller" id="forcecentered">
                <ul>
                  <li>
                    <a onClick={this.addNewSpokePerson.bind(this)}>
                      <div className="team-block details-add-block">
                        <h2>Bespoke Member</h2>
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
            <div className="office-members-detail">

              <div className="form_inner_block">
                <div className="add_form_block"><img src="/images/add.png"/></div>
                <div className="col-lg-2 col-md-2 col-sm-3">
                  <div className="team-block marb0"><img src="/images/img2.png"/></div>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-9">
                  <div className="row">
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="First Name" className="form-control float-label"/>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="Last Name" className="form-control float-label"/>
                    </div>

                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="Mobile Number" className="form-control float-label"/>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="Email Id" className="form-control float-label"/>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <Select name="form-field-name" options={options} value='Select User Type' onChange={logChange}/>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <textarea rows="1" placeholder="About" className="form-control float-label"></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form_inner_block">
                <div className="add_form_block"><img src="/images/remove.png"/></div>
                <div className="col-lg-2 col-md-2 col-sm-3">
                  <div className="team-block marb0"><img src="/images/img2.png"/></div>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-9">
                  <div className="row">
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="First Name" className="form-control float-label"/>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="Last Name" className="form-control float-label"/>
                    </div>

                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="Mobile Number" className="form-control float-label"/>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <input type="text" placeholder="Email Id" className="form-control float-label"/>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <Select name="form-field-name" options={options} value='Select User Type' onChange={logChange}/>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6">
                      <textarea rows="1" placeholder="About" className="form-control float-label"></textarea>
                    </div>
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
