/**
 * Created by Mukhil on 14/6/17.
 */

import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../commons/mlSchemaDef'
import MlResolver from "../../commons/mlResolverDef";


let siteMapSchema = `
  type SiteMapUrl {
     url: String
  }


   type Query {
        getMySiteMapUrl:SiteMapUrl
   }
`;


MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], siteMapSchema]);

let supportedApi = [
  {api: 'getMySiteMapUrl', actionName: 'READ', moduleName: "PORTFOLIO", isAppWhiteList: true}

]

MlResolver.MlModuleResolver.push(supportedApi)
/**note: removed white list from UPDATE*/
// , isWhiteList:true
