import async from 'async';
import each from 'async/each';
import _ from 'lodash';

var diff = require('deep-diff').diff;

import './mlModuleCollectionMap.js';
import MlAdminUserContext from "../mlAuthorization/mlAdminUserContext";

/**
 * @todo {*} uncomment the code onces the issue is been resolved of slowness
 */
// import {pushlogsByKafka} from '../commons/mlKafkaProducer'
//TODO: Drive the Audit Log through Audit Definition and configuration
const isAuditEnabled = Meteor.settings.private.isAuditEnabled;

class MlAuditLog {
  constructor() {
    this.contextRefNames.bind(this);
  }

  contextRefNames(contextData) {
    var contextData = contextData || {};
    if (contextData.clusterId && contextData.clusterId === "all") contextData['clusterName'] = 'all';
    if (contextData.clusterId && contextData.clusterId !== "all") {
      let clusterDetails = MlClusters.findOne({_id: contextData.clusterId}) || {};
      contextData['clusterName'] = clusterDetails.clusterName || null;
    }
    if (contextData.chapterId && contextData.chapterId && contextData.chapterId === "all") contextData['chapterName'] = 'all';
    if (contextData.chapterId && contextData.chapterId !== "all") {
      let chapterDetails = MlChapters.findOne({_id: contextData.chapterId}) || {};
      contextData['chapterName'] = chapterDetails.chapterName || null;
    }
    if (contextData.subChapterId && contextData.subChapterId === "all") contextData['subChapterName'] = 'all';
    if (contextData.subChapterId && contextData.subChapterId !== "all") {
      let subchapterDetails = MlSubChapters.findOne({_id: contextData.subChapterId}) || {};
      contextData['subChapterName'] = subchapterDetails.subChapterName || null;
    }
    if (contextData.communityId && contextData.communityId === "all") contextData['communityName'] = 'all';
    if (contextData.communityId && contextData.communityId !== "all") {
      let communityDetails = MlCommunity.findOne({_id: contextData.communityId}) || {};
      contextData['communityName'] = communityDetails.communityName || null;
    }
    return contextData;

  }

  /*
   * This method returns the context fields for audit log.
   * @param userId of logged In User
   * returns result Object containing context values({clusterId,chapterId,subChapterId,communityId,clusterName,chapterName,subChapterName,communityName})
   */
  contextData(userId) {
    var contextData = {};
    var user = Meteor.users.findOne({_id: userId});

    try {
      if (user && user.profile && user.profile.isInternaluser && user.profile.InternalUprofile) { //resolve internal user context based on default profile
        let details = new MlAdminUserContext().userProfileDetails(userId) || {};
        contextData = {
          clusterId: details.defaultProfileHierarchyRefId ? details.defaultProfileHierarchyRefId : null,
          chapterId: details.defaultChapters && details.defaultChapters[0] ? details.defaultChapters[0] : null,
          subChapterId: details.defaultSubChapters && details.defaultSubChapters[0] ? details.defaultSubChapters[0] : null,
          communityId: details.defaultCommunities && details.defaultCommunities[0] ? details.defaultCommunities[0].communityId : null,
          communityCode: details.defaultCommunities && details.defaultCommunities[0] ? details.defaultCommunities[0].communityCode : null

        };


      } else if (user && user.profile && user.profile.isExternaluser) { //resolve external user context based on default profile
        let externalUProfile = new MlAppUserContext(userId).userProfileDetails();
        contextData = {
          clusterId: externalUProfile.defaultCluster,
          chapterId: externalUProfile.defaultChapter,
          subChapterId: externalUProfile.defaultSubChapter,
          communityId: externalUProfile.defaultCommunity
        };

      } else {
        contextData = {};
      }
      //resolve reference names for context fields
      this.contextRefNames(contextData);
    } catch (e) {
      //log error for transaction context
    }
    return contextData;
  }


