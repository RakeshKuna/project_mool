import MlResolver from "../../../commons/mlResolverDef";
import CoreModulesRepo from "./repository/mlAdminContextModulesRepo";
import MlAdminContextQueryConstructor from "./repository/mlAdminContextQueryConstructor";
import getQuery from "../genericSearch/queryConstructor";
import {includes} from 'lodash'

let mergeQueries=function(userFilter,serverFilter){
  let query=userFilter||{};
  if (_.isEmpty(query)) {
    query = serverFilter||{};
  } else {
    query = {$and: [userFilter,serverFilter]};
  }
  return query;
}


MlResolver.MlQueryResolver['ContextSpecSearch'] = async (obj, args, context, info) =>{
  var totalRecords=0;
  var findOptions = {};

  // `offset` may be `null`
  if(args.offset && args.offset >0){
    findOptions.skip=args.offset;
  };

  // `limit` may be `null`
  if (args.limit&&args.limit > 0) {
    findOptions.limit = args.limit;
  }

  //'filter' applied by user
  let userFilterQuery={};
  if (args.fieldsData){
    userFilterQuery = getQuery.searchFunction(args);
  }

  if(args.sortData){
    let sortObj = getQuery.sortFunction(args);
    findOptions.sort=sortObj||{};
  }

  var moduleName=args.module;
  //to resolve the type in data _resolveType for Union
  context.module=args.module;
  //console.log("ContextResolverArgs-"+args.module);
  //console.log("ContextResolverModule-"+context.module);

  //Authorization layer
  var transactionModules = ['registrationInfo', 'registrationApprovedInfo', 'registrationRejectedInfo', 'internalRequests', "share", "userTransaction", "ConversationsLog", "portfolioApproved", "portfolioRequests", "internalRejectedRequests", "internalApprovedRequests", "officeTransaction"]
  var isTransactModule = includes(transactionModules, context.module)
  //Context Specific Search layer
  var contextQuery={};
  contextQuery=new MlAdminContextQueryConstructor(context.userId,{module:args.module,action:args.action, isTransactModule:isTransactModule}).contextQuery();

  var result=null;
  var  requestParams=null;
  switch(moduleName){
    case "cluster":
      result=CoreModulesRepo.MlClusterRepo(args.context,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "chapter":
      result=CoreModulesRepo.MlChapterRepo(args.context,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "subChapter":
      result=CoreModulesRepo.MlSubChapterRepo(args.context,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "community":
      result=CoreModulesRepo.MlCommunityRepo(args.context,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "MASTERSETTINGS":
      requestParams=args.context;
      requestParams.userId=context.userId;
      result=CoreModulesRepo.MlMasterSettingsRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "AUDIT_LOG":
      let auditParams=args.context;
      let userSpecificSearch=args.fieldsData?true:false;
      result=await CoreModulesRepo.MlAuditLogRepo(auditParams,userFilterQuery,contextQuery,findOptions, context,userSpecificSearch);
      break;
    case "hierarchy":
      result=CoreModulesRepo.MlHierarchySubChapterRepo(args.context,contextQuery,findOptions, context);
      break;
    case "registrationInfo":
      requestParams=args.context||{};
      requestParams.type='requested';
      result=CoreModulesRepo.MlRegistrationRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "registrationApprovedInfo":
      requestParams=args.context||{};
      requestParams.type='approved';
      result=CoreModulesRepo.MlRegistrationRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "registrationRejectedInfo":
      requestParams=args.context||{};
      requestParams.type='rejected';
      result=CoreModulesRepo.MlRegistrationRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "internalRequests":
      requestParams=args.context||{};
      requestParams.type='requested';
      result=CoreModulesRepo.MlInternalRequestRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "internalApprovedRequests":
      requestParams=args.context||{};
      requestParams.type='approved';
      result=CoreModulesRepo.MlInternalRequestRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "internalRejectedRequests":
      requestParams=args.context||{};
      requestParams.type='rejected';
      result=CoreModulesRepo.MlInternalRequestRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "portfolioRequests":
      requestParams=args.context||{};
      requestParams.type='requested';
      result=CoreModulesRepo.MlPortfolioRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "portfolioApproved":
      requestParams=args.context||{};
      requestParams.type='approved';
      result=CoreModulesRepo.MlPortfolioRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'TransactionsLog':
      requestParams=args.context || {};
      // requestParams.type = _.map(requestParams, _.pick('activity'))
      result=CoreModulesRepo.MlTransactionLogRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'InteractionsLog':
      requestParams=args.context;
      requestParams.type=args.context.transactionTypeName
      result=CoreModulesRepo.MlTransactionLogRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'ConversationsLog':
      requestParams=args.context;
      requestParams.type=args.context.transactionTypeName
      result=CoreModulesRepo.MlTransactionLogRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'templateAssignment':
      result=CoreModulesRepo.MlTemplatesAssignmentRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'processSetup':
      requestParams=args.context || {};
      result=CoreModulesRepo.MlProcessTransactionRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'officeTransaction':
      result=CoreModulesRepo.MlOfficeTransactionRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "documents":
      requestParams=args.context||{};
      result=CoreModulesRepo.MlDocumentRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'serviceCard':
      // requestParams=args.context || {};
      result=CoreModulesRepo.MlServiceCardsTransactionRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'clusterHierarchy':
      result=CoreModulesRepo.MlHierarchyClusterRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'hierarchyDepartments':
      requestParams=args.context||{};
      result=CoreModulesRepo.MlHierarchyDepartmentsRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case 'users':
      /**merging the user repo to the users module*/
      requestParams = args.context || {};
      /**type can be used for different list view config*/
      // requestParams.type = 'users';
      result = CoreModulesRepo.MlUsersRepo(requestParams, userFilterQuery, contextQuery, findOptions, context);
      break;
    case 'userTransaction':
      /**merging the user repo to the users module*/
      requestParams = args.context || {};
      /**type can be used for different list view config*/
      // requestParams.type = 'users';
      result = CoreModulesRepo.MlUsersTransaction(requestParams, userFilterQuery, contextQuery, findOptions, context);
      break;
    case 'share':
      requestParams=args.context || {};
      result=CoreModulesRepo.MlShareTransactionRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
    case "appointment":
      requestParams=args.context || {};
      result=CoreModulesRepo.MlAppointmentsRepo(requestParams,userFilterQuery,contextQuery,findOptions, context);
      break;
  }

  return {totalRecords:result.totalRecords||0,data:result.data||[]};
}

MlResolver.MlUnionResolver['ContextSpecSearchResult']= {
   __resolveType(data, context, info){

    var module=context.module||"";
    var resolveType='';
    switch(module) {
      case "cluster":resolveType= 'Cluster';break;
      case "chapter":resolveType= 'Chapter';break;
      case "subChapter":resolveType= 'SubChapter';break;
      case "templateAssignment":resolveType= 'TemplateAssignment';break;
      case "community":resolveType= 'Community';break;
      case "MASTERSETTINGS":resolveType= 'MasterSettings';break;
      case "AUDIT_LOG":resolveType= 'AuditLogs';break;
      case "hierarchy":resolveType= 'SubChapter';break;
      case "registrationInfo":resolveType= 'RegistrationInfo';break;
      case "registrationApprovedInfo":resolveType= 'RegistrationInfo';break;
      case "registrationRejectedInfo":resolveType= 'RegistrationInfo';break;
      case "portfolioRequests":resolveType= 'Portfoliodetails';break;
      case "portfolioApproved":resolveType= 'Portfoliodetails';break;
      case "users":resolveType= 'RegistrationInfo';break;
      case "TransactionsLog":resolveType='TransactionsLog';break;
      case "InteractionsLog":resolveType='TransactionsLog';break;
      case "ConversationsLog":resolveType='TransactionsLog';break;
      case "internalRequests":resolveType='requests';break;
      case "internalApprovedRequests":resolveType='requests';break;
      case "internalRejectedRequests":resolveType='requests';break;
      case "processSetup":resolveType='ProcessTransactions';break;
      case "share":resolveType='AdminShareList';break;
      case "officeTransaction":resolveType='officeTransactionType';break;
      case "documents":resolveType='ProcessType';break;
      case "serviceCard":resolveType='AdminService';break;
      case "clusterHierarchy":resolveType='Cluster';break;
      case "hierarchyDepartments":resolveType='DepartmentAndSubDepartmentDetails';break;
      case "userTransaction":resolveType='myTransaction';break;
      case "appointment":resolveType='AppointmentAdmin';break;
    }
    if(resolveType){
      return resolveType;
    }else{
     // console.log("UnionResolverModule-"+module);
     // console.log("UnionResolverType-"+resolveType);
      return 'GenericType';
    }
  }
}
