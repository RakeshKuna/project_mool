import MlTransactionsHandler from '../../commons/mlTransactionsLog';
import _ from 'lodash';

class MlOnBoard {


  getUserDetails(userId){
    var user =mlDBController.findOne('users',{_id:userId})||{};
    return user;
  }

  fetchContextUserDetails(context){
    var contextUserId=context?context.userId:null;
    var contextUser=this.getUserDetails(contextUserId)||{};
    return {contextUserId:contextUser._id,contextUserName:contextUser.username,contextUser:contextUser};
  }


  createTransactionRequest(userId, transType, portfolioId, resourceId, fromUserId, fromUserType, context,transactionId) {
    try {
      var transactionType = transType;
      switch (transactionType) {
        case 'investments':
          new MlTransactionsHandler().recordTransaction({
            'fromUserId': fromUserId,
            'moduleName': 'onBoard',
            'activity': 'onBoard',
            'transactionType': 'investments',
            'userId': userId,
            'activityDocId': resourceId,
            'docId': portfolioId,
            'transactionDetails': 'investments',
            'context': context || {},
            'transactionTypeId': "investments",
            'fromUserType': fromUserType,
            'transactionId':transactionId
          });
          break;

      }
    }
    catch (e) {
      //console
      console.log(e);
    }
  }
}

const mlOnBoard = new MlOnBoard();
Object.freeze(mlOnBoard);

export default mlOnBoard;
