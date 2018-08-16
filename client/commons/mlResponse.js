/**
 * Created by venkatasrinag on 28/1/17.
 */
import React, { Component } from 'react';

const response = class response extends Component{
    constructor(props){
      super(props);
    }

    render(){
      if(!this.props.data.loading) {
        const Component = this.props.component || null;
        if (Component) {
          let obj = JSON.parse(this.props.data.data)
          return <Component {...obj}/>;
        }
      }

      return null;
    }
}

module.exports = response;
