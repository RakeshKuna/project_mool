import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';
import MlTransactionsHandler from '../../../../commons/mlTransactionsLog';
import MlEmailNotification from '../../../../mlNotifications/mlEmailNotifications/mlEMailNotification';
MlResolver.MlMutationResolver['createBugReport'] = (obj, args, context, info) => {

    if(!context.userId)return new MlRespPayload().errorPayload("Please login to report a bug", 400);
    if(!args.details||!args.details.details||args.details.details.trim()==="")return new MlRespPayload().errorPayload("Details are required", 400);


  var bugReportData={details:args.details.details,reportedUrl:args.details.reportedUrl};
  //todo: make a generic contextData handler
  var contextData=new MlTransactionsHandler().contextData(context.userId);
  var userAgent=new MlTransactionsHandler().resolveUserAgent(context);
  bugReportData=_.extend(bugReportData,contextData);
  bugReportData.createdBy = context.userId;
  bugReportData.timeStamp = new Date();
  bugReportData.userAgent=userAgent;
  let result = mlDBController.insert('MlBugReport',bugReportData, context);
  if (result) {
    MlEmailNotification.sendBugReportToAdmin(bugReportData);
    MlEmailNotification.sendBugReportFeedbackToUser(bugReportData);
    let code = 200;
    let result = {bugReportId: result};
    let response = new MlRespPayload().successPayload(result, code);
    return response;
  }
}
