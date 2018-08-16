import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {client} from '../apolloConnection';
import  MlAdminHeader from '../../layouts/header/MlAdminHeader'
import MlAdminLeftNav from '../../layouts/leftnav/MlAdminLeftNav'
import MlAppContextProvider from '../../../commons/components/appContext/MlAppContextProvider';
import { graphql,compose } from 'react-apollo';
import gql from 'graphql-tag'
import MlLoader from '../../../commons/components/loader/loader';
import isEqualWith from 'lodash/isEqualWith';

import { withApollo } from 'react-apollo';

@withApollo
class MlAdminAppComponent extends Component {

  constructor(p, c) {
    super(p, c)
    this.state = { theme: null,language:null,menu:null,loading:true,userType:null,breadcrumbValue:1};
    this.fetchMenu.bind(this);
  }

  shouldComponentUpdate(nextProps,nextState,nextContext){
    if(!FlowRouter.getQueryParam('tab')) return true;

    return !isEqualWith(this.props, nextProps) ||
      !isEqualWith(this.state, nextState) ||
      !isEqualWith(this.context, nextContext);
  }


  componentDidMount(){
    this.fetchMenu();
  }

  breadcrumbClicked(){
    this.setState({breadcrumbValue: !this.state.breadcrumbValue});
  }

  async fetchMenu(){
    const menuData=await client.query({fetchPolicy: 'network-only',query: query,
                  variables: { name:'mlAdminMenu' }
     });
    const userType=await client.query({fetchPolicy: 'network-only',query:gql`query{data:fetchUserTypeFromProfile}`
    });
    this.setState({loading:false,userType:userType&&userType.data&&userType.data.data?userType.data.data:null,menu:menuData&&menuData.data&&menuData.data.data?menuData.data.data.menu:[]});
  }


  render(){

    const showLoader=this.state.loading;
    const MlComponent=function(props){
      if (props.showLoader) {
        return <MlLoader/>;
      }
      var headerComponent =null;
      if(props.headerContent)headerComponent=React.cloneElement(props.headerContent,{breadcrumbClicked:props.breadcrumbClicked});


      return (<MlAppContextProvider theme={props.theme} menu={props.menu} language={props.language} userType={props.userType}>
        {headerComponent ? (headerComponent) : (<MlAdminHeader breadcrumbClicked={props.breadcrumbClicked}/>)}
        {/*<MlAdminHeader/>*/}
        <MlAdminLeftNav/>
        {props.adminContent}
      </MlAppContextProvider>)

    };

    return <MlComponent breadcrumbClicked={this.breadcrumbClicked.bind(this)} {...this.props} showLoader={showLoader} theme={this.state.theme} menu={this.state.menu} language={this.state.language} userType={this.state.userType}/>;
  }
}

const query = gql`fragment subMenu on Menu{
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
        data:FetchMenu(name: $name){
            name
            menu{
              ...subMenu
                 subMenu{
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
            }

      }`

//export default  MlAdminApp = graphql(query,{options: { variables: { name:'mlAdminMenu' }}})(MlAdminAppComponent);
export default  MlAdminApp = MlAdminAppComponent;
