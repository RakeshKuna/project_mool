import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash'

MlResolver.MlMutationResolver['updateDocumentType'] = (obj, args, context, info) => {
  // TODO : Authorization
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (!args.docTypeName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Document Name is Required", code);
    return response;
  } else {
    if (args._id) {
      var id= args._id;
      args=_.omit(args,'_id');
      // let result= MlDocumentTypes.update(id, {$set: args});
      let result = mlDBController.update('MlDocumentTypes', id, args, {$set: 1}, context);
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};

MlResolver.MlQueryResolver['findDocumentType'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args._id) {
    var id= args._id;
    let response= MlDocumentTypes.findOne({"_id":id});
    return response;
  }
};

MlResolver.MlMutationResolver['createDocumentType'] = (obj, args, context, info) =>{
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (!args.documentType.docTypeName) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Document Name is Required", code);
    return response;
  } else {
    if(MlDocumentTypes.find({docTypeName:args.documentType.docTypeName}).count() > 0){
      let code = 409;
      let response = new MlRespPayload().errorPayload("'Document type' already exists", code);
      return response;
    }
    // let id = MlDocumentTypes.insert({...args.documentType});
    let id = mlDBController.insert('MlDocumentTypes', args.documentType, context);
    if(id){
      let code = 200;
      let result = {documentTypeId: id}
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
}
MlResolver.MlQueryResolver['fetchDocumentsType'] = (obj, args, context, info) => {
  let result=MlDocumentTypes.find({isActive:true}).fetch()||[];
  return result;
}


