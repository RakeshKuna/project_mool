import React, { Component, PropTypes } from 'react';
import communityRoutes from '../actions/communityRouteHandler';
import {getAdminUserContext} from '../../../commons/getAdminUserContext';

export default class MlCommunityList extends Component {
  constructor(props){
    super(props);
    this.userhierarchy = getAdminUserContext().hierarchyLevel;
    return this
  }

  render(){
    const data=this.props.data||[];
    const list=  data.map((prop, idx) =>
      <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
        <div className="list_block">
          <div className={`cluster_status ${prop.isActive?"active":"inactive"}_cl `}></div>
          {prop.isActive || this.userhierarchy === 4 ? <a href={communityRoutes.communityListRoute(prop.code)}>
              <div className={"hex_outer"}><span className={prop.communityImageLink}></span></div>
            </a>
            :
            <a>
              <div className={"hex_outer"}><span className={prop.communityImageLink}></span></div>
            </a>
          }
          <h3>{prop.name}</h3>
        </div>
      </div>
  );
    return (
        <div className="row communities_list">
          <h2>Communities</h2>
          {list}
        </div>

    );

  }

}

