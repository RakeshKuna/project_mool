import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
let Tax = `        
    type Tax{
      taxName :String
      taxDisplayName :String
      aboutTax: String
      _id:String
      isActive:Boolean
    }
    type Mutation{
        CreateTax(taxName:String,taxDisplayName:String,aboutTax:String,isActive:Boolean):String
        UpdateTax(_id:String,taxName:String,taxDisplayName:String,aboutTax:String,isActive:Boolean):String
    }
    type Query{
      FindTax(_id: String):Tax
      FetchTax:[Tax]
      FetchActiveTax:[Tax]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], Tax ]);
