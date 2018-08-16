/**
 * Created by venkatsrinag on 26/4/17.
 */

if(Meteor.isServer){
    MlMenus.upsert({name:"mlDefaultMenu"}, {$set:{
        "name":"mlDefaultMenu",
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
                "image":"ml my-ml-Ideator",
                "link": "/app/ideator",
                "isLink" : true,
                "isMenu" : true,
                "name" : "Ideators",
                "uniqueId" : "ideator"
            },
            {
                "image":"ml my-ml-Startups",
                "link": "/app/startup",
                "isLink" : true,
                "isMenu" : true,
                "name" : "Startups",
                "uniqueId" : "startup"
            },

            {
                "image":"ml my-ml-Investors",
                "link": "/app/funder",
                "isLink" : true,
                "isMenu" : true,
                "name" : "Investors",
                "uniqueId" : "funder"
            },
            // {
            //   "image":"fa fa-calendar",
            //   "link": "/app/calendar",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "name" : "Calender",
            //   "uniqueId" : "calender"
            // },
            {
                "image":"ml my-ml-Service-Providers",
                "link": "/app/serviceProvider",
                "isLink" : true,
                "isMenu" : true,
                "name" : "Service Providers",
                "uniqueId" : "provider"
            },

            {
                "image":"ml my-ml-Company",
                "link": "/app/company",
                "isLink" : true,
                "isMenu" : true,
                "name" : "Companies",
                "uniqueId" : "company"
            },

            {
                "image":"ml my-ml-Institutions",
                "link": "/app/institution",
                "isLink" : true,
                "isMenu" : true,
                "name" : "Institutions",
                "uniqueId" : "institutions"
            },
            {
              "image":"ml my-ml-transactions",
              "link": "/app/transaction",
              "isLink" : true,
              "isMenu" : true,
              "name" : "Transactions",
              "uniqueId" : "myTransaction"
            },
            // {
            //   "image":"fa fa-calendar-check-o",
            //   "link": "/app/task",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "name" : "Task",
            //   "uniqueId" : "my_task"
            // }

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

        ]
    }})
}
