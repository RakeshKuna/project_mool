/**
 * Created by pankaj on 16/5/17.
 */
import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";

MlResolver.MlMutationResolver['createActionsAndStatuses'] = (obj, args, context, info) => {
  //let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  //if (!isValidAuth) {
 //   let code = 401;
//  let response = new MlRespPayload().errorPayload("Not Authorized", code);
//  return response;

  //}
  try {
    let dataToInset = args.actionsAndStatuses;
    dataToInset.createdBy = context.userId;
    dataToInset.createdAt = new Date();
    dataToInset.updatedBy = context.userId;
    dataToInset.updatedAt = new Date();
    dataToInset.processName = mlDBController.findOne('MlprocessTypes',dataToInset.processId).processName;
    dataToInset.subProcessName = mlDBController.findOne('MlSubProcess',dataToInset.subProcessId).subProcessName;
    dataToInset.clusterName = mlDBController.findOne('MlClusters', dataToInset.clusterId).clusterName;
    dataToInset.chapterName = mlDBController.findOne('MlChapters', dataToInset.chapterId).chapterName;
    dataToInset.subChapterName = mlDBController.findOne('MlSubChapters', dataToInset.subChapterId).subChapterName;
    let id = mlDBController.insert('MlActionAndStatus', dataToInset, context);
    if (id) {
      let code = 200;
      let result = {clusterid: id}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  } catch (err){
      let code = 401;
      let response = new MlRespPayload().errorPayload(err, code);
      return response;
  }
}

MlResolver.MlMutationResolver['updateActionsAndStatuses'] = (obj, args, context, info) => {
  //let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  //if (!isValidAuth) {
  //   let code = 401;
//  let response = new MlRespPayload().errorPayload("Not Authorized", code);
//  return response;

  //}
  try {
    let dataToUpdate  = args.actionsAndStatuses;
    let id = args.actionsAndStatusId;
    dataToUpdate.createdBy = context.userId;
    dataToUpdate.createdAt = new Date();
    dataToUpdate.updatedBy = context.userId;
    dataToUpdate.updatedAt = new Date();
    dataToUpdate.processName = mlDBController.findOne('MlprocessTypes',dataToUpdate.processId).processName;
    dataToUpdate.subProcessName = mlDBController.findOne('MlSubProcess',dataToUpdate.subProcessId).subProcessName;
    dataToUpdate.clusterName = mlDBController.findOne('MlClusters', dataToUpdate.clusterId).clusterName;
    dataToUpdate.chapterName = mlDBController.findOne('MlChapters', dataToUpdate.chapterId).chapterName;
    dataToUpdate.subChapterName = mlDBController.findOne('MlSubChapters', dataToUpdate.subChapterId).subChapterName;
    let update = mlDBController.update('MlActionAndStatus',id , dataToUpdate, {$set: 1}, context);
    if (update) {
      let code = 200;
      let result = {update: update}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  } catch (err){
    let code = 401;
    let response = new MlRespPayload().errorPayload(err, code);
    return response;
  }
};


MlResolver.MlMutationResolver['updateGenericActionsAndStatuses'] = (obj, args, context, info) => {
  //let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  //if (!isValidAuth) {
  //   let code = 401;
//  let response = new MlRespPayload().errorPayload("Not Authorized", code);
//  return response;

  //}
  try {
    let dataToUpdate  = {};
    let id = args.actionsAndStatusId;
    dataToUpdate.updatedBy = context.userId;
    dataToUpdate.updatedAt = new Date();
    dataToUpdate.departmentInfo = args.departmentInfo;
    dataToUpdate.departmentInfo.departmentName = mlDBController.findOne('MlDepartments', args.departmentInfo.departmentId).displayName;
    dataToUpdate.departmentInfo.subDepartmentName = mlDBController.findOne('MlSubDepartments', args.departmentInfo.subDepartmentId).displayName;
    let update = mlDBController.update('MlActionAndStatus',id , dataToUpdate, {$set: 1}, context);
    if (update) {
      let code = 200;
      let result = {update: update}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  } catch (err){
    let code = 401;
    let response = new MlRespPayload().errorPayload(err, code);
    return response;
  }
};

MlResolver.MlQueryResolver['findActionsAndStatus'] = (obj, args, context, info) =>{
    return mlDBController.findOne('MlActionAndStatus', {"_id": args._id}, context)
}
