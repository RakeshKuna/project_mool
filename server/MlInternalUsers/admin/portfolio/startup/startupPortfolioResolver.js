import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import MlEmailNotification from "../../../../mlNotifications/mlEmailNotifications/mlEMailNotification";
import MlAlertNotification from '../../../../mlNotifications/mlAlertNotifications/mlAlertNotification'
import MlNotificationController from '../../../../mlNotifications/mlAppNotifications/mlNotificationsController'
import portfolioValidationRepo from '../portfolioValidation'

var _ = require('lodash')
var extendify = require('extendify');
var _ = require('lodash')

MlResolver.MlMutationResolver['createStartupPortfolio'] = (obj, args, context, info) => {
  try {
    if (args && args.userId && args.communityType) {
      var user = MlStartupPortfolio.findOne({"$and": [{'userId': args.userId}, {'communityId': args.communityType}]})
      if (!user) {
        mlDBController.insert('MlStartupPortfolio', {
          userId: args.userId,
          communityType: args.communityType,
          portfolioDetailsId: args.portfolioDetailsId
        }, context)
        // MlStartupPortfolio.insert({
        //   userId: args.userId,
        //   communityType: args.communityType,
        //   portfolioDetailsId: args.portfolioDetailsId
        // })
      }
    }
  } catch (e) {
    console.log("Error: In creating Startup portfolio");
  }
}
MlResolver.MlMutationResolver['updateStartupPortfolio'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    try {
      let startupPortfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
      let updateFor = args.portfolio.startupPortfolio;
      if (startupPortfolio) {
        for (key in updateFor) {
          if (startupPortfolio.hasOwnProperty(key)) {
            if (_.isArray(updateFor[key]) && _.isArray(startupPortfolio[key])) {
              startupPortfolio[key] = updateArrayofObjects(updateFor[key], startupPortfolio[key])
            }
            else if (_.isObject(updateFor[key]) && _.isObject(startupPortfolio[key])) {
              _.mergeWith(startupPortfolio[key], updateFor[key], function (objValue, srcValue) {
                if (_.isArray(objValue)) {
                  return objValue.concat(srcValue);
                }
              });
            }
          }
          else {
            startupPortfolio[key] = updateFor[key]
          }
        }

        // let ret = MlStartupPortfolio.update({"portfolioDetailsId": args.portfoliodetailsId}, {$set: startupPortfolio})
        let ret = mlDBController.update('MlStartupPortfolio', {"portfolioDetailsId": args.portfoliodetailsId}, startupPortfolio, {$set: true}, context)
        if (ret) {
          // let details = MlPortfolioDetails.findOne({"_id":args.portfoliodetailsId})
          // MlEmailNotification.onPortfolioUpdate(details);
          // MlNotificationController.onPotfolioUpdate(details);
          let startupalert = MlAlertNotification.onPortfolioUpdates()
          let code = 200;
          let response = new MlRespPayload().successPayload(startupalert, code);
          return response;
        }
      }
      else {
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


// MlResolver.MlQueryResolver['fetchStartupPortfolioManagement'] = (obj, args, context, info) => {
//   if (args.portfoliodetailsId) {
//     let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
//     if (portfolio && portfolio.hasOwnProperty('management')) {
//       return portfolio['management'];
//     }
//   }
//
//   return [];
// }

/**
 * Details of all Startup aboutUs Internal Tabs
 * */
MlResolver.MlQueryResolver['fetchStartupPortfolioAboutUs'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let startAboutUsArray = {}
    let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    startAboutUsArray["aboutUs"] = portfolio && portfolio.aboutUs ? portfolio.aboutUs : {};
    startAboutUsArray["clients"] = portfolio && portfolio.clients ? portfolio.clients : [];
    startAboutUsArray["serviceProducts"] = portfolio && portfolio.serviceProducts ? portfolio.serviceProducts : {};
    startAboutUsArray["information"] = portfolio && portfolio.information ? portfolio.information : {};
    startAboutUsArray["branches"] = portfolio && portfolio.branches ? portfolio.branches : [];
    startAboutUsArray["technologies"] = portfolio && portfolio.technologies ? portfolio.technologies : [];
    startAboutUsArray["legalIssue"] = portfolio && portfolio.legalIssue ? portfolio.legalIssue : {};
    startAboutUsArray["rating"] = portfolio && portfolio.rating ? portfolio.rating : [];
    startAboutUsArray["assets"] = portfolio && portfolio.assets ? portfolio.assets : [];

    var object = startAboutUsArray["aboutUs"];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, "aboutUs");
    startAboutUsArray["aboutUs"] = filteredObject

    let objectRating = startAboutUsArray["rating"];
    let filteredObjectRating = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, objectRating, context, "rating");
    startAboutUsArray["rating"] = filteredObjectRating;

    //private keys for service products
    var object = startAboutUsArray["serviceProducts"];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, "serviceProducts");
    startAboutUsArray["serviceProducts"] = filteredObject

    //private keys for service products
    var object = startAboutUsArray["legalIssue"];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, "legalIssue");
    startAboutUsArray["legalIssue"] = filteredObject


    //private keys for service products
    var object = startAboutUsArray["information"];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, "information");
    startAboutUsArray["information"] = filteredObject

    var object = startAboutUsArray["clients"];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, "clients");
    startAboutUsArray["clients"] = filteredObject

    var object = startAboutUsArray["branches"];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, "branches");
    startAboutUsArray["branches"] = filteredObject

    var object = startAboutUsArray["technologies"];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, "technologies");
    startAboutUsArray["technologies"] = filteredObject

    var object = startAboutUsArray["assets"];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, "assets");
    startAboutUsArray["assets"] = filteredObject

    if (startAboutUsArray && startAboutUsArray.assets) {
      startAboutUsArray.assets.map(function (asset, index) {
        if (startAboutUsArray.assets[index]) {
          let assetData = MlAssets.findOne({"_id": asset.assetTypeId}) || "";
          startAboutUsArray.assets[index].assetTypeName = assetData.displayName || "";
        }

      })
    }
    if (startAboutUsArray && startAboutUsArray.technologies) {
      startAboutUsArray.technologies.map(function (technology, index) {
        if (startAboutUsArray.technologies[index]) {
          let technologyData = MlTechnologies.findOne({"_id": technology.technologyId}) || "";
          startAboutUsArray.technologies[index].technologyName = technologyData.displayName || "";
        }

      })
    }

    //for view action
    MlResolver.MlMutationResolver['createView'](obj, {
      resourceId: args.portfoliodetailsId,
      resourceType: 'portfolio'
    }, context, info);

    if (startAboutUsArray) {
      return startAboutUsArray
    }

  }

  return {};
}

