import {render} from 'react-dom';
import React, {Component, PropTypes} from 'react';
import _ from 'lodash'

export default class MapDetails extends Component {
  constructor(props) {
    super(props);
  }

  reorderMapData(mapData){
    let order = {
      backendUsers:1,
      ideators:6,
      funders:5,
      companies:9,
      startups:1,
      institutions:8,
      serviceproviders:7,
      cluster:1,
      chapter:1,
      accelerator:3,
      incubator:2,
      co_working:4,
    }
    mapData.map((m)=>{
      let index = (Object.keys(order)).indexOf(m.key);
      if(index<0) index = 0;
      let key = (Object.keys(order))[index];
      let pindex = order[key];
      m.index = pindex;
    });

    return _.sortBy(mapData, [function(o) { return o.index; }]);
  }

  render() {
    const mapData = this.props.data && this.props.data.length > 0 ? this.props.data : [];
    let mapDataArr = _.cloneDeep(mapData);
    let totalUsers = _.find(mapDataArr, {key:"totalUsers"});
    _.remove(mapDataArr, {key: "totalUsers"});
    let subchapter = _.find(mapDataArr, {key:"subChapter"});
    if(subchapter){
      _.remove(mapDataArr, {key: "subChapter"});
    }

    mapDataArr = this.reorderMapData(mapDataArr);

    let backendUserCount = 0;
    const mapDataList = mapDataArr.map(function (m) {
      let title = ""
      if(m.key == "backendUsers"){
        title = "Backend U"
        backendUserCount = m.count;
      }else if (m.key == "ideators"){
        title = "Ideators"
      }else if (m.key == "funders"){
        title = "Investors"
      }else if (m.key == "companies"){
        title = "Companies"
      }else if (m.key == "startups"){
        title = "Startups"
      }else if (m.key == "institutions"){
        title = "Institutions"
      }else if (m.key == "serviceproviders"){
        title = "Service P"
      }else if (m.key == "cluster"){
        title = "Chapters"
      }else if (m.key == "chapter"){
        title = "Sub Chapters"
      }else if (m.key == "accelerator"){
        title = "Accelerators"
      }else if (m.key == "incubator"){
        title = "Incubators"
      }else if (m.key == "co_working"){
        title = "Co_Working"
      }

      if(m.key !== "cluster" && m.key !== "chapter" && m.key !== "backendUsers")
        return (
          <li key={m.key}>
            <span className="title">{title}</span>
              <span className={m.icon}></span>
             <span className="count">{m.count}</span>
          </li>
        )
    });

    let path = FlowRouter._current.route.path;

    let message =(totalUsers&&totalUsers.count?totalUsers.count:0) +' Users';

    if(path.includes('admin'))
      message = (totalUsers&&totalUsers.count?totalUsers.count:0) +' /BU: '+backendUserCount;

    return (
      <div className="chapter_map_hover">
        <h2><b>{totalUsers && totalUsers.context ? totalUsers.context:""}</b> - {message}</h2>
        <div className="chapter_map_hover_content">

          <ul>
            {mapDataList}
          </ul>
        </div>
      </div>);
  }
}
