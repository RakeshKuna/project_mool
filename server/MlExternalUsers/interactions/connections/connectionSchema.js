/**
 * Created by venkatsrinag on 6/5/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
import MlResolver from '../../../commons/mlResolverDef'

let connections = `
    type User{
        userid:String,
        userName:String,
        isFavourite:Boolean,
        isBlock:Boolean
    }
    
    type Connection{
        _id:String,
        requestedFrom:String,
        createdBy:String,
        updatedBy:String,
        isAccepted:Boolean,
        isDenied:Boolean,
        isBlocked:Boolean,
        resendCount:Int,
        canAccept:Boolean,
        canReject:Boolean,
        canRequest:Boolean
    }
    
    type ConnectedUser{
        id:String,
        userId:String,
        userName:String,
        firstName:String,
        lastName:String,
        displayName:String,
        profileImage:String,
        profileId:String,
        countryName:String,
        communityName:String,
        communityCode:String,
        chapterName :  String
    }
    
    type MyConnectionUser{
        userId: String,
        profileId: String,
        name: String,
        profileImage: String,
    }
    
    input user{
        userid:String,
        userName:String,
        isFavourite:Boolean,
        isBlock:Boolean
    }
    
    input connection{
        toUser:user,
        requestedFrom:String,
        createdBy:String,
        updatedBy:String,
        isAccepted:Boolean,
        isDenied:Boolean,
        resendCount:Int
    }
   
    type Mutation{
        connectionRequest(resourceId:String!,resourceType:String!):response
        acceptConnection(connectionId:String!):response
        rejectConnection(connectionId:String!):response
    }
    
    type Query{
        fetchConnections:[ConnectedUser]
        fetchConnectionByTransaction(transactionId:String!):Connection
        fetchConnectionsByReg(registrationId: String, communityCode: String): [ConnectedUser]
        fetchConnectionByUser: [MyConnectionUser]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],connections]);

/**admin API data*/
let supportedApi = [
  {api:'fetchConnectionsByReg', actionName:'READ', moduleName:"INTERACTION", isWhiteList:true}  //temp making white list
];
MlResolver.MlModuleResolver.push(supportedApi)
