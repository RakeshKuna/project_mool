import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import clusterRoutes from '../actions/clustersRoutes';
export default class MlClusterChapterList extends Component
{
  constructor(props){
      super(props)
      this.state={
        data:[]
      }
      return this;
  }

  render(){
    const data=this.props.data||[];
    const list=  data.map((prop ,idx) =>{
      let image=prop.countryFlag&&prop.countryFlag.trim()!==""?<img src={Meteor.settings.public.countriesFlagBaseUrl+prop.countryFlag}/>:<span className="ml my-ml-chapter"></span>;
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
            <a href={clusterRoutes.subChapterListRoute(prop.clusterId,prop._id)}> <div className={"hex_outer"}>
              {/*<img src={prop.countryFlag}/>*/}
              {image}
            </div></a>
            <h3>{prop.displayName}</h3>
          </div>
        </div>
    )}
    );

    return (<div className="row">{list}</div>);

  }
}
