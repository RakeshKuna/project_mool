/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'


let followSchema = `
     type FollowUser{
        id:String,
        userId:String,
        userName:String,
        firstName:String,
        lastName:String,
        displayName:String,
        profileImage:String,
        profileId:String,
        countryName:String,
        communityName:String,
        communityCode:String,
        
    }
    
    type Mutation{
        followUser(resourceId:String!,resourceType:String!,follow:Boolean):response
    }
    
     type Query{
        followersList:[FollowUser]
        followingsList:[FollowUser]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],followSchema]);
