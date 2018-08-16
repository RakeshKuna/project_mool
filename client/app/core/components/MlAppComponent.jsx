import React, {Component, PropTypes} from "react";
import {appClient} from "../appConnection";
import gql from "graphql-tag";
import MlAppContextProvider from "../../../commons/components/appContext/MlAppContextProvider";
import MlAppHeader from "../components/MlAppHeader";
import MlAppLeftNav from "../components/MlAppLeftNav";
import MlLoader from "../../../commons/components/loader/loader";
import MlAppContextHandler from './MlAppContextHandler'
import {withApollo} from "react-apollo";
import isEqualWith from 'lodash/isEqualWith'

@withApollo

class MlAppComponent extends Component{
    constructor(props, c){
        super(props, c)

        this.state = {loading:true, theme: null, language:null, menu:null, userType:null, initiate:true,breadcrumbClicked:false}
        this.fetchMenu.bind(this);
      this.breadcrumbClickedFunc = this.breadcrumbClickedFunc.bind(this);
    }

  shouldComponentUpdate(nextProps,nextState,nextContext){
    // console.log(nextProps,nextState,nextContext);
    // let path = Object.assign(FlowRouter._current.path);
    // let hierarchy = path.split('/app/');
    // if(hierarchy[1]){
    //   let v= hierarchy[1].split('/')[0];
    //   if(v !== 'explore' && v !== 'startup' && v !== 'funder' && v !== 'serviceProvider' && v !== 'company' && v !== 'institution' && v !== 'ideator' & v!=='portfolio'){
    //     return true;
    //   }
    // }

    if(FlowRouter.getRouteName () === "myAppointment" ) {
      return true;
    }

    if(FlowRouter.getQueryParam('add')) return true;

    if(!FlowRouter.getQueryParam('tab')) return true;

    return !isEqualWith(this.props, nextProps) ||
      !isEqualWith(this.state, nextState) ||
      !isEqualWith(this.context, nextContext);
  }


  componentDidMount(){
        let isProfileMenu = this.props.isProfileMenu || false;
        let isExploreMenu = this.props.isExploreMenu || false;
        let isCalenderMenu = this.props.isCalenderMenu || false;

        this.setState({initiate:false});
        this.fetchMenu(isProfileMenu, isExploreMenu, isCalenderMenu)
    }

    componentWillReceiveProps(nextProps, nextState) {
      // let isProfileMenu = nextProps.isProfileMenu || false;
      if (nextProps.isProfileMenu !== this.props.isProfileMenu) {
        this.fetchMenu(nextProps.isProfileMenu, nextProps.isExploreMenu, nextProps.isCalenderMenu)
      }
      if (nextProps.isExploreMenu !== this.props.isExploreMenu) {
        this.fetchMenu(nextProps.isProfileMenu, nextProps.isExploreMenu, nextProps.isCalenderMenu)
      }
      if (nextProps.isCalenderMenu !== this.props.isCalenderMenu) {
        this.fetchMenu(nextProps.isProfileMenu, nextProps.isExploreMenu, nextProps.isCalenderMenu)
      }
    }

  breadcrumbClickedFunc(){
    this.setState({breadcrumbClicked:!this.state.breadcrumbClicked});
  }

    async fetchMenu(isProfileMenu, isExploreMenu, isCalenderMenu){
        let query = "";
        if(isProfileMenu)
            query = profileMenuQuery
        else if(isExploreMenu)
            query = exploreMenuQuery
        else if(isCalenderMenu)
          query = calenderMenuQuery
        else
            query = defaultQuery;

        const menuData = await appClient.query({fetchPolicy: 'network-only',query: query, variables: {name:'mlDefaultMenu'}});
        const userType = await appClient.query({fetchPolicy: 'network-only',query:gql`query{data:fetchUserTypeFromProfile}`});
        this.setState({loading:false,userType:userType&&userType.data&&userType.data.data?userType.data.data:null,menu:menuData&&menuData.data&&menuData.data.data?menuData.data.data.menu:[]});
    }

    render(){
      var that = this
        const showLoader = this.state.loading;
        const MlComponent = function (props) {
            if (props.showLoader) {
                return <MlLoader/>;
            }
            return (
                <MlAppContextProvider theme={props.theme} menu={props.menu} language={props.language} userType={props.userType}>
                    <MlAppHeader breadcrumbClicked={that.breadcrumbClickedFunc}  hello="hello"/>
                    <MlAppLeftNav/>
                    <MlAppContextHandler context={props.appContent} isFirst={props.isFirst} />
                    {/*{props.appContent}*/}
                </MlAppContextProvider>
            );
        }
        return <MlComponent {...this.props} showLoader={showLoader} theme={this.state.theme} menu={this.state.menu} language={this.state.language} userType={this.state.userType}/>;
    }
}

const defaultQuery = gql`fragment subMenu on Menu{
                  uniqueId
                  isLink
                  isMenu
                  isDisabled
                  name
                  image
                  link
                  dynamicLink
                  subMenuMappingId
                  subMenusId
                  hideSubMenu
                  showInBreadCrum
              }

              query LeftNavQuery($name: String!) {
                data:fetchExternalUserMenu(name: $name){
                    name
                    menu{
                      ...subMenu
                         subMenu{
                          ...subMenu
                            subMenu{
                              ...subMenu
                                  subMenu{
                                     ...subMenu
                                         }
                                   }
                              }
                           }
                    }
      }`

const profileMenuQuery = gql`fragment subMenu on Menu{
                  uniqueId
                  isLink
                  isMenu
                  isDisabled
                  name
                  image
                  link
                  dynamicLink
                  subMenuMappingId
                  subMenusId
                  hideSubMenu
                  showInBreadCrum
              }

              query LeftNavQuery($name: String!) {
                data:fetchExternalUserProfileMenu(name: $name){
                    name
                    menu{
                      ...subMenu
                         subMenu{
                          ...subMenu
                            subMenu{
                              ...subMenu
                                  subMenu{
                                     ...subMenu
                                         }
                                   }
                              }
                           }
                    }
      }`

const exploreMenuQuery = gql`fragment subMenu on Menu{
                  uniqueId
                  isLink
                  isMenu
                  isDisabled
                  name
                  image
                  link
                  dynamicLink
                  subMenuMappingId
                  subMenusId
                  hideSubMenu
                  showInBreadCrum
              }

              query LeftNavQuery($name: String!) {
                data:fetchExploreMenu(name: $name){
                    name
                    menu{
                      ...subMenu
                         subMenu{
                          ...subMenu
                            subMenu{
                              ...subMenu
                                  subMenu{
                                     ...subMenu
                                         }
                                   }
                              }
                           }
                    }
      }`

const calenderMenuQuery = gql`fragment subMenu on Menu{
                  uniqueId
                  isLink
                  isMenu
                  isDisabled
                  name
                  image
                  link
                  dynamicLink
                  subMenuMappingId
                  subMenusId
                  hideSubMenu
                  showInBreadCrum
              }

              query LeftNavQuery($name: String!) {
                data:fetchCalendarMenu(name: $name){
                    name
                    menu{
                      ...subMenu
                         subMenu{
                          ...subMenu
                            subMenu{
                              ...subMenu
                                  subMenu{
                                     ...subMenu
                                         }
                                   }
                              }
                           }
                    }
      }`

export default  MlAppLayout = MlAppComponent;
