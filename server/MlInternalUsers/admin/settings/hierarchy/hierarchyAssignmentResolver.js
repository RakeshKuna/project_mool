import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import mlAssignHierarchy from "../../../admin/../admin/genericTransactions/impl/MlHierarchyAssignment";
import _ from "lodash";

MlResolver.MlQueryResolver['fetchAssignedRolesHierarchy'] = (obj, args, context, info) => {
  let response;
  let levelCode = "";
  var subChapter = null;
  let department = mlDBController.findOne("MlDepartments", {"_id": args.departmentId}, context)
  if (department && department.isActive) {
      if(args.subChapterId){
        subChapter =  mlDBController.findOne("MlSubChapters", {"_id": args.subChapterId}, context)
      }
      var isDefaultSubChapter = true;
      if(subChapter){
          isDefaultSubChapter = subChapter.isDefaultSubChapter
      }
      if(department.isSystemDefined){
          response= mlDBController.findOne('MlHierarchyAssignments', {
              $and: [
                {clusterId:{$in:["All"]}},
                {parentDepartment:args.departmentId},
                {parentSubDepartment:args.subDepartmentId},
                {subChapterId:{$in:["all"]}},
                {isDefaultSubChapter:isDefaultSubChapter},
                {"teamStructureAssignment.assignedLevel": {$in: [args.type]}}
              ]},context)

      } else{
          if(isDefaultSubChapter){
            response= mlDBController.findOne('MlHierarchyAssignments', {
              $and: [
                {clusterId:{$in:[args.clusterId]}},
                {parentDepartment:args.departmentId},
                {parentSubDepartment:args.subDepartmentId},
                {isDefaultSubChapter:isDefaultSubChapter},
                {"teamStructureAssignment.assignedLevel": {$in: [args.type]}}
              ]},context)
          }else{
            response= mlDBController.findOne('MlHierarchyAssignments', {
              $and: [
                {clusterId:{$in:[args.clusterId]}},
                {parentDepartment:args.departmentId},
                {parentSubDepartment:args.subDepartmentId},
                {subChapterId:{$in:[args.subChapterId]}},
                {isDefaultSubChapter:isDefaultSubChapter},
                {"teamStructureAssignment.assignedLevel": {$in: [args.type]}}
              ]},context)
          }
      }

  }
     if(response){
       let teamStructureAssignment = response.teamStructureAssignment;
       /*let filteredSteps = [];
       teamStructureAssignment.map(function (step, key){
         if(step.assignedLevel==args.type){
           filteredSteps.push(step)
         }
       })
       response.teamStructureAssignment = filteredSteps;*/
       return response;
     }

}

MlResolver.MlQueryResolver['fetchFinalApprovalRole'] = (obj, args, context, info) => {
  let response;
  var subChapter = {};
  var isDefaultSubChapter = true;
  if(args.subChapterId && args.subChapterId != "all"){
    subChapter =  mlDBController.findOne("MlSubChapters", {"_id": args.subChapterId}, context)
    isDefaultSubChapter = subChapter.isDefaultSubChapter;
  }

  if (args.departmentId && args.subDepartmentId) {
    let department = mlDBController.findOne("MlDepartments", {"_id": args.departmentId}, context)
    if(department.isSystemDefined){
      response = mlDBController.findOne("MlHierarchyAssignments", {
        "parentDepartment": args.departmentId,
        "parentSubDepartment": args.subDepartmentId,
        "clusterId":"All",
        "isDefaultSubChapter" : isDefaultSubChapter
      }, context)
    }else{
      if(isDefaultSubChapter){
        response = mlDBController.findOne("MlHierarchyAssignments", {
          "parentDepartment": args.departmentId,
          "parentSubDepartment": args.subDepartmentId,
          "clusterId":args.clusterId,
          "isDefaultSubChapter" : isDefaultSubChapter
        }, context)
      }else{
        response = mlDBController.findOne("MlHierarchyAssignments", {
          "parentDepartment": args.departmentId,
          "parentSubDepartment": args.subDepartmentId,
          "clusterId":args.clusterId,
          "subChapterId":args.subChapterId,
          "isDefaultSubChapter" : isDefaultSubChapter
        }, context)
      }

    }
  }
  return response;
}

