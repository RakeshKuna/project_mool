import React, { Component, PropTypes }  from "react";
import ScrollArea from 'react-scrollbar';
import _ from 'lodash';
var FontAwesome = require('react-fontawesome');

import MlLoader from '../../../../../../commons/components/loader/loader'
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../utils/formElemUtil';
import {fetchCompanyDetailsHandler} from "../../../actions/findCompanyPortfolioDetails";
import MlTextEditor, { createValueFromString } from "../../../../../../commons/components/textEditor/MlTextEditor";

const MEMBERKEY = 'memberships'
const LICENSEKEY = 'licenses'
const COMPLIANCEKEY = 'compliances'

export default class MlCompanyMCL extends Component{

  constructor(props, context){
    super(props);
    this.state={
      loading:true,
      data:{},
      memberships:{},
      licenses:{},
      compliances:{},
      privateKey:{},
      privateFields:[]
    }
    this.onLockChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.fetchPortfolioDetails.bind(this);
    // this.updateprivateFields.bind(this)
  }

  componentWillMount(){
    const resp = this.fetchPortfolioDetails();
    return resp;
  }

  updateprivateFields(privateAry) {
    // var that = this
    setTimeout(function () {
      _.each(privateAry, function (pf) {
        $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    }, 10)
  }

  componentDidUpdate(){
    OnLockSwitch();
    dataVisibilityHandler();
  }

  async fetchPortfolioDetails() {
    const that = this;
    const portfoliodetailsId = that.props.portfolioDetailsId;
    let data = {};
    let membershipsDescription;
    let compliancesDescription;
    let licensesDescription;
    // let valueFromContext = true;
    let privateAry = [];
    const responseM = await fetchCompanyDetailsHandler(portfoliodetailsId, MEMBERKEY);
    const responseC = await fetchCompanyDetailsHandler(portfoliodetailsId, COMPLIANCEKEY);
    const responseL = await fetchCompanyDetailsHandler(portfoliodetailsId, LICENSEKEY);
    
    if(that.context.companyPortfolio && (that.context.companyPortfolio.memberships || that.context.companyPortfolio.compliances || that.context.companyPortfolio.licenses)){
      data = {
        memberships:that.context.companyPortfolio.memberships,
        licenses: that.context.companyPortfolio.compliances,
        compliances:that.context.companyPortfolio.licenses
      }
      membershipsDescription = createValueFromString(that.context.companyPortfolio.memberships ? that.context.companyPortfolio.memberships.membershipsDescription : null);
      compliancesDescription = createValueFromString(that.context.companyPortfolio.compliances ? that.context.companyPortfolio.compliances.compliancesDescription : null);
      licensesDescription = createValueFromString(that.context.companyPortfolio.licenses ? that.context.companyPortfolio.licenses.licensesDescription : null);

    }else {
      // var responseM = await fetchCompanyDetailsHandler(portfoliodetailsId, MEMBERKEY);
      if (responseM && responseM.memberships) {
        let object = responseM.memberships;
        object = _.omit(object, '__typename')
        data.memberships = object;
        privateAry = object.privateFields;
        // this.setState({privateFields:object.privateFields});
        membershipsDescription = createValueFromString(data.memberships ? data.memberships.membershipsDescription : null);
      }

      // var responseC = await fetchCompanyDetailsHandler(portfoliodetailsId, COMPLIANCEKEY);
      if (responseC && responseC.compliances) {
        var object = responseC.compliances;
        object = _.omit(object, '__typename')
        data.compliances = object;
        // var pf = this.state.privateFields;
        if(object.privateFields){
          // pf = pf.concat(object.privateFields)
          privateAry = privateAry.concat(object.privateFields);
          // this.setState({privateFields:pf});
        }
        compliancesDescription = createValueFromString(data.compliances ? data.compliances.compliancesDescription : null);
      }

      // var responseL = await fetchCompanyDetailsHandler(portfoliodetailsId, LICENSEKEY);
      if (responseL && responseL.licenses) {
        var object = responseL.licenses;
        object = _.omit(object, '__typename')
        data.licenses = object;
        // var pf = this.state.privateFields;
        if(object.privateFields){
          // pf = pf.concat(object.privateFields);
          privateAry = privateAry.concat(object.privateFields);
          // this.setState({privateFields:pf});
        }
        licensesDescription = createValueFromString(data.licenses ? data.licenses.licensesDescription : null);
      }
    }

    this.setState({ loading: false, data: data, membershipsDescription, compliancesDescription, licensesDescription }, () => {
      if (privateAry.length) {
        this.updateprivateFields(privateAry);
      }else {
        const MprivateKeys = responseM && responseM.memberships ? responseM.memberships.privateFields : [];
        this.lockPrivateKeys('memberships', MprivateKeys);
        const LprivateKeys = responseL && responseL.licenses ? responseL.licenses.privateFields : [];
        this.lockPrivateKeys('licenses', LprivateKeys);
        const CprivateKeys = responseC && responseC.compliances ? responseC.compliances.privateFields : [];
        this.lockPrivateKeys('compliances', CprivateKeys);
      } 
    });
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

  componentDidMount(){
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

  handleBlur(value, keyName, object){
    let details = this.state.data;
    let mcl = details[object];
    mcl = _.omit(details[object], keyName);

    // if(details && mcl){
    //   mcl[keyName] = value.toString('html');
    //   details[object] = mcl;
    // }else{
      details = _.extend(details, { [object]: { [keyName]: value.toString('html') } });
    // }
    this.setState({data:details,[keyName]: value}, function () {
      this.sendDataToParent()
    })
  }

  onLockChange(fieldName, type, tabName, e){
    let isPrivate = false;
    let details = this.state.data||{};
    let key = e.target.id;
    let className = e.target.className;

    let mcl = details[type];
    if(details && mcl){
      if(className.indexOf("fa-lock") != -1){
        mcl[key] = true
        details[type] = mcl;
        isPrivate = true;
      }else{
        mcl[key] = false
        details[type] = mcl;
      }
    }else{
      if(className.indexOf("fa-lock") != -1){
        details=_.extend(details,{[type]:{[key]:true}});
        isPrivate = true;
      }else{
        details=_.extend(details,{[type]:{[key]:false}});
      }
    }

    var privateKey = {
      keyName: fieldName,
      booleanKey: type,
      isPrivate: isPrivate,
      tabName: tabName
    }
    this.setState({data:details, privateKey: privateKey}, function () {
      this.sendDataToParent()
    })
  }

  sendDataToParent(){
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

    if(data['memberships'])
      data['memberships'] = _.omit(data['memberships'], ["privateFields"])

    if(data['licenses'])
      data['licenses'] = _.omit(data['licenses'], ["privateFields"])

    if(data['compliances'])
      data['compliances'] = _.omit(data['compliances'], ["privateFields"])

    this.props.getMCL(data, this.state.privateKey)
  }

  render(){
    const showLoader = this.state.loading;
    const { membershipsDescription, compliancesDescription, licensesDescription } = this.state;
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
        <div className="portfolio-main-wrap">
          <h2>MCL</h2>
            <div className="main_wrap_scroll">
              <div className="col-md-6 col-sm-6 nopadding-left">
                <div className="panel panel-default panel-form-view">
                  <div className="panel-heading">Membership </div>
                  <div className="panel-body ">
                    <div className="form-group nomargin-bottom panel_input">
                      <MlTextEditor
                        value={membershipsDescription}
                        handleOnChange={(value) => this.handleBlur(value, "membershipsDescription", "memberships")}
                      />
                      {/* <textarea placeholder="Describe..." name="membershipsDescription" className="form-control" id="cl_about" defaultValue={this.state.memberships&&this.state.memberships.membershipsDescription?this.state.memberships.membershipsDescription:""}  onBlur={this.handleBlur.bind(this, "memberships")}></textarea> */}
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isMembershipsDescriptionPrivate"  onClick={this.onLockChange.bind(this,"membershipsDescription", "isMembershipsDescriptionPrivate" , MEMBERKEY)}/>
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
                      <MlTextEditor
                        value={compliancesDescription}
                        handleOnChange={(value) => this.handleBlur(value, "compliancesDescription", "compliances")}
                      />
                      {/* <textarea placeholder="Describe..." name="compliancesDescription" className="form-control" id="cl_about" defaultValue={this.state.compliances&&this.state.compliances.compliancesDescription?this.state.compliances.compliancesDescription:""}  onBlur={this.handleBlur.bind(this, "compliances")}></textarea> */}
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isCompliancesDescriptionPrivate" onClick={this.onLockChange.bind(this, "compliancesDescription", "isCompliancesDescriptionPrivate", COMPLIANCEKEY)}/>
                    </div>
                  </div>
                </div>
                <div className="clearfix"></div>
                <div className="panel panel-default panel-form-view">
                  <div className="panel-heading">Licenses </div>
                  <div className="panel-body ">
                    <div className="form-group nomargin-bottom panel_input">
                      <MlTextEditor
                        value={licensesDescription}
                        handleOnChange={(value) => this.handleBlur(value, "licensesDescription", "licenses")}
                      />
                      {/* <textarea placeholder="Describe..." name="licensesDescription" className="form-control" id="cl_about" defaultValue={this.state.licenses&&this.state.licenses.licensesDescription?this.state.licenses.licensesDescription:""}  onBlur={this.handleBlur.bind(this, "licenses")}></textarea> */}
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isLicensesDescriptionPrivate" onClick={this.onLockChange.bind(this, "licensesDescription", "isLicensesDescriptionPrivate", LICENSEKEY)} />
                    </div>
                  </div>
                </div>
              </div>
              </div>
          </div>
        )}
      </div>
    )
  }
};

MlCompanyMCL.contextTypes = {
  companyPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
