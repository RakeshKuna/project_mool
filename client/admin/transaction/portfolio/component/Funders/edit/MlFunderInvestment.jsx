import React, {Component, PropTypes} from "react";
import _ from "lodash";
import Datetime from "react-datetime";
import gql from "graphql-tag";
import moment from "moment";
import ScrollArea from "react-scrollbar";
var FontAwesome = require('react-fontawesome');
import {Popover, PopoverContent, PopoverTitle} from "reactstrap";
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from "../../../../../../../client/admin/utils/formElemUtil";
import Moolyaselect from "../../../../../commons/components/MlAdminSelectWrapper";
import MlLoader from "../../../../../../commons/components/loader/loader";
import {fetchfunderPortfolioInvestor} from "../../../actions/findPortfolioFunderDetails";
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";
import { fetchCurrencyTypeActionHandler } from '../../../../../../commons/actions/mlCurrencySymbolHandler';

export default class MlFunderInvestment extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
      data: {},
      privateKey:{},
      funderInvestment: [],
      popoverOpen: false,
      selectedIndex: -1,
      funderInvestmentList: [],
      selectedVal: null,
      selectedObject: "default", currencySymbol:"", currencyName:""
    }
    this.tabName = this.props.tabName || ""
    this.handleBlur = this.handleBlur.bind(this);
    this.onSaveAction.bind(this);
    this.dateChange.bind(this)
    this.fetchPortfolioDetails.bind(this);
    return this;
  }

  componentDidUpdate() {
    var className = this.props.isAdmin ? "admin_header" : "app_header"
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    // $('.main_wrap_scroll').height(WinHeight-($('.admin_header').outerHeight(true)+120));
    $('.main_wrap_scroll').height(WinHeight - ($('.' + className).outerHeight(true) + 120));
    if (WinWidth > 768) {
      $(".main_wrap_scroll").mCustomScrollbar({ theme: "minimal-dark" });
    }
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
    this.getCurrencyType()
    return resp
  }

  async getCurrencyType() {
    const response = await fetchCurrencyTypeActionHandler(this.props.client, null, this.props.portfolioDetailsId);
    this.setState({currencySymbol: response.symbol, currencyName:response.currencyName})
    return response;
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId = that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.funderPortfolio && that.context.funderPortfolio.investments)
    const response = await fetchfunderPortfolioInvestor(portfolioDetailsId);
    if (empty) {
      if(response && response.length)
        this.setState({loading: false, funderInvestment: response, funderInvestmentList: response});
      else
        this.setState({loading: false})
    } else {
      this.setState({
        loading: false,
        funderInvestment: that.context.funderPortfolio.investments,
        funderInvestmentList: that.context.funderPortfolio.investments
      });
    }
    this.funderInvestmentServer = response
  }

  onLockChange(fieldName, field, e) {
    var isPrivate = false;
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true
    }
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName: this.props.tabName}
    this.setState({privateKey:privateKey}, function () {
      this.sendDataToParent()
    })
  }

  handleBlur(e) {
    let details = this.state.data;
    let name = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: e.target.value});
    this.setState({data: details}, function () {
      // this.sendDataToParent()
    })
  }

  dateChange(event) {
    let value = event && event._d ? moment(event._d).format('DD-MM-YYYY') : ''
    let details = this.state.data;
    let name = 'dateOfInvestment';
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: value});
    this.setState({data: details}, function () {
      // this.sendDataToParent()
    })
  }

  addInvestment() {
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: ''})
    if (this.state.funderInvestment) {
      this.setState({selectedIndex: this.state.funderInvestment.length})
    } else {
      this.setState({selectedIndex: 0})
    }
  }

  onOptionSelected(selectedFunding) {
    let details = this.state.data;
    details = _.omit(details, ["typeOfFundingId"]);
    details = _.extend(details, {["typeOfFundingId"]: selectedFunding});
    this.setState({data: details, "selectedVal": selectedFunding}, function () {
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

  onTileClick(index, e) {
    let cloneArray = _.cloneDeep(this.state.funderInvestment);
    let details = cloneArray[index]
    details = _.omit(details, "__typename");
    if (details && details.logo) {
      delete details.logo['__typename'];
    }
    this.setState({
      selectedIndex: index,
      data: details,
      selectedObject: index,
      popoverOpen: !(this.state.popoverOpen),
      "selectedVal": details.typeOfFundingId}, () => {
      this.lockPrivateKeys(index)
    });

    // setTimeout(function () {
    //   _.each(details.privateFields, function (pf) {
    //     $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    //   })
    // }, 10)
  }

  /**
   * UI creating lock function\
   * @Note: For the first Time context data is not working
   *        from the second time context when connection establish then its working
   * */
  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.funderInvestmentServer && this.funderInvestmentServer[selIndex]?this.funderInvestmentServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName, index:selIndex})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName, index:selIndex})
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
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
    var setObject = this.state.funderInvestment
    if(this.context && this.context.funderPortfolio && this.context.funderPortfolio.investments ){
      setObject = this.context.funderPortfolio.investments
    }
    this.setState({funderInvestmentList: setObject, popoverOpen: false})
  }

  getFieldValidations() {
    const ret = mlFieldValidations(this.refs);
    return {tabName: this.tabName, errorMessage: ret, index: this.state.selectedIndex}
  }

  sendDataToParent(isSaveClicked) {
    let data = this.state.data;
    let investment = this.state.funderInvestment;
    let funderInvestment = _.cloneDeep(investment);
    data.index = this.state.selectedIndex;
    if (isSaveClicked) {
      funderInvestment[this.state.selectedIndex] = data;
    }
    let arr = [];
    _.each(funderInvestment, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename");
      let updateItem = _.omit(newItem, 'logo');
      updateItem =_.omit(updateItem,"privateFields");
      arr.push(updateItem)
    })
    funderInvestment = arr;
    this.setState({funderInvestment: funderInvestment})
    this.props.getInvestmentsDetails(funderInvestment, this.state.privateKey);
  }

  render() {
    var yesterday = Datetime.moment().subtract(0,'day');
    var valid = function( current ){
      return current.isBefore( yesterday );
    };
    let query = gql`query{
      data:fetchFundingTypes {
        label:displayName
        value:_id
      }
    }`;
    let that = this;
    const showLoader = that.state.loading;
    let funderInvestmentList = that.state.funderInvestmentList || [];
        return (
          <div>
            {showLoader === true ? (<MlLoader/>) : (
              <div className="portfolio-main-wrap">
                <h2>Investments</h2>
                <div className="requested_input main_wrap_scroll">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-2 col-md-4 col-sm-4">
                          <a href="" id="create_clientdefault" data-placement="top" data-class="large_popover">
                            <div className="list_block notrans" onClick={this.addInvestment.bind(this)}>
                              <div className="hex_outer"><span className="ml ml-plus "></span></div>
                              <h3 onClick={this.addInvestment.bind(this)}>Add New</h3>
                            </div>
                          </a>
                        </div>
                        {funderInvestmentList.map(function (details, idx) {
                          return (
                            <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
                              <a href="" id={"create_client" + idx}>
                                <div className="list_block notrans funding_list">
                                  {/*<div className="cluster_status inactive_cl"><FontAwesome name='trash-o'/></div>*/}
                                  <FontAwesome name='lock' id="makePrivate" defaultValue={details.makePrivate}/>
                                  <input type="checkbox" className="lock_input" id="makePrivate"
                                         checked={details.makePrivate}/>
                                  <div onClick={that.onTileClick.bind(that, idx)}>
                                    <p>{details.investmentcompanyName}</p>
                                    <p className="fund">{details.investmentAmount}</p>
                                  </div>
                                  <h3>{details.dateOfInvestment ? details.dateOfInvestment : 'Date :'}</h3>
                                </div>
                              </a>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  <Popover placement="right" isOpen={this.state.popoverOpen}
                           target={"create_client" + this.state.selectedObject} toggle={this.toggle}>
                    <PopoverTitle> Add Investment </PopoverTitle>
                    <PopoverContent>
                      <div className="ml_create_client">
                        <div className="medium-popover">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group mandatory">
                                <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}
                                          inputProps={{placeholder: "Enter Date of Investment",className: "float-label form-control",readOnly:true}} ref="dateOfInvestment"
                                          defaultValue={this.state.data.dateOfInvestment ? this.state.data.dateOfInvestment : ''}
                                          onChange={this.dateChange.bind(this)} closeOnSelect={true}
                                          isValidDate={ valid }  data-required={true}
                                          data-errMsg="Date is required"/>
                                <FontAwesome name='unlock' className="input_icon un_lock" id="isDateOfInvestmentPrivate"
                                             onClick={this.onLockChange.bind(this, "dateOfInvestment", "isDateOfInvestmentPrivate")}/>
                              </div>
                              <div className="form-group mandatory">
                                <input type="text" placeholder="Company Name" name="investmentcompanyName" ref="investmentcompanyName"
                                       defaultValue={this.state.data.investmentcompanyName}
                                       className="form-control float-label" onBlur={this.handleBlur} data-required={true}
                                       data-errMsg="Company Name is required"/>
                                <FontAwesome name='unlock' className="input_icon un_lock" id="isCompanyNamePrivate"
                                             onClick={this.onLockChange.bind(this, "investmentcompanyName", "isCompanyNamePrivate")}/>
                              </div>
                              <div className="form-group mandatory">
                                <input type="number" placeholder={`Investment Amount in ${this.state.currencyName} (${this.state.currencySymbol})`} name="investmentAmount" ref="investmentAmount" min={0}
                                       defaultValue={this.state.data.investmentAmount}
                                       className="form-control float-label" onBlur={this.handleBlur} data-required={true}
                                       data-errMsg="Investment Amount is required"/>
                                <FontAwesome name='unlock' className="input_icon un_lock" id="isInvestmentAmountPrivate"
                                             onClick={this.onLockChange.bind(this, "investmentAmount", "isInvestmentAmountPrivate")}/>
                              </div>
                              <div className="form-group">
                                <Moolyaselect multiSelect={false} className="form-field-name" valueKey={'value'} ref={'typeOfFundingId'}
                                              labelKey={'label'} queryType={"graphql"} query={query} mandatory={true}
                                              isDynamic={true} placeholder="Type of Funding"
                                              onSelect={this.onOptionSelected.bind(this)} data-required={true}
                                              data-errMsg="Type of Funding is required"
                                              selectedValue={this.state.selectedVal}/>
                              </div>
                              <div className="form-group">
                                <input type="text" placeholder="About" name="aboutInvestment"
                                       defaultValue={this.state.data.aboutInvestment}
                                       className="form-control float-label" onBlur={this.handleBlur.bind(this)}/>
                                <FontAwesome name='unlock' className="input_icon un_lock" id="isAboutInvestmentPrivate"
                                             onClick={this.onLockChange.bind(this, "aboutInvestment", "isAboutInvestmentPrivate")}/>
                              </div>
                              <div className="form-group">
                                <div className="input_types">
                                <input className="make-private-check" id="makePrivate" type="checkbox"
                                         checked={this.state.data.makePrivate && this.state.data.makePrivate}
                                         name="checkbox"
                                         onChange={this.onStatusChangeNotify.bind(this)}/>
                                  <label htmlFor="checkbox1"><span></span>Make Private</label></div>
                              </div>
                              <div className="ml_btn" style={{'textAlign': 'center'}}>
                                <a className="save_btn" href="" onClick={this.onSaveAction.bind(this)}>Save</a>
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
MlFunderInvestment.contextTypes = {
  funderPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object,
};
