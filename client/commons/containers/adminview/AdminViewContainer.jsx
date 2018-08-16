import React, { Component, PropTypes } from 'react';
import MoolyaAdminView from "../../components/adminview/AdminView";
//const AdminViewComposer = dataComposer(MoolyaAdminView);
export default class MoolyaAdminViewComponent extends Component {
constructor(props) {
  super(props);
  this.state = {
    viewMode:true,
    nameField:props.nameField,
    statusField:props.statusField,
    imageLink:props.imageLink,
    clusterListOptions:[
      // {
      //   imageLink: '/images/afghanistan.png',
      //   nameField: 'Afghanistan',
      //   statusField: 'active',
      //   listRouterPath:'/admin/dashboard'
      // },
      // {
      //   imageLink: '/images/australia.png',
      //   nameField: 'Australia',
      //   statusField: 'inactive',
      //   listRouterPath:'/admin/dashboard'
      // }
    ],
    footerOptions:props.footerOptions,
    routerPath:props.routerPath,
    imagePath:props.imagePath,
    listRouterPath:props.listRouterPath
  }
  this.viewModeChange.bind(this);
}

  viewModeChange(mode){
    this.setState({'viewMode':mode});
  }


render() {
  let  clusterListOptions=[
    {
      imageLink: '/images/afghanistan.png',
      nameField: 'Afghanistan',
      statusField: 'active',
      listRouterPath:'/admin/dashboard'
    },
    {
      imageLink: '/images/australia.png',
      nameField: 'Australia',
      statusField: 'inactive',
      listRouterPath:'/admin/dashboard'
    }
  ]
  let footerOptions=[
    {
      imagefield:'/images/edit_icon.png',
      route:'/admin/dashboard',
    },
    {
      imagefield:'/images/act_add_icon.png',
      route:'/admin/dashboard',
    },
    {
      imagefield:'/images/act_logout_icon.png',
      route:'/admin/dashboard',
    },
    {
      imagefield:'/images/act_progress_icon.png',
      route:'/admin/dashboard',
    },
    {
      imagefield:'/images/act_select_icon.png',
      route:'/admin/dashboard',
    }
  ]
  let config=this.props;
  return (
    <MoolyaAdminView {...config} footerOptions={this.state.footerOptions} routerPath={this.state.routerPath} imagePath={this.state.imagePath} viewMode={this.state.viewMode} nameField={this.state.nameField} statusField={this.state.statusField}  imageLink={this.state.imageLink} clusterListOptions={this.state.clusterListOptions} onViewModeChange={this.viewModeChange.bind(this)} />
  );
}
}



