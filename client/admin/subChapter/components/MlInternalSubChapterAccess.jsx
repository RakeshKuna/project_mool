/**
 * @Note Changes on 14-aug-201
 * */
import React from "react";
import {render} from "react-dom";
import gql from "graphql-tag";
import {isEmpty} from 'lodash'
import Moolyaselect from "../../commons/components/MlAdminSelectWrapper";
var FontAwesome = require('react-fontawesome');

export default class MlInternalSubChapterAccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{
        type: "backendUser",
        subChapters: [{subChapterId: null, chapterId: null}],   //second object is the context of subChapter
        backendUser: {canSearch: false, canView: false, canTransact: false},
        externalUser: {canSearch: false, canView: false, canTransact: false},
        isActive: true
      }],
    };
    this.onStatusChangeCanSearchB = this.onStatusChangeCanSearchB.bind(this);
    this.onStatusChangeCanViewB = this.onStatusChangeCanViewB.bind(this);
    this.onStatusChangeCanTransactB = this.onStatusChangeCanTransactB.bind(this);
    this.onStatusChangeCanSearchE = this.onStatusChangeCanSearchE.bind(this);
    this.onStatusChangeCanViewE = this.onStatusChangeCanViewE.bind(this);
    this.onStatusChangeCanTransactE = this.onStatusChangeCanTransactE.bind(this);
    this.getSelectedTab = this.getSelectedTab.bind(this);
    return this;
  }

  componentWillMount() {
    if (!isEmpty(this.props.assignedDetails)) {
      let userState = this.props.assignedDetails
      this.setState({data: userState})
    }
  }

  addAccessControl(id) {
    this.setState({
      data: this.state.data.concat([{
        type: "backendUser",
        subChapters: [{subChapterId: null, chapterId: null}],   //second object is the context of subChapter
        backendUser: {canSearch: false, canView: false, canTransact: false},
        externalUser: {canSearch: false, canView: false, canTransact: false},
        isActive : true
      }])
    });
  }

  // removeAccessControl(id, event) {
  //   let data;
  //   data = this.state.data.filter(function (object, index) {
  //     return id !== index;
  //   });
  //   this.setState({
  //     data: data
  //   })
  // }

  getSelectedTab(type, index, event) {
    let availabilityDetails = this.state.data
    availabilityDetails[index]['type'] = type
    this.setState({data: availabilityDetails}, function () {
      this.sendAccessDataToParent()
    })
  }

  onStatusChangeCanSearchB(index, event) {
    let status = event.target.checked
    let availabilityDetails = this.state.data
    availabilityDetails[index]['backendUser']['canSearch'] = status;
    availabilityDetails[index]['backendUser']['canView'] = false;
    availabilityDetails[index]['backendUser']['canTransact'] =false;
    this.setState({data: availabilityDetails}, function () {
      this.sendAccessDataToParent()
    })
  }

  onStatusChangeCanViewB(index, event) {
    let status = event.target.checked
    let availabilityDetails = this.state.data;
    availabilityDetails[index]['backendUser']['canSearch'] = status;
    availabilityDetails[index]['backendUser']['canView'] = status;
    availabilityDetails[index]['backendUser']['canTransact'] =false;
    this.setState({data: availabilityDetails}, function () {
      this.sendAccessDataToParent()
    })
  }

  onStatusChangeCanTransactB(index, event) {
    let status = event.target.checked
    let availabilityDetails = this.state.data
    availabilityDetails[index]['backendUser']['canTransact'] = status;
    availabilityDetails[index]['backendUser']['canSearch'] = status;
    availabilityDetails[index]['backendUser']['canView'] = status;
    this.setState({data: availabilityDetails}, function () {
      this.sendAccessDataToParent()
    })
  }

  onStatusChangeCanSearchE(index, event) {
    let status = event.target.checked
    let availabilityDetails = this.state.data
    availabilityDetails[index]['externalUser']['canSearch'] = status;
    availabilityDetails[index]['externalUser']['canView'] = false;
    availabilityDetails[index]['externalUser']['canTransact'] =false;
    this.setState({data: availabilityDetails}, function () {
      this.sendAccessDataToParent()
    })
  }

  onStatusChangeCanViewE(index, event) {
    let status = event.target.checked
    let availabilityDetails = this.state.data;
    availabilityDetails[index]['externalUser']['canSearch'] = status;
    availabilityDetails[index]['externalUser']['canView'] = status;
    availabilityDetails[index]['externalUser']['canTransact'] =false;
    this.setState({data: availabilityDetails}, function () {
      this.sendAccessDataToParent()
    })
  }

  onStatusChangeCanTransactE(index, event) {
    let status = event.target.checked
    let availabilityDetails = this.state.data;
    availabilityDetails[index]['externalUser']['canSearch'] = status;
    availabilityDetails[index]['externalUser']['canView'] = status;
    availabilityDetails[index]['externalUser']['canTransact'] = status;
    this.setState({data: availabilityDetails}, function () {
      this.sendAccessDataToParent()
    })
  }

  selectAssociateChapter(index, val, callback, label) {
    let chapterId = label && label.chapterId ? label.chapterId : null
    let availabilityDetails = this.state.data
    var value = val ? val : null
    let obj = [{subChapterId: value, chapterId: chapterId}]
    availabilityDetails[index]['subChapters'] = obj
    this.setState({data: availabilityDetails}, function () {
      this.sendAccessDataToParent()
    })
  }

  onStatusChange(index, event) {
    let availabilityDetails = this.state.data
    let statusValue = event.target.checked
    availabilityDetails[index]['isActive']= statusValue
    this.setState({data: availabilityDetails}, function () {
      this.sendAccessDataToParent()
    })
  }

  sendAccessDataToParent() {
    let dataToSend = this.state.data
    console.log('parent................')
    console.log(dataToSend)
    this.props.getInternalAccessStatus(dataToSend)
  }

  render() {
    let that = this;
    var subChapterQuery = gql`query($subChapterId:String, $clusterId: String){data:fetchSubChaptersSelectNonMoolya(subChapterId:$subChapterId, clusterId:$clusterId) { value:_id, label:subChapterName, chapterId:chapterId}}`;
    var subChapterOption = { options: { variables: { subChapterId: this.props.curSubChapter, clusterId: this.props.clusterId } } };
    return (
      <div >
        {that.state.data.map(function (value, id) {
          return (
            <div className="panel panel-default" key={id}>
              {/*<div className="panel-heading">*/}
              {/*Internal SubChapter Access{id == 0 ? (*/}
              {/*<div className="pull-right block_action" onClick={that.addAccessControl.bind(that, id)}><img*/}
              {/*src="/images/add.png"/></div>) : (<div className="pull-right block_action"*/}
              {/*onClick={that.removeAccessControl.bind(that, id)}>*/}
              {/*<img src="/images/remove.png"/></div>)}*/}
              {/*</div>*/}
              <div className="panel-heading">
                Internal SubChapter Access
                <div className="pull-right block_action" onClick={that.addAccessControl.bind(that, id)}><img
                  src="/images/add.png"/></div>
              </div>
              <div className="panel-body">
                <div className="ml_tabs">
                  <div className="form-group">
                    <Moolyaselect multiSelect={false} placeholder="Related Sub-Chapters" disabled={value.disabled}
                                  className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                  selectedValue={value && value.subChapters && value.subChapters.length > 0 ? value.subChapters[0].subChapterId : null}
                                  queryType={"graphql"}
                                  query={subChapterQuery} isDynamic={true} queryOptions={subChapterOption}
                                  onSelect={that.selectAssociateChapter.bind(that, id)}/>
                  </div>

                  <ul className="nav nav-pills" role="tablist">
                    <li role="presentation" className="active"
                        onClick={that.getSelectedTab.bind(this, "backendUser", id)}>
                      <a
                        href="#home" aria-controls="home" role="tab" data-toggle="tab">Backend user Access</a></li>
                    <li role="presentation" onClick={that.getSelectedTab.bind(that, "externalUser", id)}>
                      <a href="#profile"
                         aria-controls="profile"
                         role="tab"
                         data-toggle="tab">External
                        user Access</a></li>
                  </ul>
                  {(value.type == "backendUser") ?
                    <div className="tab-content">
                      <div role="tabpanel" className="tab-pane active" id="home">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group switch_wrap inline_switch">
                              <label className=""><FontAwesome name='search'/></label>
                              <label className="switch">
                                <input type="checkbox" ref="canSearchB" checked={value.backendUser.canSearch}
                                       onChange={that.onStatusChangeCanSearchB.bind(that, id)}/>
                                <div className="slider"></div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group switch_wrap inline_switch">
                              <label className=""><FontAwesome name='eye'/></label>
                              <label className="switch">
                                <input type="checkbox" ref="canViewB" checked={value.backendUser.canView}
                                       onChange={that.onStatusChangeCanViewB.bind(that, id)}/>
                                <div className="slider"></div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group switch_wrap inline_switch">
                              <label className=""><FontAwesome name='refresh'/></label>
                              <label className="switch">
                                <input type="checkbox" ref="canTransactB" checked={value.backendUser.canTransact}
                                       onChange={that.onStatusChangeCanTransactB.bind(that, id)}/>
                                <div className="slider"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="tab-content">
                      <div role="tabpanel" className="tab-pane active" id="home">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group switch_wrap inline_switch">
                              <label className=""><FontAwesome name='search'/></label>
                              <label className="switch">
                                <input type="checkbox" ref="canSearchE"
                                       checked={value.externalUser.canSearch}
                                       onChange={that.onStatusChangeCanSearchE.bind(that, id)}/>
                                <div className="slider"></div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group switch_wrap inline_switch">
                              <label className=""><FontAwesome name='eye'/></label>
                              <label className="switch">
                                <input type="checkbox" ref="canViewE"
                                       checked={value.externalUser.canView}
                                       onChange={that.onStatusChangeCanViewE.bind(that, id)}/>
                                <div className="slider"></div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group switch_wrap inline_switch">
                              <label className=""><FontAwesome name='refresh'/></label>
                              <label className="switch">
                                <input type="checkbox" ref="canTransactE"
                                       checked={value.externalUser.canTransact}
                                       onChange={that.onStatusChangeCanTransactE.bind(that, id)}/>
                                <div className="slider"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" checked={value.isActive}
                             onChange={that.onStatusChange.bind(that, id)}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    )
  }
}
