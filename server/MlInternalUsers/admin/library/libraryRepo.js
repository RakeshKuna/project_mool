
//import MlUserContext from '../mlUserContext'
import MlRespPayload from '../../../commons/mlPayload'
//import _ from 'lodash'

//import moment from "moment";
//import MlTransactionsHandler from '../../commons/mlTransactionsLog';


class MlLibraryRepo {
  constructor() {
  }

  portfolioLibraryCreation(libraryData,portfolioDetailsId, context) {
    let portfolioContainer = [];
      let portfolioUserId = mlDBController.findOne('MlPortfolioDetails', portfolioDetailsId, context).userId;
      let portfolioInfo = {
        portfolioId: portfolioDetailsId,
        isPrivate: portfolioUserId !== context.userId ? false : true
      };
      portfolioContainer.push(portfolioInfo)
      libraryData.portfolioReference = portfolioContainer;
      libraryData.userId = portfolioUserId === context.userId ? context.userId : portfolioUserId;
      var fileExistCheck = mlDBController.find('MlLibrary', {'portfolioReference.portfolioId': portfolioDetailsId, 'libraryType':libraryData.libraryType}, context).fetch();
      let doesFileExist = false;
      fileExistCheck.map(function(data){
      if(data.fileName === libraryData.fileName) doesFileExist = true;
    })
      if(!doesFileExist){
        let newPortfolio = mlDBController.insert('MlLibrary', libraryData, context)
        newPortfolio = newPortfolio ?  new MlRespPayload().successPayload("File uploaded successfully", 200) : new MlRespPayload().errorPayload("Failed to upload the file", 400);
        return newPortfolio;
      } else {
        return new MlRespPayload().errorPayload("File with the same file name already exists in your portfolio library", 400);
      }
  }
}

const mlLibraryRepo  = new MlLibraryRepo();
Object.freeze(mlLibraryRepo);

export default mlLibraryRepo;
