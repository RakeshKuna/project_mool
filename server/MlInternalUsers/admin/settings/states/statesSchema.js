import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let States = `       
    type States 
    {     
        _id         : String
        name        : String
        countryId   : String
        countryCode : String
        countryName : String
        displayName : String
        about       : String
        isActive    : Boolean
    }
    
    input stateObject{
        id          : String
        name        : String
        countryId   : String
        countryName : String
        countryCode : String
        displayName : String
        about       : String
        isActive    : Boolean
    }
    
    type Query {
        fetchState(stateId: String): States
        FetchStates:[States]
        FetchActiveStates:[States]
        fetchStatesPerCountry(countryId: String, activeCheck:Boolean):[States]
        fetchStatesPerCountryWithAll(countryId: String):[States]
        FetchActiveStatesForCluster(clusters:[String]):[States]
    }
    
    type Mutation{
        updateState(stateId: String, state:stateObject , moduleName:String, actionName:String):response
    }
`
MlSchemaDef['schema']=mergeStrings([MlSchemaDef['schema'],States]);
let supportedApi = [
  {api:'fetchState', actionName:'READ', moduleName:"STATES"},
  {api:'FetchActiveStates', actionName:'READ', moduleName:"STATES", isWhiteList:true},
  {api:'fetchStatesPerCountry', actionName:'READ', moduleName:"STATES", isWhiteList:true},
  {api:'fetchStatesPerCountryWithAll', actionName:'READ', moduleName:"STATES", isWhiteList:true},
  {api:'FetchActiveStatesForCluster', actionName:'READ', moduleName:"STATES"},
  {api:'updateState', actionName:'UPDATE', moduleName:"STATES"},
  {api: 'FetchStates', actionName:'READ' , moduleName:'STATES'}
]
MlResolver.MlModuleResolver.push(supportedApi)
