/**
 * Created by mohasin.m on 14/2/17.
 */

let communityAccess = [

  {"showOnMap":false, "isRoot":true,"platformId":"Admin","communityDefId":"ideators","communityDefCode":"IDE","communityDefName":"Ideators", "communityImageLink" : "ml my-ml-Ideator","isActive":true,"hierarchyLevel":4,"hierarchyCode":"PLATFORM", "displayName":"Ideators"},
  {"showOnMap":false, "isRoot":true,"platformId":"Admin","communityDefId":"funders","communityDefCode":"FUN","communityDefName":"Investors","communityImageLink" : "ml my-ml-Investors","isActive":true,"hierarchyLevel":4,"hierarchyCode":"PLATFORM", "displayName":"Investors"},
  {"showOnMap":false, "isRoot":true,"platformId":"Admin","communityDefId":"startups","communityDefCode":"STU","communityDefName":"Startups","communityImageLink" : "ml my-ml-Startups","isActive":true,"hierarchyLevel":4,"hierarchyCode":"PLATFORM", "displayName":"Startups"},
  {"showOnMap":false, "isRoot":true,"platformId":"Admin","communityDefId":"companies","communityDefCode":"CMP","communityDefName":"Companies","communityImageLink" : "ml my-ml-Company","isActive":true,"hierarchyLevel":4,"hierarchyCode":"PLATFORM", "displayName":"Companies"},
  {"showOnMap":false, "isRoot":true,"platformId":"Admin","communityDefId":"serviceproviders","communityDefCode":"SPS","communityDefName":"Service Providers","communityImageLink" : "ml my-ml-Service-Providers","isActive":true,"hierarchyLevel":4,"hierarchyCode":"PLATFORM", "displayName":"Service Providers"},
  {"showOnMap":false, "isRoot":true,"platformId":"Admin","communityDefId":"institutions","communityDefCode":"INS","communityDefName":"Institutions","isActive":true,"communityImageLink" : "ml my-ml-Institutions","hierarchyLevel":4,"hierarchyCode":"PLATFORM", "displayName":"Institutions"},
  /*{"showOnMap":false, "isRoot":true,"platformId":"Admin","communityDefId":"browsers","communityDefCode":"BRW","communityDefName":"Browsers","isActive":true,"communityImageLink" : "ml ml-browser","hierarchyLevel":4,"hierarchyCode":"PLATFORM", "displayName":"Browsers"}*/

  ];

 Meteor.startup(function () {
    for(var i = 0; i < communityAccess.length; i++){
        let communityAccessRec = MlCommunityAccess.findOne({communityDefCode: communityAccess[i]["communityDefCode"],"platformId":"Admin"});
        if(!communityAccessRec){
           MlCommunityAccess.insert(communityAccess[i]);
        }
    }
 })
