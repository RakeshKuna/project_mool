/**
 * Created by Sireesha on 13/7/17.
 */
import React from 'react';
var BarTooltip = require('react-d3-tooltip').BarTooltip;

export default class MlBarChart extends React.Component {
  constructor(props){
    super(props)
  }


  render() {
    let title = this.props.title?this.props.title:""
    let chartData = this.props.data&&this.props.data.length>0?this.props.data:[{year:null,number:null}]
    let chartWidth = this.props.width?this.props.width:null
    let chartHeight = this.props.height?this.props.height:null
    let chartSeries = this.props.chartSeries&&this.props.chartSeries.length>0?this.props.chartSeries:[]
    let xScale = this.props.xScale?this.props.xScale:""
    let xLabel = this.props.xLabel?this.props.xLabel:"";
    let yLabel = this.props.yLabel?this.props.yLabel:"";
    let  employmentDataX = function(d) {
      return d.year;
    }


    return  (<div><BarTooltip
      title= {title}
      data= {chartData}
      width= {chartWidth}
      height= {chartHeight}
      chartSeries = {chartSeries}
      x= {employmentDataX}
      xScale= {xScale}
      xLabel={xLabel}
      yLabel={yLabel}
    /></div>);
  }
}
