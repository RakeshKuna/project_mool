import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import dashboardRoutes from '../actions/routesActionHandler';
import ScrollArea from 'react-scrollbar'
export default class MlClusterList extends Component {

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
    const list=  data.map((prop) =>
      <div className="col-lg-2 col-md-4 col-sm-4" key={prop.displayName}>
        <div className="list_block">
          <div className={`cluster_status ${prop.statusField|| ""}_cl `}></div>
          <a href={dashboardRoutes.chapterListRoute(prop.id,v)}> <div className={"hex_outer"}><img src={Meteor.settings.public.countriesFlagBaseUrl+prop.countryFlag}/></div></a>
          <h3>{prop.displayName}</h3>
        </div>
      </div>
  );

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
      </div>);

  }
}

