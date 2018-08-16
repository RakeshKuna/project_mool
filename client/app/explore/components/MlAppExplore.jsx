import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import {fetchExploreMenuHandler} from '../actions/fetchExploreMenu'
import {appClient} from '../../core/appConnection'
var FontAwesome = require('react-fontawesome');

export default class MlAppExplore extends Component {
  constructor(props, context) {
    super(props)
    this.state = {communities:[], loading:true};
    this.fetchExploreMenu.bind(this)
  }

  componentDidMount(){
    return this.fetchExploreMenu();
  }

  async fetchExploreMenu()
  {
    const response = await fetchExploreMenuHandler(appClient);
      if (response)
        this.setState({loading: false, communities: response});
    return;
  }

  render(){
    return(
      <div className="app_main_wrap">
        <div className="list_view_block communities_list" >
          <div className="col-md-12">
            <div className="row">
              {this.state.communities.map(function (community, index) {
                return(
                  <div className="col-lg-2 col-md-3 col-sm-3" key={index}>
                    <a href={community.link}>
                      <div className="list_block">
                        <div className="hex_outer"><span className={community.image}></span></div>
                        <h3>{community.name}</h3>
                      </div>
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
