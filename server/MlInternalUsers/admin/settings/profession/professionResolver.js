import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';

MlResolver.MlMutationResolver['CreateProfession'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  let query ={
    "$or":[
      {
        professionName: {
          "$regex" : new RegExp('^' + args.professionName + '$', 'i')
        }
      },
      {
        professionDisplayName: {
          "$regex" :new RegExp("^" + args.professionDisplayName + '$','i')}
      }
    ]
  };

  let isFind = mlDBController.find('MlProfessions', query, context).fetch();
  if(isFind.length){
    let code = 409;
    let response = new MlRespPayload().errorPayload("'Profession' already exists!", code);
    return response;
  }

  if (mlDBController.findOne('MlIndustries', {_id:args.industryId}, context)){
    // args.industryName=MlIndustries.findOne({_id:args.industryId}).industryName;
    args.industryName = mlDBController.findOne('MlIndustries', {_id:args.industryId}, context).industryName;
  }
  // let id = MlProfessions.insert({...args});
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
  args.createdBy = createdBy;
  args.createdDate = new Date();

  let id = mlDBController.insert('MlProfessions',args, context);
  if (id) {
    let code = 200;
    let result = {professionId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}
MlResolver.MlMutationResolver['UpdateProfession'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  // if (MlIndustries.findOne({_id:args.industryId})){
  //   args.industryName = MlIndustries.findOne({_id:args.industryId}).industryName;
  // }
  if (mlDBController.findOne('MlIndustries',{_id:args.industryId},context)){
    args.industryName = mlDBController.findOne('MlIndustries',{_id:args.industryId},context).industryName;
  }
  if (args._id) {
    var id= args._id;
    let query ={
      "_id":{
        "$ne": id
      },
      "$or":[
        {
          professionName: {
            "$regex" : new RegExp('^' + args.professionName + '$', 'i')
          }
        },
        {
          professionDisplayName: {
            "$regex" :new RegExp("^" + args.professionDisplayName + '$','i')}
        }
      ]
    };

    let isFind = mlDBController.find('MlProfessions', query, context).fetch();
    if(isFind.length) {
      let code = 409;
      let response = new MlRespPayload().errorPayload("'Profession' already exists!", code);
      return response;
    }

    args=_.omit(args,'_id');
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

    // let result= MlProfessions.update(id, {$set: args});
    let result= mlDBController.update('MlProfessions',id , args, {$set:true}, context);
    let code = 200;
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }

}
MlResolver.MlQueryResolver['FindProfession'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args._id) {
    var id= args._id;
    // let response= MlProfessions.findOne({"_id":id});
    let response= mlDBController.findOne("MlProfessions", {_id:id}, context);
    //response.push({"professionName" : "All","_id" : "all"});
    return response;
  }

}

MlResolver.MlQueryResolver['fetchProfessions'] = (obj, args, context, info) => {
  // let result=MlProfessions.find({isActive:true}).fetch()||[];
  let result = mlDBController.find('MlProfessions', {isActive:true, industry:args.industry}, context).fetch()||[];
  return result;
}
MlResolver.MlQueryResolver['FetchProfessionIndustry'] = (obj, args, context, info) => {

  let industries = args.industry;
  let professions = [];
  if(industries && industries.length > 0){
    if(industries.length==1){
      professions= MlProfessions.find({"$and": [{industryId: industries[0], isActive: true}]}).fetch()||[];
      professions.push({"professionDisplayName" : "All","_id" : "all"});
    }else {
      industries.map(function (industryId) {
        activeProfession = MlProfessions.find({"$and": [{industryId: industryId, isActive: true}]}).fetch();
        if (activeProfession && activeProfession.length > 0) {
          professions = professions.concat(activeProfession)

        }
      })
      professions.push({"professionDisplayName" : "All","_id" : "all"});
    }
  }
  return professions;
}

MlResolver.MlQueryResolver['fetchIndustryBasedProfession'] = (obj, args, context, info) => {

  let result = mlDBController.find('MlProfessions',{industryId:args.industryId, isActive:true}, context).fetch()||[];

  return result;
}
