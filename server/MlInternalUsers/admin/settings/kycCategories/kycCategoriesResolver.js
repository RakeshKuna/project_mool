import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['updateKycCategory'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if(!args.docCategoryName){
    let code = 401;
    let response = new MlRespPayload().errorPayload("Category Name is Required", code);
    return response;
  }else {
    if (args._id) {
      var id= args._id;
      let query ={
        "_id":{
          "$ne": id
        },
        "$or":[
          {
            docCategoryName: {
              "$regex" : new RegExp('^' + args.docCategoryName + '$', 'i')
            }
          },
          {
            docCategoryDisplayName: {
              "$regex" :new RegExp("^" + args.docCategoryDisplayName + '$','i')}
          }
        ]
      };

      let isFind = mlDBController.find('MlDocumentCategories', query, context).fetch();
      if(isFind.length) {
        let code = 409;
        let response = new MlRespPayload().errorPayload("'KYC category' already exists!", code);
        return response;
      }
      var firstName='';var lastName='';
      // let id = MlDepartments.insert({...args.department});
      if(Meteor.users.findOne({_id : context.userId}))
      {
        let user = Meteor.users.findOne({_id: context.userId}) || {}
        if(user&&user.profile&&user.profile.isInternaluser&&user.profile.InternalUprofile) {

          firstName=(user.profile.InternalUprofile.moolyaProfile || {}).firstName||'';
          lastName=(user.profile.InternalUprofile.moolyaProfile || {}).lastName||'';
        }else if(user&&user.profile&&user.profile.isExternaluser) { //resolve external user context based on default profile
          firstName=(user.profile || {}).firstName||'';
          lastName =(user.profile || {}).lastName||'';
        }
      }
      let createdBy = firstName +' '+lastName
      args.updatedBy = createdBy;
      args.updatedDate = new Date();

      args=_.omit(args,'_id');
      // let result= MlDocumentCategories.update(id, {$set: args});
      let result= mlDBController.update('MlDocumentCategories', id, args, {$set:true}, context)
        let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};

MlResolver.MlQueryResolver['findKycCategory'] = (obj, args, context, info) => {
  if (args._id) {
    var id= args._id;
    // let response= MlDocumentCategories.findOne({"_id":id});
    let response = mlDBController.findOne('MlDocumentCategories', {_id: id}, context)
    return response;
  }
};

MlResolver.MlMutationResolver['createKycCategory'] = (obj, args, context, info) =>{
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if(!args.kycCategory.docCategoryName){
    let code = 401;
    let response = new MlRespPayload().errorPayload("Category Name is Required", code);
    return response;
  }else {
    // if(MlDocumentCategories.find({docCategoryName:args.kycCategory.docCategoryName}).count() > 0){

    let query ={
      "$or":[
        {
          docCategoryName: {
            "$regex" : new RegExp('^' + args.kycCategory.docCategoryName + '$', 'i')
          }
        },
        {
          docCategoryDisplayName: {
            "$regex" :new RegExp("^" + args.kycCategory.docCategoryDisplayName + '$','i')}
        }
      ]
    };
    let isFind = mlDBController.find('MlDocumentCategories', query, context).fetch();
    if(isFind.length){
      let code = 409;
      let response = new MlRespPayload().errorPayload("'KYC category' already exists!", code);
      return response;
    }
    var firstName='';var lastName='';
    // let id = MlDepartments.insert({...args.department});
    if(Meteor.users.findOne({_id : context.userId}))
    {
      let user = Meteor.users.findOne({_id: context.userId}) || {}
      if(user&&user.profile&&user.profile.isInternaluser&&user.profile.InternalUprofile) {

        firstName=(user.profile.InternalUprofile.moolyaProfile || {}).firstName||'';
        lastName=(user.profile.InternalUprofile.moolyaProfile || {}).lastName||'';
      }else if(user&&user.profile&&user.profile.isExternaluser) { //resolve external user context based on default profile
        firstName=(user.profile || {}).firstName||'';
        lastName =(user.profile || {}).lastName||'';
      }
    }
    let createdBy = firstName +' '+lastName
    args.kycCategory.createdBy = createdBy;
    args.kycCategory.createdDate = new Date();
    // if(mlDBController.find('MlDocumentCategories', {docCategoryName:args.kycCategory.docCategoryName}, context).count() > 0){
    //   let code = 409;
    //   let response = new MlRespPayload().errorPayload("Already Exist", code);
    //   return response;
    // }

    // let id = MlDocumentCategories.insert({...args.kycCategory});
    let id = mlDBController.insert('MlDocumentCategories', args.kycCategory, context)
    if(id){
      let code = 200;
      let result = {kycCategoryId: id};
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
};


MlResolver.MlQueryResolver['fetchKYCCategories'] = (obj, args, context, info) => {
  // let result=MlDocumentCategories.find({isActive:true}).fetch()||[];
  let result = mlDBController.find('MlDocumentCategories', {isActive:true}, context).fetch()||[];
  return result;
};

MlResolver.MlQueryResolver['findCategoryProcessDocuments'] = (obj, args, context, info) => {
  if(args && args._id){
    let kycCategoryExist = MlProcessMapping.find({processDocuments: {$elemMatch: {kycCategoryId:args._id,isActive:true}}}).fetch()
    return kycCategoryExist
  }


};


