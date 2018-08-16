import React from 'react';
import { render } from 'react-dom';
import {mount} from 'react-mounter';
import AdminLayout from '../../admin/layouts/AdminLayout'
import {adminSection} from "../admin/adminRoutes";
import MlDepartmentsList from "../../admin/settings/departments/component/MlDepartmentsList";
import MlSubDepartmentsList from "../../admin/settings/subDepartments/component/MlSubDepartmentsList";
import MlAddDepartment from '../../admin/settings/departments/component/MlAddDepartment'
import MlEditDepartment from '../../admin/settings/departments/component/MlEditDepartment'
import MlAddSubDepartment from '../../admin/settings/subDepartments/component/MlAddSubDepartment'
import MlEditSubDepartment from '../../admin/settings/subDepartments/component/MlEditSubDepartment'
import MlAddProcessMapping from '../../admin/settings/processMapping/component/MlAddProcessMapping'
import MlProcessMappingList from '../../admin/settings/processMapping/component/MlProcessMappingList'
import MlEditProcessMapping from '../../admin/settings/processMapping/component/MlEditProcessMapping'
import MlAddRequestType from '../../admin/settings/requestTypes/component/MlAddRequestType'
import MlRequestTypeList from '../../admin/settings/requestTypes/component/MlRequestTypeList'
import MlEditRequestType from  '../../admin/settings/requestTypes/component/MlEditRequestType'
import MlCountriesList from "../../admin/settings/countries/component/MlCountriesList";
import MlEditCountry from "../../admin/settings/countries/component/MlEditCountry";
import MlStatesList from "../../admin/settings/states/component/MlStatesList";
import MlEditState from "../../admin/settings/states/component/MlStateEdit";
import MlCitiesList from "../../admin/settings/cities/component/MlCitiesList";
import MlEditCity from "../../admin/settings/cities/component/MlEditCity";
import MlMyProfile from '../../admin/profile/component/MlMyprofile'
import MlUserTypeList from '../../admin/settings/userTypes/component/MlUserTypeList'
import MlAddUserType from '../../admin/settings/userTypes/component/MlAddUserType'
import MlEditUserType from '../../admin/settings/userTypes/component/MlEditUserType'
import MlRoleList from '../../admin/settings/rolesAndPermissions/component/MlRoleTypeList'
import MlDocumentTypesList from '../../admin/settings/documentTypes/component/MlDocumentTypesList'
import MlAddDocumentType from '../../admin/settings/documentTypes/component/MlAddDocumentType'
import MlEditDocumentType from '../../admin/settings/documentTypes/component/MlEditDocumentType'
import MlDocumentFormatsList from '../../admin/settings/documentFormats/component/MlDocumentFormatsList'
import MlAddDocumentFormat from '../../admin/settings/documentFormats/component/MlAddDocumentFormat'
import MlEditDocumentFormat from '../../admin/settings/documentFormats/component/MlEditDocumentFormat'
import MlAddKycCategory from  '../../admin/settings/kycCategory/component/MlAddKycCategory'
import MlKycCategoriesList from '../../admin/settings/kycCategory/component/MlKycCategoriesList'
import MlEditKycCategory from '../../admin/settings/kycCategory/component/MlEditKycCategory'
import MlDocumentMappingList from '../../admin/settings/documentMapping/component/MlDocumentMappingList'
import MlAddDocumentMapping from '../../admin/settings/documentMapping/component/MlAddDocumentMapping'
import MlEditDocumentMapping from '../../admin/settings/documentMapping/component/MlEditDocumentMapping'
import MlAddRole from '../../admin/settings/rolesAndPermissions/component/MlAddRole'
import MlEditRole from '../../admin/settings/rolesAndPermissions/component/MlEditRoleType'
import MlAddTransaction from '../../admin/settings/transactions/component/MlAddTransactionType'
import MlTransactionTypeList from '../../admin/settings/transactions/component/MlTransactionTypeList'
import MlEditTransactionType from '../../admin/settings/transactions/component/MlEditTransactionType'
import MlSubChapterView from '../../admin/dashboard/component/MlSubChapterList'
import MlAddTemplate from '../../admin/settings/accountType/component/MlAddAccountType'
import MlTemplateTypeList from '../../admin/settings/accountType/component/MlAccountTypeList'
import MlEditTemplateType from '../../admin/settings/accountType/component/MlEditAccountType'
import MlAddBackendUser from  '../../admin/settings/backendUsers/component/MlAddBackendUser'
import MlEditBackendUser from '../../admin/settings/backendUsers/component/MlEditBackendUser'
import MlBackendUserList from '../../admin/settings/backendUsers/component/MlBackendUserList'
import MlIndustryTypeList from '../../admin/settings/industry/component/MlIndustryTypeList'
import MlAddIndustryType from '../../admin/settings/industry/component/MlAddIndustryType'
import MlEditIndustryType from '../../admin/settings/industry/component/MlEditIndustryType'
import MlSpecificationTypeList from '../../admin/settings/specifications/component/MlSpecificationsTypeList'
import MlAddSpecificationType from '../../admin/settings/specifications/component/MlAddSpecificationsType'
import MlEditSpecificationType from '../../admin/settings/specifications/component/MlEditSpecificationsType'
import MlProfessionTypeList from '../../admin/settings/profession/component/MlProfessionTypeList'
import MlAddProfessionType from '../../admin/settings/profession/component/MlAddProfessionType'
import MlEditProfessionType from '../../admin/settings/profession/component/MlEditProfessionType'
import MlEntityTypeList from '../../admin/settings/entity/component/MlEntityTypeList'
import MlAddEntityType from '../../admin/settings/entity/component/MlAddEntityType'
import MlEditEntityType from '../../admin/settings/entity/component/MlEditEntityType'
import MlStageOfCompanyTypeList from '../../admin/settings/stageOfCompany/component/MlStageOfCompanyTypeList'
import MlAddStageOfCompanyType from '../../admin/settings/stageOfCompany/component/MlAddStageOfCompanyType'
import MlEditStageOfCompanyType from '../../admin/settings/stageOfCompany/component/MlEditStageOfCompanyType'
import MlBusinessTypeList from '../../admin/settings/businessType/component/MlBusinessTypeList'
import MlAddBusinessType from '../../admin/settings/businessType/component/MlAddBusinessType'
import MlEditBusinessType from '../../admin/settings/businessType/component/MlEditBusinessType'
import MlCitizenshipTypeList from '../../admin/settings/citizenship/component/MlCitizenshipTypeList'
import MlAddCitizenshipType from '../../admin/settings/citizenship/component/MlAddCitizenshipType'
import MlEditCitizenshipType from '../../admin/settings/citizenship/component/MlEditCitizenshipType'
import MlLookingForTypeList from '../../admin/settings/lookingFor/component/MlLookingForTypeList'
import MlAddLookingForType from '../../admin/settings/lookingFor/component/MlAddLookingForType'
import MlEditLookingForType from '../../admin/settings/lookingFor/component/MlEditLookingForType'
import MlAddTaxType from '../../admin/settings/taxTypes/component/MlAddTaxType'
import MlTaxTypeList from '../../admin/settings/taxTypes/component/MlTaxTypeList'
import MlEditTaxType from '../../admin/settings/taxTypes/component/MlEditTaxType'
import MlAddTaxation from '../../admin/settings/taxation/component/MlAddTaxation'
import MlTaxationList from '../../admin/settings/taxation/component/MlTaxationList'
import MlEditTaxation from '../../admin/settings/taxation/component/MlEditTaxation'
import MlAddTitle from '../../admin/settings/title/component/MlAddTitle'
import MlTitleList from '../../admin/settings/title/component/MlTitleList'
import MlEditTitle from '../../admin/settings/title/component/MlEditTitle'
import MlRegional from '../../admin/settings/regional/component/MlRegional'
import MlAddLanguage from '../../admin/settings/language/component/MlAddLanguage'
import MlLanguagesList from '../../admin/settings/language/component/MlLanguagesList'
import MlEditLanguage from '../../admin/settings/language/component/MlEditLanguage'
import MlAddDateAndTime from '../../admin/settings/dateAndTime/component/MlDateAndTime'
import MlAddAddressType from '../../admin/settings/addressType/component/MlAddAddressType'
import MlAddressTypeList from '../../admin/settings/addressType/component/MlAddressTypeList'
import MlEditAddressType from '../../admin/settings/addressType/component/MlEditAddressType'
import MlNumericalFormat from '../../admin/settings/numericalFormats/component/MlNumericalFormat'
import MlAddSocialLinkType from '../../admin/settings/socialLinks/component/MlAddSocialLinkType'
import MlSocialLinksTypeList from '../../admin/settings/socialLinks/component/MlSocialLinksTypeList'
import MlEditSocialLinkType from  '../../admin/settings/socialLinks/component/MlEditSocialLinksType'
import MlAddGender from '../../admin/settings/gender/component/MlAddGender'
import MlGenderList from '../../admin/settings/gender/component/MlGenderList'
import MlEditGender from '../../admin/settings/gender/component/MlEditGender'
import MlRoleTypeList from '../../admin/settings/roleType/component/MlRoleTypeList'
import MlEditRoleType from '../../admin/settings/roleType/component/MlEditRoleType'


