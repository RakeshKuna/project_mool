import React, {Component, PropTypes}  from "react";
import ScrollArea from 'react-scrollbar'
import gql from 'graphql-tag';
import _ from 'lodash';
import {Button, Popover, PopoverTitle, PopoverContent} from 'reactstrap';
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from '../../../../../utils/formElemUtil';
var FontAwesome = require('react-fontawesome');
import Moolyaselect from  '../../../../../commons/components/MlAdminSelectWrapper';
import {fetchStartupDetailsHandler} from '../../../actions/findPortfolioStartupDetails'
import MlLoader from '../../../../../../commons/components/loader/loader'
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";

const KEY = "lookingFor";

export default class MlStartupLookingFor extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      privateKey: {},
      startupLookingFor: [],
      popoverOpen: false,
      selectedIndex: -1,
      startupLookingForList: [],
      selectedVal: null,
      selectedObject: "default"
    }
    this.tabName = this.props.tabName || ""
    this.fetchPortfolioDetails.bind(this);
    this.onSaveAction.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    return this;
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
    initalizeFloatLabel();
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentWillMount() {
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId = that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.startupPortfolio && that.context.startupPortfolio.lookingFor)
    const response = await fetchStartupDetailsHandler(portfolioDetailsId, KEY);
    if (empty) {
      if (response && response.lookingFor && response.lookingFor.length>0) {
        this.setState({
          loading: false,
          startupLookingFor: response.lookingFor,
          startupLookingForList: response.lookingFor
        });
      } else {
        this.setState({loading: false})
      }
    } else {
      this.setState({
        loading: false,
        startupLookingFor: that.context.startupPortfolio.lookingFor,
        startupLookingForList: that.context.startupPortfolio.lookingFor
      });
    }
    this.startupLookingForServer = response&&response.lookingFor?response.lookingFor:[]
  }

  addLookingFor() {
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: null})
    if (this.state.startupLookingFor) {
      this.setState({selectedIndex: this.state.startupLookingFor.length})
    } else {
      this.setState({selectedIndex: 0})
    }
  }

  onTileClick(index, e) {
    let cloneArray = _.cloneDeep(this.state.startupLookingFor);
    let details = cloneArray[index]
    details = _.omit(details, "__typename");
    this.setState({
      selectedIndex: index,
      data: details,
      selectedObject: index,
      "selectedVal": details.lookingForId,
      popoverOpen: !(this.state.popoverOpen)},() =>{
      this.lockPrivateKeys(index)
    });
  }

  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.startupLookingForServer && this.startupLookingForServer[selIndex]?this.startupLookingForServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName, index:selIndex})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName, index:selIndex})
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  handleBlur(e) {
    var details = this.state.data;
    const name = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: e.target.value});
    this.setState({data: details})
  }

  onSaveAction(e) {
    const requiredFields = this.getFieldValidations();
    if (requiredFields && !requiredFields.errorMessage) {
      this.sendDataToParent(true)
    }else {
      toastr.error(requiredFields.errorMessage);
      return
    }
    var setObject = this.state.startupLookingFor
    if (this.context && this.context.startupPortfolio && this.context.startupPortfolio.lookingFor)
      setObject = this.context.startupPortfolio.lookingFor
    this.setState({startupLookingForList: setObject, popoverOpen: false})
  }

  onLockChange(fieldName, field, e) {
    var isPrivate = false;
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true
    }
    var privateKey = {
      keyName: fieldName,
      booleanKey: field, isPrivate: isPrivate,
      index: this.state.selectedIndex,
      tabName: this.props.tabName
    };
    this.setState({privateKey: privateKey}, function () {
      this.sendDataToParent()
    })
  }

  onStatusChangeNotify(e) {
    let updatedData = this.state.data || {};
    let key = e.target.id;
    updatedData = _.omit(updatedData, [key]);
    if (e.currentTarget.checked) {
      updatedData = _.extend(updatedData, {[key]: true});
    } else {
      updatedData = _.extend(updatedData, {[key]: false});
    }
    this.setState({data: updatedData}, function () {
      // this.sendDataToParent()
    })
  }

  onOptionSelected(selectedId, callback, selObject) {
    let details = this.state.data;
    details = _.omit(details, ["lookingForId"]);
    details = _.omit(details, ["lookingForName"]);
    details = _.omit(details, ["lookingDescription"]);
    details = _.extend(details, {
      ["lookingForId"]: selectedId,
      ["lookingForName"]: selObject.label,
      lookingDescription: selObject.about
    });
    this.setState({data: details, "selectedVal": selectedId}, function () {
      // this.sendDataToParent()
    })
  }

  getFieldValidations() {
    const ret = mlFieldValidations(this.refs);
    return {tabName: this.tabName, errorMessage: ret, index: this.state.selectedIndex}
  }

  sendDataToParent(isSaveClicked) {
    let data = this.state.data;
    let startupLookingFor1 = this.state.startupLookingFor;
    let startupLookingFor = _.cloneDeep(startupLookingFor1);
    data.index = this.state.selectedIndex;
    if (isSaveClicked)
      startupLookingFor[this.state.selectedIndex] = data;
    let arr = [];
    _.each(startupLookingFor, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      var newItem = _.omit(item, "__typename")
      newItem = _.omit(newItem, ["privateFields"])
      arr.push(newItem)
    })

    startupLookingFor = arr;
    this.setState({startupLookingFor: startupLookingFor})
    this.props.getLookingForDetails(startupLookingFor, this.state.privateKey);
  }


  render() {
    let query = gql`query($communityCode:String){
        data:fetchLookingFor(communityCode:$communityCode) {
          label:lookingForDisplayName
          value:_id
          about
        }
      }`;
    const showLoader = this.state.loading;
    let lookingOption = {options: {variables: {communityCode: "STU"}}};
    let that = this;
    let startupLookingForList = that.state.startupLookingForList || [];
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
          <div className="portfolio-main-wrap">
            <h2>Looking For</h2>
            <div className="requested_input main_wrap_scroll">
              <ScrollArea
                speed={0.8}
                className="main_wrap_scroll"
                smoothScrolling={true}
                default={true}
              >
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-2 col-md-3 col-sm-3">
                      <a href="" id="create_clientdefault" data-placement="top" data-class="large_popover">
                        <div className="list_block notrans" onClick={this.addLookingFor.bind(this)}>
                          <div className="hex_outer"><span className="ml ml-plus "></span></div>
                          <h3 onClick={this.addLookingFor.bind(this)}>Add New Looking For</h3>
                        </div>
                      </a>
                    </div>
                    {startupLookingForList.map(function (details, idx) {
                      return (<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                        <a href="" id={"create_client" + idx}>
                          <div className="list_block">
                            
                            <FontAwesome name='unlock' id="makePrivate" defaultValue={details.makePrivate}/><input
                            type="checkbox" className="lock_input" id="makePrivate"
                            checked={details.makePrivate}/>
                            <div className="hex_outer" onClick={that.onTileClick.bind(that, idx)}>
                              <span className="ml my-ml-browser_3" />
                            </div>
                            <h3>{details.lookingForName ? details.lookingForName : ""}</h3>
                          </div>
                        </a>
                      </div>)
                    })}
                  </div>
                </div>
              </ScrollArea>
              <Popover placement="right" isOpen={this.state.popoverOpen}
                       target={"create_client" + this.state.selectedObject} toggle={this.toggle}>
                <PopoverTitle>Add New Looking For</PopoverTitle>
                <PopoverContent>
                  <div className="ml_create_client">
                    <div className="medium-popover">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Select Looking For"
                                          className="form-control float-label" valueKey={'value'}
                                          labelKey={'label'} queryType={"graphql"} query={query}
                                          isDynamic={true} mandatory={true}
                                          queryOptions={lookingOption}
                                          onSelect={this.onOptionSelected.bind(this)}
                                          selectedValue={this.state.selectedVal} ref={"lookingForId"}
                                          data-required={true}
                                          data-errMsg="Looking For is required"/>

                            <div className="form-group">
                              <textarea type="text" name="lookingDescription" placeholder="About"
                                     className="form-control float-label" onBlur={this.handleBlur}
                                     defaultValue={this.state.data.lookingDescription}>
                              </textarea>
                              <FontAwesome name='unlock' className="input_icon" id="isDescriptionPrivate"
                                           onClick={this.onLockChange.bind(this, "lookingDescription", "isDescriptionPrivate")}/>
                            </div>
                            <div className="form-group">
                              <div className="input_types">
                                <div className="input_types"><input id="makePrivate" type="checkbox"
                                                                    checked={this.state.data && this.state.data.makePrivate?this.state.data.makePrivate:false}
                                                                    name="checkbox"
                                                                    onChange={this.onStatusChangeNotify.bind(this)}/><label
                                  htmlFor="checkbox1"><span></span>Make Private</label></div>
                              </div>
                              <div className="ml_btn" style={{'textAlign': 'center'}}>
                                <a href="" className="save_btn" onClick={this.onSaveAction.bind(this)}>Save</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>)}
      </div>
    )
  }
}
MlStartupLookingFor.contextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object,
};
