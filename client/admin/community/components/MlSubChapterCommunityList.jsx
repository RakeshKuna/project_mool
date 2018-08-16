import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import communityRoutes from '../actions/communityRouteHandler';
export default class MlSubChapterCommunityList extends Component {

  render(){
    const data=this.props.data||[];
    const list=  data.map((prop) =>
      <div className="col-lg-2 col-md-4 col-sm-4" key={prop.code}>
        <div className="list_block">
          <div className={`cluster_status ${prop.isActive?"active":"inactive"}_cl `}></div>
          {prop.isActive?<a href={communityRoutes.subChaptercommunityDetailsRoute(prop.clusters[0], prop.chapters[0], prop.subchapters[0], prop.code)}>
            <div className={"hex_outer"}>
              {/*<img src={prop.communityImageLink}/>*/}
              <span className={prop.communityImageLink}></span>
            </div>
          </a>
            :
            <a> <div className={"hex_outer"}><span className={prop.communityImageLink}></span></div></a>
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

