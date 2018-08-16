/**
 * Created by venkatsrinag on 2/5/17.
 */
if(Meteor.isServer){
  MlMenus.upsert({name:"mlDefaultProfileMenu"}, {$set:{
      "name":"mlDefaultProfileMenu",
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
              "image":"ml my-ml-contact_details",
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
          // {
          //   "image": "ml ml-institutions",
          //   "link": "/app/myOffice",
          //   "isLink": true,
          //   "isMenu": true,
          //   "name": "My Office",
          //   "uniqueId": "myOffice",
          //   "hideSubMenu": true,
          //   "subMenu": [{
          //     "link": "/app/addOffice",
          //     "isLink": true,
          //     "isMenu": false,
          //     "name": "Add Office",
          //     "uniqueId": "addOffice",
          //     "subMenusId": "myOffice"
          //   }]
          // },
          {
              "image":"ml my-ml-my_list",
              "link": "/app/myConnections",
              "isLink" : true,
              "isMenu" : true,
              "name" : "Lists",
              "uniqueId" : "myConnections"
          },
          // {
          //   "image":"fa fa-investment",
          //   "link": "/app/myInvestment",
          //   "isLink" : true,
          //   "isMenu" : true,
          //   "name" : "My Investment",
          //   "uniqueId" : "myInvestment"
          // },
          {
              "image":"ml my-ml-library_3",
              "link": "/app/library",
              "isLink" : true,
              "isMenu" : true,
              "name" : "Library",
              "uniqueId" : "library"
          },
          {
            "image":"ml my-ml-service_provider_my_appointments",
            "link": "/app/myAppointment",
            "isLink" : true,
            "isMenu" : true,
            "name" : "Appointments",
            "uniqueId" : "myAppointment"
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
          "image":"ml my-ml-public_profile",
          "link": "/app/previewProfile",
          "isLink" : true,
          "isMenu" : true,
          "name" : "Public Profile",
          "uniqueId" : "myPublicProfile"
        },
        {
          "image":"ml my-ml-Referral_Invite",
          "link": "",
          "isLink" : true,
          "isMenu" : true,
          "name" : "Referral & Invites",
          "uniqueId" : "referalInvities",
          isDisabled: true
        },
        {
          "image":"ml my-ml-subscriptions",
          "link": "",
          "isLink" : true,
          "isMenu" : true,
          "name" : "Subscriptions",
          "uniqueId" : "mySubscriptions",
          isDisabled:true
        },
        {
          "image":"ml my-ml-settings_new",
          "link": "",//"link": "/app/settings",
          "isLink" : true,
          "isMenu" : true,
          "name" : "Settings",
          "uniqueId" : "settings",
          isDisabled:true
        },
          // {
          //   "image":"ml ml-moolya-symbol",
          //   "link": "/app/register",
          //   "isLink" : true,
          //   "isMenu" : true,
          //   "name" : "Registration",
          //   "uniqueId" : "registeras"
          // },
      ]
  }})
}
