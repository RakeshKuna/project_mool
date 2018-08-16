import React, { Component, PropTypes } from 'react';
import getBreadCrumListBasedOnhierarchy from '../actions/dynamicBreadCrumListHandler';
import { fetchPortfolioImageHandler } from '../../portfolio/ideators/actions/ideatorActionHandler';

export default class DynamicBreadcrum extends Component {
  constructor(props) {
    super(props);
    this.state = { breadCrumList: [], toggle: 1};
    this.getHierarchyDetails.bind(this);
    this.setBreadCrumHierarchyCallback.bind(this);
    return this;
  }

  renderBreadcrumb() {
    this.getHierarchyDetails();
    this.setState({ toggle: !this.state.toggle });
  }

  componentDidMount() {
    this._isMounted = true;
    this.context.breadCrum.subscribe(this.renderBreadcrumb.bind(this));
    this.getHierarchyDetails();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillMount(){
    this.fetchNameToDisplay();
  }

  async fetchNameToDisplay() {
    if (FlowRouter.getParam('portfolioId')) {
      var response = await fetchPortfolioImageHandler(FlowRouter.getParam('portfolioId'));
      if (response) {
        this.setState({portfolioId:response.portfolioUserName});
      }else{
        this.setState({portfolioId:'User'});
      }
    }
  }

  setBreadCrumHierarchyCallback(list) {
    if (this._isMounted) {
      if (list && _.isArray(list)) {
        this.setState({ breadCrumList: list });
      } else {
        this.setState({ breadCrumList: [] });
      }
    }
  }

  getHierarchyDetails() {
    const params = FlowRouter.current().params;
    getBreadCrumListBasedOnhierarchy( params,this.state.portfolioId, this.setBreadCrumHierarchyCallback.bind(this));
  }

  render() {
    let counter = 0;
    let that =this;
    const linksLength = this.state.breadCrumList.length;
    const list = this.state.breadCrumList.map((prop, id) => {
      ++counter;
      let lastLinkClass = '';
      const linkUrl = prop.linkUrl;
      if (counter === linksLength) {
        lastLinkClass = 'current';
      }
      var name = prop.linkName;
      if(name === 'User') name = that.state.portfolioId;
      return (<li key={id} className={lastLinkClass}>
        <a href={linkUrl}>{name}</a></li>);
    });
    if (linksLength > 0) { list.push(<li key={'last'} className='timelineLast'></li>); }

    return (
      <div className="vTimeline">
        <ul>
          {list}
        </ul>
      </div>
    );
  }
}

function StaticBreadCrumListHandler(list, breadCrum, menu) {
  let currentModule = {};
  if (breadCrum.type) {
    menu.map((object) => {
      if ((object.uniqueId).includes(breadCrum.type) || (breadCrum.type).includes(object.uniqueId)) {
        list[0].linkUrl = object.link;
        currentModule = object;
      }
    });
    if (breadCrum.subModule) {
      currentModule.subMenu.map((object) => {
        if ((object.uniqueId).includes(breadCrum.module)) {
          list[1].linkUrl = object.link;
        }
      });
    }
    const path = Object.assign(FlowRouter._current.path);
    const module = breadCrum.subModule || breadCrum.module;
    const pathHierarchy = path.split('/');
    for (const each of pathHierarchy) {
      if (each.startsWith('edit')) {
        const link = `${path.split('edit')[0] + module}List`;
        list[list.length - 1].linkUrl = link;
        list.push({
          linkName: `Edit ${list[list.length - 1].linkName}`,
          linkUrl: '',
        });
      } else if (each.startsWith('add')) {
        const link = `${path.split('add')[0] + module}List`;
        list[list.length - 1].linkUrl = link;
        list.push({
          linkName: `Add ${list[list.length - 1].linkName}`,
          linkUrl: '',
        });
      } else if (each.startsWith('create')) {
        const link = `${path.split('create')[0] + module}List`;
        list[list.length - 1].linkUrl = link;
        list.push({
          linkName: `Create ${list[list.length - 1].linkName}`,
          linkUrl: '',
        });
      }
    }
  }

  return list;
}

DynamicBreadcrum.contextTypes = {
  menu: React.PropTypes.object,
  breadCrum: PropTypes.object,
};
