import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
let GenderSchema = `
    type Gender
    {
      genderName :String
      aboutGender :String
      genderDisplayName :String
      _id :String
      genderUploadIcon:String
      isActive :Boolean
    }
    input genderObject{
        genderName :String,
        aboutGender :String,
        genderDisplayName :String,
        _id :String,
        genderUploadIcon:String,
        isActive :Boolean,
    }
    
   type Mutation 
    {
        updateGender(_id:String, gender: genderObject):String
        createGender(gender: genderObject):String
    }
    type Query{
        findGender(_id:String): Gender
        fetchGender:[Gender]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],GenderSchema]);
