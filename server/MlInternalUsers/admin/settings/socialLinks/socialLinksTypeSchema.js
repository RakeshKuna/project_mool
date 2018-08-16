import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
let SocialLinksTypeSchema = `
    type SocialLinks
    {
      socialName :String
      aboutSocial :String
      socialDisplayName :String
      _id :String
      socialUploadIcon:String
      isActive :Boolean
    }
    input socialLinksTypeObject{
        socialName :String,
      aboutSocial :String,
      socialDisplayName :String,
      _id :String,
      socialUploadIcon:String,
      isActive :Boolean,
    }
    
   type Mutation 
    {
        updateSocialLinksType(_id:String, socialLinksType: socialLinksTypeObject):String
        createSocialLinksType(socialLinksType:socialLinksTypeObject):String
    }
    type Query{
        findSocialLinksType(_id:String): SocialLinks
        fetchSocialLinksTypes:[SocialLinks]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],SocialLinksTypeSchema]);
