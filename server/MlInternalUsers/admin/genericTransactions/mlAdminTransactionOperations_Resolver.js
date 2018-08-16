import MlResolver from '../../../commons/mlResolverDef'
import mlTransactionFactory from './core/mlTransactionsEngine';

MlResolver.MlMutationResolver['updateGenericTransaction'] = (obj, args, context, info) =>{

  let transactionType=args.transactionType;
  let operation=args.operation;
  let transactionId = args.transactionId;
  let instance=null;
  instance=mlTransactionFactory.fetchTransactions(transactionType,operation);
  if(instance) {
    switch (operation) {
      case 'assignTransaction':
        return instance.assignTransaction(transactionType,transactionId,args.params.assignmentParams,context);
        break;
      case 'unAssignTransaction':
        return instance.unAssignTransaction(transactionType,transactionId,context);
        break;
      case 'selfAssignTransaction':
        return instance.selfAssignTransaction(transactionType,transactionId, context.userId,context);
        break;
      case 'updateTransactionStatus':
        return instance.updateTransactionStatus(transactionType,transactionId,args.parmas.status,context);
        break;
      case 'workflowTransaction':
        return instance.workflowTransaction();
        break;
    }
  }
  return null;
}

/*MlResolver.MlUnionResolver['ContextSpecSearchResult']= {
  __resolveType(data, context, info){

    var transactionType=context.transactionType||"";
    var resolveType='';
    switch(transactionType) {
      case "registration":resolveType= 'registrationObject';break;
      case "portfolio":resolveType= 'portfolio';break;
      case "internalRequests":resolveType= 'requestsInput';break;
    }

    if(resolveType){
      return resolveType;
    }else{
      return 'GenericType';
    }
  }
}*/
