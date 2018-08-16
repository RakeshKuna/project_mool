/**
 * Created by venkatasrinag on 3/4/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef';
import MlResolver from '../../../../commons/mlResolverDef'


let ideatorPortfolioSchema = `

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
    type portfolioMenu
    {
      name: String
      id:String
      menu:[PortfolioMenu]
    }
    
    type ideatoraboutInfo{
        title:String
        ideaDescription:String
        isTitlePublic:Boolean
        isDescriptionPublic:Boolean
    }
    
    type portfolioIdeatorDetailsInfo{
        firstName:String,
        isfirstNamePrivate:Boolean
        lastName:String,
        islastNamePrivate:Boolean
        gender:String,
        isGenderPrivate:Boolean,
        dateOfBirth:String,
        isDateOfBirthPrivate:Boolean,
        qualification:String,
        isQualificationPrivate:Boolean
        employmentStatus:String,
        isEmploymentStatusPrivate:Boolean
        professionalTag:String,
        isProfessionalTagPrivate:Boolean
        yearsofExperience:String,
        isYoePrivate:Boolean
        industry:String,
        isIndustryPrivate:Boolean
        profession:String,
        isProfessionPrivate:Boolean
        employerName:String,
        isEmployerNamePrivate:Boolean
        mobileNumber:String,
        isMobileNumberPrivate:Boolean
        emailId:String
        isEmailIdPrivate:Boolean
        facebookId:String
        isfacebookIdPrivate:Boolean
        linkedInId:String
        islinkedInIdPrivate:Boolean
        twitterId:String
        isTwitterIdPrivate:Boolean
        gplusId:String
        isGplusIdPrivate:Boolean
        profilePic:String,
        privateFields:[PrivateKeys]
    }
    type ideasObject{
        _id:String
        title:String,
        isIdeaTitlePrivate:Boolean,
        portfolioId:String
        ideaDescription:String,
        isIdeaPrivate:Boolean,
        isActive:Boolean,
        privateFields:[PrivateKeys]
        ideaImage      : imagesTypeSchema
    }
    
    type imagesTypeSchema{
        fileUrl   : String,
        fileName  : String
    }
    
     type problemSolutionInfo{
        problemStatement  : String,
        isProblemPrivate  : Boolean,
        problemImage      : [imagesTypeSchema]
        solutionStatement : String,
        isSolutionPrivate : Boolean,
        solutionImage     : [imagesTypeSchema]
        privateFields:[PrivateKeys]
    }
   
    type audienceInfo{
        audienceDescription:String
        isAudiencePrivate:Boolean,
        audienceImages : [imagesTypeSchema]
        privateFields:[PrivateKeys]
    }
    
    type strategyplansInfo{
        spDescription:String
        isStrategyPlansPrivate:Boolean
        privateFields:[PrivateKeys]
    }
    
    type intellectualplanningInfo{
        IPdescription:String
        isIntellectualPrivate :Boolean
        privateFields:[PrivateKeys]
    }
       
    type libraryInfo{
        fileType:String
        portfolioId:String
        isActive:Boolean
    }
    
    type ideatorPortfolioDetails{
         _id            : String
         userId               : String
         communityType        : String
         portfolioDetailsId   : String
         ideatorabout : ideatoraboutInfo
         ideas:ideasObject
         portfolioIdeatorDetails    : portfolioIdeatorDetailsInfo
         problemSolution : problemSolutionInfo
         audience : audienceInfo
         strategyAndPlanning : strategyplansInfo
         intellectualPlanning : intellectualplanningInfo
         lookingFor : [lookingForOutput]
         library:libraryInfo
    }
    

    input ideatorabout{
        title:String,
        ideaDescription:String,
        isTitlePublic:Boolean,
        isDescriptionPublic:Boolean
    }
    
    input portfolioIdeatorDetails{
        firstName:String,
        isfirstNamePrivate:Boolean
        lastName:String,
        islastNamePrivate:Boolean
        gender:String,
        isGenderPrivate:Boolean,
        dateOfBirth:String,
        isDateOfBirthPrivate:Boolean,
        qualification:String,
        isQualificationPrivate:Boolean
        employmentStatus:String,
        isEmploymentStatusPrivate:Boolean
        professionalTag:String,
        isProfessionalTagPrivate:Boolean
        yearsofExperience:String,
        isYoePrivate:Boolean
        industry:String,
        isIndustryPrivate:Boolean
        profession:String,
        isProfessionPrivate:Boolean
        employerName:String,
        isEmployerNamePrivate:Boolean
        mobileNumber:String,
        isMobileNumberPrivate:Boolean
        emailId:String
        isEmailIdPrivate:Boolean
        facebookId:String
        isfacebookIdPrivate:Boolean
        linkedInId:String
        islinkedInIdPrivate:Boolean
        twitterId:String
        isTwitterIdPrivate:Boolean
        gplusId:String
        isGplusIdPrivate:Boolean
        profilePic:String
    }
    
    input imageFilesInputSchema{
       fileUrl: String,
       fileName:String
     }
     
    input problemSolution{
        problemStatement    : String,
        isProblemPrivate    : Boolean,
        problemImage        : [imageFilesInputSchema],
        solutionStatement   : String,
        isSolutionPrivate   : Boolean,
        solutionImage       : [imageFilesInputSchema]
    }
    
    input audience{
        audienceDescription:String,
        isAudiencePrivate:Boolean,
        audienceImages : [imageFilesInputSchema]
    }
    
    input strategyAndPlanning{
        spDescription:String,
        isStrategyPlansPrivate:Boolean
    }
    input ideas{
        title:String,
        isIdeaTitlePrivate:Boolean,
        ideaDescription:String,
        isIdeaPrivate:Boolean,
        isActive:Boolean
        ideaImage : imageFilesInputSchema
    }
    
    input intellectualPlanning{
        IPdescription:String, 
        isIntellectualPrivate :Boolean
    }
        
    input library{
        fileType:String,
        portfolioId:String,
        isActive:Boolean
    }
  
    input ideatorPortfolio{
        portfolioDetailsId:String,
        ideatorabout:ideatorabout,
        ideas:ideas
        portfolioIdeatorDetails:portfolioIdeatorDetails,
        problemSolution:problemSolution,
        audience:audience,
        strategyAndPlanning:strategyAndPlanning,
        intellectualPlanning:intellectualPlanning,
        lookingFor:[lookingFor],
        library:library
    }
    
    type commentsInfo{
       _id:String,
      annotatorId : String,
      portfolioId : String,
      comment : String,
      userId :String,
      userName : String,
      firstName:String,
      lastName:String,
      profileImage : String
      createdAt:Date
    }
    
     type annotationInfo{
      _id:String,
      portfolioId : String,
      referenceDocId : String,
      quote : String,
      userId :String,
      userName : String,
      isResolved:Boolean,
      isReopened:Boolean,
      createdAt:Date
    }
    
    type Idea{
        _id:String
        userId:String,
        portfolioId:String,
        title:String,
        isIdeaTitlePrivate:Boolean,
        ideaDescription:String,
        isIdeaPrivate:Boolean,
        isActive:Boolean
        ideaImage : imagesTypeSchema
        privateFields:[PrivateKeys]
        createdAt: Date
        updatedAt: Date
    }
    
    input idea{
        title:String,
        isIdeaTitlePrivate:Boolean,
        ideaDescription:String,
        isIdeaPrivate:Boolean,
        isActive:Boolean
        ideaImage : imageFilesInputSchema
    }
    
    input fileAttributes{
        fileName:String,
        fileUrl:String,
        fileType:String
    }
    
    type FileAttributes{
        fileName:String,
        fileUrl:String,
        fileType:String
        isPrivate:Boolean
    }
     type PortfolioDetails{
      portfolioId: String
      isPrivate: Boolean
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
    
      input file{
      userId: String
      fileName: String
      fileUrl: String
      fileType: String
      libraryType: String 
      inCentralLibrary: Boolean
      inPortfolioLibrary: Boolean
      

    }
    
     type Details{
      _id: String
      userId: String
      fileName: String
      fileUrl: String
      fileType: String
      isPrivate: Boolean
      libraryType: String
      inCentralLibrary: Boolean
      portfolioReference: [PortfolioDetails]
    }
    
    
    type Query{
        fetchIdeatorDetails(portfoliodetailsId:String!, key:String): ideatorPortfolioDetails
        fetchIdeatorPortfolioDetails(portfoliodetailsId:String!):portfolioIdeatorDetailsInfo
        fetchIdeatorPortfolioIdeas(ideaId:String!):ideasObject
        fetchIdeatorPortfolioProblemsAndSolutions(portfoliodetailsId:String!): problemSolutionInfo
        fetchIdeatorPortfolioAudience(portfoliodetailsId:String!): audienceInfo
        fetchIdeatorPortfolioLibrary(portfoliodetailsId:String!): libraryInfo
        fetchIdeatorPortfolioStrategyAndPlanning(portfoliodetailsId:String!): strategyplansInfo
        fetchIdeatorPortfolioIntellectualPlanning(portfoliodetailsId:String!): intellectualplanningInfo       
        fetchIdeatorPortfolioRequests:response
        fetchAnnotations(portfoliodetailsId:String!, docId:String!): response
        fetchComments(annotationId:String): [commentsInfo]
        fetchPortfolioMenu(image: String, link: String, communityType: String, templateName: String, id: String, isLink: Boolean, isMenu: Boolean): portfolioMenu
        fetchIdeas(portfolioId:String):[Idea]
        validateUserForAnnotation(portfoliodetailsId:String!):Boolean
    }
    type Mutation{
        createIdeatorPortfolio(portfolio:ideatorPortfolio):response
        createAnnotation(portfoliodetailsId:String, docId:String, quote:String): response
        createComment(annotatorId:String, portfolioId:String,comment:String): response
        updateAnnotation(userId:String, portfolioId:String, docId:String, annotationId:String): response
        updateIdeatorPortfolio(portfoliodetailsId:String, portfolio:ideatorPortfolio):response
        resolveComment(commentId:String): response
        reopenComment(commentId:String): response
        createIdea(idea:idea):response
        updateIdea(ideaId:String, idea:idea, clusterId: String, chapterId: String, subChapterId: String, communityId: String):response
       
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], ideatorPortfolioSchema]);

let supportedApi = [
  {api:'validateUserForAnnotation', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchIdeatorDetails', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchIdeatorPortfolioDetails', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchIdeatorPortfolioIdeas', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'fetchIdeatorPortfolioProblemsAndSolutions', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchIdeatorPortfolioAudience', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchIdeatorPortfolioLibrary', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchIdeatorPortfolioStrategyAndPlanning', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchIdeatorPortfolioIntellectualPlanning', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchIdeatorPortfolioRequests', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchAnnotations', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'fetchComments', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'fetchPortfolioMenu', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchIdeas', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'fetchAllowableFormats', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchLibrary', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'putDataIntoTheLibrary', actionName:'CREATE', moduleName:"PORTFOLIO",isWhiteList:true},
  {api:'fetchDataFromCentralLibrary', actionName:'CREATE', moduleName:"PORTFOLIO",isWhiteList:true},




  {api:'createIdeatorPortfolio', actionName:'CREATE', moduleName:"PORTFOLIO"},
  {api:'createAnnotation', actionName:'CREATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'createComment', actionName:'CREATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'createIdea', actionName:'CREATE', moduleName:"PORTFOLIO"},
  {api:'createLibrary', actionName:'CREATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'updateAnnotation', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'updateIdeatorPortfolio', actionName:'UPDATE', moduleName:"PORTFOLIO"},
  {api:'updateIdea', actionName:'UPDATE', moduleName:"PORTFOLIO", isAppWhiteList:true},
  {api:'resolveComment', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'reopenComment', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true},
  // {api:'updatePrivacyDetails', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'updateLibraryData', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'updateLibrary', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true}

]
MlResolver.MlModuleResolver.push(supportedApi)
/**
 * Note: graphQl schema to be used multiple times hence using only onces
 * @lookingFor  : startup
 * @lookingForOutput : startup
 * */

// fetchIdeatorPortfolioLookingFor(portfoliodetailsId:String!): lookingforInfo
// {api:'fetchIdeatorPortfolioLookingFor', actionName:'READ', moduleName:"PORTFOLIO"},
