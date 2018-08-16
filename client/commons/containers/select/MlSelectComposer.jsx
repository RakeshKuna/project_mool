import React, {Component} from 'react';
import MlSelectComponent from '../../components/select/Select';
export default class MoolyaSelect extends Component {
  constructor(props){
    super(props);
    return this;
  }

  /**
   * Method :: retrieveSelectOptions
   * Desc   :: retrieves the select options data from server
   * @param options :: Object ::Query options containing variables/parameters
   * @param queryCallbackHandler :: Function :: Callback function executed once data is fetched
   * @returns Void
   */
  retrieveSelectOptions(options,queryCallbackHandler){
    let connection=this.props.connection;
    if(connection){
      const selectionOptionsPromise =  connection.query({
        query: this.props.query,
        fetchPolicy:this.props.forceFetch ===true?'network-only':'network-only',
        variables:options.queryOptions
      })
      selectionOptionsPromise.then(data =>{
        if(queryCallbackHandler){
          queryCallbackHandler(data.data.data);
        }
      })
    }
  };

  render(){
    /**
     * returning the Generic Select Component
     */
    return(
      <MlSelectComponent {...this.props} retrieveSelectOptions={this.retrieveSelectOptions.bind(this)}></MlSelectComponent>
    )
  }
}
