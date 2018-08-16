import React, {Component} from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import {findTaskActionHandler} from "../actions/saveCalanderTask";
import MlLoader from "../../../../../commons/components/loader/loader";
import _ from "lodash";
var FontAwesome = require('react-fontawesome');

export default class MlAppTaskConditions extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: []
    }
    this.findTaskDetails.bind(this);
    this.handleBlur.bind(this);
    return this;
  }
  isUpdated(){
    return true;
  }
  componentWillMount() {
    const resp = this.findTaskDetails();
    this.props.activeComponent(2);
    return resp;
  }

  async findTaskDetails() {
    let taskId = this.props.taskId
    if (taskId) {
      var response = await findTaskActionHandler(taskId);
      if (response && !_.isEmpty(response.attachments)) {
        this.setState({loading: false, data: response});
      } else {
        this.setState({loading: false, data: {attachments: [{name: '', info: '', isMandatory: false}]}});
      }
      return response
    } else {
      this.setState({loading: false});
    }
  }

  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (300 + $('.app_header').outerHeight(true)));
  }

  handleBlur(id, e) {
    let name = e.target.name;
    var value = e.target.value;
    let data = this.state.data;
    let cloneBackUp = _.cloneDeep(data);
    let specificData = cloneBackUp.attachments[id];
    specificData[name] = value;
    data.attachments.splice(id, 1);
    data.attachments.splice(id, 0, specificData);
    this.setState({data: data}, function () {
      this.sendConditionDataToParent()
    })
  }

  addAttachment() {
    let emptyObj = {name: '', info: '', isMandatory: false};
    let data = this.state.data
    let attach = data['attachments'];
    attach.push(emptyObj);
    this.setState({
      data: data
    }, function () {
      setTimeout(function () {
        let WinHeight = $(window).height();
        $('.step_form_wrap').height(WinHeight - (240 + $('.app_header').outerHeight(true)));
      }, 100);
    })
  }

  handleMandatory(id, e) {
    let name = e.target.name;
    var value = e.target.checked
    let data = this.state.data
    let cloneBackUp = _.cloneDeep(data);
    let specificData = cloneBackUp.attachments[id]
    specificData[name] = value
    data.attachments.splice(id, 1);
    data.attachments.splice(id, 0, specificData);
    this.setState({data: data}, function () {
      this.sendConditionDataToParent()
    })
  }

  sendConditionDataToParent() {
    let data = this.state.data;
    this.props.getConditionDetails(data);
  }

  render() {
    let that = this
    const showLoader = this.state.loading;
    return (
      <div className="step_form_wrap step1">
        {showLoader === true ? ( <MlLoader/>) : (
          <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
            <div className="form_bg">
              {this.state.data && this.state.data.attachments && this.state.data.attachments.map(function (item, say) {
                return (
                  <div className="col-md-6 nopadding-left" key={say}>

                    <div className="panel panel-default">
                      <div className="panel-heading">
                        Attachment
                        {(say == 0) ? <span className="see-more pull-right"><a href=""
                                                                               onClick={that.addAttachment.bind(that)}><FontAwesome
                          name='plus'/></a></span> : <span></span>}
                      </div>
                      <div className="panel-body">

                        <div className="form-group">
                          <input type="text" placeholder="Document name" name="name"
                                 onBlur={that.handleBlur.bind(that, say)}
                                 defaultValue={item.name} className="form-control float-label"/>
                        </div>
                        <div className="form-group">
                          <textarea placeholder="Info" className="form-control float-label" name="info"
                                    defaultValue={item.info} onBlur={that.handleBlur.bind(that, say)}></textarea>
                        </div>
                        <div className="form-group">
                          <div className="input_types">
                            <div className="input_types"><input id="checkbox1" type="checkbox" name="isMandatory"
                                                                onChange={that.handleMandatory.bind(that, say)}
                                                                checked={item.isMandatory}
                                                                value="1"/><label
                              htmlFor="checkbox1"><span></span>Is mandatory ?</label></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br className="brclear"/>
                  </div>
                )
              })}
            </div>
          </ScrollArea>)}
      </div>
    )
  }
};
