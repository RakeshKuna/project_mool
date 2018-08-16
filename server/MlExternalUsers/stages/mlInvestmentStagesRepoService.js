/**
 * Created by mohammed.mohasin on 19/08/17.
 */

class MlInvestmentsStageRepoService{

  constructor(){
    if(! MlInvestmentsStageRepoService.instance){
      MlInvestmentsStageRepoService.instance = this;
    }
    return MlInvestmentsStageRepoService.instance;
  }

  canViewCompletePortfolio(contextUserId,portfolioId){
    var canView=false;
    var investmentDetails =mlDBController.findOne('MlStage',
         {userId:contextUserId,"resourceType" : "portfolio",
           "resourceId" :portfolioId,"resourceStage" : "onboard",
           "onBoardStatus":"accept"}, {})||{};

    if(investmentDetails&&investmentDetails.onBoardStatus==="accept"){ canView=true;};
    return canView;
  }



}
const mlInvestmentStagesRepoService = new MlInvestmentsStageRepoService();
Object.freeze(mlInvestmentStagesRepoService);

export default mlInvestmentStagesRepoService;