import MlAssetsList from '../../admin/settings/assets/component/MlAssetsList'
import MlAddAssets from '../../admin/settings/assets/component/MlAddAssets'
import MlEditAssets from '../../admin/settings/assets/component/MlEditAssets'

import MlTechnologiesList from '../../admin/settings/technologies/component/MlTechnologiesList'
import MlAddTechnology from '../../admin/settings/technologies/component/MlAddTechnology'
import MlEditTechnology from '../../admin/settings/technologies/component/MlEditTechnology'

import MlFundingTypeList from '../../admin/settings/fundingType/component/MlFundingTypeList'
import MlAddFundingType from '../../admin/settings/fundingType/component/MlAddFundingType'
import MlEditFundingType from '../../admin/settings/fundingType/component/MlEditFundingType'

import MlAwardTypeList from '../../admin/settings/awards/component/MlAwardTypeList'
import MlAddAwardType from '../../admin/settings/awards/component/MlAddAwardType'
import MlEditAwardType from '../../admin/settings/awards/component/MlEditAwardType'

import MlSubDomainList from '../../admin/settings/subDomain/component/MlSubDomainList'
import MlAddSubDomain from '../../admin/settings/subDomain/component/MlAddSubDomain'
import MlEditSubDomain from '../../admin/settings/subDomain/component/MlEditSubDomain'

/*
    Import Action and Statuses components
 */
import MlActionAndStatusList from '../../admin/settings/actionsAndStatuses/component/ActionsAndStatusesList'
import MlAddActionsAndStatuses from '../../admin/settings/actionsAndStatuses/component/MlAddActionsAndStatuses'
import MlEditActionsAndStatuses from '../../admin/settings/actionsAndStatuses/component/MlEditActionsAndStatuses'
import MlEditGenericActionsAndStatuses from '../../admin/settings/actionsAndStatuses/component/MlEditGenericActionAndStatuses'


// @Created By Sireesha on 23-02-2017
// @For Cluster Admin Settings Employee Type
// @Importing Cluster Admin SettNing Employee Type Components from parent directory

import MlEmployeeTypesList from '../../admin/settings/employeeTypes/components/MlEmployeeTypesList'
import MlAddEmployeeType from '../../admin/settings/employeeTypes/components/MlAddEmployeeType'
import MlEditEmployeeType from '../../admin/settings/employeeTypes/components/MlEditEmployeeType'

// @End

