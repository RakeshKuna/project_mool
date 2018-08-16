/**
 * Created by venkatasrinag on 6/4/17.
 */
import {mergeStrings} from "gql-merge";
import MlSchemaDef from "../../../commons/mlSchemaDef";
import MlResolver from "../../../commons/mlResolverDef";

let portfolioSchema = `
    type Portfoliodetails{
        _id:String,
        transactionType:String,
        portfolioUserName:String,
        gender: String,
        employmentStatus:String,
        userId:String,
        userType:String,
        contactNumber:String,
        communityType:String,
        communityCode:String,
        clusterId:String,
        chapterId:String,
        subChapterId:String,
        accountType:String,
        source:String,
        createdBy:String,
        createdAt:Date,
        status:String,
        assignedTo:String,
        progress:String,
        isPublic:Boolean,
        isGoLive:Boolean,
        isActive:Boolean,
        registrationId  : String,
        clusterName     : String,
        chapterName     : String,
        subChapterName  : String,
        communityName   : String
        identityType    : String,
        industryId      : String, 
        professionId    : String,
        portfolioId     : String
        transactionId   : String
        transactionCreatedDate : String
        transactionUpdatedDate : String
        allocation      : allocation
        assignedUser    : String
        assignedUserId  : String
        privateFields:[PrivateKeys]
        communityId:String
        canAccess         : Boolean
        portfolioImage : String
        allocationStatus :  String
        count : String
        communityImageLink : String,
        subDomainId : [String],
        businessType    : String,
        stageOfCompany    : String
        lastLiveDate : String
    }
    
    input privateKeys{
      keyName:String,
      booleanKey:String,
      objectName:String,
      index:Int,
      tabName:String
    },
    
    type PrivateKeys{
      keyName:String,
      booleanKey:String,
      objectName:String,
      index:Int,
      tabName:String
    },
    input portfoliodetails{
        _id:String,
        transactionType:String,
        portfolioUserName:String,
        gender:String,
        employmentStatus:String,
        userId:String,
        userType:String,
        contactNumber:String,
        communityType:String,
        communityCode:String,
        clusterId:String,
        chapterId:String,
        subChapterId:String,
        accountType:String,
        source:String,
        createdBy:String,
        createdAt:Date,
        status:String,
        assignedTo:String,
        progress:String,
        isPublic:Boolean,
        isGoLive:Boolean,
        isActive:Boolean,
        registrationId  : String,
        clusterName     : String,
        chapterName     : String,
        subChapterName  : String,
        communityName   : String
        identityType    : String,
        industryId      : String, 
        professionId    : String,
        portfolioId     : String
        transactionId   : String
        transactionCreatedDate : String
        transactionUpdatedDate : String,
        subDomainId : [String],
        businessType    : String,
        stageOfCompany    : String
    }
   
    input portfolio{
        ideatorPortfolio:ideatorPortfolio,
        startupPortfolio:startupPortfolio,
        funderPortfolio:funderPortfolio,
        serviceProviderPortfolio:serviceProviderPortfolio
        companyPortfolio : companyPortfolio
        institutionPortfolio : institutionPortfolio
    }
     
    
    type Query{
          fetchPortfolioDetailsByUserId:Portfoliodetails
          fetchPortfolioByReg(registrationId: String): Portfoliodetails
          findPortfolioDetails(portfoliodetailsId: String): Portfoliodetails
          fetchPortfolioImage(portfoliodetailsId: String): Portfoliodetails 
    }
    
    type Mutation{
          createPortfolioRequest(portfoliodetails:portfoliodetails):response
          updatePortfolio(portfoliodetailsId:String, portfolio:portfolio, privateFields:[privateKeys], removeKeys:[privateKeys]):response
          approvePortfolio(portfoliodetailsId:String, clusterId: String, chapterId: String, subChapterId: String, communityId: String):response
          rejectPortfolio(portfoliodetailsId:String):response
          requestForGoLive(portfoliodetailsId:String):response
          updatePortfolioProfilePic(portfolioId:String,docUrl:String,communityType:String):response 
          removeIdetaorProfilePic(portfoliodetailsId:String):response
          removePortfolioFileUrl(portfoliodetailsId:String,fileUrl:String,tabName:String,typeOfData:String):response

    }
`
MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], portfolioSchema]);

let supportedApi = [
  {api:'fetchPortfolioDetailsByUserId', actionName:'READ', moduleName:"PORTFOLIO", isAppWhiteList:true},
  // {api:'fetchPortfolioDetails', actionName:'READ', moduleName:"PORTFOLIO", isAppWhiteList:true},
  {api: 'fetchPortfolioByReg', actionName: 'READ', moduleName: "PORTFOLIO", isWhiteList: true},
  {api:'createPortfolioRequest', actionName:'CREATE', moduleName:"PORTFOLIO", isAppWhiteList:true},
  {api:'updatePortfolio', actionName:'UPDATE', moduleName:"PORTFOLIO", isAppWhiteList:true},
  {api:'approvePortfolio', actionName:'UPDATE', moduleName:"PORTFOLIO"},
  {api:'rejectPortfolio', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'requestForGoLive', actionName:'UPDATE', moduleName:"PORTFOLIO", isAppWhiteList:true},
  {api:'removeIdetaorProfilePic', actionName:'UPDATE', moduleName:"PORTFOLIO", isAppWhiteList:true},
  {api: 'findPortfolioDetails', actionName: 'READ', moduleName: "PORTFOLIO", isWhiteList:true},   //temp making white list
  {api: 'fetchPortfolioImage', actionName: 'READ', moduleName: "PORTFOLIO", isWhiteList:true},
  {api:'removePortfolioFileUrl',actionName:'UPDATE',moduleName:"PORTFOLIO", isWhiteList:true}
]
MlResolver.MlModuleResolver.push(supportedApi)

// fetchPortfolioDetails(portfolioId:String):Portfoliodetails
