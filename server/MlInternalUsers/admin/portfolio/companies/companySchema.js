/**
 * Created by venkatasrinag on 3/4/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef';
import MlResolver from '../../../../commons/mlResolverDef'


let startupPortfolioSchema = `

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
    type imagesTypeSchema{
        fileUrl   : String,
        fileName  : String
    }
    type managementOutput{
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
       about : String
       isAboutPrivate:Boolean
       logo:imagesTypeSchema,
       index: Int
       privateFields:[PrivateKeys]
    }
    
    type achievementsOutput{
      achievementName:String
      isAchievementNamePrivate:Boolean
      achievementDescription:String
      isAchievementDescriptionPrivate:Boolean
      logo:imageFilesInputSchemaOutput,
      makePrivate:Boolean,
      index: Int,
      privateFields:[PrivateKeys]
    }
    type policyOutput{
        policyDescription:String, 
        isPolicyDescriptionPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
    type evolutionOutput{
        evolutionDescription:String, 
        isEvolutionDescriptionPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
    type clientsOutput{
        clientName:String,
        isClientNamePrivate:Boolean,
        logo:imagesTypeSchema,
        clientDescription:String,
        isClientDescriptionPrivate:Boolean,
        makePrivate:Boolean,
        index:Int,
        privateFields:[PrivateKeys]
    }
    
    type informationOutput{
       informationDescription:String,
       isInformationDescriptionPrivate:Boolean
       privateFields:[PrivateKeys]
    }
    
    type serviceProductsOutput{
        spDescription:String,
        isSPDescriptionPrivate:Boolean
        privateFields:[PrivateKeys]
    }
    
    type imageFilesInputSchemaOutput{
       fileUrl: String,
       fileName:String
     }
     
    type dataOutput{
      balanceSheet: [imagesTypeSchema]
      profitAndLoss: [imagesTypeSchema]
      quaterlyReport: [imagesTypeSchema]
      yearlyReport: [imagesTypeSchema]
      halfYearlyReport: [imagesTypeSchema]
      annualReport: [imagesTypeSchema]
      cashFlow: [imagesTypeSchema]
      shareHoldings: [imagesTypeSchema]
      capitalStructure: [imagesTypeSchema]
      ratio: [imagesTypeSchema]
      privateFields:[PrivateKeys]
    }
    
    
    type aboutUsOutput{
        logo      : [imagesTypeSchema]
        companyDescription : String
        annotatorId : String
        isLogoPrivate :Boolean
        isCompanyDescriptionPrivate : Boolean
        privateFields:[PrivateKeys]
    }

    type membershipsOutput{
        membershipsDescription:String, 
        isMembershipsDescriptionPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
    type compliancesOutput{
        compliancesDescription:String, 
        isCompliancesDescriptionPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
    type licensesOutput{
        licensesDescription:String, 
        isLicensesDescriptionPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
    type startupIncubatorsOutput{
        startupIncubatorsDescription:String, 
        isStartupIncubatorsPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
    type sectorsAndServicesOutput{
        industryTypeId:String,
        industryTypeName :String
        domainType:String,
        logo:imagesTypeSchema,
        makePrivate:Boolean,
        isActive:Boolean
        subDomainId : String
        subDomainName :String
        index: Int
        privateFields:[PrivateKeys]
    }
    
    type listOfIncubatorsOutput{
        listOfIncubatorsDescription:String, 
        isListOfIncubatorsPrivate :Boolean
        privateFields:[PrivateKeys]
    }
    
    type SocialLinks{
        socialLinkType:String,
        userId:String,
        isUserIdPrivate:Boolean
    }
    
    type PartnersOutput{
        title:String,
        firstName:String,
        isFirstNamePrivate:Boolean,
        lastName:String,
        isLastNamePrivate:Boolean,
        designation:String,
        isDesignationPrivate:Boolean,
        partnerCompanyName:String,
        isCompanyNamePrivate:Boolean,
        duration:String,
        isDurationPrivate:Boolean,
        yearsOfExperience:String,
        isYearsOfExperiencePrivate:Boolean,
        qualification:String,
        isQualificationPrivate:Boolean,
        aboutPartner:String,
        isAboutPartnerPrivate:Boolean,
        socialLinks:[SocialLinks],
        index:Int,
        logo:imagesTypeSchema,
        privateFields:[PrivateKeys],
        makePrivate : Boolean
    }
    
    type ratingOutput{,
        rating:String
        isRatingPrivate:Boolean
        privateFields:[PrivateKeys]
    }
    type companyPortfolioAboutUsOutput{
        portfolioDetailsId  : String
        aboutUs             : aboutUsOutput
        rating              : ratingOutput
        serviceProducts     : serviceProductsOutput
        information         : informationOutput
        technologies        : [technologiesOutput]
        assets              : [assetsOutput]
        branches            : [branchesOutput]
        clients             : [clientsOutput]
        legalIssue          : legalIssueOutput
        data                : dataOutput
        privateFields       : [PrivateKeys]
    }

   type EmploymentOfCompany{
      eofAbout: String
      eofFromMonth: String
      eofFromYear: String
      eofToMonth: String
      eofToYear: String
      eofNumberOfEmployment: Int
      index : Int
      privateFields:[PrivateKeys]
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
      privateFields:[PrivateKeys]
    }
    type ReviewOfCompany{
      rofYear: String
      rofValue: Int
      rofAbout: String
      index : Int
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
      privateFields:[PrivateKeys]
    }
        
   type CompanyChartsOutput{
      employmentOfCompanyChart:[EmploymentOfCompany]
      profitRevenueLiabilityChart:[ProfitRevenueLiability]
      reviewOfCompanyChart:[ReviewOfCompany]
      employeeBreakupDepartmentChart:[EmployeeBreakupDepartment]
    }
    type intrapreneurRecognitionOutput{
      intrapreneurName:String
      isIntrapreneurNamePrivate:Boolean
      year:String
      isYearPrivate:Boolean
      intrapreneurDescription:String
      isIntrapreneurDescriptionPrivate:Boolean
      logo:imagesTypeSchema,
      makePrivate:Boolean,
      index: Int,
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
    
    type CompanyPortfolio{
      aboutUs           : aboutUsOutput
      rating            : ratingOutput
      serviceProducts   : serviceProductsOutput
      information       : informationOutput
      clients           : [clientsOutput]
      management        : [managementOutput],
      data              : dataOutput,
      charts            : CompanyChartsOutput,
      awardsRecognition : [awardsRecognitionOutput],
      memberships       : membershipsOutput,
      compliances       : compliancesOutput,
      licenses          : licensesOutput,
      startupIncubators : startupIncubatorsOutput
      sectorsAndServices  :[sectorsAndServicesOutput]
      listOfIncubators    : listOfIncubatorsOutput
      partners            : [PartnersOutput] 
      achievements        : [achievementsOutput]
      policy              : policyOutput
      evolution           : evolutionOutput
      researchAndDevelopment: [researchAndDevelopmentOutput]
      intrapreneurRecognition : [intrapreneurRecognitionOutput]
      reports             : dataOutput
      _id                  : String
      userId               : String
      communityType        : String
      portfolioDetailsId   : String
      chapterName: String
      accountType: String
      firstName : String
      lastName : String
      lookingFor           : [lookingForOutput]
      profileImage        : String
       likes               : Int
       connections         : Int
       views               : Int
       followings          : Int
       isDefaultSubChapter : Boolean
       subChapterName : String
   }
    
    
    input logo{
      fileName : String,
      fileUrl:String
    }
    
    input management{
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
       about : String
       isAboutPrivate:Boolean
       logo:logo
       index: Int
    }
  
    input clients{
        clientName:String,
        isClientNamePrivate:Boolean,
        logo:logo,
        clientDescription:String,
        isClientDescriptionPrivate:Boolean,
        makePrivate:Boolean,
        index:Int
    }

    input information{
        informationDescription:String,
        isInformationDescriptionPrivate:Boolean
    }
    
    input serviceProducts{
        spDescription:String,
        isSPDescriptionPrivate:Boolean
    }
    
    input data{
      balanceSheet: [imageFilesInputSchema]
      profitAndLoss: [imageFilesInputSchema]
      quaterlyReport: [imageFilesInputSchema]
      yearlyReport: [imageFilesInputSchema]
      halfYearlyReport: [imageFilesInputSchema]
      annualReport: [imageFilesInputSchema]
      cashFlow: [imageFilesInputSchema]
      shareHoldings: [imageFilesInputSchema]
      capitalStructure: [imageFilesInputSchema]
      ratio: [imageFilesInputSchema]
    }
    
    input imageFilesInputSchema{
       fileUrl: String,
       fileName:String
     }
     
    input rating{
        rating:String
        isRatingPrivate:Boolean
    }
    
    input startupIncubators{
        startupIncubatorsDescription:String, 
        isStartupIncubatorsPrivate :Boolean
    }
    
    input sectorsAndServices{
        industryTypeId:String,
        industryTypeName :String
        domainType:String,
        makePrivate:Boolean,
        isActive:Boolean
        subDomainId : String
        subDomainName :String
        index: Int
    }
    
    input listOfIncubators{
        listOfIncubatorsDescription:String, 
        isListOfIncubatorsPrivate :Boolean
    }
    
    input socialLinks{
        socialLinkType:String,
        userId:String,
        isUserIdPrivate:Boolean
    }
    
    input partnersInput{
        title:String,
        firstName:String,
        isFirstNamePrivate:Boolean,
        lastName:String,
        isLastNamePrivate:Boolean,
        designation:String,
        isDesignationPrivate:Boolean,
        partnerCompanyName:String,
        isCompanyNamePrivate:Boolean,
        duration:String,
        isDurationPrivate:Boolean,
        yearsOfExperience:String,
        isYearsOfExperiencePrivate:Boolean,
        qualification:String,
        isQualificationPrivate:Boolean,
        aboutPartner:String,
        isAboutPartnerPrivate:Boolean,
        socialLinks:[socialLinks],
        index:Int,
        logo:imageFilesInputSchema,
        makePrivate : Boolean
    }
    
    input aboutUs{
        logo      : [imageFilesInputSchema]
        companyDescription : String
        annotatorId : String
        isLogoPrivate :Boolean
        isCompanyDescriptionPrivate : Boolean
    }
    
    input awardsRecognition{
          awardName:String
          awardId:String
          isAwardPrivate:Boolean
          year:String
          isYearPrivate:Boolean
          awardsDescription:String
          isAwardsDescriptionPrivate:Boolean
          makePrivate:Boolean
          logo : logo,
          index: Int
    }

    input memberships{
        membershipsDescription:String, 
        isMembershipsDescriptionPrivate :Boolean
    }
    
    input compliances{
         compliancesDescription:String, 
        isCompliancesDescriptionPrivate :Boolean
    }
    
    input licenses{
         licensesDescription:String, 
        isLicensesDescriptionPrivate :Boolean
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
    
    input achievements{
      achievementName:String
      isAchievementNamePrivate:Boolean
      achievementDescription:String
      isAchievementDescriptionPrivate:Boolean
      logo:imageFilesInputSchema,
      makePrivate:Boolean,
      index: Int,
    }
    
    input policy{
        policyDescription:String, 
        isPolicyDescriptionPrivate :Boolean
    }
    
    input evolution{
        evolutionDescription:String, 
        isEvolutionDescriptionPrivate :Boolean
    }
    input researchAndDevelopmentData{
        researchAndDevelopmentName:String
        isResearchAndDevelopmentNamePrivate:Boolean
        researchAndDevelopmentDescription:String
        isResearchAndDevelopmentDescriptionPrivate:Boolean
        makePrivate:Boolean
        logo : imageFilesInputSchema
        index: Int
    }
    input intrapreneurRecognition {
      intrapreneurName:String
      isIntrapreneurNamePrivate:Boolean
      year:String
      isYearPrivate:Boolean
      intrapreneurDescription:String
      isIntrapreneurDescriptionPrivate:Boolean
      makePrivate:Boolean
      logo : imageFilesInputSchema
      index: Int
    }
   
    input companyPortfolio{
        portfolioDetailsId  : String
        licenses            : licenses
        compliances         : compliances
        memberships         : memberships
        awardsRecognition : [awardsRecognition]
        aboutUs             : aboutUs
        rating              : rating
        serviceProducts     : serviceProducts
        information         : information
        clients             : [clients]
        management          : [management]
        employmentOfCompanyChart: [employmentOfCompany]
        reviewOfCompanyChart: [reviewOfCompany]
        profitRevenueLiabilityChart:  [profitRevenueLiability]
        employeeBreakupDepartmentChart: [employeeBreakupDepartment]
        data                : data
        startupIncubators   : startupIncubators
        sectorsAndServices  : [sectorsAndServices]
        listOfIncubators    : listOfIncubators
        partners            : [partnersInput]
        achievements        : [achievements]
        policy              : policy
        evolution           : evolution
        researchAndDevelopment : [researchAndDevelopmentData]
        intrapreneurRecognition : [intrapreneurRecognition]
        reports : data
        lookingFor          : [lookingFor]
    }
    type companyPortfolioOutput{
        _id                  : String
        userId               : String
        communityType        : String
        portfolioDetailsId   : String
        aboutUs              : aboutUsOutput
    }
    
    type Query{
      fetchCompanyPortfolioAboutUs(portfoliodetailsId:String!):companyPortfolioAboutUsOutput
      fetchCompanyDetails(portfoliodetailsId:String!, key:String):CompanyPortfolio
      fetchCompanyPortfolioCharts(portfoliodetailsId:String):CompanyChartsOutput
      fetchCompanyPortfolioData(portfoliodetailsId:String):dataOutput
      fetchCompanyPortfolioCSRReports(portfoliodetailsId:String):dataOutput
    }
    
    type Mutation{
        createCompanyPortfolio(portfolio:companyPortfolio):response
        updateCompanyPortfolio(portfoliodetailsId:String,portfolio:companyPortfolio):response
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], startupPortfolioSchema]);

let supportedApi = [
  {api:'fetchCompanyPortfolioAboutUs', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchCompanyDetails', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchCompanyPortfolioCharts', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchCompanyPortfolioData', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchCompanyPortfolioCSRReports', actionName:'READ', moduleName:"PORTFOLIO"},

  {api:'createCompanyPortfolio', actionName:'CREATE', moduleName:"PORTFOLIO"},
  {api:'updateCompanyPortfolio', actionName:'UPDATE', moduleName:"PORTFOLIO"},
]
MlResolver.MlModuleResolver.push(supportedApi)

/**
 * Note: graphql schema to be used multiple times hence using only onces
 * @lookingFor  : startup
 * @lookingForOutput : startup
 * @awardsRecognitionOutput : startup
 * */
// type awardsRecognitionOutput{
//   awardName:String
//   awardId:String
//   isAwardPrivate:Boolean
//   year:String
//   isYearPrivate:Boolean
//   awardsDescription:String
//   isAwardsDescriptionPrivate:Boolean
//   logo:imagesTypeSchema,
//     makePrivate:Boolean,
//     index: Int
//   privateFields:[PrivateKeys]
// }
