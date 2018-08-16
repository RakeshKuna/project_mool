import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
import MlResolver from '../../../commons/mlResolverDef'

let communitySchema = `

    type CommunityDef{
        _id:String,
        name:String,
        communityName:String,
        displayName:String,
        code:String,
        communityImageLink:String,
        aboutCommunity:String,
        isActive:Boolean
    }
    
    type Community{
        name:String,
        communityName:String,
        displayName:String,
        code:String,
        communityImageLink:String,
        showOnMap:Boolean,
        aboutCommunity:String,
        isActive:Boolean,
        clusters:[String],
        chapters:[String],
        subchapters:[String],
        clusterName:String,
        chapterName:String,
        subChapterName:String
    }
    
    input community{
        name:String,
        displayName:String,
        code:String,
        communityImageLink:String,
        showOnMap:Boolean,
        aboutCommunity:String,
        isActive:Boolean,
        clusters:[String],
        chapters:[String],
        subchapters:[String],
        clusterId:String, 
        chapterId:String, 
        subChapterId:String
    }
    
    type MapData {
        key:String,
        count:Int,
        icon :String,
        context:String
    }
    
    type Query{
        FetchMapData(moduleName:String,id:String):[MapData]
        fetchCommunities(clusterId:String, chapterId:String, subChapterId:String):SearchResp
        fetchCommunitiesSelect(clusterId:String, chapterId:String, subChapterId:String):[Community]
        fetchCommunityDef(clusterId:String, chapterId:String, subChapterId:String, communityId:String):Community
        fetchCommunitiesForRolesSelect(clusterId:String, chapterId:String, subChapterId:String):[Community]
        fetchCommunitiesDef:[CommunityDef]
    }
    
    type Mutation{
        createCommunityAccess(clusterId:String, chapterId:String, subChapterId:String): String
        createCommunity(clusterId:String, chapterId:String, subChapterId:String): String
        updateCommunityDef(community:community): response
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], communitySchema]);
let supportedApi = [
    {api:'createCommunityAccess', actionName:'CREATE', moduleName:"COMMUNITY"},
    {api:'createCommunity', actionName:'CREATE', moduleName:"COMMUNITY"},
    {api:'updateCommunityDef', actionName:'UPDATE', moduleName:"COMMUNITY"},
    {api:'FetchMapData', actionName:'READ', moduleName:"COMMUNITY", isWhiteList:true},
    {api:'fetchCommunities', actionName:'READ', moduleName:"COMMUNITY", isWhiteList:true},
    {api:'fetchCommunitiesSelect', actionName:'READ', moduleName:"COMMUNITY"},
    {api:'fetchCommunityDef', actionName:'READ', moduleName:"COMMUNITY", isWhiteList:true},
    {api:'fetchCommunitiesForRolesSelect', actionName:'READ', moduleName:"COMMUNITY", isWhiteList:true},
    // Need to think whether to make whitelist or not
    {api:'fetchCommunitiesDef', actionName:'READ', moduleName:"COMMUNITY"}
]
MlResolver.MlModuleResolver.push(supportedApi)
