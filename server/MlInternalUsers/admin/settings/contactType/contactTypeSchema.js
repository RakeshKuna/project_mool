import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
let ContactTypeSchema = `
    type ContactType
    {
      contactName :String
      aboutContact :String
      contactDisplayName :String
      _id :String
      contactUploadIcon:String
      isActive :Boolean
    }
    input contactTypeObject{
        contactName :String,
        aboutContact :String,
        contactDisplayName :String,
        _id :String,
        contactUploadIcon:String,
        isActive :Boolean,
    }
    
   type Mutation 
    {
        updateContactType(_id:String, contactType: contactTypeObject):String
        createContactType(contactType:contactTypeObject):String
    }
    type Query{
        findContactType(_id:String): ContactType
        fetchContactTypes:[ContactType]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],ContactTypeSchema]);
