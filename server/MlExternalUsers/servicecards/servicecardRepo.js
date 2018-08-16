/**
 * Created by venkatsrinag on 21/7/17.
 */
import MlUserContext from '../mlUserContext'
import MlRespPayload from '../../commons/mlPayload'
import _ from 'lodash'
import {userAgent} from '../../commons/utils';
//import MlNotificationController from '../../mlNotifications/mlSmsNotifications/mlSMSNotification';


import moment from "moment";
import MlTransactionsHandler from '../../commons/mlTransactionsLog';

const INITIAL_VERSION = 0.001;

class MlServiceCardRepo{
    constructor(){
      this.profile = {};
    }

    validateServiceCardActions(context, resourceName, userAction, payload){
        var defaultProfile = new MlUserContext().userProfileDetails(context.userId);
        if(!defaultProfile)
            return {success:false, msg:"Invalid User Details"};

        this.profile = defaultProfile;

        switch (userAction){
            case 'CREATESERVICEDEF':{
              return this.isUserEligibleForServiceCard(context.userId);
            }
            break;
            case 'UPDATESERVICEDEF':{
              return {success:true}
            }
            break;
            case 'CREATESERVICEORDER':{
              return {success:true};
            }
            break
          case 'CREATEAPPOINTMENT':{
            return this.validateUserServicecard(payload, context, defaultProfile)
          }
          break;
        }
        return {success:false}
    }

    isUserEligibleForServiceCard(userId){
      return {success:true};
    }

    createServiceCardDefinition(service, context){
        var result;
        try {

            let name = service.name;
            let displayName = service.displayName;
            let profileId = service.profileId;
            let serviceInfo = mlDBController.findOne('MlServiceCardDefinition', { profileId: profileId, isCurrentVersion: true, "$or": [ {name: name} , {displayName: displayName} ] }, context);
            if(serviceInfo) {
              let code = 400;
              let response;
              if(serviceInfo.name == name){
                // response = new MlRespPayload().errorPayload('Activity already exists', code)
                response = new MlRespPayload().errorPayload('Service name already exists', code)
              } else {
                response = new MlRespPayload().errorPayload('Service display name already exists', code)
              }
              return response
            }
            let machineInfo =userAgent(context.browser);
            var deviceInfo = {
                deviceName: machineInfo.osName,
                deviceId: machineInfo.osVersion,
                ipAddress: context.ip
            }

            var userDetails = ['clusterId', 'clusterName', 'chapterId', 'chapterName', 'subChapterId', 'subChapterName', 'communityId', 'communityName', 'communityCode'];
            var serviceCard                 = service;
            serviceCard["createdAt"]        = new Date();
            serviceCard['userId']           =  context.userId;
            serviceCard['profileId']        =  service.profileId;
            serviceCard["versions"]         =  INITIAL_VERSION;
            serviceCard["isApproved"]       =  false;
            serviceCard["isCurrentVersion"] =  true;
            serviceCard["deviceDetails"]    =  deviceInfo;
            orderNumberGenService.createServiceId(serviceCard);
            var userExternalProfile = new MlUserContext().userProfileDetailsByProfileId(service.profileId);
            if (userExternalProfile) {
              userDetails.forEach((field) => {
                if( field == 'communityCode' ){
                  serviceCard[field] = userExternalProfile.communityDefCode || null;
                } else {
                  serviceCard[field] = userExternalProfile[field] || null;
                }
              });
            }
            result = mlDBController.insert('MlServiceCardDefinition' , serviceCard, context)
            this.createTransactionRequest(context.userId, "serviceCardCreated", result, result, context.userId, 'user', context)
            if(!result){
              let code = 400;
              return new MlRespPayload().errorPayload(result, code);
            }
        }catch (e){
          return new MlRespPayload().errorPayload(e.message, 400);
        }
        return new MlRespPayload().successPayload(result, 200);
    }

