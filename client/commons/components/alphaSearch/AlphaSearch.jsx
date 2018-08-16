import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');

export default class AlphaSearch extends Component {

  constructor(props) {
    super(props);
    return this;
  }

  componentDidMount() {
    $('.alfa_pagination').click(function(){
        $(this).toggleClass('alfa_pagination_open');
    });
  }


  render() {

    const alphabets=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var that=this;
    let alphabetsList = alphabets.map(function(alpha) {
     return ( <li key={alpha} id={alpha} onClick={that.props.onAlphaSearchChange.bind(that,alpha)}><a href="">{alpha}</a></li>)
    });

    return (
      <div className="alfa_pagination">
        <div className="filter alfa_filter"><span className="filt_text"> A-Z</span></div>
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
