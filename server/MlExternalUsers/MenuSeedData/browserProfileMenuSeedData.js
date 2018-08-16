/**
 * Created by venkatsrinag on 11/7/17.
 */
if(Meteor.isServer){
  MlMenus.upsert({name:"mlBrowserProfileMenu"}, {$set:{
    "name":"mlBrowserProfileMenu",
    "menu" : [
      {
        "image":"ml my-ml-blank_Profile_3",
        "link": "/app/myProfile",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Profile",
        "uniqueId" : "myProfile"
      },
      {
        "image":"ml flaticon-ml-agenda",
        "link": "/app/addressBook",
        "isLink" : true,
        "isMenu" : true,
        "name" : "My Contact Details",
        "uniqueId" : "addressBook"
      },
      {
        "image":"ml flaticon-ml-briefcase",
        "link": "/app/portfolio",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Portfolios",
        "uniqueId" : "portfolio"
      },
      {
        "image":"ml my-ml-my_list",
        "link": "/app/myConnections",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Lists",
        "uniqueId" : "myConnections"
      },
      {
        "image":"ml my-ml-library_3",
        "link": "/app/library",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Library",
        "uniqueId" : "library"
      },
      {
        "image":"ml my-ml-terms_and_conditions",
        "link": "/app/termsConditions",
        "isLink" : true,
        "isMenu" : true,
        "name" : "T & C",
        "uniqueId" : "termsConditions"
      },
      {
        "image":"ml my-ml-privacy",
        "link": "/app/privacy",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Privacy",
        "uniqueId" : "privacy"
      },
      {
        "image":"ml ml-moolya-symbol",
        "link": "/app/register",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Registration",
        "uniqueId" : "registeras"
      },
      {
        "image":"ml my-ml-subscriptions",
        "link": "#",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Subscriptions",
        "uniqueId" : "mySubscriptions",
        isDisabled:true
      },
      {
        "image":"ml my-ml-Referral_Invite",
        "link": "#",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Referal & Invities",
        "uniqueId" : "referalInvities",
        isDisabled: true
      },
      {
        "image":"ml my-ml-settings_new",
        "link": "/app/settings",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Settings",
        "uniqueId" : "settings",
        isDisabled: true
      },
    ]
  }})
}
