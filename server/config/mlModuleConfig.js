/**
 * Created by venkatasrinag on 28/1/17.
 */

// let modules = ["community", "chapter", "subchapter", "cluster", "department", "subdepartment", "permissions", "roles", "users", "settings", "documents", "conversations", "countries", "states", "cities", "request", "userType", "roleType", "documentType", "documentFormat", "kycCategory", "documentMapping", "transaction", "accountType", "BackendUsers", "industry", "specification", "profession", "entity", "stageOfCompany", "process", "process", "businessType", "citizenship", "lookingFor", "EmployeeType", "tax","taxation","globalSettings","masterSettings","registration"];
//let modules = ["community", "chapter", "subchapter", "cluster", "department", "subdepartment", "roles", "users", "settings", "documents", "conversations", "countries", "states", "cities", "userType", "roleType", "documentType", "documentFormat", "documentMapping", "template", "industry", "specification", "profession", "entity", "stageOfCompany", "processTypes", "businessType", "citizenship", "lookingFor","taxation","globalSettings","masterSettings","registration", "CommunityDefinition", "processMapping", "hierarchy", "identityTypes", "subProcess", "ideatorPortfolio", "portfolioLibrary", "communityAccess", "services" , "templateTypes", "documentCategories", "filters", 'templateAssignment', 'transactionTypes', 'requestType', 'awards', 'fundingType','portfolio','transactionLog','internalRequests','internalApprovedRequests'];
let modules = [
    "community",
    "chapter",
    "subchapter",
    "cluster",
    "department",
    "subdepartment",
    "roles",
    "users",
    "settings",
    "documents",
    "conversations",
    "countries",
    "states",
    "cities",
    "userType",
    "roleType",
    "documentType",
    "documentFormat",
    "kycCategory",
    "Assets",
    "documentMapping",
    "template",
    "industry",
    "specification",
    "profession",
    "entity",
    "stageOfCompany",
    "processTypes",
    "businessType",
    "citizenship",
    "lookingFor",
    "taxation",
    "globalSettings",
    "masterSettings",
    "registration",
    "CommunityDefinition",
    "processMapping",
    "hierarchy",
    "identityTypes",
    "subProcess",
    "Technologies",
    "SubDomain",
    "communityAccess",
    // "templates",
    "services" ,
    // "templateTypes",
    "documentCategories",
    "filters",
    'templateAssignment',
    'transactionTypes',
    'requestType',
    'awards',
    'fundingType',
    'portfolio',
    'transactionsLog',
    'modulelist',
    "internalRequests",
    "internalApprovedRequests",
    "actionAndStatus",
    "accountType",
    'office',
    'officepackage',
    "processSetup",
    'subscriptions',
    'interaction',
    'actions',
    'serviceCard',
    'share',
    'notificationtemplate',
    "appointment"
  ];

// Meteor.startup(function () {

for (i = 0; i < modules.length; i++) {
  let module = MlModules.findOne({name: modules[i]});
  if (!module) {
    module = {name: modules[i], displayName: modules[i], code: modules[i].toUpperCase(), isActive: true};
    MlModules.insert(module);
  }
}
// })
