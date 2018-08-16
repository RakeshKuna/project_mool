/** ************************************************************
 * Date: 13 Jul, 2017
 * Programmer: Pankaj <pankajkumar.jatav@raksan.in>
 * Description : Infinite scroll footer presentation layer
 * JavaScript file MlInfiniteScrollFooter.js
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React, {Component} from 'react';

export default class MlInfiniteScrollFooter extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props){
    super(props);
  }

  render() {
    const that = this;
    const props = that.props;
    return (
      <div className="ml_btn" style={{textAlign: "center"}}>
        <button className="ml_submit_btn" style={{float: "none"}} hidden={!props.hasMore} disabled={!props.hasMore} onClick={()=>props.loadMore()}>Load More</button>
      </div>
    )
  }
}
