import MlResolver from '../../../commons/mlResolverDef'
import MlRespPayload from '../../../commons/mlPayload'
import MlUserContext from '../../../MlExternalUsers/mlUserContext'
var extendify = require('extendify');
var _ = require('lodash')

MlResolver.MlQueryResolver['fetchIdeators'] = (obj, args, context, info) => {
  var allIds = [];
  var ideator =[];

  var allIdeas = MlIdeas.find({isActive:true}).fetch();
  allIds = _.map(allIdeas, "userId");
  allIds = _.uniq(allIds);

  _.each(allIds, function (userId) {
    let portfolios = MlPortfolioDetails.find({userId:userId, status: 'PORT_LIVE_NOW'}).fetch();    //checking portfolio is gone live or not
    var ideasArr = [];
    if(!_.isEmpty(portfolios)){                                                                // checking portfolio is there or not
      _.each(portfolios, function (portfolio) {
        // let ideas = MlIdeas.find({userId:userId}).fetch();
        ideas = MlIdeas.findOne({portfolioId:portfolio._id}) || {};
        ideasArr.push(ideas);
      })
      let user = Meteor.users.findOne({_id:userId});
      let ideaObj = {
        userId:userId,
        ideas:ideasArr,
        chapterName:portfolios[0].chapterName,
        name:user.profile.firstName+" "+user.profile.lastName,
        accountType:portfolios[0].accountType
      }
      ideator.push(ideaObj)
    }
  })

  return ideator;
}

MlResolver.MlQueryResolver['fetchIdeaByPortfolioId'] = (obj, args, context, info) => {
  if(args.portfolioId){
    let idea = MlIdeas.findOne({portfolioId:args.portfolioId})
    return idea;
  }
  return {};
}