/**
 * create and update of hirarchy assignment
 * */
MlResolver.MlMutationResolver['updateHierarchyAssignment'] = (obj, args, context, info) => {
  let response;
  let hierarchy = args.hierarchy;
  /**update of a hirarchy*/
  if (hierarchy.id) {
    let hierarchyAssignment = mlDBController.findOne("MlHierarchyAssignments", {"_id": hierarchy.id}, context)
    let id = hierarchy.id
    let hierarchyRoles = hierarchy.teamStructureAssignment;   //client
    if (hierarchyRoles.length >= 1) {
      let oldAssignments = hierarchyAssignment.teamStructureAssignment;  //db
      /**if old assigment then update of the team structure assigment*/
      if (!_.isEmpty(oldAssignments)) {
        oldAssignments.map(function (role, oldkey) {
          hierarchyRoles.map(function (newRole, key) {
            if ((newRole.roleId == role.roleId) && newRole.isAssigned) {
              oldAssignments.splice(oldkey, 1)
              oldAssignments.push(newRole)
            }else if((newRole.roleId == role.roleId) && !newRole.isAssigned && (newRole.assignedLevel == "unassign")){
              oldAssignments.splice(oldkey, 1)
            }else {
              if (newRole.isAssigned === true) {
                if (!_.find(oldAssignments, {roleId: newRole.roleId})) {
                  oldAssignments.push(newRole)
                }
              }
            }
          })
        })
      } else {
        oldAssignments = hierarchyRoles
      }
      hierarchyAssignment.teamStructureAssignment = oldAssignments
      hierarchyAssignment.finalApproval = hierarchy.finalApproval
      mlDBController.update('MlHierarchyAssignments', id, hierarchyAssignment, {$set: true}, context)
      let code = 200;
      response = new MlRespPayload().successPayload("'Hierarchy assignment' updated successfully", code);
      return response

    } else if(!_.isEqual(hierarchy.finalApproval, hierarchyAssignment.finalApproval)){

        hierarchyAssignment.finalApproval = hierarchy.finalApproval
        mlDBController.update('MlHierarchyAssignments', id, hierarchyAssignment, {$set: true}, context)
        let code = 200;
        response = new MlRespPayload().successPayload("'Hierarchy assignment' updated successfully", code);
        return response

    }else {

      let code = 200;
      response = new MlRespPayload().successPayload('No changes found to update', code);
      return response
    }

  } else {
    /**update of an hirarchy*/
    let hierarchyRoles = hierarchy.teamStructureAssignment;
    let roles = []
    hierarchyRoles.map(function (role, key) {
      if (role.isAssigned === true) {
        roles.push(role)
      }
    })
    hierarchy.teamStructureAssignment = roles;
    let id = mlDBController.insert('MlHierarchyAssignments', hierarchy, context)
    if (id) {
      let code = 200;
      let result = {appovalId: id}
      let response = new MlRespPayload().successPayload('Hierarchy added successfully', code);
      return response
    }
  }
};

