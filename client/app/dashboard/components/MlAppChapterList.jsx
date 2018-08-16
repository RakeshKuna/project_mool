import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import dashboardRoutes from '../actions/routesActionHandler';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';
export default class MlAppChapterList extends Component {

  constructor(props){
    super(props);
    this.state={
      v : false,
    }
    return this;
  }

  render(){
    const data=this.props.data||[];
    const v = this.state.v;
    const list=  data.map((prop) =>{
      let image=prop.countryFlag&&prop.countryFlag.trim()!==""?<img src={`${generateAbsolutePath(prop.countryFlag)}`}/>:<span className="ml my-ml-chapter"></span>;
      return (
      <div className="col-lg-2 col-md-4 col-sm-4" key={prop.displayName}>
        <div className="list_block">
          <div className={`cluster_status ${prop.statusField|| ""}_cl `}></div>
          <a href={dashboardRoutes.subChapterListRoute(prop.clusterId,prop._id, v)}> <div className={"hex_outer"}>
            {/*<img src={prop.countryFlag}/>*/}
            {/*<span className="ml ml-chapter"></span>*/}
            {image}
          </div></a>
          <h3>{prop.displayName}</h3>
        </div>
      </div>)
    }
  );
    return (
      <div className="col-md-12">
        <h2> Chapters </h2>
        {list}
        </div>);
  }
}

{/*
<span className="ml ml-chapter"></span>*/}
