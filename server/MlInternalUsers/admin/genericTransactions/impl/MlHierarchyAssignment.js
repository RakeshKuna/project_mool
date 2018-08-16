
/**
 * Created by muralidhar on 23/05/17.
 */
import MlAdminUserContext from '../../../../mlAuthorization/mlAdminUserContext'
import _ from 'lodash';

class MlHierarchyAssignment {

  findHierarchy(clusterId, departmentId, subDepartmentId, roleId, subChapterId) {        // subChapterId is the Id loggedIn user belongs to not his role
    let roleDetails = mlDBController.findOne('MlRoles', {_id: roleId})

    /*
     SubChapter Admin(Moolya/Non-Moolya) is admin of a specific subChapter, use id to figure out if subchapter is a default subchapter(isDefaultSubChapter)
     and then use that to find hierarchy
     */

    var isDefaultSubChapter = true;
    if(subChapterId && subChapterId != "all"){
      let subChapter = mlDBController.findOne('MlSubChapters', {_id: subChapterId});
      isDefaultSubChapter = subChapter.isDefaultSubChapter
    }
    /*
        Coded by - Murali
        Works for Platform admin self assignment of a transaction
      */
    if(subChapterId && subChapterId != "all"){
      if(isDefaultSubChapter){
        var hierarchy = mlDBController.findOne('MlHierarchyAssignments', {
          parentDepartment: departmentId,
          parentSubDepartment: subDepartmentId,
          clusterId: roleDetails.isSystemDefined ? "All" : clusterId,
          isDefaultSubChapter:isDefaultSubChapter,
        }, {}, {teamStructureAssignment: {$elemMatch: {roleId: roleId}}})
      }else{
        var hierarchy = mlDBController.findOne('MlHierarchyAssignments', {
          parentDepartment: departmentId,
          parentSubDepartment: subDepartmentId,
          clusterId: roleDetails.isSystemDefined ? "All" : clusterId,
          subChapterId: roleDetails.isSystemDefined ? "all" : subChapterId,
          isDefaultSubChapter:isDefaultSubChapter,
        }, {}, {teamStructureAssignment: {$elemMatch: {roleId: roleId}}})
      }
    }else{
      var hierarchy = mlDBController.findOne('MlHierarchyAssignments', {
        parentDepartment: departmentId,
        parentSubDepartment: subDepartmentId,
        clusterId: roleDetails.isSystemDefined ? "All" : clusterId,
        isDefaultSubChapter:isDefaultSubChapter,
      }, {}, {teamStructureAssignment: {$elemMatch: {roleId: roleId}}})
    }

    return hierarchy;
  }

  canSelfAssignTransaction(transaction, collection, userId) {
    var isValidAssignment = false;
   // let transaction = mlDBController.findOne(collection, {transactionId: transactionId});
    let userProfile = new MlAdminUserContext().userProfileDetails(userId) || {};
    let hirarichyLevel = userProfile.hierarchyLevel;
    let clusterId = userProfile && userProfile.defaultProfileHierarchyRefId ? userProfile.defaultProfileHierarchyRefId : '';
    console.log(userProfile);
    if (this.validateProfileAccess(userProfile)) {
      return true;
    } else if (clusterId != '') {
        isValidAssignment = true;
        this.processAssignmentTransactions(transaction, userId);
    }
    if (isValidAssignment === true && transaction.canAssign) {
      //proceed with assignment
      return true;
    } else {
      //throw error message
      return false;
    }
  }

  validateProfileAccess(userProfile) {
    let hierarchyLevel = userProfile.hierarchyLevel
    let roleName = userProfile.roleName;
    if ((hierarchyLevel == 4 && roleName == "platformadmin") || (hierarchyLevel == 3 && roleName == "clusteradmin") || (hierarchyLevel == 2 && roleName == "chapteradmin") || (hierarchyLevel == 1 && roleName == "subchapteradmin") || (hierarchyLevel == 0 && roleName == "communityadmin")) {
      return true;
    } else {
      return false;
    }
  }


