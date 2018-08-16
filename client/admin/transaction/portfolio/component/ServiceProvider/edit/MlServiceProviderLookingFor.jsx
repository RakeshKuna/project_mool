import React, {Component, PropTypes}  from "react";
import ScrollArea from 'react-scrollbar';
import _ from 'lodash';
import gql from 'graphql-tag';
var FontAwesome = require('react-fontawesome');
import {Popover, PopoverTitle, PopoverContent} from 'reactstrap';
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from '../../../../../utils/formElemUtil';
import {findServiceProviderLookingForActionHandler} from '../../../actions/findPortfolioServiceProviderDetails'
import MlLoader from '../../../../../../commons/components/loader/loader'
import Moolyaselect from  '../../../../../commons/components/MlAdminSelectWrapper';
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";

export default class MlServiceProviderLookingFor extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      privateKey: {},
      serviceProviderLookingFor: [],
      popoverOpen: false,
      selectedIndex: -1,
      serviceProviderLookingForList: [],
      selectedVal: null,
      selectedObject: "default"
    }
    this.tabName = this.props.tabName || ""
    this.handleBlur = this.handleBlur.bind(this);
    this.onSaveAction = this.onSaveAction.bind(this)
  }

  componentWillMount() {
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
    initalizeFloatLabel();
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId = that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.serviceProviderPortfolio && that.context.serviceProviderPortfolio.lookingFor)
    const response = await findServiceProviderLookingForActionHandler(portfolioDetailsId);
    if (empty) {
      if (response && response.length>0) {
        this.setState({
          loading: false,
          serviceProviderLookingFor: response,
          serviceProviderLookingForList: response
        });
      }else
        this.setState({loading: false})
    } else {
      this.setState({
        loading: false,
        serviceProviderLookingFor: this.context.serviceProviderPortfolio.lookingFor,
        serviceProviderLookingForList: this.context.serviceProviderPortfolio.lookingFor
      }, () => {
        // this.lockPrivateKeys()
      });
    }
    this.serviceProviderLookingForServer = response?response:[]
  }

  addLookingFor() {
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: null})
    if (this.state.serviceProviderLookingFor) {
      this.setState({selectedIndex: this.state.serviceProviderLookingFor.length})
    } else {
      this.setState({selectedIndex: 0})
    }
  }

  handleBlur(e) {
    var details = this.state.data;
    const name = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: e.target.value});
    this.setState({data: details})
  }

  onTileClick(index, e) {
    let cloneArray = _.cloneDeep(this.state.serviceProviderLookingFor);
    let details = cloneArray[index]
    details = _.omit(details, "__typename");
    this.setState({
      selectedIndex: index,
      data: details,
      selectedObject: index,
      "selectedVal": details.lookingForId,
      popoverOpen: !(this.state.popoverOpen)},()=>{
      this.lockPrivateKeys(index)
    });
  }


  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.serviceProviderLookingForServer && this.serviceProviderLookingForServer[selIndex]?this.serviceProviderLookingForServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName, index:selIndex})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys&&this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName, index:selIndex})
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  onSaveAction(e) {
    const requiredFields = this.getFieldValidations();
    if (requiredFields && !requiredFields.errorMessage) {
      this.sendDataToParent(true)
    }else {
      toastr.error(requiredFields.errorMessage);
      return
    }
    var setObject = this.state.serviceProviderLookingFor
    if (this.context && this.context.serviceProviderPortfolio && this.context.serviceProviderPortfolio.lookingFor)
      setObject = this.context.serviceProviderPortfolio.lookingFor
    this.setState({serviceProviderLookingForList: setObject, popoverOpen: false})
  }

  onLockChange(fieldName, field, e) {
    var isPrivate = false;
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true
    }
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName: this.props.tabName};
    this.setState({privateKey:privateKey}, function () {
      this.sendDataToParent()
    })
  }

  // onClick(fieldName, field,e){
  //   let details = this.state.data||{};
  //   let key = e.target.id;
  //   var isPrivate = false
  //   details=_.omit(details,[key]);
  //   let className = e.target.className;
  //   if(className.indexOf("fa-lock") != -1){
  //     details=_.extend(details,{[key]:true});
  //     isPrivate = true
  //   }else{
  //     details=_.extend(details,{[key]:false});
  //   }
  //   var privateKey = {keyName: fieldName, booleanKey: field, isPrivate: isPrivate, tabName: this.props.tabName}
  //   // this.setState({privateKey:privateKey})
  //   this.setState({data:details, privateKey:privateKey}, function () {
  //     this.sendDataToParent()
  //   })
  // }

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
    let serviceProviderLookingFor1 = this.state.serviceProviderLookingFor;
    let serviceProviderLookingFor = _.cloneDeep(serviceProviderLookingFor1);
    data.index = this.state.selectedIndex;
    if (isSaveClicked) {
      serviceProviderLookingFor[this.state.selectedIndex] = data;
    }
    let arr = [];
    _.each(serviceProviderLookingFor, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      var newItem = _.omit(item, "__typename")
      newItem = _.omit(newItem, ["privateFields"])
      arr.push(newItem)
    })

    serviceProviderLookingFor = arr;
    this.setState({serviceProviderLookingFor: serviceProviderLookingFor})
    this.props.getLookingForDetails(serviceProviderLookingFor, this.state.privateKey);

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
    let lookingOption = {options: {variables: {communityCode: "SPS"}}};
    let that = this;
    let serviceProviderLookingForList = that.state.serviceProviderLookingForList || [];
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
                      <a id="create_clientdefault" data-placement="top" data-class="large_popover">
                        <div className="list_block notrans" onClick={this.addLookingFor.bind(this)}>
                          <div className="hex_outer"><span className="ml ml-plus "></span></div>
                          <h3 onClick={this.addLookingFor.bind(this)}>Add New Looking For</h3>
                        </div>
                      </a>
                    </div>
                    {serviceProviderLookingForList.map(function (details, idx) {
                      return (<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                        <a id={"create_client" + idx}>
                          <div className="list_block">
                              <FontAwesome name='unlock' id="makePrivate" defaultValue={details.makePrivate}/>
                              <input type="checkbox" className="lock_input" id="makePrivate"
                                     checked={details.makePrivate}/>

                            <div className="hex_outer" onClick={that.onTileClick.bind(that, idx)}>
                              <span className="ml my-ml-browser_3"/>
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
                                          selectedValue={this.state.selectedVal} ref={"lookingForId"} data-required={true}
                                          data-errMsg="Looking For is required"/>

                            <div className="form-group">
                              <input type="text" name="lookingDescription" placeholder="About"
                                     className="form-control float-label" onBlur={this.handleBlur}
                                     defaultValue={this.state.data.lookingDescription}/>
                              <FontAwesome name='unlock' className="input_icon" id="isDescriptionPrivate"
                                           defaultValue={this.state.data.isDescriptionPrivate}
                                           onClick={this.onLockChange.bind(this, "lookingDescription", "isDescriptionPrivate")}/>
                            </div>
                            <div className="form-group">
                              <div className="input_types">
                                <div className="input_types"><input id="makePrivate" type="checkbox"
                                                                    checked={this.state.data && this.state.data.makePrivate ? this.state.data.makePrivate : false}
                                                                    name="checkbox"
                                                                    onChange={this.onStatusChangeNotify.bind(this)}/><label
                                  htmlFor="checkbox1"><span></span>Make Private</label></div>
                              </div>
                              <div className="ml_btn" style={{'textAlign': 'center'}}>
                                <a className="save_btn" onClick={this.onSaveAction}>Save</a>
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
};

MlServiceProviderLookingFor.contextTypes = {
  serviceProviderPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