MlResolver.MlQueryResolver['fetchHierarchyRoles'] = (obj, args, context, info) => {
  let response;
  let levelCode = "";
  var finalRoles = []
  var hierarchyQuery = {};
  var subChapter = null;

  if(args.subChapterId != null){
    subChapter =  mlDBController.findOne("MlSubChapters", {"_id": args.subChapterId}, context)
  }

  let department = mlDBController.findOne("MlDepartments", {"_id": args.departmentId}, context)
  if (department && department.isActive) {

    // Show only moolya roles if subchpater(non-moolya) is not selected(!args.subChapterId).
    if(subChapter){
      if(subChapter.isDefaultSubChapter){
        hierarchyQuery = {
          $and: [
            {parentDepartment:args.departmentId},
            {parentSubDepartment:args.subDepartmentId},
            {clusterId:department.isSystemDefined?"All":args.clusterId},
            {isDefaultSubChapter : subChapter.isDefaultSubChapter}
          ]
        }
      }else{
        hierarchyQuery = {
          $and: [
            {parentDepartment:args.departmentId},
            {parentSubDepartment:args.subDepartmentId},
            {clusterId:department.isSystemDefined?"All":args.clusterId},
            {subChapterId:department.isSystemDefined?"all":args.subChapterId},
            {isDefaultSubChapter : subChapter.isDefaultSubChapter}
          ]
        }
      }

    } else{
      let userRole = mlAssignHierarchy.getUserRoles(context.userId);
      let isDefaultSubChapter = true;
      if(userRole && userRole.subChapterId != "all"){
        isDefaultSubChapter = mlDBController.findOne('MlSubChapters', {_id:userRole.subChapterId}, context).isDefaultSubChapter;
      }
      hierarchyQuery = {
        $and: [
          {parentDepartment:args.departmentId},
          {parentSubDepartment:args.subDepartmentId},
          {clusterId:department.isSystemDefined?"All":args.clusterId},
          {isDefaultSubChapter : isDefaultSubChapter}
        ]
      }
    }
    response= mlDBController.findOne('MlHierarchyAssignments', hierarchyQuery, context)
  }

  if(response){
    let teamStructureAssignment = response.teamStructureAssignment;
    let userRole = mlAssignHierarchy.getUserRoles(context.userId)
    if(userRole.roleName ==  "platformadmin" ){
      return teamStructureAssignment;
    }else if(userRole.roleName == "clusteradmin"){
      return teamStructureAssignment;
    }else if(userRole.roleName == "chapteradmin"){
      _.remove(teamStructureAssignment, {roleName: 'clusteradmin'})
      return teamStructureAssignment;
    }else if(userRole.roleName == "subchapteradmin"){
      _.remove(teamStructureAssignment, {roleName: 'clusteradmin'})
      _.remove(teamStructureAssignment, {roleName: 'chapteradmin'})
      return teamStructureAssignment;
    }else if(userRole.roleName == "communityadmin"){
      _.remove(teamStructureAssignment, {roleName: 'clusteradmin'})
      _.remove(teamStructureAssignment, {roleName: 'chapteradmin'})
      _.remove(teamStructureAssignment, {roleName: 'subchapteradmin'})
      return teamStructureAssignment;
    }else{
      let currentRole = null;
      let isParentRole = false;
      teamStructureAssignment.map(function (role, key){
        if(role.roleId==userRole.roleId){
          //self role for same level hierarchy
          finalRoles.push(role);
          currentRole = role
          if (role.assignedLevel=='cluster' && role.reportingRole=='') {
            // teamStructureAssignment.splice(key,1)                         // TO ALLOW SAME LEVEL ROLE TO ACCESS
            finalRoles = teamStructureAssignment;
            isParentRole = true;
          }
        }
      })
      if(isParentRole === false){
              // let reportingRole = userRole.roleId
              // //recursively follow reporting hierarchy
              // teamStructureAssignment.map(function (role, key){
              //   if(role.reportingRole==reportingRole){
              //     reportingRole = role.roleId
              //     finalRoles.push(role)
              //   }
              // })


        if(!currentRole || !currentRole.assignedLevel){
            console.log("Role not available in hierarchy");
            return [];
        }
        /*
            1) Finding Logged in User Role Hierarchy
            2) Picking reporting role
         */
        var userHierarchy = mlDBController.findOne('MlHierarchy', {"code": (currentRole.assignedLevel).toUpperCase()}, context)

        var reportingRole = currentRole.reportingRole;
        var sameLevelRoles = []
        /*    Looping through all the team assignment in the hierarchy    */
        teamStructureAssignment.map(function (role, key) {

            var hierarchy = mlDBController.findOne('MlHierarchy', {"code": (role.assignedLevel).toUpperCase()}, context)

            /*    Comparing Hierarchy level    */
            if (userHierarchy.level > hierarchy.level) {

                /*    Pushing all lower hierarchy roles    */
                finalRoles.push(role)

            }else if(userHierarchy.level == hierarchy.level){

                /*    Neglecting same role by comparing 'currentRole' with role    */
                if(role.roleId != currentRole.roleId){

                    /*    Comparing roleId with ReportingRoleId to check if 'currentRole' role reports to this role    */
                    // if(role.roleId!=reportingRole){

                  sameLevelRoles.push(role)

                    // }
                    // else if(role.roleId==reportingRole){
                    //
                    //   /*
                    //         'Current Role' reports to this role, hence not pushing the role.
                    //         Updating reportingRole Id to check other roles.
                    //    */
                    //   reportingRole = role.reportingRole;
                    //
                    // }
                }

            }
        })
        var finalArr = sameLevelRoles;

        for (let i = 0; i < sameLevelRoles.length; i++) {
            var role = _.find(sameLevelRoles, {roleId:reportingRole});
            if(role){
                reportingRole = role.reportingRole;
                finalArr = _.reject(finalArr, {roleId:role.roleId})
            }else{
                break;
            }
        }
        finalRoles = finalRoles.concat(finalArr);
      }
    }
    return finalRoles;
  }
}


