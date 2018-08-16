/**
 * Created by mohammed.mohasin on 21/6/17.
 */
import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'


let reviewSchema = `
    type Mutation{
        createReview(resourceId:String!,resourceType:String!,message:String!,rating:Float):response       
    }
    
    type Review {
     resourceId:String,
     resourceType:String,
     rating:Float,
     message:String,
     userId:String,
     userEmail:String,
     createdOn:Date,
     updatedOn:Date,
     updatedBy:Date,
     status:String,
     isActive:Boolean,
     status:Int
    }
    
     type ReviewDetails {
     reviewId:String,
     resourceId:String,
     resourceType:String,
     rating:Float,
     message:String,
     userId:String,
     userEmail:String,
     createdOn:Date,
     userName:String,
     userProfileImage:String 
    }
    
    type Query{
        fetchReviews(resourceId:String!,resourceType:String!,cursor:String):[ReviewDetails]
    }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'],reviewSchema]);