// @Created By Sireesha on 24-02-2017
// @For Cluster Admin Settings Company Type
// @Importing Cluster Admin Setting Company Type Components from parent directory

import MlCompanyTypesList from '../../admin/settings/companyTypes/components/MlCompanyTypesList'
import MlAddCompanyType from '../../admin/settings/companyTypes/components/MlAddCompanyType'
import MlEditCompanyType from '../../admin/settings/companyTypes/components/MlEditCompanyType'
import MlTemplatesList from '../../admin/settings/templates/component/MlTemplatesList'
import MlStepDetails from '../../admin/settings/templates/component/MlStepDetails'
import MlAdminTemplatesHeader from '../../admin/layouts/header/MlAdminTemplatesHeader'

// @End



// @Created By Sireesha on 24-02-2017
// @For Cluster Admin Settings Company Type
// @Importing Cluster Admin Setting Email Type Components from parent directory

import MlEmailTypesList from '../../admin/settings/emailType/components/MlEmailTypeList'
import MlAddEmailType from '../../admin/settings/emailType/components/MlAddEmailType'
import MlEditEmailType from '../../admin/settings/emailType/components/MlEditEmailType'

// @End

// @Created By Sireesha on 24-02-2017
// @For Cluster Admin Settings Company Type
// @Importing Cluster Admin Setting Contact Type Components from parent directory

import MlContactTypesList from '../../admin/settings/contactType/components/MlContactTypeList'
import MlAddContactType from '../../admin/settings/contactType/components/MlAddContactType'
import MlEditContactType from '../../admin/settings/contactType/components/MlEditContactType'
import {mlClusterListConfig,mlClusterMapConfig} from '../../admin/settings/hierarchy/config/mlClusterConfigHierarchy'
import {mlClusterSubChaptersListConfig} from '../../admin/settings/hierarchy/config/mlClusterSubChaptersConfigHierarchy'
import MlViews from '../../admin/core/components/MlViews';
import MlHierarchyList from '../../admin/settings/hierarchy/component/MlHierarchyList'
import MlAdminHierarchyHeader from '../../admin/layouts/header/MlAdminHierarchyHeader'
// import MlHierarchyDetails from '../../admin/settings/hierarchy/component/absolute'
import MlFiltersList from '../../admin/settings/filters/components/MlFiltersList'
import MlEditFilter from '../../admin/settings/filters/components/MlAddFilter'
/*import MlEditFilter from '../../admin/settings/filters/components/MlEditFilter'*/
import MlHierarchyTabHistoryList from '../../admin/settings/hierarchy/hierarchyAuditLog/components/MlHierarchyTabHistoryList'
import MlHierarchyDepartmentsList from '../../admin/settings/hierarchy/component/MlHierarchyDepartmentsList'
// @End

import MlAdminHeader from '../../admin/layouts/header/MlAdminHeader';
import MlSettingsTabHistoryList from '../../admin/settings/settingsAuditLog/components/MlSettingsTabHistoryList'
import MlClusterSettingsTabHistoryList from '../../admin/settings/clusterSettingsAuditLog/components/MlClusterSettingsTabHistoryList'
import  MlChapterSettingsTabHistoryList from '../../admin/settings/chapterSettingsAuditLog/components/MlChapterSettingsTabHistory'
import MlCommunitySettingsTabHistoryList from '../../admin/settings/communitySettingsAuditLog/components/MlCommunitySettingsTabHistory'
import MlsubChapterSettingsTabHistoryList from '../../admin/settings/subChapterSettingsAuditLog/components/MlsubChapterSettingsTabHistory'
import MlsubChapterNonMoolyaTabHistoryList from '../../admin/settings/subChapterNon-MoolyaSettingsAuditLog/components/MlsubChapterNon-MoolyaSettingsTabHistory'


import MlNotificationTemplateList from '../../admin/settings/notificationTemplate/component/MlNotificationTemplateList';
import MlAddNotificationTemplate from '../../admin/settings/notificationTemplate/component/MlAddNotificationTemplate';
import MlEditNotificationTemplate from '../../admin/settings/notificationTemplate/component/MlEditNotificationTemplate';

