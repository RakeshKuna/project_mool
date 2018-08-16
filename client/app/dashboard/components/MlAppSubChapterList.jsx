import React, { Component } from 'react';
import _ from 'lodash';
import dashboardRoutes from '../actions/routesActionHandler';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';
import MlAppDashboardFilters from './MlAppDashboardFilters';

export default class MlAppSubChapterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      v: false,
      setCommunityName: null,
    };
    this.onStatusChange = this.onStatusChange.bind(this);
    return this;
  }

  onStatusChange(userType) {
    // console.log(userType);
    if (userType) {
      let config = this.props.config;
      let options = {
        module: config.moduleName,
        queryProperty: {
          limit: config.perPageLimit,
          skip: 0,
        },
      };
      if (config.sort) {
        options.queryProperty.sortBy = config.sortBy;
      }
      const hasQueryOptions = this.props.config && this.props.config.queryOptions ? true : false;
      if (hasQueryOptions) {
        if (config && config.params) {
          const usertype = { userType };
          _.extend(config.params, usertype);
        } else {
          const newParams = { params: { userType } };
          const data = _.omit(config, 'params');
          config = _.extend(data, newParams);
        }
      }
      const dynamicQueryOption = this.props.config && this.props.config.buildQueryOptions ? this.props.config.buildQueryOptions(config) : {};
      options = _.extend(options, dynamicQueryOption);
      this.props.config.fetchMore(options, true);
      // this.setState(userType);
    }
  }

  render() {
    const data = this.props.data || [];
    const v = this.state.v;
    const list =  data.map((prop) =>
      <div className="col-lg-2 col-md-4 col-sm-4" key={prop._id}>
        <div className="list_block">
          <div className={`cluster_status ${prop.statusField|| ""}_cl `}></div>
          <a href={dashboardRoutes.subChapterAnchorRoute(prop.clusterId,prop.chapterId,prop._id, v)}>
            <div className={"hex_outer"}>{prop.subChapterImageLink ? <img src={generateAbsolutePath(prop.subChapterImageLink)}/> : <span
              className="ml ml-moolya-symbol"></span>}</div>
          </a>
          <h3>{prop.subChapterDisplayName} </h3>
        </div>
      </div>
  );

    return (
      <div>
        <div className="community_icons fixed_icon">
          <MlAppDashboardFilters onStatusChange={this.onStatusChange} />
        </div>
        <div className="col-md-12">
          <h2> Sub-Chapters </h2>
          {list}
        </div>
      </div>
    );
  }
}

// <a href={dashboardRoutes.communityListRoute(prop.clusterId,prop.chapterId,prop._id, v)}>
