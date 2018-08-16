/**
 * Created by mohammed.mohasin on 16/06/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
import MlResolver from '../../../commons/mlResolverDef'

let favourites = `  
    type Mutation{
        markFavourite(resourceId:String!,resourceType:String!,isFavourite:Boolean):response
    }
    
     type FavouriteUser{
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
        chapterName : String
    }
    
    type Query{
        fetchFavourites:[FavouriteUser]
        fetchFavouritesByReg(registrationId: String, communityCode: String): [FavouriteUser]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],favourites]);
/**admin API data*/
let supportedApi = [
  {api:'fetchFavouritesByReg', actionName:'READ', moduleName:"INTERACTION", isWhiteList:true} //temp making white list
];
MlResolver.MlModuleResolver.push(supportedApi)