adminSection.route('/settings/departmentsList', {
  name: 'settings_DepartmentList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'departments'}} />,adminContent:< MlDepartmentsList />})
  }
});
adminSection.route('/settings/addDepartment', {
  name: 'settings_AddDepartment',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'departments'}} />,adminContent:< MlAddDepartment/>})
  }
});
adminSection.route('/settings/editDepartment/:id', {
  name: 'settings_EditDepartment',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'departments'}} />,adminContent:< MlEditDepartment config={params.id}/>})
  }
});
adminSection.route('/settings/subDepartmentsList', {
  name: 'settings_SubDepartmentList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'subDepartments'}} />,adminContent:< MlSubDepartmentsList/>})
  }
});
adminSection.route('/settings/templatesList', {
  name: 'settings_templatesList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'templates'}} />, adminContent:< MlTemplatesList/>})
  }
});
adminSection.route('/settings/addSubDepartment', {
  name: 'settings_AddSubDepartments',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'subDepartments'}} />,adminContent:< MlAddSubDepartment/>})
  }
});
adminSection.route('/settings/stepDetails/:subProcessId/:templateId/:stepCode', {
  name: 'settings',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminTemplatesHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'templates','subModule':'stepCode'}}  subProcessConfig={params.subProcessId} templateId={params.templateId}  />,adminContent:<MlStepDetails templateId={params.templateId} subProcessConfig={params.subProcessId} stepCode={params.stepCode}/>})
  }
});
/*
adminSection.route('/settings/hierarchy', {
  name: 'hierarchy',
  action(){
    mount(AdminLayout,{adminContent:<MlViews viewMode={false} showInfinity={false} mapConfig={mlClusterMapConfig} listConfig={mlClusterListConfig} />})
  }
});
adminSection.route('/settings/hierarchy/:clusterId/chapters', {
  name: 'hierarchy_chapters',
  action(params){
    mount(AdminLayout,{adminContent:< MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlClusterSubChaptersListConfig}/>})
  }
});
adminSection.route('/settings/hierarchy/:clusterId/platformhierarchy', {
  name: 'hierarchy_details',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHierarchyHeader clusterId={params.clusterId}/>,adminContent:< MlHierarchyList/>})
  }
});
adminSection.route('/settings/hierarchy/:clusterId/clusterhierarchy', {
  name: 'hierarchy_cluster',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHierarchyHeader clusterId={params.clusterId}/>,adminContent:< MlHierarchyDetails clusterId={params.clusterId}/>})
  }
});*/
adminSection.route('/settings/hierarchy/platformhierarchy', {
  name: 'hierarchy_details',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHierarchyHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'hierarchy', subModule:'platformHierarchy'}}/>,adminContent:< MlHierarchyList/>})
  }
});
adminSection.route('/settings/hierarchy/clusterhierarchy', {
  name: 'hierarchy',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHierarchyHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'hierarchy', subModule:'clusterHierarchy'}}/>,adminContent:<MlViews viewMode={false} showInfinity={false} mapConfig={mlClusterMapConfig} listConfig={mlClusterListConfig} />})
  }
});
adminSection.route('/settings/hierarchy/history', {
  name: 'hierarchy',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHierarchyHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'hierarchy', subModule:'history'}}/>,adminContent:<MlHierarchyTabHistoryList />})
  }
});
adminSection.route('/settings/hierarchy/clusterhierarchy/:clusterId/chapters', {
  name: 'hierarchy_chapters',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHierarchyHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'hierarchy', subModule:'clusterHierarchy'
    ,'dynamic':true}}/>,adminContent:< MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlClusterSubChaptersListConfig}/>})
  }
});
adminSection.route('/settings/hierarchy/clusterhierarchy/:clusterId/:subChapterId/:defaultSubChapter/hierarchyDetails', {
  name: 'hierarchy_details',
  action(params){
    //mount(AdminLayout,{headerContent:<MlAdminHierarchyHeader clusterId={params.clusterId}/>,adminContent:< MlHierarchyDetails clusterId={params.clusterId} subChapterId={params.subChapterId} defaultSubChapter={params.defaultSubChapter}/>} )
    mount(AdminLayout,{headerContent:<MlAdminHierarchyHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'hierarchy', subModule:'clusterHierarchy','dynamic':true}} clusterId={params.clusterId}/>,adminContent:< MlHierarchyDepartmentsList clusterId={params.clusterId} subChapterId={params.subChapterId} defaultSubChapter={params.defaultSubChapter}/>} )
  }
});

adminSection.route('/settings/editSubDepartment/:id', {
  name: 'settings_EditSubDepartments',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'subDepartments'}} />,adminContent:< MlEditSubDepartment config={params.id}/>})
  }
});

adminSection.route('/settings/documentProcess/processList', {
  name: 'settings_processList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'processMapping'}} />, adminContent:<MlProcessMappingList />})
  }
});
adminSection.route('/settings/documentProcess/addProcess', {
  name: 'settings_addProcess',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'processMapping'}} />,adminContent:<MlAddProcessMapping />})
  }
});

adminSection.route('/settings/documentProcess/editProcess/:id', {
  name: 'settings_editProcess',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'processMapping'}} />,adminContent:<MlEditProcessMapping config={params.id} />})
  }
});

adminSection.route('/settings/backendUserList', {
  name: 'settings_BackendUserList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'backendUser'}} />, adminContent:< MlBackendUserList/>})
  }
});
adminSection.route('/settings/addBackendUser', {
  name: 'settings_AddBackendUser',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'backendUser'}} />, adminContent:< MlAddBackendUser/>})
  }
});
adminSection.route('/settings/editBackendUser/:id', {
  name: 'settings_EditBackendUser',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'backendUser'}} />, adminContent:< MlEditBackendUser config={params.id}/>})
  }
});

adminSection.route('/settings/requestTypeList', {
  name: 'settings_RequestTypeList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'requestType'}} />, adminContent:< MlRequestTypeList/>})
  }
});
adminSection.route('/settings/addRequestType', {
  name: 'settings_AddRequestType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'requestType'}} />,adminContent:<MlAddRequestType />})
  }
});
adminSection.route('/settings/editRequestType/:id', {
  name: 'settings_EditRequestType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'requestType'}} />,adminContent:<MlEditRequestType config={params.id} />})
  }
});

adminSection.route('/settings/countriesList', {
  name: 'settings_CountriesList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'countries'}} />, adminContent:< MlCountriesList/>})
  }
});
adminSection.route('/settings/editCountry/:id', {
  name: 'settings_EditCountry',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'countries'}} />,adminContent:< MlEditCountry config={params.id} />})
  }
});
adminSection.route('/settings/statesList', {
  name: 'settings_StatesList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'states'}} />, adminContent:< MlStatesList/>})
  }
});
adminSection.route('/settings/editState/:id', {
  name: 'settings_EditState',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'states'}} />,adminContent:< MlEditState config={params.id} />})
  }
});
adminSection.route('/settings/citiesList', {
  name: 'settings_CitiesList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'cities'}} />, adminContent:< MlCitiesList/>})
  }
});
adminSection.route('/settings/editCity/:id', {
  name: 'settings_EditCity',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'cities'}} />,adminContent:< MlEditCity config={params.id} />})
  }
});

