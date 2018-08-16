/** ************************************************************
 * Date: 26 Jun, 2017
 * Programmer: Pankaj <pankajkumar.jatav@raksan.in>
 * Description : Appointments Query and mutation definition
 * JavaScript XML file appointmentResolver.js
 * *************************************************************** */

import MlResolver from '../../commons/mlResolverDef';
import MlRespPayload from '../../commons/mlPayload';
import MlUserContext from '../../MlExternalUsers/mlUserContext';
import MlAppointment from './appointment';
import mlServiceCardRepo from '../servicecards/servicecardRepo';
import { APPOINTMENT_TODAY, APPOINTMENT_EXPIRED, APPOINTMENT_COMPLETED, APPOINTMENT_ACCEPTED } from '../../commons/constants';

MlResolver.MlMutationResolver["bookUserServiceCard"] = (obj, args, context, info) => {
  let userId = context.userId;
  let profileId = new MlUserContext().userProfileDetails(userId).profileId;
  let serviceId = args.serviceId;
  let service = mlDBController.findOne('MlServiceCardDefinition', serviceId, context);
  let tax = 0; // Need to update later
  let discountAmount = 0; // Need to update later

  /**
   * Define data to insert in service card order
   * Note :: start date and end data will update when user create payment
   */
  let dataToInsert = {
    userId: userId,
    profileId: profileId,
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
    createdAt: new Date(),
    taskDetails: args.taskDetails
  };
  orderNumberGenService.createUserServiceOrderId(dataToInsert);
  let result = mlDBController.insert('MlUserServiceCardOrder', dataToInsert, context);
  if (typeof result === "string") {
    let code = 200;
    let response = new MlRespPayload().errorPayload(dataToInsert.transactionId, code);
    return response;
  }
  let code = 400;
  let response = new MlRespPayload().errorPayload(result, code);
  return response;
};

MlResolver.MlMutationResolver["userServiceCardPayment"] = (obj, args, context, info) => {
  let orderId = args.userServiceCardPaymentInfo.orderId;
  let userId = context.userId;
  let service = mlDBController.findOne('MlUserServiceCardOrder', { transactionId: orderId }, context);
  let dataToInsert = {
    paymentId: args.userServiceCardPaymentInfo.paymentId,
    paymentMethod: args.userServiceCardPaymentInfo.paymentMethod,
    amount: args.userServiceCardPaymentInfo.amount,
    currencyId: args.userServiceCardPaymentInfo.currencyCode,
    resourceId: orderId,
    resourceType: "UserServiceCard",
    userId: userId,
    createdAt: new Date()
  };
  let paymentResponse = mlDBController.insert('MlPayment', dataToInsert, context);
  if (typeof paymentResponse === "string") {
    let serviceResponse = mlDBController.update('MlUserServiceCardOrder', service._id, { paymentStatus: 'paid' }, { $set: 1 }, context);
    if (serviceResponse) {
      //Add leader balance
      let code = 200;
      let response = new MlRespPayload().errorPayload("Payment Updated", code);
      return response;
    } else {
      let code = 400;
      let response = new MlRespPayload().errorPayload(paymentResponse, code);
      return response;
    }
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload(paymentResponse, code);
    return response;
  }
};

MlResolver.MlMutationResolver["bookUserServiceCardAppointment"] = (obj, args, context, info) => {
  let orderId = args.userServiceCardAppointmentInfo.orderId;
  let sessionId = args.userServiceCardAppointmentInfo.sessionId;
  let SCOrderDetails = mlDBController.findOne('MlScOrder', { orderId: orderId }, context);
  let extraUsers = args.userServiceCardAppointmentInfo.extraUsers ? args.userServiceCardAppointmentInfo.extraUsers : [];
  if (!SCOrderDetails) {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Order is not valid", code);
    return response;
  }

  let serviceId = SCOrderDetails.serviceId;
  if (!serviceId) {
    let code = 400;
    let response = new MlRespPayload().errorPayload("'Service Id' is not attached in this order", code);
    return response;
  }

  let serviceLedgerBalance = mlDBController.findOne('MlServiceLedger', { serviceId: serviceId }, context);
  let taskInfo = serviceLedgerBalance.serviceCard.tasks; // Update task fetch info in case serviceLedgerBalance schema update
  let task = taskInfo.find(function (data) {
    data.sessions = data.sessions ? data.sessions : [];
    return data.sessions.some(function (session) {
      return session.id == sessionId;
    });
  });

  if (!task) {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Task id is not attached in this order", code);
    return response;
  }

  let taskId = task.id;

  if (!taskId) {
    let code = 400;
    let response = new MlRespPayload().errorPayload("Task id is not attached in service card definition", code);
    return response;
  }

  let day = args.userServiceCardAppointmentInfo.day; //date.getDate();
  let month = args.userServiceCardAppointmentInfo.month; //date.getMonth();
  let year = args.userServiceCardAppointmentInfo.year; //date.getFullYear();
  let hours = args.userServiceCardAppointmentInfo.hours; //9;
  let minutes = args.userServiceCardAppointmentInfo.minutes; // 0;
  let appointment = MlAppointment.bookAppointment('appointmentId', taskId, sessionId, hours, minutes, day, month, year);
  if (appointment.success) {
    let taskDoc = mlDBController.findOne('MlTask', taskId, context);
    let session = taskDoc.session.find(function (data) {
      return data.sessionId == sessionId;
    });

    session.activities = session.activities ? session.activities : [];

    let activities = mlDBController.find('MlActivity', { _id: { $in: session.activities } }, context).fetch();

    let attendees = activities.reduce(function (attendee, data) {
      data.teams = data.teams ? data.teams : [];
      data.teams.forEach(function (team) {
        team.users = team.users ? team.users : [];
        team.users = team.users.filter(function (user) {
          let isFind = attendee.find(function (data) {
            return user.profileId == data.profileId && user.userId == user.profileId;
          });
          if (isFind) {
            return false;
          } else {
            return true;
          }
        });
        attendee = attendee.concat(team.users);
      });
      return attendee;
    }, extraUsers);

    let userId = context.userId;
    let profileId = new MlUserContext().userProfileDetails(userId).profileId;
    let service = mlDBController.findOne('MlServiceCardDefinition', serviceId, context);
    let appointmentData = {
      appointmentType: 'SERVICE-TASK',
      startDate: appointment.start,
      endDate: appointment.end,
      duration: session.duration ? session.duration : {},
      timeZone: '+05:30', //to do
      provider: {
        userId: service.userId,
        profileId: service.profileId
      },
      client: {
        userId: SCOrderDetails.userId,
        profileId: SCOrderDetails.profileId
      },
      appointmentInfo: {
        resourceType: 'ServiceCard',
        resourceId: SCOrderDetails.serviceId,
        serviceCardId: SCOrderDetails.serviceId,
        serviceName: SCOrderDetails.serviceName,
        taskId: taskId,
        sessionId: sessionId,
        serviceOrderId: orderId
      },
      status: 'Accepted',
      isCancelled: false,
      isSelf: false,
      isRescheduled: false,
      isInternal: false,
      createdAt: new Date(),
      createdBy: userId
    };

    orderNumberGenService.createAppointmentId(appointmentData);

    let result = mlDBController.insert('MlAppointments', appointmentData, context);

    if (result) {
      const transactionAttendeeDetails = [];
      /**
       * Insert appointment member info
       */
      attendees.forEach(function (attendee) {
        if (attendee.userId === SCOrderDetails.userId && attendee.profileId === SCOrderDetails.profileId) {
          return true;
        }
        if (attendee.userId === service.userId && attendee.profileId === service.profileId) {
          return true;
        }
        let attendeeData = {
          appointmentId: appointmentData.appointmentId,
          appointmentUniqueId: result,
          userId: attendee.userId,
          profileId: attendee.profileId,
          status: attendee.isMandatory ? 'Accepted' : 'Pending',
          isProvider: false,
          isClient: false,
          isAttendee: true,
          createdAt: new Date(),
          createdBy: userId
        };
        let resp = mlDBController.insert('MlAppointmentMembers', attendeeData, context);
        transactionAttendeeDetails.push({ userId: attendee.userId, profileId: attendee.profileId });
      });

      /**
       * Insert client data as appointment member
       */
      let clientData = {
        appointmentId: appointmentData.appointmentId,
        appointmentUniqueId: result,
        userId: SCOrderDetails.userId,
        profileId: SCOrderDetails.profileId,
        status: 'Accepted',
        isProvider: false,
        isClient: true,
        isAttendee: false,
        createdAt: new Date(),
        createdBy: userId
      };
      let resp = mlDBController.insert('MlAppointmentMembers', clientData, context);

      /**
       * Insert provider data as appointment member
       */
      let providerData = {
        appointmentId: appointmentData.appointmentId,
        appointmentUniqueId: result,
        userId: service.userId,
        profileId: service.profileId,
        status: 'Accepted',
        isProvider: true,
        isClient: false,
        isAttendee: false,
        createdAt: new Date(),
        createdBy: userId
      };
      resp = mlDBController.insert('MlAppointmentMembers', providerData, context);

      mlServiceCardRepo.createTransactionRequest(service.userId, 'sessionAppointment', appointmentData.appointmentId, SCOrderDetails.serviceId, SCOrderDetails.userId, 'user', context, transactionAttendeeDetails);
      let code = 200;
      let response = new MlRespPayload().successPayload("Appointment book successfully", code);
      return response;
    }
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload(appointment.message, code);
    return response;
  }
};

