/**
 * Created by sireesha on 01/05/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'

let FiltersCatalogSchema = `
    type fieldsCatalog
    {
      name : String
      type : String
      resolverName : String
      isDynamic : Boolean
    }
    type fields
    {
      moduleName :String
      fields : [fieldsCatalog]
      _id :String
    }
   
  
    type Query{
        findFilterCatalog(moduleName:String!): fields
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],FiltersCatalogSchema]);