/*adminSection.route('/myprofile', {
  name: 'myprofile',
  action(){
    mount(AdminLayout,{adminContent:< MlMyProfile/>})
  }
});*/
adminSection.route('/settings/documentProcess/userTypeList', {
  name: 'settings_UserTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'userType','subModuleName':'User Categories'}} />, adminContent:< MlUserTypeList/>})
  }
});
adminSection.route('/settings/documentProcess/editUserType/:id', {
  name: 'settings_EditUserType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'userType','subModuleName':'User Categories'}} />,adminContent:< MlEditUserType  config={params.id}/>})
  }
});
adminSection.route('/settings/documentProcess/addUserType', {
  name: 'settings_AddUserType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'userType','subModuleName':'User Categories'}} />,adminContent:< MlAddUserType/>})
  }
});
adminSection.route('/settings/rolesList', {
  name: 'settings_rolesList',
  action(){

    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'roles'}} />, adminContent:< MlRoleList/>})

  }
});
adminSection.route('/settings/createRole', {
  name: 'settings_createRole',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'roles'}} />,adminContent:< MlAddRole/>})
  }
});
adminSection.route('/settings/editRole/:id', {
  name: 'settings_EditRole',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'roles'}} />,adminContent:< MlEditRole  config={params.id}/>})
  }
});
adminSection.route('/settings/transactionTypeList', {
  name: 'settings_TransactionTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'transactionType'}} />, adminContent:< MlTransactionTypeList/>})
  }
});
adminSection.route('/settings/addTransactionType', {
  name: 'settings_AddTransactionType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'transactionType'}} />,adminContent:<MlAddTransaction />})
  }
});
adminSection.route('/settings/editTransactionType/:id', {
  name: 'settings_EditTransactionType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'transactionType'}} />,adminContent:<MlEditTransactionType config={params.id} />})
  }
});
adminSection.route('/settings/documentProcess/documentTypeList', {
  name: 'settings_DocumentTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'documentType','subModuleName':'Document Types'}} />, adminContent:< MlDocumentTypesList/>})
  }
});
adminSection.route('/settings/documentProcess/addDocumentType', {
  name: 'settings_AddDocumentType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'documentType','subModuleName':'Document Types'}} />,adminContent:< MlAddDocumentType/>})
  }
});
adminSection.route('/settings/documentProcess/editDocumentType/:id', {
  name: 'settings_EditDocumentType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'documentType','subModuleName':'Document Types'}} />,adminContent:<MlEditDocumentType config={params.id} />})
  }
});
adminSection.route('/settings/documentProcess/documentFormatList', {
  name: 'settings_DocumentFormatList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'documentFormat','subModuleName':'Document Formats'}} />, adminContent:< MlDocumentFormatsList/>})
  }
});
adminSection.route('/settings/documentProcess/addDocumentFormat', {
  name: 'settings_AddDocumentFormat',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'documentFormat','subModuleName':'Document Formats'}} />,adminContent:< MlAddDocumentFormat/>})
  }
});
adminSection.route('/settings/documentProcess/editDocumentFormat/:id', {
  name: 'settings_EditDocumentFormat',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'documentFormat','subModuleName':'Document Formats'}}/>,adminContent:<MlEditDocumentFormat config={params.id} />})
  }
});
adminSection.route('/settings/documentProcess/kycCategoryList', {
  name: 'settings_KycCategoryList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'kycCategory','subModuleName':'KYC Category'}} />, adminContent:< MlKycCategoriesList/>})
  }
});
adminSection.route('/settings/documentProcess/addKycCategory', {
  name: 'settings_AddKycCategory',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'kycCategory','subModuleName':'KYC Category'}} />,adminContent:< MlAddKycCategory/>})
  }
});
adminSection.route('/settings/documentProcess/editKycCategory/:id', {
  name: 'settings_EditKycCategory',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'kycCategory','subModuleName':'KYC Category'}} />,adminContent:<MlEditKycCategory config={params.id} />})
  }
});
adminSection.route('/settings/documentProcess/documentMappingList', {
  name: 'settings_DocumentMappingList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'documentMapping'}} />, adminContent:< MlDocumentMappingList/>})
  }
});
adminSection.route('/settings/documentProcess/addDocumentMapping', {
  name: 'settings_AddDocumentMapping',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'documentMapping'}} />,adminContent:< MlAddDocumentMapping/>})
  }
});
adminSection.route('/settings/documentProcess/editDocumentMapping/:id', {
  name: 'settings_EditDocumentMapping',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'documentMapping'}} />,adminContent:<MlEditDocumentMapping config={params.id} />})
  }
});
adminSection.route('/settings/accountTypeList', {
  name: 'settings_TemplateTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'accountType'}} />, adminContent:< MlTemplateTypeList/>})
  }
});
adminSection.route('/settings/addAccountType', {
  name: 'settings_AddTemplateType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'accountType'}} />,adminContent:<MlAddTemplate />})
  }
});
adminSection.route('/settings/editAccountType/:id', {
  name: 'settings_EditTemplateType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'accountType'}} />,adminContent:<MlEditTemplateType config={params.id} />})
  }
});

