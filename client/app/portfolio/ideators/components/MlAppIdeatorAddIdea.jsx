import React, { Component, PropTypes }  from "react";
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ScrollArea from 'react-scrollbar';
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch,initalizeFloatLabel} from '../../../../commons/utils/formElemUtil';
import _ from 'lodash';
// import MlActionComponent from '../../../../commons/components/actions/ActionComponent';
import formHandler from '../../../../commons/containers/MlFormHandler';
import {createIdeaActionHandler} from '../actions/ideatorActionHandler'
import MlLoader from '../../../../commons/components/loader/loader'
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation'
import MlAccordion from "../../../commons/components/MlAccordion";
import MlAppActionComponent from "../../../commons/components/MlAppActionComponent";
import {multipartASyncFormHandler, multipartFormHandler} from '../../../../commons/MlMultipartFormAction'
import {putDataIntoTheLibrary} from '../../../../commons/actions/mlLibraryActionHandler'
import CropperModal from '../../../../commons/components/cropperModal/index';

class MlAppIdeatorAddIdea extends React.Component{
  constructor(props, context){
      super(props);
      this.state= {
        loading: false,
        ideaImage:{},
        showProfileModal: false,
        uploadingAvatar: false
      }
      this.createIdea.bind(this);
      this.handleSuccess.bind(this);
      this.toggleModal = this.toggleModal.bind(this);
      this.handleUploadAvatar = this.handleUploadAvatar.bind(this);
      this.onLogoFileUpload = this.onLogoFileUpload.bind(this);
      return this;
  }

  componentDidMount()
  {
      OnLockSwitch();
      dataVisibilityHandler();
      initalizeFloatLabel();
  }
  componentDidUpdate()
  {
      OnLockSwitch();
      dataVisibilityHandler();
      initalizeFloatLabel();
      $('#upload_hex').change(function(){
        document.getElementById('blah').src = window.URL.createObjectURL(this.files[0]);
      });
  }

  async handleSuccess(response){
      FlowRouter.go('/app/portfolio')
  }
  async handleError(response) {
    console.log('error')
    console.log(response)
  };

  async createIdea() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      let idea = {
        title: this.refs.title.value,
        ideaDescription: this.refs.ideaDescription.value,
        isIdeaTitlePrivate: false,
        isIdeaPrivate: false,
        isActive: true
      };
      let data ={
        moduleName: "PORTFOLIO_IDEA_IMG",
        actionName: "UPDATE",
        isCreate:true,
        communityType:"IDE",
        idea:idea,
        portfolio:{
          ideaImage:{fileUrl:" ", fileName : this.state.fileName}
        }
      };
      this.setState({loading:true})
      if(this.state.file){
        multipartASyncFormHandler(data, this.state.file, 'registration',this.onFileUploadCallBack.bind(this, this.state.name, this.state.file));
      }else{
        const response = await createIdeaActionHandler(idea)
        if(response){
          if (!response.success) {
            toastr.error(response.result);
          } else if (response.success) {
            toastr.success(response.result);
          }
          this.setState({loading:false})
          // toastr.success("Idea created successfully")
          FlowRouter.go("/app/portfolio");
          // return response;
        }
      }
    }
  }
  async libraryAction(file) {
    let portfolioDetailsId = this.props.portfolioDetailsId;
    const resp = await putDataIntoTheLibrary(portfolioDetailsId ,file, this.props.client)
    return resp;
  }

  onLogoFileUpload(image,fileInfo){
    // if(e.target.files[0].length ==  0)
    //   return;
    let file = image;
    let fileName = fileInfo.name;
    let name = 'logo';
    this.setState({file:file, name:name, fileName:fileName,showProfileModal:false})
  }

  onFileUploadCallBack(name,file,resp){
    if(resp){
      let result = JSON.parse(resp)
      // let userOption = confirm("Do you want to add the file into the library")
      // if(userOption){
      //   let fileObjectStructure = {
      //     fileName: file.name,
      //     fileType: file.type,
      //     fileUrl: result.result,
      //     libraryType: "image"
      //   }
      //   this.libraryAction(fileObjectStructure)
      // }
      if(result.success){
        this.setState({loading:false, ideaImage:{fileUrl:result.result}}, function () {
          setTimeout(function () {
            toastr.success("Idea added successfully")
            FlowRouter.go("/app/portfolio");
          }, 1000)

        })
      }
    }
  }
  toggleModal() {
    const that = this;
    this.setState({
      showProfileModal: !that.state.showProfileModal
    });
  }
  handleUploadAvatar(image,e) {
    this.setState({
      profilePic: image,
    });
    this.onLogoFileUpload(image,e);
  }
  render(){
    const _this = this;
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => _this.props.handler(this.createIdea.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go('/app/portfolio')
        }
      }
    ];
    export const genericPortfolioAccordionConfig = {
      id: 'portfolioAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: {'background': '#ef4647'},
          contentComponent: <MlAppActionComponent
            resourceDetails={{resourceId: 'sacsdvdsv', resourceType: 'task'}}   //resource id need to be given
            actionOptions={appActionConfig}/>
        }]
    };
    var urlCreator = window.URL || window.webkitURL;
    let imageUrl = '';
    if (this.state.profilePic)
      imageUrl = urlCreator.createObjectURL(this.state.profilePic);
      const showLoader = this.state.loading;
      // let image = this.state.ideaImage&&this.state.ideaImage.fileUrl?this.state.ideaImage.fileUrl:"/images/images.png";
      return (
          <div className="admin_main_wrap">
              <div className="admin_padding_wrap">
                  {showLoader === true ? ( <MlLoader/>) : (
                      <div>
                          <h2>Add Idea</h2>
                          <div className="col-lg-2 col-lg-offset-5 col-md-3 col-md-offset-4 col-sm-3 col-sm-offset-4">
                              <a href="" >
                                  <div className="upload_hex" onClick={this.toggleModal.bind(this)}>
                                    <FontAwesome name='unlock' className="req_textarea_icon un_lock" id="isIdeaImagePrivate"/>
                                    {this.state.profilePic?
                                    <img src={imageUrl} width="105" height="auto"/>:
                                    <img src="/images/images.png" id="blah" width="105" height="auto"/>}
                                  </div>
                              </a>
                          </div>
                          <CropperModal
                            uploadingImage={this.state.uploadingAvatar}
                            handleImageUpload={this.handleUploadAvatar}
                            cropperStyle="square"
                            show={this.state.showProfileModal}
                            toggleShow={this.toggleModal}
                          />
                          <div className="form_bg col-lg-8 col-lg-offset-2">
                              <form>
                                  <div className="form-group mandatory">
                                      <input type="text" placeholder="Title" ref="title" className="form-control float-label" id="cluster_name" name="title" data-required={true} data-errMsg="Title is required"/>
                                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isIdeaTitlePrivate"/><input type="checkbox" className="lock_input" id="makePrivate"/>
                                  </div>
                                  <div className="form-group mandatory">
                                      <textarea placeholder="Describe..." className="form-control float-label" ref="ideaDescription" id="cl_about" name="ideaDescription" data-required={true} data-errMsg="Description is required" ></textarea>
                                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isIdeaDescriptionPrivate"/><input type="checkbox" className="lock_input" id="makePrivate" />
                                  </div>
                              </form>
                          </div>
                      </div>
                  )}
                <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
              </div>
          </div>
      )
  }
};

export default MlAppIdeatorAddIdea = formHandler()(MlAppIdeatorAddIdea);
