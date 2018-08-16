import React, { Component } from 'react'
import { graphql,compose } from 'react-apollo';
import MlDataResponseHandler from './MlDataResponseHandler';

const DataComposerType='graphQl';
export default class  MlGenericDataComposer extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    let config=this.props;
    if(DataComposerType==='graphQl'){
      const Composer = graphql(config.query,config.options)(MlDataResponseHandler);
      return (<Composer {...config}/>);
    }
    return null;

  }
}

