import {mergeStrings} from "gql-merge";
import MlSchemaDef from "../../../commons/mlSchemaDef";
import MlResolver from "../../../commons/mlResolverDef";

let Menu = `
    type Menu{
      image: String
      link: String
      name: String
      uniqueId:String
      isLink:Boolean
      isMenu:Boolean
      isDisabled:Boolean
      subMenu:[Menu]
      dynamicLink:Boolean
      subMenuMappingId:String
      subMenusId:String
      hideSubMenu:Boolean
      showInBreadCrum:Boolean
    }
    type MlMenu 
    {
      name: String
      id:String
      menu:[Menu]
    }
    type Query {
        FetchMenu(image: String, link: String, name: String, id: String, isLink: Boolean, isMenu: Boolean): MlMenu
        fetchExternalUserMenu(image: String, link: String, name: String, id: String, isLink: Boolean, isMenu: Boolean): MlMenu
        fetchExternalUserProfileMenu(image: String, link: String, name: String, id: String, isLink: Boolean, isMenu: Boolean): MlMenu
        fetchExploreMenu(image: String, link: String, name: String, id: String, isLink: Boolean, isMenu: Boolean): MlMenu
        fetchCalendarMenu(image: String, link: String, name: String, id: String, isLink: Boolean, isMenu: Boolean): MlMenu
    }
`

MlSchemaDef['schema']=mergeStrings([MlSchemaDef['schema'],Menu]);
let supportedApi = [{
  api: 'FetchMenu',
  actionName: 'READ',
  isAppWhiteList: true,
  isWhiteList:true,
  moduleName: "MENU"
}, {
  api: 'fetchExternalUserMenu',
  actionName: 'READ',
  isAppWhiteList: true,
  resource: "MENU"
}, {api: 'fetchExternalUserProfileMenu', isWhiteList: true, actionName: 'READ', moduleName: "MENU", isAppWhiteList: true,},
  {api: 'fetchExploreMenu', isWhiteList: true, actionName: 'READ', moduleName: "MENU", isAppWhiteList: true,},
  {api: 'fetchCalendarMenu', isWhiteList: true, actionName: 'READ', moduleName: "MENU", isAppWhiteList: true,}];
MlResolver.MlModuleResolver.push(supportedApi)
