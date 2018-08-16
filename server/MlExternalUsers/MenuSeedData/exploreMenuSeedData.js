/**
 * Created by venkatsrinag on 12/6/17.
 */
if(Meteor.isServer){
    MlMenus.upsert({name:"mlExploreMenu"}, {$set:{
        "name":"mlExploreMenu",
        "menu" : [
            {
              "image":"ml my-ml-Ideator",
              "link": "/app/explore/ideator",
              "isLink" : true,
              "isMenu" : true,
              "name" : "Ideators",
              "uniqueId" : "explore"
            },
            {
              "image":"ml my-ml-Startups",
              "link": "/app/explore/startup",
              "isLink" : true,
              "isMenu" : true,
              "name" : "Startups",
              "uniqueId" : "explore_startup"
            },

            {
              "image":"ml my-ml-Investors",
              "link": "/app/explore/investor",
              "isLink" : true,
              "isMenu" : true,
              "name" : "Investors",
              "uniqueId" : "explore"
            },

            {
              "image":"ml my-ml-Service-Providers",
              "link": "/app/explore/serviceProvider",
              "isLink" : true,
              "isMenu" : true,
              "name" : "Service Providers",
              "uniqueId" : "explore"
            },

            {
              "image":"ml my-ml-Company",
              "link": "/app/explore/company",
              "isLink" : true,
              "isMenu" : true,
              "name" : "Companies",
              "uniqueId" : "explore"
            },

            {
              "image":"ml my-ml-Institutions",
              "link": "/app/explore/institution",
              "isLink" : true,
              "isMenu" : true,
              "name" : "Institutions",
              "uniqueId" : "explore"
            }
        ]
    }});
}
