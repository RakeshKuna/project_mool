/**
 * Created by Mukhil on 14/6/17.
 */

import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../commons/mlSchemaDef'
import MlResolver from "../../commons/mlResolverDef";


let activity=`

type AvailableCommunities{
  communityName: String
  communityId: String
  userCount: Int
  id: String
}


type TeamDetails{
  communityName: String
  availableCommunities:[AvailableCommunities]
  firstName: String
  name: String
  _id:String
}

type BranchType{
branchType: String
_id: String
}
    type FacilitationCharge {
      amount: Float
      percentage: Float
      derivedAmount: Float
    }

    type ActivityPayment {
      amount: Float
      isDiscount: Boolean
      discountType: String
      discountValue: Float
      derivedAmount: Float
      currencyType: String
    }
    
    type UserProfileDetails{
      userId: String
      profileId: String
      isMandatory: Boolean
    }
    
    type Teams {
      resourceType: String
      resourceId: String
      users: [UserProfileDetails]
    }
    type Duration {
        hours:Int
        minutes:Int
      }

    type Activity {
      _id: String
      userId: String
      profileId: String
      name: String
      displayName: String
      isInternal: Boolean
      isExternal: Boolean
      conversation: [String]
      mode: String
      isServiceCardEligible: Boolean
      industryTypes:[String]
      note: String
      imageLink: String
      duration: Duration
      deliverable: [String]
      payment: ActivityPayment
      facilitationCharge: FacilitationCharge
      teams: [Teams]
      isActive: Boolean
      createdAt: Date
      updatedAt: Date
    }
    
    input TeamName {
      userType: String
      officeId: String
    }
    
    type TeamUsers {
      firstName: String
      name: String
    }

     input facilitationCharge {
      amount: Float
      percentage: Float
      derivedAmount: Float
    }
    
    input activityPayment {
      amount: Float
      isDiscount: Boolean
      discountType: String
      discountValue: Float
      derivedAmount: Float
      currencyType: String
    }
    input userProfileDetails{
      userId: String
      profileId: String
      isMandatory: Boolean
    }
    
    input teams {
      resourceType: String
      resourceId: String
      users: [userProfileDetails]
    }

    input duration {
        hours:Int
        minutes:Int
    }
    
    input activityUpdate{
      teams:[teams]
      payment: activityPayment
      facilitationCharge: facilitationCharge
    }

    input activity {
      userId: String
      profileId: String
      name: String
      displayName: String
      isInternal: Boolean
      isExternal: Boolean
      mode: String
      isServiceCardEligible: Boolean
      conversation: [String]
      industryTypes:[String]
      note: String
      imageLink: String
      duration : duration
      deliverable: [String]
      payment: activityPayment
      facilitationCharge: facilitationCharge
      teams: [teams]
      isActive: Boolean
      createdAt: Date
      updatedAt: Date
    }

    type Query {
        fetchActivities(profileId:String, isInternal: Boolean, isExternal: Boolean):[Activity]
        fetchActivitiesForTask(taskId:String):[Activity]
        fetchActivity(activityId:String):Activity
    }

    type Mutation {
        createActivity(Details:activity):response
        updateActivity(activityId:String, Details:activity):response
    }
`


MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], activity]);
let supportedApi = [
  {api:'fetchActivities', actionName:'READ', moduleName:"OFFICE", isAppWhiteList: true},
  {api:'fetchActivitiesForTask', actionName:'READ', moduleName:"OFFICE", isAppWhiteList: true},
  {api:'fetchActivity', actionName:'READ', moduleName:"OFFICE", isAppWhiteList: true},
  {api:'createActivity', actionName:'CREATE', moduleName:"OFFICE", isAppWhiteList: true},
  {api:'updateActivity', actionName:'UPDATE', moduleName:"OFFICE", isAppWhiteList: true}
]
MlResolver.MlModuleResolver.push(supportedApi)
// fetchActivities:[Activity]
// fetchActivity(id:String):Activity
