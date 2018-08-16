import React, {Component, PropTypes} from "react";
import ScrollArea from 'react-scrollbar';

var FontAwesome = require('react-fontawesome');
import _ from "lodash"
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../../utils/formElemUtil';
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";
import MlLoader from '../../../../../../../commons/components/loader/loader';

export default class MlInstitutionInformation extends Component {
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
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentWillMount() {

    let empty = _.isEmpty(this.context.institutionPortfolio && this.context.institutionPortfolio.information)
    const editorValue = createValueFromString(this.context.institutionPortfolio && this.context.institutionPortfolio.information ? this.context.institutionPortfolio.information.informationDescription : null);
    if (!empty) {
      this.setState({loading: false, editorValue}, () => {
        this.lockPrivateKeys();
      });
    } else {
      this.setState({loading: false}, () => {
        this.lockPrivateKeys();
      })
    }

    // this.setState({ loading: false }, () => {
    //   this.lockPrivateKeys();
    // })
  }

  /**
   * UI creating lock function
   * */
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

  handleBlur(value, keyName) {
    let details = this.state.data;
    details = _.omit(details, [keyName]);
    details = _.extend(details, {[keyName]: value.toString('html')});
    this.setState({data: details, editorValue: value}, () => {
      this.sendDataToParent()
    })
  }

  sendDataToParent() {
    let data = this.state.data;
    for (var propName in data) {
      if (data[propName] === null || data[propName] === undefined) {
        delete data[propName];
      }
    }
    this.props.getInstitutionInfo(data, this.state.privateKey)
  }

  onLockChange(fieldName, field, e) {
    let isPrivate = false;
    const className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true
    }
    const privateKey = {keyName: fieldName, booleanKey: field, isPrivate: isPrivate, tabName: this.props.tabName}
    this.setState({privateKey: privateKey}, function () {
      this.sendDataToParent()
    })
  }

  render() {
    const {editorValue} = this.state;
    const showLoader = this.state.loading;
    return (
      <div className="requested_input">
        {showLoader === true ? (<MlLoader/>) : (
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
                                 id="isDescriptionPrivate"
                                 onClick={this.onLockChange.bind(this, "informationDescription", "isDescriptionPrivate")}/>
                  </div>

                </div>
              </div>
            </div>
          </div>)}
      </div>
    )
  }
}

MlInstitutionInformation.contextTypes = {
  institutionPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
