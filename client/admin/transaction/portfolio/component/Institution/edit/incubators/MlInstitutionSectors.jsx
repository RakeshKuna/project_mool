import React, {Component, PropTypes} from "react";
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import ScrollArea from 'react-scrollbar'

var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../../utils/formElemUtil';
import MlLoader from "../../../../../../../commons/components/loader/loader";
import _ from 'lodash';
import {fetchInstitutionDetailsHandler} from "../../../../actions/findPortfolioInstitutionDetails";
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor"

const KEY = "sectorsAndServices"

export default class MlInstitutionSectors extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      // data:this.props.serviceProductsDetails || {},
      data: {},
      privateKey: {},
      sectorsAndServices: {}
    }
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
    // this.updatePrivateKeys();
  }

  // componentWillMount(){
  //   let empty = _.isEmpty(this.context.institutionPortfolio && this.context.institutionPortfolio.serviceProducts)
  //   if(!empty){
  //     this.setState({loading: false, data: this.context.institutionPortfolio.serviceProducts});
  //   }
  // }
  componentWillMount() {
    this.fetchPortfolioDetails();
  }

  async fetchPortfolioDetails() {
    // let that = this;
    // let portfolioDetailsId=that.props.portfolioDetailsId;
    // let empty = _.isEmpty(that.context.institutionPortfolio && that.context.institutionPortfolio.sectorsAndServices)
    // const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
    // if(empty){
    //   if (response && response.sectorsAndServices) {
    //     const editorValue = createValueFromString(response && response.sectorsAndServices && response.sectorsAndServices.sectorsAndServicesDescription ? response.sectorsAndServices.sectorsAndServicesDescription : null);
    //     var object = response.sectorsAndServices;
    //     object = _.omit(object, '__typename')
    //     // this.setState({data: object});
    //     this.setState({ loading: false,data: object,privateFields:object.privateFields,editorValue:editorValue }, () => {
    //       this.lockPrivateKeys()
    //     });
    //   }else{
    //     this.setState({loading:false})
    //   }
    // }else{
    //   const editorValue = createValueFromString(that.context.institutionPortfolio.sectorsAndServices && that.context.institutionPortfolio.sectorsAndServices.sectorsAndServicesDescription ? that.context.institutionPortfolio.sectorsAndServices.sectorsAndServicesDescription : null);
    //   this.setState({ loading: false, data: that.context.institutionPortfolio.sectorsAndServices, privateValues: response.sectorsAndServices.privateFields, editorValue}, () => {
    //     this.lockPrivateKeys()
    //   });
    //   // this.setState({loading: false, data: that.context.institutionPortfolio.sectorsAndServices,editorValue});
    // }
    // this.updatePrivateKeys()

    let portfolioDetailsId = this.props.portfolioDetailsId;
    const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
    const editorValue = createValueFromString(response && response.institutionIncubators && response.institutionIncubators.sectorsAndServices ? response.institutionIncubators.sectorsAndServices : null);
    if (response && response.sectorsAndServices) {
      var object = response.sectorsAndServices;
      object = _.omit(object, '__typename')
      // this.setState({data: object});
      this.setState({
        loading: false,
        data: object,
        privateFields: object.privateFields,
        editorValue: editorValue
      }, () => {
        this.lockPrivateKeys()
      });
    } else {
      this.setState({loading: false})
    }
  }

  handleBlur(value, keyName) {
    let details = this.state.data;
    // let name  = e.target.name;
    details = _.omit(details, [name]);
    // details=_.extend(details,{[name]:e.target.value});
    details = _.extend(details, {[keyName]: value.toString('html')});
    this.setState({data: details, editorValue: value}, function () {
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
    data = _.omit(data, ["privateFields"]);
    this.props.getSectors(data, this.state.privateKey)
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

  // updatePrivateKeys(){
  //   let response = this.state.data
  //   _.each(response.privateFields, function (pf) {
  //     $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
  //   })
  // }
  render() {
    let that = this;
    const showLoader = that.state.loading;
    const {editorValue} = this.state;
    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (
          <div className="requested_input">
            <div className="col-lg-12">
              <div className="row">
                <h2>Sectors And Services</h2>
                <div className="panel panel-default panel-form">

                  <div className="panel-body">

                    <div className="form-group nomargin-bottom">
                      {/* <textarea placeholder="Describe..." name="sectorsAndServicesDescription" className="form-control" id="cl_about"  defaultValue={this.state.data&&this.state.data.sectorsAndServicesDescription} onBlur={this.handleBlur.bind(this)}></textarea> */}
                      <MlTextEditor
                        value={editorValue}
                        handleOnChange={(value) => this.handleBlur(value, "sectorsAndServicesDescription")}
                      />
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                                   id="isSectorsAndServicesPrivate"
                                   defaultValue={this.state.data && this.state.data.isSectorsAndServicesPrivate}
                                   onClick={this.onLockChange.bind(this, "sectorsAndServicesDescription", "isSectorsAndServicesPrivate")}/>
                    </div>

                  </div>
                </div>


              </div>
            </div>
          </div>)}
      </div>
    )
  }
}
MlInstitutionSectors.contextTypes = {
  institutionPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
