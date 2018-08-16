/**
 * Created by venkatsrinag on 21/4/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'


let AssetsSchema = `
    type Assets
    {
        _id:String,
        assetName:String,
        displayName :String,
        about: String,
        icon:String,
        createdBy     : String
        createdDate   : Date
        updatedBy     : String
        updatedDate   : Date
        isActive      :Boolean
    }
    
    input assetsMasterData
    {
        assetName :String,
        displayName :String,
        about: String,
        icon:String,
        createdBy     : String
        createdDate   : Date
        updatedBy     : String
        updatedDate   : Date
        isActive:Boolean
    }
    
    type Mutation 
    {
        createAssets(assetsMasterData:assetsMasterData, moduleName:String, actionName:String):response
        updateSelectedAsset(assetId:String, assetsMasterData:assetsMasterData):response
    }
    type Query{
        findAsset(assetId:String): Assets
        fetchAssets:[Assets]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], AssetsSchema]);

let supportedApi = [
  {api:'createAssets', actionName:'CREATE', moduleName:"ASSETS"},
  {api:'updateSelectedAsset', actionName:'UPDATE', moduleName:"ASSETS"},

  {api:'fetchAssets', actionName:'READ', moduleName:"ASSETS",isWhiteList:true},
  {api:'findAsset', actionName:'READ', moduleName:"ASSETS"}
]
MlResolver.MlModuleResolver.push(supportedApi)

