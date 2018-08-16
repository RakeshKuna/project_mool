/**
 * Created by vishwadeep on 21/8/17.
 */
import React from 'react';
import {render} from 'react-dom';
// import {fetchStartupDetailsHandler} from '../../actions/findPortfolioStartupDetails'
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../../commons/components/noData/noData';
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
const KEY = 'clients'

export default class MlStartupViewClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {startupBranchesList: []};
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);

  }

  componentDidMount() {
    this.initalizeAnnotaor()
    this.fetchAnnotations();
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight - (68 + $('.admin_header').outerHeight(true)));

  }

  // componentDidMount() {
  //   this.initalizeAnnotaor()
  //   this.fetchAnnotations();
  //   var WinHeight = $(window).height();
  //   $('.main_wrap_scroll ').height(WinHeight - (68 + $('.admin_header').outerHeight(true)));
  // }

  // componentWillMount() {
  //   const resp = this.fetchPortfolioStartupDetails();
  //   return resp
  // }

  // async fetchPortfolioStartupDetails() {
  //   let that = this;
  //   let portfoliodetailsId = that.props.portfolioDetailsId;
  //   const response = await fetchStartupDetailsHandler(portfoliodetailsId, KEY);
  //   if (response) {
  //     this.setState({loading: false, startupAboutUsList: response});
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
      docId: "startupClients",
      quote: JSON.stringify(annotation)
    }
    const response = await createAnnotationActionHandler(details);
    if (response && response.success) {
      this.fetchAnnotations(true);
    }
    return response;
  }


  async fetchAnnotations(isCreate) {
    const response = await findAnnotations(this.props.portfolioDetailsId, "startupClients");
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

  // async fetchPortfolioStartupDetails() {
  //   let that = this;
  //   let portfoliodetailsId = that.props.portfolioDetailsId;
  //   const response = await fetchStartupDetailsHandler(portfoliodetailsId, KEY);
  //   if (response) {
  //     this.setState({loading: false, startupBranchesList: response});
  //   }
  // }

  render() {
    let that = this;
    // let branchesArray = that.state.startupBranchesList || [];
    const clientsArray = that.props.clientsDetails || [];
    return (
      <div id="annotatorContent">
        <h2>Clients</h2>
        <div>
          {clientsArray && clientsArray.length?(
            <div className="col-lg-12">
              <div className="row">
                {clientsArray.map(function (details, idx) {
                  return (<div className="col-lg-2 col-md-3 col-xs-12 col-sm-4" key={idx}>
                    <div className="team-block">
                      <img
                        src={details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/no_image.png"}
                        className="team_img"/>
                      <h3>
                        {details.companyName && details.companyName} <br />
                      </h3>
                    </div>
                  </div>)
                })}
              </div>
            </div>
          ):(<NoData tabName={this.props.tabName}/>)}
        </div>

      </div>
    )
  }
}
// && branchesArray.clients && branchesArray.clients
