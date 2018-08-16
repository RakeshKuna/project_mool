import _ from "underscore";
import MlAppUserContext from "../mlAuthorization/mlAppUserContext";
import MlAdminUserContext from "../mlAuthorization/mlAdminUserContext";
class MlTransactionsHandler {
  constructor() {
    this.contextData.bind(this);
    this.readTransaction.bind(this);
    this.contextRefNames.bind(this);
  }

  /*
   * This method returns the context field Names.
   * @param contextData containing context keys
   * returns result Object containing context values({clusterName,chapterName,subChapterName,communityName})
   */
  contextRefNames(contextData){
    var contextData=contextData||{};
    if(contextData.clusterId && contextData.clusterId=== "all")contextData['clusterName'] ='all';
    if(contextData.clusterId && contextData.clusterId!== "all"){
      let clusterDetails = MlClusters.findOne({_id: contextData.clusterId}) || {};
      contextData['clusterName'] = clusterDetails.clusterName||null;
    }
    if(contextData.chapterId && contextData.chapterId && contextData.chapterId === "all")contextData['chapterName'] ='all';
    if(contextData.chapterId && contextData.chapterId !== "all"){
      let chapterDetails = MlChapters.findOne({_id: contextData.chapterId}) || {};
      contextData['chapterName'] = chapterDetails.chapterName||null;
    }
    if(contextData.subChapterId && contextData.subChapterId === "all")contextData['subChapterName']='all';
    if(contextData.subChapterId && contextData.subChapterId !== "all"){
      let subchapterDetails = MlSubChapters.findOne({_id: contextData.subChapterId}) || {};
      contextData['subChapterName'] = subchapterDetails.subChapterName||null;
    }
    if(contextData.communityId && contextData.communityId === "all")contextData['communityName']='all';
    if(contextData.communityId && contextData.communityId !== "all"){
      let communityDetails = MlCommunity.findOne({_id: contextData.communityId}) || {};
      contextData['communityName'] = communityDetails.communityName||null;
    }
    return contextData;

  }

  /*
   * This method returns the context fields for transaction log.
   * @param userId of logged In User
   * returns result Object containing context values({userName,emailId,userId,clusterId,chapterId,subChapterId,communityId,clusterName,chapterName,subChapterName,communityName})
   */
  contextData(userId){
    var contextData={};
    var user = Meteor.users.findOne({_id:userId});
    var firstName='';var lastName='';
    try{
      if(user&&user.profile&&user.profile.isInternaluser&&user.profile.InternalUprofile) { //resolve internal user context based on default profile
        let details = new MlAdminUserContext().userProfileDetails(userId)||{};
        contextData = {
          clusterId: details.defaultProfileHierarchyRefId ? details.defaultProfileHierarchyRefId : null,
          chapterId: details.defaultChapters && details.defaultChapters[0] ? details.defaultChapters[0] : null,
          subChapterId: details.defaultSubChapters && details.defaultSubChapters[0] ? details.defaultSubChapters[0] : null,
          communityId: details.defaultCommunities && details.defaultCommunities[0] ? details.defaultCommunities[0].communityId : null,
          communityCode: details.defaultCommunities && details.defaultCommunities[0] ? details.defaultCommunities[0].communityCode : null
        };

           firstName=(user.profile.InternalUprofile.moolyaProfile || {}).firstName||'';
           lastName=(user.profile.InternalUprofile.moolyaProfile || {}).lastName||'';

      }else if(user&&user.profile&&user.profile.isExternaluser){ //resolve external user context based on default profile
        let externalUProfile=new MlAppUserContext(userId).userProfileDetails(userId);
        contextData = {
          clusterId: externalUProfile.defaultCluster,
          chapterId: externalUProfile.defaultChapter,
          subChapterId: externalUProfile.defaultSubChapter,
          communityId:externalUProfile.defaultCommunity,
          profileId: externalUProfile.profileId
        };
           firstName=(user.profile || {}).firstName||'';
           lastName =(user.profile || {}).lastName||'';
      }else{
        contextData={};
      }

      if(user&&user.username){
        contextData['emailId']=user.username;
        contextData['userId']=user._id;
      }
      contextData['userName']=`${firstName} ${lastName}`;
      //resolve reference names for context fields
      this.contextRefNames(contextData);
    }catch(e){
      //log error for transaction context
    }
    return contextData;
  }

  resolveUserAgent(context){
    var context=context||{};
    let userAgent = {
      OS: context.os?context.os:"-",
      ipAddress: context.ip?context.ip:" ",
      browser:context.browser?context.browser:" ",
      userId:context.userId?context.userId:" ",
      deviceModel:context.deviceModel?context.deviceModel:"-",
      deviceType: context.deviceType?context.deviceType:"-",
      deviceVendor: context.deviceVendor?context.deviceVendor:"-"
    };

    return userAgent;
  }

  recordTransaction(transactionsParams) {

    var context=transactionsParams.context?transactionsParams.context:{};
    let userAgent = {
      OS: context.os?context.os:" ",
      ipAddress: context.ip?context.ip:" ",
      browser:context.browser?context.browser:" ",
      userId:transactionsParams.userId?transactionsParams.userId:" ",
      deviceModel:context.deviceModel?context.deviceModel:"-",
      deviceType: context.deviceType?context.deviceType:"-",
      deviceVendor: context.deviceVendor?context.deviceVendor:"-"
    };

    //resolve the context of User
    var contextData=this.contextData(transactionsParams.userId);
    var fromUserContextData=this.contextData(transactionsParams.fromUserId);

    let transactionRecord =
      { docId: transactionsParams.docId,
        transactionTypeId:transactionsParams.transactionTypeId||null,
        transactionTypeName:transactionsParams.transactionType||null,
        activity: transactionsParams.activity,
        activityDocId: transactionsParams.activityDocId||null,
        moduleName:transactionsParams.moduleName,
        userAgent: userAgent,
        createdAt: new Date(),
        transactionDetails: transactionsParams.transactionDetails,
        fromUserId: fromUserContextData.userId || null,
        fromUserName: fromUserContextData.userName || null,
        fromProfileId: fromUserContextData.profileId || null,
        fromUserType: transactionsParams.fromUserType || 'system',
        transactionId: transactionsParams.transactionId,
      };
    transactionRecord.attendeeDetails = transactionsParams.attendeeDetails && transactionsParams.attendeeDetails.length ? transactionsParams.attendeeDetails : [];
    // orderNumberGenService.assignTransationRequest(transactionRecord),
      transactionRecord=_.extend(transactionRecord,contextData);

    const resp = MlTransactionsLog.insert(transactionRecord);
    return resp;
  }

  readTransaction(transactionId){
    const resp = MlTransactionsLog.findOne(transactionId);
    return resp;
  }
}

  module.exports = MlTransactionsHandler