  canSelfAssignTransactionAssignedTransaction(transactionId, collection, userId, assignedUserId) {
    return this.assignTransaction(transactionId, collection, userId, assignedUserId)
  }


  canUnAssignTransaction(transactionId, collection, userId) {
    //check his team hierarchy below
    let transaction = mlDBController.findOne(collection, {transactionId: transactionId});
    this.processAssignmentTransactions(transaction, userId);
    if (transaction.canUnAssign) {
      //proceed with assignment
      return true;
    } else {
      //throw error message
      return false;
    }
  }

  assignTransaction(transactionId, collection, userId, assignedUserId) {
    var userRole = this.getUserRoles(userId);
    var assignedRole = this.getUserRoles(assignedUserId);

    var trans = {};
    if(!_.isObject(transactionId))
        trans = mlDBController.findOne(collection, {"transactionId": transactionId}, {});
    else
      trans = transactionId

    if (this.checkisPlatformAdmin(userRole)) {
      return true;
    }
    if (userId == assignedUserId) {
      return true;
    }
    var userhierarchy = this.findHierarchy(userRole.clusterId, userRole.departmentId, userRole.subDepartmentId, userRole.roleId, userRole.subChapterId);
    var assignedRolehierarchy = this.findHierarchy(assignedRole.clusterId, assignedRole.departmentId, assignedRole.subDepartmentId, assignedRole.roleId, assignedRole.subChapterId);
    if (this.checkSystemSystemDefinedRole(userRole) && this.checkSystemSystemDefinedRole(assignedRole)) {
      if (userhierarchy._id == assignedRolehierarchy._id) {
        let decision = this.hierarchyDecision(userhierarchy, userRole.roleId, assignedRole.roleId);
        return decision;
      } else {
        return false;
      }
    } else if (!this.checkSystemSystemDefinedRole(userRole) && !this.checkSystemSystemDefinedRole(assignedRole)) {
      if (userhierarchy._id == assignedRolehierarchy._id) {
          /*
             For Parent most node (has no reporting role, reports only to Final approval)::
              1) Parent node can assign transactions to same or below level roles
              2) Parent node can only self assign an unassigned transaction.
              3) Parent node can't assign an already assigned transaction if transaction belongs to same level.
          */
          let parentHierarchy = {};
          if(userhierarchy.isDefaultSubChapter){
            // parentHierarchy = _.find(userhierarchy.teamStructureAssignment, {"assignedLevel":'cluster', "reportingRole":''});
            parentHierarchy = _.find(userhierarchy.teamStructureAssignment, function (obj) {
              if(obj.assignedLevel == "cluster" && (!obj.reportingRole || obj.reportingRole == "")){
                return obj
              }
            });
          }else{
            parentHierarchy = _.find(userhierarchy.teamStructureAssignment, function (obj) {
              if(obj.assignedLevel == "subChapter" && (!obj.reportingRole || obj.reportingRole == "")){
                return obj
              }
            });
          }

          /*    Checking if transaction is already assigned or not     */
          if(!trans.allocation || !trans.allocation.assigneeId){

              /*      Checking whether user role is equal parent most role      */
              if(parentHierarchy.roleId == userRole.roleId){

                  /*    Transaction Assignment at same role level     */
                  if(userRole.roleId == assignedRole.roleId)
                      return true;

              }else{

                  if(userRole.roleId == assignedRole.roleId)
                      return true;
              }

          }else if(trans.allocation && trans.allocation.assigneeId){

              /*      Checking whether user role is equal parent most role      */
              if(parentHierarchy.roleId == userRole.roleId) {

                  /*    If a transaction is already assigned, then transaction assignment won't happen for same role level     */
                  if (userRole.roleId == assignedRole.roleId){
                      return false;
                  }
                  /*  If Parent Most Role, then transaction assignment can happen for any level as all role levels are below level roles  */
                  else{
                      return true
                  }

              }else{

                  if(userRole.roleId == assignedRole.roleId)
                      return false;

              }

          }

        let decision = this.hierarchyDecision(userhierarchy, userRole.roleId, assignedRole.roleId);
        return decision;
      } else {
        return false;
      }
    } else if (this.checkSystemSystemDefinedRole(userRole) && !this.checkSystemSystemDefinedRole(assignedRole)) {
      if (userRole.hierarchyLevel == assignedRole.hierarchyLevel) {
        if(assignedRolehierarchy.finalApproval.role == userRole.roleId){
          return true
        }
      }else if(userRole.hierarchyLevel>assignedRole.hierarchyLevel){
        return true;
      }else{
        return false;
      }
    } else if (!this.checkSystemSystemDefinedRole(userRole) && this.checkSystemSystemDefinedRole(assignedRole)) {
      if (userRole.hierarchyLevel == assignedRole.hierarchyLevel) {
        if(assignedRolehierarchy.finalApproval.role == userRole.roleId){
          return true
        }
      }else if(userRole.hierarchyLevel>assignedRole.hierarchyLevel){
        return true;
      }else{
        return false;
      }
    }
  }

