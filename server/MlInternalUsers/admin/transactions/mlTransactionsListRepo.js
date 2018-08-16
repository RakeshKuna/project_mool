
import _ from 'lodash';

class MlTransactionsListRepo{

  constructor(){
    if(! MlTransactionsListRepo.instance){
      MlTransactionsListRepo.instance = this;
    }
      return MlTransactionsListRepo.instance;
  }

  fetchTransactions(transactionType,userId,status) {
    let transasctions = [];

    //find user default profile and all its associated roles
    let user = mlDBController.findOne('users', {_id: userId})
    let userprofile = user.profile.InternalUprofile.moolyaProfile.userProfiles
    let defaultProfile = _.filter(userprofile, function (user) {
      return user.isDefault == true;
    })
    let roles = defaultProfile[0].userRoles;

    //check platform admin return all transactions
    if(roles[0].roleName=='platformadmin' && roles[0].hierarchyLevel==4){
      let transactions =  mlDBController.find('MlTransactions',{status:{$in: status}}).fetch()
      return transactions;
    }

    //for each role find get hierarchy id's that are available in hierarchy Mapping
    let hierarchyInfo = []
    roles.map(function (role, key) {
      roleHierarchy = mlDBController.find('MlHierarchyAssignments', {
        parentDepartment: role.departmentId,
        parentSubDepartment: role.subDepartmentId
      }, {}, {teamStructureAssignment: {$elemMatch: {roleId: role.roleId}}}).fetch()
      if (roleHierarchy) {
        for (let i = 0; i < roleHierarchy.length; i++) {
          hierarchyInfo.push(roleHierarchy[i])
        }
      }
    })

    //get all transactions that are available with the hierarchy levelcode and above
    let transactionsInfo = []
    hierarchyInfo.map(function (hierarchy, key) {
      transactions = mlDBController.find('MlTransactions', {hierarchy: hierarchy._id}).fetch()
      if (transactions) {
        for (let i = 0; i < transactions.length; i++) {
          transactionsInfo.push(transactions[i])
        }
      }
    })

    if (transactionType!='All'){
      switch (transactionType) {
        case 'registration':
          transasctions = _.filter(transactionsInfo, function (transc) {
            return transc.transactionTypeName == 'registration';
          })
          return transasctions
          break;
        case 'portfolio':
          transasctions = _.filter(transactionsInfo, function (transc) {
            return transc.transactionTypeName == 'portfolio';
          })
          return transasctions
          break;
        case 'Office':
          transasctions = _.filter(transactionsInfo, function (transc) {
            return transc.transactionTypeName == 'Office';
          })
          return transasctions
          break;
        case 'Others':
          transasctions = _.filter(transactionsInfo, function (transc) {
            return transc.transactionTypeName == 'Others';
          })
          return transasctions
          break;
      }
  }
   return null;
  }

  processAssignmentTransactions(data,userId) {
    var updatedList = []
    data.map(function (doc,index) {
      let object = doc;
      let transaction = mlDBController.findOne('MlTransactions', {requestId: doc.transactionId});
      //check can be assigned
        if(transaction.allocation){
          object.canAssign = false;
          //check if it is already assigned to this user and above in hierarchy
          let allocation = transaction.allocation
          if(allocation.assigneeId==userId){
            object.canUnAssign = true;
          }
        }else{
          object.canAssign = true;
          object.canUnAssign = false;
        }
      updatedList.push(object);
    });
    return updatedList;
  }
}
const mlTransactionsListRepo = new MlTransactionsListRepo();
Object.freeze(mlTransactionsListRepo);
export default mlTransactionsListRepo;

