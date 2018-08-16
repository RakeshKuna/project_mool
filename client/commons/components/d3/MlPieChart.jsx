/**
 * Created by Sireesha on 13/7/17.
 */
import React from 'react';
var PieTooltip = require('react-d3-tooltip').PieTooltip;

export default class MlPieChart extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    let title = this.props.title?this.props.title:""
    let chartData = this.props.data?this.props.data:[]
    let chartWidth = this.props.width?this.props.width:0
    let chartHeight = this.props.height?this.props.height:0
    let chartSeries = this.props.chartSeries?this.props.chartSeries:[]
    let value = this.props.value?this.props.value:""
    let name = this.props.name?this.props.name:""
    let  dataX = function(d) {
      return d.year;
    }

    return  (<div><PieTooltip
      title= {title}
      data= {chartData}
      width= {chartWidth}
      height= {chartHeight}
      chartSeries = {chartSeries}
      value = {value}
      name = {name}
    /></div>);
  }
}
