/**
 * Created by pankaj on 26/6/17.
 */
import { mergeStrings } from 'gql-merge';
import MlSchemaDef from '../../commons/mlSchemaDef'
import MlResolver from "../../commons/mlResolverDef";

let appointment = `
  
  input userServiceCardPaymentInfo {
    orderId: String!,
    paymentId: String,
    paymentMethod: String,
    amount: Int,
    currencyCode: String
  }
  
  input Documents {
    fileName: String
    fileUrl: String
  }

  
  input tasks {
    taskId: String
    documents:[Documents] 
  }
  
  input userServiceCardAppointmentInfo {
    orderId: String!
    sessionId: String!
    hours: Int!
    minutes: Int!
    day: Int!
    month: Int!
    year: Int!
    extraUsers: [appointmentExtraUser]
  }
  
  input appointmentExtraUser {
    userId: String
    profileId: String
  }
  
  input taskInternalAppointmentInfo {
    taskId: String!
    sessionId: String!
    hours: Int!
    minutes: Int!
    day: Int!
    month: Int!
    year: Int!
    extraUsers: [appointmentExtraUser] 
  }
  
  input appointmentDuration {
    hours: Int
    minutes: Int
  }
  
  input appointmentTaskInfo {
    profileId: String!
    name: String!
    mode: String
    about: String
    industries: [String]
    conversation: [String]
    duration: appointmentDuration!
    frequency: String
    expectedInput: String
    expectedOutput: String
  }
  
  input selfInternalAppointmentInfo {
    hours: Int!
    minutes: Int!
    day: Int!
    month: Int!
    year: Int!
    taskDetails: appointmentTaskInfo!
  }
  
  type AppointmentUser {
    userId: String
    profileId: String
  }
  
  type AppointmentInfo {
    resourceType: String
    resourceId: String
    serviceCardId: String
    serviceName: String
    taskId: String
    taskName: String
    sessionId: String
    serviceOrderId: String
  }
  
  type AllProfileAppointment {
    date: String
    userId: String
    profileId: String
    count: String
  }
  type AppointmentWith {
    userId: String
    status: String
    profileId: String
    displayName: String
    userProfilePic: String
  }
  type Appointment {
    _id: String
    appointmentType: String
    appointmentId: String
    client: AppointmentUser
    provider: AppointmentUser
    appointmentInfo: AppointmentInfo
    appointmentWith: AppointmentWith
    startDate: Date
    endDate: Date
    isCancelled: Boolean
  }
  
  type AttendeeDetails {
   firstName: String
   lastName: String
   userId: String
   profileImage: String
   isProvider: Boolean
   isClient: Boolean
   isAttendee: Boolean
   status: String
  }
  
  type SlotInfo {
   _id: String
    appointmentType: String
    appointmentId: String
    client: AppointmentUser
    provider: AppointmentUser
    appointmentInfo: AppointmentInfo
    startDate: Date
    endDate: Date
    status: String
    attendeeDetails: [AttendeeDetails]
    taskName: String
    userMobileNumber: String
    userEmail: String
    userImage: String
    totalSessions: Int
    currentSession: Int
  }
  
  type appointmentEvents {
    date: String
    userId: String
    profileId: String
    count: String
  }
  
  type appointmentHolidays {
    isActive: Boolean
    start: String
    end: String
    type: String
  }
  
  type profileAppointment {
    events: [appointmentEvents]
    days: [appointmentHolidays]
  }
  
  type serviceSeekerList {
    name: String
    userId: String
    profileId: String
    transId: String
    orderId: String
    serviceId: String
  }
  
  type myAppointmentData {
    id: String
    type: String
    name: String
    status : String
    isRescheduled: Boolean
  }
  
  type myAppointmentsResponse {
    slot: String
    shift: String
    isHoliday: Boolean
    appointments: [myAppointmentData]
  }
  
  type myAppointmentsBetweenTwoDatesResponse{
    id: String
    type: String
    name: String
    startDate: Date
    endDate: Date
  }
  
  type AppointmentDuration {
    hours: Int
    minutes: Int
  }
  
  type selfTask {
    _id: String
    profileId: String
    name: String
    mode: String
    about: String
    industries: [String]
    conversation: [String]
    duration: AppointmentDuration
    frequency: String
    expectedInput: String
    expectedOutput: String
  }
  
  type AppointmentAdmin {
    _id: String
    appointmentId: String
    createdBy: String
    emailId: String
    source: String
    transactionType: String
    cluster: String
    chapter: String
    subChapter: String
    community: String
    createdAt: String
    status: String
  }
  
  type Query {
     fetchMyAppointmentByStatus(status: String): [Appointment]
     fetchAllProfileAppointmentCounts(month:Int, year: Int): profileAppointment
     fetchOfficeMemberAppointmentCounts(userId:String!, profileId:String!, month:Int, year: Int): profileAppointment
     fetchAllOfficeMemberAppointmentCounts(month:Int, year: Int): profileAppointment
     fetchProfileAppointmentCounts( profileId: String, month:Int, year: Int): profileAppointment
     fetchServiceSeekerList(profileId: String!, serviceId: String): [serviceSeekerList]
     fetchMyAppointment(userId: String, profileId: String!, day: Int, month: Int, year: Int): [myAppointmentsResponse]
     fetchMyAppointmentBetweenTwoDates(userId: String, profileId: String, startDay: Int, startMonth: Int, startYear: Int , endDay: Int, endMonth: Int, endYear: Int): [myAppointmentsBetweenTwoDatesResponse]
     fetchSelfTask(selfTaskId: String): selfTask
     fetchSlotDetails(appointmentId: [String]): [SlotInfo]
  }
  
  type Mutation {
     bookUserServiceCard(serviceId: String!, taskDetails: [tasks]):response
     bookTaskInternalAppointment( taskInternalAppointmentInfo: taskInternalAppointmentInfo ) : response
     bookSelfTaskInternalAppointment( selfInternalAppointmentInfo: selfInternalAppointmentInfo ) : response
     userServiceCardPayment(userServiceCardPaymentInfo: userServiceCardPaymentInfo): response
     bookUserServiceCardAppointment(userServiceCardAppointmentInfo: userServiceCardAppointmentInfo!): response
     updateAppointmentByStatus(appointmentId: String, status: String): response
     
     fetchAdminServiceAppointment( orderId: String! ): response
     fetchAdminSessionAppointment( orderId: String! ): response

     fetchAppAppointmentByTransactionId(transactionId: String!): response
          
     cancelUserServiceCardAppointment( appointmentId: String! ): response
     rescheduleUserServiceCardAppointment( appointmentId: String!, userServiceCardAppointmentInfo: userServiceCardAppointmentInfo! ): response
     cancelUserServiceCardOrder( orderId: String! ): response
     signOffUserServiceCardOrder( orderId: String! ): response
  }
`;


MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], appointment]);
let supportedApi = [
  { api: 'bookUserServiceCard', actionName: 'CREATE', moduleName: "OFFICE", isWhiteList: true },
  { api: 'userServiceCardPayment', actionName: 'CREATE', moduleName: "OFFICE", isWhiteList: true },
  { api: 'fetchAdminServiceAppointment', actionName: 'READ', moduleName: "OFFICE", isWhiteList: true },
  { api: 'fetchAdminSessionAppointment', actionName: 'READ', moduleName: "OFFICE", isWhiteList: true },
  // { api: 'fetchAppServiceAppointmentByTransactionId', actionName: 'READ', moduleName: "OFFICE", isWhiteList: true },
  // { api: 'fetchAppSessionAppointmentByTransactionId', actionName: 'READ', moduleName: "OFFICE", isWhiteList: true },
  { api: 'bookUserServiceCardAppointment', actionName: 'CREATE', userAction: "CREATEAPPOINTMENT", resourceName: "SERVICECARD", isWhiteList: true },
  { api: 'updateAppointmentByStatus', actionName: 'UPDATE', resourceName: "SERVICECARD" },
  { api: 'fetchSlotDetails', actionName: 'READ', moduleName: "APPOINTMENT"},
];

MlResolver.MlModuleResolver.push(supportedApi);
