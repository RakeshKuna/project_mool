/**
 * Created by muralidhar on 14/02/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let BackEndUser = `

    type BackendUsers{
        _id: String,
        password: String,
        username: String,
        profile:userProfile,
        roleNames:[String],
        latitude:Float,
        longitude:Float,
        name: String,
        clusterName:String
        communityCode : String
        portfolioId:String,
    }
    type ExternalUsers{
        _id: String,
        username: String,
        profile:ExternalUserProfile,
        mobileNumbers:[MobileNumbers]
    }
    type MobileNumbers{
        mobileNumber: String,
        verified: Boolean,
        countryId: String,
    }
    
    type ExternalUserProfile{
        isInternaluser: Boolean,
        isExternaluser: Boolean,
        isActive: Boolean,
        email: String,
        profileImage:String,
        dateOfBirth: Date,
        genderType: String,
        firstName: String,
        middleName: String,
        lastName: String,
        externalUserProfiles:[ExternalProfile],
        externalUserAdditionalInfo:[externalUserAdditionalInfoSchema],
        firebaseInfo: firebaseInfo
    }
    
    type userProfile{
        isInternaluser: Boolean,
        isExternaluser: Boolean,
        isMoolya      : Boolean
        isActive: Boolean,
        isChapterAdmin :Boolean,
        email: String,
        InternalUprofile: internalUserprofile,
        profileImage:String,
        numericalFormat: String,
        currencyTypes: String,
        languages: String
        timeZone: String
        dateOfBirth: Date,
        genderType: String,
        firstName: String,
        middleName: String,
        lastName: String,
        about : String
    }
    
     type internalUserprofile{
        moolyaProfile: MoolyaProfile
    }
    
    type AssignedDepartment{
        department: String,
        subDepartment: String
    }
    
    type Contacts{
        contactNumberType:String,
        countryCode:String,
        number:String,
        isOTPValidated:Boolean
    }
    
    type UserProfiles{
        isDefault: Boolean,
        clusterId: String,
        clusterName:String,
        clusterFlag:String,
        userRoles:[UserRoles],
    }
    
    
    type UserRoles{
        roleId:String,
        roleName:String,
        clusterId:String,
        chapterId:String,
        validFrom: String,
        validTo: String,
        subChapterId:String,
        communityId:String,
        communityCode:String,
        communityHierarchyLevel:Int,
        isActive:Boolean,
        hierarchyLevel:String,
        hierarchyCode:String,
        departmentId: String,
        departmentName : String,
        subDepartmentId : String,
        subDepartmentName : String,
        chapterName:String,
        subChapterName:String,
        communityName:String,
        clusterName : String
        isAnchor : Boolean
    }
    
    type MoolyaProfile{
        firstName: String,
        middleName: String,
        lastName: String,
        userType: String,
        isChapterAdmin : Boolean,
        subChapter: String,
        roleType: String,
        assignedDepartment:[AssignedDepartment],
        displayName: String,
        email:String,
        contact:[Contacts],
        socialLinksInfo     : [SocialLinkInfoSchema]
        globalAssignment:Boolean,
        isActive:Boolean,
        userProfiles:[UserProfiles]
    }

     input assignedDepartment{
        department: String,
        subDepartment: String
    }
    
    input contacts{
        contactNumberType:String,
        countryCode:String,
        number:String,
        isOTPValidated:Boolean
    }
    
    input userRoles{
        roleId:String,
        clusterId:String,
        validFrom:String,
        validTo:String,
        chapterId:String,
        subChapterId:String,
        communityId:String,
        communityCode:String,
        isActive:Boolean,
        hierarchyLevel:Int,
        communityHierarchyLevel:Int,
        hierarchyCode:String,
        roleName:String,
        departmentId: String,
        departmentName : String,
        subDepartmentId : String,
        subDepartmentName : String
        isAnchor : Boolean
    }
    
    input userprofiles{
        isDefault: Boolean,
        clusterId: String,
        userRoles:[userRoles]
    }
  
    input moolyaProfile{
        firstName: String,
        middleName: String,
        lastName: String,
        userType: String,
        subChapter: String,
        roleType: String,
        assignedDepartment:[assignedDepartment],
        displayName: String,
        email:String,
        contact:[contacts],
        globalAssignment:Boolean,
        socialLinksInfo    : [SocialLinkInfo]
        isActive:Boolean,
        userProfiles:[userprofiles],
        profileImage:String,
        numericalFormat: String,
        currencyTypes: String,
        languages: String
        timeZone: String
        dateOfBirth: Date,
        genderType: String
        isAnchor : Boolean
    }

    input InternalUprofile{
        moolyaProfile: moolyaProfile
    }
    
    input externalProfile{
        profileId         : String,
        registrationId    : String,
        countryName       : String,
        countryId         : String,
        cityName          : String,
        cityId            : String,
        mobileNumber      : String,
        clusterId         : String,
        clusterName       : String,
        chapterId         : String,
        chapterName       : String,
        subChapterId      : String,
        subChapterName    : String,
        communityId       : String,
        communityName     : String,
        communityType     : String,
        isDefault         : Boolean,
        isActive          : Boolean,
        accountType       : String,
        optional          : Boolean
    }
    
    type ExternalProfile{
        profileId         : String,
        registrationId    : String,
        countryName       : String,
        countryId         : String,
        cityName          : String,
        cityId            : String,
        mobileNumber      : String,
        clusterId         : String,
        clusterName       : String,
        chapterId         : String,
        chapterName       : String,
        subChapterId      : String,
        subChapterName    : String,
        communityId       : String,
        communityName     : String,
        communityType     : String,
        isDefault         : Boolean,
        isActive          : Boolean,
        accountType       : String,
        optional          : Boolean,
        displayName       : String,
        profileImage      : String
        identityType      : String
    }
    
    
    input up{
        userProfiles      : [externalProfile]        
    }
  
    input profile{
        isInternaluser    : Boolean,
        isExternaluser    : Boolean,
        isMoolya          : Boolean
        email             : String,
        isActive          : Boolean,
        isChapterAdmin    : Boolean,
        InternalUprofile  : InternalUprofile,
        externalUserProfiles:up
        profileImage:String,
        numericalFormat: String,
        currencyTypes: String,
        dateOfBirth: Date,
        genderType: String,
        profileImage: String,
        firstName: String,
        middleName: String,
        lastName: String,
        about : String
    }
    
    input userObject{
        username: String,
        password: String,
        profile:profile
    }
    
    input attributesObject{
      profileImage: String,
      firstName: String, 
      middleName:String, 
      lastName: String,
      userName: String,
      genderType: String,
      dateOfBirth: Date,
      frequency: String,
    }
    
    input settingsAttributesObject{
      currencyTypes: String,
      numericalFormat: String
      languages: [String]
      timeZone: String
    }
    
    
    type dep{
        department:String,
        departmentName:String,
        subDepartment:String,
        subDepartmentName:String,
        isAvailiable:Boolean
    }
    
    type anchorUsers {  
      userDetails : [userDetails]
      portfolioCounter : [Portfoliodetails]
    }
    
    type userDetails{
         _id: String
        alsoAssignedas: String,
        displayName:String,
        userName:String,
        deActive: Boolean,
        genderType: String,
        profileImage: String
    }
    
    type contextRoles{
        roleId:String,
        roleName:String,
        isChapterAdmin:Boolean,
        validFrom:String, 
        validTo:String, 
        isActive:Boolean,
        clusterId:String, 
        chapterId:String, 
        subChapterId:String, 
        communityId:String,
        hierarchyLevel:Int,
        hierarchyCode:String,
        departmentId:String,
        departmentName:String,
        subDepartmentId:String,
        subDepartmentName:String
        isAnchor      : Boolean
    }
   
    type mapCenterCords{
    lat:Float,
    lng:Float
    }
    
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
        addressState      :  String
        addressCountry : String
        addressPinCode : String
        latitude:Float,
        longitude:Float
     }
     
       type SocialLinkInfoSchema{
        socialLinkTypeName    : String
        socialLinkType        : String
        socialLinkUrl         : String
     }

     type firebaseInfo{
        frequency   : String
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
      addressState      :  String
      addressCountry : String
      addressPinCode : String
      latitude:Float,
      longitude:Float
    }
    
    input SocialLinkInfo{
       socialLinkTypeName    : String
       socialLinkType        : String
       socialLinkUrl         : String
    }
   
    
    input addressBook{
       addressInfo:[AddressInfo],
       emailInfo : [EmailInfo],
       contactInfo:[ContactInfo]
    }
    
    
    
    type addressBookSchema{
       addressInfo     : [AddressInfoSchema]
       emailInfo       : [EmailInfoSchema]
       contactInfo     : [ContactInfoSchema]
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
    
    type externalUserAdditionalInfoSchema{
       cluster            : String
       registrationId     : String
       profileId          : String
       addressInfo        : [AddressInfoSchema]
       emailInfo          : [EmailInfoSchema]
       contactInfo        : [ContactInfoSchema]
       socialLinksInfo     : [SocialLinkInfoSchema]
       kycDocuments       : [kycDocumentInfoSchema]   
    }
    
    input externalUserAdditionalInfo{
        cluster            : String
        registrationId     : String
        profileId          : String
        socialLinksInfo    : [SocialLinkInfo]
        addressInfo        : [AddressInfo]
        emailInfo          : [EmailInfo]
        contactInfo        : [ContactInfo]
        kycDocuments       : [KycDocumentInfo]
    }
    
    type CurrencyInfo {
        countryName        : String
        currencyName       : String
        currencyCode       : String
        isActive           : Boolean
        symbol             : String
        symbol_native      : String
        decimal_digits     : Int
        rounding           : Int
        name_plural        : String
    }
    
    type Mutation{
        createUser(user:userObject!,clusterId:String, chapterId: String, subChapterId: String, communityId: String):response           
        updateUser(userId:String!, user:userObject!, clusterId: String, chapterId: String, subChapterId: String, communityId: String):response                                    
        resetPassword (password: String!, moduleName:String, actionName:String):response
        addUserProfile(userId:String, user:userObject): String
        assignUsers(userId:String, user:userObject, moduleName:String, actionName:String): response
        deActivateUser(userId:String, isActive:Boolean): response
        updateDataEntry(moduleName: String, actionName: String, attributes:attributesObject):response
        updateSettings(userId: String, moduleName: String, actionName: String, settingsAttributes:settingsAttributesObject): response
        updateAddressBookInfo(userId: String, moduleName: String, actionName: String,type:String, addressBook:addressBook): response
        uploadUserImage(userId:String,moduleName:String,actionName:String,userProfilePic:String):response
        setAdminDefaultProfile(clusterId:String!):response
        switchProfile(clusterId:String!):response
        deActivateAdminUserProfile(clusterId:String!):response
    }
    
    type Query{
        fetchUserDetails(userId:String): userDetails
        fetchUser(userId:String): BackendUsers
        fetchExternalUserDetails: ExternalUsers
        fetchUsersByClusterDepSubDep(clusterId:String, chapterId:String, subChapterId:String, communityId:String): [BackendUsers]
        fetchUserDepSubDep(userId:String, clusterId:String):[dep]
        fetchUserRoles(userId:String):[contextRoles]
        fetchAssignedUsers(clusterId:String, chapterId:String, subChapterId:String, communityId:String,subChapterName:String): [BackendUsers]
        fetchUsersBysubChapterDepSubDep(clusterId:String, chapterId:String, subChapterId:String): [BackendUsers]
        fetchsubChapterUserDepSubDep(userId:String, clusterId:String, chapterId:String, subChapterId:String):[dep]  
        fetchAssignedAndUnAssignedUsers(clusterId:String, chapterId:String, subChapterId:String, communityId:String,subChapterName:String): [BackendUsers]
        fetchUsersForDashboard(clusterId:String, chapterId:String, subChapterId:String, userType:String,offset: Int,limit:Int,fieldsData:[GenericFilter]): SearchResp
        fetchUserTypeFromProfile:String
        fetchUserForReistration(clusterId:String, chapterId:String, subChapterId:String,communityId:String departmentId:String,subDepartmentId:String,roleId:String):[BackendUsers]
        fetchMapCenterCordsForUser(module:String, id:String):mapCenterCords
        fetchAddressBookInfo(moduleName: String, actionName: String):addressBookSchema
        findUserOnToken(token: String):response
        fetchInternalUserProfiles:[UserProfiles]
        fetchUserRoleDetails(clusterId:String):UserRoles
        fetchMoolyaInternalUsers : [BackendUsers]
        passwordVerification(Details:String):response
        getUserProfiles:[ExternalProfile]
        getUserProfile(profileId: String) : ExternalProfile
        fetchMyProfile(userId:String): BackendUsers
        getUserProfileForService(profileId: String): ExternalProfile
        findExternalUserAddressBook(registrationId:String): externalUserAdditionalInfoSchema
        findBranchAddressInfo: [AddressInfoSchema]
        fetchAnchorUsers(clusterId:String, chapterId:String, subChapterId:String, communityId:String): anchorUsers
        checkDefaultRole(userId: String): [UserProfiles]
        fetchCurrencyType(userId: String, portfolioDetailsId: String , profileId: String): CurrencyInfo
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],BackEndUser]);
let supportedApi = [
    {api:'fetchUserDetails', actionName:'READ', moduleName:"USERS", isWhiteList:true},
    {api:'fetchExternalUserDetails', actionName:'READ', moduleName:"USERS", isWhiteList:true},
    {api:'fetchUser', actionName:'READ', isWhiteList: true, moduleName:"USERS"},
    {api:'fetchUsersByClusterDepSubDep', actionName:'READ', moduleName:"USERS"},
    {api:'fetchUserDepSubDep', actionName:'READ', moduleName:"USERS", isWhiteList:true},
    {api:'fetchUserRoles', actionName:'READ', moduleName:"USERS", isWhiteList:true},
    {api:'fetchAssignedUsers', actionName:'READ', moduleName:"USERS"},
    {api:'fetchUsersBysubChapterDepSubDep', actionName:'READ', moduleName:"USERS"},
    {api:'fetchsubChapterUserDepSubDep', actionName:'READ', moduleName:"USERS"},
    {api:'fetchAssignedAndUnAssignedUsers', actionName:'READ', moduleName:"USERS"},
    {api:'fetchUsersForDashboard', actionName:'READ', moduleName:"USERS", isWhiteList:true},
    {api:'fetchUserTypeFromProfile', actionName:'READ', isWhiteList: true, moduleName:"USERS", isAppWhiteList:true},
    {api:'fetchMapCenterCordsForUser', actionName:'READ', isWhiteList: true, moduleName:"USERS"},
    {api:'fetchAddressBookInfo', actionName:'READ', moduleName:"USERS", isWhiteList: true},
    {api:'findUserOnToken', actionName:'READ', moduleName:"USERS"},
    {api:'fetchUserRoleDetails', actionName:'READ', moduleName:"USERS", isWhiteList:true},
    {api:'fetchMoolyaInternalUsers', actionName:'READ', moduleName:"USERS", isWhiteList:true},
    {api:'fetchInternalUserProfiles', actionName:'READ', moduleName:"USERS", isWhiteList:true},
    {api:'passwordVerification', actionName:'READ', moduleName:"USERS", isWhiteList:true},
    {api:'getUserProfiles', actionName:'READ', moduleName:"USERS"},
    {api:'getUserProfile',actionName:'READ', moduleName:"USERS"},
    {api:'getUserProfileForService',actionName:'READ', moduleName:"USERS"},
    {api:'fetchMyProfile',actionName:'READ', moduleName:"USERS", isWhiteList: true},
    {api:'findExternalUserAddressBook',actionName:'READ', moduleName:"USERS", isWhiteList: true},
    {api:'fetchAnchorUsers',actionName:'READ', moduleName:"USERS", isWhiteList: true},
    {api:'checkDefaultRole',actionName:'READ', moduleName:"USERS", isWhiteList: true},
    {api:'fetchCurrencyType',actionName:'READ', moduleName:"USERS", isWhiteList: true},

    {api:'createUser', actionName:'CREATE', moduleName:"USERS"},
    {api:'updateUser', actionName:'UPDATE', moduleName:"USERS"},
    {api:'resetPassword', actionName:'UPDATE', moduleName:"USERS", isWhiteList:true},
    {api:'addUserProfile', actionName:'UPDATE', moduleName:"USERS"},
    {api:'assignUsers', actionName:'UPDATE', moduleName:"USERS"},
    {api:'deActivateUser', actionName:'UPDATE', moduleName:"USERS"},
    {api:'updateDataEntry', actionName:'UPDATE', moduleName:"USERS", isWhiteList:true},
    {api:'updateSettings', actionName:'UPDATE', moduleName:"USERS", isWhiteList:true},
    {api:'updateAddressBookInfo', actionName:'UPDATE', moduleName:"USERS", isWhiteList:true},
    {api:'uploadUserImage', actionName:'UPDATE', moduleName:"USERS", isWhiteList:true},
    {api:'deActivateAdminUserProfile', actionName:'UPDATE', moduleName:"USERS", isWhiteList:true},
    {api:'setAdminDefaultProfile', actionName:'UPDATE', moduleName:"USERS", isWhiteList:true},
    {api:'switchProfile', actionName:'UPDATE', moduleName:"USERS", isWhiteList:true}
];
MlResolver.MlModuleResolver.push(supportedApi)