adminSection.route('/settings/documentProcess/industryList', {
  name: 'settings_IndustryTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'industry','subModuleName':'Industries'}} />,adminContent:< MlIndustryTypeList/>})
  }
});
adminSection.route('/settings/documentProcess/addIndustry', {
  name: 'settings_AddIndustryType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'industry','subModuleName':'Industries'}}  />,adminContent:<MlAddIndustryType />})
  }
});
adminSection.route('/settings/documentProcess/editIndustry/:id', {
  name: 'settings_EditIndustryType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'industry','subModuleName':'Industries'}} />,adminContent:<MlEditIndustryType config={params.id} />})
  }
});
adminSection.route('/settings/documentProcess/specificationList', {
  name: 'settings_SpecificationTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'specification','subModuleName':'Specifications'}}  />, adminContent:< MlSpecificationTypeList/>})
  }
});
adminSection.route('/settings/documentProcess/addSpecification', {
  name: 'settings_AddSpecificationType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'specification','subModuleName':'Specifications'}}/>,adminContent:< MlAddSpecificationType />})
  }
});
adminSection.route('/settings/documentProcess/editSpecification/:id', {
  name: 'settings_EditIndustryType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'specification','subModuleName':'Specifications'}}/>,adminContent:<MlEditSpecificationType config={params.id} />})
  }
});
adminSection.route('/settings/documentProcess/professionList', {
  name: 'settings_ProfessionTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'profession','subModuleName':'Professions'}}/>, adminContent:< MlProfessionTypeList/>})
  }
});
adminSection.route('/settings/documentProcess/addProfession', {
  name: 'settings_AddProfessionType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'profession','subModuleName':'Professions'}}/>,adminContent:< MlAddProfessionType />})
  }
});
adminSection.route('/settings/documentProcess/editProfession/:id', {
  name: 'settings_EditProfessionType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader  breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'profession','subModuleName':'Professions'}} />,adminContent:<MlEditProfessionType config={params.id} />})
  }
});
// adminSection.route('/settings/entityList', {            //Segregation of admin settings
adminSection.route('/settings/registration/entityList', {
  name: 'settings_EntityTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'entity'}} />, adminContent:< MlEntityTypeList/>})
  }
});
adminSection.route('/settings/registration/addEntity', {
  name: 'settings_AddEntityType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'entity'}} />, adminContent:< MlAddEntityType />})
  }
});
adminSection.route('/settings/registration/editEntity/:id', {
  name: 'settings_EditEntityType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'entity'}} />, adminContent:<MlEditEntityType config={params.id} />})
  }
});
adminSection.route('/settings/registration/stageOfCompanyList', {
  name: 'settings_StageOfCompanyTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'stageOfCompany'}} />, adminContent:< MlStageOfCompanyTypeList/>})
  }
});
adminSection.route('/settings/registration/addStageOfCompany', {
  name: 'settings_AddStageOfCompanyType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'stageOfCompany'}} />, adminContent:< MlAddStageOfCompanyType />})
  }
});
adminSection.route('/settings/registration/editStageOfCompany/:id', {
  name: 'settings_EditStageOfCompanyType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'stageOfCompany'}} />, adminContent:<MlEditStageOfCompanyType config={params.id} />})
  }
});
adminSection.route('/settings/registration/businessList', {
  name: 'settings_BusinessTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'business'}} />, adminContent:< MlBusinessTypeList/>})
  }
});
adminSection.route('/settings/registration/addBusiness', {
  name: 'settings_AddBusinessType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'business'}} />, adminContent:< MlAddBusinessType />})
  }
});
adminSection.route('/settings/registration/editBusiness/:id', {
  name: 'settings_EditBusinessType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'business'}} />, adminContent:<MlEditBusinessType config={params.id} />})
  }
});
adminSection.route('/settings/registration/citizenshipList', {
  name: 'settings_CitizenshipTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'citizenship'}} />, adminContent:< MlCitizenshipTypeList/>})
  }
});
adminSection.route('/settings/registration/addCitizenship', {
  name: 'settings_AddCitizenshipType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'citizenship'}} />,adminContent:< MlAddCitizenshipType />})
  }
});
adminSection.route('/settings/registration/editCitizenship/:id', {
  name: 'settings_EditCitizenshipType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'citizenship'}} />,adminContent:<MlEditCitizenshipType config={params.id} />})
  }
});
adminSection.route('/settings/registration/lookingForList', {
  name: 'settings_LookingForTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'lookingFor'}} />,adminContent:< MlLookingForTypeList/>})
  }
});
adminSection.route('/settings/registration/addLookingFor', {
  name: 'settings_AddLookingForType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'lookingFor'}} />,adminContent:< MlAddLookingForType />})
  }
});
adminSection.route('/settings/registration/editLookingFor/:id', {
  name: 'settings_EditLookingForType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module': 'registration' ,'subModule' :'lookingFor'}} />,adminContent:<MlEditLookingForType config={params.id} />})
  }
});

adminSection.route('/settings/assetsList', {
  name: 'settings_assetsList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'assets'}} />,adminContent:< MlAssetsList/>})
  }
});
adminSection.route('/settings/addassets', {
  name: 'settings_Addassets',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'assets'}} />,adminContent:< MlAddAssets />})
  }
});
adminSection.route('/settings/editassets/:id', {
  name: 'settings_Editassets',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'assets'}} />,adminContent:<MlEditAssets config={params.id} />})
  }
});



adminSection.route('/settings/technologiesList', {
  name: 'settings_technologiesList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'technologies'}} />, adminContent:<MlTechnologiesList/>})
  }
});
adminSection.route('/settings/addTechnology', {
  name: 'settings_AddTechnology',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'technologies'}} />, adminContent:< MlAddTechnology />})
  }
});
adminSection.route('/settings/edittechnology/:id', {
  name: 'settings_Edittechnology',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'technologies'}} />, adminContent:<MlEditTechnology config={params.id} />})
  }
});

///////////////////////////////////////////////////////////////////////////////////////

adminSection.route('/settings/documentProcess/subDomainList', {
  name: 'settings_SubDomainList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'subDomain','subModuleName':'Sub Domains'}} />, adminContent:<MlSubDomainList/>})
  }
});
adminSection.route('/settings/documentProcess/addSubDomain', {
  name: 'settings_AddSubDomain',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'subDomain','subModuleName':'Sub Domains'}}  />,adminContent:< MlAddSubDomain />})
  }
});
adminSection.route('/settings/documentProcess/editSubDomain/:id', {
  name: 'settings_EditSubDomain',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'documentProcess','subModule':'subDomain','subModuleName':'Sub Domains'}}  />,adminContent:<MlEditSubDomain config={params.id} />})
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////

adminSection.route('/settings/fundingTypeList', {
  name: 'settings_FundingTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'fundingType'}} />, adminContent:<MlFundingTypeList/>})
  }
});
adminSection.route('/settings/addFundingType', {
  name: 'settings_AddFundingType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'fundingType'}} />,adminContent:< MlAddFundingType />})
  }
});
adminSection.route('/settings/editFundingType/:id', {
  name: 'settings_EditFundingType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'fundingType'}} />,adminContent:<MlEditFundingType config={params.id} />})
  }
});





