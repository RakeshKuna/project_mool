import React, {Component, PropTypes}  from "react";
import ScrollArea from 'react-scrollbar'
import {Button, Popover, PopoverTitle, PopoverContent} from 'reactstrap';
import gql from 'graphql-tag';
import _ from 'lodash';
var FontAwesome = require('react-fontawesome');
import Moolyaselect from  '../../../../../commons/components/MlAdminSelectWrapper';
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from '../../../../../utils/formElemUtil';
import {fetchInstitutionDetailsHandler} from '../../../actions/findPortfolioInstitutionDetails'
import MlLoader from '../../../../../../commons/components/loader/loader';
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";

const KEY = "lookingFor";

export default class MlInstitutionEditLookingFor extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      privateKey: {},
      institutionLookingFor: [],
      popoverOpen: false,
      selectedIndex: -1,
      institutionLookingForList: [],
      selectedVal: null,
      selectedObject: "default"
    };
    this.tabName = this.props.tabName || ""
    this.handleBlur = this.handleBlur.bind(this);
    this.addLookingFor = this.addLookingFor.bind(this);
    this.onSaveAction.bind(this);
    return this;
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
    initalizeFloatLabel();
    const className = this.props.isAdmin ? "admin_header" : "app_header";
    const WinWidth = $(window).width();
    const WinHeight = $(window).height();
    $('.main_wrap_scroll').height(WinHeight - ($('.' + className).outerHeight(true) + 120));
    if (WinWidth > 768) {
      $(".main_wrap_scroll").mCustomScrollbar({ theme: "minimal-dark" });
    }
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
    let empty = _.isEmpty(that.context.institutionPortfolio && that.context.institutionPortfolio.lookingFor);
    const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
    if (empty) {
      if (response && response.lookingFor) {
        this.setState({
          loading: false,
          institutionLookingFor: response.lookingFor,
          institutionLookingForList: response.lookingFor
        });
      } else {
        this.setState({loading: false})
      }
    } else {
      this.setState({
        loading: false,
        institutionLookingFor: that.context.institutionPortfolio.lookingFor,
        institutionLookingForList: that.context.institutionPortfolio.lookingFor
      })
    }
    this.institutionLookingForServer = response && response.lookingFor && response.lookingFor.length ? response.lookingFor : [];
  }

  addLookingFor() {
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}})
    if (this.state.institutionLookingFor) {
      this.setState({selectedIndex: this.state.institutionLookingFor.length})
    } else {
      this.setState({selectedIndex: 0})
    }
  }

  onTileClick(index, e) {
    let cloneArray = _.cloneDeep(this.state.institutionLookingFor);
    let details = cloneArray[index]
    details = _.omit(details, "__typename");
    this.setState({
      selectedIndex: index,
      data: details,
      selectedObject: index,
      popoverOpen: !(this.state.popoverOpen),
      "selectedVal": details.lookingForId
    }, () => {
      this.lockPrivateKeys(index);
    });

    // setTimeout(function () {
    //   _.each(details.privateFields, function (pf) {
    //     $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    //   })
    // }, 10)
  }

  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.institutionLookingForServer && this.institutionLookingForServer[selIndex]?this.institutionLookingForServer[selIndex].privateFields : []
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
    var setObject = this.state.institutionLookingFor
    if (this.context && this.context.institutionPortfolio && this.context.institutionPortfolio.lookingFor)
      setObject = this.context.institutionPortfolio.lookingFor
    this.setState({institutionLookingForList: setObject, popoverOpen: false})
  }

  onLockChange(fieldName, field, e) {
    var isPrivate = false;
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true
    }
    var privateKey = {
      keyName: fieldName,
      booleanKey: field,
      isPrivate: isPrivate,
      index: this.state.selectedIndex,
      tabName: KEY
    }
    this.setState({privateKey: privateKey}, function () {
      // this.sendDataToParent()
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

  handleBlur(e) {
    var details = this.state.data;
    const name = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: e.target.value});
    this.setState({data: details})
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
    let institutionLookingFor1 = this.state.institutionLookingFor;
    let institutionLookingFor = _.cloneDeep(institutionLookingFor1);
    data.index = this.state.selectedIndex;
    if(isSaveClicked)
    institutionLookingFor[this.state.selectedIndex] = data;
    let arr = [];
    _.each(institutionLookingFor, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      var newItem = _.omit(item, "__typename")
      newItem = _.omit(newItem, ["privateFields"])
      arr.push(newItem)
    })

    institutionLookingFor = arr;
    this.setState({institutionLookingFor: institutionLookingFor})
    this.props.getLookingForDetails(institutionLookingFor, this.state.privateKey);
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
    let lookingOption = {options: {variables: {communityCode: "INS"}}};
    let that = this;
    let institutionLookingForList = that.state.institutionLookingForList || [];
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
          <div className="portfolio-main-wrap">
            <h2>Looking For</h2>
            <div className="requested_input main_wrap_scroll">
              
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-2 col-md-3 col-sm-3">
                      <a href="" id="create_clientdefault" data-placement="top" data-class="large_popover">
                        <div className="list_block notrans" onClick={this.addLookingFor}>
                          <div className="hex_outer"><span className="ml ml-plus "></span></div>
                          <h3 onClick={this.addLookingFor}>Add New Looking For</h3>
                        </div>
                      </a>
                    </div>
                    {institutionLookingForList.map(function (details, idx) {
                      return (<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                        <a href="" id={"create_client" + idx}>
                          <div className="list_block">
                            
                              <FontAwesome name='unlock' id="makePrivate" defaultValue={details.makePrivate}/>
                              <input type="checkbox" className="lock_input" id="makePrivate" checked={details.makePrivate}/>
                            
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
                                          onSelect={this.onOptionSelected.bind(this)} ref={"lookingForId"}
                                          selectedValue={this.state.selectedVal} data-required={true}
                                          data-errMsg="Looking For is required"/>

                            <div className="form-group">
                              <input type="text" name="lookingDescription" placeholder="About"
                                     className="form-control float-label" onBlur={this.handleBlur}
                                     defaultValue={this.state.data.lookingDescription}/>
                              <FontAwesome name='unlock' className="input_icon" id="isDescriptionPrivate" defaultValue={this.state.data.isDescriptionPrivate}
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
MlInstitutionEditLookingFor.contextTypes = {
  institutionPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
