import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import communityRoutes from '../actions/communityRouteHandler';
export default class MlCommunityChapterList extends Component {

  render(){
    const data=this.props.data||[];
    const list=  data.map((prop) => {
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
        let image=prop.chapterImage&&prop.chapterImage.trim()!==""?<img src={`${prop.chapterImage}`}/>:<span className="ml my-ml-chapter"></span>;
        return (
          <div className="col-lg-2 col-md-4 col-sm-4" key={prop._id}>
            <div className="list_block">
              <div className={`cluster_status ${status}_cl`}></div>
              <a href={communityRoutes.subChapterListRoute(prop.clusterId, prop._id)}>
                <div className={"hex_outer"}>
                  {image}
                </div>
              </a>
              <h3>{prop.chapterName} </h3>
            </div>
          </div>)
      }
    );

    return (
      <div className="row">
        <h2>Chapter</h2>
        {list}
      </div>
    );
  }
}

