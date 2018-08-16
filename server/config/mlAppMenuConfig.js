/**
 * Created by venkatsrinag on 9/6/17.
 */

Meteor.startup(function () {

    let menus = [
        {communityCode:"FUN", communityName:"funder", menuName:"mlFunderMenu", isActive:true, isProfileMenu:false, isExploreMenu:false},
        {communityCode:"IDE", communityName:"ideator", menuName:"mlDefaultMenu", isActive:true, isProfileMenu:false, isExploreMenu:false},
        {communityCode:"STU", communityName:"startup", menuName:"mlDefaultMenu", isActive:true, isProfileMenu:false, isExploreMenu:false},
        {communityCode:"CMP", communityName:"company", menuName:"mlDefaultMenu", isActive:true, isProfileMenu:false, isExploreMenu:false},
        {communityCode:"INS", communityName:"institution", menuName:"mlDefaultMenu", isActive:true, isProfileMenu:false, isExploreMenu:false},
        {communityCode:"SPS", communityName:"serviceprovider", menuName:"mlDefaultMenu", isActive:true, isProfileMenu:false, isExploreMenu:false},
        {communityCode:"OFB", communityName:"officebarrer", menuName:"mlOfficeBarrerMenu", isActive:true, isProfileMenu:false, isExploreMenu:false},
        {communityCode:"BRW", communityName:"Browsers", menuName:"mlBrowserMenu", isActive:true, isProfileMenu:false, isExploreMenu:false},

        {communityCode:"FUN", communityName:"funder", menuName:"mlDefaultProfileMenu", isActive:true, isProfileMenu:true},
        {communityCode:"BRW", communityName:"Browsers", menuName:"mlBrowserProfileMenu", isActive:true, isProfileMenu:true},
        {communityCode:"IDE", communityName:"ideator", menuName:"mlDefaultProfileMenu", isActive:true, isProfileMenu:true},
        {communityCode:"STU", communityName:"startup", menuName:"mlDefaultProfileMenu", isActive:true, isProfileMenu:true},
        {communityCode:"CMP", communityName:"company", menuName:"mlDefaultProfileMenu", isActive:true, isProfileMenu:true},
        {communityCode:"INS", communityName:"institution", menuName:"mlDefaultProfileMenu", isActive:true, isProfileMenu:true},
        {communityCode:"SPS", communityName:"serviceprovider", menuName:"mlDefaultProfileMenu", isActive:true, isProfileMenu:true},
        {communityCode:"OFB", communityName:"officebarrer", menuName:"mlOfficeBarrerProfileMenu", isActive:true, isProfileMenu:true}
    ]

    for(var i = 0; i < menus.length; i++){
        let menu =   MlAppMenuConfig.findOne({"$and":[{menuName: menus[i].menuName}, {communityCode: menus[i].communityCode}]});
        if(!menu){
            menu = {communityCode:menus[i].communityCode, communityName:menus[i].communityName, menuName:menus[i].menuName, isActive:menus[i].isActive, isProfileMenu:menus[i].isProfileMenu, isExploreMenu:menus[i].isExploreMenu};
            MlAppMenuConfig.insert(menu);
        }
    }

});