adminSection.route('/settings/regionalsList', {
  name: 'settings_RegionalsList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'regional'}} />,adminContent:< MlRegional/>})
  }
});
adminSection.route('/settings/languagesList', {
  name: 'settings_LanguagesList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'languages'}} />,adminContent:< MlLanguagesList/>})
  }
});
adminSection.route('/settings/addLanguage', {
  name: 'settings_AddLanguage',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'languages'}} />,adminContent:< MlAddLanguage />})
  }
});
adminSection.route('/settings/editLanguage/:id', {
  name: 'settings_EditLanguage',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'languages'}} />,adminContent:<MlEditLanguage config={params.id} />})
  }
});
adminSection.route('/settings/dateAndTimeList', {
  name: 'settings_DateAndTimeList',
  action(){``
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'dateAndTime'}} />,adminContent:< MlAddDateAndTime/>})
  }
});

adminSection.route('/settings/taxTypeList', {
  name: 'settings_TaxTypeList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'taxType'}} />,adminContent:< MlTaxTypeList/>})
  }
});
adminSection.route('/settings/addTaxType', {
  name: 'settings_AddTaxType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'taxType'}} />,adminContent:<MlAddTaxType />})
  }
});
adminSection.route('/settings/editTaxType/:id', {
  name: 'settings_EditTaxType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'taxType'}} />,adminContent:<MlEditTaxType config={params.id} />})
  }
});
adminSection.route('/settings/addTaxation', {
  name: 'settings_AddTaxation',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'taxation'}} />,adminContent:<MlAddTaxation />})
  }
});
adminSection.route('/settings/taxationList', {
  name: 'settings_TaxationList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'taxation'}} />,adminContent:<MlTaxationList />})
  }
});
adminSection.route('/settings/editTaxation/:id', {
  name: 'settings_EditTaxation',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'taxation'}} />,adminContent:<MlEditTaxation config={params.id} />})
  }
});
adminSection.route('/settings/titleList', {
  name: 'settings_TitleList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'title'}} />,adminContent:< MlTitleList/>})
  }
});
adminSection.route('/settings/addTitle', {
  name: 'settings_AddTitle',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'title'}} />,adminContent:<MlAddTitle />})
  }
});
adminSection.route('/settings/editTitle/:id', {
  name: 'settings_EditTitle',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'title'}} />,adminContent:<MlEditTitle config={params.id} />})
  }
});


// @Created By Sireesha on 23-02-2017
// @For Cluster Admin Settings Employee Type


/////////// for employee type create module
adminSection.route('/settings/addEmployeeType', {
  name: 'settings_AddEmployeeType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'employeeTypes'}} />,adminContent:< MlAddEmployeeType />})
  }
});
/////////// for employee type edit module
adminSection.route('/settings/editEmployeeType/:id', {
  name: 'settings_EditEmployeeType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'employeeTypes'}} />,adminContent:<MlEditEmployeeType config={params.id} />})
  }
});
/////////// for list of employee types
adminSection.route('/settings/employeeTypesList', {
  name: 'settings_employeeTypesList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'employeeTypes'}} />,adminContent:< MlEmployeeTypesList/>})
  }
});

//  @End
adminSection.route('/settings/addressTypeList', {
  name: 'settings_AddressTypeList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'addressType'}} />,adminContent:< MlAddressTypeList/>})
  }
});
adminSection.route('/settings/addAddressType', {
  name: 'settings_AddAddressType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'addressType'}} />,adminContent:<MlAddAddressType />})
  }
});
adminSection.route('/settings/editAddressType/:id', {
  name: 'settings_EditAddressType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'addressType'}} />,adminContent:<MlEditAddressType config={params.id} />})
  }
});
adminSection.route('/settings/numericalFormatList', {
  name: 'settings_NumericalFormatList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'numericalFormat'}} />,adminContent:< MlNumericalFormat/>})
  }
});
adminSection.route('/settings/socialLinkTypeList', {
  name: 'settings_SocialLinkTypeList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'socialLinkType'}} />,adminContent:< MlSocialLinksTypeList/>})
  }
});
adminSection.route('/settings/addSocialLinkType', {
  name: 'settings_AddSocialLinkType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'socialLinkType'}} />,adminContent:<MlAddSocialLinkType />})
  }
});
adminSection.route('/settings/editSocialLinkType/:id', {
  name: 'settings_EditSocialLinkType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'socialLinkType'}} />,adminContent:<MlEditSocialLinkType config={params.id} />})
  }
});
adminSection.route('/settings/gendersList', {
  name: 'settings_GenderList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'gender'}} />,adminContent:< MlGenderList/>})
  }
});
adminSection.route('/settings/addGender', {
  name: 'settings_AddSocialLinkType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'gender'}} />,adminContent:<MlAddGender />})
  }
});
adminSection.route('/settings/editGender/:id', {
  name: 'settings_EditGender',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'gender'}} />,adminContent:<MlEditGender config={params.id} />})
  }
});

// @Created By Sireesha on 24-02-2017
// @For Cluster Admin Settings Company Type


/////////// for company type create module
adminSection.route('/settings/addCompanyType', {
  name: 'settings_AddCompanyType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'companyTypes'}} />,adminContent:< MlAddCompanyType />})
  }
});
/////////// for employee type edit module
adminSection.route('/settings/editCompanyType/:id', {
  name: 'settings_EditCompanyType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'companyTypes'}} />,adminContent:<MlEditCompanyType config={params.id} />})
  }
});
/////////// for list of employee types
adminSection.route('/settings/companyTypesList', {
  name: 'settings_CompanyTypesList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'companyTypes'}} />,adminContent:< MlCompanyTypesList/>})
  }
});

//  @End

