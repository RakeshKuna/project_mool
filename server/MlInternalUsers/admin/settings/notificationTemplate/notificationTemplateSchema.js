/**
 * Created by mohammed.mohasin on 22/07/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let NotificationTemplateSchema = `
    type NotificationTemplate
    {
        _id:String,
        type:String,
        tempCode :String,
        tempDesc: String,
        title:String,
        isHtmlContent:Boolean,
        content:String,
        updatedBy: String,
        createdBy:String,
        updatedAt:Date,
        createdAt:Date,
        dynamicKeys:[String],
        isActive:Boolean
    }
    
    input notificationTemplateInput
    {
        type:String,
        tempCode :String,
        tempDesc: String,
        title:String,
        isHtmlContent:Boolean,
        content:String,
        dynamicKeys:[String],
        isActive:Boolean
    }
    
    type Mutation 
    {
        createNotificationTemplate(notificationTemplate:notificationTemplateInput,moduleName:String,actionName:String):response
        updateNotificationTemplate(notificationTemplateId:String!,notificationTemplate:notificationTemplateInput):response
    }
    type Query{
        fetchNotificationTemplate(notificationTemplateId:String!): NotificationTemplate
        fetchNotificationTemplates:[NotificationTemplate]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], NotificationTemplateSchema]);

let supportedApi = [
  {api:'fetchNotificationTemplate', actionName:'READ', moduleName:"NOTIFICATIONTEMPLATE"},
  {api:'fetchNotificationTemplates', actionName:'READ', moduleName:"NOTIFICATIONTEMPLATE", isWhiteList:true},
  {api:'createNotificationTemplate', actionName:'CREATE', moduleName:"NOTIFICATIONTEMPLATE"},
  {api:'updateNotificationTemplate', actionName:'UPDATE', moduleName:"NOTIFICATIONTEMPLATE"}
];
MlResolver.MlModuleResolver.push(supportedApi)

