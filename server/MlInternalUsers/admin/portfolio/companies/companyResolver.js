import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import portfolioValidationRepo from '../portfolioValidation'
import MlEmailNotification from "../../../../mlNotifications/mlEmailNotifications/mlEMailNotification";
import MlAlertNotification from '../../../../mlNotifications/mlAlertNotifications/mlAlertNotification'
import MlNotificationController from '../../../../mlNotifications/mlAppNotifications/mlNotificationsController'

var _ = require('lodash')


MlResolver.MlMutationResolver['createCompanyPortfolio'] = (obj, args, context, info) => {
  try {
    if (args && args.userId && args.communityType) {
      user = MlCompanyPortfolio.findOne({"$and": [{'userId': args.userId}, {'communityId': args.communityType}]})
      if (!user) {
        mlDBController.insert('MlCompanyPortfolio', {
          userId: args.userId,
          communityType: args.communityType,
          portfolioDetailsId: args.portfolioDetailsId,
        }, context)
      }
    }
  } catch (e) {
    console.log("Error: In creating company portfolio");
  }
}

MlResolver.MlMutationResolver['updateCompanyPortfolio'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    try {
      let companyPortfolio = MlCompanyPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
      let updateFor = args.portfolio.companyPortfolio;
      if (companyPortfolio) {
        for (key in updateFor) {
          if (companyPortfolio.hasOwnProperty(key)) {
            if (_.isArray(updateFor[key]) && _.isArray(companyPortfolio[key])) {
              companyPortfolio[key] = updateArrayofObjects(updateFor[key], companyPortfolio[key])
            }
            else if (_.isObject(updateFor[key]) && _.isObject(companyPortfolio[key])) {
              _.mergeWith(companyPortfolio[key], updateFor[key], function (objValue, srcValue) {
                if (_.isArray(objValue)) {
                  return objValue.concat(srcValue);
                }
              });
            }
          }
          else {
            companyPortfolio[key] = updateFor[key]
          }
        }

        // let ret = MlStartupPortfolio.update({"portfolioDetailsId": args.portfoliodetailsId}, {$set: startupPortfolio})
        let ret = mlDBController.update('MlCompanyPortfolio', {"portfolioDetailsId": args.portfoliodetailsId}, companyPortfolio, {$set: true}, context)
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

MlResolver.MlQueryResolver['fetchCompanyDetails'] = (obj, args, context, info) => {
  if (_.isEmpty(args))
    return;

  var key = args.key;
  var portfoliodetailsId = args.portfoliodetailsId
  var companyPortfolio = MlCompanyPortfolio.findOne({"portfolioDetailsId": portfoliodetailsId})
  if (companyPortfolio && companyPortfolio.hasOwnProperty(key)) {
    var object = companyPortfolio[key];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, key);
    companyPortfolio[key] = filteredObject
    return companyPortfolio;
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

MlResolver.MlQueryResolver['fetchCompanyPortfolioData'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlCompanyPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (portfolio && portfolio.hasOwnProperty('data')) {
      return portfolio['data'];
    }
  }
  return {};
}


MlResolver.MlQueryResolver['fetchCompanyPortfolioCharts'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let companyChartsArray = {}
    let portfolio = MlCompanyPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    let employeesData = portfolio && portfolio.employmentOfCompanyChart ? portfolio.employmentOfCompanyChart : [];
    let profitRevenu = portfolio && portfolio.profitRevenueLiabilityChart ? portfolio.profitRevenueLiabilityChart : [];
    let reviewData = portfolio && portfolio.reviewOfCompanyChart ? portfolio.reviewOfCompanyChart : [];
    companyChartsArray["employmentOfCompanyChart"] = _.sortBy(employeesData, function (item) {
      if (item && item.eofFromYear) return item.eofFromYear;
    })
    companyChartsArray["profitRevenueLiabilityChart"] = _.sortBy(profitRevenu, function (item) {
      if (item && item.prlFromYear) return item.prlFromYear;
    })
    companyChartsArray["reviewOfCompanyChart"] = _.sortBy(reviewData, function (item) {
      if (item && item.rofYear) return item.rofYear;
    })
    companyChartsArray["employeeBreakupDepartmentChart"] = portfolio && portfolio.employeeBreakupDepartmentChart ? portfolio.employeeBreakupDepartmentChart : [];
    if (companyChartsArray && companyChartsArray.employeeBreakupDepartmentChart) {
      companyChartsArray.employeeBreakupDepartmentChart.map(function (data, index) {
        if (companyChartsArray.employeeBreakupDepartmentChart[index]) {
          let entityData = MlDepartments.findOne({"_id": data.ebdDepartment}) || {};
          companyChartsArray.employeeBreakupDepartmentChart[index].ebdDepartmentName = entityData.displayName || "";
        }

      })
    }
    if (companyChartsArray) {
      return companyChartsArray
    }
  }
}

MlResolver.MlQueryResolver['fetchCompanyPortfolioAboutUs'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let companyAboutUsArray = {}
    let portfolio = MlCompanyPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    companyAboutUsArray["aboutUs"] = portfolio && portfolio.aboutUs ? portfolio.aboutUs : {};
    companyAboutUsArray["clients"] = portfolio && portfolio.clients ? portfolio.clients : [];
    companyAboutUsArray["serviceProducts"] = portfolio && portfolio.serviceProducts ? portfolio.serviceProducts : {};
    companyAboutUsArray["information"] = portfolio && portfolio.information ? portfolio.information : {};
    companyAboutUsArray["rating"] = portfolio && portfolio.rating ? portfolio.rating : {};

    //private keys for service products
    var object = companyAboutUsArray["serviceProducts"];
    var filteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, object, context, "serviceProducts")
    companyAboutUsArray["serviceProducts"] = filteredObject;

    var aboutUsObject = companyAboutUsArray["aboutUs"];
    var aboutUsFilteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, aboutUsObject, context, "aboutUs")
    companyAboutUsArray["aboutUs"] = aboutUsFilteredObject;

    var infoObject = companyAboutUsArray["information"];
    var infoFilteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, infoObject, context, "information");
    companyAboutUsArray["information"] = infoFilteredObject;

    let objectRating = companyAboutUsArray["rating"];
    const ratingFilteredObject = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, objectRating, context, "rating")
    companyAboutUsArray["rating"] = ratingFilteredObject;

    if (companyAboutUsArray && companyAboutUsArray.clients) {
      companyAboutUsArray.clients = portfolioValidationRepo.omitPrivateDetails(args.portfoliodetailsId, companyAboutUsArray.clients, context, "clients");
      companyAboutUsArray.clients.map(function (client, index) {
        let clientData = MlStageOfCompany.findOne({"_id": client.companyId}) || {};
        if (companyAboutUsArray.clients[index]) {
          companyAboutUsArray.clients[index].companyName = clientData.stageOfCompanyDisplayName || "";
        }
      })
    }
    //for view action
    MlResolver.MlMutationResolver['createView'](obj, {
      resourceId: args.portfoliodetailsId,
      resourceType: 'portfolio'
    }, context, info);

    if (companyAboutUsArray) {
      return companyAboutUsArray
    }

  }

  return {};
}
MlResolver.MlQueryResolver['fetchCompanyPortfolioCSRReports'] = (obj, args, context, info) => {
  if (args.portfoliodetailsId) {
    let portfolio = MlCompanyPortfolio.findOne({"portfolioDetailsId": args.portfoliodetailsId})
    if (portfolio && portfolio.hasOwnProperty('reports')) {
      return portfolio['reports'];
    }
  }
  return {};
}
