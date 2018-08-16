import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var Rating = require('react-rating');

export default class StarRatings extends React.Component{
  render(){
    return (
      <div className="star_ratings">
        <Rating  empty="fa fa-star-o empty" onChange={this.props.onRatingsChange&&this.props.onRatingsChange} full="fa fa-star fill" fractions={2} initialRate={this.props.initialRate} readonly={this.props.readonly}/>
      </div>
    )
  }
};