    createBespokeServiceCardDefinition(service, portfolioId, context){
      var result;
      var defaultProfile = new MlUserContext().userProfileDetails(context.userId);
      try {
        var serviceCard                     = service;
        serviceCard["createdAt"]            = new Date();
        serviceCard["beSpokeCreatorUserId"] = context.userId;
        serviceCard["beSpokeCreatorProfileId"] = defaultProfile.profileId;
        serviceCard["beSpokeCreatorProfileImage"] = defaultProfile.profileImage;
        serviceCard['isBeSpoke']             = true;
        serviceCard["versions"]             =  INITIAL_VERSION;
        serviceCard["isCurrentVersion"]     = true;
        serviceCard["clusterId"]            = defaultProfile.clusterId;
        serviceCard["clusterName"]          = defaultProfile.clusterName;
        serviceCard["chapterId"]            = defaultProfile.chapterId;
        serviceCard["chapterName"]          = defaultProfile.chapterName;
        serviceCard["subChapterId"]         = defaultProfile.subChapterId;
        serviceCard["subChapterName"]       = defaultProfile.subChapterName;
        serviceCard["communityId"]          = defaultProfile.communityId;
        serviceCard["communityName"]        = defaultProfile.communityName;
        serviceCard["communityCode"]        = defaultProfile.communityDefCode;
        orderNumberGenService.createServiceId(serviceCard);
        var portfolioDetailsTransactions = mlDBController.findOne('MlPortfolioDetails', portfolioId, context);
        if(portfolioDetailsTransactions){
          serviceCard["userId"]     = portfolioDetailsTransactions.userId
          serviceCard["profileId"]  = portfolioDetailsTransactions.profileId
        }

        result = mlDBController.insert('MlServiceCardDefinition' , serviceCard, context)
        if(!result){
          let code = 400;
          return new MlRespPayload().errorPayload(result, code);
        } else {
          this.createTransactionRequest(portfolioDetailsTransactions.userId, "beSpokeServiceCreated", result, result, context.userId, 'user', context)
          //MlNotificationController.beSpokeServiceNotification(portfolioDetailsTransactions.userId)
        }
      }catch (e){
        return new MlRespPayload().errorPayload(e.message, 400);
      }
      return new MlRespPayload().successPayload(result, 200);
    }

