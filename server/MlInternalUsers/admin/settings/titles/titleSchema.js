import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
let Title = `        
    type Title{
      titleName :String
      titleDisplayName :String
      aboutTitle: String
      _id:String
      isActive:Boolean
    }
    type Mutation{
        CreateTitle(titleName:String,titleDisplayName:String,aboutTitle:String,isActive:Boolean):String
        UpdateTitle(_id:String,titleName:String,titleDisplayName:String,aboutTitle:String,isActive:Boolean):String
    }
    type Query{
      FindTitle(_id: String):Title
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], Title ]);
