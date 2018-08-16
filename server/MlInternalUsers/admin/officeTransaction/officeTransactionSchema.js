/**
 * Created by vishwadeep on 6/6/17.
 */
import {mergeStrings} from "gql-merge";
import MlSchemaDef from "../../../commons/mlSchemaDef";
import MlResolver from "../../../commons/mlResolverDef";

let officeTransaction = ` 
  
    input officeTransaction {
      officeId:String
      userId:String
      dateTime: Date
      transactionId :String
      status :String
      action :String
      transactionType :String
      paymentDetails: paymentDetail
      orderSubscriptionDetails : orderSubscriptionDetail
      deviceDetails : deviceDetail
    }
    
    input paymentDetail {
      datetime : Date
      transactionId :String
      totalAmountPaid: Int
      paymentMode: String
      promotionCode : String
      codeAmount : String
      promoCodeStatus : String
      voucherCode : String
      paymentStatus : String
      isPaid :Boolean
    }
    
    input orderSubscriptionDetail { 
      orderId : String
      SubscriptionName : String 
      SubscriptionCode : String
      cost : Int
      isTaxInclusive : Boolean
      about : String
    }
    
    input deviceDetail { 
      deviceName : String
      deviceId : String
      ipAddress : String
      location : String
    }
    
    type officeTransactionType {
      _id            : String
      dateTime       : Date
      userId         : String
      name           : String
      transactionId  : String
      clusterName    : String
      chapterName    : String
      subChapterName : String
      communityName  : String
      paymentDetails  : PaymentDetail
      status         : String
      action         : String
      userName       : String
      transactionType : String
      profileId      : String
      orderSubscriptionDetails : OrderSubscriptionDetail
      activity       : String
      registrationId : String
    }
    
    type PaymentDetail {
      datetime : Date
      transactionId :String
      totalAmountPaid: Int
      paymentMode: String
      promotionCode : String
      codeAmount : String
      promoCodeStatus : String
      voucherCode : String
      paymentStatus : String
      isPaid :Boolean
    }
    
     type OrderSubscriptionDetail { 
      orderId : String
      SubscriptionName : String 
      SubscriptionCode : String
      cost : Int
      isTaxInclusive : Boolean
      about : String
    }
    
    type myTransaction {
      _id: String
      transactionId: String
      cluster: String
      chapter: String
      subChapter: String
      community: String
      transactionType: String
      transactionTypeId: String
      createdby: String
      email: String
      mobileNumber: String
      fromProfileId: String
      activity: String
      userId: String
      status : String
      createdAt: String
      username: String
      firstName: String
      lastName: String
      updatedBy : String
      activityDocId: String
      docId: String
    }

    
    type Query {
      findOfficeTransaction(officeTransactionId:String, clusterId: String, chapterId: String, subChapterId: String, communityId: String):response
      findAllTransaction : [myTransaction]
    }
    type Mutation {
      createOfficeTransaction(officeTransaction:officeTransaction):response
      updateOfficeTransactionOrderSubscriptionDetail(id: String, orderSubscriptionDetail:orderSubscriptionDetail):response
      officeTransactionPayment(officeId:String):response
    }
`;


MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], officeTransaction]);
let supportedApi = [
  {api: 'createOfficeTransaction', actionName: 'CREATE', moduleName: "OFFICE", isWhiteList:true},
  {api: 'findOfficeTransaction', actionName: 'READ', moduleName: "OFFICE", isWhiteList:true},
  {api: 'updateOfficeTransactionOrderSubscriptionDetail', actionName: 'UPDATE', moduleName: "OFFICE", isWhiteList:true},
  {api: 'officeTransactionPayment', actionName: 'UPDATE', moduleName: "OFFICE", isWhiteList:true},
  {api: 'findAllTransaction', actionName: 'READ', moduleName: "OFFICE", isWhiteList:true}
];
MlResolver.MlModuleResolver.push(supportedApi)
// findOfficeTransaction(officeTransactionId:String):response    /* updated with all admin data context*/