    updateServiceCardDefinition(servicecard, serviceId, context){
      var service;
      var newFinalAmount = 0;
      if(_.isEmpty(servicecard) || _.isEmpty(serviceId)) {
        return new MlRespPayload().errorPayload("Invalid Service Card", 400);
      }
      try{
        service = mlDBController.findOne('MlServiceCardDefinition', {_id: serviceId}, context);
        if(!service){
          return new MlRespPayload().errorPayload("Invalid Service Card", 400);
        }
        let name = servicecard.name;
        let displayName = servicecard.displayName;
        let profileId = servicecard.profileId;
        let serviceInfo = mlDBController.findOne('MlServiceCardDefinition', { transactionId:{$ne: service.transactionId }, profileId: profileId, isCurrentVersion: true, "$or": [ {name: name} , {displayName: displayName} ] }, context);
        if(serviceInfo) {
          let code = 400;
          let response;
          if(serviceInfo.name == name){
            // response = new MlRespPayload().errorPayload('Activity already exists', code)
            response = new MlRespPayload().errorPayload('Service name already exists', code)
          } else {
            response = new MlRespPayload().errorPayload('Service display name already exists', code)
          }
          return response
        }

        let machineInfo =userAgent(context.browser);
        var deviceInfo = {
          deviceName: machineInfo.osName,
          deviceId: machineInfo.osVersion,
          ipAddress: context.ip
        }
        servicecard["deviceDetails"] =  deviceInfo;

        if(servicecard.tasks){
          let taskIds = servicecard.tasks.map(function (task) { return task.id; });
          let tasks = mlDBController.find('MlTask', {_id: { $in : taskIds } }, context).fetch();
          let taskAmount = 0;
          let noOfSession = 0;
          let taskDerivedAmount = 0;
          tasks.forEach(function (task) {
            noOfSession += task.noOfSession ? task.noOfSession : 0;
            taskAmount += task.payment && task.payment.amount ? task.payment.amount : 0;
            taskDerivedAmount += task.payment && task.payment.derivedAmount ? task.payment.derivedAmount : 0;
          });
          let totalMinutes = tasks.reduce((sum, value) => {
            let duration = value.duration ? value.duration : {};
            return sum + (duration.hours ? duration.hours : 0)*60 + ( duration.minutes ? duration.minutes : 0 ) ;
          }, 0);
          let duration = {
            hours: parseInt(totalMinutes/60),
            minutes: totalMinutes % 60
          };
          servicecard.duration = service.duration ? service.duration : {};
          servicecard.duration['hours'] = duration.hours;
          servicecard.duration['minutes'] = duration.minutes;
          servicecard.noOfSession = noOfSession;
          servicecard.payment = service.payment ? service.payment : {};
          servicecard.payment["tasksAmount"] = taskAmount;
          servicecard.payment["tasksDiscount"] = taskAmount - taskDerivedAmount;
          servicecard.payment["tasksDerived"] = taskDerivedAmount;
          newFinalAmount = taskDerivedAmount;
          if (service.payment && service.payment.isDiscount && service.payment.discountValue > 0) {
            if (service.payment.discountType === 'amount') {
              newFinalAmount = parseFloat(taskDerivedAmount).round(2) - parseFloat(service.payment.discountValue).round(2);
            } else {
              var newAmount = (parseFloat(taskDerivedAmount).round(2) * parseFloat(service.payment.discountValue)/100).round(2);
              newFinalAmount = parseFloat(taskDerivedAmount).round(2) - parseFloat(newAmount).round(2);
            }
          }
          if (service.facilitationCharge && service.facilitationCharge.type && service.facilitationCharge.amount > 0) {
            if (service.facilitationCharge.type === 'amount') {
              newFinalAmount += parseFloat(service.facilitationCharge.amount);
            } else {
              var newAmount = (parseFloat(taskDerivedAmount).round(2) * parseFloat(service.facilitationCharge.amount)/100).round(2);
              newFinalAmount += parseFloat(newAmount).round(2);
            }
          }
        }
        var isError = false;
        if (service.tasks && service.tasks.length > 0 && servicecard.tasks && servicecard.tasks.length > 0) {
          service.tasks.map((task)=> {
            servicecard.tasks.map((currentTask) => {
              if (task.id !== currentTask.id && task.sequence === currentTask.sequence) {
                isError = true;
                return false;
              }
            })
          });
        }
        if (isError) {
          return new MlRespPayload().errorPayload("Task sequence already exist", 400);
        }
        servicecard.userId = service.userId;
        servicecard.updatedAt = new Date();
        let value = servicecard.tasks ? newFinalAmount : servicecard.finalAmount;
        servicecard.finalAmount = value ? parseFloat(value).round(2) : null;
        for(key in service){
          if ((typeof servicecard[key] === 'undefined' || servicecard[key] === null) && key !== 'createdAt' && key !== '_id') {
            servicecard[key] = service[key];
          }
        }
        if(!servicecard.isActive) {
          servicecard.status = "In Active";
        } else {
          servicecard.status = "Active";
        }
        servicecard.isReview = false;
        servicecard.isApproved = false;
        let result = mlDBController.update('MlServiceCardDefinition', {_id: service._id}, servicecard, {$set: 1}, context);
        this.createTransactionRequest(context.userId, "serviceCardUpdated", service._id, service._id, context.userId, 'user', context)
        if(!result){
          return new MlRespPayload().errorPayload("Error In Updating The Service Card", 400);
        }
      }catch (e){
        return new MlRespPayload().errorPayload(e.message, 400);
      }

      return new MlRespPayload().successPayload("Service Card Updated Successfully", 200);
    }

