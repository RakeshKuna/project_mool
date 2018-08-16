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
import {fetchCompanyDetailsHandler} from "../../../../actions/findCompanyPortfolioDetails";

const KEY = "evolution"

export default class MlInstitutionEvolution extends React.Component {
  constructor(props, context) {
    super(props);
    console.log(this.props);
    this.state = {
      loading: true,
      // data: this.props.serviceProductsDetails || {},
      data: {},
      privateKey: {},
      evolution: {}
    }
    this.handleBlur = this.handleBlur.bind(this);
    return this;
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

    let that = this;
    let portfolioDetailsId = that.props.portfolioDetailsId;
    const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
    let empty = _.isEmpty(that.context.institutionPortfolio && that.context.institutionPortfolio.evolution);
    if (empty) {
      if (response && response.evolution) {
        const editorValue = createValueFromString(response && response.evolution && response.evolution.evolutionDescription ? response.evolution.evolutionDescription : null);
        let object = response.evolution;
        object = _.omit(object, '__typename');
        this.setState({
          loading: false,
          data: object,
          editorValue: editorValue
        }, () => {
          this.lockPrivateKeys();
        });
      } else {
        this.setState({loading: false}, () => {
          this.lockPrivateKeys();
        });
      }
    } else {
      if (response && response.evolution) {
        let object = response.evolution;
        object = _.omit(object, '__typename');
        const editorValue = createValueFromString(that.context.institutionPortfolio.evolution && that.context.institutionPortfolio.evolution.evolutionDescription ? that.context.institutionPortfolio.evolution.evolutionDescription : null);
        this.setState({
          loading: false,
          data: object,
          editorValue
        }, () => {
          this.lockPrivateKeys();
        });
      }
      else {
        this.setState({loading: false}, () => {
          this.lockPrivateKeys();
        });
      }
    }

    // let that = this;
    // let portfolioDetailsId = that.props.portfolioDetailsId;
    // let empty = _.isEmpty(that.context.institutionPortfolio && that.context.institutionPortfolio.evolution)
    // const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
    // if (empty) {
    //   const editorValue = createValueFromString(response && response.evolution && response.evolution.institutionEvolutionDescription ? response.evolution.institutionEvolutionDescription : null);
    //   if (response && response.evolution) {
    //     var object = response.evolution;
    //     object = _.omit(object, '__typename')
    //     // this.setState({data: object});
    //     this.setState({
    //       loading: false,
    //       data: object,
    //       privateFields: object.privateFields,
    //       editorValue: editorValue
    //     }, () => {
    //       this.lockPrivateKeys()
    //     });
    //   } else {
    //     this.setState({loading: false})
    //   }
    // }
    // else {
    //   const editorValue = createValueFromString(that.context.institutionPortfolio && that.context.institutionPortfolio.evolution && that.context.institutionPortfolio.evolution.institutionEvolutionDescription ? that.context.institutionPortfolio.evolution.institutionEvolutionDescription : null);
    //   let newState = {loading: false, editorValue};
    //   if (that.context.institutionPortfolio) {
    //     newState.data = that.context.institutionPortfolio.evolution;
    //   }
    //   if (response && response.evolution) {
    //     newState.privateValues = response.evolution.privateFields;
    //   }
    //   this.setState(newState, () => {
    //     this.lockPrivateKeys()
    //   });
    //   // this.setState({loading: false, data: that.context.institutionPortfolio.evolution,editorValue});
    // }

  }

  handleBlur(value, keyName) {
    let details = this.state.data;
    // let name  = e.target.name;
    details = _.omit(details, [keyName]);
    details = _.extend(details, {[keyName]: value.toString('html')});
    // details=_.extend(details,{[name]:e.target.value});
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
    this.props.getInstitutionEvolution(data, this.state.privateKey)
  }

  onLockChange(fieldName, field, e) {
    let isPrivate = false;
    const className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true
    }
    const privateKey = {keyName: fieldName, booleanKey: field, isPrivate: isPrivate, tabName: this.props.tabName};
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
                <h2>Evolution</h2>
                <div className="panel panel-default panel-form">

                  <div className="panel-body">

                    <div className="form-group nomargin-bottom">
                      {/* <textarea placeholder="Describe..." name="institutionEvolutionDescription" className="form-control" id="cl_about"  defaultValue={this.state.data&&this.state.data.institutionEvolutionDescription} onBlur={this.handleBlur.bind(this)}></textarea> */}
                      <MlTextEditor
                        value={editorValue}
                        handleOnChange={(value) => this.handleBlur(value, "institutionEvolutionDescription")}
                      />
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                                   id="institutionEvolutionDescriptionPrivate"
                                   defaultValue={this.state.data && this.state.data.institutionEvolutionDescriptionPrivate}
                                   onClick={this.onLockChange.bind(this, "institutionEvolutionDescription", "institutionEvolutionDescriptionPrivate")}/>
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
MlInstitutionEvolution.contextTypes = {
  institutionPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
