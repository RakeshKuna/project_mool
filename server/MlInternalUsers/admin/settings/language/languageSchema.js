import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
let LanguagesSchema = `
    type Language
    {
      languageName :String
      languageDisplayName :String
      aboutLanguage :String
      _id :String
      isActive :Boolean
    }
    input languageObject{
        languageName :String,
        languageDisplayName :String,
        aboutLanguage :String,
        _id :String,
        isActive :Boolean,
    }
    
   type Mutation 
    {
        updateLanguage(_id:String, language: languageObject):String
        createLanguage(language:languageObject):String
    }
    type Query{
        findLanguage(_id:String): Language
        fetchLanguages:[Language]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],LanguagesSchema]);