  getUserRoles(userId) {
    let role = null
    let user = mlDBController.findOne('users', {_id: userId}, {})
    let userProfileDetails = new MlAdminUserContext().userProfileDetails(userId);
    let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles
    userProfiles.map(function (doc, index) {
      if (doc.isDefault) {
        let userRoles = doc && doc.userRoles ? doc.userRoles : [];
        role = _.find(userRoles , {hierarchyCode:userProfileDetails.hierarchyCode})
      }
    });
    return role;
  }

  hierarchyDecision(hierarchy, userRole, assignedRole) {

    var userRoleMapping = null;
    var assignedRoleMapping = null;
    //disabled for same level user access
    if (userRole == assignedRole) {
      return false;
    }
    let teamStructureAssignment = hierarchy.teamStructureAssignment;
    teamStructureAssignment.map(function (role, key) {
      if (role.roleId == userRole) {
        userRoleMapping = role;
        if (role.assignedLevel == 'cluster' && (!role.reportingRole || role.reportingRole == "")) {
          return true;
        }
        // else if (role.assignedLevel == 'subChapter' && (!role.reportingRole || role.reportingRole == "")) {
        //   return true;
        // }
      } else if (role.roleId == assignedRole) {
        assignedRoleMapping = role;
      }
    })
    if (userRoleMapping && assignedRoleMapping && (userRoleMapping.reportingRole == assignedRoleMapping.roleId)) {
      return false;
    }

    if (userRoleMapping && assignedRoleMapping && (assignedRoleMapping.reportingRole == userRoleMapping.roleId)) {
      return true;
    }
    var tempReportingRole = assignedRoleMapping&&assignedRoleMapping.reportingRole?assignedRoleMapping.reportingRole:null;
    let decision = false;
    for (i = 0; i < teamStructureAssignment.length; i++) {
      for (j = 0; j < teamStructureAssignment.length; j++) {
        let role = teamStructureAssignment[j];
        if (tempReportingRole == role.roleId) {
          if (role.roleId == userRoleMapping.roleId) {
            decision = true;
          }
          tempReportingRole = role.reportingRole
          break;
        }
      }
    }
    return decision;

  }

  processAssignmentTransactions(transaction, userId) {

    if (transaction.allocation && transaction.allocation.assigneeId) {
      transaction.canAssign = false;
      //check if it is already assigned to this user and above in hierarchy
      let allocation = transaction.allocation
      if (allocation.assigneeId == userId) {
        transaction.canUnAssign = true;
      }
    } else {
      transaction.canAssign = true;
      transaction.canUnAssign = false;
    }

    return transaction;
  }


