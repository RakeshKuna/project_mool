/**
 * Created by venkatsrinag on 15/6/17.
 */

import _ from 'lodash'
import MlInvestmentsStageRepoService from '../../../MlExternalUsers/stages/mlInvestmentStagesRepoService';
import MlUserContext from '../../../MlExternalUsers/mlUserContext'
import mlSmsController from '../../../mlNotifications/mlSmsNotifications/mlSmsController'


class portfolioValidation {
  constructor() {

  }

  /**
   * allowPrivateFields checks for conditions to restrict the fields for portfolio
   * Returns Boolean for restricting the fields
   **/
  static allowPrivateFields(portfolioDetails, context) {
    var allowPrivateFields = false;
    var user = mlDBController.findOne('users', {"_id": (context || {}).userId}, context) || {};
    var portfolioDetailsId = (portfolioDetails || {})._id;

    /** actual private fields condition : true if Internal User or if its portfolio owner*/
    if ((user && user.profile && user.profile.isInternaluser) || (user._id === (portfolioDetails || {}).userId)) {
      allowPrivateFields = true;
      return true;
    }

    /** check for user onBoard condition and restrict the private fields*/
    allowPrivateFields = MlInvestmentsStageRepoService.canViewCompletePortfolio((context || {}).userId, portfolioDetailsId) || false;
    return allowPrivateFields;
  }

  /**
   *
   * @param {*} portfolioDetailsId
   * @param {*} object "data to be checked"
   * @param {*} context "login user context"
   * @param {*} tabName "for which data to be filtered"
   */
  omitPrivateDetails(portfolioDetailsId, object, context, tabName) {
    let portfolioDetails = MlPortfolioDetails.findOne(portfolioDetailsId) || {};
    //Pre Condition for restricting the private fields.
    const allowPrivateFields = portfolioValidation.allowPrivateFields(portfolioDetails, context);
    // var privateFields = portfolioDetails.privateFields
    const privateFields = _.filter(portfolioDetails.privateFields, {tabName: tabName});
    let omittedFields = [];

    /**
     * for tabs containing array or multiple objects
     */
    if (!_.isArray(object)) {
      // for tabs with simple objects [code can be written in this]
    } else {
      _.each(object, function (item, index) {
        var omittedfields = []
        _.each(privateFields, function (privateField) {
          if ((item[privateField.keyName] != undefined || ((_.isEmpty(item[privateField.objectName]) == false && item[privateField.objectName][privateField.keyName] != undefined))) && privateField.index == index) {
            // if(privateField.tabName === tabName){
            if (!allowPrivateFields) {
              delete item[privateField.keyName]
            }
            // }
            const privateFieldObject = _.find(privateFields, {keyName: privateField.keyName})
            // var privateFieldObject = _.find(privateFields, {keyName: privateField.keyName, tabName: privateField.tabName});
            omittedfields.push(privateFieldObject)
          }
        })
        item.privateFields = _.cloneDeep(omittedfields);
      })
      if (!allowPrivateFields) {
        _.remove(object, {makePrivate: true})
      }
      return object;
    }

    /**
     * for tabs with simple objects
     */
    _.each(privateFields, function (privateField) {
      if (
        object[privateField.keyName] !== undefined ||
        (_.isEmpty(object[privateField.objectName]) === false &&
          object[privateField.objectName][privateField.keyName] !== undefined
        )
      ) {
        // if (privateField.tabName === tabName) {
        if (!allowPrivateFields) {
          if (object[privateField.keyName])
            delete object[privateField.keyName]
          else
            delete object[privateField.objectName][privateField.keyName]
        }
        // }
        // var privateFieldObject = _.find(privateFields, { keyName: privateField.keyName, tabName: tabName });      //filtering only the required tab keys
        const privateFieldObject = _.find(privateFields, {keyName: privateField.keyName});
        if (privateFieldObject)
          omittedFields.push(privateFieldObject)
      }
    });
    object.privateFields = _.cloneDeep(omittedFields);
    return object;
  }

  updatePrivateKeys(privateKeyArray, removeArray, dbArray) {
    if ((removeArray.length == 0 && dbArray.length == 0) && (removeArray.length > 0 && dbArray.length == 0)) {
      return privateKeyArray;
    }

    if (removeArray.length > 0 && dbArray.length > 0) {
      _.each(removeArray, function (item) {
        var index = _.find(dbArray, {keyName: item.keyName})
        if (index)
          _.remove(dbArray, {keyName: index.keyName});
      })
    }

    var concat = _.concat(dbArray, privateKeyArray);

    return concat
  }

  // sendSMSforPortfolio(portfolioDetailsId, msg){
  //   var portfolioDetails = MlPortfolioDetails.findOne(portfolioDetailsId) || {};
  //   if(portfolioDetails){
  //     var countryCode = MlClusters.findOne(portfolioDetails.clusterId);
  //     var defaultProfile = new MlUserContext().userProfileDetails(portfolioDetails.userId)
  //     if(countryCode && defaultProfile){
  //       var mobileNumber = defaultProfile.mobileNumber
  //       mlSmsController.sendSMS(msg, countryCode, mobileNumber)
  //     }
  //   }
  // }

  getLivePortfolioCount(clusterId, chapterId, subChapterId) {
    return mlDBController.aggregate('MlPortfolioDetails', [
      {
        "$lookup": {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        }
      },
      {"$unwind": {path: '$user', preserveNullAndEmptyArrays: true}},
      {"$match": {'user.profile.isExternaluser': true, 'user.profile.isActive': true}},
      {
        "$unwind": {
          "path": "$user.profile.externalUserProfiles",
          "preserveNullAndEmptyArrays": true
        }
      },
      {
        "$redact": {
          "$cond": [
            {
              "$and": [
                {"$eq": ["$user.profile.externalUserProfiles.communityDefCode", "$communityCode"]},
                {"$eq": ["$user.profile.externalUserProfiles.profileId", "$profileId"]},
                {"$eq": ["$user.profile.externalUserProfiles.isApprove", true]},
                {"$eq": ["$user.profile.externalUserProfiles.isActive", true]},
              ]
            },
            "$$KEEP",
            "$$PRUNE"
          ]
        }
      },
      {
        "$group": {
          _id: "$communityCode",
          "communityType": {$first: "$communityType"},
          "count": {
            $sum: {
              "$cond": [
                {
                  "$and": [
                    {"$eq": ["$status", "PORT_LIVE_NOW"]},
                    {"$eq": ["$clusterId", clusterId]},
                    {"$eq": ["$chapterId", chapterId]},
                    {"$eq": ["$subChapterId", subChapterId]},
                  ]
                }, 1, 0],
            }
          }
        }
      },
      {
        "$lookup": {from: "mlCommunityDefinition", localField: "_id", foreignField: "code", as: "imageLink"}
      },
      {"$unwind": "$imageLink"},
      {
        $project: {
          "communityType": 1,
          "count": 1,
          "communityImageLink": '$imageLink.communityImageLink'
        }
      }
    ])
  }
}

const portfolioValidationRepo = new portfolioValidation();
Object.freeze(portfolioValidationRepo);

export default portfolioValidationRepo;