  insertAudit(auditParams, context) {
    if (!isAuditEnabled) {
      return;
    }
    let contextDetails = {}
    try {
      contextDetails = this.contextData(context.userId);
    } catch (e) {

    }
    let userAgent = {
      OS: '-',
      ipAddress: context.ip,
      browser: context.browser,
      deviceModel: "-",
      deviceType: "-",
      deviceVendor: "-"
    }

    let toInsert =
      {
        userId: context.userId,
        userName: Meteor.users.findOne({_id: context.userId}).username,
        collectionName: auditParams.collectionName,
        url: context.url,
        docId: auditParams.docId,
        action: '',
        field: '',
        previousValue: '',
        currentValue: '',
        userAgent: userAgent,
        timeStamp: new Date()
      }
    toInsert = _.extend(toInsert, contextDetails);

    auditParams.queryPayload = _.omit(auditParams.queryPayload, ['moduleName', 'actionName']);

    let oldValue = {};
    let newValue = auditParams.queryPayload;
    var differences = diff(oldValue, newValue);
    toInsert.moduleName = MlModuleCollectionMap[auditParams.collectionName];

    try {
      async.each(differences, function (say, callback) {
        toInsert.action = say.kind;
        if (_.head(say.path) == 0) {
          say.path.splice(0, 1);
        }

        let fieldPath = say.path;
        toInsert.field = _.join(say.path, '.');
        _.find(fieldPath, function (value, key) {
          if (_.isNumber(value)) {
            fieldPath.splice(key, 1);
          }
        })
        toInsert.fieldName = _.join(fieldPath, '.')

        toInsert.previousValue = JSON.stringify(say.lhs)
        toInsert.currentValue = JSON.stringify(say.rhs)
        MlAudit.insert(toInsert);

        // pushlogsByKafka(JSON.stringify(toInsert),'auditLogs');
      })
    } catch (err) {

      toInsert.errorReason = JSON.stringify("Error: " + err + ".");
      // pushlogsByKafka(JSON.stringify(toInsert),'auditLogs');
      MlAudit.insert(toInsert)
    }
    return true;
  }

  updateAudit(auditParams, context) {
    if (!isAuditEnabled) {
      return;
    }
    let contextDetails = {}
    try {
      contextDetails = this.contextData(context.userId);
    } catch (e) {

    }
    let userAgent = {
      OS: '-',
      ipAddress: context.ip,
      browser: context.browser,
      deviceModel: "-",
      deviceType: "-",
      deviceVendor: "-"
    }

    if (_.isObject(auditParams.docId)) {
      auditParams.docId = JSON.stringify(auditParams.docId)
    }
    let toInsert =
      {
        userId: context.userId,
        userName: Meteor.users.findOne({_id: context.userId}).username,
        collectionName: auditParams.collectionName,
        url: context.url,
        docId: auditParams.docId,
        action: '',
        field: '',
        previousValue: '',
        currentValue: '',
        userAgent: userAgent,
        timeStamp: new Date()
      }
    toInsert = _.extend(toInsert, contextDetails);

    args = _.omit(auditParams.queryPayload, ['moduleName', 'actionName']);
    let oldValue = auditParams.oldValue;
    let newValue = auditParams.newValue;
    var differences = diff(oldValue, newValue);
    toInsert.moduleName = MlModuleCollectionMap[auditParams.collectionName];

    try {
      async.each(differences, function (say, callback) {
        toInsert.action = say.kind;
        if (_.head(say.path) == 0) {
          say.path.splice(0, 1);
        }

        let fieldPath = say.path;
        toInsert.field = _.join(say.path, '.');
        _.find(fieldPath, function (value, key) {
          if (_.isNumber(value)) {
            fieldPath.splice(key, 1);
          }
        })
        toInsert.fieldName = _.join(fieldPath, '.')

        if (say.lhs || say.rhs) {
          toInsert.previousValue = JSON.stringify(say.lhs)
          toInsert.currentValue = JSON.stringify(say.rhs)
        } else {
          if (say.item) {
            if (say.item.kind) {
              toInsert.previousValue = JSON.stringify(say.item.lhs)
              toInsert.currentValue = JSON.stringify(say.item.rhs)
            }
          }
        }
        MlAudit.insert(toInsert);
        // pushlogsByKafka(JSON.stringify(toInsert),'auditLogs');
      })
    } catch (err) {
      toInsert.errorReason = JSON.stringify("Error: " + err + ".")
      MlAudit.insert(toInsert)
      // pushlogsByKafka(JSON.stringify(toInsert),'auditLogs');
    }

    return true;
  }

}

module.exports = MlAuditLog
