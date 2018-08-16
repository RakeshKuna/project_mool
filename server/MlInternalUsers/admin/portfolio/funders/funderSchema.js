/**
 * Created by venkatsrinag on 24/4/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef';
import MlResolver from '../../../../commons/mlResolverDef'

let FunderPortfolioSchema = `

    type SuccessStories{
        date:String,
        isDatePrivate : Boolean
        storyImage:String,
        storyTitle:String,
        isStoryTitlePrivate:Boolean,
        description:String,
        isDescPrivate:Boolean,
        isActive:Boolean
        index: Int
        logo:imagesTypeSchema,
        privateFields:[PrivateKeys],
        makePrivate:Boolean
    }
    
     type imagesTypeSchema{
        fileUrl   : String,
        fileName  : String
    }
    
    type AreaOfInterest{
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
    
    type SocialLinks{
        socialLinkType:String,
        userId:String,
        isUserIdPrivate:Boolean
    }
    
    type Team{
        title:String,
        firstName:String,
        isFirstNamePrivate:Boolean,
        lastName:String,
        isLastNamePrivate:Boolean,
        designation:String,
        isDesignationPrivate:Boolean,
        teamcompanyName:String,
        isCompanyNamePrivate:Boolean,
        duration:String,
        isDurationPrivate:Boolean,
        yearsOfExperience:String,
        isYearsOfExperiencePrivate:Boolean,
        qualification:String,
        isQualificationPrivate:Boolean,
        aboutTeam:String,
        isAboutTeamPrivate:Boolean,
        socialLinks:[SocialLinks],
        linkedinUrl:String,
        isLinkedinUrlPrivate:Boolean,
        index: Int,
        logo:imagesTypeSchema,
        privateFields:[PrivateKeys],
        makePrivate:Boolean
    }

    type Principal{
        title:String,
        firstName:String,
        isFirstNamePrivate:Boolean,
        lastName:String,
        isLastNamePrivate:Boolean,
        designation:String,
        isDesignationPrivate:Boolean,
        principalcompanyName:String,
        isCompanyNamePrivate:Boolean,
        duration:String,
        isDurationPrivate:Boolean,
        yearsOfExperience:String,
        isYearsOfExperiencePrivate:Boolean,
        qualification:String,
        isQualificationPrivate:Boolean,
        aboutPrincipal:String,
        isAboutPrincipalPrivate:Boolean,
        socialLinks:[SocialLinks],
        linkedinUrl:String
        isLinkedinUrlPrivate:Boolean
        index:Int,
        logo:imagesTypeSchema,
        privateFields:[PrivateKeys],
        makePrivate:Boolean
    }
    
    type Investments{
        dateOfInvestment:String,
        isDateOfInvestmentPrivate :Boolean
        investmentcompanyName:String,
        isCompanyNamePrivate:Boolean,
        typeOfFundingId:String,
        typeOfFundingName : String,
        isTypeOfFundingPrivate:Boolean,
        aboutInvestment:String,
        isAboutInvestmentPrivate:Boolean,
        makePrivate:Boolean,
        investmentAmount :String,
        isInvestmentAmountPrivate :Boolean
        index: Int
        privateFields:[PrivateKeys]
    }
    type Duration{
        hours: String
        minutes: String
    }
    
    type Attachments {
        documentName: String
        images: [String]
    }
    
    type Services{
        dateOfService:String
        isDateOfServicePrivate :Boolean
        industryType:[String]
        conversationType:[String]
        about:String
        expectedInput : String
        expectedOutput:String
        mode:Boolean
        session:String
        duration:Duration
        attachments :[Attachments]
        isPrivate :Boolean
        index: Int
  }
    
    
    type Investmentbudget{
        from:String
        isFromPrivate:Boolean
        to:String
        isToPrivate:Boolean
    }
    type FunderAbout{
        firstName : String,
        isFirstNamePrivate:Boolean,
        lastName:String
        isLastNamePrivate:Boolean
        gender:String
        isGenderPrivate:Boolean
        category:String
        isCategoryPrivate:Boolean
        qualification:String
        isQualificationPrivate:Boolean
        employmentStatus:String
        isEmploymentStatusPrivate:Boolean
        professionalTag:String
        isProfessionalTagPrivate:Boolean
        yearsOfExperience:String
        isYearsOfExperiencePrivate:Boolean
        industry:String
        isIndustryPrivate:Boolean
        profession:String
        isProfessionPrivate:Boolean
        investmentFrom:String
        investmentCount:String
        isInvestmentCountPrivate:Boolean
        emailId:String
        isEmailIdPrivate:Boolean
        mobileNumber:String
        isMobileNumberPrivate:Boolean
        linkedinUrl:String
        isLinkedinUrlPrivate:Boolean
        facebookUrl:String
        isFacebookUrlPrivate:Boolean
        investmentBudget:Investmentbudget,
        profilePic: String
        privateFields:[PrivateKeys]
    }
    
    type FunderPortfolio{
        portfolioDetailsId  : String,
        funderAbout         : FunderAbout,
        investments         : [Investments],
        principal           : [Principal],
        team                : [Team],
        areaOfInterest      : [AreaOfInterest],
        successStories      : [SuccessStories]
        lookingFor          : [lookingForOutput]
        services            : Services
        chapterName         : String
        accountType         : String
        communityType       : String
        firstName           : String
        lastName            : String
        profileImage        : String
        isDefaultSubChapter : Boolean
        subChapterName : String
    }
  
    input successStories{
        date:String,
        isDatePrivate : Boolean
        storyImage:String,
        storyTitle:String,
        isStoryTitlePrivate:Boolean,
        description:String,
        isDescPrivate:Boolean,
        isActive:Boolean
        index: Int,
        makePrivate:Boolean
    }

    input areaOfInterest{
        industryTypeId:String,
        industryTypeName :String
        domainType:String,
        makePrivate:Boolean,
        isActive:Boolean
        subDomainId : String
        subDomainName :String
        index: Int
    }

    input socialLinks{
        socialLinkType:String,
        userId:String,
        isUserIdPrivate:Boolean
    }
    
    input team{
        title:String,
        firstName:String,
        isFirstNamePrivate:Boolean,
        lastName:String,
        isLastNamePrivate:Boolean,
        designation:String,
        isDesignationPrivate:Boolean,
        teamcompanyName:String,
        isCompanyNamePrivate:Boolean,
        duration:String,
        isDurationPrivate:Boolean,
        yearsOfExperience:String,
        isYearsOfExperiencePrivate:Boolean,
        qualification:String,
        isQualificationPrivate:Boolean,
        aboutTeam:String,
        isAboutTeamPrivate:Boolean,
        socialLinks:[socialLinks],
        linkedinUrl:String
        isLinkedinUrlPrivate:Boolean
        index: Int,
        makePrivate:Boolean
    }

    input principal{
        title:String,
        firstName:String,
        isFirstNamePrivate:Boolean,
        lastName:String,
        isLastNamePrivate:Boolean,
        designation:String,
        isDesignationPrivate:Boolean,
        principalcompanyName:String,
        isCompanyNamePrivate:Boolean,
        duration:String,
        isDurationPrivate:Boolean,
        yearsOfExperience:String,
        isYearsOfExperiencePrivate:Boolean,
        qualification:String,
        isQualificationPrivate:Boolean,
        aboutPrincipal:String,
        isAboutPrincipalPrivate:Boolean,
        socialLinks:[socialLinks],
        linkedinUrl:String
        isLinkedinUrlPrivate:Boolean
        index:Int,
        makePrivate: Boolean
    }

    input investments{
        dateOfInvestment:String,
        isDateOfInvestmentPrivate :Boolean
        investmentcompanyName:String,
        isCompanyNamePrivate:Boolean,
        typeOfFundingId:String,
        typeOfFundingName : String,
        isTypeOfFundingPrivate:Boolean,
        aboutInvestment:String,
        isAboutInvestmentPrivate:Boolean,
        makePrivate:Boolean,
        investmentAmount :String,
        isInvestmentAmountPrivate :Boolean
        index: Int
    }
    
    input investmentbudget{
        from:String
        isFromPrivate:Boolean
        to:String
        isToPrivate:Boolean
    }
    input funderAbout{
        firstName : String,
        isFirstNamePrivate:Boolean,
        lastName:String
        isLastNamePrivate:Boolean
        gender:String
        isGenderPrivate:Boolean
        category:String
        isCategoryPrivate:Boolean
        qualification:String
        isQualificationPrivate:Boolean
        employmentStatus:String
        isEmploymentStatusPrivate:Boolean
        professionalTag:String
        isProfessionalTagPrivate:Boolean
        yearsOfExperience:String
        isYearsOfExperiencePrivate:Boolean
        industry:String
        isIndustryPrivate:Boolean
        profession:String
        isProfessionPrivate:Boolean
        investmentFrom:String
        investmentCount:String
        isInvestmentCountPrivate:Boolean
        emailId:String
        isEmailIdPrivate:Boolean
        mobileNumber:String
        isMobileNumberPrivate:Boolean
        linkedinUrl:String
        isLinkedinUrlPrivate:Boolean
        facebookUrl:String
        isFacebookUrlPrivate:Boolean
        investmentBudget:investmentbudget
        profilePic: String
    }
    
    
    input duration{
        hours: String
        minutes: String
    }
    
    input attachments {
        documentName: String
        images: [String]
    }
    
    input services{
        dateOfService:String
        isDateOfServicePrivate :Boolean
        industryType:[String]
        conversationType:[String]
        about:String
        expectedInput : String
        expectedOutput:String
        mode:Boolean
        session:String
        duration:duration
        attachments :[attachments]
        isPrivate :Boolean
        index: Int
  }
    
    input funderPortfolio{
        portfolioDetailsId  : String,
        funderAbout         : funderAbout,
        investments         : [investments],
        principal           : [principal],
        team                : [team],
        areaOfInterest      : [areaOfInterest],
        successStories      : [successStories]
        services            : services
        lookingFor          : [lookingFor]
    }
    
    type Query{
        fetchFunderDetails(portfoliodetailsId:String!, key:String): FunderPortfolio
        fetchFunderAbout(portfoliodetailsId:String!):FunderAbout
        fetchfunderPortfolioInvestor(portfoliodetailsId:String!):[Investments]
        fetchFunderPrincipal(portfoliodetailsId:String!):[Principal]
        fetchFunderTeam(portfoliodetailsId:String!):[Team]
        fetchFunderAreaOfInterest(portfoliodetailsId:String!):[AreaOfInterest]
        fetchFunderSuccessStories(portfoliodetailsId:String!):[SuccessStories]
        fetchfunderPortfolioService(portfoliodetailsId:String!):Services
    }
    
    type Mutation{
        createFunderPortfolio(portfolio:funderPortfolio):response
        updateFunderPortfolio(portfoliodetailsId:String, portfolio:funderPortfolio, indexArray:[String]):response
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], FunderPortfolioSchema]);

let supportedApi = [
  {api:'fetchFunderDetails', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchFunderAbout', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchfunderPortfolioInvestor', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchFunderPrincipal', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchFunderTeam', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchFunderAreaOfInterest', actionName:'READ', moduleName:"PORTFOLIO"},
  {api:'fetchFunderSuccessStories', actionName:'READ', moduleName:"PORTFOLIO"},
  {api: 'fetchfunderPortfolioService',actionName:'READ', moduleName:"PORTFOLIO" },

  {api:'createFunderPortfolio', actionName:'CREATE', moduleName:"PORTFOLIO"},
  {api:'updateFunderPortfolio', actionName:'UPDATE', moduleName:"PORTFOLIO"},


]
MlResolver.MlModuleResolver.push(supportedApi)
/**
 * Note: graphQl schema to be used multiple times hence using only onces
 * @lookingFor  : startup
 * @lookingForOutput : startup
 * */
