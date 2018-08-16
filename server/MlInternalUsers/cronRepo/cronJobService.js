const cron = require('node-cron');
import MlCronJobController from './cronJobController';

var task = cron.schedule('1 01 17 * * *', Meteor.bindEnvironment(() => {    
    MlCronJobController.dailyReport();
    console.log('................................................');
}), false);
    
task.start();


// at 1 am everyday "1 0 * * *"
var everyDayJob = cron.schedule('*/5 * * * *', Meteor.bindEnvironment(() => {    
    MlCronJobController.sendPushNotificationsToALLUsers('Once a day');
    MlCronJobController.sendPushNotifications('Once a day');
}), false);

// at alternate days "1 0 */2 * *"
var alternateDayJob = cron.schedule('*/8 * * * *', Meteor.bindEnvironment(() => {    
    MlCronJobController.sendPushNotificationsToALLUsers('Alternate Days');
    MlCronJobController.sendPushNotifications('Alternate Days');
}), false);

// at every week "0 0 * * 0"
var everyWeekJob = cron.schedule('*/10 * * * *', Meteor.bindEnvironment(() => {    
    MlCronJobController.sendPushNotificationsToALLUsers('Once a Week');
    MlCronJobController.sendPushNotifications('Once a Week');
}), false);

/**
 * @todo {*} uncomment the code onces the issue is been resolved of slowness
 */
// everyDayJob.start();
// alternateDayJob.start();
// everyWeekJob.start();