import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
import MlResolver from '../../../commons/mlResolverDef'

let clusterSchema = `
    type Cluster{
        _id:String
        countryName: String
        countryId :String
        displayName :String
        clusterCode:String
        about: String
        link: String
        email:String
        isEmailNotified :Boolean
        showOnMap : Boolean
        isActive: Boolean
        countryFlag:String
        latitude:Float 
        longitude:Float
        status:status
    }
    type status{
      code: String
      description: String
    }
      input clusterUpdateObject{
        _id:String,
        countryName: String
        displayName:String, 
        clusterCode:String,
        about:String,  
        email:String, 
        showOnMap:Boolean, 
        isActive:Boolean
    }
    
    input clusterObject{
        countryId:String, 
        countryName: String
        displayName:String,
        clusterCode:String,
        about:String, 
        countryFlag:String, 
        email:String, 
        isEmailNotified :Boolean,
        showOnMap:Boolean, 
        isActive:Boolean, 
        moduleName:String, 
        actionName:String, 
        latitude:Float, 
        longitude:Float        
    }
    
    type Query{ 
        fetchCluster(clusterId: String!, moduleName:String!, actionName:String!):Cluster
        fetchClustersForMap(subChapterId: String):[Cluster]
        fetchActiveClusters:[Cluster]
    }
   
    
    type Mutation 
    {
        createCluster(cluster:clusterObject, moduleName:String, actionName:String):String
        upsertCluster(clusterId:String!, cluster:clusterObject, moduleName:String!, actionName:String!): response
        updateCluster(clusterId:String!, clusterDetails:clusterUpdateObject, moduleName:String!, actionName:String!):String
    }    
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], clusterSchema]);
let supportedApi = [
    {api:'fetchCluster', actionName:'READ', moduleName:"CLUSTER", isWhiteList:true},
    {api:'fetchClustersForMap', actionName:'READ', moduleName:"CLUSTER", isWhiteList:true},
    {api:'fetchActiveClusters', actionName:'READ', moduleName:"CLUSTER", isWhiteList:true},
    {api:'createCluster', actionName:'CREATE', moduleName:"CLUSTER"},
    {api:'upsertCluster', actionName:'UPDATE', moduleName:"CLUSTER"},
    {api:'updateCluster', actionName:'UPDATE', moduleName:"CLUSTER"}
];
MlResolver.MlModuleResolver.push(supportedApi)
