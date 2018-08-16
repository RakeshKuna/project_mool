import React from 'react';
import mlRegistrationTemplates from '../../../../commons/containers/templates/mlRegistrationTemplate';
// import step1 from '../component/step1';
import SoftRegistration from "../component/SoftRegistration";
import SoftRegistrationForExternalUser from "../../../../app/registrations/component/SoftRegistrationForExternalUser"  /*seperating files for app and admin*/
const mlSoftRegistrationInternalUserTemplateConfig={
  templateName:"Soft-Reg-All",
  templateCode:"SRTALL",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'SOFT',
  stepName:'Soft',
  component:SoftRegistration
};

const mlSoftRegistrationExternalUserTemplateConfig={
  templateName:"Soft-Reg-All",
  templateCode:"SRTALL",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'SOFT',
  stepName:'Soft',
  component:SoftRegistrationForExternalUser
};

mlRegistrationTemplates.setTemplate(mlSoftRegistrationInternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlSoftRegistrationExternalUserTemplateConfig);

export {mlSoftRegistrationInternalUserTemplateConfig,mlSoftRegistrationExternalUserTemplateConfig};
