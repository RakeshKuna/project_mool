import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
let EmailTypeSchema = `
    type EmailType
    {
      emailName :String
      aboutEmail :String
      emailDisplayName :String
      _id :String
      emailUploadIcon:String
      isActive :Boolean
    }
    input emailTypeObject{
        emailName :String,
        aboutEmail :String,
        emailDisplayName :String,
        _id :String,
        emailUploadIcon:String,
        isActive :Boolean,
    }
    
   type Mutation 
    {
        updateEmailType(_id:String, emailType: emailTypeObject):String
        createEmailType(emailType:emailTypeObject):String
    }
    type Query{
        findEmailType(_id:String): EmailType
        fetchEmailTypes:[EmailType]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],EmailTypeSchema]);
