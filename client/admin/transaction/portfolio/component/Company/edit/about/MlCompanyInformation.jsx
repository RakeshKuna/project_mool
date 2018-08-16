import React, {Component, PropTypes} from "react";
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import ScrollArea from 'react-scrollbar';

var FontAwesome = require('react-fontawesome');
import _ from 'lodash';
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../../utils/formElemUtil';
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";

export default class MlCompanyInformation extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: this.props.informationDetails || {},
      privateKey: {},
      editorValue: createValueFromString(this.props.informationDetails ? this.props.informationDetails.informationDescription : null)
    }
    this.handleBlur.bind(this);
    return this;
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
    // this.updatePrivateKeys();
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentWillMount() {

    let empty = _.isEmpty(this.context.companyPortfolio && this.context.companyPortfolio.information)
    const editorValue = createValueFromString(this.context.companyPortfolio && this.context.companyPortfolio.information ? this.context.companyPortfolio.information.informationDescription : null);
    if (!empty) {
      this.setState({loading: false, editorValue}, () => {
        this.lockPrivateKeys();
      });
    } else {
      this.setState({loading: false}, () => {
        this.lockPrivateKeys();
      })
    }

    // this.setState({loading: false}, () => {
    //   this.lockPrivateKeys();
    // })
  }

  handleBlur(value, keyName) {
    let details = this.state.data;
    // let name  = e.target.name;
    details = _.omit(details, [keyName]);
    details = _.extend(details, {[keyName]: value.toString('html')});
    this.setState({data: details, editorValue: value}, () => {
      this.sendDataToParent()
    })
    // this.setState({data:details}, function () {
    //   this.sendDataToParent()
    // })
  }

  sendDataToParent() {
    let data = this.state.data;
    for (var propName in data) {
      if (data[propName] === null || data[propName] === undefined) {
        delete data[propName];
      }
    }
    data = _.omit(data, "__typename");
    data = _.omit(data, ["privateFields"]);
    this.props.getInfo(data, this.state.privateKey)
  }

  onLockChange(fieldName, field, e) {
    var isPrivate = false;
    const className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true
    }
    const privateKey = {keyName: fieldName, booleanKey: field, isPrivate: isPrivate, tabName: this.props.tabName}
    this.setState({privateKey: privateKey}, function () {
      this.sendDataToParent()
    })
  }

  // updatePrivateKeys(){
  //   let response = this.props.informationDetails
  //   _.each(response.privateFields, function (pf) {
  //     $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
  //   })
  // }

  lockPrivateKeys() {
    const privateValues = this.state.data.privateFields;
    const filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName})
    const filterRemovePrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName})
    const finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    const keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  render() {
    const {editorValue} = this.state;
    return (
      <div className="requested_input">
        <div className="col-lg-12">
          <div className="row">
            <h2>Information</h2>
            <div className="panel panel-default panel-form">

              <div className="panel-body">

                <div className="form-group nomargin-bottom">
                  {/* <textarea placeholder="Describe..." name="informationDescription" className="form-control" id="cl_about" defaultValue={this.state.data&&this.state.data.informationDescription}  onBlur={this.handleBlur.bind(this)}></textarea> */}
                  <MlTextEditor
                    value={editorValue}
                    handleOnChange={(value) => this.handleBlur(value, "informationDescription")}
                  />
                  <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                               id="isInformationDescriptionPrivate"
                               defaultValue={this.state.data && this.state.data.isInformationDescriptionPrivate}
                               onClick={this.onLockChange.bind(this, "informationDescription", "isInformationDescriptionPrivate")}/>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
MlCompanyInformation.contextTypes = {
  companyPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
