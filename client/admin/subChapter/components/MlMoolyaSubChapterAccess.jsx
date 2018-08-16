import React from "react";
import {render} from "react-dom";
var FontAwesome = require('react-fontawesome');

export default class MlMoolyaSubChapterAccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type: "externalUser",
      backendUser:{},
      externalUser:{}
    };
    // this.onStatusChangeCanSearchB = this.onStatusChangeCanSearchB.bind(this);
    // this.onStatusChangeCanViewB = this.onStatusChangeCanViewB.bind(this);
    // this.onStatusChangeCanTransactB = this.onStatusChangeCanTransactB.bind(this);
    this.onStatusChangeCanSearchE = this.onStatusChangeCanSearchE.bind(this);
    this.onStatusChangeCanViewE = this.onStatusChangeCanViewE.bind(this);
    this.onStatusChangeCanTransactE = this.onStatusChangeCanTransactE.bind(this);
    this.getSelectedTab = this.getSelectedTab.bind(this);
    return this;
  }

  getToggleStatus(state){
    let details = {};
    if(this.state.type == "backendUser"){
      details = {backendUser:state}
    }else if(this.state.type == "externalUser"){
      details = {externalUser:state}
    }
    // this.props.userTypeAccess(details);
    this.props.getMoolyaAccessStatus(details);
  }

  componentWillMount() {
    // if(this.props.assignedDetails && this.props.assignedDetails.backendUser){
    //   let backendUserState = this.props.assignedDetails.backendUser;
    //   this.setState({backendUser:backendUserState})
    // }
    if(this.props.assignedDetails && this.props.assignedDetails.externalUser) {
      let externalUserState = this.props.assignedDetails.externalUser;
      this.setState({externalUser:externalUserState})
    }
  }
  getSelectedTab(type, e){
    this.setState({type:type})
  }
  // onStatusChangeCanSearchB(e) {
  //   let status = this.refs.canSearchB.checked
  //   var backendUser={
  //     canSearch:status,
  //     canView:this.state.backendUser.canView?this.state.backendUser.canView:false,
  //     canTransact:this.state.backendUser.canTransact?this.state.backendUser.canTransact:false
  //   }
  //   this.setState({backendUser:backendUser});
  //   this.props.getMoolyaAccessStatus({backendUser:backendUser})
  // }
  //
  // onStatusChangeCanViewB(e) {
  //   let status = this.refs.canViewB.checked
  //   var backendUser={
  //     canSearch:this.state.backendUser.canSearch?this.state.backendUser.canSearch:false,
  //     canView: status,
  //     canTransact:this.state.backendUser.canTransact?this.state.backendUser.canTransact:false
  //   }
  //   this.setState({backendUser:backendUser});
  //   this.props.getMoolyaAccessStatus({backendUser:backendUser})
  // }
  //
  // onStatusChangeCanTransactB(e) {
  //   let status = this.refs.canTransactB.checked
  //   var backendUser={
  //     canSearch:this.state.backendUser.canSearch?this.state.backendUser.canSearch:false,
  //     canView:this.state.backendUser.canView?this.state.backendUser.canView:false,
  //     canTransact:status
  //   }
  //   this.setState({backendUser:backendUser});
  //   this.props.getMoolyaAccessStatus({backendUser:backendUser})
  // }
  onStatusChangeCanSearchE(e) {
    let status = this.refs.canSearchE.checked
    var externalUser={
      canSearch:status,
      canView: false,
    //canTransact:this.state.externalUser.canTransact?this.state.externalUser.canTransact:false
      canTransact:false
    }
    // this.state.externalUser.canView?this.state.externalUser.canView:false
    this.setState({externalUser:externalUser});
    this.props.getMoolyaAccessStatus({externalUser:externalUser})
  }

  onStatusChangeCanViewE(e) {
    let status = this.refs.canViewE.checked;
    var externalUser = {
      //canSearch: this.state.externalUser.canSearch ? this.state.externalUser.canSearch : false,
      canSearch:status,
      canView: status,
      //canTransact: this.state.externalUser.canTransact ? this.state.externalUser.canSearch : false
      canTransact:false
    }
   // if (externalUser.canSearch) {
      this.setState({externalUser: externalUser});
      this.props.getMoolyaAccessStatus({externalUser: externalUser})
   // } else {
   //   toastr.error('Can-Search should be active for can-view active');
   // }
  }

  onStatusChangeCanTransactE(e) {
    let status = this.refs.canTransactE.checked;
    var externalUser={
      //canSearch:this.state.externalUser.canSearch?this.state.externalUser.canSearch:false,
      canSearch:status,
      //canView: this.state.externalUser.canView?this.state.externalUser.canView:false,
      canView: status,
      canTransact:status
    }
    this.setState({externalUser:externalUser});
    this.props.getMoolyaAccessStatus({externalUser:externalUser})
  }

  render() {
    let that = this;
    let userType = that.state.type;
    // let backendUserState = that.state.backendUserState;
    // let externalUserState = that.state.externalUserState;
    return (

      <div className="panel-body">
        <div className="ml_tabs">
        <ul className="nav nav-pills" role="tablist">
          {/*<li role="presentation" className="active" onClick={this.getSelectedTab.bind(this, "backendUser")}><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Backend user Access</a></li>*/}
          <li role="presentation" className="active" onClick={this.getSelectedTab.bind(this, "externalUser")}><a href="#home" aria-controls="home" role="tab" data-toggle="tab">External user Access</a></li>
        </ul>
        {(userType == "backendUser")?
          <div>

          </div>
          :
          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="home">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group switch_wrap inline_switch">
                    <label className=""><FontAwesome name='search'/></label>
                    <label className="switch">
                      <input type="checkbox" ref="canSearchE" checked={that.state.externalUser.canSearch}
                             onChange={this.onStatusChangeCanSearchE.bind(this)}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group switch_wrap inline_switch">
                    <label className=""><FontAwesome name='eye'/></label>
                    <label className="switch">
                      <input type="checkbox" ref="canViewE" checked={that.state.externalUser.canView}
                             onChange={this.onStatusChangeCanViewE.bind(this)}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group switch_wrap inline_switch">
                    <label className=""><FontAwesome name='refresh'/></label>
                    <label className="switch">
                      <input type="checkbox" ref="canTransactE" checked={that.state.externalUser.canTransact}
                             onChange={this.onStatusChangeCanTransactE.bind(this)}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        </div>
      </div>
    )
  }
}
{/*<div className="tab-content">*/}
{/*<div role="tabpanel" className="tab-pane active" id="home">*/}
{/*<div className="row">*/}
{/*<div className="col-md-4">*/}
{/*<div className="form-group switch_wrap inline_switch">*/}
{/*<label className=""><FontAwesome name='search'/></label>*/}
{/*<label className="switch">*/}
{/*<input type="checkbox" ref="canSearchB" checked={that.state.backendUser.canSearch}*/}
{/*onChange={this.onStatusChangeCanSearchB.bind(this)}/>*/}
{/*<div className="slider"></div>*/}
{/*</label>*/}
{/*</div>*/}
{/*</div>*/}
{/*<div className="col-md-4">*/}
{/*<div className="form-group switch_wrap inline_switch">*/}
{/*<label className=""><FontAwesome name='eye'/></label>*/}
{/*<label className="switch">*/}
{/*<input type="checkbox" ref="canViewB" checked={that.state.backendUser.canView}*/}
{/*onChange={this.onStatusChangeCanViewB.bind(this)}/>*/}
{/*<div className="slider"></div>*/}
{/*</label>*/}
{/*</div>*/}
{/*</div>*/}
{/*<div className="col-md-4">*/}
{/*<div className="form-group switch_wrap inline_switch">*/}
{/*<label className=""><FontAwesome name='refresh'/></label>*/}
{/*<label className="switch">*/}
{/*<input type="checkbox" ref="canTransactB" checked={that.state.backendUser.canTransact}*/}
{/*onChange={this.onStatusChangeCanTransactB.bind(this)}/>*/}
{/*<div className="slider"></div>*/}
{/*</label>*/}
{/*</div>*/}
{/*</div>*/}
{/*</div>*/}
{/*</div>*/}
{/*</div>*/}
