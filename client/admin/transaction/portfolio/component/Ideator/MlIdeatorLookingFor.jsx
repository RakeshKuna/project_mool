import React, {Component, PropTypes}  from "react";
import {render} from 'react-dom';
import ScrollArea from 'react-scrollbar';
import _ from 'lodash';
import {Popover, PopoverTitle, PopoverContent} from 'reactstrap';
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from '../../../../utils/formElemUtil';
import {findIdeatorLookingForActionHandler} from '../../actions/findPortfolioIdeatorDetails'
import MlLoader from '../../../../../commons/components/loader/loader'
import Moolyaselect from  '../../../../commons/components/MlAdminSelectWrapper';
import gql from 'graphql-tag';
var FontAwesome = require('react-fontawesome');

export default class MlIdeatorLookingFor extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      privateKey: {},
      ideatorLookingFor: [],
      popoverOpen: false,
      selectedIndex: -1,
      ideatorLookingForList: [],
      selectedVal: null,
      selectedObject: "default"
    };
    this.handleBlur = this.handleBlur.bind(this);
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
    let empty = _.isEmpty(that.context.ideatorPortfolio && that.context.ideatorPortfolio.lookingFor)
    const response = await findIdeatorLookingForActionHandler(portfolioDetailsId);
    if (empty) {
      if (response && response.length>0) {
        this.setState({
          loading: false,
          ideatorLookingFor: response,
          ideatorLookingForList: response
        });
      }else
        this.setState({loading: false})
    } else {
      this.setState({
        loading: false,
        ideatorLookingFor: this.context.ideatorPortfolio.lookingFor,
        ideatorLookingForList: this.context.ideatorPortfolio.lookingFor
      }, () => {
        // this.lockPrivateKeys()
      });
    }
    this.IdeatorLookingForServer = response?response:[]
  }

  addLookingFor() {
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}})
    if (this.state.ideatorLookingFor) {
      this.setState({selectedIndex: this.state.ideatorLookingFor.length})
    } else {
      this.setState({selectedIndex: 0})
    }
  }

  onTileClick(index, e) {
    let cloneArray = _.cloneDeep(this.state.ideatorLookingFor);
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

  handleBlur(e) {
    var details = this.state.data;
    const name = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: e.target.value});
    this.setState({data: details})
  }

  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.IdeatorLookingForServer && this.IdeatorLookingForServer[selIndex]?this.IdeatorLookingForServer[selIndex].privateFields : []
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
    this.sendDataToParent(true);
    var setObject = this.state.ideatorLookingFor
    if (this.context && this.context.ideatorPortfolio && this.context.ideatorPortfolio.lookingFor)
      setObject = this.context.ideatorPortfolio.lookingFor
    this.setState({ideatorLookingForList: setObject, popoverOpen: false})
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
    this.setState({data: details, selectedVal: selectedId}, function () {
      // this.sendDataToParent()
    })
  }

  sendDataToParent(isSaveClicked) {
    let data = this.state.data;
    let ideatorLookingFor1 = this.state.ideatorLookingFor;
    let ideatorLookingFor = _.cloneDeep(ideatorLookingFor1);
    data.index = this.state.selectedIndex;
    if (isSaveClicked)
      ideatorLookingFor[this.state.selectedIndex] = data;
    let arr = [];
    _.each(ideatorLookingFor, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      var newItem = _.omit(item, "__typename")
      newItem = _.omit(newItem, ["privateFields"])
      arr.push(newItem)
    });

    ideatorLookingFor = arr;
    this.setState({ideatorLookingFor: ideatorLookingFor})
    this.props.getLookingFor(ideatorLookingFor, this.state.privateKey);
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
    let lookingOption = {options: {variables: {communityCode: "IDE"}}};
    let that = this;
    let ideatorLookingForList = that.state.ideatorLookingForList || [];
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
                    {ideatorLookingForList.map(function (details, idx) {
                      return (<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                        <a href="" id={"create_client" + idx}>
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
                                          isDynamic={true}
                                          queryOptions={lookingOption}
                                          onSelect={this.onOptionSelected.bind(this)}
                                          selectedValue={this.state.selectedVal}/>

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
};

MlIdeatorLookingFor.contextTypes = {
  ideatorPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