  canWorkOnInternalRequest(transactionId, collection, userId) {
    var userhierarchy = null;
    var assignedRolehierarchy = null;
    var transaction = mlDBController.findOne(collection, {requestId: transactionId});
    var userRole = this.getUserRoles(userId);
    var requestRole = this.getUserRoles(transaction.userId);

    //checking final approver
    if(this.checkisFinalApprover(userId, requestRole)===true){
      return true;
    }
    if (this.checkisPlatformAdmin(userRole)) {
      return true;
    }else if(this.checkisPlatformAdmin(requestRole)){
      return false;
    }
    //cannot approve his own request
    if (transaction.userId == userId) {
      return false;
    }
    if(userRole){
      userhierarchy = this.findHierarchy(userRole.clusterId, userRole.departmentId, userRole.subDepartmentId, userRole.roleId, userRole.subChapterId);
    }else{
      return false
    }

    if(!userhierarchy){
      return false;
    }

    if(requestRole){
      assignedRolehierarchy = this.findHierarchy(requestRole.clusterId, requestRole.departmentId, requestRole.subDepartmentId, requestRole.roleId, requestRole.subChapterId);
    }else{
      return false; // User doesn't have a default role
    }

    if(!assignedRolehierarchy){
      return false
    }

    if (this.checkSystemSystemDefinedRole(userRole) && this.checkSystemSystemDefinedRole(requestRole)) {
      if (userhierarchy._id == assignedRolehierarchy._id) {
        let decision = this.hierarchyDecision(userhierarchy, userRole.roleId, requestRole.roleId);
        return decision;
      } else {
        return false;
      }
    } else if (!this.checkSystemSystemDefinedRole(userRole) && !this.checkSystemSystemDefinedRole(requestRole)) {
      if (userhierarchy._id == assignedRolehierarchy._id) {
        let decision = this.hierarchyDecision(userhierarchy, userRole.roleId, requestRole.roleId);
        return decision;
      } else {
        return false;
      }
    } else if (this.checkSystemSystemDefinedRole(userRole) && !this.checkSystemSystemDefinedRole(requestRole)) {
      if(userRole.hierarchyLevel>=requestRole.hierarchyLevel){
        return true;
      }else{
        return false;
      }
    }
    // else if (!this.checkSystemSystemDefinedRole(userRole) && this.checkSystemSystemDefinedRole(requestRole)) {
    //   if(userRole.hierarchyLevel>=requestRole.hierarchyLevel){
    //     return true;
    //   }else{
    //     return false;
    //   }
    // }
    /*else if (this.checkSystemSystemDefinedRole(userRole) && !this.checkSystemSystemDefinedRole(requestRole)) {
      return true;
    } else if (!this.checkSystemSystemDefinedRole(userRole) && this.checkSystemSystemDefinedRole(requestRole)) {
      return false;
    }*/
  }

  checkSystemSystemDefinedRole(userRole) {
    if (userRole.roleName == "platformadmin" || userRole.roleName == "clusteradmin" || userRole.roleName == "chapteradmin" || userRole.roleName == "subchapteradmin" || userRole.roleName == "communityadmin") {
      return true;
    } else {
      return false;
    }
  }

  checkisPlatformAdmin(userRole) {
    if (userRole && (userRole.roleName == "platformadmin")) {
      return true;
    } else {
      return false;
    }
  }

  validateTransaction(transactionId, collection, userId, assignedUserId) {
    var userRole = this.getUserRoles(userId);
    var assignedRole = this.getUserRoles(assignedUserId);
    if (this.checkisPlatformAdmin(userRole)) {
      return true;
    }
    if (userId == assignedUserId) {
      return true;
    }
    var userhierarchy = this.findHierarchy(userRole.clusterId, userRole.departmentId, userRole.subDepartmentId, userRole.roleId, userRole.subChapterId);
    var assignedRolehierarchy = this.findHierarchy(assignedRole.clusterId, assignedRole.departmentId, assignedRole.subDepartmentId, assignedRole.roleId, assignedRole.subChapterId);
    if (this.checkSystemSystemDefinedRole(userRole) && this.checkSystemSystemDefinedRole(assignedRole)) {
      if (userhierarchy._id == assignedRolehierarchy._id) {
        let decision = this.hierarchyDecision(userhierarchy, userRole.roleId, assignedRole.roleId);
        return decision;
      } else {
        return false;
      }
    } else if (!this.checkSystemSystemDefinedRole(userRole) && !this.checkSystemSystemDefinedRole(assignedRole)) {
      if (userhierarchy._id == assignedRolehierarchy._id) {
        let decision = this.hierarchyDecision(userhierarchy, userRole.roleId, assignedRole.roleId);
        return decision;
      } else {
        return false;
      }
    } else if (this.checkSystemSystemDefinedRole(userRole) && !this.checkSystemSystemDefinedRole(assignedRole)) {
      return true;
    } else if (!this.checkSystemSystemDefinedRole(userRole) && this.checkSystemSystemDefinedRole(assignedRole)) {
      return false;
    }
  }

