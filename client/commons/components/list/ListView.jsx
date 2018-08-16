import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import  $ from 'jquery'
import MoolyaClusterTemplate from './ClusterTemplate'
export default class MoolyaListView extends Component {

  render(){
    return(

      <div className="list_view_block">
      <div className="col-md-12">
        <div className="row">
          {
            this.props.clusterListOptions.map(function(option) {
              return (
                <MoolyaClusterTemplate nameField={option.nameField} listRouterPath={option.listRouterPath} imageLink={option.imageLink} statusField={option.statusField} />
              )
            })
          }

        </div>
      </div>
      </div>
    )
  }

}
MoolyaListView.propTypes={
  nameField:React.PropTypes.string,
  imageLink:React.PropTypes.string,
  statusField:React.PropTypes.string
}

