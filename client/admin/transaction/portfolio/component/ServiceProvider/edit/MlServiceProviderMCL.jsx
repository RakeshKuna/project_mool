import React, {Component, PropTypes} from "react";
import ScrollArea from "react-scrollbar";
var FontAwesome = require('react-fontawesome');
import MlLoader from "../../../../../../commons/components/loader/loader";
import _ from 'lodash';
import {dataVisibilityHandler, OnLockSwitch} from "../../../../../utils/formElemUtil";
import {
  fetchServiceProviderMemberships,
  fetchServiceProviderLicenses,
  fetchServiceProviderCompliances
} from "../../../actions/findPortfolioServiceProviderDetails";
import MlTextEditor, {createValueFromString} from "../../../../../../commons/components/textEditor/MlTextEditor";

const MEMBERKEY = 'memberships'
const LICENSEKEY = 'licenses'
const COMPLIANCEKEY = 'compliances'


export default class MlServiceProviderMCL extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      memberships: {},
      licenses: {},
      compliances: {},
      privateKey:{},
      privateFields:[]
    }
    this.onLockChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.fetchPortfolioDetails.bind(this);
    // this.updateprivateFields.bind(this)
  }

  componentWillMount() {
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  // updateprivateFields(){
  //   var that = this
  //   let membershipsPrivateFields = this.state.memberships&&this.state.memberships.privateFields?this.state.memberships.privateFields:[]
  //   let compliancesPrivateFields = this.state.compliances&&this.state.compliances.privateFields?this.state.compliances.privateFields:[]
  //   let licensesPrivateFields = this.state.licenses&&this.state.licenses.privateFields?this.state.licenses.privateFields:[]
  //   setTimeout(function () {
  //     _.each(membershipsPrivateFields, function (pf) {
  //       $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
  //     })
  //     _.each(compliancesPrivateFields, function (pf) {
  //       $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
  //     })
  //     _.each(licensesPrivateFields, function (pf) {
  //       $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
  //     })
  //   }, 10)
  // }
  updateprivateFields(privateAry) {
    // var that = this
    setTimeout(function () {
      _.each(privateAry, function (pf) {
        $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    }, 10)
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
   /* _.each(this.state.memberships.privateFields, function (pf) {
      $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
    _.each(this.state.compliances.privateFields, function (pf) {
      $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
    _.each(this.state.licenses.privateFields, function (pf) {
      $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })*/
  }

  async fetchPortfolioDetails() {
    let that = this;
    let data = {};
    let membershipDescription;
    let compliancesDescription;
    let licensesDescription;
    const portfoliodetailsId = that.props.portfolioDetailsId;
    let privateAry = [];
    const responseM = await fetchServiceProviderMemberships(portfoliodetailsId,MEMBERKEY);
    const responseC = await fetchServiceProviderCompliances(portfoliodetailsId,COMPLIANCEKEY);
    const responseL = await fetchServiceProviderLicenses(portfoliodetailsId,LICENSEKEY);
    if (that.context.serviceProviderPortfolio && (that.context.serviceProviderPortfolio.memberships || that.context.serviceProviderPortfolio.compliances || that.context.serviceProviderPortfolio.licenses)) {
      // this.setState({
      //   memberships: that.context.serviceProviderPortfolio.memberships,
      //   compliances: that.context.serviceProviderPortfolio.compliances,
      //   licenses: that.context.serviceProviderPortfolio.licenses
      // });
      data = {
        memberships: that.context.serviceProviderPortfolio.memberships,
        licenses: that.context.serviceProviderPortfolio.licenses,
        compliances: that.context.serviceProviderPortfolio.compliances
      }
      membershipDescription = createValueFromString(that.context.serviceProviderPortfolio.memberships ? that.context.serviceProviderPortfolio.memberships.membershipDescription : null);
      compliancesDescription = createValueFromString(that.context.serviceProviderPortfolio.compliances ? that.context.serviceProviderPortfolio.compliances.compliancesDescription : null);
      licensesDescription = createValueFromString(that.context.serviceProviderPortfolio.licenses ? that.context.serviceProviderPortfolio.licenses.licensesDescription : null);
    } else {  
      if (responseM) {
        var object = responseM;
        object = _.omit(object, '__typename')
        data.memberships = object;
        privateAry = object.privateFields;
        // this.setState({memberships: object});
        // this.setState({privateFields:object.privateFields});

        membershipDescription = createValueFromString(data.memberships ? data.memberships.membershipDescription : null);
      }
      if (responseC) {
        var object = responseC;
        object = _.omit(object, '__typename')
        data.compliances = object;
        // this.setState({compliances: object});

        // var pf = this.state.privateFields;
        if(object.privateFields){
          privateAry = privateAry.concat(object.privateFields);
          // pf = pf.concat(object.privateFields)
          // this.setState({privateFields:pf});
        }
        compliancesDescription = createValueFromString(data.compliances ? data.compliances.compliancesDescription : null);
      } 
      if (responseL) {
        var object = responseL;
        object = _.omit(object, '__typename')
        data.licenses = object;
        // this.setState({licenses: object});

        // var pf = this.state.privateFields;
        if(object.privateFields){
          privateAry = privateAry.concat(object.privateFields);
          // pf = pf.concat(object.privateFields)
          // this.setState({privateFields:pf});
        }
        licensesDescription = createValueFromString(data.licenses ? data.licenses.licensesDescription : null);
      }
      // data = {
      //   memberships: this.state.memberships,
      //   licenses: this.state.licenses,
      //   compliances: this.state.compliances
      // }
    }

    this.setState({ loading: false, data: data, licensesDescription, membershipDescription, compliancesDescription },()=>{
      if (privateAry.length) {
        this.updateprivateFields(privateAry);
      }else {
        const MprivateKeys = responseM && responseM.privateFields ? responseM.privateFields : [];
        this.lockPrivateKeys('memberships', MprivateKeys);
        const LprivateKeys = responseC && responseC.privateFields ? responseC.privateFields : [];
        this.lockPrivateKeys('licenses', LprivateKeys);
        const CprivateKeys = responseL && responseL.privateFields ? responseL.privateFields : [];
        this.lockPrivateKeys('compliances', CprivateKeys);
      } 
    })
  }

/**
   * UI creating lock function
   * */
  lockPrivateKeys(tabname, privateValues) {
    const filterPrivateKeys = _.filter(this.context.portfolioKeys.privateKeys, {tabName: tabname});
    const filterRemovePrivateKeys = _.filter(this.context.portfolioKeys.removePrivateKeys, {tabName: tabname})
    const finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    const keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    var className = this.props.isAdmin ? "admin_header" : "app_header";
    setTimeout(function () {
      $('.main_wrap_scroll').height(WinHeight - ($('.' + className).outerHeight(true) + 120));
      if (WinWidth > 768) {
        $(".main_wrap_scroll").mCustomScrollbar({ theme: "minimal-dark" });
      }
    }, 200);
  }

  handleBlur(value, keyName, object) {
    let details = this.state.data;
    let mcl = details[object];
    mcl = _.omit(details[object], keyName);
    // if (details && mcl) {
    //   mcl[keyName] = value.toString('html');
    //   details[object] = mcl;
    // } else {
      details = _.extend(details, { [object]: { [keyName]: value.toString('html') } });
    // }
    this.setState({ data: details, [keyName]: value }, function () {
      this.sendDataToParent()
    })
  }

  onLockChange(fieldName, field, type, e) {
    let details = this.state.data || {};
    let key = e.target.id;
    var isPrivate = false;
    let className = e.target.className;

    let mcl = details[type];
    if (details && mcl) {
      if (className.indexOf("fa-lock") != -1) {
        mcl[key] = true
        details[type] = mcl;
        isPrivate = true
      } else {
        mcl[key] = false
        details[type] = mcl;
      }
    } else {
      if (className.indexOf("fa-lock") != -1) {
        details = _.extend(details, {[type]: {[key]: true}});
      } else {
        details = _.extend(details, {[type]: {[key]: false}});
      }
    }

    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, tabName: type}
    this.setState({data: details, privateKey:privateKey}, function () {
      this.sendDataToParent()
    })
  }

  sendDataToParent() {
    let data = this.state.data;
    for (var propName in data.compliances) {
      if (data['compliances'][propName] === null || data['compliances'][propName] === undefined) {
        delete data['compliances'][propName];
      }
    }
    for (var propName in data.licenses) {
      if (data['licenses'][propName] === null || data['licenses'][propName] === undefined) {
        delete data['licenses'][propName];
      }
    }
    for (var propName in data.memberships) {
      if (data['memberships'][propName] === null || data['memberships'][propName] === undefined) {
        delete data['memberships'][propName];
      }
    }
    data['memberships'] = _.omit(data['memberships'], ["privateFields"]);
    data['compliances'] = _.omit(data['compliances'], ["privateFields"]);
    data['licenses'] = _.omit(data['licenses'], ["privateFields"]);
    this.props.getServiceProviderMCL(data, this.state.privateKey)
  }

  render() {
    const showLoader = this.state.loading;
    const { membershipDescription, compliancesDescription, licensesDescription } = this.state;
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
          <div>
            <div className=" portfolio-main-wrap">
              <h2>MCL</h2>
              <div className="main_wrap_scroll">
                
                  <div className="col-md-6 col-sm-6 nopadding-left">
                    <div className="panel panel-default panel-form-view">
                      <div className="panel-heading">Membership</div>
                      <div className="panel-body ">
                        <div className="form-group nomargin-bottom panel_input">
                          {/* <textarea placeholder="Describe..." name="membershipDescription" className="form-control" id="cl_about"
                                    defaultValue={this.state.data && this.state.data.memberships && this.state.data.memberships.membershipDescription ? this.state.data.memberships.membershipDescription : ""}
                                    onBlur={this.handleBlur.bind(this, "memberships")}></textarea> */}
                          <MlTextEditor
                            value={membershipDescription}
                            handleOnChange={(value) => this.handleBlur(value, "membershipDescription", "memberships")}
                          />
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                                       id="isMembershipPrivate"
                                       onClick={this.onLockChange.bind(this, "membershipDescription", "isMembershipPrivate", MEMBERKEY)}/>
                        </div>
                      </div>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div className="col-md-6 col-sm-6 nopadding-right">
                    <div className="panel panel-default panel-form-view">
                      <div className="panel-heading">Compliances</div>
                      <div className="panel-body ">
                        <div className="form-group nomargin-bottom panel_input">
                          {/* <textarea placeholder="Describe..." name="compliancesDescription" className="form-control" id="cl_about"
                                    defaultValue={this.state.data && this.state.data.compliances && this.state.data.compliances.compliancesDescription ? this.state.data.compliances.compliancesDescription : ""}
                                    onBlur={this.handleBlur.bind(this, "compliances")}></textarea> */}
                          <MlTextEditor
                            value={compliancesDescription}
                            handleOnChange={(value) => this.handleBlur(value, "compliancesDescription", "compliances")}
                          />
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                                       id="isCompliancesPrivate"
                                       onClick={this.onLockChange.bind(this, "compliancesDescription", "isCompliancesPrivate", COMPLIANCEKEY)}/>
                        </div>
                      </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="panel panel-default panel-form-view">
                      <div className="panel-heading">Licenses</div>
                      <div className="panel-body ">
                        <div className="form-group nomargin-bottom panel_input">
                        {/* <textarea placeholder="Describe..." name="licensesDescription" className="form-control" id="cl_about"
                          defaultValue={this.state.data && this.state.data.licenses && this.state.data.licenses.licensesDescription ? this.state.data.licenses.licensesDescription : ""}
                          onBlur={this.handleBlur.bind(this, "licenses")}></textarea> */}
                        <MlTextEditor
                          value={licensesDescription}
                          handleOnChange={(value) => this.handleBlur(value, "licensesDescription", "licenses")}
                        />
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                                       id="isLicensesPrivate"
                                       onClick={this.onLockChange.bind(this, "licensesDescription", "isLicensesPrivate", LICENSEKEY)}/>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>)}
      </div>
    )
  }
};

MlServiceProviderMCL.contextTypes = {
  serviceProviderPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
