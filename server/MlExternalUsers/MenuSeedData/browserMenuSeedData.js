/**
 * Created by vishwadeep on 21/6/17.
 */
if(Meteor.isServer){
  MlMenus.upsert({name:"mlBrowserMenu"}, {$set:{
    "name":"mlBrowserMenu",
    "menu" : [
      {
        "image":"ml my-ml-dashboard",
        "link": "/app/dashboard",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Ecosystem",
        "uniqueId" : "dashboard"
      },
      {
        "image":"ml my-ml-explore",
        "link": "/app/explore",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Explore",
        "uniqueId" : "explore"
      },
      {
        "image":"ml my-ml-transactions",
        "link": "/app/transaction",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Transactions",
        "uniqueId" : "myTransaction"
      },
      {
        "image":"fa fa-calendar-check-o",
        "link": "/app/task",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Tasks",
        "uniqueId" : "my_task"
      },
      {
        "image":"ml ml-chat",
        "link": "/app/conversations",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Conversations",
        "uniqueId" : "conversations",
         isDisabled:true

      },
      {
        "image":"ml my-ml-subscriptions",
        "link": "#",
        "isLink" : true,
        "isMenu" : true,
        "name" : "moolya Services",
        "uniqueId" : "subscriptions",
        isDisabled:true
      },

      {
        "image":"ml ml-news",
        "link": "/app/news",
        "isLink" : true,
        "isMenu" : true,
        "name" : "News",
        "uniqueId" : "news",
        isDisabled:true
      },
      {
        "image":"ml my-ml-settings_new",
        "link": "/app/news",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Settings",
        "uniqueId" : "settings",
        isDisabled:true
      },
    ]
  }});
}