    updateServiceCardDefinitionForVersion(servicecard, serviceId, context){
      var service;
      var newFinalAmount = 0;
      if(_.isEmpty(servicecard) || _.isEmpty(serviceId)) {
        return new MlRespPayload().errorPayload("Invalid Service Card", 400);
      }
      try {
        let oldService = mlDBController.findOne('MlServiceCardDefinition', {_id: serviceId}, context);
        if(!oldService){
          return new MlRespPayload().errorPayload("Invalid Service Card", 400);
        }
        let query = {transactionId: oldService.transactionId,isCurrentVersion: true};
        service = mlDBController.findOne('MlServiceCardDefinition', query, context);
        if(!service){
          return new MlRespPayload().errorPayload("Invalid Service Card", 400);
        }

        if(servicecard.tasks){
          let taskIds = servicecard.tasks.map(function (task) { return task.id; });
          let tasks = mlDBController.find('MlTask', {_id: { $in : taskIds } }, context).fetch();
          let taskAmount = 0;
          let noOfSession = 0;
          let taskDerivedAmount = 0;
          tasks.forEach(function (task) {
            noOfSession += task.noOfSession ? task.noOfSession : 0;
            taskAmount += task.payment && task.payment.amount ? task.payment.amount : 0;
            taskDerivedAmount += task.payment && task.payment.derivedAmount ? task.payment.derivedAmount : 0;
          });
          let totalMinutes = tasks.reduce((sum, value) => {
            let duration = value.duration ? value.duration : {};
            return sum + (duration.hours ? duration.hours : 0)*60 + ( duration.minutes ? duration.minutes : 0 ) ;
          }, 0);
          let duration = {
            hours: parseInt(totalMinutes/60),
            minutes: totalMinutes % 60
          };
          servicecard.duration = service.duration ? service.duration : {};
          servicecard.duration['hours'] = duration.hours;
          servicecard.duration['minutes'] = duration.minutes;
          servicecard.noOfSession = noOfSession;
          servicecard.payment = service.payment ? service.payment : {};
          servicecard.payment["tasksAmount"] = taskAmount;
          servicecard.payment["tasksDiscount"] = taskAmount - taskDerivedAmount;
          servicecard.payment["tasksDerived"] = taskDerivedAmount;
          newFinalAmount = taskDerivedAmount;
          if (service.payment && service.payment.isDiscount && service.payment.discountValue > 0) {
            if (service.payment.discountType === 'amount') {
              newFinalAmount = parseInt(taskDerivedAmount) - parseInt(service.payment.discountValue);
            } else {
              var newAmount = (parseInt(taskDerivedAmount) * parseInt(service.payment.discountValue)/100);
              newFinalAmount = parseInt(taskDerivedAmount) - parseInt(newAmount);
            }
          }
          if (service.facilitationCharge && service.facilitationCharge.type && service.facilitationCharge.amount > 0) {
            if (service.facilitationCharge.type === 'amount') {
              newFinalAmount += parseInt(service.facilitationCharge.amount);
            } else {
              var newAmount = (parseInt(taskDerivedAmount) * parseInt(service.facilitationCharge.amount)/100);
              newFinalAmount += parseInt(newAmount);
            }
          }
        }
        service.isCurrentVersion = false;
        servicecard.userId          = context.userId;
        servicecard.updatedAt       = new Date();
        servicecard.transactionId   = service.transactionId;
        servicecard.versions        = service.versions + INITIAL_VERSION;
        servicecard.isCurrentVersion = true;
        servicecard.finalAmount = servicecard.tasks ? newFinalAmount : servicecard.finalAmount;

        // de activating older version service card def
        let result = mlDBController.update('MlServiceCardDefinition', {_id: service._id}, service, {$set: 1}, context);

        // Creating new version service card def
        let newScVersion = mlDBController.insert('MlServiceCardDefinition', args.Services , context);
        if(!newScVersion){
          return new MlRespPayload().errorPayload("Error In Updating The Service Card", 400);
        }
      }catch (e){
        return new MlRespPayload().errorPayload(e.message, 400);
      }
      return new MlRespPayload().successPayload("Service Card Updated Successfully", 200);
    }

