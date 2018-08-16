import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../commons/mlSchemaDef';
import MlResolver from '../../commons/mlResolverDef'

let sharedLibrarySchema = `

    type userDetails{
      userId: String
      profileId: Boolean
      displayName: String
      profilePic: String
    }
    
    type fileDetails{
      url: String
      fileName: String
      fileType: String
      libraryDocumentId: String
    }
    
    type MemberInfo {
      userName:  String
      daysRemaining: Int
      fileUrl: String
      fileType: String
      profileImage: String
    }
    
     type AdminShareList {
      _id : String
      createdAt : Date
      createdBy : String
      userId : String
      profileId : String
      email : String
      mobileNumber : String
      cluster : String
      chapter : String
      subChapter : String
      community : String
      transactionType : String
      displayName: String
    }
    
    type ShareOwnerInfo {
      userId: String
      profileId: String
      name: String
      email : String
      mobileNumber: String
      cluster: String
      chapter: String
      subChapter: String
      community: String
    }
    
    type SharedOutput {
      user: userDetails
      file: fileDetails
      sharedEndDate: Date
      sharedStartDate: Date
      isSignedUrl: Boolean
      isDownloadable: Boolean
      createdAt:Date
      daysToExpire: Int
      ownerInfo: ShareOwnerInfo
      isExpired: Boolean
    }
    
    type SharedOutputAdmin {
      _id: String
      users: [userDetails]
      files: [fileDetails]
      sharedEndDate: Date
      sharedStartDate: Date
      daysToExpire: Int
      isSignedUrl: Boolean
      isDownloadable: Boolean
      createdAt:Date
      isActive: Boolean
      ownerInfo: ShareOwnerInfo
    }
    
    type sharedConnections {
      userId: String
      profilePic: String
      displayName: String
    }
   
    
    
    input userInput{
      userId: String
      profileId: String
    }
    
    input fileInput{
      url: String
      fileName: String
      fileType: String
      libraryDocumentId: String
    }
    
    
    input sharedInput {
      users: [userInput]!
      files: [fileInput]!
      sharedEndDate: Date
      sharedStartDate: Date
      isSignedUrl: Boolean
      isDownloadable: Boolean
    }
   

 type Query{
      fetchSharedLibraryDetails(sharedId:String):SharedOutputAdmin
      getMySharedConnections: [sharedConnections]
      fetchSharedLibrary(userId: String): [SharedOutput]
      fetchShareMembersInfo: [MemberInfo]
 }
 
 type Mutation{
      updateSharedLibrary(id: String,files:sharedInput): response
      createSharedLibrary(detailsInput:sharedInput):response
 }`;

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], sharedLibrarySchema ]);

let supportedApi = [
  {api:'fetchSharedLibraryDetails', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'fetchSharedLibrary', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'fetchShareMembersInfo', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},

  {api:'createSharedLibrary', actionName:'CREATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'updateSharedLibrary', actionName:'UPDATE', moduleName:"PORTFOLIO", isWhiteList:true}
];

MlResolver.MlModuleResolver.push(supportedApi);
