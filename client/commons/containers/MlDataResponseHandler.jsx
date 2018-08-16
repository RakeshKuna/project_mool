/**
 * Created by mohdmohasin on 29/1/17.
 */
import React, { Component } from 'react';

export default class MlDataResponseHandler extends Component{
    constructor(props){
      super(props);
    }

    render(){
      if(!this.props.data.loading) {
          const Component = this.props.component || null;
          if (Component) {
            let config=this.props;
            config.data= this.props.data.data;

            return <Component {...config}/>;
          }
      }else{
        //{this.props.showLoader===true&&<LoadingComponent />}
         return null;
      }
      return null;
    }
};
