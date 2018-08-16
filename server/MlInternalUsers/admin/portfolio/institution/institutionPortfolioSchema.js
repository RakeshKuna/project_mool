/**
 * Created by venkatasrinag on 3/4/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef';
import MlResolver from '../../../../commons/mlResolverDef'


let institutePortfolioSchema = `
    type imagesTypeSchema{
        fileUrl   : String,
        fileName  : String,
        isDefault : Boolean
    }
    
    type institutionManagementOutput{
       title :String
       isTitlePrivate : Boolean
       firstName : String
       isFirstNamePrivate : Boolean
       lastName : String
       isLastNamePrivate : Boolean
       middleName : String
       isMiddleNamePrivate : Boolean
       qualification : String
       isQualificationPrivate :  Boolean
       certification : String
       isCertificationPrivate : Boolean
       profilePic : String
       isProfilePicPrivate : Boolean
       gender : String
       isGenderPrivate : Boolean
       designation : String
       isDesignationPrivate: Boolean
       yearsOfExperience : String
       isYOEPrivate : Boolean
       joiningDate : String
       isJoiningDatePrivate : Boolean
       firstJobJoiningDate : String
       isFJJDPrivate : Boolean
       universities :   String
       isUniversitiesPrivate: Boolean
       awards : String
       isAwardsPrivate : Boolean
       linkedInUrl : String
       isLinkedInUrlPrivate : Boolean
       managmentAbout : String
       isAboutPrivate:Boolean
       logo:imagesTypeSchema,
       index: Int
       privateFields:[PrivateKeys]
    }
   
    
    type clientsOutput{
        companyName:String,
        isCompanyNamePrivate:Boolean,
        logo:imagesTypeSchema,
        description:String,
        isDescriptionPrivate:Boolean,
        makePrivate:Boolean,
        index:Int,
    }  
    
    type imageFilesInputSchemaOutput{
       fileUrl: String,
       fileName:String
     }   

    type membershipsOutput{
        description:String, 
        isDescriptionPrivate :Boolean
    }
    
    type compliancesOutput{
        description:String, 
        isDescriptionPrivate :Boolean
    }
    
    type licensesOutput{
        description:String, 
        isDescriptionPrivate :Boolean
    }
    
   type EmploymentOfCompany{
      eofAbout: String
      eofFromMonth: String
      eofFromYear: String
      eofToMonth: String
      eofToYear: String
      eofNumberOfEmployment: Int
      index : Int
   }
    type ProfitRevenueLiability{
      prlEntityType: String
      prlFromMonth: String
      prlFromYear: String
      prlToMonth: String
      prlToYear: String
      pelValueType: String
      prlValue: Int
      prlabout:String
      index : Int
    }
    type ReviewOfCompany{
      rofYear: String
      rofValue: Int
      rofAbout: String
      index : Int
    }
    type intrapreneurRecognitionOutput{
      intrapreneurName:String
      isIntrapreneurPrivate:Boolean
      year:String
      isYearPrivate:Boolean
      intrapreneurDescription:String
      isDescriptionPrivate:Boolean
      logo:imagesTypeSchema,
      makePrivate:Boolean,
      index: Int,
      privateFields:[PrivateKeys]
    }
    type achievementsOutput{
      achievementName:String
      isAchievementNamePrivate:Boolean
      achievementDescription:String
      isAchievementDescriptionPrivate:Boolean
      logo:imagesTypeSchema,
      makePrivate:Boolean,
      index: Int,
      privateFields:[PrivateKeys]
    }
    type EmployeeBreakupDepartment{
      ebdFromMonth: String
      ebdFromYear: String
      ebdToMonth: String
      ebdToYear: String
      ebdDepartment: String
      ebdNumberOfEmployment: Int
      ebdAbout: String
      index : Int
      ebdDepartmentName:String
    }
   type chartsOutput{
      employmentOfCompanyChart:[EmploymentOfCompany]
      profitRevenueLiabilityChart:[ProfitRevenueLiability]
      reviewOfCompanyChart:[ReviewOfCompany]
      employeeBreakupDepartmentChart:[EmployeeBreakupDepartment]
    }
    
    type AboutUs{
        logo      : [imagesTypeSchema]
        institutionDescription : String
        annotatorId : String
        isLogoPrivate :Boolean
        isDescriptionPrivate : Boolean,
        privateFields:[PrivateKeys]
    }
    
    type policyOutput{
        institutionPolicyDescription:String, 
        institutionPolicyDescriptionPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
    type evolutionOutput{
        institutionEvolutionDescription:String, 
        institutionEvolutionDescriptionPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    type researchAndDevelopmentOutput{
      researchAndDevelopmentName:String
      isResearchAndDevelopmentNamePrivate:Boolean
      researchAndDevelopmentDescription:String
      isResearchAndDevelopmentDescriptionPrivate:Boolean
      logo:imagesTypeSchema,
      makePrivate:Boolean,
      index: Int,
      privateFields:[PrivateKeys]
    }
    
    type institutionIncubatorsOutput{
        institutionIncubatorsDescription:String, 
        isInstitutionIncubatorsPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
     type institutionLookingForOutput{
        lookingForName:String,
        lookingForId:String,
        lookingDescription:String,
        makePrivate:Boolean
        index: Int
        privateFields:[PrivateKeys]
    }
     
     type sectorsAndServicesOutputINS{
        sectorsAndServicesDescription:String, 
        isSectorsAndServicesPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
    type InstitutionPortfolio{
      portfolioDetailsId: String
      memberships       : membershipsOutput,
      compliances       : compliancesOutput,
      licenses          : licensesOutput 
      lookingFor        : [institutionLookingForOutput]
      aboutUs           : AboutUs
      rating            : ratingOutput
      serviceProducts   : serviceProductsOutput
      information       : informationOutput
      clients           : [clientsOutput]
      management        : [institutionManagementOutput],
      data              : dataOutput,
      charts            : chartsOutput,
      awardsRecognition : [awardsRecognitionOutput],
      investor          : [investorOutput]
      intrapreneurRecognition : [intrapreneurRecognitionOutput]
      achievements : [achievementsOutput]
      partners            : [PartnersOutput]
      policy : policyOutput
      evolution : evolutionOutput
      chapterName : String
      accountType : String
      researchAndDevelopment: [researchAndDevelopmentOutput]
      institutionIncubators : institutionIncubatorsOutput
      sectorsAndServices  : sectorsAndServicesOutputINS
      listOfIncubators    : listOfIncubatorsOutput
      reports             : dataOutput
      communityType   : String
      firstName         : String
      lastName : String
      profileImage        : String
          likes             : Int
        connections         : Int
        views               : Int
        followings          : Int
      isDefaultSubChapter : Boolean
      subChapterName : String
    }
    
    input institutionIncubators{
        institutionIncubatorsDescription:String, 
        isInstitutionIncubatorsPrivate :Boolean
    }
   
    input logo{
      fileName : String,
      fileUrl:String,
      isDefault:Boolean
    }
    
    input institutionManagement{
       title :String
       isTitlePrivate : Boolean
       firstName : String
       isFirstNamePrivate : Boolean
       lastName : String
       isLastNamePrivate : Boolean
       middleName : String
       isMiddleNamePrivate : Boolean
       qualification : String
       isQualificationPrivate :  Boolean
       certification : String
       isCertificationPrivate : Boolean
       profilePic : String
       isProfilePicPrivate : Boolean
       gender : String
       isGenderPrivate : Boolean
       designation : String
       isDesignationPrivate: Boolean
       yearsOfExperience : String
       isYOEPrivate : Boolean
       joiningDate : String
       isJoiningDatePrivate : Boolean
       firstJobJoiningDate : String
       isFJJDPrivate : Boolean
       universities :   String
       isUniversitiesPrivate: Boolean
       awards : String
       isAwardsPrivate : Boolean
       linkedInUrl : String
       isLinkedInUrlPrivate : Boolean
       managmentAbout : String
       isAboutPrivate:Boolean
       logo:logo
       index: Int
    }
      
    input legalIssue{
        description:String,
        isDescriptionPrivate:Boolean
    }
    
    input imageFilesInputSchema{
       fileUrl: String,
       fileName:String
     }
     
     input sectorsAndServicesINS{
        sectorsAndServicesDescription:String, 
        isSectorsAndServicesPrivate :Boolean
    }
    
    input memberships{
        description:String, 
        isDescriptionPrivate :Boolean
    }
    
    input compliances{
         description:String, 
        isDescriptionPrivate :Boolean
    }
    
    input licenses{
         description:String, 
        isDescriptionPrivate :Boolean
    }
    input employmentOfCompany{
      eofAbout: String
      eofFromMonth: String
      eofFromYear: String
      eofToMonth: String
      eofToYear: String
      eofNumberOfEmployment: Int
      index: Int
    }
    input profitRevenueLiability{
      prlEntityType: String
      prlFromMonth: String
      prlFromYear: String
      prlToMonth: String
      prlToYear: String
      pelValueType: String
      prlValue: Int
      prlabout:String
      index : Int
    }
    input reviewOfCompany{
      rofYear: String
      rofValue: Int
      rofAbout: String
      index : Int
    }
    input employeeBreakupDepartment{
      ebdFromMonth: String
      ebdFromYear: String
      ebdToMonth: String
      ebdToYear: String
      ebdDepartment: String
      ebdNumberOfEmployment: Int
      ebdAbout: String
      index : Int
    }
    input institutionAboutUs{
        logo      : [imageFilesInputSchema]
        institutionDescription : String
        annotatorId : String
        isLogoPrivate :Boolean
        isDescriptionPrivate : Boolean
    }
    input intrapreneurRecognition {
      intrapreneurName:String
      isIntrapreneurPrivate:Boolean
      year:String
      isYearPrivate:Boolean
      intrapreneurDescription:String
      isDescriptionPrivate:Boolean
      makePrivate:Boolean
      logo : logo
      index: Int
    }
    input achievements{
      achievementName:String
      isAchievementNamePrivate:Boolean
      achievementDescription:String
      isAchievementDescriptionPrivate:Boolean
      makePrivate:Boolean
      logo : logo
      index: Int
    }
    input policy{
        institutionPolicyDescription:String, 
        institutionPolicyDescriptionPrivate :Boolean
    }
    
    input evolution{
        institutionEvolutionDescription:String, 
        institutionEvolutionDescriptionPrivate :Boolean
    }
    input researchAndDevelopmentData{
        researchAndDevelopmentName:String
        isResearchAndDevelopmentNamePrivate:Boolean
        researchAndDevelopmentDescription:String
        isResearchAndDevelopmentDescriptionPrivate:Boolean
        makePrivate:Boolean
        logo : logo
        index: Int   
    }
    input institutionPortfolio{
        portfolioDetailsId  : String
        licenses            : licenses
        compliances         : compliances
        memberships         : memberships
        lookingFor          : [lookingFor]
        awardsRecognition : [awardsRecognition]
        aboutUs             : institutionAboutUs
        rating              : rating
        serviceProducts     : serviceProducts
        information         : information
        investor            : [investor]
        clients             : [clients]
        management          : [institutionManagement]
        employmentOfCompanyChart: [employmentOfCompany]
        reviewOfCompanyChart: [reviewOfCompany]
        profitRevenueLiabilityChart:  [profitRevenueLiability]
        employeeBreakupDepartmentChart: [employeeBreakupDepartment]
        data                : data
        intrapreneurRecognition : [intrapreneurRecognition]
        achievements     : [achievements]
        policy : policy
        evolution : evolution
        partners            : [partnersInput]
        researchAndDevelopment : [researchAndDevelopmentData]
        institutionIncubators : institutionIncubators
        sectorsAndServices  : sectorsAndServicesINS
        listOfIncubators    : listOfIncubators
        reports : data
    }
    type institutePortfolioOutput{
        _id                  : String
        userId               : String
        communityType        : String
        portfolioDetailsId   : String
        aboutUs              : aboutUsOutput
    }
    type InstitutionPortfolioAboutUsOutput{
        portfolioDetailsId  : String
        aboutUs             : AboutUs
        rating              : ratingOutput
        serviceProducts     : serviceProductsOutput
        information         : informationOutput
        clients             : [clientsOutput]
        privateFields:[PrivateKeys]
    }
    type Query{
        fetchInstitutionPortfolioAboutUs(portfoliodetailsId:String!):InstitutionPortfolioAboutUsOutput
        
        fetchInstitutePortfolioCharts(portfoliodetailsId:String):chartsOutput   
        fetchInstitutionPortfolioData(portfoliodetailsId:String):dataOutput
        fetchInstitutionDetails(portfoliodetailsId:String!, key:String):InstitutionPortfolio
        fetchInstitutionPortfolioCSRReports(portfoliodetailsId:String):dataOutput
    }
    
    type Mutation{
        createInstitutionPortfolio(portfolio:institutionPortfolio):response
        updateInstitutionPortfolio(portfoliodetailsId:String,portfolio:institutionPortfolio):response
        
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], institutePortfolioSchema]);

let supportedApi = [
  {api:'fetchInstitutionDetails', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchInstitutionPortfolioAboutUs', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchInstitutionPortfolioData', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchInstitutePortfolioCharts', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchInstitutionPortfolioCSRReports', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'createInstitutionPortfolio', actionName:'CREATE', moduleName:"PORTFOLIO"},
  {api:'updateInstitutionPortfolio', actionName:'UPDATE', moduleName:"PORTFOLIO"},
  {api:'createInstitutePortfolioChart', actionName:'UPDATE', moduleName:"PORTFOLIO"}
]
MlResolver.MlModuleResolver.push(supportedApi)

/**
 * Note: graphql schema to be used multiple times hence using only onces
 * @lookingFor  : startup
 * @lookingForOutput : startup
 * @awardsRecognition : startup
 * @awardsRecognitionOutput : startup
 * @investor : startup
 * dataOutput : startup
 * data : startup
 * */
// {api:'fetchInstitutePortfolioAwards', actionName:'READ', moduleName:"PORTFOLIO"},
// fetchInstitutePortfolioAwards(portfoliodetailsId:String!):[awardsRecognitionOutput]
// fetchInstitutePortfolioManagement(portfoliodetailsId:String!):[instituteManagementOutput]
// {api:'fetchInstitutePortfolioManagement', actionName:'READ', moduleName:"PORTFOLIO"},
