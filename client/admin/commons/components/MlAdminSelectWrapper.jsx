import MoolyaSelect from '../../../commons/containers/select/MlSelectComposer';
import React, {Component} from 'react';
import {client} from '../../core/apolloConnection';

/**
 * Method :: anonymous
 * Desc   :: wraps the generic MlSelect component with apollo connection for admin
 * @param queryOptions :: Object ::Query options containing variables/parameters
 * @returns  {<React.Component>}
 */
/*export default (queryOptions)=>{
  return <MoolyaSelect {...queryOptions} connection={client}/>;
}*/

export default class Moolyaselect extends Component {
  constructor(props){
    super(props);
    return this;
  }
  render(){
    /** returning the Generic Select Component*/
    return <MoolyaSelect {...this.props} connection={client}/>;
  }
}
