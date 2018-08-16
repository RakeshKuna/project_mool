import MlResolver from '../../commons/mlResolverDef';
import MlRespPayload from "../../commons/mlPayload";
MlResolver.MlMutationResolver['updatePayment'] = (obj, args, context, info) => {
  console.log(args);
  let paymentId = args.transID;
  if(!paymentId) {
    return ;
  }

  let paymentSuccess = args.paymentStatus;
  if(!paymentSuccess){
    return ;
  }

  let paymentInfo =mlDBController.findOne('MlPayment',{paymentId: paymentId}, context);
  if(!paymentInfo) {
    return
  }
  let activityType = paymentInfo.activityType;
  var response=null;
  switch (activityType) {
    case "OFFICE-PURCHASED":
      console.log("update mlPayment");
      let paymentUpdate =mlDBController.update('MlPayment',{paymentId: paymentId}, { status: paymentSuccess }, {$set: true},  context);
      let officeDate = {
        officeId: paymentInfo.resourceId,
        amount: paymentInfo.amount,
        transactionId: paymentInfo.activityId
      };
      context.userId = paymentInfo.userId;
      console.log(paymentSuccess);
      if(paymentUpdate && paymentSuccess.toLowerCase() === "success") {
        console.log("inside success");
        response = MlResolver.MlMutationResolver['officeTransactionPayment'](null, officeDate, context, null);
      }else{
        let code = 400;
        response = new MlRespPayload().errorPayload("Payment not successful!!!", code);
      }
      break;
    case "SERVICE-PURCHASED":
      return ;
      break;
  }
  if(response){
    return paymentInfo.resourceId;
  }else{
    return response;
  }
  //return response;
};
