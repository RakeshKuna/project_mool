/**
 * Created by venkatsrinag on 9/4/17.
 */
import mlResourceConfigRepo from '../../../MlExternalUsers/ResourceConfiguration/mlResourceConigRepo'
import MlUserContext from '../../../MlExternalUsers/mlUserContext'
import _ from 'lodash'

class MenuRepo{
  constructor(){
  }

  findProfileResources(menuObject, context){
    var menu = _.cloneDeep(menuObject);
    var userProfile = new MlUserContext().userProfileDetails(context.userId)||{};
    if(userProfile && userProfile.communityDefCode){
      var resources = mlResourceConfigRepo.getResourceConfig(userProfile.communityDefCode)
      if(resources.length > 0){
        _.each(resources, function (resource) {
          switch (resource.resourceCode){
            case 'OFFICE':{
              var office = {
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
              }
              // menu.menu.push(office)
              menu.menu.splice(4, 0, office)
            }
            break;
          }
        })
      }
    }
    return menu;
  }

  findCalendarResources(menuObject, context){
    var menu = _.cloneDeep(menuObject);
    var userProfile = new MlUserContext().userProfileDetails(context.userId)||{};
    let registerId = userProfile.registrationId;
    let regData = MlRegistration.findOne({"_id": registerId, status: { $ne: "REG_USER_APR"}});
    if(regData) {
      menu.menu.forEach( function (data, index , arr){
        if([ "mycalendar", "calendar_share", "calendar_office" ].indexOf(data.uniqueId) >= 0 ) {
          arr[index].isDisabled = true
        }
      });
    }
    if(userProfile && userProfile.communityDefCode){
      var resources = mlResourceConfigRepo.getResourceConfig(userProfile.communityDefCode)
      if(resources.length > 0){
        _.each(resources, function (resource) {
          switch (resource.resourceCode){
            case 'MANAGESCHEDULE':{
              var item = {
                  "image":"ml my-ml-manage_schedule",
                  "link": "/app/calendar/manageSchedule/all/activityList",
                  "isLink" : true,
                  "isMenu" : true,
                  "name" : "Manage Schedule",
                  "uniqueId" : "calendar_manageSchedule"
              }
              menu.menu.push(item)
            }
            break;
            case "OFFICE":{
              menu.menu.forEach( function (data, index , arr){
                if(data.uniqueId === "calendar_office"){
                  arr[index].isDisabled = false
                }
              })
            }
            break;
          }
        })
      }
    }

    return menu;
  }
}

var menuRepo = new MenuRepo()
export default menuRepo;
