/**
 * Created by vishwadeep on 4/7/17.
 */
import React, {Component} from "react";
import {render} from "react-dom";
import StepZilla from "../../../../client/commons/components/stepzilla/StepZilla";
import _ from "lodash";
import MlLoader from "../../../../client/commons/components/loader/loader";
import {findRegistrationActionHandler, documentTypesActionHandler} from "../actions/findRegistration";
import {fetchTemplateHandler} from "../../../../client/commons/containers/templates/mltemplateActionHandler";
import _underscore from "underscore";
import {appClient} from '../../core/appConnection';
export default class MlAppRegistrationWizard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      softRegSteps: [],
      hardRegSteps: [],
      softRegComponent: '',
      hardRegComponent: '',
      registrationDetails: {},
      kycDocumentList: []
    }
    this.findRegistration.bind(this);
    this.fetchHardRegistrationTemplate.bind(this);
    this.setHardRegistrationSteps.bind(this);
    this.setSoftRegistrationSteps.bind(this);
    this.refetchRegistrationAndTemplates.bind(this);
    return this;
  }

  async refetchRegistrationAndTemplates() {
    const resp = await this.findRegistration();
    this.fetchHardRegistrationTemplate(resp);
    this.fetchSoftRegistrationTemplate(resp);
    return resp;
  }

  getRegistrationDetails() {
    const resp = this.findRegistration();
    return resp;
  }

  async getRegistrationContactDetails(details) {
    const resp = await this.findRegistration();
    this.setState({'registrationDetails': resp})
  }

  async getRegistrationSocialLinks(details) {
    //refer proper object
    const resp = await this.findRegistration();
    this.setState({'registrationDetails': resp})
  }

  async getRegistrationKYCDetails(details) {
    //refer proper object
    //this.setState({'registrationDetails': data})
    const resp = await this.findRegistration();
    this.setState({'registrationDetails': resp})

  }

  async componentWillMount() {
    const resp = await this.findRegistration();
    this.fetchHardRegistrationTemplate(resp);
    this.fetchSoftRegistrationTemplate(resp);
    return resp;
  }

  async findRegistration() {
    const response = await findRegistrationActionHandler(this.props.config);
    let kycDocumentsArray = [];
    if (response) {
      const result = await documentTypesActionHandler();
      let docTypeArray = _underscore.pluck(result, '_id') || [];
      let kycDocuments = response && response.kycDocuments ? response.kycDocuments : [];
      for (let k = 0; k < docTypeArray.length; k++) {
        kycDocumentsArray[docTypeArray[k]] = []
      }
      if (kycDocuments) {
        let documentExist;
        for (let i = 0; i < kycDocuments.length; i++) {
          if (kycDocuments[i] && kycDocuments[i].docTypeId && docTypeArray && docTypeArray.length > 0) {
            documentExist = _underscore.contains(docTypeArray, kycDocuments[i].docTypeId);
            if (documentExist) {
              if (kycDocumentsArray && kycDocumentsArray[kycDocuments[i].docTypeId]) {
                kycDocumentsArray[kycDocuments[i].docTypeId].push(kycDocuments[i])
              }

            }
          }
        }
      }
    }
    this.setState({loading: false, kycDocumentList: kycDocumentsArray, registrationDetails: response});
    return response;
  }

  async fetchSoftRegistrationTemplate(regDetails) {
    let userType = this.context.userType;
    const reg = await fetchTemplateHandler({
      process: "Registration",
      subProcess: "Registration",
      stepCode: "SOFT",
      userType: userType,
      recordId: regDetails._id,
      connection:appClient
    });
    this.setState({softRegComponent: reg && reg.component ? reg.component : null});
    if (!reg || !reg.component) {
      this.setState({"softRegSteps": []})
    }
    ;
  }

  async fetchHardRegistrationTemplate(regDetails) {
    let userType = this.context.userType;
    const reg = await fetchTemplateHandler({
      process: "Registration",
      subProcess: "Registration",
      stepCode: "HARD",
      userType: userType,
      recordId: regDetails._id,
      connection:appClient
    });
    this.setState({hardRegComponent: reg && reg.component ? reg.component : null});
    if (!reg || !reg.component) {
      this.setState({"hardRegSteps": []})
    }
    ;
  }

  setHardRegistrationSteps(steps) {
    this.setState({hardRegSteps: steps || []});
  }

  setSoftRegistrationSteps(steps) {
    this.setState({softRegSteps: steps || []});
  }

  render() {
    let registrationId = this.props.config;
    let registrationConfig = {
      registrationId: registrationId,
      userType: this.context.userType,
      getRegistrationDetails: this.getRegistrationDetails.bind(this),
      registrationInfo: this.state.registrationDetails && this.state.registrationDetails.registrationInfo ? this.state.registrationDetails.registrationInfo :"",
      refetchRegistrationAndTemplates: this.refetchRegistrationAndTemplates.bind(this),

      registrationDetails: this.state.registrationDetails && this.state.registrationDetails.registrationDetails ? this.state.registrationDetails.registrationDetails : "" ,
      community: this.state.registrationDetails && this.state.registrationDetails.registrationInfo && this.state.registrationDetails.registrationInfo.communityName ? this.state.registrationDetails.registrationInfo.communityName : null,

      getRegistrationContactDetails: this.getRegistrationContactDetails.bind(this),
      registrationData: this.state.registrationDetails,
      clusterId: this.state.registrationDetails && this.state.registrationDetails.registrationInfo && this.state.registrationDetails.registrationInfo.clusterId ? this.state.registrationDetails.registrationInfo.clusterId : null,

      getRegistrationSocialLinks: this.getRegistrationSocialLinks.bind(this),
      registrationData: this.state.registrationDetails,
      uploadedProfileImg: this.state.registrationDetails && this.state.registrationDetails.registrationInfo && this.state.registrationDetails.registrationInfo.profileImage ? this.state.registrationDetails.registrationInfo.profileImage : null,

      getRegistrationKYCDetails: this.getRegistrationKYCDetails.bind(this),
      registrationData: this.state.registrationDetails,
      kycDocuments: this.state.kycDocumentList,

      setHardRegistrationSteps: this.setHardRegistrationSteps.bind(this),
      setSoftRegistrationSteps: this.setSoftRegistrationSteps.bind(this)
    };

    const steps = _.concat(this.state.softRegSteps, this.state.hardRegSteps);
    const hasSteps = _.concat(this.state.softRegSteps, this.state.hardRegSteps).length > 0;
    let SoftRegComponent = this.state.softRegComponent;
    let HardRegComponent = this.state.hardRegComponent;
    let hasSoftRegTemplate = true;
    let hasHardRegTemplate = true;
    if (!SoftRegComponent) {
      hasSoftRegTemplate = false;
    }
    if (!HardRegComponent) {
      hasHardRegTemplate = false;
    }
    const showLoader = this.state.loading;
    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (
         <div className={this.props.isAccodion?'':"app_main_wrap"}>
          <div className={this.props.isAccodion?'':"app_padding_wrap"}>
            {/*<h2>Registration Process</h2>*/}
            <div className='step-progress'>
              <div >
                {hasSoftRegTemplate && <SoftRegComponent {...registrationConfig}/>}
                {hasHardRegTemplate && <HardRegComponent {...registrationConfig}/>}
                {hasSteps && <StepZilla steps={steps} stepsNavigation={true} prevBtnOnLastStep={true} dontValidate={false} showConfirm={true}/>}
              </div>
            </div>
          </div>
         </div>
        )}
      </div>
    )
  }
};

MlAppRegistrationWizard.contextTypes = {
  userType: React.PropTypes.string
};
