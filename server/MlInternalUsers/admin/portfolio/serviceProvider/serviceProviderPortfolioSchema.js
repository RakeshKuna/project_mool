/**
 * Created by vishwadeep on 10/7/17.
 */
import {mergeStrings} from "gql-merge";
import MlSchemaDef from "../../../../commons/mlSchemaDef";
import MlResolver from "../../../../commons/mlResolverDef";

let serviceProviderPortfolioSchema = `
    type PortfolioMenu{
        image: String
        link: String
        name: String
        uniqueId:String
        isLink:Boolean
        isMenu:Boolean
        isDisabled:Boolean
        subMenu:[Menu]
        dynamicLink:Boolean
        subMenuMappingId:String
        subMenusId:String
        hideSubMenu:Boolean
        showInBreadCrum:Boolean
    }
    
    type portfolioMenu {
      name: String
      id:String
      menu:[PortfolioMenu]
    }
    
    type imagesTypeSchema{
        fileUrl   : String,
        fileName  : String
    } 
    
    type clientsOutput{
        companyName:String,
        isCompanyNamePrivate:Boolean,
        logo:imagesTypeSchema,
        clientDescription:String,
        isClientDescriptionPrivate:Boolean,
        makePrivate :Boolean,
        index:Int,
        privateFields:[PrivateKeys]
    }
    
    type servicesOutput{
      servicesDescription : String
      isServicesPrivate   : Boolean
      privateFields:[PrivateKeys]
    }
    
    type imageFilesInputSchemaOutput{
       fileUrl: String,
       fileName:String
     }
    
    type aboutOutput{        
        aboutTitle            : String
        isAboutTitlePrivate   : Boolean
        aboutDescription      : String,
        isDescriptionPrivate  : Boolean,
        aboutImages           : [imagesTypeSchema]
        privateFields         : [PrivateKeys]
    }

    type membershipsOutput{
        membershipDescription : String, 
        isMembershipPrivate   : Boolean,
        privateFields:[PrivateKeys]
    }
    
    type compliancesOutput{
       compliancesDescription:String, 
       isCompliancesPrivate :Boolean,
       privateFields:[PrivateKeys]
    }
    
    type licensesOutput{
       licensesDescription : String, 
       isLicensesPrivate   : Boolean,
       privateFields:[PrivateKeys]
    }
    
     type serviceProviderPortfolioDetails{
         _id                  : String
         userId               : String
         communityType        : String
         portfolioDetailsId   : String
         about                : aboutOutput
         licenses             : licensesOutput
         compliances          : compliancesOutput
         memberships          : membershipsOutput
         awardsRecognition    : [awardsRecognitionOutput]
         clients              : [clientsOutput]
         services             : servicesOutput
         chapterName          : String
         accountType          : String
         firstName            : String
         lastName             : String
         lookingFor           : [lookingForOutput]
         profileImage         : String
         isDefaultSubChapter : Boolean
         subChapterName : String
    }
    
    input logo{
      fileName : String,
      fileUrl:String
    }
  
    input clients{
        companyName:String,
        isCompanyNamePrivate :Boolean,
        logo :logo,
        clientDescription :String,
        isClientDescriptionPrivate :Boolean,
        makePrivate:Boolean,
        index:Int
    }
  
    input services{
        servicesDescription : String
        isServicesPrivate   : Boolean
    }
    
    input imageFilesInputSchema{
       fileUrl: String,
       fileName:String
     }
     
    input about{
      aboutTitle : String
      isAboutTitlePrivate : Boolean
      aboutDescription:String,
      isDescriptionPrivate:Boolean,
      aboutImages : [imageFilesInputSchema]
    }
    
    input awardsRecognition{
      awardName:String
      awardId:String
      isAwardPrivate:Boolean
      year:String
      isYearPrivate:Boolean
      awardDescription:String
      isAwardDescriptionPrivate:Boolean
      makePrivate:Boolean
      logo : logo,
      index: Int
    }

    input memberships{
      membershipDescription : String, 
      isMembershipPrivate   : Boolean
    }
    
    input compliances{
        compliancesDescription:String, 
        isCompliancesPrivate :Boolean
    }
    
    input licenses{
        licensesDescription : String, 
        isLicensesPrivate   : Boolean
    }

    input serviceProviderPortfolio{
        portfolioDetailsId  : String
        licenses            : licenses
        compliances         : compliances
        memberships         : memberships
        awardsRecognition   : [awardsRecognition]
        about               : about
        services            : services
        clients             : [clients]
        lookingFor          : [lookingFor]
    }
    
    type Query{
        fetchServiceProviderDetails(portfoliodetailsId:String!, key:String!) : serviceProviderPortfolioDetails
        fetchPortfolioMenu(image: String, link: String, communityType: String, templateName: String, id: String, isLink: Boolean, isMenu: Boolean): portfolioMenu
    }
    
    type Mutation{
        createServiceProviderPortfolio(portfolio:serviceProviderPortfolio):response
        updateServiceProviderPortfolio(portfoliodetailsId:String, portfolio:serviceProviderPortfolio):response
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], serviceProviderPortfolioSchema]);

let supportedApi = [
  {api: 'fetchServiceProviderDetails', actionName: 'READ', moduleName: "PORTFOLIO"},
  {api: 'createServiceProviderPortfolio', actionName: 'CREATE', moduleName: "PORTFOLIO"},
  {api: 'updateServiceProviderPortfolio', actionName: 'UPDATE', moduleName: "PORTFOLIO"},
  {api: 'fetchPortfolioMenu', actionName: 'READ', moduleName: "PORTFOLIO"},
]
MlResolver.MlModuleResolver.push(supportedApi)

/*
 * @awardsRecognitionOutput : startup
 */

// type awardsRecognitionOutput{
//   awardName:String
//   awardId:String
//   isAwardPrivate:Boolean
//   year:String
//   isYearPrivate:Boolean
//   awardDescription:String
//   isAwardDescriptionPrivate:Boolean
//   logo:imagesTypeSchema,
//     makePrivate:Boolean,
//     index: Int
//   privateFields:[PrivateKeys]
// }
