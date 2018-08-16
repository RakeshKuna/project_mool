import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import clusterRoutes from '../actions/clustersRoutes';
import MlActionComponent from '../../../commons/components/actions/ActionComponent'
import ScrollArea from 'react-scrollbar'

export default class MlClustersList extends Component {

  render(){
    const data=this.props.data||[];
    const list=  data.map( function(prop, idx) {
      let icon, status;

      if(prop.status.description == "Active"){
          status = "active";
          // icon = "active-User"
      } else if(prop.status.description == "Work In Progress"){
          status = "add";
          // icon ="add";
      } else if(prop.status.description == "Inactive"){
          status = "inactive";
          // icon = "inactive-user"
      } else {
          status = "assign";
          // icon = "assign";
      }
      return (
        <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
          <div className="list_block">
            <div className={`cluster_status ${status}_cl`}><span className={`ml ml-${icon}`}></span></div>
            {/*<div className={`cluster_status ${prop.statusField|| ""}_cl `}></div>*/}
            <a href={clusterRoutes.clusterDetailsRoute(prop.id)}>
              <div className={"hex_outer"}><img src={Meteor.settings.public.countriesFlagBaseUrl+prop.countryFlag}/></div>
            </a>
            <h3>{prop.displayName}</h3>
          </div>
        </div>
      );
    });

    return (
    <div className="row">
      <h2> Cluster </h2>
      <div className="list_scroll">
        <ScrollArea
          speed={0.8}
          className="list_scroll"
          smoothScrolling={true}
        >
          {list}
        </ScrollArea>
      </div>
      </div>
    );

  }

}
