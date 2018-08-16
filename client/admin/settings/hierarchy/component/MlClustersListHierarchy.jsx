import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import hierarchyRoutes from '../actions/hierarchyRoutes';
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath';


export default class MlClustersListHierarchy extends Component {

  render(){
    const data=this.props.data||[];
    const list=  data.map(function(prop, i) {
      let icon, status;
      if (prop.isActive && prop.showOnMap) {
        status = "active";
        // icon = "active-User"
      } else if (prop.isActive && !prop.showOnMap) {
        status = "add";
        // icon ="add";
      } else if (!prop.isActive && prop.showOnMap) {
        status = "inactive";
        // icon = "inactive-user"
      } else {
        status = "assign";
        // icon = "assign";
      }
      return(
        <div className="col-lg-2 col-md-4 col-sm-4" key={prop.displayName}>
          <div className="list_block">
            <div className={`cluster_status ${status}_cl`}><span className={`ml ml-${icon}`}></span></div>
            <a href={hierarchyRoutes.chapterListRoute(prop.id)}>
              <div className={"hex_outer"}><img src={Meteor.settings.public.countriesFlagBaseUrl+prop.countryFlag}/></div>
            </a>
            <h3>{prop.displayName}</h3>
          </div>
        </div>
      )
    });

    return (
    <div className="row">
          {list}
      </div>
    );

  }

}
