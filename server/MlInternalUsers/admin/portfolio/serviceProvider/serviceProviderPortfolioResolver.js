/**
 * Created by vishwadeep on 10/7/17.
 */
import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import MlEmailNotification from "../../../../mlNotifications/mlEmailNotifications/mlEMailNotification";
import MlAlertNotification from "../../../../mlNotifications/mlAlertNotifications/mlAlertNotification";
import MlNotificationController from '../../../../mlNotifications/mlAppNotifications/mlNotificationsController'
// import _ from "lodash";
var _ = require('lodash')
// import MlUserContext from "../../../../MlExternalUsers/mlUserContext";
// import MlAdminUserContext from "../../../../mlAuthorization/mlAdminUserContext";
import portfolioValidationRepo from '../portfolioValidation'

MlResolver.MlMutationResolver['createServiceProviderPortfolio'] = (obj, args, context, info) => {
  try {
    if (args && args.userId && args.communityType) {
      user = MlServiceProviderPortfolio.findOne({"$and": [{'userId': args.userId}, {'communityId': args.communityType}]})
      if (!user) {
        mlDBController.insert('MlServiceProviderPortfolio', {
          userId: args.userId,
          communityType: args.communityType,
          portfolioDetailsId: args.portfolioDetailsId
        }, context)
      }
    }
  } catch (e) {
    console.log("Error: In creating service provider portfolio");
  }
}

MlResolver.MlMutationResolver['updateServiceProviderPortfolio'] = (obj, args, context, info) =>
{
  if (args.portfoliodetailsId){
    try {
      let serviceProviderPortfolio = MlServiceProviderPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
      let updateFor = args.portfolio.serviceProviderPortfolio;
      if (serviceProviderPortfolio){
        for (key in updateFor){
          if (serviceProviderPortfolio.hasOwnProperty(key)){
            if(_.isArray(updateFor[key]) && _.isArray(serviceProviderPortfolio[key])){
              serviceProviderPortfolio[key] = updateArrayofObjects(updateFor[key], serviceProviderPortfolio[key])
            }
            else if(_.isObject(updateFor[key]) && _.isObject(serviceProviderPortfolio[key]))
            {
              _.mergeWith(serviceProviderPortfolio[key], updateFor[key], function (objValue, srcValue) {
                if (_.isArray(objValue)) {
                  return objValue.concat(srcValue);
                }
              });
            }
          }
          else{
            serviceProviderPortfolio[key] = updateFor[key]
          }
        }

        let ret = mlDBController.update('MlServiceProviderPortfolio', {"portfolioDetailsId": args.portfoliodetailsId}, serviceProviderPortfolio, {$set: true}, context)
        if (ret) {
          // let details = MlPortfolioDetails.findOne({"_id":args.portfoliodetailsId})
          // MlEmailNotification.onPortfolioUpdate(details);
          // MlNotificationController.onPotfolioUpdate(details);
          let serviceprovideralert =  MlAlertNotification.onPortfolioUpdates()
          let code = 200;
          let response = new MlRespPayload().successPayload(serviceprovideralert, code);
          return response;
        }
      }
      else{
        let code = 400;
        let response = new MlRespPayload().errorPayload("Invalid portfolio request", code);
        return response;
      }
    }
    catch (e) {
      let code = 400;
      let response = new MlRespPayload().errorPayload(e.message, code);
      return response;
    }
  }
}

MlResolver.MlQueryResolver['fetchServiceProviderDetails'] = (obj, args, context, info) => {
  if(_.isEmpty(args))
    return;
  var key = args.key;
  var serviceProviderPortfolio = MlServiceProviderPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
  if (serviceProviderPortfolio && serviceProviderPortfolio.hasOwnProperty(key)) {
    var object = serviceProviderPortfolio[key];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, key);
    serviceProviderPortfolio[key] = filteredObject
    return serviceProviderPortfolio;
  }
}

updateArrayofObjects = (updateFor, source) =>{
  if(_.isArray(updateFor) && _.isArray(source)){
    _.each(updateFor, function (obj) {
      let isObj = _.find(source, {index:obj.index})
      let itemIndex = _.findIndex(source, {index:obj.index})
      if(isObj &&  itemIndex >= 0){
        _.mergeWith(source[itemIndex], obj)
      }
      else{
        source.push(obj)
      }
    })
  }
  return source;
}