MlResolver.MlQueryResolver['fetchHierarchyUsers'] = (obj, args, context, info) => {
  var hierarchy;
  let levelCode = "";
  let department = mlDBController.findOne("MlDepartments", {"_id": args.departmentId}, context)
  if (department && department.isActive && args.roleId) {
    hierarchy= mlAssignHierarchy.findHierarchy(args.clusterId, args.departmentId, args.subDepartmentId, args.roleId, args.subChapterId)
  }
  if(hierarchy){
    //get all users associated with the hierarchy
    let usersList = []
    if(args.clusterId && args.departmentId && args.subDepartmentId && args.roleId && args.subChapterId){
        // usersList = mlDBController.find('users', {"$and":[{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.clusterId":args.clusterId} ,{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.departmentId":args.departmentId},{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.subDepartmentId":args.subDepartmentId},{"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles.roleId":args.roleId},{"profile.isActive":true}]}, context).fetch()

      usersList =mlDBController.find('users', {"$and":
        [
          {"profile.isActive":true},
          {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles":
            {
              $elemMatch: {
                clusterId:args.clusterId,
                departmentId:args.departmentId,
                subDepartmentId:args.subDepartmentId,
                roleId:args.roleId,
                subChapterId:args.subChapterId,
                isActive:true,
              }
            }
          },
        ]
      }, context).fetch()

     }else if(args.clusterId && args.departmentId && args.subDepartmentId && args.roleId){
      let userRole = mlAssignHierarchy.getUserRoles(context.userId);
      if(userRole && userRole.subChapterId != "all"){
        usersList =mlDBController.find('users', {"$and":
          [
            {"profile.isActive":true},
            {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles":
              {
                $elemMatch: {
                  clusterId:args.clusterId,
                  departmentId:args.departmentId,
                  subDepartmentId:args.subDepartmentId,
                  roleId:args.roleId,
                  subChapterId:userRole.subChapterId,
                  isActive:true,
                }
              }
            },
          ]
        }, context).fetch()
      } else{usersList =mlDBController.find('users', {"$and":
          [
            {"profile.isActive":true},
            {"profile.InternalUprofile.moolyaProfile.userProfiles.userRoles":
              {
                $elemMatch: {
                  clusterId:args.clusterId,
                  departmentId:args.departmentId,
                  subDepartmentId:args.subDepartmentId,
                  roleId:args.roleId,
                  subChapterId:"all",          // as no subChapterId, only moolya users should show.
                  isActive:true,
                }
              }
            },
          ]
        }, context).fetch()
      }


    }
    if(usersList){
      usersList.map(function (user,key) {
        //remove self user
        user.username = user.profile.InternalUprofile.moolyaProfile.firstName+" "+user.profile.InternalUprofile.moolyaProfile.lastName;
        if(context.userId == user._id){
          usersList.splice(key,1)
        }
      })
    }
    return usersList;
  }
}

