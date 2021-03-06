import React from 'react';
import {fetchInstitutionDetailsHandler} from '../../../actions/findPortfolioInstitutionDetails'
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../commons/components/noData/noData';
import MlLoader from "../../../../../../commons/components/loader/loader";
import MlGenericAwardsView from "../../commons/MlGenericAwardsView";

const KEY = 'awardsRecognition'

export default class MlInstitutionViewAwards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {institutionAwardsList: [],loading:true};
    this.fetchPortfolioInstitutionDetails.bind(this);
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
  }


/*  componentDidMount(){
    this.initalizeAnnotaor()
    this.fetchAnnotations();
  }*/

  componentWillMount(){
    this.fetchPortfolioInstitutionDetails();
  }

  initalizeAnnotaor(){
    initializeMlAnnotator(this.annotatorEvents.bind(this))
    this.state.content = jQuery("#annotatorContent").annotator();
    this.state.content.annotator('addPlugin', 'MyPlugin', {
      pluginInit:  function () {
      }
    });
  }

  annotatorEvents(event, annotation, editor){
    if(!annotation)
      return;
    switch (event){
      case 'create':{
        let response = this.createAnnotations(annotation);
      }
        break;
      case 'update':{
      }
        break;
      case 'annotationViewer':{
        if(annotation[0].id){
          this.props.getSelectedAnnotations(annotation[0]);
        }else{
          this.props.getSelectedAnnotations(annotation[1]);
        }

      }
        break;
    }
  }

  async createAnnotations(annotation){
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"institutionAwards", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "institutionAwards");
    let resp = JSON.parse(response.result);
    let annotations = this.state.annotations;
    this.setState({annotations:JSON.parse(response.result)})

    let quotes = [];

    _.each(this.state.annotations, function (value) {
      quotes.push({
        "id":value.annotatorId,
        "text" : value.quote.text,
        "quote" : value.quote.quote,
        "ranges" : value.quote.ranges,
        "userName" : value.userName,
        "roleName" : value.roleName,
        "profileImage" : value.profileImage,
        "createdAt" : value.createdAt
      })
    })
    this.state.content.annotator('loadAnnotations', quotes);

    return response;
  }

  async fetchPortfolioInstitutionDetails() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await fetchInstitutionDetailsHandler(portfoliodetailsId, KEY);
    if (response && response.awardsRecognition) {
      this.setState({institutionAwardsList: response.awardsRecognition,loading:false});
    }
    this.setState({loading: false})
  }

  compareQueryOptions(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  componentDidUpdate(prevProps, prevState){
    //var compareQueryOptions=function(a, b) {return JSON.stringify(a) === JSON.stringify(b);};
    var currentLoaded=this.state.loading;
    if(!this.compareQueryOptions(prevState.loading,currentLoaded)){this.initalizeAnnotaor();this.fetchAnnotations();}
  }

  render(){
    let that = this;
    let awardsArray = that.state.institutionAwardsList || [];
    let loading=this.state.loading?this.state.loading:false;

    return (
      <div>
        {loading === true ? ( <MlLoader/>) : (
          <div>
            {_.isEmpty(awardsArray)&& <div className="portfolio-main-wrap">
              <NoData tabName={this.props.tabName} />
            </div>}

            {!_.isEmpty(awardsArray)&&  <div id="annotatorContent">
              <h2>Awards</h2>
              <div className="col-lg-12">
                <MlGenericAwardsView awardsList={awardsArray} isAdmin={this.props.isAdmin}/>
                {/*<div className="row">*/}
                  {/*{awardsArray && awardsArray.map(function (details, idx) {*/}
                    {/*return (<div className="col-lg-2 col-md-3 col-sm-4" key={idx}>*/}
                      {/*<div className="team-block">*/}
                        {/*<img src={details.logo&&details.logo.fileUrl} className="team_img" />*/}
                        {/*<h3>*/}
                          {/*{details&&details.awardName}*/}
                        {/*</h3>*/}
                      {/*</div>*/}
                    {/*</div>)*/}
                  {/*})}*/}

                {/*</div>*/}
              </div>
            </div> }
          </div>)}
      </div>
    )

  }
}
