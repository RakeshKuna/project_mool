/**
 * Created by pankaj on 5/9/17.
 */
import React, { Component, PropTypes } from 'react';
import Moolyaselect from  '../../../commons/containers/select/MlSelectComposer'

export default class MlAppFilterPresentation extends Component {

  render() {
   
    const that = this;
    const props = that.props;
   
    const {filters, selectedData } = props;
    return (
      <div className="row">
          {filters.map((filter) => {
            filter.type = filter.type.toUpperCase();
            switch (filter.type){
              case "INPUT":
                return (
                  <div className="col-lg-3">
                    <input type="text"  ref="input" placeholder={filter.displayName} onChange={(evt) => props.updateFilterQuery(evt.target.value, filter.field,"INPUT") } className="form-control float-label" id="" disabled={filter.isRestrictedFilter}/>
                  </div>
                );
                break;
              case "RADIO":
                return (
                  <div className="col-lg-3">
                    <div className="input_types label_name">
                      <label>{options.displayName} : </label>
                    </div>
                    { filter.options.map((option) => {
                    return (
                      <div className="input_types">
                        <input id="radio1" type="radio" name="radio" /><label htmlFor="radio1"><span><span></span></span>true</label>
                      </div>
                    )
                    })}
                    </div>
                );
                break;
              case "SELECT":
                let selected = selectedData[filter.field] ? selectedData[filter.field] : "";
                return(
                  <div className="col-lg-3">
                    <Moolyaselect
                      connection={props.connection}
                      multiSelect={true}
                      ref="listSelect"
                      placeholder={filter.displayName}
                      valueKey={'value'}
                      labelKey={'label'}
                      queryType={"graphql"}
                      query={filter.graphQLQuery}
                      reExecuteQuery={true}
                      queryOptions={filter.graphQLOption}
                      onSelect={(value) => props.updateFilterQuery(value, filter.field, "SELECT")}
                      isDynamic={true}
                      id={'list'+ filter.field}
                      selectedValue={selected}
                    />
                  </div>
                );
                break;
              case "MULTISELECT":
                //Multi select
        
                let multiselected = selectedData[filter.field] ? selectedData[filter.field] : "";
                return(
                  <div className="col-lg-3">
                    <Moolyaselect
                      connection={props.connection}
                      multiSelect={true}
                      ref="listSelect"
                      placeholder={filter.displayName}
                      valueKey={'value'}
                      labelKey={'label'}
                      queryType={"graphql"}
                      query={filter.graphQLQuery}
                      reExecuteQuery={true}
                      queryOptions={filter.graphQLOption}
                      onSelect={(value) => props.updateFilterQuery(value, filter.field,"MULTISELECT")}
                      isDynamic={true}
                      id={'list'+ filter.field}
                      selectedValue={multiselected}
                    />
                  </div>
                );
                break;
              case "CHECKBOX":
                <input type="checkbox"/>
                break;
              case "MULTICHECKBOX":
                return filter.options.map((option) => {
                  return <input type="checkbox"/>
                });
                break;
              default:
                return <h1>to do for {filter.type}</h1>
                break;
          }
        })}
      </div>
    )

  }

}
