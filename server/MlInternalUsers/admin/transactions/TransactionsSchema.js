import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef';
import MlResolver from '../../../commons/mlResolverDef'

let transactionsSchema = `        
     type byInfo{
      type                      : String
      id                        : String
    }
    type trailInfo{
      statusCode                : String
      statusDescription         : String
      at                        : String
      by                        : byInfo
    }
    type statusInfo{
      code                      : String
      description               : String
      trail                     : [trailInfo]
    }
    type allocation{
        assignee            : String
        assigneeId          : String
        assignedDate        : Date
        department          : String
        departmentId        : String
        subDepartment       : String
        subDepartmentId     : String
        allocationStatus    : String
    }
    
    type userAgent{
        OS                  :String
        ipAddress           :String
        browser             :String
        deviceModel         :String
        deviceType          :String
        deviceVendor        :String
    }
    
    type Transactions{
       _id                      : String
       status                   : String
      transactionTypeName       : String
      transactionTypeId         : String
      requestId                 : String
      userId                    : String
      requestTypeName           : String
      requestTypeId             : String
      requestDescription        : String
      transactionStatus         : statusInfo
      transactionAssignedBy     : String
      transactionCompletedBy    : String
      transactionCreatedDate    : Date
      transactionUpdatedDate    : Date
      hierarchy                 : String
      allocation                : allocation
      cluster                   : String
      chapter                   : String
      subChapter                : String
      community                 : String
    }
    
    type TransactionsLog{
       _id                      : String
      userId                    : String
      userName                  : String
      activity                  : String
      transactionTypeName       : String
      transactionTypeId         : String
      userAgent                 :userAgent
      createdAt                 :String
      transactionDetails        :String
      emailId                   :String
      clusterId                 : String
      chapterId                 : String
      subChapterId              : String
      communityId               : String
      clusterName               : String
      chapterName               : String
      subChapterName            : String
      communityName             : String
      docId                     : String
      transactionId             : String
    }
    
    input userAgentInput{
        OS                  :String
        ipAddress           :String
        browser             :String
        deviceModel         :String
        deviceType          :String
        deviceVendor        :String
    }
    
    input TransactionsLogInput{
       _id                      : String
      userId                    : String
      userName                  : String
      transactionTypeName       : String
      transactionTypeId         : String
      activity                  : String
      createdAt                 : String
      emailId                   : String
      userAgent                 : userAgentInput
      transactionDetails        : String
      clusterId                 : String
      chapterId                 : String
      subChapterId              : String
      communityId               : String
      clusterName               : String
      chapterName               : String
      subChapterName            : String
      communityName             : String
    }
       
    input byInput{
      type                      : String
      id                        : String
    }
    
    input trailInput{
      statusCode                : String
      statusDescription         : String
      at                        : String
      by                        : byInput
    }
    input statusInput{
      code                      : String
      description               : String
      trail                     : [trailInput]
    }
     input allocationInput{
        assignee            : String
        assigneeId          : String
        assignedDate        : String
        department          : String
        departmentId        : String
        subDepartment       : String
        subDepartmentId     : String
        allocationStatus    : String
    }
    input TransactionsInput{
       status                   : String
      transactionTypeName       : String
      transactionTypeId         : String
      requestId                 : String
      userId                    : String
      requestTypeName           : String
      requestTypeId             : String
      requestDescription        : String
      transactionStatus         : statusInput
      transactionAssignedBy     : String
      transactionCompletedBy    : String
      transactionCreatedDate    : Date
      transactionUpdatedDate    : Date
      hierarchy                 : String
      allocation                : allocationInput
      cluster                   : String
      chapter                   : String
      subChapter                : String
      community                 : String
    }
    input assignmentParams{
       cluster        : String
       chapter        : String
       subChapter     : String
       community      : String
       department     : String
       subDepartment  : String
       role           : String
       user           : String      
    }
    input transactionData{
        clusterId     : String
        chapterId     : String
        subChapterId  : String
        communityId   : String
        transactionId : String
    }
    type Mutation{
      createTransaction(transaction:TransactionsInput):response
      updateTransaction(transactionId:TransactionsInput,collection:String):response
      assignTransaction(params:assignmentParams,transactionId:String,collection:String):response
      updateTransactionStatus(transactionId:String,status:String):response
      createRegistrationTransaction(transactionType:String):response
      updateRegistrationTransaction(transactionInfo:TransactionsInput):response
      selfAssignTransaction(transactionId:[String],collection:String):response
      unAssignTransaction(transactionId:String,collection:String):response
      createTransactionLog(transaction:TransactionsLogInput):response
    }
    type Query{
      fetchTransactionsByUser(userId:String):[Transactions]
      fetchTransactions(transactionType:String,status:[String]):[Transactions]
      fetchTransactionsLog(userId:String,transactionTypeName:String):[TransactionsLog]
      validateTransaction(transactionId:String,collection:String,assignedUserId:String):response
      validateAssignmentsDataContext(data:[transactionData],userId:String):response
    }
`
MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], transactionsSchema]);

let supportedApi = [
  {api:'fetchTransactionsByUser', actionName:'READ', moduleName:"TRANSACTIONSLOG"},
  {api:'fetchTransactions', actionName:'READ', moduleName:"TRANSACTIONSLOG"},
  {api:'fetchTransactionsLog', actionName:'READ', moduleName:"TRANSACTIONSLOG"},

  {api:'createTransactionLog', actionName:'CREATE', moduleName:"TRANSACTIONSLOG"},
  {api:'createTransaction', actionName:'CREATE', moduleName:"TRANSACTIONSLOG"},
  {api:'createRegistrationTransaction', actionName:'CREATE', moduleName:"TRANSACTIONSLOG"},
  {api:'updateTransaction', actionName:'UPDATE', moduleName:"TRANSACTIONSLOG"},
  {api:'assignTransaction', actionName:'UPDATE', moduleName:"TRANSACTIONSLOG"},
  {api:'updateTransactionStatus', actionName:'UPDATE', moduleName:"TRANSACTIONSLOG"},
  {api:'updateRegistrationTransaction', actionName:'UPDATE', moduleName:"TRANSACTIONSLOG"},
  {api:'selfAssignTransaction', actionName:'UPDATE', moduleName:"TRANSACTIONSLOG"},
  {api:'unAssignTransaction', actionName:'UPDATE', moduleName:"TRANSACTIONSLOG"},
  {api:'validateTransaction', actionName:'READ', moduleName:"TRANSACTIONSLOG", isWhiteList:true},
  {api:'validateAssignmentsDataContext', actionName:'READ', moduleName:"TRANSACTIONSLOG", isWhiteList:true},
]
MlResolver.MlModuleResolver.push(supportedApi)
