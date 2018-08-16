import React, {Component} from "react";
import ScrollArea from "react-scrollbar";
import _ from "lodash";
var FontAwesome = require('react-fontawesome');
import {
  fetchServiceProviderMemberships,
  fetchServiceProviderCompliances,
  fetchServiceProviderLicenses
} from "../../../actions/findPortfolioServiceProviderDetails";
import {initializeMlAnnotator} from "../../../../../../commons/annotator/mlAnnotator";
import {createAnnotationActionHandler} from "../../../actions/updatePortfolioDetails";
import {findAnnotations} from "../../../../../../commons/annotator/findAnnotations";
import {validateUserForAnnotation} from '../../../actions/findPortfolioIdeatorDetails';
import NoData from '../../../../../../commons/components/noData/noData';
import MlLoader from "../../../../../../commons/components/loader/loader";
import MlTextEditor, {createValueFromString} from "../../../../../../commons/components/textEditor/MlTextEditor";

export default class MlServiceProviderViewMCL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberships: {},
      compliances: {},
      licenses: {},
      data: {},
      annotations: [],
      content: {},
      isUserValidForAnnotation:false,
      loading: true
    }
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
    this.validateUserForAnnotation(this)
  }

  componentDidMount() {
    //this.initalizeAnnotaor()    
    // this.fetchPortfolioStartupDetails();
    this.validateUserForAnnotation();
  }

  componentDidUpdate() {
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    var className = this.props.isAdmin ? "admin_header" : "app_header"
    setTimeout(function () {
      $('.main_wrap_scroll').height(WinHeight - ($('.' + className).outerHeight(true) + 120));
      if (WinWidth > 768) {
        $(".main_wrap_scroll").mCustomScrollbar({ theme: "minimal-dark" });
      }
    }, 200);
  }

  componentWillMount() {
    const resp = this.fetchPortfolioStartupDetails();
    return resp
  }

  async fetchPortfolioStartupDetails() {
    let that = this;
    let data = {};
    let privateFields = [];
    let membershipDescription;
    let compliancesDescription;
    let licensesDescription;
    const portfoliodetailsId = that.props.portfolioDetailsId;
    const responseM = await fetchServiceProviderMemberships(portfoliodetailsId);
    if (responseM) {
      data.memberships = responseM;
      privateFields = responseM.memberships && responseM.memberships.privateFields && responseM.memberships.privateFields.length ? responseM.memberships.privateFields.concat(privateFields) : privateFields;
    }
    const responseC = await fetchServiceProviderCompliances(portfoliodetailsId);
    if (responseC) {
      data.compliances = responseC;
      privateFields = responseC.memberships && responseC.compliances.privateFields && responseC.compliances.privateFields.length ? responseC.compliances.privateFields.concat(privateFields) : privateFields; 
    }
    const responseL = await fetchServiceProviderLicenses(portfoliodetailsId);
    if (responseL) {
      data.licenses = responseL;
      privateFields = responseL.licenses && responseL.licenses.privateFields && responseL.licenses.privateFields.length ? responseL.licenses.privateFields.concat(privateFields) : privateFields;
    }
    // data = {
    //   memberships: this.state.memberships,
    //   licenses: this.state.licenses,
    //   compliances: this.state.compliances
    // }
    membershipDescription = createValueFromString(data.memberships ? data.memberships.membershipDescription : null);
    compliancesDescription = createValueFromString(data.compliances ? data.compliances.compliancesDescription : null);
    licensesDescription = createValueFromString(data.licenses ? data.licenses.licensesDescription : null);
    this.setState({ loading: false, data: data, membershipDescription, compliancesDescription, licensesDescription }, function () {
      this.fetchAnnotations();
      _.each(privateFields, function (pf) {
        $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    })
  }

  initalizeAnnotaor() {
    initializeMlAnnotator(this.annotatorEvents.bind(this))
    this.state.content = jQuery("#annotatorContent").annotator();
    this.state.content.annotator('addPlugin', 'MyPlugin', {
      pluginInit: function () {
      }
    });
  }

  annotatorEvents(event, annotation, editor) {
    if (!annotation)
      return;
    switch (event) {
      case 'create': {
        let response = this.createAnnotations(annotation);
      }
        break;
      case 'update': {
      }
        break;
      case 'annotationViewer': {
        if (annotation[0].id) {
          this.props.getSelectedAnnotations(annotation[0]);
        } else {
          this.props.getSelectedAnnotations(annotation[1]);
        }

      }
        break;
    }
  }

  async createAnnotations(annotation) {
    let details = {portfolioId: this.props.portfolioDetailsId, docId: "serviceproviderMCL", quote: JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if (response && response.success) {
      this.fetchAnnotations(true);
    }
    return response;
  }


  async fetchAnnotations(isCreate) {
    const response = await findAnnotations(this.props.portfolioDetailsId, "serviceproviderMCL");
    let resp = JSON.parse(response.result);
    let annotations = this.state.annotations;
    this.setState({annotations: JSON.parse(response.result)})

    let quotes = [];

    _.each(this.state.annotations, function (value) {
      quotes.push({
        "id": value.annotatorId,
        "text": value.quote.text,
        "quote": value.quote.quote,
        "ranges": value.quote.ranges,
        "userName": value.userName,
        "roleName": value.roleName,
        "profileImage": value.profileImage,
        "createdAt": value.createdAt
      })
    })
    if(quotes && quotes.length>0){
      this.state.content.annotator('loadAnnotations', quotes);
      return response
    }else {
      return response
    }
  }

  async validateUserForAnnotation() {
    const portfolioId = this.props.portfolioDetailsId
    const response = await validateUserForAnnotation(portfolioId);
    if (response && !this.state.isUserValidForAnnotation) {
      this.setState({isUserValidForAnnotation:response})

      this.initalizeAnnotaor()

      this.fetchAnnotations();
    }
  }


  render() {
    const showLoader = this.state.loading;
    const { membershipDescription, compliancesDescription, licensesDescription } = this.state;
    return (
      <div>
          {showLoader === true ? ( <MlLoader/>) : (
            <div className="portfolio-main-wrap" id="annotatorContent">
              <h2>MCL</h2>
              <div className="main_wrap_scroll hide_unlock">
                  <div className="col-md-6 col-sm-6 nopadding-left">
                    <div className="panel panel-default panel-form-view">
                      <div className="panel-heading">Memberships</div>
                      <div className="panel-body ">
                        <div className="form-group nomargin-bottom panel_input">
                          {this.state.data.memberships && this.state.data.memberships.membershipDescription ?
                            <MlTextEditor
                              value={membershipDescription}
                              isReadOnly={true}
                            /> :
                            <div className="portfolio-main-wrap">
                              <NoData tabName={this.props.tabName} />
                            </div>}
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isMembershipPrivate" />
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
                          {this.state.data.compliances && this.state.data.compliances.compliancesDescription ?
                            <MlTextEditor
                              value={compliancesDescription}
                              isReadOnly={true}
                            /> :
                            <div className="portfolio-main-wrap">
                              <NoData tabName={this.props.tabName} />
                            </div>}
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isCompliancesPrivate" />
                        </div>
                      </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="panel panel-default panel-form-view">
                      <div className="panel-heading">Licenses</div>
                      <div className="panel-body ">
                        <div className="form-group nomargin-bottom panel_input">
                          {this.state.data.licenses && this.state.data.licenses.licensesDescription ?
                            <MlTextEditor
                              value={licensesDescription}
                              isReadOnly={true}
                            /> :
                            <div className="portfolio-main-wrap">
                              <NoData tabName={this.props.tabName} />
                            </div>}
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isLicensesPrivate" />
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

// view_req_textarea_icon