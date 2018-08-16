import React from 'react';
import { render } from 'react-dom';
import StepZilla from '../../../../commons/components/stepzilla/StepZilla';
import Step1 from './step1';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';
import MlRegStep6 from './MlRegStep6';
import Step7 from './step7';
import _ from 'lodash';
import {findRegistrationActionHandler,documentTypesActionHandler} from '../actions/findRegistration'
import MlLoader from '../../../../commons/components/loader/loader'
import IdeatorIndividualHardReg from '../component/IdeatorIndividualHardReg';
import InstitutionHardReg from '../component/InstitutionHardReg';
import SoftRegistration from '../component/SoftRegistration';
import {fetchTemplateHandler} from "../../../../commons/containers/templates/mltemplateActionHandler";
import _underscore from 'underscore'
import {client} from '../../../core/apolloConnection';
export default class RegistrationWizard extends React.Component{

  constructor(props){
    super(props);
    this.state={
      loading:true,
      softRegSteps:[],
      hardRegSteps:[],
      softRegComponent:'',
      hardRegComponent:'',
      registrationDetails:{},
      kycDocumentList:[],
      alertDisplay:true
    }
    this.findRegistration.bind(this);
    this.fetchHardRegistrationTemplate.bind(this);
    this.setHardRegistrationSteps.bind(this);
    this.setSoftRegistrationSteps.bind(this);
    this.refetchRegistrationAndTemplates.bind(this);
    return this;
  }

  async refetchRegistrationAndTemplates(){
    const resp=await this.findRegistration();
    this.fetchHardRegistrationTemplate(resp);
    this.fetchSoftRegistrationTemplate(resp);
    return resp;
  }
  getRegistrationDetails(){
    const resp=this.findRegistration();
    return resp;
  }
  async getRegistrationContactDetails(details){
    const resp=await this.findRegistration();
    this.setState({'registrationDetails':resp})
  }

  async getRegistrationSocialLinks(details){
    //let data = this.state.registrationDetails;
    //refer proper object
    const resp=await this.findRegistration();
    this.setState({'registrationDetails':resp})
  }
  async getRegistrationKYCDetails(details){
    /* let data = this.state.registrationDetails;
     //refer proper object
     this.setState({'registrationDetails':data})*/
    const resp=await this.findRegistration();
    this.setState({'registrationDetails':resp})

  }
    async componentWillMount() {
    const resp=await this.findRegistration();
    this.fetchHardRegistrationTemplate(resp);
    this.fetchSoftRegistrationTemplate(resp);
    return resp;
  }

  async findRegistration() {
    const response = await findRegistrationActionHandler(this.props.config);
    let docTypeArray = [];
    let kycDocumentsArray = [];
    if(response){
      const result = await documentTypesActionHandler();
      let docTypeArray = _underscore.pluck(result, '_id') || [];
      let kycDocuments = response&&response.kycDocuments?response.kycDocuments:[];
      for(let k=0;k < docTypeArray.length;k++){
        kycDocumentsArray[docTypeArray[k]] = []
      }
      if(kycDocuments){
        let documentExist;
        for(let i=0;i< kycDocuments.length;i++){
          if(kycDocuments[i] && kycDocuments[i].docTypeId && docTypeArray && docTypeArray.length>0){
            documentExist = _underscore.contains(docTypeArray,kycDocuments[i].docTypeId);
            if(documentExist){
              if(kycDocumentsArray && kycDocumentsArray[kycDocuments[i].docTypeId]){
                kycDocumentsArray[kycDocuments[i].docTypeId].push(kycDocuments[i])
              }

            }
          }
        }
      }
    }
    // this.setState({loading : false,kycDocumentList: kycDocumentsArray })
    this.setState({loading: false, kycDocumentList: kycDocumentsArray, registrationDetails: response});
    return response;
  }

  async fetchSoftRegistrationTemplate(regDetails) {
    let userType = this.context.userType;
    const reg= await fetchTemplateHandler({process:"Registration",subProcess:"Registration",stepCode:"SOFT",userType:userType,recordId:regDetails._id,connection:client});
    this.setState({softRegComponent:reg&&reg.component?reg.component:null});
    if(!reg||!reg.component){this.setState({"softRegSteps":[]})};
  }

  async fetchHardRegistrationTemplate(regDetails) {
    let userType = this.context.userType;
    const reg= await fetchTemplateHandler({process:"Registration",subProcess:"Registration",stepCode:"HARD",userType:userType,recordId:regDetails._id,connection:client});
    this.setState({hardRegComponent:reg&&reg.component?reg.component:null});
    if(!reg||!reg.component){this.setState({"hardRegSteps":[]})};
  }

  setHardRegistrationSteps(steps){
    this.setState({hardRegSteps:steps||[]});
  }

  setSoftRegistrationSteps(steps){
    this.setState({softRegSteps:steps||[]});
  }


