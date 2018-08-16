/**
 * Created by viswadeep on 19/6/17.
 */
if(Meteor.isServer){
  MlMenus.upsert({name:"mlCalendarMenu"}, {$set:{
    "name":"mlCalendarMenu",
    "menu" : [
      {
        "image":"ml my-ml-calendar",
        "link": "/app/calendar",
        "isLink" : true,
        "isMenu" : true,
        "name" : "My Calendar",
        "uniqueId" : "mycalendar"
      },
      {
        "image":"ml my-ml-calendar",
        "link": "/app/calendar/shareCalendar",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Shared Calendar",
        "uniqueId" : "calendar_share"
      },

      {
        "image":"ml my-ml-calendar",
        "link": "/app/calendar/officeCalendar",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Office Calendar",
        "uniqueId" : "calendar_office",
        isDisabled: false
      },
      {
        "image":"ml my-ml-notifications",
        "link": "/app/calendar/notification",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Notifications",
        "uniqueId" : "calendar_notification"
      },
      {
        "image":"ml my-ml-settings_new",
        "link": "/app/calendar/settings",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Settings",
        "uniqueId" : "calendar_settings",
        isDisabled: true
      },

      // {
      //   "image":"fa fa-calendar-check-o",
      //   "link": "/app/calendar/manageSchedule",
      //   "isLink" : true,
      //   "isMenu" : true,
      //   "name" : "Manage Schedule",
      //   "uniqueId" : "calendar_manageSchedule"
      // }
    ]
  }});
}