    createServiceCardOrder(payload, context) {
      var defaultProfile = new MlUserContext().userProfileDetails(context.userId);
      var serviceId = payload.serviceId;
      var tax = 0; // Need to update later
      var discountAmount = 0; // Need to update later
      var result;

      /**
       * Define data to insert in service card order
       * Note :: start date and end data will update when user create payment
       */

      try {
        var service = mlDBController.findOne('MlServiceCardDefinition', serviceId, context);
        if (!service) {
          return new MlRespPayload().errorPayload("Invalid Service", 400);
        }

        var dataToInsert = {
          userId: context.userId,
          profileId: defaultProfile.profileId,
          serviceId: serviceId,
          serviceName: service.name,
          amount: service.finalAmount,
          tax: tax,
          promoCode: "", // Need to update later
          discountedAmount: discountAmount,
          totalAmount: service.finalAmount + tax - discountAmount,
          isActive: false,
          isExpired: false,
          paymentStatus: 'unpaid',
          status: 'pending',
          createdAt: new Date(),
          tasks: service.tasks
        }
        orderNumberGenService.createUserServiceOrderId(dataToInsert);
        result = mlDBController.insert('MlScOrder', dataToInsert, context);
        if (!result) {
          return new MlRespPayload().errorPayload('Error In Booking Service Card', 400);
        }

      } catch (e) {
        return new MlRespPayload().errorPayload(e.message, 400);
      }
      return new MlRespPayload().successPayload(dataToInsert.orderId, 200);
    }

    updateServiceCardOrder(payload, context) {
      let orderId = payload.userServiceCardPaymentInfo.orderId;
      let userId = context.userId;

      try {
        let service = mlDBController.findOne('MlScOrder', {orderId: orderId}, context);
        let profile = new MlUserContext(userId).userProfileDetails(userId);
        profile = profile ? profile : {};
        let dataToInsert = {
          paymentMethod     : payload.userServiceCardPaymentInfo.paymentMethod,
          amount            : payload.userServiceCardPaymentInfo.amount,
          currencyId        : payload.userServiceCardPaymentInfo.currencyCode,
          resourceId        : orderId,
          resourceType      : "User-ServiceCard",
          activityType      : "SERVICE-PURCHASED",
          status            : "Pending",
          userId            : userId,
          createdAt         : new Date(),
          profileId         : profile.profileId,
          clusterId         : profile.clusterId,
          clusterName       : profile.clusterName,
          chapterId         : profile.chapterId,
          chapterName       : profile.chapterName,
          subChapterId      : profile.subChapterId,
          subChapterName    : profile.subChapterName,
          communityId       : profile.communityId,
          communityName     : profile.communityName,
        };
        orderNumberGenService.createPaymentId(dataToInsert);
        let paymentResponse = mlDBController.insert('MlPayment', dataToInsert, context);
        if(!paymentResponse){
          return new MlRespPayload().errorPayload(paymentResponse, 400);
        }
        let serviceResponse = mlDBController.update('MlScOrder', service._id, {paymentStatus: 'paid'}, {$set: 1}, context);
        let serviceInfo = mlDBController.findOne('MlServiceCardDefinition', service.serviceId, context);
        let toUserId = serviceInfo ? serviceInfo.userId : '';
        if(toUserId) {
          this.createTransactionRequest(toUserId, "servicePurchased", orderId, serviceInfo._id, userId, 'user', context);
        }

        if(!serviceResponse){
          return new MlRespPayload().errorPayload("Error In Payment", 400);
        }



      }catch (e){
        return new MlRespPayload().errorPayload(e.message, 400)
      }
      return new MlRespPayload().successPayload("Payment Updated", 200);
    }

    cloneServiceCard(serviceId, context) {
      if(_.isEmpty(serviceId)) {
        return new MlRespPayload().errorPayload("Invalid Service Card", 400);
      }
      try {
        let service = mlDBController.findOne('MlServiceCardDefinition', {_id: serviceId}, context);
        if(!service){
          return new MlRespPayload().errorPayload("Invalid Service Card", 400);
        }

        service.name = service.name + " Copy";
        service.displayName = service.displayName + " Copy";
        service.isCurrentVersion = true;
        service.createdAt = new Date();
        service.updatedAt = new Date();
        service.versions = INITIAL_VERSION;
        service.isCurrentVersion = true;
        service.isLive = false;
        service.isReview = false;
        service.isApproved = false;
        service.isActive = false;
        service.status = "In Active";
        delete service.transactionId;
        delete service._id;
        orderNumberGenService.createServiceId(service);
        // Creating new version service card def
        let newScVersion = mlDBController.insert('MlServiceCardDefinition', service, context);
        if(!newScVersion){
          return new MlRespPayload().errorPayload("Error In Updating The Service Card", 400);
        }
      }catch (e){
        return new MlRespPayload().errorPayload(e.message, 400);
      }
      return new MlRespPayload().successPayload("Service Card Clone Successfully", 200);
    }

