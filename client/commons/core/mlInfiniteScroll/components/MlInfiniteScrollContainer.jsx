/** ************************************************************
 * Date: 12 Jul, 2017
 * Programmer: Pankaj <pankajkumar.jatav@raksan.in>
 * Description : Infinite scroll main container
 * JavaScript file MlInfiniteScrollContainer.js
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React, {Component} from 'react';
import MlInfiniteScrollHeader from './MlInfiniteScrollHeader';
import MlInfiniteScrollFooter from "./MlInfiniteScrollFooter";
import MlInfiniteScrollView from "./MlInfiniteScrollView";
import MlAppFilterContainer from "../../../../app/commons/filter/MlAppFilterContainer";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default class MlInfiniteScrollContainer extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props){
    super(props);
    this.filterQuery = {};
    this.searchText = '';
    this.searchFields = [];
    this.alphabeticSearch = {};
    this.loadMore = this.loadMore.bind(this);
    this.updateSearchValue = this.updateSearchValue.bind(this);
    this.updateFilterQuery = this.updateFilterQuery.bind(this);
    this.onAlphaSearchChange = this.onAlphaSearchChange.bind(this);
  }

  componentWillMount() {
    let WinHeight = $(window).height();
    //$('.infinite_scroll').height(WinHeight-(210+$('.app_header').outerHeight(true)));
  }


  componentWillReceiveProps(props) {
    console.log('props',props);
  }

  updateSearchValue(searchText, searchFields){
    this.searchText = searchText;
    this.searchFields = searchFields;
    this.loadMore(true);
  }

  loadMore(isReset){
    const props = this.props;
    let data = this.props.data && this.props.data.data ? this.props.data.data : [];
    let options = {
      module: props.moduleName,
      queryProperty: {
        limit : props.perPageLimit,
        skip : data.length && !isReset ? this.props.data.data.length : 0,
        filterQuery: JSON.stringify(this.filterQuery),
        searchText: this.searchText,
        searchFields: this.searchFields,
        alphabeticSearch: JSON.stringify(this.alphabeticSearch)
      }
    };
    if(props.sort) {
      options.queryProperty['sortBy'] = props.sortBy;
    }
    this.props.fetchMore(options, isReset);
  }

  updateFilterQuery(filterQuery) {
    this.filterQuery = filterQuery;
    this.loadMore(true);
  }

  onAlphaSearchChange(alphabet) {
    let alphabeticSearchField = this.props && this.props.headerComponents && this.props.headerComponents.alphabeticSearchField ? this.props.headerComponents.alphabeticSearchField : '';
    if(alphabeticSearchField) {
      this.alphabeticSearch[alphabeticSearchField] = alphabet;
      this.loadMore(true);
    }
  }

  render() {
    const that = this;
    const props = that.props;
    let viewComponent = this.props.viewComponent;
    let data = this.props.data && this.props.data.data ? this.props.data.data : [];
    let count = this.props.data && this.props.data.count ? this.props.data.count : 0;
    let hasMore = count>data.length ? true : false;

    return (
      <div className={props && props.isApp?'':"admin_main_wrap"}>
        <div className={props && props.isApp?'app_padding_wrap':"admin_padding_wrap"}>
          {/*<MlAppFilterContainer  submit={this.updateFilterQuery} />*/}
          { props.header ? <MlInfiniteScrollHeader
                              config={props.headerComponents}
                              updateSearchValue={this.updateSearchValue}
                              updateFilterQuery={this.updateFilterQuery}
                              onAlphaSearchChange={that.onAlphaSearchChange}
            /> : '' }
          <MlInfiniteScrollView viewComponent={viewComponent} data={data} config={props} />
          <MlInfiniteScrollFooter hasMore={hasMore} loadMore={this.loadMore} />
        </div>
      </div>
      )

  }
}
