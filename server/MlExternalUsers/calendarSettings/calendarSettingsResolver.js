/**
 * Created by pankaj on 24/6/17.
 */
import MlResolver from '../../commons/mlResolverDef'
import MlRespPayload from '../../commons/mlPayload'
import MlUserContext from '../../MlExternalUsers/mlUserContext'
import MlAppointment from './appointment';
var extendify = require('extendify');
var _ = require('lodash')

MlResolver.MlQueryResolver['fetchMyCalendarSetting'] = (obj, args, context, info) => {
  let userId = context.userId;
  let profileId;
  if (args.profileId) {
    profileId = args.profileId;
  } else {
    profileId = new MlUserContext().userProfileDetails(userId).profileId;
  }
  if (!userId) {
    let code = 400;
    let result = 'User ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  if (!profileId) {
    let code = 400;
    let result = 'Profile ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  let result = mlDBController.findOne('MlCalendarSettings', { userId: userId, profileId: profileId }, context);
  let pipeline = [
    {
      "$match": {
        "startDate": { "$gte": new Date() },
        "$or": [
          { "provider.profileId": profileId },
          { "client.profileId": profileId }
        ]
      }
    },
    {
      "$group": {
        _id: { $dayOfWeek: "$startDate" },
        ids: { "$push": "$appointmentId" }
      }
    },
    {
      "$unwind": "$ids"
    },
    {
      "$group": {
        _id: null,
        ids: { "$push": "$ids" }
      }
    },
  ];
  let appointmentData = mlDBController.aggregate('MlAppointments', pipeline, context);
  result.hasAppointment = appointmentData && appointmentData.length ? true : false;
  return result;

};

MlResolver.MlQueryResolver['getMyCalendar'] = (obj, args, context, info) => {
  let userId = context.userId;
  let profileId = new MlUserContext().userProfileDetails(userId).profileId;
  if (!userId) {
    let code = 400;
    let result = 'User ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  if (!profileId) {
    let code = 400;
    let result = 'Profile ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  // let mlAppointment = new MlAppointment();
  let date = new Date();
  let month = args.month ? args.month : date.getMonth();
  let year = args.year ? args.year : date.getFullYear();
  return MlAppointment.getUserCalendar(userId, profileId, month, year);
};

MlResolver.MlQueryResolver['getServiceProviderCalendar'] = (obj, args, context, info) => {
  let portfolioId = args.portfolioId;
  let portfolioInfo = mlDBController.findOne('MlPortfolioDetails', portfolioId, context);

  if (!portfolioInfo) {
    let code = 400;
    let result = 'Portfolio is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  let userId = portfolioInfo.userId;
  let profileId = portfolioInfo.profileId ? portfolioInfo.profileId : " ";
  if (!userId) {
    let code = 400;
    let result = 'User ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  if (!profileId) {
    let code = 400;
    let result = 'Profile ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  // let mlAppointment = new MlAppointment();
  let date = new Date();
  let day = args.month == date.getMonth() ? date.getDate() : 1;
  let month = args.month!=undefined ? args.month : date.getMonth();
  let year = args.year ? args.year : date.getFullYear();
  let finalResponse = {}

  //commented if-condition for fixing MOOLYA-3490
  // if (month >= date.getMonth() && year >= date.getFullYear()) {
    finalResponse = MlAppointment.getUserCalendar(userId, profileId, month, year, day);
  // }

  let orderId = args.orderId;
  if (orderId) {
    let serviceOrder = mlDBController.findOne('MlServiceCards', { orderId: orderId }, context);
    if (serviceOrder && serviceOrder.expiryDate) {
      finalResponse.expiryDate = serviceOrder.expiryDate;
    }
  }
  console.log(finalResponse);
  return finalResponse
};

MlResolver.MlQueryResolver['getMyCalendarDayAvailable'] = (obj, args, context, info) => {
  let date = new Date();
  let day = args.day ? args.day : date.getDate();
  let month = args.month ? args.month : date.getMonth();
  let year = args.year ? args.year : date.getFullYear();
  let sessionId = '123';
  return mlAppointment.getSessionTimeSlots(sessionId, day, month, year);
};

MlResolver.MlQueryResolver['getSessionDayAvailable'] = (obj, args, context, info) => {
  let date = new Date();
  // let mlAppointment = new MlAppointment();
  let day = args.day ? args.day : date.getDate();
  let month = args.month ? args.month : date.getMonth();
  let year = args.year ? args.year : date.getFullYear();
  let sessionId = args.sessionId;
  let orderId = args.orderId;

  let SCOrderDetails = mlDBController.findOne('MlScOrder', { orderId: orderId }, context);

  if (!SCOrderDetails) {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Order is not valid", code);
    return response;
  }

  let serviceId = SCOrderDetails.serviceId;
  if (!serviceId) {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Service id is not attached in order", code);
    return response;
  }

  let serviceInfo = mlDBController.findOne('MlServiceCardDefinition', serviceId, context);
  date.setDate(args.day);
  date.setMonth(args.month);
  date.setYear(args.year);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  let serviceValidation =  new Date();
  serviceValidation.setDate(serviceValidation.getDate() + serviceInfo.serviceExpiry);
  if(serviceValidation < date){
    var arr = [];
    arr.push({status:400,shift:"Service isn't valid for the selected date"});
    return arr;
  }
  else {
    if (!serviceInfo) {
      let code = 400;
      let response = new MlRespPayload().errorPayload("Service id is not attached in service card definition", code);
      return response;
    }

    let tasks = serviceInfo.tasks ? serviceInfo.tasks : [];

    let task = tasks.find(function (task) {
      return task.sessions.some(function (session) {
        return session.id == sessionId;
      })
    });
    if (!task) {
      let code = 400;
      let response = new MlRespPayload().errorPayload("Session id is not attached in service card definition", code);
      return response;
    }

    let taskId = task.id;

    if (!task.id) {
      let code = 400;
      let response = new MlRespPayload().errorPayload("Task id is not attached in service card definition", code);
      return response;
    }

    return MlAppointment.getSessionTimeSlots(null, taskId, sessionId, day, month, year);
  }
};

MlResolver.MlMutationResolver['updateMyCalendarSetting'] = (obj, args, context, info) => {
  const userId = context.userId;
  const profileId = args.profileId ? args.profileId
    : new MlUserContext().userProfileDetails(userId).profileId;
  if (!userId || !profileId) {
    const result = `${!userId ? 'User ID' : 'Profile ID'} is not defined for this user`;
    return new MlRespPayload().errorPayload(result, 400);
  }
  if (!args.calendarSetting) {
    return new MlRespPayload().errorPayload('Calendar settings are missing', 400);
  }
  delete args.calendarSetting.vacations;
  delete args.calendarSetting.workingDays;
  const userSettingsInfo = mlDBController.find('MlCalendarSettings', { userId: userId }, context).fetch();
  const currentProfileIndex = _.findIndex(userSettingsInfo, ["profileId", profileId]);
  if (currentProfileIndex > -1) {
    let overlappingSlots = false;
    const currentUserSettings = userSettingsInfo[currentProfileIndex];
    if (currentUserSettings.workingDays && !args.calendarSetting.isOverlappingSchedule) {
      for (let i = 0; i < userSettingsInfo.length; i++) {
        for (let j = i + 1; j < userSettingsInfo.length; j++) {
          userSettingsInfo[j].workingDays.forEach(day => {
            const dayInDb = _.find(userSettingsInfo[i].workingDays, ["dayName", day.dayName]);
            if (dayInDb && areSlotsOverlapping(dayInDb, day)) {
              overlappingSlots = true;
            }
          });
        }
      }
      if (overlappingSlots) {
        return new MlRespPayload().errorPayload('Settings cannot be updated as there are overlapping schedules', 400);
      }
    }
    args.calendarSetting.updatedAt = new Date();
    let result = mlDBController.update('MlCalendarSettings', currentUserSettings._id, args.calendarSetting, { $set: true }, context);
    const result2 = mlDBController.update('MlCalendarSettings', { userId }, { isOverlappingSchedule: args.calendarSetting.isOverlappingSchedule }, { $set: true, multi: true }, context);
    if (result) {
      let cancelAppointmentQuery = {
        startDate: { "$gte": new Date() },
        "$or": [
          { "provider.profileId": profileId },
          { "client.profileId": profileId }
        ]
      };
      mlDBController.update('MlAppointments', cancelAppointmentQuery, { isCancelled: true }, { $set: true, multi: true }, context);
      // To do for handle Appointment members collections
      let code = 200;
      let response = new MlRespPayload().successPayload('Calendar settings updated successfully', code);
      return response;
    }
  } else {
    args.calendarSetting.userId = userId;
    args.calendarSetting.profileId = profileId;
    args.calendarSetting.createdAt = new Date();
    let result = mlDBController.insert('MlCalendarSettings', args.calendarSetting, context);
    const result2 = mlDBController.update('MlCalendarSettings', { userId }, { isOverlappingSchedule: args.calendarSetting.isOverlappingSchedule }, { $set: true, multi: true }, context);
    if (result) {
      let code = 200;
      let response = new MlRespPayload().successPayload('Calendar settings updated successfully', code);
      return response;
    }
  }
}

const areSlotsOverlapping = (daysInDb, days) => {
  let splittedDbSlots = [];
  let isOverlapping = false;
  if (daysInDb.slots) {
    daysInDb.slots.forEach(slot => {
      splittedDbSlots.push({
        startHour: Number(slot.start.split(':')[0]),
        startMinute: Number(slot.start.split(':')[1]),
        endHour: Number(slot.end.split(':')[0]),
        endMinute: Number(slot.end.split(':')[1])
      });
    });
  }
  splittedDbSlots = _.sortBy(splittedDbSlots, 'startHour');
  let splittedGivenSlots = [];
  if (days.slots) {
    days.slots.forEach(slot => {
      splittedGivenSlots.push({
        startHour: Number(slot.start.split(':')[0]),
        startMinute: Number(slot.start.split(':')[1]),
        endHour: Number(slot.end.split(':')[0]),
        endMinute: Number(slot.end.split(':')[1])
      });
    });
  }
  splittedGivenSlots = _.sortBy(splittedGivenSlots, 'startHour');
  splittedGivenSlots.forEach(givenSlot => {
    if (isOverlapping) return;
    splittedDbSlots.forEach(dbSlot => {
      const isStartBefore = (dbSlot.startHour > givenSlot.startHour
        || (dbSlot.startHour == givenSlot.startHour
          && dbSlot.startMinute >= givenSlot.startMinute)) ? true : false;
      const isEndBefore = ((dbSlot.endHour > givenSlot.endHour)
        || (dbSlot.endHour === givenSlot.endHour
          && dbSlot.endMinute >= givenSlot.endMinute)) ? true : false;
      if (isStartBefore && isEndBefore) {
        if (dbSlot.startHour < givenSlot.endHour
          || (dbSlot.startHour === givenSlot.endHour
            && dbSlot.startMinute < givenSlot.endMinute)) {
          isOverlapping = true;
        }
      }
      if (isStartBefore && !isEndBefore) {
        isOverlapping = true;
      }
      if (!isStartBefore && isEndBefore) {
        isOverlapping = true;
      }
      if (!isStartBefore && !isEndBefore) {
        if (dbSlot.endHour > givenSlot.startHour
          || (dbSlot.endHour === givenSlot.startHour
            && dbSlot.endMinute > givenSlot.startMinute)) {
          isOverlapping = true;
        }
      }
    });
  });
  return isOverlapping;
}

MlResolver.MlMutationResolver['updateMyCalendarWorkingDays'] = (obj, args, context, info) => {
  const userId = context.userId;
  const profileId = args.profileId ? args.profileId : new MlUserContext().userProfileDetails(userId).profileId;
  if (!userId || !profileId) {
    const result = `${!userId ? 'User ID' : 'Profile ID'} is not defined for this user`;
    return new MlRespPayload().errorPayload(result, 400);
  }
  if (!args.workingDays) {
    return new MlRespPayload().errorPayload('Working days is missing', 400);
  }
  const userSettingsInfo = mlDBController.find('MlCalendarSettings', { userId: userId }, context).fetch();
  const currentProfileIndex = _.findIndex(userSettingsInfo, ["profileId", profileId]);
  if (currentProfileIndex > -1) {
    const workingDays = args.workingDays;
    let overlappingSlots = false;
    if (workingDays && !userSettingsInfo[currentProfileIndex].isOverlappingSchedule) {
      userSettingsInfo.forEach(userSettings => {
        if (userSettings.profileId === profileId) {
          return;
        }
        workingDays.forEach(day => {
          const dayInDb = _.find(userSettings.workingDays, ["dayName", day.dayName]);
          if (dayInDb && areSlotsOverlapping(dayInDb, day)) {
            overlappingSlots = true;
          }
        });
      });
    }
    if (overlappingSlots) {
      return new MlRespPayload().errorPayload('Overlapping of slots is not allowed', 400);
    } else {
      let existingSettings = userSettingsInfo[currentProfileIndex];
      existingSettings.workingDays = existingSettings.workingDays ? existingSettings.workingDays : [];
      const daysArray = workingDays.map((day) => {
        return day.dayName + 1;
      });
      existingSettings.workingDays = existingSettings.workingDays.map(function (day) {
        let isFind = workingDays.find(function (arr) { return arr.dayName == day.dayName });
        if (isFind) {
          workingDays.splice(workingDays.indexOf(isFind), 1);
          return isFind;
        } else {
          return day;
        }
      });
      existingSettings.workingDays = existingSettings.workingDays.concat(workingDays);
      let pipeline = [
        {
          "$match": {
            "startDate": { "$gte": new Date() },
            "$or": [
              { "provider.profileId": profileId },
              { "client.profileId": profileId }
            ]
          }
        },
        {
          "$group": {
            _id: { $dayOfWeek: "$startDate" },
            ids: { "$push": "$appointmentId" }
          }
        },
        {
          "$match": { "_id": { "$in": daysArray } }

        },
        {
          "$unwind": "$ids"
        },
        {
          "$group": {
            _id: null,
            ids: { "$push": "$ids" }
          }
        },
      ];
      let appointmentData = mlDBController.aggregate('MlAppointments', pipeline, context);
      if (appointmentData && appointmentData.ids && appointmentData.ids.length) {
        mlDBController.update('MlAppointments', { appointmentId: { "$in": appointmentData.ids } }, { isCancelled: true }, { $set: true, multi: true });
      };
      let result = mlDBController.update('MlCalendarSettings', existingSettings._id, { workingDays: existingSettings.workingDays, updatedAt: new Date() }, { $set: true }, context);
      if (result) {
        let code = 200;
        let response = new MlRespPayload().successPayload('Calendar settings updated successfully', code);
        return response;
      }
    }
  } else {
    const dataToInsert = {
      userId: userId,
      profileId: profileId,
      createdAt: new Date(),
      workingDays: args.workingDays
    };
    const result = mlDBController.insert('MlCalendarSettings', dataToInsert, context);
    if (result) {
      return new MlRespPayload().successPayload('Calendar settings updated successfully', 200);
    }
  }
}

MlResolver.MlMutationResolver['updateMyCalendarWorkingDay'] = (obj, args, context, info) => {
  if (!args.workingDay) {
    let code = 400;
    let result = 'Working day is missing';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  return MlResolver.MlMutationResolver['updateMyCalendarWorkingDays'](obj, { profileId: args.profileId, workingDays: [args.workingDay] }, context, info);
};

MlResolver.MlMutationResolver['updateMyCalendarVacation'] = (obj, args, context, info) => {
  let vacation = args.vacation;
  let userId = context.userId;
  //let profileId = new MlUserContext().userProfileDetails(userId).profileId;
  let profileId;
  if (args.profileId) {
    profileId = args.profileId;
  } else {
    profileId = new MlUserContext().userProfileDetails(userId).profileId;
  };
  if (!userId) {
    let code = 400;
    let result = 'User ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  if (!profileId) {
    let code = 400;
    let result = 'Profile ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  if (!vacation) {
    let code = 400;
    let result = 'Vacation data is missing';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  vacation.start = new Date(vacation.start);
  vacation.end = new Date(vacation.end);
  let isAlreadyExist = mlDBController.findOne('MlCalendarSettings', { userId: userId, profileId: profileId }, context);
  if (isAlreadyExist) {
    isAlreadyExist.vacations = isAlreadyExist.vacations ? isAlreadyExist.vacations : [];
    let startDate = new Date(vacation.start);
    let endDate = new Date(vacation.end);
    let isAlreadyOnVacation = false;
    isAlreadyExist.vacations.forEach(function (vacationInfo) {
      let vacationStartDate = new Date(vacationInfo.start);
      let vacationEndDate = new Date(vacationInfo.end);
      if (vacationStartDate.getTime() <= startDate.getTime() && startDate.getTime() <= vacationEndDate.getTime() || vacationStartDate.getTime() <= endDate.getTime() && endDate.getTime() <= vacationEndDate.getTime()) {
        isAlreadyOnVacation = true;
      }
    });
    if (isAlreadyOnVacation) {
      let code = 400;
      let response = new MlRespPayload().errorPayload('Vacation dates are overlapping', code);
      return response;
    } else {
      orderNumberGenService.createVactionId(vacation);
      isAlreadyExist.vacations.push(vacation);
      let result = mlDBController.update('MlCalendarSettings', isAlreadyExist._id, { vacations: isAlreadyExist.vacations, updatedAt: new Date() }, { $set: true }, context);
      if (result) {
        let code = 200;
        if(vacation.isAutoCancelAppointment){
          cancelAppointmentsOnVacation(userId,startDate, endDate , obj, context, info );
        }

        let response = new MlRespPayload().successPayload('Vacation added successfully', code);
        return response;
      }
    }
  } else {
    let dataToInsert = {
      userId: userId,
      profileId: profileId,
      createdAt: new Date(),
      vacations: [vacation]
    };
    let result = mlDBController.insert('MlCalendarSettings', dataToInsert, context);
    if (result) {
      let code = 200;
      let response = new MlRespPayload().successPayload('Calendar settings updated successfully', code);
      return response;
    }
  }
}

let cancelAppointmentsOnVacation = (userId, startDate, endDate, obj, context, info)=>{
  let pipeline = [
    {
      $match:{
        $or:[{"status":"Pending"},{"status":"Accepted"}]
      }
    },
    {
      $lookup:{
        from:'mlAppointments',
        localField:'appointmentId',
        foreignField:'appointmentId',
        as:'appointment'
      }
    },
    {
      $unwind: "$appointment"
    },
    {
      $match:{
        $and:[
          {"appointment.isCancelled":false},
          {
            $or:[
              {
                '$and':[
                  {'appointment.startDate': { "$gte": startDate }},
                  {'appointment.startDate': { "$lt": endDate }},
                ]
              },
              {
                '$and':[
                  {'appointment.endDate': { "$gt": startDate }},
                  {'appointment.endDate': { "$lte": endDate }},
                ]
              },
              {
                '$and':[
                  {'appointment.startDate': { "$lte": startDate }},
                  {'appointment.endDate': { "$gte": endDate }},
                ]
              },
              {
                '$and':[
                  {'appointment.startDate': { "$gte": startDate }},
                  {'appointment.endDate': { "$lte": endDate }},
                ]
              },
            ]
          }
        ]
      }
    },
    {
      "$project": {
        appointmentId: 1,_id:0,"appointment.createdBy":1
      }
    }

  ];

  let res = mlDBController.aggregate('MlAppointmentMembers', pipeline, context);

  let arrayOfId = res.map(obj => obj.appointmentId);
  let uniqueArrayOfId = arrayOfId.filter((v, i, a) => a.indexOf(v) === i);

  if(uniqueArrayOfId && uniqueArrayOfId.length){

    let dbres1 = mlDBController.update('MlAppointmentMembers', {appointmentId: { $in : uniqueArrayOfId }},  {status:'Rejected'},
      {$set:true,multi:true}, context);

    let appointmentsByCreator = res.filter((v, i, a) => v.appointment.createdBy === userId)

    // let dbres2 = mlDBController.update('MlAppointments',{
    //     $and:[
    //       {appointmentId: { $in : uniqueArrayOfId }},
    //       {createdBy : userId}
    //     ]
    //   },  { isCancelled:true},
    //   {$set:true,multi:true}, context);

    appointmentsByCreator.map(obj=>{
      cancelUSerServiceCardAppointment(obj.appointmentId, context);
    });

  }
}

let cancelUSerServiceCardAppointment=(appointmentId, context)=>{

  let appointmentInfo = mlDBController.findOne('MlAppointments', {appointmentId: appointmentId}, context);
  if(!appointmentInfo || !appointmentInfo.appointmentInfo || appointmentInfo.appointmentInfo.resourceType !== "ServiceCard" ) {
    return;
  }

  let serviceId = appointmentInfo.appointmentInfo.serviceCardId;
  let serviceInfo = mlDBController.findOne('MlServiceCardDefinition', serviceId, context);
  if( !serviceInfo ) {
    return;
  }

  if( !serviceInfo.termsAndCondition || !serviceInfo.termsAndCondition.isReschedulable ) {
    return;
  }

  let noOfReschedule = serviceInfo.termsAndCondition.noOfReschedulable || 0;
  let rescheduleTrails = appointmentInfo.rescheduleTrail ? rescheduleTrail.rescheduleTrail.length : 0;
  if( noOfReschedule <= rescheduleTrails ) {
    return;
  }

  let memberResponse = mlDBController.update('MlAppointmentMembers', {appointmentId: appointmentId}, { isCancelled: true }, {$set:true, multi: true}, context);
  if(!memberResponse){
    return;
  }
  let appointmentResponse = mlDBController.update('MlAppointments', {appointmentId: appointmentId}, { isCancelled: true }, {$set:true, multi: true}, context);
  return;
}

MlResolver.MlMutationResolver['updateCalendarVacationByVacationId'] = (obj, args, context, info) => {
  let vacation = args.vacation;
  let userId = context.userId;
  // let profileId = new MlUserContext().userProfileDetails(userId).profileId;
  let profileId;
  if (args.profileId) {
    profileId = args.profileId;
  } else {
    profileId = new MlUserContext().userProfileDetails(userId).profileId;
  };
  if (!userId) {
    let code = 400;
    let result = 'User ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  if (!profileId) {
    let code = 400;
    let result = 'Profile ID is not defined for this user';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  if (!vacation) {
    let code = 400;
    let result = 'Vacation data is missing';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
  vacation.start = new Date(vacation.start);
  vacation.end = new Date(vacation.end);
  vacation.vacationId = args.vacationId || '';
  let isAlreadyExist = mlDBController.findOne('MlCalendarSettings', { userId: userId, profileId: profileId }, context);
  if (isAlreadyExist) {
    isAlreadyExist.vacations = isAlreadyExist.vacations ? isAlreadyExist.vacations : [];
    let startDate = new Date(vacation.start);
    let endDate = new Date(vacation.end);
    let isAlreadyOnVacation = false;
    isAlreadyExist.vacations.forEach(function (vacationInfo) {
      if (vacationInfo.vacationId !== args.vacationId) {
        let vacationStartDate = new Date(vacationInfo.start);
        let vacationEndDate = new Date(vacationInfo.end);
        if (vacationStartDate.getTime() <= startDate.getTime() && startDate.getTime() <= vacationEndDate.getTime() || vacationStartDate.getTime() <= endDate.getTime() && endDate.getTime() <= vacationEndDate.getTime()) {
          isAlreadyOnVacation = true;
        }
      }
    });
    if (isAlreadyOnVacation) {
      let code = 400;
      let response = new MlRespPayload().errorPayload('Vacation dates are overlapping', code);
      return response;
    } else {
      //isAlreadyExist.vacations.push(vacation);
      let newVacationData = isAlreadyExist.vacations.map((vactionData) => {
        if (vactionData.vacationId === args.vacationId) {
          return vacation;
        } else {
          return vactionData;
        }
      });
      let result = mlDBController.update('MlCalendarSettings', isAlreadyExist._id, { vacations: newVacationData, updatedAt: new Date() }, { $set: true }, context);
      if (result) {

        if(vacation.isAutoCancelAppointment){
          cancelAppointmentsOnVacation(userId, startDate, endDate,  obj, context, info);
        }

        let code = 200;
        let response = new MlRespPayload().successPayload('Calendar settings updated successfully', code);
        return response;
      }
    }
  } else {
    let code = 400;
    let result = 'Calendar Setting not found';
    let response = new MlRespPayload().errorPayload(result, code);
    return response;
  }
};


MlResolver.MlQueryResolver['getUserProfileDetails'] = (obj, args, context, info) => {
  let userId = args.userId ? args.userId : context.userId;
  let pipleline = [
    { "$match": { _id: userId } },
    { "$unwind": "$profile.externalUserProfiles" },
    {
      "$lookup": {
        "from": "mlSubChapters",
        "localField": "profile.externalUserProfiles.subChapterId",
        "foreignField": "_id",
        "as": "subDepartment"
      }
    },
    { "$unwind": "$subDepartment" },
    {
      "$project": {
        "userId": "$_id",
        "firstName": "$profile.firstName",
        "lastName": "$profile.lastName",
        "displayName": "$profile.displayName",
        "profileId": "$profile.externalUserProfiles.profileId",
        "profileImage": "$profile.profileImage",
        "clusterId": "$profile.externalUserProfiles.clusterId",
        "clusterName": "$profile.externalUserProfiles.clusterName",
        "chapterId": "$profile.externalUserProfiles.chapterId",
        "chapterName": "$profile.externalUserProfiles.chapterName",
        "subChapterId": "$profile.externalUserProfiles.subChapterId",
        "subChapterName": "$profile.externalUserProfiles.subChapterName",
        "communityId": "$profile.externalUserProfiles.communityId",
        "communityName": "$profile.externalUserProfiles.communityName",
        "communityDefCode": "$profile.externalUserProfiles.communityDefCode",
        "communityDefName": "$profile.externalUserProfiles.communityDefName",
        "isActive": "$profile.externalUserProfiles.isActive",
        "isApprove": "$profile.externalUserProfiles.isApprove",
        "isMoolya": "$subDepartment.isDefaultSubChapter"
      }
    },
    {
      "$lookup": { "from": "mlResourceConfig", "localField": "communityDefCode", "foreignField": "community.communityCode", "as": "resource" }
    },
    {
      "$addFields": {
        "resource": {
          "$reduce": {
            "input": "$resource",
            "initialValue": [],
            "in": { "$concatArrays": ["$$value", ["$$this.resourceCode"]] }
          }
        }
      }
    },
    {
      "$addFields": {
        "isHasManageSchedule": { $in: ["MANAGESCHEDULE", "$resource"] },
        "isHasOffice": { $in: ["OFFICE", "$resource"] }
      }
    },
    {
      "$lookup": { "from": "mlOffice", "localField": "profileId", "foreignField": "profileId", "as": "offices" }
    }
  ];
  return mlDBController.aggregate('users', pipleline, context);
};

MlResolver.MlQueryResolver['getUserActiveProfileDetails'] = (obj, args, context, info) => {
  let userId = args.userId ? args.userId : context.userId;
  let pipleline = [
    { "$match": { _id: userId } },
    { "$unwind": "$profile.externalUserProfiles" },
    { "$lookup" : {
      from: "mlRegistration",
      localField: "profile.externalUserProfiles.registrationId",
      foreignField: "_id",
      as: "regInfo"
    }
    },
    { "$unwind": "$regInfo" },
    { "$match" : { "regInfo.status": "REG_USER_APR"} },
    {
      "$lookup": {
        "from": "mlSubChapters",
        "localField": "profile.externalUserProfiles.subChapterId",
        "foreignField": "_id",
        "as": "subDepartment"
      }
    },
    { "$unwind": "$subDepartment" },
    {
      "$project": {
        "userId": "$_id",
        "firstName": "$profile.firstName",
        "lastName": "$profile.lastName",
        "displayName": "$profile.displayName",
        "profileId": "$profile.externalUserProfiles.profileId",
        "profileImage": "$profile.profileImage",
        "clusterId": "$profile.externalUserProfiles.clusterId",
        "clusterName": "$profile.externalUserProfiles.clusterName",
        "chapterId": "$profile.externalUserProfiles.chapterId",
        "chapterName": "$profile.externalUserProfiles.chapterName",
        "subChapterId": "$profile.externalUserProfiles.subChapterId",
        "subChapterName": "$profile.externalUserProfiles.subChapterName",
        "communityId": "$profile.externalUserProfiles.communityId",
        "communityName": "$profile.externalUserProfiles.communityName",
        "communityDefCode": "$profile.externalUserProfiles.communityDefCode",
        "communityDefName": "$profile.externalUserProfiles.communityDefName",
        "isActive": "$profile.externalUserProfiles.isActive",
        "isApprove": "$profile.externalUserProfiles.isApprove",
        "isMoolya": "$subDepartment.isDefaultSubChapter"
      }
    },
    { "$match": { isActive: true } },
    {
      "$lookup": { "from": "mlResourceConfig", "localField": "communityDefCode", "foreignField": "community.communityCode", "as": "resource" }
    },
    {
      "$addFields": {
        "resource": {
          "$reduce": {
            "input": "$resource",
            "initialValue": [],
            "in": { "$concatArrays": ["$$value", ["$$this.resourceCode"]] }
          }
        }
      }
    },
    {
      "$addFields": {
        "isHasManageSchedule": { $in: ["MANAGESCHEDULE", "$resource"] },
        "isHasOffice": { $in: ["OFFICE", "$resource"] }
      }
    },
    {
      "$lookup": { "from": "mlOffice", "localField": "profileId", "foreignField": "profileId", "as": "offices" }
    }
  ];
  return mlDBController.aggregate('users', pipleline, context);
};
