import React from 'react';
import {render} from 'react-dom';
import {findServiceProviderLookingForActionHandler, validateUserForAnnotation} from '../../../actions/findPortfolioServiceProviderDetails'
import {initalizeFloatLabel} from '../../../../../utils/formElemUtil';
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import NoData from '../../../../../../commons/components/noData/noData';
import MlLoader from "../../../../../../commons/components/loader/loader";

const key = 'lookingFor';
export default class MlServiceProviderLookingForView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceProviderLookingFor: [],
      isUserValidForAnnotation: false,
      loading:true
    }
    this.fetchPortfolioInfo.bind(this);
    // this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
    this.validateUserForAnnotation(this)
  }

  initalizeAnnotaor() {
    initializeMlAnnotator(this.annotatorEvents.bind(this))
    this.state.content = jQuery("#lookingForContent").annotator();
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
      docId: "serviceProviderLookingFor",
      quote: JSON.stringify(annotation)
    }
    const response = await createAnnotationActionHandler(details);
    if (response && response.success) {
      this.fetchAnnotations(true);
    }
    return response;
  }

  async fetchAnnotations(isCreate) {
    const response = await findAnnotations(this.props.portfolioDetailsId, "serviceProviderLookingFor");
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

  componentWillMount() {
    let resp = this.validateUserForAnnotation();
    return resp
  }

  componentDidMount() {
    $('.actions_switch').click();
    this.fetchPortfolioInfo();
    initalizeFloatLabel();
  }

  async validateUserForAnnotation() {
    const portfolioId = this.props.portfolioDetailsId
    const response = await validateUserForAnnotation(portfolioId);
    if (response && !this.state.isUserValidForAnnotation) {
      this.setState({isUserValidForAnnotation: response})
      this.initalizeAnnotaor()
      this.fetchAnnotations();
    }
  }

  async fetchPortfolioInfo() {
    const response = await findServiceProviderLookingForActionHandler(this.props.portfolioDetailsId, key);
    if (response) {
      this.setState({serviceProviderLookingFor: response,loading:false});
      _.each(response.privateFields, function (pf) {
        $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    }else
      this.setState({loading: false})
  }

  render() {
    let that = this;
    let lookingforArray = that.state.serviceProviderLookingFor || [];
    let loading = this.state.loading;
    return (
      <div>
        {loading === true ? ( <MlLoader/>) : (
          <div>
            {_.isEmpty(lookingforArray) ?(
              <div className="portfolio-main-wrap">
                <NoData tabName={this.props.tabName}/>
              </div>):(
              <div id="annotatorContent">
                <h2>Looking For</h2>
                <div className="col-lg-12">
                  <div className="row">
                    {lookingforArray && lookingforArray.map(function (details, idx) {
                      return (<div className="col-lg-2 col-md-3 col-sm-4" key={idx}>
                        <div className="team-block">
                          <span className="ml my-ml-browser_3"/>
                          <h3 title={details.lookingForName}>
                            {details.lookingForName && details.lookingForName}
                          </h3>
                        </div>
                      </div>)
                    })}
                  </div>
                </div>
              </div> )
            }
          </div>)}
      </div>
    )
  }
}
