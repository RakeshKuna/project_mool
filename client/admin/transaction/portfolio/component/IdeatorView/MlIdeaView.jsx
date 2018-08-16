import React from "react";
import _ from "lodash";
var FontAwesome = require('react-fontawesome');
import { initalizeFloatLabel, initalizeLockTitle } from "../../../../utils/formElemUtil";
import {findAnnotations} from "../../../../../commons/annotator/findAnnotations";
import {initializeMlAnnotator} from "../../../../../commons/annotator/mlAnnotator";
import {createAnnotationActionHandler} from "../../actions/updatePortfolioDetails";
import {validateUserForAnnotation} from '../../actions/findPortfolioIdeatorDetails'
import {fetchIdeaActionHandler} from "../../../../../app/portfolio/ideators/actions/ideatorActionHandler";
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';

export default class MlIdeaView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      portfolioIdeatorInfo: {},
      isUserValidForAnnotation:false
    }
    this.fetchIdeatorIdeas.bind(this);
    //this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
    this.validateUserForAnnotation(this)
  }

  initalizeAnnotaor() {
    initializeMlAnnotator(this.annotatorEvents.bind(this))
    this.state.content = jQuery("#psContent").annotator();
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
    let details = {portfolioId: this.props.portfolioDetailsId, docId: "ideas", quote: JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if (response && response.success) {
      this.fetchAnnotations(true);
    }
    return response;
  }

  async fetchAnnotations(isCreate) {
    const response = await findAnnotations(this.props.portfolioDetailsId, "ideas");
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
        "roleName" : value.roleName,
        "profileImage" : value.profileImage,
        "createdAt": value.createdAt
      })
    })
    this.state.content.annotator('loadAnnotations', quotes);
    return response;
  }
  componentWillMount() {
    let resp =this.validateUserForAnnotation();
    return resp
  }
  componentDidMount() {
    $('.actions_switch').click();
    $('.appCommentBox').addClass('in');
    this.fetchIdeatorIdeas();
    initalizeFloatLabel();
  }
  async validateUserForAnnotation() {
    const portfolioId = this.props.portfolioDetailsId
    const response = await validateUserForAnnotation(portfolioId);
    if (response && !this.state.isUserValidForAnnotation) {

      this.setState({isUserValidForAnnotation:true})

      this.initalizeAnnotaor()

      this.fetchAnnotations();
    }
  }

  async fetchIdeatorIdeas() {
    const ideaId = this.props.ideaId;
    const portfolioId = this.props.portfolioDetailsId
    const response = await fetchIdeaActionHandler(portfolioId);
    if (response) {
      let currentIdea = response.length?response[0]:{};
      _.each(response, function (idea) {
        if (idea._id == ideaId) {
          currentIdea = idea
        }
      });
      if (_.findIndex(currentIdea.privateFields, {booleanKey: 'isIdeaTitlePrivate'}) >= 0) {
        currentIdea = _.omit(currentIdea, "title");
        currentIdea = _.extend(currentIdea, {title: "No ideas are available to show"});
      }
      this.setState({portfolioIdeatorInfo: currentIdea, loading:false},function() {
        if(this.state.isUserValidForAnnotation){
          this.initalizeAnnotaor()
          this.fetchAnnotations();
        }
      })
      _.each(currentIdea.privateFields, function (pf) {
        $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
      initalizeLockTitle();
    }
  }

  render() {
    const showLoader = this.state.loading;
    let image = this.state.portfolioIdeatorInfo && this.state.portfolioIdeatorInfo.ideaImage && this.state.portfolioIdeatorInfo.ideaImage.fileUrl ? this.state.portfolioIdeatorInfo.ideaImage.fileUrl : '/images/no_image.png';
    return (
      <div className="admin_padding_wrap">
        {showLoader === true ? (<div className="loader_wrap"></div>) : (
          <div>
            <h2>About Ideas</h2>
            <div className="ideas_swiper 4 col-lg-offset-4 col-md-3 col-md-offset-4 col-sm-3 col-sm-offset-4">
              <div className="swiper-wrapper">
                <div className="swiper-slide ideas_block" name="idea1" style={{ 'backgroundImage': 'url(' + generateAbsolutePath(image) + ')' }}>
                  <h3 className="rating_xs"><p>{this.state.portfolioIdeatorInfo.title}</p></h3>
                </div>
                {/*<div className="col-lg-2 col-lg-offset-5 col-md-3 col-md-offset-4 col-sm-3 col-sm-offset-4">*/}
                {/*<div className="list_block notrans">*/}
                {/*<FontAwesome name='lock'/>*/}
                {/*<div className="hex_outer portfolio-font-icons"><span className="ml ml-idea"></span></div>*/}
                {/*<h3>Ideas</h3>*/}
                {/*</div>*/}
                {/*<div className="upload_hex">*/}
                {/*/!*<FontAwesome name='unlock' className="req_textarea_icon un_lock" id="isIdeaImagePrivate"/>*!/*/}
                {/*{image?<img src={image} id="blah" width="105" height="auto"/>:<div className="hex_outer portfolio-font-icons"><span className="ml ml-idea"></span></div>}*/}
                {/*</div>*/}
                {/*</div>*/}
                <div className="swiper-pagination"></div>
              </div>
            </div>
            <div className="form_bg col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 hide_unlock" id="psContent">
              <div className="form-group" >
                {/*  <input type="text" placeholder="Title" className="form-control float-label" id="cluster_name"
                       defaultValue={this.state.portfolioIdeatorInfo.title} name="title" readOnly="true"/>*/}
                <br /><br />
                <p><b>Title: </b>{this.state.portfolioIdeatorInfo.title}</p>
                <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                  id="isIdeaTitlePrivate" />
              </div>
              <div className="form-group" >
                <p ><b>Description: </b>{this.state.portfolioIdeatorInfo.ideaDescription}</p>
                {/* <textarea placeholder="Describe..." className="form-control" id="cl_about"
                            defaultValue={this.state.portfolioIdeatorInfo.description} name="description"
                            readOnly="true"></textarea>*/}
                <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                  id="isIdeaPrivate" />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
