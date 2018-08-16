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
    type startupManagementOutput{
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
       index: Int,
       privateFields:[PrivateKeys]
    }
    
 
    
    type clientsOutput{
        companyName:String,
        isCompanyNamePrivate:Boolean,
        logo:imagesTypeSchema,
        clientDescription:String,
        isDescriptionPrivate:Boolean,
        makePrivate:Boolean,
        index:Int,
        privateFields:[PrivateKeys]
    }
    
    type branchesOutput{
        addressTypeId:String,
        branchName:String,
        isNamePrivate:Boolean,
        branchPhoneNumber:String,
        isPhoneNumberPrivate:Boolean,
        branchAddress1:String,
        isAddressOnePrivate:String,
        branchAddress2:String,
        isAddressTwoPrivate:Boolean,
        branchLandmark:String,
        isLandmarkPrivate:Boolean,
        branchArea:String,
        isAreaPrivate:Boolean,
        branchCity:String,
        cityId:String,
        isCityPrivate:Boolean,
        branchState:String,
        stateId:String,
        isStatePrivate:Boolean,
        branchCountry:String,
        countryId:String,
        isCountryPrivate:Boolean,
        addressImage : String,
        isAddressImagePrivate:Boolean,
        logo:imagesTypeSchema,
        makePrivate:Boolean,
        index:Int
        privateFields:[PrivateKeys]
        
    }
    
    type assetsOutput{
        assetTypeId:String,
        assetTypeName:String,
        isAssetTypePrivate:Boolean,
        quantity:String,
        isQuantityTypePrivate:Boolean,
        assetDescription:String,
        isDescriptionPrivate:Boolean,
        logo:imagesTypeSchema,
        makePrivate:Boolean,
        index:Int
        privateFields:[PrivateKeys]
    }
    
    type technologiesOutput{
        technologyName:String,
        technologyId:String,
        technologyDescription:String,
        isTechnologyPrivate:Boolean,
        isDescriptionPrivate:Boolean,
        logo:imagesTypeSchema,
        makePrivate:Boolean,
        index:Int
        privateFields:[PrivateKeys]
    }
    
    type investorOutput{
        investorName:String,
        fundingType:String,
        fundingTypeId:String,
        investmentAmount:String,
        investorDescription:String,
        isNamePrivate:Boolean,
        isInvestmentAmountPrivate:Boolean,
        isDescriptionPrivate:Boolean,
        logo:imagesTypeSchema,
        makePrivate:Boolean
        index: Int
        privateFields:[PrivateKeys]
    }
    
    type lookingForOutput{
        lookingForName:String,
        lookingForId:String,
        isTypePrivate:Boolean,
        lookingDescription:String,
        isDescriptionPrivate:Boolean,
        logo:imagesTypeSchema,
        makePrivate:Boolean
        index: Int
        privateFields:[PrivateKeys]
    }
    

    type informationOutput{
       informationDescription:String,
       isDescriptionPrivate:Boolean
       privateFields:[PrivateKeys]
    }
    
    type serviceProductsOutput{
        spDescription:String,
        isDescriptionPrivate:Boolean
        privateFields:[PrivateKeys]
    }
    
    type imageFilesInputSchemaOutput{
       fileUrl: String,
       fileName:String
     }
     

    
    type legalIssueOutput{
        legalDescription:String,
        isDescriptionPrivate:Boolean
        privateFields:[PrivateKeys]
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
      ratio: [imagesTypeSchema],
      privateFields:[PrivateKeys]
    }
    
    
    type aboutUsOutput{
        logo      : [imagesTypeSchema]
        startupDescription : String
        annotatorId : String
        isLogoPrivate :Boolean
        isDescriptionPrivate : Boolean,
        privateFields:[PrivateKeys]
    }
    
    type awardsRecognitionOutput{
          awardName:String
          awardId:String
          isAwardPrivate:Boolean
          year:String
          isYearPrivate:Boolean
          awardsDescription:String
          isDescriptionPrivate:Boolean
          logo:imagesTypeSchema,
          makePrivate:Boolean,
          index: Int,
          privateFields:[PrivateKeys]
    }

    type membershipsOutput{
        membershipDescription:String, 
        isDescriptionPrivate :Boolean,
        privateFields:[PrivateKeys]
    }
    
    type compliancesOutput{
        complianceDescription:String, 
        isDescriptionPrivate :Boolean,
        privateFields:[PrivateKeys]
    }
    
    type licensesOutput{
        licenseDescription:String, 
        isDescriptionPrivate :Boolean,
        privateFields:[PrivateKeys]
    }
    type ratingOutput{,
        rating:String
        isRatingPrivate:Boolean,
        privateFields:[PrivateKeys]
    }
    type startupPortfolioAboutUsOutput{
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
        data                : dataOutput,
        privateFields:[PrivateKeys]
    }

   type EmploymentOfCompany{
      eofAbout: String
      eofFromMonth: String
      eofFromYear: String
      eofToMonth: String
      eofToYear: String
      eofNumberOfEmployment: Int
      index : Int,
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
      index : Int,
      privateFields:[PrivateKeys]
    }
    type ReviewOfCompany{
      rofYear: String
      rofValue: Int
      rofAbout: String
      index : Int,
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
      ebdDepartmentName:String,
      privateFields:[PrivateKeys]
    }
        
   type chartsOutput{
      employmentOfCompanyChart:[EmploymentOfCompany]
      profitRevenueLiabilityChart:[ProfitRevenueLiability]
      reviewOfCompanyChart:[ReviewOfCompany]
      employeeBreakupDepartmentChart:[EmployeeBreakupDepartment]
   }
   
   type StartupPortfolio{
      aboutUs           : aboutUsOutput
      rating            : ratingOutput
      serviceProducts   : serviceProductsOutput
      information       : informationOutput
      technologies      : [technologiesOutput]
      assets            : [assetsOutput]
      branches          : [branchesOutput]
      clients           : [clientsOutput]
      legalIssue        : legalIssueOutput
      management        : [startupManagementOutput],
      investor          : [investorOutput],
      data              : dataOutput,
      charts            : chartsOutput,
      awardsRecognition : [awardsRecognitionOutput],
      memberships       : membershipsOutput,
      compliances       : compliancesOutput,
      licenses          : licensesOutput,
      lookingFor        : [lookingForOutput]
   }
    
    
    
    input logo{
      fileName : String,
      fileUrl:String
    }
    
    input startupManagement{
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
  
    input clients{
        companyName:String,
        isCompanyNamePrivate:Boolean,
        logo:logo,
        clientDescription:String,
        isDescriptionPrivate:Boolean,
        makePrivate:Boolean,
        index:Int
    }
    
    input branches{
        addressTypeId:String,
        branchName:String,
        isNamePrivate:Boolean,
        branchPhoneNumber:String,
        isPhoneNumberPrivate:Boolean,
        branchAddress1:String,
        isAddressOnePrivate:String,
        branchAddress2:String,
        isAddressTwoPrivate:Boolean,
        branchLandmark:String,
        isLandmarkPrivate:Boolean,
        branchArea:String,
        isAreaPrivate:Boolean,
        branchCity:String,
        cityId:String,
        isCityPrivate:Boolean,
        branchState:String,
        stateId:String,
        isStatePrivate:Boolean,
        branchCountry:String
        countryId:String,
        isCountryPrivate:Boolean,
        addressImage : String,
        isAddressImagePrivate:Boolean,
        logo:logo,
        makePrivate:Boolean,
        index:Int
    }
    
    input assets{
      assetTypeId:String,
      assetTypeName:String
      isAssetTypePrivate:Boolean,
      quantity:String,
      isQuantityTypePrivate:Boolean,
      assetDescription:String,
      isDescriptionPrivate:Boolean,
      logo:logo,
      makePrivate:Boolean,
      index:Int
    }
    
    input technologies{
        technologyId:String,
        technologyName:String,
        technologyDescription:String,
        isTechnologyPrivate:Boolean,
        isDescriptionPrivate:Boolean,
        logo:logo,
        makePrivate:Boolean,
        index:Int
    }
    
    input investor{
        investorName:String,
        fundingType:String,
        fundingTypeId:String,
        investmentAmount:String,
        investorImage:String,
        investorDescription:String,
        isNamePrivate:Boolean,
        isInvestorImagePrivate:Boolean,
        isInvestmentAmountPrivate:Boolean,
        isDescriptionPrivate:Boolean,
        logo:logo,
        makePrivate:Boolean
        index: Int
    }
    
    input lookingFor{
        lookingForName:String,
        lookingForId:String,
        isTypePrivate:Boolean,
        lookingDescription:String,
        isDescriptionPrivate:Boolean,
        logo:logo,
        makePrivate:Boolean
        index: Int
    }
    

    input information{
        informationDescription:String,
        isDescriptionPrivate:Boolean
    }
    
    input serviceProducts{
        spDescription:String,
        isDescriptionPrivate:Boolean
    }
    
    input legalIssue{
        legalDescription:String,
        isDescriptionPrivate:Boolean
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
    
    input aboutUs{
        logo      : [imageFilesInputSchema]
        startupDescription : String
        annotatorId : String
        isLogoPrivate :Boolean
        isDescriptionPrivate : Boolean
    }
    
    input awardsRecognition{
          awardName:String
          awardId:String
          isAwardPrivate:Boolean
          year:String
          isYearPrivate:Boolean
          awardsDescription:String
          isDescriptionPrivate:Boolean
          makePrivate:Boolean
          logo : logo,
          index: Int
    }

    input memberships{
        membershipDescription:String, 
        isDescriptionPrivate :Boolean
    }
    
    input compliances{
        complianceDescription:String, 
        isDescriptionPrivate :Boolean
    }
    
    input licenses{
        licenseDescription:String, 
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
      ebdDepartmentName:String
      ebdNumberOfEmployment: Int
      ebdAbout: String
      index : Int
    }
   
    input startupPortfolio{
        portfolioDetailsId  : String
        licenses            : licenses
        compliances         : compliances
        memberships         : memberships
        awardsRecognition : [awardsRecognition]
        aboutUs             : aboutUs
        rating              : rating
        serviceProducts     : serviceProducts
        information         : information
        lookingFor          : [lookingFor]
        investor            : [investor]
        technologies        : [technologies]
        assets              : [assets]
        branches            : [branches]
        clients             : [clients]
        management          : [startupManagement]
        employmentOfCompanyChart: [employmentOfCompany]
        reviewOfCompanyChart: [reviewOfCompany]
        profitRevenueLiabilityChart:  [profitRevenueLiability]
        employeeBreakupDepartmentChart: [employeeBreakupDepartment]
        legalIssue          : legalIssue
        data                : data
    }
    type startupPortfolioOutput{
        _id                  : String
        userId               : String
        communityType        : String
        portfolioDetailsId   : String
        aboutUs              : aboutUsOutput
        chapterName         : String
        accountType         : String
        firstName            : String
        lastName            : String
        likes               : Int
        connections         :Int
        views               :Int
        followings          :Int
        profileImage        : String
        isDefaultSubChapter : Boolean
        subChapterName : String
    }
    
    type Query{
        fetchStartupPortfolioAboutUs(portfoliodetailsId:String!):startupPortfolioAboutUsOutput
        fetchStartupPortfolioMemberships(portfoliodetailsId:String!):membershipsOutput
        fetchStartupPortfolioCompliances(portfoliodetailsId:String!):compliancesOutput
        fetchStartupPortfolioLicenses(portfoliodetailsId:String!):licensesOutput
        fetchStartupPortfolioManagement(portfoliodetailsId:String!):[startupManagementOutput]
        fetchStartupPortfolioInvestor(portfoliodetailsId:String!):[investorOutput]
        fetchStartupPortfolioLookingFor(portfoliodetailsId:String!):[lookingForOutput]
        fetchStartupPortfolioAwards(portfoliodetailsId:String!):[awardsRecognitionOutput]
        fetchStartupPortfolioCharts(portfoliodetailsId:String):chartsOutput
        fetchStartupPortfolioData(portfoliodetailsId:String):dataOutput
        fetchPortfolioMenu(image: String, link: String, communityType: String, templateName: String, id: String, isLink: Boolean, isMenu: Boolean): portfolioMenu
        fetchStartupDetails(portfoliodetailsId:String!, key:String):StartupPortfolio
    }
    
    type Mutation{
        createStartupPortfolio(portfolio:startupPortfolio):response
        updateStartupPortfolio(portfoliodetailsId:String,portfolio:startupPortfolio):response
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], startupPortfolioSchema]);

let supportedApi = [
  {api:'fetchStartupPortfolioAboutUs', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupPortfolioMemberships', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupPortfolioCompliances', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupPortfolioLicenses', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupPortfolioManagement', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupPortfolioInvestor', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupPortfolioLookingFor', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupPortfolioAwards', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupPortfolioCharts', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupPortfolioData', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchPortfolioMenu', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchStartupDetails', actionName:'READ', moduleName:"PORTFOLIO"},

  {api:'createStartupPortfolio', actionName:'CREATE', moduleName:"PORTFOLIO"},
  {api:'updateStartupPortfolio', actionName:'UPDATE', moduleName:"PORTFOLIO"},
  {api:'createStartupPortfolioChart', actionName:'UPDATE', moduleName:"PORTFOLIO"}
]
MlResolver.MlModuleResolver.push(supportedApi)
