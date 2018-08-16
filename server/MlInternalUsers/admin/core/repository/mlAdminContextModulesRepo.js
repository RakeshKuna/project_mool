import _ from "lodash";
import MlAdminUserContext from "../../../../mlAuthorization/mlAdminUserContext";
import MlAdminContextQueryConstructor from "./mlAdminContextQueryConstructor";
import MlSubChapterAccessControl from '../../../../../server/mlAuthorization/mlSubChapterAccessControl'

MlChaptersTemp = new Mongo.Collection('mlChaptersTemp');


function doRequest() {
  return new Promise(function (resolve, reject) {

    var request = require("request");

    var options = {
      method: 'POST',
      url: 'http://localhost:3010/getAuditLogs',
      headers:
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
      body: {skip: 1, limit: 10},
      json: true
    };

    request(options ,function (error, res, body) {
      if (!error){
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
async function getAuditRecords() {

  let result = await doRequest();
  return result.rows;


}

let mergeQueries = function (userFilter, serverFilter) {
  let query = userFilter || {};
  if (_.isEmpty(query)) {
    query = serverFilter || {};
  } else {
    query = {$and: [userFilter, serverFilter]};
  }
  return query;
}
let CoreModules = {
  MlClusterRepo: (requestParams, userFilterQuery, contextQuery, fieldsProj, context) => {
    var resultantQuery = mergeQueries(contextQuery, userFilterQuery);
    //let query=contextQuery;
    let countriesId = [];
    let activeCluster = [];
    let skipLimit = [];
    // let activeCountries = mlDBController.find('MlCountries', {isActive: true}, context, {sort: {country: 1}}).fetch();
    // activeCountries.map(function (country) {
    //   countriesId.push(country._id);
    // });
    // let Clusters = mlDBController.find('MlClusters', resultantQuery, context, fieldsProj).fetch();

    // countriesId.map(function (id) {
    //   Clusters.map(function (cluster) {
    //     if (cluster.countryId == id) {
    //       activeCluster.push(cluster);
    //     }
    //   })
    // });
    // const data = activeCluster;
    // const totalRecords = mlDBController.find('MlClusters', resultantQuery, context, fieldsProj).count();
    let limit = fieldsProj.limit?JSON.parse(fieldsProj.limit):0;
    let skip = fieldsProj.skip?JSON.parse(fieldsProj.skip):0;
    let totalCount = [
      { $group: { _id: null, count: { $sum: 1 } } }
    ];

    /**
    @func createPipeline
    called to map countries and clusters
    **/
    let pipeline = createPipeline(resultantQuery);

    if(limit){
      skipLimit = [
        {
         '$skip': skip
        },
        {
         '$limit': limit
        }
      ]
    }
    else {
      skipLimit = [
        {
         '$skip': skip
        }
      ]
    }
    resQuery = pipeline.concat(skipLimit);
    const countQuery = pipeline.concat(totalCount);
    const totalSize = mlDBController.aggregate('MlClusters', countQuery);
    const data = mlDBController.aggregate('MlClusters', resQuery, context);
    return {totalRecords: totalSize[0].count, data: data};
  },
  MlChapterRepo: (requestParams, userFilterQuery, contextQuery, fieldsProj, context) => {

    if (!fieldsProj.sort) {
      fieldsProj.sort = {
        chapterName: 1
      }
    }

    let pipeline = [];
    let resultantQuery = {};
    let clusterId = requestParams && requestParams.clusterId && requestParams.clusterId != 'all' ? requestParams.clusterId : null;
    if (clusterId) {
      if ((!_.isEmpty(contextQuery)) && _.indexOf(contextQuery._id, "all") < 0) {
        resultantQuery = {"clusterId": clusterId};
        if (Object.keys(userFilterQuery).length) {
          resultantQuery = mergeQueries(resultantQuery, userFilterQuery);
        }
        pipeline.push({'$match': {_id: {$in: contextQuery._id}}});
      } else {
        pipeline.push({'$match': {"clusterId": clusterId}});
        resultantQuery = userFilterQuery;
      }
    } else {
      resultantQuery = mergeQueries(userFilterQuery, contextQuery);
    }
    pipeline.push({$lookup: {from: 'mlCities', localField: 'cityId', foreignField: '_id', as: 'cityInfo'}});
    pipeline.push({$match: {'cityInfo.isActive': true}});
    if (resultantQuery) {
      pipeline.push({$match: resultantQuery});
    }
    if (fieldsProj.sort) {
      pipeline.push({$sort: fieldsProj.sort});
    }
    if (fieldsProj.skip) {
      pipeline.push({$skip: parseInt(fieldsProj.skip)});
    }
    if (fieldsProj.limit) {
      pipeline.push({$limit: parseInt(fieldsProj.limit)});
    } else {
      pipeline.push({$out: "mlChaptersTemp"});
    }
    let myAggregateCheck = mlDBController.aggregate('MlChapters', pipeline, context);
    if (!fieldsProj.limit) {
      myAggregateCheck = MlChaptersTemp.find({}).fetch();
    }
    const mytotalRecords = MlChapters.find(resultantQuery, fieldsProj).count();
    return {totalRecords: mytotalRecords, data: myAggregateCheck};
  },
  MlSubChapterRepo: (requestParams, userFilterQuery, contextQuery, fieldsProj, context) => {
    var resultantQuery = mergeQueries(contextQuery, userFilterQuery);
    //let query=contextQuery;
    let chapterId = requestParams && requestParams.chapterId ? requestParams.chapterId : null;
    let clusterId = requestParams && requestParams.clusterId ? requestParams.clusterId : null;
    if (chapterId) {
      // resultantQuery = mergeQueries(resultantQuery, {"chapterId":chapterId})
      resultantQuery = mergeQueries({"chapterId": chapterId}, userFilterQuery);
      if (!_.isEmpty(contextQuery) && _.indexOf(contextQuery._id, "all") < 0) {
        resultantQuery = mergeQueries(resultantQuery, {_id: {$in: contextQuery._id}});
      }
    }
    const data = MlSubChapters.find(resultantQuery, fieldsProj).fetch();
    const totalRecords = mlDBController.find('MlChapters', resultantQuery, context, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};
  },
  MlCommunityRepo: (requestParams, userFilterQuery, contextQuery, fieldsProj, context) => {
    //TODO:User Data Context Query
    //Filter as applied by user.
    // let contextQuery=contextQuery||{};
    let query = {};
    //User selection filter.
    let subChapterId = requestParams && requestParams.subChapterId ? requestParams.subChapterId : null;
    if (subChapterId) {
      query = {"subChapterId": subChapterId};
    }

    // const data= MlCommunity.find(query,fieldsProj).fetch();
    const data = mlDBController.find('MlCommunity', query, context, fieldsProj).fetch();
    // const totalRecords = MlCommunity.find(query,fieldsProj).count();
    const totalRecords = mlDBController.find('MlCommunity', query, context, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};

  },
  MlMasterSettingsRepo: (requestParams, userFilterQuery, contextQuery, fieldsProj, context) => {
    //TODO:User Data Context Query
    //Filter as applied by user.
    // let contextQuery=contextQuery||{};
    let serverQuery = {};
    let query = {};
    //User selection filter.
    let settingsType = requestParams && requestParams.settingsType ? requestParams.settingsType : null;
    let userId = requestParams && requestParams.userId ? requestParams.userId : null;
    //as it is cluster level settings
    let userProfile = new MlAdminUserContext().userProfileDetails(userId);
    let hierarchyRedId = userProfile.defaultProfileHierarchyRefId;
    serverQuery = {"hierarchyRefId": hierarchyRedId, type: settingsType};

    query = mergeQueries(userFilterQuery, serverQuery);
    // const data= MlMasterSettings.find(query,fieldsProj).fetch();
    const data = mlDBController.find('MlMasterSettings', query, context, fieldsProj).fetch();
    // const totalRecords=MlMasterSettings.find(query,fieldsProj).count();
    const totalRecords = mlDBController.find('MlMasterSettings', query, context, fieldsProj).count();

    return {totalRecords: totalRecords, data: data};
  },
  /**
   * @Note 1) sending registrationId from client need to update it as docId from the client.
   *       2) if(1) changes to be made in users about transaction also, using registrationId there.
   * */
  MlAuditLogRepo: async (requestParams, userFilterQuery, contextQuery, fieldsProj, context, userSpecificSearch) => {
    var data = [], totalRecords = 0;
    if (!fieldsProj.sort) {
      fieldsProj.sort = {timeStamp: -1}
    }
    requestParams = requestParams ? requestParams : null;
    var reqArray = requestParams.moduleName.split(',');
    var serverQuery = {moduleName: {$in: reqArray}};
    if (requestParams && requestParams.registrationId)
      serverQuery.docId = requestParams.registrationId;
    //construct context query with $in operator for each fields
    var resultantQuery = MlAdminContextQueryConstructor.constructQuery(contextQuery, '$in');
    _.each(resultantQuery, function (r) {
      if (_.isArray(r)) {
        r.push('all');
      }
    });
    //FIX for Issue: MOOLYA=2361
    var serverFilterQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(resultantQuery, serverQuery), '$and');
    //todo: internal filter query should be constructed.
    //resultant query with $and operator
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');

    //Fix for Issue: MOOLYA-2361
    var result = CoreModules.MlAuditHistorySearchResult(requestParams.moduleName, resultantQuery, serverFilterQuery, userFilterQuery, fieldsProj, context, userSpecificSearch);
    if (result.resultsFetched) {
      data = result.data || [];
      totalRecords = result.totalRecords || 0;
    } else {
      data= MlAudit.find(resultantQuery, fieldsProj).fetch();
      //data = await getAuditRecords();
      totalRecords = mlDBController.find('MlAudit', resultantQuery, context, fieldsProj).count();
    }
    data.map(function (doc, index) {
      let userObj;
      if (doc && doc.userId) {
        userObj = Meteor.users.findOne({_id: doc.userId}) || {};
      }
      // let firstName = userObj && userObj.profile && userObj.profile.InternalUprofile && userObj.profile.InternalUprofile.moolyaProfile && userObj.profile.InternalUprofile.moolyaProfile.firstName ? userObj && userObj.profile && userObj.profile.InternalUprofile && userObj.profile.InternalUprofile.moolyaProfile && userObj.profile.InternalUprofile.moolyaProfile.firstName : "";
      // let lastName = userObj && userObj.profile && userObj.profile.InternalUprofile && userObj.profile.InternalUprofile.moolyaProfile && userObj.profile.InternalUprofile.moolyaProfile.lastName ? userObj && userObj.profile && userObj.profile.InternalUprofile && userObj.profile.InternalUprofile.moolyaProfile && userObj.profile.InternalUprofile.moolyaProfile.lastName : "";
      let firstName = userObj && userObj.profile && userObj.profile.firstName ? userObj.profile.firstName : '';
      let lastName = userObj && userObj.profile && userObj.profile.lastName ? userObj.profile.lastName : '';
      data[index].userName = firstName && lastName ? firstName + " " + lastName : doc.userName
    })
    return {totalRecords: totalRecords, data: data};
  },

  MlHierarchySubChapterRepo: (requestParams, contextQuery, fieldsProj, context) => {
    let nonMoolyaQuery = {};
    let moolyaQuery = {};
    var processedData = []
    //User selection filter.
    var userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
    if (userProfile.hierarchyLevel == 4) {
      let clusterId = requestParams && requestParams.clusterId ? requestParams.clusterId : null;
      if (clusterId) {
        nonMoolyaQuery = {"clusterId": clusterId, isDefaultSubChapter: false};
        moolyaQuery = {"clusterId": clusterId, isDefaultSubChapter: true}
      }
      var nonMoolya = mlDBController.find('MlSubChapters', nonMoolyaQuery, context, fieldsProj).fetch();
      var moolya = mlDBController.findOne('MlSubChapters', moolyaQuery, context, fieldsProj);
      if (moolya && moolya.isDefaultSubChapter === true) {
        processedData.push(moolya)
        if (nonMoolya) {
          nonMoolya.map(function (doc, id) {
            processedData.push(doc)
          })
        }
      }
      data = processedData
      var totalRecords = mlDBController.find('MlSubChapters', nonMoolyaQuery, context, fieldsProj).count();
      return {totalRecords: totalRecords + 1, data: data};
    } else {
      let subChapters = userProfile.defaultSubChapters
      let clusterId = requestParams && requestParams.clusterId ? requestParams.clusterId : null;
      nonMoolyaQuery = {"clusterId": clusterId, "_id": {'$in': subChapters}, isDefaultSubChapter: false};
      var data = mlDBController.find('MlSubChapters', nonMoolyaQuery, context, fieldsProj).fetch();
      var totalRecords = mlDBController.find('MlSubChapters', nonMoolyaQuery, context, fieldsProj).count();
      return {totalRecords: totalRecords, data: data};
    }
  },
  MlInternalRequestRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {
    var type = requestParams && requestParams.type ? requestParams.type : "";
    var contextFieldMap = {
      'clusterId': 'cluster',
      'chapterId': 'chapter',
      'subChapterId': 'subChapter',
      'communityId': 'communityId',
      'communityCode': 'community'
    };
    var resultantQuery = MlAdminContextQueryConstructor.updateQueryFieldNames(contextQuery, contextFieldMap);
    //construct context query with $in operator for each fields
    let userProfile = new MlAdminUserContext().userProfileDetails(context.userId);
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(resultantQuery, '$in');
    var serverQuery = {};
    switch (type) {
      //custom restriction for registration
      case 'requested':
        serverQuery = {'status': {'$in': ['Pending', 'WIP']}};
        break;
      case 'approved':
        serverQuery = {'status': "Approved"};
        break;
      case 'rejected':
        serverQuery = {'status': "Rejected"};
        break;
    }
    //todo: internal filter query should be constructed.
    //resultant query with $and operator
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');

    if (!fieldsProj.sort) {
      fieldsProj.sort = {'transactionCreatedDate': -1}
    }

    var data = MlRequests.find(resultantQuery, fieldsProj).fetch() || [];
    var totalRecords = MlRequests.find(resultantQuery, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};
  },
  MlTemplatesAssignmentRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {
    var contextFieldMap = {
      'clusterId': 'templateclusterId',
      'chapterId': 'templatechapterId',
      'subChapterId': 'templatesubChapterId',
      'communityId': 'communityId',
      'communityCode': 'templatecommunityCode'
    };
    var resultantQuery = MlAdminContextQueryConstructor.updateQueryFieldNames(contextQuery, contextFieldMap);
    //this is specific to template assignment
    //community is is not captured in template assignment
    _.omit(resultantQuery, ['communityId']);
    //add all for each option
    _.each(resultantQuery, function (r) {
      if (_.isArray(r)) {
        r.push('all');
      }
    });

    //construct context query with $in operator for each fields
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(resultantQuery, '$in');

    if (!fieldsProj.sort) {
      fieldsProj.sort = {'createdDate': -1}
    }

    //todo: internal filter query should be constructed.
    //resultant query with $and operator
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery), '$and');
    //var data = MlTemplateAssignment.find(resultantQuery, fieldsProj).fetch();
    var pipeline = [];
    if (Object.keys(resultantQuery).length) {
      pipeline.push({'$match': resultantQuery});
    }
    ;
    pipeline = pipeline.concat([{
      '$lookup': {
        from: "mlUserTypes",
        localField: "templateuserType",
        foreignField: "_id",
        as: "userType"
      }
    },
      {'$unwind': {'path': '$userType', preserveNullAndEmptyArrays: true}},
      {
        '$project': {
          "_id": 1,
          "templateprocess": 1,
          "templatesubProcess": 1,
          "templateProcessName": 1,
          "templateSubProcessName": 1,
          "templateclusterId": 1,
          "templateclusterName": 1,
          "templatechapterId": 1,
          "templatechapterName": 1,
          "templatesubChapterId": 1,
          "templatesubChapterName": 1,
          "templatecommunityCode": 1,
          "templatecommunityName": 1,
          "templateuserType": {"$ifNull": ["$userType.userTypeName", "$templateuserType"]},
          "templateidentity": 1,
          "assignedTemplates": 1,
          "createdDate": 1,
          "createdBy": 1
        }
      }, {'$sort': fieldsProj.sort}, {'$skip': parseInt(fieldsProj.skip || 0)}, {'$limit': parseInt(fieldsProj.limit)}]);
    var data = mlDBController.aggregate('MlTemplateAssignment', pipeline, context);
    var totalRecords = MlTemplateAssignment.find(resultantQuery, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};
  },
  MlRegistrationRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {
    var type = requestParams && requestParams.type ? requestParams.type : "";
    var contextFieldMap = {
      'clusterId': 'registrationInfo.clusterId',
      'chapterId': 'registrationInfo.chapterId',
      'subChapterId': 'registrationInfo.subChapterId',
      'communityId': 'registrationInfo.communityId',
      'communityCode': 'registrationInfo.registrationType'
    };
    var resultantQuery = MlAdminContextQueryConstructor.updateQueryFieldNames(contextQuery, contextFieldMap);
    //construct context query with $in operator for each fields
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(resultantQuery, '$in');
    var serverQuery = {};
    switch (type) {
      //custom restriction for registration
      case 'requested':
        serverQuery = {'status': {'$nin': ['REG_USER_APR', 'REG_ADM_REJ', 'REG_USER_REJ']}};
        break;
      case 'approved':
        serverQuery = {'status': "REG_USER_APR"};
        break;
      case 'rejected':
        serverQuery = {'status': {'$in': ['REG_ADM_REJ', 'REG_USER_REJ']}};
        break;
    }

    //To display the latest record based on date
    if (!fieldsProj.sort) {
      fieldsProj.sort = {'registrationInfo.registrationDate': -1}
    }

    //todo: internal filter query should be constructed.
    //resultant query with $and operator
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');

    var result = [];
    var data = MlRegistration.find(resultantQuery, fieldsProj).fetch() || [];
    var totalRecords = MlRegistration.find(resultantQuery, fieldsProj).count();
    data.map(function (doc, index) {
      let object;
      object = doc.registrationInfo;
      object._id = doc._id;
      object.registrationStatus = doc.status;
      if (doc.allocation && doc.allocation.assigneeId) {
        // object.assignedUser = doc.allocation.assignee
        let user = mlDBController.findOne('users', {_id: doc.allocation.assigneeId});
        object.assignedUser = user.profile.firstName + " " + user.profile.lastName
        object.assignedUserId = doc.allocation.assigneeId
        object.allocationStatus = doc.allocation.allocationStatus
      }
      /*else{
       object.assignedUser = "Un Assigned"
       }*/
      result.push(object);
    });
    data = result;
    return {totalRecords: totalRecords, data: data};
  },
  MlPortfolioRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {
    var type = requestParams && requestParams.type ? requestParams.type : "";
    //construct context query with $in operator for each fields
    var resultantQuery = MlAdminContextQueryConstructor.constructQuery(contextQuery, '$in');
    var serverQuery = {};
    switch (type) {
      //custom restriction for registration
      case 'requested':
        //serverQuery = {'status': {'$in': ['WIP', 'Yet To Start', 'Go Live']}};
        serverQuery = {'status': {'$nin': ['PORT_LIVE_NOW']}};
        if (!fieldsProj.sort) {
          fieldsProj.sort = {'createdAt': -1}
        }
        break;
      case 'approved':
        serverQuery = {'status': "PORT_LIVE_NOW"};
        if (!fieldsProj.sort) {
          fieldsProj.sort = {'transactionUpdatedDate': -1}
        }
        break;
    }
    //todo: internal filter query should be constructed.
    //resultant query with $and operator
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');

    var data = MlPortfolioDetails.find(resultantQuery, fieldsProj).fetch() || [];
    var totalRecords = MlPortfolioDetails.find(resultantQuery, fieldsProj).count();
    data.map(function (doc, index) {
      if (doc.allocation && doc.allocation.assigneeId) {
        // doc.assignedUser = doc.allocation.assignee
        let user = mlDBController.findOne('users', {_id: doc.allocation.assigneeId});
        doc.assignedUser = user.profile.firstName + " " + user.profile.lastName
        doc.assignedUserId = doc.allocation.assigneeId
        doc.allocationStatus = doc.allocation.allocationStatus
      }
    });
    return {totalRecords: totalRecords, data: data};
  },
  MlTransactionLogRepo: (requestParams, userFilterQuery, contextQuery, fieldsProj, context) => {
    var type = requestParams && requestParams.transactionTypeName ? requestParams.transactionTypeName : "";
    var serverQuery = {};
    let query = {};
    if (!fieldsProj.sort) {
      fieldsProj.sort = {createdAt: -1}
    }
    switch (type) {
      case 'interactions':
        serverQuery = {'transactionTypeName': "interaction"};
        break;
      case 'system':
        serverQuery = {'transactionTypeName': "system"};
        break;
      case 'conversations':
        serverQuery = {'transactionTypeName': "conversation"};
        break;
    }
    var resultantQuery = MlAdminContextQueryConstructor.constructQuery(contextQuery, '$in');
    //todo: internal filter query should be constructed.
    //resultant query with $and operator
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');

    const data = mlDBController.find('MlTransactionsLog', resultantQuery, context, fieldsProj).fetch();
    const totalRecords = mlDBController.find('MlTransactionsLog', resultantQuery, context, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};

  },

  MlProcessTransactionRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {

    var contextFieldMap = {};
    var resultantQuery = MlAdminContextQueryConstructor.updateQueryFieldNames(contextQuery, contextFieldMap);

    //community is is not captured in process transaction
    _.omit(resultantQuery, ['communityId']);

    //construct context query with $in operator for each fields
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(resultantQuery, '$in');
    var serverQuery = {};
    //To display the latest record based on date
    if (!fieldsProj.sort) {
      fieldsProj.sort = {'dateTime': -1}
    }

    //todo: internal filter query should be constructed.
    //resultant query with $and operator
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');

    var result = [];
    var data = MlProcessTransactions.find(resultantQuery, fieldsProj).fetch() || [];
    var totalRecords = MlProcessTransactions.find(resultantQuery, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};
  },

  MlShareTransactionRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {
    var contextFieldMap = {
      'clusterId': 'owner.clusterId',
      'chapterId': 'owner.chapterId',
      'subChapterId': 'owner.subChapterId',
      'communityId': 'owner.communityId',
      'communityCode': 'owner.communityCode'
    };
    var resultantQuery = MlAdminContextQueryConstructor.updateQueryFieldNames(contextQuery, contextFieldMap);

    resultantQuery = MlAdminContextQueryConstructor.constructQuery(resultantQuery, '$in');
    var pipeline = [];

    if (Object.keys(resultantQuery).length) {
      pipeline.push({'$match': resultantQuery});
    }

    pipeline.push({'$match': userFilterQuery});

    pipeline.push({

        "$group": {
          _id: "$sharedId",
          userId: {"$first": "$owner.userId"},
          profileId: {"$first": "$owner.profileId"},
          createdAt: {"$first": "$createdAt"},
          totalRecords: {"$sum": 1}
        }
      },
      {"$lookup": {from: "users", localField: "userId", foreignField: "_id", as: "contactInfo"}},
      {"$unwind": "$contactInfo"},
      {"$addFields": {"userProfiles": {"$cond": [{"$isArray": "$contactInfo.profile.externalUserProfiles"}, "$contactInfo.profile.externalUserProfiles", [{}]]}}},
      {
        "$addFields": {
          "userProfiles": {
            "$filter": {
              input: "$userProfiles",
              as: "userProfile",
              cond: {$eq: ["$$userProfile.profileId", "$profileId"]}
            }
          }
        }
      },
      {"$unwind": "$userProfiles"},
      {
        "$project": {
          _id: 1,
          createdAt: 1,
          createdBy: "$contactInfo.profile.displayName",
          userId: "$userId",
          profileId: "$profileId",
          email: "$contactInfo.profile.email",
          mobileNumber: "$contactInfo.profile.mobileNumber",
          cluster: "$userProfiles.clusterName",
          chapter: "$userProfiles.chapterName",
          subChapter: "$userProfiles.subChapterName",
          community: "$userProfiles.communityName",
          transactionType: "Share",
          totalRecords: 1
        }
      })

    if (fieldsProj.sort) {
      pipeline.push({'$sort': fieldsProj.sort});
    } else {
      pipeline.push({'$sort': {'createdAt': -1}});
    }

    if (fieldsProj.skip) {
      pipeline.push({'$skip': parseInt(fieldsProj.skip)});
    }
    if (fieldsProj.limit) {
      pipeline.push({'$limit': parseInt(fieldsProj.limit)});
    }
    let data = mlDBController.aggregate('MlSharedLibrary', pipeline);

    let totalRecords = mlDBController.find('MlSharedLibrary', resultantQuery, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};
  },


  MlOfficeTransactionRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {
    // var contextFieldMap = {
    //   'clusterId': 'clusterId',
    //   'chapterId': 'chapterId',
    //   'subChapterId': 'subChapterId',
    //   'communityId': 'communityId'
    // };
    // var resultantQuery = MlAdminContextQueryConstructor.updateQueryFieldNames(contextQuery, contextFieldMap);
    // resultantQuery = MlAdminContextQueryConstructor.constructQuery(resultantQuery, '$in');

    //construct context query with $in operator for each fields
    var resultantQuery = MlAdminContextQueryConstructor.constructQuery(contextQuery, '$in');
    var serverQuery = {};
    //To display the latest record based on date
    if (!fieldsProj.sort) {
      fieldsProj.sort = {'dateTime': -1}
    }

    //todo: internal filter query should be constructed.
    //resultant query with $and operator
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');
    let pipleline = []
    if (Object.keys(resultantQuery).length) {
      pipleline.push({'$match': resultantQuery});
    }
    pipleline.push({'$lookup': {from: 'users', localField: 'userId', 'foreignField': '_id', as: 'user'}},
      {'$unwind': '$user'},
      {'$lookup': {from: 'mlOffice', localField: 'officeId', foreignField: '_id', as: 'office'}},
      {'$unwind': '$office'},
      {
        '$project': {
          'userName': '$user.profile.displayName',
          'dateTime': 1,
          'userId': 1,
          'paymentDetails': 1,
          'transactionId': 1,
          'clusterName': 1,
          'chapterName': 1,
          'subChapterName': 1,
          'communityName': 1,
          'status': 1,
          'profileId': '$office.profileId'
        }
      })

    if (fieldsProj.sort) {
      pipleline.push({'$sort': fieldsProj.sort});
    }
    if (fieldsProj.skip) {
      pipleline.push({'$skip': parseInt(fieldsProj.skip)});
    }
    if (fieldsProj.limit) {
      pipleline.push({'$limit': parseInt(fieldsProj.limit)});
    }
    var data = mlDBController.aggregate('MlOfficeTransaction', pipleline);
    var totalRecords = mlDBController.find('MlOfficeTransaction', resultantQuery, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};
  },
  MlDocumentRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {
    var type = requestParams && requestParams.type ? requestParams.type : "";
    var contextFieldMap = {
      'clusterId': 'clusters',
      'chapterId': 'chapters',
      'subChapterId': 'subChapters',
      'communityId': 'communities'
    };
    /*database keys issue*/
    var resultantQuery = MlAdminContextQueryConstructor.updateQueryFieldNames(contextQuery, contextFieldMap);
    //add all for each option
    _.each(resultantQuery, function (r) {
      if (_.isArray(r)) {
        r.push('all');
      }
    });
    //construct context query with $in operator for each fields
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(resultantQuery, '$in');
    var serverQuery = {};

    serverQuery = {'isActive': true};
    //To display the latest record based on date
    if (!fieldsProj.sort) {
      fieldsProj.sort = {'date': -1}
    }

    //todo: internal filter query should be constructed.
    //resultant query with $and operator
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');

    var result = [];

    let data = null
    data = MlProcessMapping.find(resultantQuery, fieldsProj).fetch() || [];
    data.map(function (doc, index) {
      let industryIds = [];
      let communityIds = [];
      let clusterIds = [];
      let stateIds = [];
      let chapterIds = [];
      let subChapterIds = [];
      let professionIds = [];
      let userTypeIds = [];
      let processTypes = MlprocessTypes.findOne({_id: doc.process});
      doc.communities.map(function (ids) {
        communityIds.push(ids)
      });
      const communityData = MlCommunityDefinition.find({code: {$in: communityIds}}).fetch() || [];
      let communityNames = [];  //@array of strings
      communityData.map(function (doc) {
        communityNames.push(doc.name)
      });
      doc.industries.map(function (ids) {
        industryIds.push(ids)
      });
      const industryData = MlIndustries.find({_id: {$in: industryIds}}).fetch() || [];
      let industryNames = [];  //@array of strings
      industryData.map(function (doc) {
        industryNames.push(doc.industryName)
      });
      doc.professions.map(function (ids) {
        professionIds.push(ids)
      });
      const professionData = MlProfessions.find({_id: {$in: professionIds}}).fetch() || [];
      let professionNames = [];  //@array of strings
      professionData.map(function (doc) {
        professionNames.push(doc.professionName)
      });
      doc.clusters.map(function (ids) {
        clusterIds.push(ids)
      });
      const clusterData = MlClusters.find({_id: {$in: clusterIds}}).fetch() || [];
      let clusterNames = [];  //@array of strings
      clusterData.map(function (doc) {
        clusterNames.push(doc.clusterName)
      });
      doc.states.map(function (ids) {
        stateIds.push(ids)
      });
      const stateData = MlStates.find({_id: {$in: stateIds}}).fetch() || [];
      let stateNames = [];  //@array of strings
      stateData.map(function (doc) {
        stateNames.push(doc.name)
      });
      doc.chapters.map(function (ids) {
        chapterIds.push(ids)
      });
      const chapterData = MlChapters.find({_id: {$in: chapterIds}}).fetch() || [];
      let chapterNames = [];  //@array of strings
      chapterData.map(function (doc) {
        chapterNames.push(doc.chapterName)
      });

      doc.subChapters.map(function (ids) {
        subChapterIds.push(ids)
      });
      const subChapterData = MlSubChapters.find({_id: {$in: subChapterIds}}).fetch() || [];
      let subChapterNames = [];  //@array of strings
      subChapterData.map(function (doc) {
        subChapterNames.push(doc.subChapterName)
      });
      doc.userTypes.map(function (ids) {
        userTypeIds.push(ids)
      });
      const userTypeData = MlUserTypes.find({_id: {$in: userTypeIds}}).fetch() || [];
      let userTypeNames = [];  //@array of strings
      userTypeData.map(function (doc) {
        userTypeNames.push(doc.userTypeName)
      });

      data[index].communityNames = communityNames || [];
      data[index].professionNames = professionNames || [];
      data[index].industryNames = industryNames || [];
      data[index].clusterNames = clusterNames || [];
      data[index].stateNames = stateNames || [];
      data[index].chapterNames = chapterNames || [];
      data[index].subChapterNames = subChapterNames || [];
      data[index].userTypeNames = userTypeNames || [];

      data[index].processName = processTypes.processName;

    });
    var totalRecords = MlProcessMapping.find(resultantQuery, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};
  },
  MlServiceCardsTransactionRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {
    let resultantQuery = MlAdminContextQueryConstructor.constructQuery(contextQuery, '$in');
    if (!fieldsProj.sort) {
      fieldsProj.sort = {'updatedAt': -1}
    }
    var serverQuery = {
      'isBeSpoke': false,
//      'isCurrentVersion': true,
      'isReview': true
    };
    let query = {};
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');
    var service = MlServiceCardDefinition.find(resultantQuery, fieldsProj).fetch();
    var data = [];
    service.map(function (details, index) {
      data.push(details)
      var userData = mlDBController.find('users', {'profile.externalUserProfiles.profileId': details.profileId}).fetch();
      userData.map(function (list) {
        data[index].email = list.username;
        list.profile.externalUserProfiles.map(function (user) {
          if (details.profileId === user.profileId)
            data[index].userDetails = user;
        });
      });
    });
    var totalRecords = mlDBController.find('MlServiceCardDefinition', resultantQuery, context, fieldsProj).count();
    return {totalRecords: totalRecords, data: data};
  },
  MlHierarchyClusterRepo: (requestParams, userFilterQuery, contextQuery, fieldsProj, context) => {
    var resultantQuery = mergeQueries(contextQuery, userFilterQuery);
    var countriesId = [];
    var activeCluster = [];
    var userProfile = new MlAdminUserContext().userProfileDetails(context.userId) || {};
    if (userProfile.hierarchyLevel == 4) {
      // let activeCountries = mlDBController.find('MlCountries', {isActive: true}, context, {sort: {country: 1}}).fetch();
      // activeCountries.map(function (country) {
      //   countriesId.push(country._id);
      // })
      // console.log('The res q: ', JSON.stringify(resultantQuery));
      // let Clusters = mlDBController.find('MlClusters', resultantQuery, context, fieldsProj).fetch();
      // countriesId.map(function (id) {
      //   Clusters.map(function (cluster) {
      //     if (cluster.countryId == id) {
      //       activeCluster.push(cluster);
      //     }
      //   })
      // })
      // const data = activeCluster;
      // const totalRecords = mlDBController.find('MlClusters', resultantQuery, context, fieldsProj).count();
      // console.log('The value are:: ', totalRecords);
      // return {totalRecords: totalRecords + 1, data: data};

    let limit = fieldsProj.limit?JSON.parse(fieldsProj.limit):0;
    let skip = fieldsProj.skip?JSON.parse(fieldsProj.skip):0;
    let totalCount = [
      { $group: { _id: null, count: { $sum: 1 } } }
    ];

    /**
    @func createPipeline
    called to map countries and clusters
    **/
    let pipeline = createPipeline(resultantQuery);

    if(limit){
      skipLimit = [
        {
         '$skip': skip
        },
        {
         '$limit': limit
        }
      ]
    }
    else {
      skipLimit = [
        {
         '$skip': skip
        }
      ]
    }
    resQuery = pipeline.concat(skipLimit);
    const countQuery = pipeline.concat(totalCount);
    const totalSize = mlDBController.aggregate('MlClusters', countQuery);
    const data = mlDBController.aggregate('MlClusters', resQuery, context);
    return {totalRecords: totalSize[0].count, data: data};
    } else {
      let clusterIds = userProfile && userProfile.defaultCluster ? userProfile.defaultCluster : [];
      resultantQuery = {_id: {$in: [clusterIds]}}
      var data = mlDBController.find('MlClusters', resultantQuery, context, fieldsProj).fetch();
      var totalRecords = mlDBController.find('MlClusters', resultantQuery, context, fieldsProj).count();
      return {totalRecords: totalRecords, data: data};
    }
  },

  /**
   * hierarcy department fetch repo
   * */
  MlHierarchyDepartmentsRepo: (requestParams, userFilterQuery, contextQuery, fieldsProj, context) => {
    let list = [];
    var subChapter = mlDBController.findOne('MlSubChapters', {_id: requestParams.subChapterId}, context) || {}
    var depQuery = {}
    if (subChapter.isDefaultSubChapter)
      depQuery = {$and: [{isMoolya: true}, {"depatmentAvailable.cluster": {$in: ["all", requestParams.clusterId]}}]}
    else if (!subChapter.isDefaultSubChapter)
      depQuery = {$and: [{"depatmentAvailable.cluster": {$in: ["all", requestParams.clusterId]}}, {"depatmentAvailable": {$elemMatch: {subChapter: {$in: ['all', requestParams.subChapterId]}}}}]}
    depQuery = mergeQueries(depQuery, userFilterQuery);

    var piplelineQuery = []
    piplelineQuery.push({$match: depQuery},
      {
        $lookup: {
          from: "mlSubDepartments", localField: "_id",
          foreignField: "departmentId",
          as: "subDepartmentDetails"
        }
      },
      {$unwind: {path: "$subDepartmentDetails", preserveNullAndEmptyArrays: true}},
      {
        $project:
          {
            _id: 0,
            departmentId: "$_id",
            departmentName: 1,
            subDepartmentId: "$subDepartmentDetails._id",
            subDepartmentName: "$subDepartmentDetails.subDepartmentName",
            isMoolya: "$isMoolya",
            isActive: "$isActive",
            clusterId: requestParams.clusterId,
            subChapterId: requestParams.subChapterId,
          }
      },
      {
        $lookup:
          {
            from: "mlSubChapters",
            "localField": "subChapterId",
            "foreignField": "_id",
            "as": "subChapterDetails"
          }
      },
      {
        "$unwind": {
          "path": "$subChapterDetails",
          "preserveNullAndEmptyArrays": true
        }
      },
      {
        $project: {
          "departmentId": 1,
          "departmentName": 1,
          "subDepartmentId": 1,
          "subDepartmentName": 1,
          "isMoolya": 1,
          "isActive": 1,
          "clusterId": 1,
          "subChapterId": 1,
          isDefaultSubChapter: "$subChapterDetails.isDefaultSubChapter"
        }
      })

    var counterQuery = _.clone(piplelineQuery)
    counterQuery.push({$count: "totalRecords"})
    var totalRecordsCount = mlDBController.aggregate('MlDepartments', counterQuery);

    if (fieldsProj.sort) {
      piplelineQuery.push({'$sort': fieldsProj.sort});
    }
    if (fieldsProj.skip) {
      piplelineQuery.push({'$skip': parseInt(fieldsProj.skip)});
    }
    if (fieldsProj.limit) {
      piplelineQuery.push({'$limit': parseInt(fieldsProj.limit)});
    }
    var data = mlDBController.aggregate('MlDepartments', piplelineQuery);
    // let resp = mlDBController.find('MlDepartments', depQuery, context).fetch()
    //
    // resp.map(function (department) {
    //   let subDepartments = MlSubDepartments.find({"departmentId": department._id}).fetch();
    //   subDepartments.map(function (subDepartment) {
    //     let defaultSubChapter = JSON.parse(requestParams.defaultSubChapter);
    //     let deptAndSubDepartment = {
    //       departmentId: department._id,
    //       departmentName: department.departmentName,
    //       subDepartmentId: subDepartment._id,
    //       subDepartmentName: subDepartment.subDepartmentName,
    //       isMoolya: department.isMoolya,
    //       isActive: department.isActive,
    //       clusterId: requestParams.clusterId,
    //       subChapterId:requestParams.subChapterId,
    //       isDefaultSubChapter:defaultSubChapter
    //     }
    //     list.push(deptAndSubDepartment)
    //   })
    // })
    //
    // data = list
    return {
      totalRecords: totalRecordsCount && totalRecordsCount.length ? totalRecordsCount[0].totalRecords : 0,
      data: data
    };
  },
  /**
   * user module repo handler
   * */
  MlUsersRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {
    var contextFieldMap = {
      'clusterId': 'registrationInfo.clusterId',
      'chapterId': 'registrationInfo.chapterId',
      'subChapterId': 'registrationInfo.subChapterId',
      'communityId': 'registrationInfo.communityId',
      'communityCode': 'registrationInfo.registrationType'
    };
    var resultantQuery = MlAdminContextQueryConstructor.updateQueryFieldNames(contextQuery, contextFieldMap);
    /**construct context query with $in operator for each fields*/
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(resultantQuery, '$in');
    // var nonMoolyaContext = mlNonMoolyaAccess.getExternalUserCanSearch(context)
    // if (!_.isBoolean(nonMoolyaContext)){
    //   resultantQuery['registrationInfo.subChapterId'] = {$in: nonMoolyaContext.subChapters}
    //   resultantQuery['registrationInfo.chapterId'] = {$in: nonMoolyaContext.chapters}
    // }
    var dataContext = MlSubChapterAccessControl.getAccessControl('SEARCH', context, null, false)
    if (dataContext && dataContext.hasAccess && dataContext.subChapters && dataContext.subChapters.length > 0) {
      resultantQuery['registrationInfo.subChapterId'] = {$in: dataContext.subChapters}
      resultantQuery['registrationInfo.chapterId'] = {$in: dataContext.chapters}
    }
    if (!fieldsProj.sort) {
      fieldsProj.sort = {
        'registrationInfo.registrationDate': -1
      }
    }
    var serverQuery = {emails: {$elemMatch: {verified: true}}};
    resultantQuery = MlAdminContextQueryConstructor.constructQuery(_.extend(userFilterQuery, resultantQuery, serverQuery), '$and');
    // var data = MlRegistration.find(resultantQuery, fieldsProj).fetch() || [];
    let piplelineQuery = []
    if (resultantQuery)
      piplelineQuery.push({'$match': resultantQuery});

    piplelineQuery.push({
        $lookup: {
               from: "mlAccountTypes",
               localField: "registrationInfo.accountType",
               foreignField: "_id",
               as: 'account'
        }},
           
          { $unwind: "$account"},
       {
         $group: {
             _id: '$registrationInfo.userName',
             "registrationId": {"$first": "$_id"},
             "firstName": {"$first": "$registrationInfo.firstName"},
             "lastName": {"$first": "$registrationInfo.lastName"},
             "clusterName": {"$first": "$registrationInfo.clusterName"},
             "chapterName": {"$first": "$registrationInfo.chapterName"},
             "registrationType": {"$first": "$registrationInfo.registrationType"},
             "subChapterName": {"$first": "$registrationInfo.subChapterName"},
             "accountType": {"$first": "$account.accountName"},
             "userName": {"$first": "$registrationInfo.userName"},
           }
    })
    if (fieldsProj.sort) {
      piplelineQuery.push({'$sort': fieldsProj.sort});
    }
    if (fieldsProj.skip) {
      piplelineQuery.push({'$skip': parseInt(fieldsProj.skip)});
    }
    if (fieldsProj.limit) {
      piplelineQuery.push({'$limit': parseInt(fieldsProj.limit)});
    }
    var data = mlDBController.aggregate('MlRegistration', piplelineQuery);

    var totalRecords = MlRegistration.find(resultantQuery, fieldsProj).count();

    // var result = []
    // data.map(function (doc, index) {
    //   let object;
    //   object = doc.registrationInfo;
    //   object._id = doc._id;
    //   result.push(object);
    // });
    // var a = _.uniqBy(result, 'userName');
    // console.log(a.length)
    return {totalRecords: totalRecords, data: data};
  },

  MlUsersTransaction: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {

    var result = [];
    var reg = mlDBController.findOne('MlRegistration', {'_id': requestParams.registrationId}, context)

    let pipeline = [{
      '$match': {_id: reg.registrationInfo.userId}
    },
      {
        '$lookup': {
          from: 'mlRegistration',
          localField: '_id',
          foreignField: 'registrationInfo.userId',
          as: 'registration'
        }
      },
      {'$lookup': {from: 'mlPortfolioDetails', localField: '_id', foreignField: 'userId', as: 'portfolio'}},
      {'$lookup': {from: 'mlTransactionsLog', localField: '_id', foreignField: 'userId', as: 'transactionLog'}},
      {
        '$project': {
          "registration": {
            '$map':
              {
                "input": "$registration", "as": "reg", 'in':
                {
                  "createdAt": "$$reg.registrationInfo.registrationDate",
                  "transactionId": "$$reg.transactionId",
                  "transactionType": "$$reg.registrationInfo.transactionType",
                  "cluster": '$$reg.registrationInfo.clusterName',
                  "chapter": '$$reg.registrationInfo.chapterName',
                  "community": '$$reg.registrationInfo.communityName',
                  "status": '$$reg.status'
                }
              }
          },
          "portfolio": {
            '$map':
              {
                "input": "$portfolio", "as": "port", 'in':
                {
                  "createdAt": "$$port.createdAt",
                  "transactionId": "$$port.transactionId",
                  "transactionType": "$$port.transactionType",
                  "cluster": '$$port.clusterName',
                  "chapter": '$$port.chapterName',
                  "community": '$$port.communityName',
                  "status": '$$port.status'
                }
              }
          },
          "transactionLog": {
            '$map':
              {
                "input": "$transactionLog", "as": "trans", 'in':
                {
                  "createdAt": "$$trans.createdAt",
                  "transactionId": "$$trans._id",
                  "transactionType": "$$trans.transactionTypeName",
                  "cluster": '$$trans.clusterName',
                  "chapter": '$$trans.chapterName',
                  "community": '$$trans.communityName',
                  "status": '$$trans.activity'
                }
              }
          },
        }
      },
      {'$project': {data: {"$concatArrays": ["$registration", "$portfolio", "$transactionLog"]}}},
      // {'$addFields': { 'data.totalRecords': { $size: "$data" } } },
      {"$unwind": "$data"},
      {"$replaceRoot": {newRoot: "$data"}}
    ];

    result = mlDBController.aggregate('users', pipeline, context);

    var data = result;
    var totalRecords = data.length;

    return {totalRecords: totalRecords, data: data};
  },

  MlAppointmentsRepo: function (requestParams, userFilterQuery, contextQuery, fieldsProj, context) {


    let piplelineQuery = [
      {'$match': userFilterQuery},
      {"$match": { $or: [{"transactionTypeId": "appointment"},{activity:"BeSpokeService-Created"}] }},
      {
        "$lookup": {
          from: "mlAppointments",
          localField: "docId",
          foreignField: "appointmentId",
          as: "scAppointment"
        }
      },
      {
        "$unwind": {
          path: "$scAppointment",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        "$lookup": {
          from: "mlPayment",
          localField: "docId",
          foreignField: "resourceId",
          as: "scOrder"
        }
      },
      {
        "$unwind": {
          path: "$scOrder",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        "$project": {
          "_id": "$_id",
          "appointmentId": "$docId",
          "createdBy": "$userName",
          "emailId": "$emailId",
          "source": "",
          "transactionType": "$activity",
          "cluster": "$clusterName",
          "chapter": "$chapterName",
          "subChapter": "$subChapterName",
          "community": "$communityName",
          "createdAt": "$createdAt",
          "status": {"$ifNull": ["$scOrder.status", "$scAppointment.status"]}
        }
      }
    ];


    if (fieldsProj.sort) {
      piplelineQuery.push({'$sort': fieldsProj.sort});
    } else {
      piplelineQuery.push({'$sort': {'createdAt': -1}});
    }
    if (fieldsProj.skip) {
      piplelineQuery.push({'$skip': parseInt(fieldsProj.skip)});
    }
    if (fieldsProj.limit) {
      piplelineQuery.push({'$limit': parseInt(fieldsProj.limit)});
    }
    let data = mlDBController.aggregate('MlTransactionsLog', piplelineQuery);
    if(data && data.length){
      data.map((obj)=>{
        if(obj.transactionType == 'BeSpokeService-Created' ){
          obj.status = 'Requested';
        }
      });
    }

    let totalRecords = mlDBController.find('MlTransactionsLog', {"transactionTypeId": "appointment"}).count();

    return {totalRecords: totalRecords, data: data};
  },
  /**
   * Returns the history records for modules by aggregation (lookup with related collections).
   * @param module(eg:REGISTRATION)
   * @param resultantQuery  complete query of serverQuery and userFilter
   * @param serverQuery  server query with context
   * @param userFilter  user filter query
   * @param userSpecificSearch true if user has searched/filtered the records.
   * returns result Object containing history records for modules by aggregation (lookup with related collections).
   */
  MlAuditHistorySearchResult: function (module, resultantQuery, serverQuery, userFilter, fieldsProj, context, userSpecificSearch) {
    var result = {resultsFetched: false, data: [], totalRecords: 0};
    var pipeline = [], foreignKeySearch = userSpecificSearch || false;
    var limitskipsort = [{'$sort': fieldsProj.sort}, {'$skip': fieldsProj.skip || 0}, {'$limit': fieldsProj.limit}];
    var searchQueryParam = {
      foriegnKeys: ['docRef'],
      lookupQuery: {'$lookup': {from: 'mlRegistration', localField: 'docId', foreignField: '_id', as: 'refRecord'}},
      unwindQuery: {'$unwind': {path: "$refRecord", preserveNullAndEmptyArrays: true}},
      projectQuery: {
        $project: {
          clusterId: 1,
          chapterId: 1,
          subChapterId: 1,
          communityId: 1,
          communityCode: 1,
          moduleName: 1,
          userAgent: 1,
          userId: 1,
          userName: 1,
          docId: 1,
          fieldName: 1,
          field: 1,
          currentValue: 1,
          previousValue: 1,
          timeStamp: 1,
          docRef: '$refRecord.transactionId'
        }
      }
    };
    switch (module) {
      case 'REGISTRATION':
        result.resultsFetched = true;
        break;
      case 'PORTFOLIO,PORTFOLIOLIBRARY':
        result.resultsFetched = true;
        searchQueryParam.lookupQuery = {
          $lookup: {
            from: 'mlPortfolioDetails',
            localField: 'docId',
            foreignField: '_id',
            as: 'refRecord'
          }
        };
        break;
    }
    if (result.resultsFetched === true) {
      pipeline = [{'$match': serverQuery}, searchQueryParam.lookupQuery, searchQueryParam.unwindQuery, searchQueryParam.projectQuery];
      if (foreignKeySearch) pipeline.push({'$match': resultantQuery});

      if (!foreignKeySearch) {//check if user has enabled(filter/search)
        result.totalRecords = mlDBController.find('MlAudit', resultantQuery, context, fieldsProj).count();
      } else {
        var counterQuery = _.clone(pipeline);
        counterQuery.push({$count: "totalRecords"})
        var totalRecordsCount = mlDBController.aggregate('MlAudit', counterQuery, context);
        result.totalRecords = totalRecordsCount && totalRecordsCount.length ? totalRecordsCount[0].totalRecords : 0;
      }

      pipeline = pipeline.concat(limitskipsort);

      result.data = mlDBController.aggregate('MlAudit', pipeline, context);
    }
    return result;
  }

}


export default CoreModulesRepo = CoreModules;


/********************************************functions <start>*********************************************************/

const createPipeline=(resultantQuery)=> {
  return pipeline = [
    {
      '$lookup':
        {
          from: 'mlCountries',
          localField: 'countryId',
          foreignField: '_id',
          as: 'clusters'
        }
    },
    { $unwind: { path: '$clusters', preserveNullAndEmptyArrays: true } },
    {
      '$redact': {
        '$cond': [
          {
            '$and': [
              { '$eq': [ "$clusters.isActive", true ] }
            ]
          },
          "$$KEEP",
          "$$PRUNE"
        ]
      }
    },
    {
      '$sort':{"countryName":1}
    },
    {
      '$match': resultantQuery
    }
  ];
};

/********************************************functions <end>***********************************************************/
