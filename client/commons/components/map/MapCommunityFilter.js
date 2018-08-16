import React, { Component, PropTypes } from 'react';
var FontAwesome = require('react-fontawesome');

export default class MapCommunityFilter extends Component {
  constructor(props){
    super(props);
    this.state={ userType : 'All' };
  }


  render(){
    return (
        <div className={this.props.fixed_icon?"community_icons fixed_icon":"community_icons"}>
          <a data-toggle="tooltip" title="All" data-placement="bottom" className={this.props.userType==='All'?"All active_community":"All"} data-filter="all">
            <p className='title'>All</p><span className="ml ml-select-all" onClick={this.props.onStatusChange.bind(this, "All")}></span>
          </a>
          <a data-toggle="tooltip" title="Startups" data-placement="bottom" className={this.props.userType==='Startups'?"STU active_community":"STU"} data-filter="startup">
            <p className='title'>Startups</p><span className="ml my-ml-Startups st" onClick={this.props.onStatusChange.bind(this, "Startups")}></span>
          </a>
          <a data-toggle="tooltip" title="Investors" data-placement="bottom" className={this.props.userType==='Investors'?"FUN active_community":"FUN"} data-filter="funder">
            <p className='title'>Investors</p><span className="ml my-ml-Investors fu" onClick={this.props.onStatusChange.bind(this, "Investors")}></span>
          </a>
          <a data-toggle="tooltip" title="Ideators" data-placement="bottom" className={this.props.userType==='Ideators'?"IDE active_community":"IDE"} data-filter="ideator">
            <p className='title'>Ideators</p><span className="ml my-ml-Ideator id" onClick={this.props.onStatusChange.bind(this, "Ideators")}></span>
          </a>
          <a data-toggle="tooltip" title="Service Providers" data-placement="bottom" className={this.props.userType==='Service Providers'?"SP active_community":"SP"} data-filter="provider">
            <p className='title'>Service P</p><span className="ml my-ml-Service-Providers pr" onClick={this.props.onStatusChange.bind(this, "Service Providers")}></span>
          </a>
          {/*<a data-toggle="tooltip" title="Browsers" data-placement="bottom" className="" data-filter="browser">*/}
          {/*<span className="ml ml-browser" onClick={this.onStatusChange.bind(this, "Browsers")}></span>*/}
          {/*</a>*/}
          <a data-toggle="tooltip" title="Institutions" data-placement="bottom" className={this.props.userType==='Institutions'?"INS active_community":"iNS"} data-filter="institution">
            <p className='title'>Institutions</p><span className="ml my-ml-Institutions ins" onClick={this.props.onStatusChange.bind(this, "Institutions")}></span>
          </a>
          <a data-toggle="tooltip" title="Companies" data-placement="bottom" className={this.props.userType==='Companies'?"CMP active_community":"CMP"} data-filter="company">
            <p className='title'>Companies</p><span className="ml my-ml-Company co" onClick={this.props.onStatusChange.bind(this, "Companies")}></span>
          </a>
          {/*<a data-toggle="tooltip" title="Backend Users" data-placement="bottom" className="" data-filter="internalUser">*/}
          {/*<p className='title'>Backend Users</p><span className="ml ml-moolya-symbol ot" onClick={this.onStatusChange.bind(this, "BackendUsers")}></span>*/}
          {/*</a>*/}
        </div>
    );
  }
}

