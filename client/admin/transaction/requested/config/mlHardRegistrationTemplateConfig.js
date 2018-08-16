import React from "react";
import mlRegistrationTemplates from "../../../../commons/containers/templates/mlRegistrationTemplate";
/**
 * routes for admin files
  */
import IdeatorIndividualHardReg from "../component/IdeatorIndividualHardReg";
import IdeatorCompanyHardReg from "../component/IdeatorCompanyHardReg";
import FunderCompanyHardReg from "../component/FunderCompanyHardReg";
import FunderIndividualHardReg from "../component/FunderIndividualHardReg";
import ServiceProviderCompanyHardReg from "../component/ServiceProviderCompanyHardReg";
import ServiceProviderIndividualHardReg from "../component/ServiceProviderIndividualHardReg";
import CompanyHardReg from "../component/CompanyHardReg";
import StartupHardReg from "../component/StartupHardReg";
import InstitutionHardReg from "../component/InstitutionHardReg";

/**
 * routes for app files
 * */
import MlAppIdeatorIndividualHardReg from "../../../../app/registrations/component/MlAppIdeatorIndividualHardReg";
import MlAppIdeatorCompanyHardReg from "../../../../app/registrations/component/MlAppIdeatorCompanyHardReg";
import MlAppFunderCompanyHardReg from "../../../../app/registrations/component/MlAppFunderCompanyHardReg";
import MlAppFunderIndividualHardReg from "../../../../app/registrations/component/MlAppFunderIndividualHardReg";
import MlAppServiceProviderCompanyHardReg from "../../../../app/registrations/component/MlAppServiceProviderCompanyHardReg";
import MlAppServiceProviderIndividualHardReg from "../../../../app/registrations/component/MlAppServiceProviderIndividualHardReg";
import MlAppCompanyHardReg from "../../../../app/registrations/component/MlAppCompanyHardReg";
import MlAppStartupHardReg from "../../../../app/registrations/component/MlAppStartupHardReg";
import MlAppInstitutionHardReg from "../../../../app/registrations/component/MlAppInstitutionHardReg";


/**
  app related templates for external user registration
 */

const mlIdeatorCompanyHardRegistrationExternalUserTemplateConfig={
  templateName:"Hard-Reg-Ideator-Company",
  templateCode:"HRTIDECMP",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:MlAppIdeatorCompanyHardReg
};

const mlIdeatorIndividualHardRegistrationExternalUserTemplateConfig={
  templateName:"Hard-Reg-Ideator-Individual",
  templateCode:"HRTIDEINV",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:MlAppIdeatorIndividualHardReg
};

const mlFunderCompanyHardRegistrationExternalUserTemplateConfig={
  templateName:"Hard-Reg-Investor-Company",
  templateCode:"HRTFUNCMP",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:MlAppFunderCompanyHardReg
};

const mlFunderIndividualHardRegistrationExternalUserTemplateConfig={
  templateName:"Hard-Reg-Investor-Individual",
  templateCode:"HRTFUNINV",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:MlAppFunderIndividualHardReg
};

const mlServiceProviderCompanyHardRegistrationExternalUserTemplateConfig={
  templateName:"Hard-Reg-ServiceProvider-Company",
  templateCode:"HRTSPSCMP",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:MlAppServiceProviderCompanyHardReg
};

const mlServiceProviderIndividualHardRegistrationExternalUserTemplateConfig={
  templateName:"Hard-Reg-ServiceProvider-Individual",
  templateCode:"HRTSPSINV",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:MlAppServiceProviderIndividualHardReg
};

const mlCompanyHardRegistrationExternalUserTemplateConfig={
  templateName:"Hard-Reg-Company",
  templateCode:"HRTCMP",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:MlAppCompanyHardReg
};

const mlStartupHardRegistrationExternalUserTemplateConfig={
  templateName:"Hard-Reg-Startup-Company",
  templateCode:"HRTSTU",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:MlAppStartupHardReg
};

const mlInstitutionHardRegistrationExternalUserTemplateConfig={
  templateName:"Hard-Reg-Institution",
  templateCode:"HRTINS",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:MlAppInstitutionHardReg
};

/**
  admin related templates for internal user template registration
 */
const mlIdeatorCompanyHardRegistrationInternalUserTemplateConfig={
  templateName:"Hard-Reg-Ideator-Company",
  templateCode:"HRTIDECMP",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:IdeatorCompanyHardReg
};

const mlIdeatorIndividualHardRegistrationInternalUserTemplateConfig={
  templateName:"Hard-Reg-Ideator-Individual",
  templateCode:"HRTIDEINV",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:IdeatorIndividualHardReg
};


const mlFunderCompanyHardRegistrationInternalUserTemplateConfig={
  templateName:"Hard-Reg-Investor-Company",
  templateCode:"HRTFUNCMP",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:FunderCompanyHardReg
};


const mlFunderIndividualHardRegistrationInternalUserTemplateConfig={
  templateName:"Hard-Reg-Investor-Individual",
  templateCode:"HRTFUNINV",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:FunderIndividualHardReg
};

const mlServiceProviderCompanyHardRegistrationInternalUserTemplateConfig={
  templateName:"Hard-Reg-ServiceProvider-Company",
  templateCode:"HRTSPSCMP",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:ServiceProviderCompanyHardReg
};

const mlServiceProviderIndividualHardRegistrationInternalUserTemplateConfig={
  templateName:"Hard-Reg-ServiceProvider-Individual",
  templateCode:"HRTSPSINV",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:ServiceProviderIndividualHardReg
};


const mlCompanyHardRegistrationInternalUserTemplateConfig={
  templateName:"Hard-Reg-Company",
  templateCode:"HRTCMP",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:CompanyHardReg
};


const mlStartupHardRegistrationInternalUserTemplateConfig={
  templateName:"Hard-Reg-Startup-Company",
  templateCode:"HRTSTU",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:StartupHardReg
};


const mlInstitutionHardRegistrationInternalUserTemplateConfig={
  templateName:"Hard-Reg-Institution",
  templateCode:"HRTINS",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'HARD',
  stepName:'Hard',
  component:InstitutionHardReg
};

/**
 * Template set for Admin/Internal users Templates
 * */
mlRegistrationTemplates.setTemplate(mlIdeatorCompanyHardRegistrationInternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlIdeatorIndividualHardRegistrationInternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlFunderCompanyHardRegistrationInternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlFunderIndividualHardRegistrationInternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlServiceProviderCompanyHardRegistrationInternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlServiceProviderIndividualHardRegistrationInternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlCompanyHardRegistrationInternalUserTemplateConfig)
mlRegistrationTemplates.setTemplate(mlStartupHardRegistrationInternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlInstitutionHardRegistrationInternalUserTemplateConfig);

/**
 * Template set for App/External users Templates
 * */
mlRegistrationTemplates.setTemplate(mlIdeatorCompanyHardRegistrationExternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlIdeatorIndividualHardRegistrationExternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlFunderCompanyHardRegistrationExternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlFunderIndividualHardRegistrationExternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlServiceProviderCompanyHardRegistrationExternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlServiceProviderIndividualHardRegistrationExternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlCompanyHardRegistrationExternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlStartupHardRegistrationExternalUserTemplateConfig);
mlRegistrationTemplates.setTemplate(mlInstitutionHardRegistrationExternalUserTemplateConfig);



