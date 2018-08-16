/**
 * Created by venkatsrinag on 14/7/17.
 */
if(Meteor.isServer){
  MlMenus.upsert({name:"mlOfficeBarrerProfileMenu"}, {$set:{
    "name":"mlOfficeBarrerProfileMenu",
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
        "image": "ml ml-institutions",
        "link": "/app/myOffice",
        "isLink": true,
        "isMenu": true,
        "name": "Digital Office",
        "uniqueId": "myOffice",
        "hideSubMenu": true,
        "subMenu": [{
          "link": "/app/addOffice",
          "isLink": true,
          "isMenu": false,
          "name": "Add Office",
          "uniqueId": "addOffice",
          "subMenusId": "myOffice"
        }]
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
        "image":"ml my-ml-subscriptions",
        "link": "#",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Subscriptions",
        "uniqueId" : "mySubscriptions",
        isDisabled:true
      },
      {
        "image":"ml my-ml-settings_new",
        "link": "/app/settings",
        "isLink" : true,
        "isMenu" : true,
        "name" : "Settings",
        "uniqueId" : "settings",
        isDisabled:true
      },
    ]
  }})
}
