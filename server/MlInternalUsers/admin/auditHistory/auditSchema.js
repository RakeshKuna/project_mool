/**
 * Created by vishwadeep.kapoor on 07/04/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
let AuditLogSchema = ` 
      type userAgentDetails{
           ipAddress:String
           OS:String
           browser:String
           deviceModel:String
           deviceType:String
           deviceVendor:String
      }
      type AuditLogs{
            _id: String
           collectionName:String
           userId:String
           userName:String
           moduleName:String
           collectionName:String
           previousValue:String
           currentValue:String
           action:String
           field:String
           fieldName:String
           docId:String
           clusterId:String
           docRef:String
           chapterId:String
           subChapterId:String
           clusterName:String
           chapterName:String
           subChapterName:String
           communityId:String
           communityCode:String
           userAgent: userAgentDetails
           timeStamp:String
      }
      
      type Query{

      }
    
    type Mutation{

     }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],AuditLogSchema]);