    createServiceCard(serviceDefId, orderId, context){
        try {
          var defaultProfile = new MlUserContext().userProfileDetails(context.userId);
          var serviceDef = mlDBController.findOne('MlServiceCardDefinition', {_id:serviceDefId}, context)
          if(!serviceDef)
            return new MlRespPayload().errorPayload("Error In Fetching Service Card Definition", 400)

          var serviceCard = {};
          serviceCard["userId"] = context.userId;
          serviceCard["profileId"] = defaultProfile.profileId;
          serviceCard["serviceDefId"] = serviceDefId;
          serviceCard["isActive"] = true;
          serviceCard["tasks"] = serviceDef.tasks;
          serviceCard["isExpired"] = false;
          serviceCard["startDate"] = new Date();
          serviceCard["orderId"] = orderId;
          serviceCard["expiryDate"] = this.getServicecardExpiryDate(serviceDef.sessionFrequency,serviceDef.serviceExpiry)
          // Need to add these two fields
          //serviceCard["transactionId"] = new Date();
          //serviceCard["serviceName"] = new Date();
          result = mlDBController.insert('MlServiceCards' , serviceCard, context)
          if(!result)
            return new MlRespPayload().errorPayload(e.message, 400)

        }catch (e){
          return new MlRespPayload().errorPayload(e.message, 400)
        }

        return new MlRespPayload().successPayload(result, 200);
    }

  updateBespokeServiceCardDefinition(service, context){
    var result;
    try {
      var serviceCard                 = service;
      serviceCard["updatedAt"]        = new Date();
      serviceCard["isApproved"]       =  false;
      serviceCard["isCurrentVersion"] =  true;
      let id = service._id
      delete service['_id']
      let recordExists = mlDBController.findOne('MlServiceCardDefinition' , id, context)
      if(recordExists){
        result = mlDBController.update('MlServiceCardDefinition' , {_id:id},serviceCard,{$set:1}, context)
        if(!result){
          let code = 400;
          return new MlRespPayload().errorPayload(result, code);
        } else this.createTransactionRequest(recordExists.userId, "beSpokeServiceUpdated", result, result, context.userId, 'user', context)
      }
    }catch (e){
      return new MlRespPayload().errorPayload(e.message, 400);
    }
    return new MlRespPayload().successPayload(result, 200);
    }

    getServicecardExpiryDate(frequencyString, serviceExpiry){
      var frequency;
      switch (_.toUpper(frequencyString)){
        case 'WEEKLY':{
          frequency = 7;
        }
        break;
        case 'MONTHLY':{
          frequency = 30;
        }
        break
        case 'QUARTERLY':{
          frequency = 90;
        }
        break
        case 'YEARLY':{
          frequency = 365;
        }
        break;
        case 'ONETIME':{
          frequency = serviceExpiry||1;
        }
        break;
      }

      var eDate = moment().add(frequency, 'day').toDate();
      return eDate;
    }

    createServiceLedger(serviceId, context){
      try {
        var defaultProfile = new MlUserContext().userProfileDetails(context.userId);
        var service = mlDBController.findOne('MlServiceCards', {serviceDefId: serviceId}, context)
        if(!service)
          return new MlRespPayload().errorPayload("Error In Updating Ledger Balance", 400)

        var serviceCard = {};
        serviceCard["userId"]         = context.userId;
        serviceCard["profileId"]      = defaultProfile.profileId;
        serviceCard["serviceId"]      = serviceId;
        serviceCard["serviceCard"]    = {tasks: service.tasks};
        // Need to Update
        // serviceCard["serviceType"]      = serviceType

        result = mlDBController.insert('MlServiceLedger' , serviceCard, context)
        if(!result)
          return new MlRespPayload().errorPayload(e.message, 400)

      }catch (e){
        return new MlRespPayload().errorPayload(e.message, 400)
      }

      return new MlRespPayload().successPayload("Service Card Created Successfully", 200);
    }

