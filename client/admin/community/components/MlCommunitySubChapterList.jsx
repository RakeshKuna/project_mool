import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import communityRoutes from "../actions/communityRouteHandler"
import generateAbsolutePath from "../../../../lib/mlGenerateAbsolutePath"
export default class MlCommunitySubChapterList extends Component {

  render(){
    const data=this.props.data||[];
    const list=   data.map( function(prop, idx) {
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
      return (
          <div className="col-lg-2" key={idx}>
            <div className="list_block">
              <div className={`cluster_status ${status}_cl`}></div>
              <a href={communityRoutes.subChapterCommunityListRoute(prop.clusterId, prop.chapterId, prop._id)}>
                <div className={"hex_outer"}>
                  {prop.subChapterImageLink ? <img src={generateAbsolutePath(prop.subChapterImageLink)}/>:
                    <span className="ml ml-moolya-symbol"></span>}
                </div>
              </a>
              <h3>{prop.subChapterName} </h3>
            </div>
          </div>
        )
    });

    return (<div className="row">
      <h2>Community</h2>
      {list}</div>);

  }

}
