import React, {Component, PropTypes}  from "react";
import _ from 'lodash';
import MlLoader from '../../../../../../commons/components/loader/loader'
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../utils/formElemUtil';
import {fetchInstitutionDetailsHandler} from '../../../actions/findPortfolioInstitutionDetails'
import MlTextEditor, {createValueFromString} from "../../../../../../commons/components/textEditor/MlTextEditor";

const MEMBERKEY = 'memberships'
const LICENSEKEY = 'licenses'
const COMPLIANCEKEY = 'compliances'

export default class MlInstitutionEditMCL extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      memberships: {},
      licenses: {},
      compliances: {},
      privateKey: {},
      privateFields: []
    }
    this.onLockChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.updateprivateFields.bind(this)
    // this.fetchPortfolioDetails.bind(this);
  }

  componentWillMount() {
   const resp = this.fetchPortfolioDetails();
   return resp;
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
    //this.updateprivateFields();
  }

  updateprivateFields() {
    var that = this
    setTimeout(function () {
      _.each(that.state.privateFields, function (pf) {
        $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    }, 10)
  }

  async fetchPortfolioDetails() {
    let that = this;
    let data = {};
    let portfoliodetailsId = that.props.portfolioDetailsId;
    let membershipDescription;
    let complianceDescription;
    let licenseDescription;
    var responseM = await fetchInstitutionDetailsHandler(portfoliodetailsId, MEMBERKEY);
    var responseC = await fetchInstitutionDetailsHandler(portfoliodetailsId, COMPLIANCEKEY);
    var responseL = await fetchInstitutionDetailsHandler(portfoliodetailsId, LICENSEKEY);

    if (that.context.institutionPortfolio && (that.context.institutionPortfolio.memberships || that.context.institutionPortfolio.compliances || that.context.institutionPortfolio.licenses)) {
      this.setState({
        memberships: that.context.institutionPortfolio.memberships,
        compliances: that.context.institutionPortfolio.compliances,
        licenses: that.context.institutionPortfolio.licenses
      });
      data = {
        memberships: that.context.institutionPortfolio.memberships,
        licenses: that.context.institutionPortfolio.licenses,
        compliances: that.context.institutionPortfolio.compliances
      }
      const editorValues = this.getBaseValues(data);
      membershipDescription = editorValues.membershipDescription;
      complianceDescription = editorValues.complianceDescription;
      licenseDescription = editorValues.licenseDescription;


      this.setState({loading: false,data:data, membershipDescription}, () => {
        var MprivateKeys = responseM && responseM.memberships? responseM.memberships.privateFields: [];
        this.lockPrivateKeys('memberships', MprivateKeys);
      });

      this.setState({loading: false, data: data,licenseDescription}, () => {
        var LprivateKeys = responseL && responseL.licenses? responseL.licenses.privateFields: [];
        this.lockPrivateKeys('licenses', LprivateKeys);
      });

      this.setState({loading: false, data: data,complianceDescription}, () => {
        var CprivateKeys = responseC && responseC.compliances? responseC.compliances.privateFields: [];
        this.lockPrivateKeys('compliances', CprivateKeys);
      });
    } else {
      var pf;
      if (responseM && responseM.memberships) {
        var object = responseM.memberships;
        object = _.omit(object, '__typename')
        this.setState({memberships: object});
        pf = object.privateFields;
      }
      if (responseC && responseC.compliances) {
        var object = responseC.compliances;
        object = _.omit(object, '__typename')
        this.setState({compliances: object});

        if (object.privateFields) {
          pf = pf.concat(object.privateFields)
        }
      }
      if (responseL && responseL.licenses) {
        var object = responseL.licenses;
        object = _.omit(object, '__typename')
        this.setState({licenses: object});
        if (object.privateFields) {
          pf = pf.concat(object.privateFields)
        }
      }
      this.setState({privateFields:pf});
      data = {
        memberships: this.state.memberships,
        licenses: this.state.licenses,
        compliances: this.state.compliances
      }
      const editorValues = this.getBaseValues(data);
      membershipDescription = editorValues.membershipDescription;
      complianceDescription = editorValues.complianceDescription;
      licenseDescription = editorValues.licenseDescription;

      // this.setState({loading: false, data: data})
      // this.updateprivateFields();
      this.setState({ loading: false, data: data, privateFields: pf, membershipDescription, complianceDescription, licenseDescription });
      this.updateprivateFields();
    }
  }
  getBaseValues(data) {
    membershipDescription = createValueFromString(data.memberships ? data.memberships.membershipDescription : null);
    complianceDescription = createValueFromString(data.compliances ? data.compliances.complianceDescription : null);
    licenseDescription = createValueFromString(data.licenses ? data.licenses.licenseDescription : null);
    return { membershipDescription, complianceDescription, licenseDescription }
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  handleBlur(value, keyName, object) {
    let details = this.state.data;
    // let name = e.target.name;
    // let mcl = details[type];
    let mcl = details[object];
    mcl = _.omit(details[object], keyName);
    if (details && mcl) {
      // mcl[name] = e.target.value
      // details[type] = mcl;
      mcl[keyName] = value.toString('html');
      details[object] = mcl;
    } else {
      details = _.extend(details, { [object]: { [keyName]: value.toString('html') } });
      // details = _.extend(details, {[type]: {[name]: e.target.value}});
    }
    this.setState({data: details,[keyName]: value}, function () {
      this.sendDataToParent()
    })
  }

  onLockChange(fieldName, type, tabName, e) {
    var isPrivate = false;
    let details = this.state.data || {};
    let key = e.target.id;
    let className = e.target.className;
    let mcl = details[type];
    if (details && mcl) {
      if (className.indexOf("fa-lock") != -1) {
        mcl[key] = true
        details[type] = mcl;
      } else {
        mcl[key] = false
        details[type] = mcl;
      }
    } else {
      if (className.indexOf("fa-lock") != -1) {
        details = _.extend(details, {[type]: {[key]: true}});
        isPrivate = true;
      } else {
        details = _.extend(details, {[type]: {[key]: false}});
      }
    }

    var privateKey = {
      keyName: fieldName,
      booleanKey: type,
      isPrivate: isPrivate,
      tabName: tabName
    }
    this.setState({data: details, privateKey: privateKey}, function () {
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

    if (data['memberships'])
      data['memberships'] = _.omit(data['memberships'], ["privateFields"])

    if (data['licenses'])
      data['licenses'] = _.omit(data['licenses'], ["privateFields"])

    if (data['compliances'])
      data['compliances'] = _.omit(data['compliances'], ["privateFields"])

    this.props.getInstitutionMCL(data, this.state.privateKey)
  }

  /**
   * UI creating lock function
   * */
  lockPrivateKeys(tabname, privateValues) {
    var filterPrivateKeys = _.filter(this.context.portfolioKeys.privateKeys, {tabName: tabname});
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys.removePrivateKeys, {tabName: tabname})
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
    // setTimeout(function () {
    _.each(keys, function (pf) {
      $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
    // }, 10)
  }

  render() {
    const showLoader = this.state.loading;
    const { membershipDescription, complianceDescription, licenseDescription } = this.state;
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
          <div className="portfolio-main-wrap">
            <h2>MCL</h2>

            <div className="col-md-6 col-sm-6 nopadding-left">
              <div className="panel panel-default panel-form-view">
                <div className="panel-heading">Membership</div>
                <div className="panel-body ">
                  <div className="form-group nomargin-bottom panel_input">
                  <MlTextEditor
                        value={membershipDescription}
                        handleOnChange={(value) => this.handleBlur(value, "membershipDescription", "memberships")}
                      />
                    {/* <textarea placeholder="Describe..." name="membershipDescription" className="form-control"
                              id="cl_about"
                              defaultValue={this.state.data && this.state.data.memberships && this.state.data.memberships.membershipDescription ? this.state.data.memberships.membershipDescription : ""}
                              onBlur={this.handleBlur.bind(this, "memberships")}></textarea> */}
                    <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isMDPrivate"
                                 onClick={this.onLockChange.bind(this, "membershipDescription", "isMDPrivate", MEMBERKEY)}/>
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
                        value={complianceDescription}
                        handleOnChange={(value) => this.handleBlur(value, "complianceDescription", "compliances")}
                      />
                    {/* <textarea placeholder="Describe..." name="complianceDescription" className="form-control"
                              id="cl_about"
                              defaultValue={this.state.data && this.state.data.compliances && this.state.data.compliances.complianceDescription ? this.state.data.compliances.complianceDescription : ""}
                              onBlur={this.handleBlur.bind(this, "compliances")}></textarea> */}
                    <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isCDPrivate"
                                 onClick={this.onLockChange.bind(this, "complianceDescription", "isCDPrivate", COMPLIANCEKEY)}/>
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
              <div className="panel panel-default panel-form-view">
                <div className="panel-heading">Licenses</div>
                <div className="panel-body ">
                  <div className="form-group nomargin-bottom panel_input">
                  <MlTextEditor
                        value={licenseDescription}
                        handleOnChange={(value) => this.handleBlur(value, "licenseDescription", "licenses")}
                      />
                    {/* <textarea placeholder="Describe..." name="licenseDescription" className="form-control" id="cl_about"
                              defaultValue={this.state.data && this.state.data.licenses && this.state.data.licenses.licenseDescription ? this.state.data.licenses.licenseDescription : ""}
                              onBlur={this.handleBlur.bind(this, "licenses")}></textarea> */}
                    <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isLDPrivate"
                                 onClick={this.onLockChange.bind(this, "licenseDescription", "isLDPrivate", LICENSEKEY)}/>
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
MlInstitutionEditMCL.contextTypes = {
  institutionPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
