/**
 * Created by Birendra on 21/8/17.
 */
import React from 'react';
// import {fetchInstitutionDetailsHandler} from '../../actions/findPortfolioInstitutionDetails'
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import {validateUserForAnnotation} from '../../../../actions/findPortfolioIdeatorDetails'
import NoData from '../../../../../../../commons/components/noData/noData';
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
const KEY = 'clients'

export default class MlInstitutionViewClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {institutionBranchesList: []};
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);

  }

  componentDidMount() {
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight - (68 + $('.admin_header').outerHeight(true)));
  }


  componentWillMount(){
    let resp = this.validateUserForAnnotation();
    return resp
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


  // componentDidMount() {
  //   this.initalizeAnnotaor()
  //   this.fetchAnnotations();
  //   var WinHeight = $(window).height();
  //   $('.main_wrap_scroll ').height(WinHeight - (68 + $('.admin_header').outerHeight(true)));
  // }

  // componentWillMount() {
  //   const resp = this.fetchPortfolioInstitutionDetails();
  //   return resp
  // }

  // async fetchPortfolioInstitutionDetails() {
  //   let that = this;
  //   let portfoliodetailsId = that.props.portfolioDetailsId;
  //   const response = await fetchInstitutionDetailsHandler(portfoliodetailsId, KEY);
  //   if (response) {
  //     this.setState({loading: false, institutionAboutUsList: response});
  //   }
  // }

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
    let details = {
      portfolioId: this.props.portfolioDetailsId,
      docId: "institutionClients",
      quote: JSON.stringify(annotation)
    }
    const response = await createAnnotationActionHandler(details);
    if (response && response.success) {
      this.fetchAnnotations(true);
    }
    return response;
  }


  async fetchAnnotations(isCreate) {
    const response = await findAnnotations(this.props.portfolioDetailsId, "institutionClients");
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
    this.state.content.annotator('loadAnnotations', quotes);

    return response;
  }

  // async fetchPortfolioInstitutionDetails() {
  //   let that = this;
  //   let portfoliodetailsId = that.props.portfolioDetailsId;
  //   const response = await fetchInstitutionDetailsHandler(portfoliodetailsId, KEY);
  //   if (response) {
  //     this.setState({loading: false, institutionBranchesList: response});
  //   }
  // }

  render() {
    let that = this;
    // let branchesArray = that.state.institutionBranchesList || [];
    let clientsArray = that.props.clientsDetails || [];
    return (
      <div id="annotatorContent">
        <h2>Clients</h2>
        {clientsArray && clientsArray.length?<div className="col-lg-12">
          <div className="row">
            {clientsArray.map(function (details, idx) {
              return (<div className="col-lg-2 col-md-3 col-xs-12 col-sm-4" key={idx}>
                <div className="team-block">
                  <img src={details.logo && generateAbsolutePath(details.logo.fileUrl)} className="team_img"/>
                  <h3>
                    {details.companyName && details.companyName} <br />
                  </h3>
                </div>
              </div>)
            })}
          </div>
        </div>:(<NoData tabName={this.props.tabName}/>)}
      </div>
    )
  }
}
// && branchesArray.clients && branchesArray.clients
