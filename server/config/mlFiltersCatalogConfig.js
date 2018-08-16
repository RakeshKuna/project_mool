if(Meteor.isServer){
  let portfolioFilterExists = MlFiltersCatalog.findOne({"moduleName":"portfolio"});
  if(!portfolioFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "portfolio",
      "moduleName":"portfolio"
    },{$set:{
      fields:[
        {
          name:"clusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"chapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"subChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
        {
          name:"communityCode",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },
        {
          name:"transactionType",
          type:'List',
          resolverName : "Gen_TransactionType",
          isDynamic:true
        },
        {
          name:"isActive",
          type:'Boolean',
          resolverName : "Gen_isActive",
          isDynamic:true
        },
        {
          name:"accountType",
          type:'List',
          resolverName : "Gen_SubscriptionType",
          isDynamic:true
        },
        {
          name:"createdBy",
          type:'String',
          resolverName : " "
        },
        {
          name:"portfolioUserName",
          type:'String',
          resolverName : " "
        },
        {
          name:"status",
          type:'List',
          resolverName : "Gen_Status",
          isDynamic:true
        }

      ]
    }});
  }


  let registrationFilterExists = MlFiltersCatalog.findOne({"moduleName":"registration"});
  if(!registrationFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "registration",
      "moduleName":"registration"
    },{$set:{
      fields:[
        {
          name:"registrationInfo.registrationDate",
          type:'Date',
          resolverName : " "
        },
        {
          name:"registrationInfo.firstName",
          type:'String',
          resolverName : " "
        },
        {
          name:"registrationInfo.clusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"registrationInfo.chapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"registrationInfo.subChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
        {
          name:"registrationInfo.communityDefCode",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },
        {
          name:"registrationInfo.transactionType",
          type:'List',
          resolverName : "Gen_TransactionType",
          isDynamic:true
        },
        {
          name:"registrationInfo.createdBy",
          type:'String',
          resolverName : " "
        },
        {
          name:"registrationInfo.email",
          type:'String',
          resolverName : " "
        },
        {
          name:"allocation.assignee",
          type:'String',
          resolverName : "",
        },
        {
          name:"status",
          type:'List',
          resolverName : "Gen_Status",
          isDynamic:true
        }



      ]
    }})
  }

  let transactionLogFilterExists = MlFiltersCatalog.findOne({"moduleName":"transactionLog"});
  if(!transactionLogFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "transactionLog",
      "moduleName":"transactionLog"
    },{$set:{
      fields:[
        {
          name:"clusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"chapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"subChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
        {
          name:"communityCode",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },
        {
          name:"transactionTypeName",
          type:'List',
          resolverName : "Gen_TransactionType",
          isDynamic:true
        }
      ]
    }});
  }


  let internalRequestFilterExists = MlFiltersCatalog.findOne({"moduleName":"internalRequests"});
  if(!internalRequestFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "internalRequests",
      "moduleName":"internalRequests"
    },{$set:{
      fields:[
        {
          name:"cluster",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"chapter",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"subChapter",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
        {
          name:"community",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },
        {
          name:"transactionTypeName",
          type:'List',
          resolverName : "Gen_TransactionType",
          isDynamic:true
        },
        {
          name:"transactionCreatedDate",
          type:'Date',
          resolverName : " ",
          isDynamic:true
        },
        {
          name:"createdBy",
          type:'String',
          resolverName : " "
        },
        {
          name:"emailId",
          type:'String',
          resolverName : " "
        }


      ]
    }});
  }

  let approvedRequestFilterExists = MlFiltersCatalog.findOne({"moduleName":"internalApprovedRequests"});
  if(!approvedRequestFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "internalApprovedRequests",
      "moduleName":"internalApprovedRequests"
    },{$set:{
      fields:[
        {
          name:"cluster",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"chapter",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"subChapter",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
        {
          name:"community",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },
        {
          name:"transactionCreatedDate",
          type:'Date',
          resolverName : " ",
          isDynamic:true
        },
        {
          name:"transactionTypeName",
          type:'List',
          resolverName : "Gen_TransactionType",
          isDynamic:true
        },
        {
          name:"createdBy",
          type:'String',
          resolverName : " "
        },
        {
          name:"emailId",
          type:'String',
          resolverName : " "
        },
      ]
    }});
  }


  let processDocumentsFilterExists = MlFiltersCatalog.findOne({"moduleName":"documents"});
  if(!processDocumentsFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "documents",
      "moduleName":"documents"
    },{$set:{
      fields:[
        {
          name:"clusters",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"chapters",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"subChapters",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
        {
          name:"communities",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },
        {
          name:"userTypes",
          type:'List',
          resolverName : "Gen_UserType",
          isDynamic:true
        },
        {
          name:"industries",
          type:'List',
          resolverName : "Gen_Industries",
          isDynamic:true
        },
        {
          name:"identity",
          type:'List',
          resolverName : "Gen_IdentityTypes",
          isDynamic:true
        },
        {
          name:"date",
          type:'Date',
          resolverName : " ",
          isDynamic:true
        }
      ]
    }});
  }

  let templateAssignmentFilterExists = MlFiltersCatalog.findOne({"moduleName":"templateAssignment"});
  if(!templateAssignmentFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "templateAssignment",
      "moduleName":"templateAssignment"
    },{$set:{
      fields:[
        {
          name:"templateclusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"templatechapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"templatesubChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
        {
          name:"templatecommunityCode",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },
        {
          name:"templateuserType",
          type:'List',
          resolverName : "Gen_UserType",
          isDynamic:true
        },
        {
          name:"createdDate",
          type:'Date',
          resolverName : " ",
          isDynamic:true
        },
        {
          name:"createdBy",
          type:'String',
          resolverName : " "
        },
      ]
    }});
  }

  //Office filter
  let officeFilterExists = MlFiltersCatalog.findOne({"moduleName":"office"});
  if(!officeFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "office",
      "moduleName":"office"
    },{$set:{
      fields:[
        {
          name:"clusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"chapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"subChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
       /* {
          name:"communityName",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },*/
        {
          name:"createdDate",
          type:'Date',
          resolverName : " ",
          isDynamic:true
        }
        /*{
          name:"createdBy",
          type:'String',
          resolverName : " "
        },*/
      ]
    }});
  }

  //ProcessSetup Filter
  let processSetupFilterExists = MlFiltersCatalog.findOne({"moduleName":"processSetup"});
  if(!processSetupFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "processSetup",
      "moduleName":"processSetup"
    },{$set:{
      fields:[
        {
          name:"clusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"chapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"subChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
       /* {
          name:"communityName",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },*/
        {
          name:"createdDate",
          type:'Date',
          resolverName : " ",
          isDynamic:true
        }
        /*{
         name:"createdBy",
         type:'String',
         resolverName : " "
         },*/
      ]
    }});
  }

  //Share Filter
  let shareFilterExists = MlFiltersCatalog.findOne({"moduleName":"share"});
  if(!shareFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "share",
      "moduleName":"share"
    },{$set:{
      fields:[
        {
          name:"owner.clusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"owner.chapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"owner.subChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
      /*   {
         name:"owner.communityId",
         type:'List',
         resolverName : "Gen_Community",
         isDynamic:true
         },*/
        {
          name:"createdAt",
          type:'Date',
          resolverName : " ",
          isDynamic:true
        },
        {
         name:"createdBy",
         type:'String',
         resolverName : " "
         },
      ]
    }});
  }


  //External Users Filter
  let usersFilterExists = MlFiltersCatalog.findOne({"moduleName":"users"});
  if(!usersFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "users",
      "moduleName":"users"
    },{$set:{
      fields:[
        {
          name:"registrationInfo.registrationDate",
          type:'Date',
          resolverName : " "
        },
        {
          name:"registrationInfo.firstName",
          type:'String',
          resolverName : " "
        },
        {
          name:"registrationInfo.clusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"registrationInfo.chapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"registrationInfo.subChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
        {
          name:"registrationInfo.communityDefCode",
          type:'List',
          resolverName : "Gen_Community",
          isDynamic:true
        },
        {
          name:"registrationInfo.transactionType",
          type:'List',
          resolverName : "Gen_TransactionType",
          isDynamic:true
        },
        {
          name:"registrationInfo.createdBy",
          type:'String',
          resolverName : " "
        },
        {
          name:"registrationInfo.email",
          type:'String',
          resolverName : " "
        },
      ]
    }});
  }


  // Filter
  let auditFilterExists = MlFiltersCatalog.findOne({"moduleName":"audit"});
  if(!auditFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "audit",
      "moduleName":"audit"
    },{$set:{
      fields:[
        {
          name:"timeStamp",
          type:'Date',
          resolverName : " "
        },
        {
          name:"moduleName",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"fieldName",
          type:'String',
          resolverName : " "
        },
        {
          name:"previousValue",
          type:'String',
          resolverName : " "
        },
        {
          name:"currentValue",
          type:'String',
          resolverName : " "
        },
        {
          name:"userAgent.ipAddress",
          type:'String',
          resolverName : " "
        },
        {
          name:"userName",
          type:'String',
          resolverName : " "
        },
      ]
    }});
  }

  // Filter
  let serviceCardsFilterExists = MlFiltersCatalog.findOne({"moduleName":"serviceCards"});
  if(!serviceCardsFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "serviceCards",
      "moduleName":"serviceCards"
    },{$set:{
      fields:[
        {
          name:"createdAt",
          type:'Date',
          resolverName : " "
        },
       {
          name:"clusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"chapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"subChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
      ]
    }});
  }

  let appointmentsFilterExists = MlFiltersCatalog.findOne({"moduleName":"appointments"});
  if(!appointmentsFilterExists){
    MlFiltersCatalog.upsert({
      "_id" : "appointments",
      "moduleName":"appointments"
    },{$set:{
      fields:[
        {
          name:"createdAt",
          type:'Date',
          resolverName : " "
        },
        {
          name:"clusterId",
          type:'List',
          resolverName : "Gen_Clusters",
          isDynamic:true
        },
        {
          name:"chapterId",
          type:'List',
          resolverName : "Gen_Chapters",
          isDynamic:true
        },
        {
          name:"subChapterId",
          type:'List',
          resolverName : "Gen_SubChapters",
          isDynamic:true
        },
        {
          name:"createdBy",
          type:'String',
          resolverName : " "
        },
      ]
    }});
  }



}
