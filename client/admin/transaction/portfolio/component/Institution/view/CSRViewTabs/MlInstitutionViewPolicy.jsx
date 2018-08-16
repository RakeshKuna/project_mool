import React from 'react';
const FontAwesome = require('react-fontawesome');
import {fetchInstitutionDetailsHandler} from "../../../../actions/findPortfolioInstitutionDetails";
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import {validateUserForAnnotation} from '../../../../actions/findPortfolioIdeatorDetails'
import NoData from '../../../../../../../commons/components/noData/noData';
import MlLoader from "../../../../../../../commons/components/loader/loader";
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";

const KEY = "policy"
export default class MlInstitutionViewPolicy extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data : {}
    }
    this.fetchPortfolioDetails.bind(this);
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
  }

 /* componentDidMount() {
    this.initalizeAnnotaor()
    this.fetchAnnotations();
  }*/

  componentWillMount(){
    this.fetchPortfolioDetails();

    let resp = this.validateUserForAnnotation();
    return resp

  }


  async validateUserForAnnotation() {
    const portfolioId = this.props.portfolioDetailsId
    const response = await validateUserForAnnotation(portfolioId);
    if (response && !this.state.isUserValidForAnnotation) {
      this.setState({isUserValidForAnnotation:response,loading:false})

      this.initalizeAnnotaor()

      this.fetchAnnotations();
    }
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"institutionPolicy", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "institutionPolicy");
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

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId=that.props.portfolioDetailsId;

    const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
    if (response && response.policy) {
      const editorValue = createValueFromString(response.policy.institutionPolicyDescription);
      var object = response.policy;
      object = _.omit(object, '__typename')
      this.setState({ loading: false, data: object, editorValue: editorValue }, () => {
        this.lockPrivateKeys();
      });
    }else{
      this.setState({loading:false})
    }
  }

  lockPrivateKeys() {
    const { privateFields } = this.state.data;
    _.each(privateFields, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  render() {
    let showLoader=this.state.loading?this.state.loading:false;
    const { editorValue } = this.state;
    return (
      <div className="col-lg-12 col-sm-12" >
        <div className="row" id="annotatorContent">
          <h2>Policy</h2>
          <div className="panel panel-default panel-form-view hide_unlock">

            <div className="panel-body">
            {showLoader === true ? (<MlLoader />) : (<div>{this.state.data && this.state.data.institutionPolicyDescription ?
                        <MlTextEditor
                          value={editorValue}
                          isReadOnly={true}
                        /> : (<NoData tabName={this.props.tabName} />)}</div>)}
            <FontAwesome name='unlock' className="input_icon" id="institutionPolicyDescriptionPrivate" />
              {/* {showLoader === true ? ( <MlLoader/>) : (<p>{this.state.data && this.state.data.institutionPolicyDescription ? this.state.data.institutionPolicyDescription : (<NoData tabName={this.props.tabName}/>)}</p>)} */}

            </div>
          </div>

        </div>
      </div>
    )
  }
};

/**
 * @todo: {institutionPolicyDescriptionPrivate} need to replace with {isInstitutionPolicyDescriptionPrivate}
 */