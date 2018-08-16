import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../commons/mlSchemaDef';
import MlResolver from '../../commons/mlResolverDef'

let sharedCalendarSchema = `
    
  type UserDetails{
    userId: String
    profileId: Boolean
    displayName: String
    profilePic: String
   }
   
     input userCalendarInput {
      userId: String
      profileId: String
    }
    
    
  type sharedConnections {
    userId: String
    profilePic: String
    displayName: String
   }
    
  type DayCalendar {
    date:Date,
    status: Int
  }
    
  type MonthCalendar {
    days: [DayCalendar]
    expiryDate: String
  }
  
  input calendarInput {
    users: [userCalendarInput]
    sharedEndDate: Date
    sharedStartDate: Date
  }
 
 type Query{
      getMySharedCalendarConnections: [sharedConnections]
      getSharedCalendar(userId: String, month: Int, year: Int, date: Int): MonthCalendar 
      fetchSharedCalendarDetails(sharedId:String):SharedOutputAdmin
  }
 
 type Mutation{
     createSharedCalendar(detailsInput:calendarInput):response
     deactivateSharedCalendar(sharedId:String):response
  }`;

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], sharedCalendarSchema ]);

let supportedApi = [
  {api:'fetchSharedCalendarDetails', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'getMySharedCalendarConnections', actionName:'READ', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'createSharedCalendar', actionName:'CREATE', moduleName:"PORTFOLIO", isWhiteList:true},
  {api:'deactivateSharedCalendar', actionName:'CREATE', moduleName:"PORTFOLIO", isWhiteList:true}
];

MlResolver.MlModuleResolver.push(supportedApi);
