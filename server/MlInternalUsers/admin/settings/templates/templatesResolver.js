import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';
import mlTemplateAssignmentRepo from './mlTemplateAssignmentRepo';

export function hasDuplicateSteps(data){
   let hasNoDuplicate = _.every(data, function(o, i) {
    var eq = _.find(data, function(e, ind) {
      if (i > ind) {
        return _.isEqual(e, o);
      }
    })
    if (eq) {
      return false;
    }else{
      return true;
    }
  });
  return hasNoDuplicate===false?true:false;
}

MlResolver.MlQueryResolver['findTemplateSteps'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.id) {
    var id= args.id;
    // let response= MlSubProcess.findOne({"_id":id});
    let response = mlDBController.findOne('MlSubProcess', {_id: id}, context)
    return response;
  }
}

MlResolver.MlQueryResolver['findAssignedTemplates'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.id) {
    var id= args.id;
    // let response= MlTemplateAssignment.findOne({"_id":id});
    let response = mlDBController.findOne('MlTemplateAssignment', {_id: id}, context)
    return response;
  }
}


MlResolver.MlQueryResolver['findStepAssignedTemplates'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.id) {
    var id= args.id;
    let response= MlTemplates.findOne({"_id":id},{templates:{$elemMatch:{stepCode:args.stepCode}}});
    let steps = response.templates;
    let filteredSteps = [];
    steps.map(function (step, key){
      if(step.stepCode==args.stepCode){
        filteredSteps.push(step)
      }
    })
    response.templates = filteredSteps;
    return response;
  }
}

MlResolver.MlQueryResolver['findTemplates'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.id) {
    var id= args.id;
    let response= MlTemplates.findOne({"subProcessId":id});
    let steps = response.templates;
    let filteredSteps = [];
    steps.map(function (step, key){
      if(step.stepCode==args.stepCode||step.stepName==args.stepCode){
        filteredSteps.push(step)
      }
    })
    response.templates = filteredSteps;
    return response;
  }
}

MlResolver.MlQueryResolver['fetchAssignedTemplate']=(obj, args, context, info) => {
  if (args.process&&args.subProcess&&args.stepCode) {
    //todo: conditions based on record id for steps like registration,portfolio
    //resolve userType:internal/external and send with response
    let process=args.process;
    let subProcess=args.subProcess;
    let recordId=args.recordId;
    let stepCode=args.stepCode;
    let mode = args.mode;
    let template=mlTemplateAssignmentRepo.fetchTemplate(process,subProcess,stepCode,recordId, mode);
    return template;
  }
      return null;
}


MlResolver.MlQueryResolver['fetchSubProcess'] = (obj, args, context, info) => {
  // let result=MlSubProcess.find({"procesId":args.id, isActive:true}).fetch()||[];
  let result = mlDBController.find('MlSubProcess', {"procesId":args.id, isActive:true}, context).fetch()||[];
  return result;
}

MlResolver.MlMutationResolver['createTemplateAssignment'] = (obj, args, context, info) => {
  if (args.template) {
      // let resp = MlTemplateAssignment.insert({...args.accountType});
    //validation for duplicate steps
    var hasDuplicate=hasDuplicateSteps(args.template.assignedTemplates||[]);
    if(hasDuplicate) return new MlRespPayload().errorPayload("Duplicate steps selected", 409);
    //validate steps for Browser
    var isValid=mlTemplateAssignmentRepo.validateTemplateAssignment(args.template);
    if(!isValid) return new MlRespPayload().errorPayload("Hard and Portfolio steps are not allowed for Browser community", 409);

      args.template.createdDate = new Date()
      if(Meteor.users.findOne({_id : context.userId}))
      {
        args.template.createdBy = Meteor.users.findOne({_id: context.userId}).username
      }
      let resp = mlDBController.insert('MlTemplateAssignment', args.template, context)
      if (resp) {
        let code = 200;
        let result = {template: resp}
        let response = new MlRespPayload().successPayload(result, code);
        return response
      }
    }
}


MlResolver.MlMutationResolver['updateTemplateAssignment'] = (obj, args, context, info) => {
  if (args.id) {
    // let template = MlTemplateAssignment.findOne({_id: args.id});
    let template = mlDBController.findOne('MlTemplateAssignment', {_id: args.id}, context)
    if (template.isSystemDefined) {
      let code = 409;
      let response = new MlRespPayload().errorPayload("System defined template assignment cannot be edited", code);
      return response;
    }
    //validation for duplicate steps
    var hasDuplicate=hasDuplicateSteps(args.template.assignedTemplates||[]);
    if(hasDuplicate) return new MlRespPayload().errorPayload("Duplicate steps selected", 409);
    //validate steps for Browser
    var isValid=mlTemplateAssignmentRepo.validateTemplateAssignment(args.template);
    if(!isValid) return new MlRespPayload().errorPayload("Hard and Portfolio steps are not allowed for Browser community", 409);

    else if (template) {
        // let resp = MlTemplateAssignment.update({_id: args.id}, {$set: args.template}, {upsert: true})
      args.template.modifiedDate = new Date()
      if(Meteor.users.findOne({_id : context.userId}))
      {
        args.template.modifiedBy = Meteor.users.findOne({_id: context.userId}).username
      }
      let resp = mlDBController.update('MlTemplateAssignment', args.id, args.template, {$set:true}, context)
      if (resp) {
          let code = 200;
          let result = {template: resp}
          let response = new MlRespPayload().successPayload(result, code);
          return response
        }
      }
  }
}

MlResolver.MlQueryResolver['findTemplateStepsSelect'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.id) {
    var id= args.id;
    let response= MlSubProcess.findOne({"_id":id});
    return response.steps;
  }
}

MlResolver.MlQueryResolver['findTemplatesSelect'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.id) {
    var id= args.id;
    let response= MlTemplates.findOne({"subProcessId":id});
    let steps = response.templates;
    let filteredSteps = [];
    steps.map(function (step, key){
      if(step.stepName==args.stepName){
        filteredSteps.push(step)
      }
    })
 //   response.templates = filteredSteps;
    return filteredSteps;
  }
}

// MlResolver.MlMutationResolver['updateTemplateAssignment'] = (obj, args, context, info) => {
//   if (args.id) {
//     let template = MlTemplateAssignment.findOne({_id: args.id});
//     if (template.isSystemDefined) {
//       let code = 409;
//       let response = new MlRespPayload().errorPayload("Cannot edit system defined Template Assignment", code);
//       return response;
//     }
//     else if (template) {
//       let resp = MlTemplateAssignment.update({_id: args.id}, {$set: args.template}, {upsert: true})
//       if (resp) {
//         let code = 200;
//         let result = {template: resp}
//         let response = new MlRespPayload().successPayload(result, code);
//         return response
//       }
//     }
//   }
// }
MlResolver.MlMutationResolver['updateStepAssignedTemplate'] = (obj, args, context, info) => {
if (args.id) {
  var id= args.id;
  let response= MlTemplates.update({_id:id,'templates': {$elemMatch: {'templateCode': args.templateCode}}},{$set:{"templates.$.isActive": args.isActive}})
  if(response){
    let code = 200;
    let result = {template: response}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }

}
}
