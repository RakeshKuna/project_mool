import React from 'react';
import MlIdeatorPortfolioEditTabs from '../component/Ideator/MlIdeatorPortfolioEditTabs'
import mlRegistrationTemplates from '../../../../commons/containers/templates/mlRegistrationTemplate';
import MlViewIdeatorPortfolioTemplate from '../component/IdeatorView/MlViewIdeatorPortfolio'
import MlStartupEditTemplate from '../component/Startup/edit/MlStartupEditTemplate'
import MlViewStartupPortfolioTemplate from '../component/Startup/view/MlViewStartupPortfolioTemplate'
import MlServiceProviderEditTabs from '../component/ServiceProvider/edit/MlServiceProviderEditTabs'
import MlServiceProviderViewTabs from '../component/ServiceProvider/view/MlServiceProviderViewTabs'
import MlInstitutionEditTabs from '../component/Institution/edit/MlInstitutionEditTabs'
import MlInstitutionViewTabs from '../component/Institution/view/MlInstitutionViewTabs'
import MlAppIdeatorEditTabs from '../../../../app/portfolio/ideators/components/MlAppIdeatorEditTabs'
import MlAppIdeatorTabs from '../../../../app/portfolio/ideators/components/MlAppIdeatorTabs'
import MlFunderEditTemplate from '../component/Funders/edit/MlFunderEditTemplate'
import MlFunderViewTemplate from '../component/Funders/view/MlFunderViewTemplate'
import MlAppFunderViewTabs from '../../../../app/portfolio/funders/components/MlAppFunderViewTabs'
import MlAppFunderEditTabs from '../../../../app/portfolio/funders/components/MlAppFunderEditTabs'
import MlAppStartupEditTabs from '../../../../app/portfolio/startup/components/MlAppStartupEditTabs'
import MlAppStartupViewTabs from '../../../../app/portfolio/startup/components/MlAppStartupViewTabs'
import MlAppServiceProviderEditTabs from "../../../../app/portfolio/serviceProvider/components/MlAppServiceProviderEditTabs";
import MlAppServiceProviderViewTabs from "../../../../app/portfolio/serviceProvider/components/MlAppServiceProviderViewTabs";
import MlCompanyEditTabs from '../component/Company/edit/MlCompanyEditTabs'
import MlCompanyViewTabs from '../component/Company/view/MlCompanyViewTabs'
import MlAppInstitutionsEditTabs from "../../../../app/portfolio/Institutions/components/MlAppInstitutionsEditTabs";
import MlAppInstitutionsViewTabs from "../../../../app/portfolio/Institutions/components/MlAppInstitutionsViewTabs";
import MlAppCompaniesEditTabs from "../../../../app/portfolio/Companies/components/MlAppCompaniesEditTabs";
import MlAppCompaniesViewTabs from "../../../../app/portfolio/Companies/components/MlAppCompaniesViewTabs";
/**
 * admin config files for internal users
 * */
const mlIdeatorEditExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Ideator-Edit",
  templateCode:"PFTIDEEDT",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlIdeatorPortfolioEditTabs
};

const mlIdeatorViewExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Ideator-View",
  templateCode:"PFTIDEVIW",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlViewIdeatorPortfolioTemplate
};

const mlStartupEditExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Startup-Edit",
  templateCode:"PFSTUEDT",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlStartupEditTemplate
};

const mlStartupViewExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Startup-View",
  templateCode:"PFSTUVIW",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlViewStartupPortfolioTemplate
};
const mlFunderEditExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Investor-Edit",
  templateCode:"PFTFUNEDT",   //PFFUNEDT
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlFunderEditTemplate
};

const mlFunderViewExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Investor-View",
  templateCode:"PFTFUNVIW",
  userType:'internal',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlFunderViewTemplate
};
const mlServiceProviderEditExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-ServiceProvider-Edit",
  templateCode: "PFTSPSEDT",
  userType: 'internal',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlServiceProviderEditTabs
};
const mlServiceProviderViewExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-ServiceProvider-View",
  templateCode: "PFTSPSVIW",
  userType: 'internal',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlServiceProviderViewTabs
};
const mlCompanyEditExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-Company-Edit",
  templateCode: "PFTCMPEDT",
  userType: 'internal',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlCompanyEditTabs
};
const mlCompanyViewExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-Company-View",
  templateCode: "PFTCMPVIW",
  userType: 'internal',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlCompanyViewTabs
};


const mlInstitutionEditInternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-Institution-Edit",
  templateCode: "PFTINSEDT",
  userType: 'internal',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlInstitutionEditTabs
};

const mlInstitutionViewInternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-Institution-View",
  templateCode: "PFTINSVIW",
  userType: 'internal',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlInstitutionViewTabs
};

mlRegistrationTemplates.setTemplate(mlIdeatorEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlIdeatorViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlStartupEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlStartupViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlFunderEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlFunderViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlServiceProviderEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlServiceProviderViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlCompanyEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlCompanyViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlInstitutionViewInternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlInstitutionEditInternalUserPortfolioTemplateConfig);

/**
 * app config files for external users
 * */
const mlAppIdeatorEditExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Ideator-Edit",
  templateCode:"PFTIDEEDT",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlAppIdeatorEditTabs
};

const mlAppIdeatorViewExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Ideator-View",
  templateCode:"PFTIDEVIW",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlAppIdeatorTabs
};

const mlAppStartupEditExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Startup-Edit",
  templateCode:"PFSTUEDT",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlAppStartupEditTabs
};

const mlAppStartupViewExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Startup-View",
  templateCode:"PFSTUVIW",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlAppStartupViewTabs
};

const mlAppFunderEditExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Investor-Edit",
  templateCode:"PFTFUNEDT",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlAppFunderEditTabs
};

const mlAppFunderViewExternalUserPortfolioTemplateConfig={
  templateName:"Portfolio-Template-Investor-View",
  templateCode:"PFTFUNVIW",
  userType:'external',
  process:'Registration',
  subProcess:'Registration',
  stepCode:'PORTFOLIO',
  stepName:'Portfolio',
  component:MlAppFunderViewTabs
};

const mlAppServiceProviderEditExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-ServiceProvider-Edit",
  templateCode: "PFTSPSEDT",
  userType: 'external',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlAppServiceProviderEditTabs
};

const mlAppServiceProviderViewExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-ServiceProvider-View",
  templateCode: "PFTSPSVIW",
  userType: 'external',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlAppServiceProviderViewTabs
};
const mlAppCompanyEditExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-Company-Edit",
  templateCode: "PFTCMPEDT",
  userType: 'external',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlAppCompaniesEditTabs
};

const mlAppCompanyViewExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-Company-View",
  templateCode: "PFTCMPVIW",
  userType: 'external',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlAppCompaniesViewTabs
};

const mlAppInstitutionEditExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-Institution-Edit",
  templateCode: "PFTINSEDT",
  userType: 'external',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlAppInstitutionsEditTabs
};

const mlAppInstitutionViewExternalUserPortfolioTemplateConfig = {
  templateName: "Portfolio-Template-Institution-View",
  templateCode: "PFTINSVIW",
  userType: 'external',
  process: 'Registration',
  subProcess: 'Registration',
  stepCode: 'PORTFOLIO',
  stepName: 'Portfolio',
  component: MlAppInstitutionsViewTabs
};

mlRegistrationTemplates.setTemplate(mlAppIdeatorEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppIdeatorViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppStartupEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppStartupViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppFunderViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppFunderEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppServiceProviderEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppServiceProviderViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppCompanyEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppCompanyViewExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppInstitutionEditExternalUserPortfolioTemplateConfig);
mlRegistrationTemplates.setTemplate(mlAppInstitutionViewExternalUserPortfolioTemplateConfig);