    updateServiceLedger(serviceId, context){

    }

    validateUserServicecard(payload, context, profile){
        var ret = {success:false, msg:"Session is Completed"}
        var servicecard = mlDBController.findOne('MlServiceCards' ,  {orderId:payload.userServiceCardAppointmentInfo.orderId}, context)
        if(!servicecard)
          return {success:false, msg:"Invalid Order Id"};

        var serviceLedger = MlServiceLedger.findOne({"$and":[{userId:context.userId}, {profileId:profile.profileId}, {serviceId:servicecard._id}]})
        if(!serviceLedger)
          return {success:false, msg:"Ledger Not Found"};

        _.each(serviceLedger.serviceCard.tasks, function (task) {
            var session =_.find(task.sessions, {id:payload.userServiceCardAppointmentInfo.sessionId})
            if(session && !session.isCompleted){
              ret = {success:true}
              return;
            }
        })
        return ret
    }

    createTransactionRequest(userId, transType, orderId, resourceId, fromUserId, fromUserType, context, attendees) {
      try {
        let transactionType = transType;
        attendees = attendees || [];
        switch (transactionType) {
          case 'servicePurchased':
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'appointment',
              'activity': 'Service-Purchased',
              'transactionType': 'appointment',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': orderId,
              'transactionDetails': 'Service-Purchased',
              'context': context || {},
              'transactionTypeId': "appointment",
              'fromUserType': fromUserType
            });
            break;
          case "sessionAppointment":
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'appointment',
              'activity': 'Session-Appointment',
              'transactionType': 'appointment',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': orderId,
              'transactionDetails': 'Service-Purchased',
              'context': context || {},
              'transactionTypeId': "appointment",
              'fromUserType': fromUserType,
              'attendeeDetails': attendees
            });
            break;
            case "serviceCardCreated":
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'manageSchedule',
              'activity': 'ServiceCard-Created',
              'transactionType': 'manageSchedule',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': orderId,
              'transactionDetails': 'Service-Created',
              'context': context || {},
              'transactionTypeId': "manageSchedule",
              'fromUserType': fromUserType
            });
            break;
            case "serviceCardUpdated":
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'manageSchedule',
              'activity': 'ServiceCard-Updated',
              'transactionType': 'manageSchedule',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': orderId,
              'transactionDetails': 'Service-Updated',
              'context': context || {},
              'transactionTypeId': "manageSchedule",
              'fromUserType': fromUserType
            });
            break;
          case "beSpokeServiceCreated":
          new MlTransactionsHandler().recordTransaction({
            'fromUserId': fromUserId,
            'moduleName': 'manageSchedule',
            'activity': 'BeSpokeService-Created',
            'transactionType': 'manageSchedule',
            'userId': userId,
            'activityDocId': resourceId,
            'docId': orderId,
            'transactionDetails': 'BeSpokeService-Created',
            'context': context || {},
            'transactionTypeId': "manageSchedule",
            'fromUserType': fromUserType
          });
          break;
          case "beSpokeServiceUpdated":
            new MlTransactionsHandler().recordTransaction({
              'fromUserId': fromUserId,
              'moduleName': 'manageSchedule',
              'activity': 'BeSpokeService-Updated',
              'transactionType': 'manageSchedule',
              'userId': userId,
              'activityDocId': resourceId,
              'docId': orderId,
              'transactionDetails': 'BeSpokeService-Updated',
              'context': context || {},
              'transactionTypeId': "manageSchedule",
              'fromUserType': fromUserType
            });
            break;
        }

      }
      catch (e) {
        //console
        console.log(e);
      }
    }
}

const mlServiceCardRepo = new MlServiceCardRepo();
Object.freeze(mlServiceCardRepo);

export default mlServiceCardRepo;