  checkHierarchyExist(userId) {
    let userRole = this.getUserRoles(userId)
    if (userRole) {
      if (this.checkisPlatformAdmin(userRole)) {
        return true;
      } else {
        let userhierarchy = this.findHierarchy(userRole.clusterId, userRole.departmentId, userRole.subDepartmentId, userRole.roleId, userRole.subChapterId);
        if (userhierarchy && userhierarchy._id) {
          let roles = userhierarchy.teamStructureAssignment;
          let activeHierarchyRoleAvailable = false;
          roles.map(function (role) {
            if(role.roleId == userRole.roleId && role.isAssigned ===true){
              activeHierarchyRoleAvailable = true
            }
          })
          return activeHierarchyRoleAvailable;
        }
      }
    }else{
      return false;
    }
  }

  checkisFinalApprover(userId, requestRole){
    let finalApprover = false
    let canCheckForFinalApproval = false;
    let user = mlDBController.findOne('users', {_id: userId}, {})
    let userProfiles = user.profile.InternalUprofile.moolyaProfile.userProfiles
    let requestedDept = mlDBController.findOne('MlDepartments', {_id: requestRole.departmentId}, {})
    userProfiles.map(function (doc, index) {
      if (doc.isDefault) {
        let userRoles = doc && doc.userRoles ? doc.userRoles : [];
        userRoles.map(function (role) {
          //let userhierarchy = this.findHierarchy(role.clusterId, role.departmentId, role.subDepartmentId, role.roleId);
          let roleDetails = mlDBController.findOne('MlRoles', {_id: role.roleId})

          /*
           Internal Request Dept is SystemDefined then only system defined roles can change the status of the request
           */
          if(requestedDept.isSystemDefined){
            if(roleDetails.isSystemDefined){
              canCheckForFinalApproval = true
            }
          }else{
            canCheckForFinalApproval = true
          }

          /*
           SubChapter Admin(Moolya/Non-Moolya) is admin of a specific subChapter, use id to figure out if subchapter is a default subchapter(isDefaultSubChapter)
           and then use that to find hierarchy
           */

          if(canCheckForFinalApproval){
            var isDefaultSubChapter = true;
            if(role.subChapterId && role.subChapterId != "all"){
              let subChapter = mlDBController.findOne('MlSubChapters', {_id: role.subChapterId});
              isDefaultSubChapter = subChapter.isDefaultSubChapter
            }

            if(isDefaultSubChapter){
              var hierarchy = mlDBController.findOne('MlHierarchyAssignments', {
                parentDepartment: requestRole.departmentId,
                parentSubDepartment: requestRole.subDepartmentId,
                clusterId: roleDetails.isSystemDefined ? "All" : role.clusterId,
                isDefaultSubChapter: isDefaultSubChapter,
                "finalApproval.role":role.roleId
              }, {})
            }else{
              var hierarchy = mlDBController.findOne('MlHierarchyAssignments', {
                parentDepartment: requestRole.departmentId,
                parentSubDepartment: requestRole.subDepartmentId,
                clusterId: roleDetails.isSystemDefined ? "All" : role.clusterId,
                subChapterId: roleDetails.isSystemDefined ? "all" : role.subChapterId,
                isDefaultSubChapter: isDefaultSubChapter,
                "finalApproval.role":role.roleId
              }, {})
            }

            if(hierarchy&&hierarchy._id){
              if(hierarchy.finalApproval.role == role.roleId ){
                finalApprover = true;
              }
            }
          }
        })
      }
    });
    return finalApprover;
  }

}

const mlHierarchyAssignment = new MlHierarchyAssignment();
Object.freeze(mlHierarchyAssignment);

export default mlHierarchyAssignment;