MlResolver.MlQueryResolver['fetchStartupPortfolioInvestor'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (portfolio && portfolio.hasOwnProperty('investor')) {
      return portfolio['investor'];
    }
  }

  return [];
}
MlResolver.MlQueryResolver['fetchStartupPortfolioLookingFor'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (portfolio && portfolio.hasOwnProperty('lookingFor')) {
      if (portfolio && portfolio['lookingFor']) {
        portfolio.lookingFor.map(function (lookingFor, index) {
          if (portfolio.lookingFor[index]) {
            let lookingForData = MlLookingFor.findOne({"_id": lookingFor.typeId}) || {};
            portfolio.lookingFor[index].lookingForName = lookingForData.lookingForDisplayName || "";
          }

        })
      }
      return portfolio['lookingFor'];
    }
  }

  return [];
}

MlResolver.MlQueryResolver['fetchStartupPortfolioAwards'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (portfolio && portfolio.hasOwnProperty('awardsRecognition')) {
      if (portfolio && portfolio['awardsRecognition']) {
        portfolio.awardsRecognition.map(function (awards, index) {
          if (portfolio.awardsRecognition[index]) {
            let awardData = MlAwards.findOne({"_id": awards.awardId}) || {};
            portfolio.awardsRecognition[index].awardName = awardData.awardDisplayName || "";
          }

        })
      }
      return portfolio['awardsRecognition'];
    }
  }

  return [];
}
MlResolver.MlQueryResolver['fetchStartupPortfolioMemberships'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (portfolio && portfolio.hasOwnProperty('memberships')) {
      return portfolio['memberships'];
    }
  }

  return {};
}
MlResolver.MlQueryResolver['fetchStartupPortfolioCompliances'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (portfolio && portfolio.hasOwnProperty('compliances')) {
      return portfolio['compliances'];
    }
  }

  return {};
}
MlResolver.MlQueryResolver['fetchStartupPortfolioLicenses'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (portfolio && portfolio.hasOwnProperty('licenses')) {
      return portfolio['licenses'];
    }
  }

  return {};
}


