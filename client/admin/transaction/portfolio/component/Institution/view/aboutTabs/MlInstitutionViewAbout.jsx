/**
 * Created by Birendra on 21/8/17.
 */
import React from 'react';
const FontAwesome = require('react-fontawesome');
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import {createAnnotationActionHandler} from '../../../../actions/updatePortfolioDetails'
import {validateUserForAnnotation} from '../../../../actions/findPortfolioIdeatorDetails'
import NoData from '../../../../../../../commons/components/noData/noData';
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";
export default class MlInstitutionViewAbout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data : {},
      editorValue: createValueFromString(this.props.aboutUsDetails ? this.props.aboutUsDetails.institutionDescription : null)
    }
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
  }

  componentWillMount(){
    const resp = this.validateUserForAnnotation();
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

  componentDidMount() {
    this.lockPrivateKeys();
  }
  
  lockPrivateKeys() {
    const { privateFields } = this.props.aboutUsDetails;
    _.each(privateFields, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"institutionAbout", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "institutionAbout");
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

  render() {
    const { editorValue } = this.state;
    return (
      <div className="col-lg-12 col-sm-12">
        <div className="row"  id="annotatorContent">
          <h2>About Us</h2>
          <div className="panel panel-default panel-form-view hide_unlock">
            <div className="panel-body">
            <div>{this.props.aboutUsDetails && this.props.aboutUsDetails.institutionDescription ?
                    <MlTextEditor
                      value={editorValue}
                      isReadOnly={true}
                    /> : (<NoData tabName={this.props.tabName} />)}</div>
            <FontAwesome name='unlock' className="input_icon" id="isDescriptionPrivate" />
              {/* <p>{this.props.aboutUsDetails && this.props.aboutUsDetails.institutionDescription ? this.props.aboutUsDetails.institutionDescription : (<NoData tabName={this.props.tabName}/>)}</p> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
};
