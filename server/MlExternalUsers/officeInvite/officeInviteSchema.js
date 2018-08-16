/**
 * Created by vishwadeep on 8/6/17.
 */

import {mergeStrings} from "gql-merge";
import MlSchemaDef from "../../commons/mlSchemaDef";
import MlResolver from "../../commons/mlResolverDef";
let officeInviteSchema = `
    input officeInvite{
      officeId :String
      toUserId :String
      userType :String
      isAccepted :Boolean
      isDenied :Boolean
      message :String
      createdDate : Date      
    }
    
    type OfficeInvite {
      officeId :String
      toUserId :String
      userType :String
      isAccepted :Boolean
      isDenied :Boolean
      message :String
      createdDate : Date
    }
    type Query{
        fetchAllOfficeInvite:[OfficeInvite]
        fetchUserOfficeInvite(officeId:String):[OfficeInvite]
    }
    
    type Mutation{       
        createOfficeInvite(officeInvite:officeInvite):response
        updateOfficeInvite(inviteId:String, officeInvite:officeInvite):response
    }

`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], officeInviteSchema]);
let supportedApi = [
  {api: 'createOfficeInvite', actionName: 'CREATE', moduleName: "OFFICE", isWhiteList:true},
  {api: 'fetchAllOfficeInvite', actionName: 'READ', moduleName: "OFFICE", isWhiteList:true},
  {api: 'fetchUserOfficeInvite', actionName: 'READ', moduleName: "OFFICE", isWhiteList:true},
  {api: 'updateOfficeInvite', actionName: 'UPDATE', moduleName: "OFFICE", isWhiteList:true}
]
MlResolver.MlModuleResolver.push(supportedApi)