  render(){
    let registrationId = this.props.config;
    let registrationConfig={
      registrationId:registrationId,
      userType:this.context.userType,
      /**step1 props*/
      getRegistrationDetails:this.getRegistrationDetails.bind(this),
      registrationInfo:this.state.registrationDetails.registrationInfo,
      emailDetails:this.state.registrationDetails.emails,
      refetchRegistrationAndTemplates:this.refetchRegistrationAndTemplates.bind(this),


      /**step2 props*/
      registrationDetails:this.state.registrationDetails.registrationDetails,
      community:this.state.registrationDetails.registrationInfo?this.state.registrationDetails.registrationInfo.communityName:null,

      /**step3 props*/
      getRegistrationContactDetails:this.getRegistrationContactDetails.bind(this),
      registrationData:this.state.registrationDetails,
      clusterId:this.state.registrationDetails.registrationInfo?this.state.registrationDetails.registrationInfo.clusterId:null,

      /**step4 props*/
      getRegistrationSocialLinks:this.getRegistrationSocialLinks.bind(this),
      registrationData:this.state.registrationDetails,
      uploadedProfileImg:this.state.registrationDetails.registrationInfo?this.state.registrationDetails.registrationInfo.profileImage:null,

      /**step5 props*/
      getRegistrationKYCDetails:this.getRegistrationKYCDetails.bind(this),
      registrationData:this.state.registrationDetails,
      kycDocuments : this.state.kycDocumentList,

      setHardRegistrationSteps:this.setHardRegistrationSteps.bind(this),
      setSoftRegistrationSteps:this.setSoftRegistrationSteps.bind(this)
    };

    /* const steps =
     [
     {name: 'Basic info','icon':<span className="ml ml-basic-Information"></span>, component: <Step1 getRegistrationDetails={this.getRegistrationDetails.bind(this)} registrationInfo={this.state.registrationDetails.registrationInfo} registrationId={registrationId}/>},

     {name: 'Additional info','icon':<span className="ml ml-additional-Information"></span>,  component: <Step2 registrationId={registrationId} registrationDetails={this.state.registrationDetails.registrationDetails} community={this.state.registrationDetails&&this.state.registrationDetails.registrationInfo.communityName}/>},
     {name: 'Contact details','icon':<span className="ml ml-address-book"></span>, component: <Step3 getRegistrationContactDetails={this.getRegistrationContactDetails.bind(this)} registrationInfo={this.state.registrationDetails}  registrationId={registrationId} clusterId={this.state.registrationDetails&&this.state.registrationDetails.registrationInfo.clusterId}/>},
     {name: 'Social links','icon':<span className="ml ml-social-Links"></span>,  component: <Step4 getRegistrationSocialLinks={this.getRegistrationSocialLinks.bind(this)} registrationInfo={this.state.registrationDetails}  registrationId={registrationId} clusterId={this.state.registrationDetails&&this.state.registrationDetails.registrationInfo.clusterId} uploadedProfileImg={this.state.registrationDetails&&this.state.registrationDetails.registrationInfo.profileImage}/>},
     {name: 'KYC\'s Documents','icon':<span className="ml ml-kyc-document"></span>,  component: <Step5 getRegistrationKYCDetails={this.getRegistrationKYCDetails.bind(this)} registrationInfo={this.state.registrationDetails}/>},
     {name: 'Payment gateway','icon':<span className="ml ml-payments"></span>, component: <MlRegStep6 />},
     {name: 'History','icon':<span className="ml ml-moolya-symbol"></span>, component: <Step7 />}
     ]*/

    const steps=_.concat(this.state.softRegSteps,this.state.hardRegSteps);
    const hasSteps=_.concat(this.state.softRegSteps,this.state.hardRegSteps).length>0;
    let SoftRegComponent=this.state.softRegComponent;
    let HardRegComponent=this.state.hardRegComponent;
    let hasSoftRegTemplate=true;
    let hasHardRegTemplate=true;
    if(!SoftRegComponent){
      hasSoftRegTemplate=false;
    }
    if(!HardRegComponent){
      hasHardRegTemplate=false;
    }
    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(
          <div className="admin_padding_wrap">
            {/*<h2>Registration Process</h2>*/}
            <div className='step-progress last_step_none' >
              <div >
                {hasSoftRegTemplate&&<SoftRegComponent {...registrationConfig}/>}
                {hasHardRegTemplate&&<HardRegComponent {...registrationConfig}/>}
                {hasSteps&&<StepZilla steps={steps} stepsNavigation={true} prevBtnOnLastStep={true}
                                      dontValidate={false} showConfirm={true}
                                      />}
              </div>
            </div>
          </div>)}
      </div>
    )
  }
};

RegistrationWizard.contextTypes = {
  userType: React.PropTypes.string
};
