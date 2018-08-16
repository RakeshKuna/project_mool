import {mergeStrings} from "gql-merge";
import MlSchemaDef from "../../../commons/mlSchemaDef";
import MlResolver from "../../../commons/mlResolverDef";

let registrationSchema = `        
    
    type ContactInfoSchema{
      numberType        : String
      numberTypeName        : String
      countryCode           : String
      contactNumber       : String
        
    }
    
     type EmailInfoSchema{
      emailIdType        : String
      emailIdTypeName        : String
      emailId           : String
     }
     
     type AddressInfoSchema{
        addressType        : String
        addressTypeName        : String
        name             : String
        phoneNumber      :  String
        addressFlat      :  String
        addressLocality      :  String
        addressLandmark      :  String
        addressArea      :  String
        addressCity      :  String
        addressCityId : String
        addressState      :  String
        addressStateId  :String
        addressCountry : String
        addressCountryId : String
        addressPinCode : String
        latitude        :  Float
        longitude       :  Float
        isDefaultAddress:Boolean
     }
     
     type SocialLinkInfoSchema{
        socialLinkTypeName    : String
        socialLinkType        : String
        socialLinkUrl         : String
     }
     type docFilesInputSchema{
       fileId:String,
       fileUrl: String,
       fileName:String,
       fileSize: String
     }
      type kycDocumentInfoSchema{
        docTypeName: String,
        docTypeId: String,
        kycCategoryId:String,
        kycCategoryName: String,
        documentId:String,
        documentDisplayName:String,
        documentName:String,
        isMandatory:Boolean,
         isActive:Boolean,
        allowableFormat:[String],
        allowableMaxSize:String,
        docFiles:[docFilesInputSchema],
        status: String
      }
    type Registration{
         _id            : String
         addressInfo     : [AddressInfoSchema]
         emailInfo       : [EmailInfoSchema]
         contactInfo     : [ContactInfoSchema]
         socialLinkInfo : [SocialLinkInfoSchema]
         kycDocuments    :[kycDocumentInfoSchema]
    }
   
    input ContactInfo{
      numberType        : String
      numberTypeName        : String
      countryCode           : String
      contactNumber       : String
    }
    
    input EmailInfo{
       emailIdType        : String
       emailIdTypeName        : String
       emailId           : String
    }
    
    input AddressInfo{
      addressType       : String
      addressTypeName  : String
      name             : String
      phoneNumber      :  String
      addressFlat      :  String
      addressLocality      :  String
      addressLandmark      :  String
      addressArea      :  String
      addressCity      :  String
      addressCityId : String
      addressState      :  String
      addressStateId  :String
      addressCountry : String
      addressCountryId : String
      addressPinCode : String
      latitude        :  Float
      longitude       :  Float
      isDefaultAddress:Boolean
    }
    
    input SocialLinkInfo{
       socialLinkTypeName    : String
       socialLinkType        : String
       socialLinkUrl         : String
     }
     
     input docFilesInput{
       fileId:String,
       fileUrl: String,
       fileName:String,
       fileSize: String
     
     }
    
    input KycDocumentInfo{
      docTypeName: String,
      docTypeId: String,
      kycCategoryId:String,
      kycCategoryName: String,
      documentId:String,
      documentDisplayName:String,
      documentName:String,
      isMandatory:Boolean,
      isActive:Boolean,
      allowableFormat:[String],
      allowableMaxSize:String,
      docFiles:[docFilesInput],
      status: String
    }
    input registrationObject{
        socialLinksInfo:[SocialLinkInfo],
        addressInfo:[AddressInfo],
        emailInfo : [EmailInfo],
        contactInfo:[ContactInfo]
        kycDocuments:[KycDocumentInfo]
    }
    
    input registrationInfoInput{
    registrationId      :   String,
        industry        :   String,
        profession      :   String,
        userType        :   String,
        identityType    :   String,
        firstName       :   String,
        lastName        :   String,
        countryId       :   String,
        countryName     :   String,
        contactNumber   :   String,
        email           :   String,
        cityId          :   String,
        cityName        :   String,
        registrationType:   String,
        userName        :   String,
        password        :   String,
        accountType     :   String,
        institutionAssociation    :   String,
        companyname     :   String,
        companyUrl      :   String,
        remarks         :   String,
        referralType    :   String,
        clusterId       :   String,
        clusterName     :   String,
        chapterId       :   String,
        chapterName     :   String,
        subChapterId    :   String,
        subChapterName  :   String,
        communityId     :   String,
        communityName   :   String,
        source          :   String,
        deviceName      :   String,
        deviceNumber    :   String,
        ipAddress       :   String,
        ipLocation      :   String,  
        registrationDate:   Date,
        userId          :   String,
        registrationStatus        :   String,
        assignedUser    :   String,
        profileImage    :   String,
        status          :   String,
        createdBy       :   String,
        promoCode       :   String,
        campaignCode    :   String,
        transactionUpdatedDate : Date
    }
    
     type emailVerification{
          address  : String
          verified  : Boolean
    }
    
    type RegistrationResponse{
        _id             :   String,
         status          :   String,
         registrationInfo :  RegistrationInfo,
         registrationDetails : RegistrationDetails
         addressInfo     : [AddressInfoSchema]
         emailInfo       : [EmailInfoSchema]
         contactInfo     : [ContactInfoSchema]
         socialLinksInfo : [SocialLinkInfoSchema]
         kycDocuments: [kycDocumentInfoSchema]
         transactionId : String
         transactionType : String
         allocation     : allocation
         transactionCreatedDate : String
         emails  : [emailVerification]
         isAllowRegisterAs : Boolean
         pendingRegId : String
         externalUserProfiles : [ExternalProfile]
         isActive : Boolean
         firstName : String
         profileImage : String
         headerCommunityDisplay : String
         isShowOnMap : Boolean,
         isCalendar: Boolean
         promoCode       :   String,
         campaignCode    :   String
         userProfileImage : String
        portfolioStatus : String
    }
    
   
    
    
    type RegistrationInfo{        
        _id             :   String,
        registrationId  :   String,
        userType        :   String,
        industry        :   String,
        profession      :   String,
        identityType    :   String,
        firstName       :   String,
        lastName        :   String,
        countryId       :   String,
        countryCode     :   String,
        countryName     :   String,
        contactNumber   :   String,
        email           :   String,
        cityId          :   String,
        cityName        :   String,
        registrationType:   String,
        userName        :   String,
        password        :   String,
        accountType     :   String,
        institutionAssociation    :   String,
        companyname     :   String,
        companyUrl      :   String,
        remarks         :   String,
        referralType    :   String,
        clusterId       :   String,
        clusterName     :   String,
        chapterId       :   String,
        chapterName     :   String,
        subChapterId    :   String,
        subChapterName  :   String,
        communityId     :   String,
        communityName   :   String,
        source          :   String,
        deviceName      :   String,
        deviceNumber    :   String,
        ipAddress       :   String,
        ipLocation      :   String,  
        registrationDate:   Date,
        userId          :   String,
        registrationStatus        :   String,
        assignedUser    :   String,
        profileImage    :   String,
        transactionId   :   String
        assignedUserId    :   String,
        createdBy       :   String,
        allocationStatus :  String,
        promoCode       :   String,
        campaignCode    :   String,
        transactionUpdatedDate : Date
        
    }
    
    type branchLocation{
        id              :   String,
        name            :   String
    }
    
    type citizenship{
        id              :   String,
        name            :   String
    }
    
    type RegistrationDetails{    
          userType: String,
          companyName: String,
          groupName: String,
          companyWebsite:  String,
          companyEmail: String,
          foundationDate:  String,
          headQuarterLocation: String,
          branchLocations: [String],  
          companytyp: String,
          entityType:  String,
          businessType: String,
          industry: String,
          subDomain:  [String],
          stageOfCompany:  String,
          subsidaryCompany: String,
          parentCompany: String,
          registrationNumber: String,
          isoAccrediationNumber:String,
          companyTurnOver: String,
          partnerCompanies: String,
          investors: String,
          lookingFor:  String,
          companyCEOName: String,
          companyManagement: String,
          toatalEmployeeCount: String,
          associatedCompanies:  String,
          investingFrom:String,
          currency:String,
          investmentAmount:String,

              
          userCategory: String,
          institutionType:String,
          instituteName:  String,
          instituteGroupName: String,
          foundationYear:  String,
          website:String,
          registrationNumber: String,
          isoAccrediationNumber: String,
          curriculamProvider: String,
          associatedUniversity: String,
          studentCount:  String,
          staffCount:String,
          chairman: String,
          dean:  String,
            
          
          identityType : String,
          userType : String,
          title :  String,
          firstName : String,
          middleName : String,
          lastName :String,
          displayName :  String,
          dateOfBirth :  String,
          gender : String,
          citizenships : String,  
          qualification :String,
          employmentStatus : String,
          professionalTag : String,
          industry :  String,
          profession : String,
          employerName :String,
          employerWebsite :  String,
          employmentDate :String,
          experience : String
    }
    
    input branchLocationInput{
        id              :   String,
        name            :   String
    }
    
    input citizenshipInput{
        id              :   String,
        name            :   String
    }
    
    input RegistrationDetailsInput{    
          userType: String,
          companyName: String,
          groupName: String,
          companyWebsite:  String,
          companyEmail: String,
          foundationDate:  String,
          headQuarterLocation: String,
          branchLocations: [String]
          companytyp: String,
          entityType:  String,
          businessType: String,
          industry: String,
          subDomain:  [String],
          stageOfCompany:  String,
          subsidaryCompany: String,
          parentCompany: String,
          registrationNumber: String,
          isoAccrediationNumber:String,
          companyTurnOver: String,
          partnerCompanies: String,
          investors: String,
          lookingFor:  String,
          companyCEOName: String,
          companyManagement: String,
          toatalEmployeeCount: String,
          associatedCompanies:  String,
          investingFrom:String,
          currency:String,
          investmentAmount:String,
              
          userCategory: String,
          institutionType:String,
          instituteName:  String,
          instituteGroupName: String,
          foundationYear:  String,
          website:String,
          registrationNumber: String,
          isoAccrediationNumber: String,
          curriculamProvider: String,
          associatedUniversity: String,
          studentCount:  String,
          staffCount:String,
          chairman: String,
          dean:  String,
      
          identityType : String,
          userType : String,
          title :  String,
          firstName : String,
          middleName : String,
          lastName :String,
          displayName :  String,
          dateOfBirth :  String,
          gender : String,
          citizenships : String,   
          qualification :String,
          employmentStatus : String,
          professionalTag : String,
          industry :  String,
          profession : String,
          employerName :String,
          employerWebsite :  String,
          employmentDate :String,
          experience : String
    }
    
    type Mutation{
         registerAs(registrationId:String!,registration: registrationInfoInput!, moduleName:String!, actionName:String!):response
         createRegistrationAPI(registration: registrationInfoInput!):response
         createRegistration(registration: registrationInfoInput!, moduleName:String!, actionName:String!):response
         updateRegistration(registrationId:String, registration: registrationObject, moduleName:String, actionName:String):response       
         updateRegistrationInfo(registrationId:String,registrationDetails:registrationInfoInput,details:RegistrationDetailsInput):response
         updateRegistrationUploadedDocumentUrl(registrationId:String,docUrl:String,document:String,documentId:String):response         
         createGeneralInfoInRegistration(registration: registrationObject!, moduleName:String!, actionName:String!, registrationId:String!,type:String!):response
         updateRegistrationGeneralInfo(registration: registrationObject!, moduleName:String!, actionName:String!, registrationId:String!,type:String!):response
         ApprovedStatusOfDocuments(documentId:[String],docTypeId:[String],moduleName:String!,actionName:String!, registrationId:String!):response
         RejectedStatusOfDocuments(documentId:[String],docTypeId:[String],moduleName:String!,actionName:String!, registrationId:String!):response
         RemoveFileFromDocuments(fileId:String,docTypeId:String,documentId:String,moduleName:String!,actionName:String!, registrationId:String!):response
         ApprovedStatusForUser(moduleName:String!,actionName:String!, registrationId:String!):response
         RejectedStatusForUser(moduleName:String!,actionName:String!, registrationId:String!,regType:String):response
         sendEmailVerificationForRegistration(registrationId:String):response
         sendSmsVerificationForRegistration(registrationId:String):response
         sendEmailVerification(userId:String):response
         sendSmsVerification(userId:String):response
         sendUserSmsVerification:response
         resendUserSmsVerification:response
         verifyUserMobileNumber(mobileNumber:String,otp:Int):response
         resendSmsVerification(mobileNumber:String):response
         verifyEmail(token:String):response
         verifyMobileNumber(mobileNumber:String,otp:Int):response
         verifyLaterUserMobileNumber(mobileNumber:String):response
         forgotPassword(email:String):response
         resetPasswords(token:String, password:String):response
         createKYCDocument(registrationId:String,documentID:String,kycDocID:String,docTypeID:String):response
    }
    type Query{
        findRegistration(registrationId:String):Registration
        findRegistrationInfo(registrationId:String):RegistrationResponse
        findRegistrationInfoForUser:RegistrationResponse
        fetchContextClusters: [Cluster]
        fetchContextChapters(id:String): [Chapter]
        fetchContextSubChapters(id:String): [SubChapter]
        findUserPendingRegistration:[RegistrationResponse] 
        findRegistrationInfoUser(registrationId:String):RegistrationResponse
    }
    
`
MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], registrationSchema]);
let supportedApi = [
    {api:'findRegistration', actionName:'READ', moduleName:"REGISTRATION"},
    {api:'findRegistrationInfo', actionName:'READ', moduleName:"REGISTRATION"},
    {api:'findRegistrationInfoForUser', actionName:'READ', moduleName:"REGISTRATION", isAppWhiteList:true},
    {api:'registerAs', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'createRegistrationAPI', actionName:'CREATE', moduleName:"REGISTRATION"},
    {api:'createRegistration', actionName:'CREATE', moduleName:"REGISTRATION"},
    {api:'createGeneralInfoInRegistration', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'updateRegistration', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'updateRegistrationInfo', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'updateRegistrationUploadedDocumentUrl', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'updateRegistrationGeneralInfo', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'ApprovedStatusOfDocuments', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'RejectedStatusOfDocuments', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'RemoveFileFromDocuments', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'ApprovedStatusForUser', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'RejectedStatusForUser', actionName:'UPDATE', moduleName:"REGISTRATION"},
    {api:'sendEmailVerificationForRegistration', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'sendSmsVerificationForRegistration', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'sendEmailVerification', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'sendUserSmsVerification', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'resendUserSmsVerification', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'verifyUserMobileNumber', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'resendSmsVerification', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'verifyEmail', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'verifyLaterUserMobileNumber', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'verifyMobileNumber', actionName:'UPDATE', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'fetchContextClusters', actionName:'READ', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'fetchContextChapters', actionName:'READ', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'fetchContextSubChapters', actionName:'READ', moduleName:"REGISTRATION", isWhiteList:true},
    {api:'forgotPassword', actionName:'READ', moduleName:"REGISTRATION"},
    {api:'createKYCDocument',actionName:'UPDATE',moduleName:"REGISTRATION"},
    {api:'findUserPendingRegistration',actionName:'READ',moduleName:"REGISTRATION", isWhiteList:true},
    {api: 'findRegistrationInfoUser', actionName: 'READ', moduleName: "REGISTRATION", isWhiteList: true}
]
MlResolver.MlModuleResolver.push(supportedApi)
