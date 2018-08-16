/**
 * Created by Sireesha on 13/7/17.
 */
import React from 'react';
var LineTooltip = require('react-d3-tooltip').LineTooltip;

export default class MlLineChart extends React.Component {
  constructor(props){
    super(props)
  }


  render() {
    let title = this.props.title?this.props.title:""
    let chartData = this.props.data?this.props.data:[]
    let chartWidth = this.props.width?this.props.width:null
    let chartHeight = this.props.height?this.props.height:null
    let chartSeries = this.props.chartSeries?this.props.chartSeries:[]
    let xScale = this.props.xScale?this.props.xScale:""
    let margins = this.props.margins?this.props.margins:"";
    let dataX = function(d) {
      return d.year;
    };
    let xLabel = this.props.xLabel?this.props.xLabel:"";
    let yLabel = this.props.yLabel?this.props.yLabel:"";

    return  (<div><LineTooltip
      title= {title}
      data= {chartData}
      width= {chartWidth}
      height= {chartHeight}
      margins= {margins}
      chartSeries = {chartSeries}
      x= {dataX}
      xLabel={xLabel}
      yLabel={yLabel}
      xScale= {xScale}
     /></div>);
  }
}
