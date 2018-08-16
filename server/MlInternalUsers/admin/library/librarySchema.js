import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef';
import MlResolver from '../../../commons/mlResolverDef'

let librarySchema = `

    type PortfolioDetails{
      portfolioId: String
      isPrivate: Boolean
    }

     type Details{
      _id: String
      userId: String
      fileName: String
      fileUrl: String
      fileType: String
      fileSize: Float
      isPrivate: Boolean
      libraryType: String
      inCentralLibrary: Boolean
      portfolioReference: [PortfolioDetails]
    }
    
    type UserInfo {
      isExploring: Boolean
      action: String
    }
    
     input portfolioDetails{
      portfolioId: String
      isPrivate: Boolean
    }
    
     input libraryInput{
      _id: String
      userId: String
      fileName: String
      fileUrl: String
      fileSize: Float
      fileType: String
      isPrivate: Boolean
      libraryType: String
      inCentralLibrary: Boolean
      portfolioReference: [portfolioDetails]
    }
    
     input privateData{
      index: Int
      element: Boolean
      type: String
      libraryType: String
    }
    
    input privacyInfo {
      id: String
      privacyState: Boolean
      portfolioId: String
    }
     
     input file{
      userId: String
      fileName: String
      fileUrl: String
      fileType: String
      libraryType: String 
      inCentralLibrary: Boolean
      inPortfolioLibrary: Boolean
      }

 type Query{
      fetchLibrary(userId:String):[Details]
      fetchDataFromCentralLibrary:[Details]
      fetchCurrentUserPermissions(portfolioDetailsId: String): UserInfo
      fetchLibraryBasedOnPortfolioId(portfolioId: String): [Details]
 }
 
 type Mutation{
      updateLibraryData(files: privateData): response
      putDataIntoTheLibrary(portfoliodetailsId:String,files:file): response
      updateLibrary(id: String,files:libraryInput): response
      createLibrary(detailsInput:libraryInput, portfolioDetailsId: String):response
      updatePrivacyDetails(privateInput:privacyInfo): response
 }

`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], librarySchema]);

let supportedApi = [


  {api:'fetchLibrary', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'fetchDataFromCentralLibrary', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'fetchCurrentUserPermissions', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'fetchLibraryBasedOnPortfolioId', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},


  {api:'createLibrary', actionName:'CREATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'updateLibraryData', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'updatePrivacyDetails', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'updateLibrary', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'putDataIntoTheLibrary', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true}
  ]

MlResolver.MlModuleResolver.push(supportedApi)