// @Created By Sireesha on 24-02-2017
// @For Cluster Admin Settings Email Type


/////////// for company type create module
adminSection.route('/settings/addEmailType', {
  name: 'settings_AddEmailType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'emailTypes'}} />,adminContent:< MlAddEmailType />})
  }
});
/////////// for employee type edit module
adminSection.route('/settings/editEmailType/:id', {
  name: 'settings_EditEmailType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'emailTypes'}} />,adminContent:<MlEditEmailType config={params.id} />})
  }
});
/////////// for list of employee types
adminSection.route('/settings/emailTypesList', {
  name: 'settings_EmailTypesList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'emailTypes'}} />,adminContent:< MlEmailTypesList/>})
  }
});

//  @End

// @Created By Sireesha on 24-02-2017
// @For Cluster Admin Settings Email Type


/////////// for contact type create module
adminSection.route('/settings/addContactType', {
  name: 'settings_AddContactType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'contactTypes'}} />,adminContent:< MlAddContactType />})
  }
});
/////////// for contact type edit module
adminSection.route('/settings/editContactType/:id', {
  name: 'settings_EditContactType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'contactTypes'}} />,adminContent:<MlEditContactType config={params.id} />})
  }
});
/////////// for list of contact types
adminSection.route('/settings/contactTypesList', {
  name: 'settings_ContactTypesList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'contactTypes'}} />,adminContent:< MlContactTypesList/>})
  }
});

adminSection.route('/settings/cluster/history', {
  name: 'clusterSettings_historyList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'history'}} />,adminContent:< MlClusterSettingsTabHistoryList/>})
  }
});


adminSection.route('/settings/roleTypeList', {
    name: 'settings_RoleTypeList',
    action(){
        mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'roleType'}} />, adminContent:< MlRoleTypeList/>})
    }
});
adminSection.route('/settings/editRoleType/:id', {
    name: 'settings_EditRoleType',
    action(params){
        mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'roleType'}} />,adminContent:< MlEditRoleType  config={params.id}/>})
    }
});

adminSection.route('/settings/awardList', {
  name: 'settings_AwardTypeList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'award'}} />,adminContent:< MlAwardTypeList/>})
  }
});
adminSection.route('/settings/addAward', {
  name: 'settings_AddAwardType',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'award'}} />,adminContent:<MlAddAwardType />})
  }
});
adminSection.route('/settings/editAward/:id', {
  name: 'settings_EditAwardType',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'award'}} />,adminContent:<MlEditAwardType config={params.id} />})
  }
});

adminSection.route('/settings/filtersList', {
  name: 'settings_FiltersList',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'filters'}} />, adminContent:<MlFiltersList />})
  }
});

/*
adminSection.route('/settings/addFilter', {
  name: 'settings_AddFilter',
  action(){
    mount(AdminLayout,{adminContent:<MlAddFilter/>})
  }
});
*/

adminSection.route('/settings/editFilter/:id', {
  name: 'settings_EditFilter',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'filters'}} />,adminContent:<MlEditFilter config={params.id}/>})
  }
});

/*
    Route for Actions and Status List
 */
adminSection.route('/settings/actionsAndStatusesList', {
  name: 'settings_ActionsAndStatuses_List',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'actionsAndStatuses'}} />, adminContent:<MlActionAndStatusList />})
  }
});

/*
 Route for Add Actions and Status
 */
adminSection.route('/settings/addActionsAndStatuses', {
  name: 'settings_ActionsAndStatuses_Add',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'actionsAndStatuses'}} />,adminContent:<MlAddActionsAndStatuses />})
  }
});

/*
 Route for Edit Actions and Status
 */
adminSection.route('/settings/editActionsAndStatuses/:id', {
  name: 'settings_ActionsAndStatuses_Edit',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'actionsAndStatuses'}} />,adminContent:<MlEditActionsAndStatuses />})
  }
});

/*
 Route for Edit Actions and Status
 */
adminSection.route('/settings/editActionsAndStatuses/:id/:Did', {
  name: 'settings_Generic_ActionsAndStatuses_Edit',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'actionsAndStatuses'}} />,adminContent:<MlEditGenericActionsAndStatuses />})
  }
});

adminSection.route('/settings/history', {
  name: 'settings_historyList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'history'}} />,adminContent:< MlSettingsTabHistoryList/>})
  }
});
adminSection.route('/settings/chapter/history', {
  name: 'chapterSettings_historyList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'history'}} />,adminContent:< MlChapterSettingsTabHistoryList/>})
  }
});
adminSection.route('/settings/community/history', {
  name: 'communitySettings_historyList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'history'}} />,adminContent:< MlCommunitySettingsTabHistoryList/>})
  }
});
adminSection.route('/settings/subChapter/history', {
  name: 'subChapterSettings_historyList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'history'}} />,adminContent:< MlsubChapterSettingsTabHistoryList/>})
  }
});
adminSection.route('/settings/subChapterNonMoolya/history', {
  name: 'subChapterNonMoolyaSettings_historyList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'history'}} />,adminContent:< MlsubChapterNonMoolyaTabHistoryList/>})
  }
});

/** Notification Template routes Start*/
adminSection.route('/settings/notificationTemplateList', {
  name: 'settings_NotificationTemplateList',
  action(){
    mount(AdminLayout, {headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'notificationTemplate'}} />, adminContent:<MlNotificationTemplateList/>})
  }
})

adminSection.route('/settings/addNotificationTemplate', {
  name: 'settings_AddNotificationTemplate',
  action(){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'notificationTemplate'}} />, adminContent:< MlAddNotificationTemplate />})
  }
});
adminSection.route('/settings/editNotificationTemplate/:id', {
  name: 'settings_EditNotificationTemplate',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'setting','showBreadCrum':true,'module':'notificationTemplate'}} />, adminContent:<MlEditNotificationTemplate config={params.id} />})
  }
});

/** Notification Template routes End*/
//  @End
