/** ************************************************************
 * Date: 13 Jul, 2017
 * Programmer: Pankaj <pankajkumar.jatav@raksan.in>
 * Description : Infinite scroll header presentation layer
 * JavaScript file MlInfiniteScrollHeader.js
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React, {Component} from 'react';
import AlphaSearch from "./../../../../commons/components/alphaSearch/AlphaSearchWithAll";

export default class MlInfiniteScrollHeader extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.state = {searchText: ''};
    this.handleChange = this.handleChange.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  handleChange(event) {
    this.setState({
      searchText: event.target.value
    }, function () {
      this.updateSearch(event);
    }.bind(this));
  }

  updateSearch(evt) {
    evt.preventDefault();
    let searchText = this.state.searchText;
    let searchFields = this.props.config && this.props.config.searchFields ? this.props.config.searchFields : [];
    console.log(searchText , searchFields);
    this.props.updateSearchValue(searchText , searchFields);
  }

  render() {
    const that = this;
    const props = that.props;
    const {config, updateFilterQuery} = this.props;
    let filterData = config.filterData ? config.filterData : [];
    let filterComponent;
    if(config.filter && config.filterComponent){
      filterComponent = React.cloneElement(config.filterComponent, { submit:updateFilterQuery, filterData:filterData });
    }
    console.log(props);
    // let ListComponent =React.cloneElement(viewComponent,{data:data, config:pConfig});
    return (
      <div>
        { config.filter ?
          filterComponent : ""
        }
        { config.search ?
          <form onSubmit={that.updateSearch} style={{'margin':'0','position':'absolute','top':'19px','right':'11px','zIndex':'1'}}>
            <input type="text" className="form-control" onBlur={that.updateSearch} id="btn-search" placeholder="Search..." ref="searchText" onChange={(evt) => that.handleChange(evt) }/>
          </form>
          : ""
        }
        { config.alphabeticSearch ?
          <div className='list_view_block'><AlphaSearch onAlphaSearchChange={props.onAlphaSearchChange} /></div>
          : ""
        }

        {/*<br className="clearfix" />*/}
      </div>
    )
  }
}