MlResolver.MlQueryResolver['fetchStartupPortfolioData'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (portfolio && portfolio.hasOwnProperty('data')) {
      return portfolio['data'];
    }
  }
  return {};
}


MlResolver.MlQueryResolver['fetchStartupPortfolioCharts'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let startChartsArray = {}
    let portfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    let employeesData = portfolio && portfolio.employmentOfCompanyChart ? portfolio.employmentOfCompanyChart : [];
    startChartsArray["employmentOfCompanyChart"] = _.sortBy(employeesData, function (item) {
      if (item && item.eofFromYear) return item.eofFromYear;
    })
    let profitRevenu = portfolio && portfolio.profitRevenueLiabilityChart ? portfolio.profitRevenueLiabilityChart : [];
    startChartsArray["profitRevenueLiabilityChart"] = _.sortBy(profitRevenu, function (item) {
      if (item && item.prlFromYear) return item.prlFromYear;
    })
    let reviewData = portfolio && portfolio.reviewOfCompanyChart ? portfolio.reviewOfCompanyChart : [];
    startChartsArray["reviewOfCompanyChart"] = _.sortBy(reviewData, function (item) {
      if (item && item.rofYear) return item.rofYear;
    })
    startChartsArray["employeeBreakupDepartmentChart"] = portfolio && portfolio.employeeBreakupDepartmentChart ? portfolio.employeeBreakupDepartmentChart : [];
    if (startChartsArray && startChartsArray.employeeBreakupDepartmentChart) {
      startChartsArray.employeeBreakupDepartmentChart.map(function (data, index) {
        if (startChartsArray.employeeBreakupDepartmentChart[index]) {
          let entityData = MlDepartments.findOne({"_id": data.ebdDepartment}) || {};
          startChartsArray.employeeBreakupDepartmentChart[index].ebdDepartmentName = entityData.displayName || "";
        }

      })
    }
    if (startChartsArray) {
      return startChartsArray
    }
  }
}

MlResolver.MlQueryResolver['fetchStartupDetails'] = (obj, args, context, info) => {
  if (_.isEmpty(args))
    return;

  var key = args.key;
  var portfoliodetailsId = args.portfoliodetailsId
  var startupPortfolio = MlStartupPortfolio.findOne({"portfolioDetailsId": portfoliodetailsId})
  if (startupPortfolio && startupPortfolio.hasOwnProperty(key)) {
    var object = startupPortfolio[key];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, key);
    startupPortfolio[key] = filteredObject
    return startupPortfolio;
  }

  return;
}


updateArrayofObjects = (updateFor, source) => {
  if (_.isArray(updateFor) && _.isArray(source)) {
    _.each(updateFor, function (obj) {
      let isObj = _.find(source, {index: obj.index})
      let itemIndex = _.findIndex(source, {index: obj.index})
      if (isObj && itemIndex >= 0) {
        _.mergeWith(source[itemIndex], obj)
      }
      else {
        source.push(obj)
      }
    })
  }
  return source;
}
