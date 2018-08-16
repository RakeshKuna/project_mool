import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');

export default class AlphaSearch extends Component {

  constructor(props) {
    super(props);
    this.state={
      alphabets : ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
      alphabetsWithAll : ['All','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',''],
      currentData:[],
      currentAlpha:'All'
    };
    this.onAlphaSearchChange = this.onAlphaSearchChange.bind(this);
    return this;
  }

  componentDidMount() {
    $('.alfa_pagination').click(function(){
        $(this).toggleClass('alfa_pagination_open');
    });

    this.setState({currentData:this.state.alphabets});
  }

  onAlphaSearchChange(alpha){
    let searchValue = alpha;
    let currentData = this.state.alphabetsWithAll;

    if(alpha === 'All'){
      searchValue='';
      currentData = this.state.alphabets;
    }

    if(this.state.currentAlpha!==alpha){
      this.setState({currentAlpha:alpha,currentData},()=>{
        this.props.onAlphaSearchChange(searchValue);
      });
    }
  }

  render() {

    // const alphabets=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var that=this;
    let alphabetsList = this.state.currentData.map(function(alpha) {
      // if(that.state.currentAlpha!==alpha)
        return ( <li key={alpha||'empty'} id={alpha||'empty'} className={(that.state.currentAlpha === alpha?'active':'')} onClick={e=>alpha && that.onAlphaSearchChange(alpha)}><a href="">{alpha}</a></li>)
    });

    return (
      <div className="alfa_pagination">
        <div className="filter alfa_filter">
          <span className={that.state.currentAlpha==='All'?"filt_text":"filt_text active"}>
            {that.state.currentAlpha==='All'?'A-Z':(that.state.currentAlpha).toUpperCase()}
            </span>
        </div>
        <div className="alfa_filter_litters">
          <ul>
            {alphabetsList}
          </ul>
        </div>
      </div>

    )
  }
}

AlphaSearch.PropTypes={
  onAlphaSearchChange:React.PropTypes.function
}