MlResolver.MlQueryResolver["fetchMyAppointmentByStatus"] = (obj, args, context, info) => {

  let userId = context.userId;
  let profileId = new MlUserContext().userProfileDetails(userId).profileId;
  let appointments = mlDBController.aggregate('MlAppointments', [
    {
      $lookup: {
        from: "mlAppointmentMembers",
        localField: "appointmentId",
        foreignField: "appointmentId",
        as: "members"
      }
    },
    { "$unwind": "$members" },
    { "$match": { 'members.userId': userId, 'members.profileId': profileId, 'members.status': args.status } }
  ]);
  return appointments;
};

MlResolver.MlQueryResolver["fetchAllProfileAppointmentCounts"] = (obj, args, context, info) => {
  let userId = context.userId;
  let date = new Date();
  let month = args.month ? args.month : date.getMonth();
  let year = args.year ? args.year : date.getFullYear();
  let timeZoneOffsetInMinutes = 330;
  let pipeLine = [
    { $lookup: { from: "mlAppointmentMembers", localField: "appointmentId", foreignField: "appointmentId", as: "members" } },
    { $unwind: "$members" },
    { $match: { "members.userId": userId, "members.status": { "$ne": "Rejected" } } },
    { $addFields: { "startDate": { $add: ["$startDate", timeZoneOffsetInMinutes * 60 * 1000] } } },
    {
      $project: {
        yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
        time: { $dateToString: { format: "%H:%M:%S:%L", date: "$Date" } },
        appointmentInfo: 1,
        members: 1,
        userId: "$members.userId",
        profileId: "$members.profileId",
        appointmentId: 1
      }
    },
    {
      $group: {
        _id: { date: "$yearMonthDay", "userId": "$userId", "profileId": "$profileId" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        userId: "$_id.userId",
        profileId: "$_id.profileId",
        count: "$count"
      }
    },
    {
      $group: {
        _id: null,
        profileId: { $first: "$profileId" },
        events: { $push: "$$ROOT" }
      }
    }
  ];
  let result = mlDBController.aggregate('MlAppointments', pipeLine);
  result = result && result[0] ? result[0] : [];
  return result;
};

MlResolver.MlQueryResolver["fetchProfileAppointmentCounts"] = (obj, args, context, info) => {
  let userId = context.userId;
  let profileId = args.profileId;
  let date = new Date();
  let month = args.month ? args.month : date.getMonth();
  month = month + 1;
  let year = args.year ? args.year : date.getFullYear();
  let timeZoneOffsetInMinutes = 330;
  let pipeLine = [
    { $lookup: { from: "mlAppointmentMembers", localField: "appointmentId", foreignField: "appointmentId", as: "members" } },
    { $unwind: "$members" },
    { $match: { "members.userId": userId, "members.profileId": profileId, "members.status": { "$ne": "Rejected" } } },
    { $addFields: { "startDate": { $add: ["$startDate", timeZoneOffsetInMinutes * 60 * 1000] } } },
    {
      $project: {
        yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
        time: { $dateToString: { format: "%H:%M:%S:%L", date: "$Date" } },
        appointmentInfo: 1,
        members: 1,
        userId: "$members.userId",
        profileId: "$members.profileId",
        appointmentId: 1
      }
    },
    {
      $group: {
        _id: { date: "$yearMonthDay", "userId": "$userId", "profileId": "$profileId" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        userId: "$_id.userId",
        profileId: "$_id.profileId",
        count: "$count"
      }
    },
    {
      $group: {
        _id: null,
        profileId: { $first: "$profileId" },
        events: { $push: "$$ROOT" }
      }
    },
    {
      $lookup: { from: "mlCalendarSettings", localField: "profileId", foreignField: "profileId", as: "days" }
    },
    {
      "$unwind": {
        "path": "$days",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      "$addFields": { "days": { $cond: [{ $isArray: "$days.vacations" }, "$days.vacations", []] } }
    },
    {
      $project: {
        events: 1,
        days: {
          "$filter": {
            "input": "$days",
            "as": "day",
            "cond": {
              "$and": [
                {
                  "$or": [
                    { "$cond": [{ "$eq": [{ "$month": "$$day.start" }, month] }, true, false] },
                    { "$cond": [{ "$eq": [{ "$month": "$$day.end" }, month] }, true, false] }
                  ]
                },
                { "$eq": ["$$day.isActive", true] }
              ]
            }
          }
        }
      }
    }
  ];

  let result = mlDBController.aggregate('MlAppointments', pipeLine);
  result = result && result[0] ? result[0] : [];

  if (!result.events) {
    let vacationPipeline = [
      { $match: { "userId": userId, "profileId": profileId } },
      {
        $project: {
          events: [],
          days: {
            "$filter": {
              "input": "$vacations",
              "as": "day",
              "cond": {
                "$and": [
                  {
                    "$or": [
                      { "$cond": [{ "$eq": [{ "$month": "$$day.start" }, month] }, true, false] },
                      { "$cond": [{ "$eq": [{ "$month": "$$day.end" }, month] }, true, false] }
                    ]
                  },
                  { "$eq": ["$$day.isActive", true] }
                ]
              }
            }
          }
        }
      }
    ];
    result = mlDBController.aggregate('MlCalendarSettings', vacationPipeline);

    result = result && result[0] ? result[0] : [];

  }

  return result;

};

MlResolver.MlQueryResolver['fetchOfficeMemberAppointmentCounts'] = (obj, args, context, info) => {
  let userId = args.userId;
  let profileId = args.profileId;
  let date = new Date();
  let month = args.month ? args.month : date.getMonth();
  let year = args.year ? args.year : date.getFullYear();
  let timeZoneOffsetInMinutes = 330;
  let pipeLine = [
    { $lookup: { from: "mlAppointmentMembers", localField: "appointmentId", foreignField: "appointmentId", as: "members" } },
    { $unwind: "$members" },
    { $match: { "members.userId": userId, "members.profileId": profileId, "members.status": { "$ne": "Rejected" } } },
    { $addFields: { "startDate": { $add: ["$startDate", timeZoneOffsetInMinutes * 60 * 1000] } } },
    {
      $project: {
        yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
        time: { $dateToString: { format: "%H:%M:%S:%L", date: "$Date" } },
        appointmentInfo: 1,
        members: 1,
        userId: "$members.userId",
        profileId: "$members.profileId",
        appointmentId: 1
      }
    },
    {
      $group: {
        _id: { date: "$yearMonthDay", "userId": "$userId", "profileId": "$profileId" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        userId: "$_id.userId",
        profileId: "$_id.profileId",
        count: "$count"
      }
    },
    {
      $group: {
        _id: null,
        profileId: { $first: "$profileId" },
        events: { $push: "$$ROOT" }
      }
    },
    {
      $lookup: { from: "mlCalendarSettings", localField: "profileId", foreignField: "profileId", as: "days" }
    },
    {
      "$unwind": {
        "path": "$days",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      "$addFields": { "days": { $cond: [{ $isArray: "$days.vacations" }, "$days.vacations", []] } }
    },
    {
      $project: {
        events: 1,
        days: {
          "$filter": {
            "input": "$days",
            "as": "day",
            "cond": {
              "$and": [
                {
                  "$or": [
                    { "$cond": [{ "$eq": [{ "$month": "$$day.start" }, month] }, true, false] },
                    { "$cond": [{ "$eq": [{ "$month": "$$day.end" }, month] }, true, false] }
                  ]
                },
                { "$eq": ["$$day.isActive", true] }
              ]
            }
          }
        }
      }
    }
  ];

  let result = mlDBController.aggregate('MlAppointments', pipeLine);
  result = result && result[0] ? result[0] : [];

  if (!result.events) {
    let vacationPipeline = [
      { $match: { "userId": userId, "profileId": profileId } },
      {
        $project: {
          events: [],
          days: {
            "$filter": {
              "input": "$vacations",
              "as": "day",
              "cond": {
                "$and": [
                  {
                    "$or": [
                      { "$cond": [{ "$eq": [{ "$month": "$$day.start" }, month] }, true, false] },
                      { "$cond": [{ "$eq": [{ "$month": "$$day.end" }, month] }, true, false] }
                    ]
                  },
                  { "$eq": ["$$day.isActive", true] }
                ]
              }
            }
          }
        }
      }
    ];
    result = mlDBController.aggregate('MlCalendarSettings', vacationPipeline);
    result = result && result[0] ? result[0] : [];
  }
  return result;
};

MlResolver.MlQueryResolver['fetchAllOfficeMemberAppointmentCounts'] = (obj, args, context, info) => {
  let userId = context.userId;
  let profileId = new MlUserContext().userProfileDetails(userId).profileId;
  let date = new Date();
  let month = args.month ? args.month : date.getMonth();
  let year = args.year ? args.year : date.getFullYear();
  let timeZoneOffsetInMinutes = 330;
  let pipeLine = [
    { $lookup: { from: "mlOffice", localField: "officeId", foreignField: "_id", as: "office" } },
    { $match: { 'office.userId': userId, 'office.profileId': profileId, "members.status": { "$ne": "Rejected" } } },
    {
      $lookup:
      {
        from: "users",
        localField: "emailId",
        foreignField: "username",
        as: "user"
      }
    },
    { "$unwind": "$user" },
    { "$match": { 'user.profile.isActive': true } },
    { "$project": { name: 1, profileId: 1, userId: '$user._id', profileImage: '$user.profile.profileImage' } },
    { "$lookup": { from: "mlAppointmentMembers", localField: "profileId", foreignField: "profileId", as: "appointments" } },
    { "$unwind": "$appointments" },
    { "$lookup": { from: "mlAppointments", localField: "appointments.appointmentId", foreignField: "appointmentId", as: "appointmentData" } },
    { "$unwind": "$appointmentData" },
    { "$replaceRoot": { newRoot: "$appointmentData" } },
    { $addFields: { "startDate": { $add: ["$startDate", timeZoneOffsetInMinutes * 60 * 1000] } } },
    {
      $project: {
        yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
        time: { $dateToString: { format: "%H:%M:%S:%L", date: "$Date" } },
        appointmentInfo: 1,
        appointmentId: 1
      }
    },
    {
      $group: {
        _id: { date: "$yearMonthDay", "userId": "$userId", "profileId": "$profileId" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        count: "$count"
      }
    },
    {
      $group: {
        _id: null,
        events: { $push: "$$ROOT" }
      }
    }
  ];

  let result = mlDBController.aggregate('MlOfficeMembers', pipeLine);
  result = result && result[0] ? result[0] : [];
  return result;
};

MlResolver.MlMutationResolver["bookTaskInternalAppointment"] = (obj, args, context, info) => {
  let taskId = args.taskInternalAppointmentInfo.taskId;
  let sessionId = args.taskInternalAppointmentInfo.sessionId;
  let day = args.taskInternalAppointmentInfo.day; //date.getDate();
  let month = args.taskInternalAppointmentInfo.month; //date.getMonth();
  let year = args.taskInternalAppointmentInfo.year; //date.getFullYear();
  let hours = args.taskInternalAppointmentInfo.hours; //9;
  let minutes = args.taskInternalAppointmentInfo.minutes; // 0;
  let extraUsers = args.taskInternalAppointmentInfo.extraUsers ? args.taskInternalAppointmentInfo.extraUsers : [];

  let startDate = new Date();
  startDate.setDate(day);
  startDate.setMonth(month);
  startDate.setYear(year);
  startDate.setHours(hours);
  startDate.setMinutes(minutes);
  startDate.setSeconds(0, 0);

  let taskDoc = mlDBController.findOne('MlTask', taskId, context);
  let session = taskDoc.session.find(function (data) {
    return data.sessionId == sessionId;
  });

  session.activities = session.activities ? session.activities : [];

  let activities = mlDBController.find('MlActivity', { _id: { $in: session.activities } }, context).fetch();

  let attendees = activities.reduce(function (attendee, data) {
    data.teams = data.teams ? data.teams : [];
    data.teams.forEach(function (team) {
      team.users = team.users ? team.users : [];
      team.users = team.users.filter(function (user) {
        let isFind = attendee.find(function (data) {
          return user.profileId == data.profileId && user.userId == user.profileId;
        });
        if (isFind) {
          return false;
        } else {
          return true;
        }
      });
      attendee = attendee.concat(team.users);
    });
    return attendee;
  }, extraUsers);

  let userId = context.userId;
  let profileId = new MlUserContext().userProfileDetails(userId).profileId;
  profileId = taskDoc.userId == userId ? taskDoc.profileId : profileId;

  session.duration = session.duration ? session.duration : {};
  let sessionHours = session.duration.hours ? session.duration.hours : 0;
  let sessionMinutes = session.duration.minutes ? session.duration.minutes : 0;
  let endDate = new Date(startDate);
  endDate.setHours(hours + sessionHours);
  endDate.setMinutes(minutes + sessionMinutes);

  let appointmentData = {
    appointmentType: 'INTERNAL-TASK',
    startDate: startDate,
    endDate: endDate,
    duration: session.duration ? session.duration : {},
    timeZone: '+05:30', //to do
    provider: {
      userId: taskDoc.userId,
      profileId: taskDoc.profileId
    },
    appointmentInfo: {
      resourceType: 'Task',
      resourceId: taskId,
      taskId: taskId,
      taskName: taskDoc.displayName,
      sessionId: sessionId
    },
    status: 'Pending',
    isCancelled: false,
    isSelf: false,
    isRescheduled: false,
    isInternal: true,
    createdAt: new Date(),
    createdBy: userId
  };

  orderNumberGenService.createAppointmentId(appointmentData);

  let result = mlDBController.insert('MlAppointments', appointmentData, context);

  if (result) {

    /**
     * Insert appointment creater data as appointment member
     */
    let providerData = {
      appointmentId: appointmentData.appointmentId,
      appointmentUniqueId: result,
      userId: userId,
      profileId: profileId,
      status: 'Accepted',
      isProvider: profileId == taskDoc.profileId ? true : false,
      isClient: false,
      isAttendee: false,
      createdAt: new Date(),
      createdBy: userId
    };
    resp = mlDBController.insert('MlAppointmentMembers', providerData, context);

    /**
     * Insert appointment member info
     */
    attendees.forEach(function (attendee) {
      if (attendee.userId === userId && attendee.profileId === profileId) {
        return true;
      }
      let attendeeData = {
        appointmentId: appointmentData.appointmentId,
        appointmentUniqueId: result,
        userId: attendee.userId,
        profileId: attendee.profileId,
        status: attendee.isMandatory ? 'Accepted' : 'Pending',
        isProvider: false,
        isClient: false,
        isAttendee: true,
        createdAt: new Date(),
        createdBy: userId
      };
      let resp = mlDBController.insert('MlAppointmentMembers', attendeeData, context);
    });

    let code = 200;
    let response = new MlRespPayload().successPayload("Appointment booked successfully", code);
    return response;
  }
};

MlResolver.MlMutationResolver["bookSelfTaskInternalAppointment"] = (obj, args, context, info) => {
  let day = args.selfInternalAppointmentInfo.day; //date.getDate();
  let month = args.selfInternalAppointmentInfo.month; //date.getMonth();
  let year = args.selfInternalAppointmentInfo.year; //date.getFullYear();
  let hours = args.selfInternalAppointmentInfo.hours; //9;
  let minutes = args.selfInternalAppointmentInfo.minutes; // 0;

  let taskDetails = args.selfInternalAppointmentInfo.taskDetails;

  let taskId = mlDBController.insert('MlAppointmentTask', taskDetails, context);

  let startDate = new Date();
  startDate.setDate(day);
  startDate.setMonth(month);
  startDate.setYear(year);
  startDate.setHours(hours);
  startDate.setMinutes(minutes);
  startDate.setSeconds(0, 0);

  taskDetails.duration = taskDetails.duration ? taskDetails.duration : {};

  let sessionHours = taskDetails.duration.hours ? taskDetails.duration.hours : 0;
  let sessionMinutes = taskDetails.duration.minutes ? taskDetails.duration.minutes : 0;

  let endDate = new Date(startDate);
  endDate.setHours(hours + sessionHours);
  endDate.setMinutes(minutes + sessionMinutes);

  let userId = context.userId;
  let profileId = new MlUserContext().userProfileDetails(userId).profileId;

  let appointmentData = {
    appointmentType: 'SELF-TASK',
    startDate: startDate,
    endDate: endDate,
    duration: taskDetails.duration ? taskDetails.duration : {},
    timeZone: '+05:30', //to do
    provider: {
      userId: userId,
      profileId: profileId
    },
    appointmentInfo: {
      resourceType: 'Task',
      resourceId: taskId,
      taskId: taskId,
      taskName: taskDetails.name,
    },
    status: 'Pending',
    isCancelled: false,
    isSelf: true,
    isRescheduled: false,
    isInternal: true,
    createdAt: new Date(),
    createdBy: userId
  };

  orderNumberGenService.createAppointmentId(appointmentData);

  let result = mlDBController.insert('MlAppointments', appointmentData, context);

  if (result) {

    /**
     * Insert provider data as appointment member
     */
    let providerData = {
      appointmentId: appointmentData.appointmentId,
      appointmentUniqueId: result,
      userId: userId,
      profileId: profileId,
      status: 'Accepted',
      isProvider: true,
      isClient: false,
      isAttendee: false,
      createdAt: new Date(),
      createdBy: userId
    };
    let resp = mlDBController.insert('MlAppointmentMembers', providerData, context);


    let code = 200;
    let response = new MlRespPayload().successPayload("Appointment booked successfully", code);
    return response;
  }
};

MlResolver.MlQueryResolver["fetchServiceSeekerList"] = (obj, args, context, info) => {

  let userId = context.userId;
  let profileId = args.profileId;

  let pipeLine = [
    { "$match": { "profileId": userId, "profileId": profileId } }
  ];

  if (args.serviceId) {
    pipeLine.push({
      "$match": { "serviceId": args.serviceId }
    });
  }

  pipeLine.push({
    "$lookup": { from: "mlScOrder", localField: "_id", foreignField: "serviceId", as: "orders" }
  });

  pipeLine.push({
    "$unwind": "$orders"
  });

  pipeLine.push({
    "$lookup": { from: "users", localField: "orders.userId", foreignField: "_id", as: "users" }
  });

  pipeLine.push({ "$unwind": "$users" });

  pipeLine.push({
    "$project":
    {
      "name": "$users.profile.displayName",
      "userId": "$orders.userId",
      "profileId": "$orders.profileId",
      "transId": "$orders.orderId",
      "orderId": "$orders.orderId",
      "serviceId": "$orders.serviceId"
    }
  });

  let result = mlDBController.aggregate('MlServiceCardDefinition', pipeLine);

  return result;

};

MlResolver.MlQueryResolver["fetchSlotDetails"] = (obj, args, context, info) => {

  let userId = context.userId;
  let appointmentId = args.appointmentId;

  let pipeLine = [
    { "$match": { "appointmentId": { $in: appointmentId } } },
    {
      "$lookup": {
        from: "mlServiceCardDefinition",
        localField: "appointmentInfo.resourceId",
        foreignField: "_id",
        as: "service"
      }
    },
    { "$unwind": { "path": "$service", "preserveNullAndEmptyArrays": true } },
    {
      "$lookup": {
        from: "mlTask",
        localField: "appointmentInfo.taskId",
        foreignField: "_id",
        as: "taskInfo"
      }
    },
    {
      "$lookup": {
        from: "mlAppointmentTask",
        localField: "appointmentInfo.taskId",
        foreignField: "_id",
        as: "internalTaskInfo"
      }
    },
    {
      "$addFields": {
        "taskInfo": {
          "$cond": [{ "$size": "$taskInfo" }, "$taskInfo", "$internalTaskInfo"]
        }
      }
    },
    { "$unwind": "$taskInfo" },
    {
      "$lookup": {
        from: "mlAppointmentMembers",
        localField: "appointmentId",
        foreignField: "appointmentId",
        as: "attendeeDetails"
      }
    },
    { "$unwind": { "path": "$attendeeDetails", "preserveNullAndEmptyArrays": true } },
    {
      "$lookup": {
        from: "users",
        localField: "attendeeDetails.userId",
        foreignField: "_id",
        as: "attendeeInfo"
      }
    },
    { "$unwind": { "path": "$attendeeInfo", "preserveNullAndEmptyArrays": true } },
    {
      "$group": {
        _id: "$$ROOT._id",
        "appointmentType": { $first: "$appointmentType" },
        "startDate": { $first: "$startDate" },
        "endDate": { $first: "$endDate" },
        "timeZone": { $first: "$timeZone" },
        "provider": { $first: "$provider" },
        "client": { $first: "$client" },
        "appointmentInfo": { $first: "$appointmentInfo" },
        "status": { $first: "$status" },
        "isCancelled": { $first: "$isCancelled" },
        "isSelf": { $first: "$isSelf" },
        "isRescheduled": { $first: "$isRescheduled" },
        "isInternal": { $first: "$isInternal" },
        "createdAt": { $first: "$createdAt" },
        "createdBy": { $first: "$createdBy" },
        "appointmentId": { $first: "$appointmentId" },
        "userImage": { $first: "$userInfo.profile.profileImage" },
        "userEmail": { $first: "$userInfo.username" },
        "userCommunity": { $first: "$userInfo.profile.externalUserProfiles.communityName" },
        "userMobileNumber": { $first: "$userInfo.profile.mobileNumber" },
        "taskName": { $first: "$taskInfo.name" },
        "sessions": { $first: "$taskInfo.session" },
        "serviceTasks": { $first: "$service.tasks" },
        "attendeeDetails": {
          $push: {
            "firstName": "$attendeeInfo.profile.firstName",
            "lastName": "$attendeeInfo.profile.lastName",
            "profileImage": "$attendeeInfo.profile.profileImage",
            "userId": "$attendeeInfo._id",
            "isProvider": "$attendeeDetails.isProvider",
            "isClient": "$attendeeDetails.isClient",
            "isAttendee": "$attendeeDetails.isAttendee",
            "status": "$attendeeDetails.status"
          }
        }
      }
    }
  ];

  let result = mlDBController.aggregate('MlAppointments', pipeLine);

  result.forEach(function (data, index, arr) {
    let totalSessions = 0;
    let currentSession = 0;
    if (data.appointmentType === "SERVICE-TASK") {
      if (data.serviceTasks) {
        data.serviceTasks.sort(function (a, b) {
          return a.sequence >= b.sequence;
        }).forEach(function (task, index, array) {
          array[index].sessions = array[index].sessions ? array[index].sessions : [];
          array[index].sessions = task.sessions.sort((a, b) => a.sequence >= b.sequence);
          let sessionId = data.appointmentInfo ? data.appointmentInfo.sessionId : '';
          let sessionIndex = array[index].sessions.findIndex((session) => session.id === sessionId);
          if (sessionIndex > -1) {
            currentSession += totalSessions + sessionIndex + 1;
          }
          totalSessions += array[index].sessions.length;
        });
        
      }
    } else if (data.appointmentType === "INTERNAL-TASK") {
      data.sessions = data.sessions ? data.sessions : [];
      let sessionId = data.appointmentInfo ? data.appointmentInfo.sessionId : '';
      let sessionIndex = data.sessions.findIndex((data) => data.sessionId === sessionId);
      totalSessions = data.sessions.length;
      currentSession = sessionIndex + 1;
    } else {
      totalSessions = 1;
      currentSession = 1;
    }
    arr[index].totalSessions = totalSessions;
    arr[index].currentSession = currentSession;
    // console.log('Find Task', totalSessions, currentSession);
  });
  return result;

};

MlResolver.MlQueryResolver["fetchMyAppointment"] = (obj, args, context, info) => {
  let userId = args.userId ? args.userId : context.userId;
  let profileId = args.profileId;
  let date = new Date();
  let day = args.day ? args.day : date.getDate();
  let month = args.month ? args.month : date.getMonth();
  let year = args.year ? args.year : date.getFullYear();
  let response = MlAppointment.getUserAppointments(userId, profileId, day, month, year);
  return response;
};

MlResolver.MlQueryResolver["fetchMyAppointmentBetweenTwoDates"] = (obj, args, context, info) => {
  let userId = args.userId ? args.userId : context.userId;
  let profileId = args.profileId;
  let date = new Date();

  let startDay = args.startDay ? args.startDay : date.getDate();
  let startMonth = args.startMonth ? args.startMonth : date.getMonth();
  let startYear = args.startYear ? args.startYear : date.getFullYear();

  let endDay = args.endDay ? args.endDay : date.getDate();
  let endMonth = args.endMonth ? args.endMonth : date.getMonth();
  let endYear = args.endYear ? args.endYear : date.getFullYear();

  let response = MlAppointment.getUserAppointmentsBetweenTwoDates( userId, profileId, startDay, startMonth, startYear , endDay, endMonth, endYear);
  return response;
};

MlResolver.MlMutationResolver["updateAppointmentByStatus"] = (obj, args, context, info) => {
  let userId = context.userId;
  let profileId = new MlUserContext().userProfileDetails(userId).profileId;
  let query = {
    userId: userId,
    profileId: profileId,
    appointmentId: args.appointmentId
  };
  if (!_.isEmpty(args.appointmentId)) {
    let appointmentMember = mlDBController.findOne('MlAppointmentMembers', query, context);
    if (appointmentMember) {
      appointmentMember.status = args.status;
      let updatedAppointmentMember = mlDBController.update('MlAppointmentMembers', appointmentMember._id, appointmentMember, { '$set': 1 }, context);
      if (appointmentMember.createdBy === userId) {
        let status;
        switch (args.status) {
          case 'Pending':
            status = 'Pending';
            break;
          case 'Rejected':
          status = 'Rejected';
          break;
          case 'Accepted':
            status = 'Accepted';
            break;
          case 'Completed':
            status = 'Completed';
            break;  
          default:
          // do nothing
        }
        let updateData = {};
        if (args.status === 'Rejected') {
          updateData = { isCancelled: true };
        } else {
          updateData = { status: status }
        }
        let updatedAppointment = mlDBController.update('MlAppointments', { appointmentId: args.appointmentId }, updateData, { '$set': 1 }, context);
      }
      if (updatedAppointmentMember) {
        let code = 200;
        let response = new MlRespPayload().successPayload('Successfully updated', code);
        return response
      }
    } else {
      let code = 400;
      let response = new MlRespPayload().errorPayload('Require a valid appointment', code);
      return response
    }
  } else {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Cannot save empty appointment', code);
    return response
  }

};

MlResolver.MlQueryResolver['fetchSelfTask'] = (obj, args, context, info) => {
  let result = mlDBController.findOne('MlAppointmentTask', { _id: args.selfTaskId }, context);
  if (result) {
    return result;
  } else {
    let code = 404;
    let response = new MlRespPayload().errorPayload('Appointment self-task not found', code);
    return response;
  }
};

MlResolver.MlMutationResolver["fetchAdminServiceAppointment"] = (obj, args, context, info, pipeline) => {
  let orderId = args.orderId;
  var pipeline = pipeline ? pipeline : serviceTransactionQueryBuilder(orderId, context)
  var result = mlDBController.aggregate('MlScOrder', pipeline);
  if (result.length < 1) {
    pipeline = serviceTransactionQueryBuilder(orderId, context, true);
    response = fetchTransactionForBookedServices(pipeline);
    return response;
  }
  else {
    var resStatus = getResultStatus(result[0].sessionInfo);
    result[0].sessionInfo = resStatus;
    result = JSON.stringify(result);
    var code = 200;
    response = new MlRespPayload().successPayload(result, code);
    return response;
  }
};

let fetchTransactionForBookedServices = pipeline => {
  var result = mlDBController.aggregate('MlScOrder', pipeline);
  if(result) {
    result = JSON.stringify(result);
    let  code = 200;
    var resp = new MlRespPayload().successPayload(result, code);
    if(resp)return resp;
  }
}


let serviceTransactionQueryBuilder = (orderId, context, changeQuery) =>{
let jsonQuery =  changeQuery ? {"$project": {"task": 0, "isSameSession": 0}} : {
    "$match": {
      "$or": [
        {"appointment.appointmentInfo.serviceOrderId": orderId},
        {"appointment": {"$exists": false}}
      ]
    }
  }
  let pipeline = [
    {"$match": {orderId: orderId}},
    {
      "$lookup":
        {
          from: "mlServiceCardDefinition",
          localField: "serviceId",
          foreignField: "_id",
          as: "service"
        }
    },
    {"$unwind": "$service"},
    {"$addFields": {"sessionInfo": "$service.tasks"}},
    {"$unwind": "$sessionInfo"},
    {
      "$lookup":
        {
          from: "mlTask",
          localField: "sessionInfo.id",
          foreignField: "_id",
          as: "task"
        }
    },
    {"$unwind": "$task"},
    {"$unwind": "$sessionInfo.sessions"},
    {"$unwind": "$task.session"},
    {"$addFields": {"isSameSession": {"$eq": ["$sessionInfo.sessions.id", "$task.session.sessionId"]}}},
    {"$match": {"isSameSession": true}},
    {
      "$addFields": {
        "sessionInfo.duration": "$task.session.duration",
        "owner": {
          "userId": "$service.userId",
          "profileId": "$service.profileId",
        },
        "client": {
          "userId": "$userId",
          "profileId": "$profileId",
        }
      }
    },
    {"$project": {"task": 0, "isSameSession": 0}},
    {
      "$lookup":
        {
          from: "mlAppointments",
          localField: "sessionInfo.sessions.id",
          foreignField: "appointmentInfo.sessionId",
          as: "appointment"
        }
    },
    {
      "$unwind":
        {
          path: "$appointment",
          preserveNullAndEmptyArrays: true
        }
    },
    jsonQuery,
    {
      "$addFields": {
        "sessionInfo.status": "$appointment.status",
        "sessionInfo.startDate": "$appointment.startDate",
        "sessionInfo.endDate": "$appointment.endDate",
      }
    },
    {
      "$group": {
        "_id": "$_id",
        "orderId": {"$first": "$orderId"},
        "serviceId": {"$first": "$serviceId"},
        "service": {"$first": "$service"},
        "serviceName": {"$first": "$serviceName"},
        "amount": {"$first": "$amount"},
        "tax": {"$first": "$tax"},
        "discountedAmount": {"$first": "$discountedAmount"},
        "totalAmount": {"$first": "$totalAmount"},
        "isActive": {"$first": "$isActive"},
        "paymentStatus": {"$first": "$paymentStatus"},
        "createdAt": {"$first": "$createdAt"},
        "owner": {"$first": "$owner"},
        "client": {"$first": "$client"},
        "sessionInfo": {"$push": "$sessionInfo"},
      }
    },
    {
      "$lookup": {
        "from": "users",
        "localField": "owner.userId",
        "foreignField": "_id",
        "as": "ownerInfo"
      }
    },
    {"$unwind": "$ownerInfo"},
    {"$unwind": "$ownerInfo.profile.externalUserProfiles"},
    {
      "$lookup": {
        "from": "users",
        "localField": "client.userId",
        "foreignField": "_id",
        "as": "clientInfo"
      }
    },
    {"$unwind": "$clientInfo"},
    {"$unwind": "$clientInfo.profile.externalUserProfiles"},
    {
      "$addFields": {
        "isSameOwnerProfile": {"$eq": ["$ownerInfo.profile.externalUserProfiles.profileId", "$owner.profileId"]},
        "isSameClientProfile": {"$eq": ["$clientInfo.profile.externalUserProfiles.profileId", "$client.profileId"]}
      }
    },
    {"$match": {"isSameOwnerProfile": true, "isSameClientProfile": true}},
    {
      "$project": {
        "_id": 1,
        "orderId": 1,
        "service": 1,
        "serviceId": 1,
        "serviceName": 1,
        "amount": 1,
        "tax": 1,
        "discountedAmount": 1,
        "totalAmount": 1,
        "isActive": 1,
        "paymentStatus": 1,
        "createdAt": 1,
        "sessionInfo": 1,
        "owner": {
          "userId": "$owner.userId",
          "profileId": "$owner.profileId",
          "name": "$ownerInfo.profile.displayName",
          "cluster": "$ownerInfo.profile.externalUserProfiles.clusterName",
          "chapter": "$ownerInfo.profile.externalUserProfiles.chapterName",
          "subChapter": "$ownerInfo.profile.externalUserProfiles.subChapterName",
          "community": "$ownerInfo.profile.externalUserProfiles.communityName",
          "email": "$ownerInfo.profile.email",
          "phoneNo": "$ownerInfo.profile.mobileNumber",
          "gender": "$ownerInfo.profile.genderType"
        },
        "client": {
          "userId": "$client.userId",
          "profileId": "$client.profileId",
          "name": "$clientInfo.profile.displayName",
          "cluster": "$clientInfo.profile.externalUserProfiles.clusterName",
          "chapter": "$clientInfo.profile.externalUserProfiles.chapterName",
          "subChapter": "$clientInfo.profile.externalUserProfiles.subChapterName",
          "community": "$clientInfo.profile.externalUserProfiles.communityName",
          "email": "$clientInfo.profile.email",
          "phoneNo": "$clientInfo.profile.mobileNumber",
          "gender": "$clientInfo.profile.genderType"
        }
      }
    }
  ];
  return pipeline;
};


MlResolver.MlMutationResolver["fetchAdminSessionAppointment"] = (obj, args, context, info) => {
  let orderId = args.orderId;
  let pipeline = [
    { "$match": { appointmentId: orderId } },
    {
      "$lookup":
      {
        from: "mlServiceCardDefinition",
        localField: "appointmentInfo.serviceCardId",
        foreignField: "_id",
        as: "service"
      }
    },
    { "$unwind": "$service" },
    {
      "$lookup": {
        "from": "users",
        "localField": "provider.userId",
        "foreignField": "_id",
        "as": "ownerInfo"
      }
    },
    { "$unwind": "$ownerInfo" },
    { "$unwind": "$ownerInfo.profile.externalUserProfiles" },
    {
      "$lookup": {
        "from": "users",
        "localField": "client.userId",
        "foreignField": "_id",
        "as": "clientInfo"
      }
    },
    { "$unwind": "$clientInfo" },
    { "$unwind": "$clientInfo.profile.externalUserProfiles" },
    {
      "$addFields": {
        "isSameOwnerProfile": { "$eq": ["$ownerInfo.profile.externalUserProfiles.profileId", "$provider.profileId"] },
        "isSameClientProfile": { "$eq": ["$clientInfo.profile.externalUserProfiles.profileId", "$client.profileId"] }
      }
    },
    { "$match": { "isSameOwnerProfile": true, "isSameClientProfile": true } },
    {
      "$project": {
        "_id": 1,
        "orderId": 1,
        "serviceId": 1,
        "serviceName": 1,
        "service": 1,
        "amount": 1,
        "tax": 1,
        "discountedAmount": 1,
        "totalAmount": 1,
        "isActive": 1,
        "paymentStatus": 1,
        "createdAt": 1,
        "appointmentInfo": 1,
        "startDate":1,
        "endDate":1,
        "owner": {
          "userId": "$owner.userId",
          "profileId": "$owner.profileId",
          "name": "$ownerInfo.profile.displayName",
          "cluster": "$ownerInfo.profile.externalUserProfiles.clusterName",
          "chapter": "$ownerInfo.profile.externalUserProfiles.chapterName",
          "subChapter": "$ownerInfo.profile.externalUserProfiles.subChapterName",
          "community": "$ownerInfo.profile.externalUserProfiles.communityName",
          "email": "$ownerInfo.profile.email",
          "phoneNo": "$ownerInfo.profile.mobileNumber",
          "gender": "$ownerInfo.profile.genderType"
        },
        "client": {
          "userId": "$client.userId",
          "profileId": "$client.profileId",
          "name": "$clientInfo.profile.displayName",
          "cluster": "$clientInfo.profile.externalUserProfiles.clusterName",
          "chapter": "$clientInfo.profile.externalUserProfiles.chapterName",
          "subChapter": "$clientInfo.profile.externalUserProfiles.subChapterName",
          "community": "$clientInfo.profile.externalUserProfiles.communityName",
          "email": "$clientInfo.profile.email",
          "phoneNo": "$clientInfo.profile.mobileNumber",
          "gender": "$clientInfo.profile.genderType"
        }
      }
    }
  ];
  let result = mlDBController.aggregate('MlAppointments', pipeline);
  result = JSON.stringify(result);
  let code = 200;
  let response = new MlRespPayload().successPayload(result, code);
  return response;
};


MlResolver.MlMutationResolver["fetchAppAppointmentByTransactionId"] = (obj, args, context, info) => {
  const result = mlDBController.findOne('MlTransactionsLog', {_id: args.transactionId}, context);
  if(result.activity === 'Service-Purchased')
    return MlResolver.MlMutationResolver['fetchAdminServiceAppointment'](obj, {orderId: result.docId}, context, info);
  else
    return MlResolver.MlMutationResolver['fetchAdminSessionAppointment'](obj, { orderId: result.docId }, context, info);
};

MlResolver.MlMutationResolver["cancelUserServiceCardAppointment"] = (obj, args, context, info) => {

  let appointmentId = args.appointmentId;
  let appointmentInfo = mlDBController.findOne('MlAppointments', {appointmentId: appointmentId}, context);
  if(!appointmentInfo || !appointmentInfo.appointmentInfo || appointmentInfo.appointmentInfo.resourceType !== "ServiceCard" ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Appointment not found', code);
    return response;
  }

  let serviceId = appointmentInfo.appointmentInfo.serviceCardId;
  let serviceInfo = mlDBController.findOne('MlServiceCardDefinition', serviceId, context);
  if( !serviceInfo ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload("'Service-Id' not found", code);
    return response;
  }

  if( !serviceInfo.termsAndCondition || !serviceInfo.termsAndCondition.isReschedulable ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Appointment not allow to reschedule', code);
    return response;
  }

  let noOfReschedule = serviceInfo.termsAndCondition.noOfReschedulable || 0;
  let rescheduleTrails = appointmentInfo.rescheduleTrail ? rescheduleTrail.rescheduleTrail.length : 0;
  if( noOfReschedule <= rescheduleTrails ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Appointment could not be rescheduled since reschedule limit is reached', code);
    return response;
  }

  let memberResponse = mlDBController.update('MlAppointmentMembers', {appointmentId: appointmentId}, { isCancelled: true }, {$set:true, multi: true}, context);
  if(!memberResponse){
    let code = 400;
    let response = new MlRespPayload().errorPayload('Unable to cancel appointment', code);
    return response;
  }
  let appointmentResponse = mlDBController.update('MlAppointments', {appointmentId: appointmentId}, { isCancelled: true }, {$set:true, multi: true}, context);
  if(!appointmentResponse) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Unable to cancel appointment', code);
    return response;
  }

  let result = new MlRespPayload().successPayload('Appointment cancelled successfully', 200);
  return result;

};

MlResolver.MlMutationResolver["rescheduleUserServiceCardAppointment"] = (obj, args, context, info) => {

  let appointmentId = args.appointmentId;
  let appointmentInfo = mlDBController.findOne('MlAppointments', {appointmentId: appointmentId}, context);
  if(!appointmentInfo || !appointmentInfo.appointmentInfo || appointmentInfo.appointmentInfo.resourceType !== "ServiceCard" ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Appointment not found', code);
    return response;
  }

  let serviceId = appointmentInfo.appointmentInfo.serviceCardId;
  let serviceInfo = mlDBController.findOne('MlServiceCardDefinition', serviceId, context);
  if( !serviceInfo ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Service-Id not found', code);
    return response;
  }

  if( !serviceInfo.termsAndCondition || !serviceInfo.termsAndCondition.isReschedulable ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Appointment could not be rescheduled', code);
    return response;
  }

  let noOfReschedule = serviceInfo.termsAndCondition ? serviceInfo.termsAndCondition.noOfReschedulable : 0;
  let rescheduleTrails = appointmentInfo.rescheduleTrail ? rescheduleTrail.rescheduleTrail.length : 0;
  if( noOfReschedule <= rescheduleTrails ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Appointment could not be rescheduled since reschedule limit is reached', code);
    return response;
  }
  let taskId = appointmentInfo.appointmentInfo.taskId;
  let sessionId = appointmentInfo.appointmentInfo.sessionId;

  let day = args.userServiceCardAppointmentInfo.day; //date.getDate();
  let month = args.userServiceCardAppointmentInfo.month; //date.getMonth();
  let year = args.userServiceCardAppointmentInfo.year; //date.getFullYear();
  let hours = args.userServiceCardAppointmentInfo.hours; //9;
  let minutes = args.userServiceCardAppointmentInfo.minutes; // 0;
  let appointment = MlAppointment.bookAppointment('appointmentId', taskId, sessionId, hours, minutes, day, month, year);
  if(!appointment.success){
    let code = 400;
    let response = new MlRespPayload().errorPayload(appointment.message, code);
    return response;
  }

  let update = mlDBController.update('MlAppointments', {
     $set: {
       isRescheduled: true,
       startDate: appointment.start,
       endDate: appointment.end
     },
    $push: {
      rescheduleTrail : {
        startDate: appointmentInfo.startDate,
        endDate: appointmentInfo.endDate,
        rescheduleBy: context.userId,
        rescheduleAt: new Date()
      }
    }
  }, { blackbox: true },  context);

  if(!update){
    let code = 400;
    let response = new MlRespPayload().errorPayload('Unable to reschedule appointment', code);
    return response;
  }
  let code = 400;
  let response = new MlRespPayload().errorPayload('Appointment rescheduled successfully', code);
  return response;
};

MlResolver.MlMutationResolver["cancelUserServiceCardOrder"] = (obj, args, context, info) => {

  let orderId = args.orderId;
  let orderInfo = mlDBController.findOne('MlUserServiceCardOrder', {orderId: orderId}, context);
  let serviceId = orderInfo.serviceId;
  let serviceInfo = mlDBController.findOne('MlServiceCardDefinition', serviceId, context);
  if( !serviceInfo ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Service-Id not found', code);
    return response;
  }

  if( !serviceInfo.termsAndCondition || !serviceInfo.termsAndCondition.isCancelable || !serviceInfo.termsAndCondition.noOfDaysBeforeCancelation ) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Order cannot be cancelled', code);
    return response;
  }

  let currentDate = new Date();
  let orderCancelableDate = new Date(orderInfo.createdAt);
  orderCancelableDate.setDate( orderCancelableDate.getDate() + serviceInfo.termsAndCondition.noOfDaysBeforeCancelation );
  if(currentDate.getTime() > orderCancelableDate.getTime()) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Order cannot be cancelled. Please contact admin.', code);
    return response;
  }
  let findAppoinmtent = mlDBController.findOne('MlAppointments', { 'appointmentInfo.serviceOrderId': orderId }, context);

  if(findAppoinmtent){
    let code = 400;
    let response = new MlRespPayload().errorPayload('Order cannot be cancelled since you have already availed the service', code);
    return response;
  }

  let orderResponse = mlDBController.update('MlUserServiceCardOrder', {orderId: orderId}, { isCancelled: true }, {$set:true}, context);
  if(!orderResponse) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Unable to cancel appointment', code);
    return response;
  }

  let result = new MlRespPayload().successPayload('Order cancelled successfully', 200);
  return result;

};

MlResolver.MlMutationResolver["signOffUserServiceCardOrder"] = (obj, args, context, info) => {
  let orderId = args.orderId;
  let orderResponse = mlDBController.update('MlUserServiceCardOrder', {orderId: orderId}, { isSignOff: true }, {$set:true}, context);
  if(!orderResponse) {
    let code = 400;
    let response = new MlRespPayload().errorPayload('Unable to sign off', code);
    return response;
  }
  let result = new MlRespPayload().successPayload('Sign-Off successful', 200);
  return result;
};

/**
 * 
 * @function
 */
const getResultStatus = (sessionInfo) => {
  let resSession = [];
  for (var sessInfo of sessionInfo) {
    if (sessInfo.status === APPOINTMENT_ACCEPTED) {
      if (sessInfo.endDate || sessInfo.startDate) {
        const appDate = new Date(sessInfo.endDate)
        const isExpired = new Date() > appDate ? true : false;
        const ifEqual = new Date().setHours(0, 0, 0, 0) === new Date(sessInfo.startDate).setHours(0, 0, 0, 0);
        if (isExpired) {
          sessInfo.status = APPOINTMENT_EXPIRED;
        }else if (ifEqual && sessInfo.status !== APPOINTMENT_COMPLETED) {
          sessInfo.status = APPOINTMENT_TODAY;
        }else {
          sessInfo.status = sessInfo.status;
        }
        resSession.push(sessInfo);
      }
    }
    else {
      resSession = sessionInfo;
    }
  }
  return resSession;
}
