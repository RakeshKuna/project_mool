/**
 * Created by Sireesha on 13/7/17.
 */
import React from 'react';
var BarGroupTooltip = require('react-d3-tooltip').BarGroupTooltip;

export default class MlBarGroupChart extends React.Component {
  constructor(props){
    super(props)
  }


  render() {
    let title = this.props.title?this.props.title:""
    let chartData = this.props.data&&this.props.data.length>0?this.props.data:[]
    let chartWidth = this.props.width
    let chartHeight = this.props.height
    let chartSeries = this.props.chartSeries?this.props.chartSeries:[]
    let xScale = this.props.xScale
    let xLabel = this.props.xLabel
    let yLabel = this.props.yLabel
    let  dataX = function(d) {
      return d.year;
    }

    return  (<div><BarGroupTooltip
      title= {title}
      data= {chartData}
      width= {chartWidth}
      height= {chartHeight}
      chartSeries = {chartSeries}
      x= {dataX}
      xScale= {xScale}
      xLabel = {xLabel}
      yLabel = {yLabel}
    /></div>);
  }
}
