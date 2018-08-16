import React, { Component,PropTypes } from 'react';
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import _ from "lodash";
var FontAwesome = require('react-fontawesome');
var BarTooltip = require('react-d3-tooltip').BarTooltip;
var BarGroupTooltip = require('react-d3-tooltip').BarGroupTooltip;
var LineTooltip = require('react-d3-tooltip').LineTooltip;
var PieTooltip = require('react-d3-tooltip').PieTooltip;
import MlBarChart from '../../../../../../commons/components/d3/MlBarChart'
import {fetchInstitutionChartsDetailsActionHandler} from '../../../actions/findPortfolioInstitutionDetails'
import MlChartSubTabs from '../../../../../../commons/charts/MlChartsSubTabs'
import MlInstitutionChart from '../edit/charts/MlInstitutionChart'
import MlNoDataContainer from '../../../../../../commons/containers/MlNoDataContainer.jsx';
export default class MlInstitutionEditChart extends React.Component {
  constructor(props, context){
    super(props)
    this.state = {employmentData:[], prlData:[], reviewData:[], empBreakUpData:[],graphSelected:false, startupPortfolio:{},
      startupCharts:[],startupChartsList:[]}
    this.fetchPortfolioInstitutionChartDetails.bind(this)
    this.getEmploymentOfCompany.bind(this)
    this.getProfitRevenueLiability.bind(this)
    this.getReviewOfCompany.bind(this)
    this.getEmployeeBreakUpDepartment.bind(this)

  }
  componentDidMount(){
    const resp = this.fetchPortfolioInstitutionChartDetails();
    return resp
  }

  componentDidUpdate(){
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    var className = this.props.isAdmin?"admin_header":"app_header"
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
    if(WinWidth > 768){
      $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
  }

  async fetchPortfolioInstitutionChartDetails() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await fetchInstitutionChartsDetailsActionHandler(portfoliodetailsId);
    if (response) {
      this.setState({loading: false, startupCharts: response, startupChartsList: response});
      this.getEmploymentOfCompany(response);
      this.getProfitRevenueLiability(response);
      this.getReviewOfCompany(response);
      this.getEmployeeBreakUpDepartment(response);
    }

  }


  getEmploymentOfCompany(response){
    let emplymentData = response&&response.employmentOfCompanyChart?response.employmentOfCompanyChart:[]
    var actualData = emplymentData&&emplymentData.length>0?emplymentData:[]
    var barChartData = [];
    actualData.map(function (data) {
      var cData = {}
      let fromYear = data&&data.eofFromYear?data.eofFromYear:0
      let toYear = data&&data.eofToYear?data.eofToYear:0
      cData['year'] = Number(fromYear)+'-'+Number(toYear)
      cData['number'] = data.eofNumberOfEmployment?data.eofNumberOfEmployment:0;
      barChartData.push(cData)
    })

    this.setState({employmentData:barChartData})
  }

  getProfitRevenueLiability(response){
    let revenueData = response&&response.profitRevenueLiabilityChart?response.profitRevenueLiabilityChart:[]
    var actualData = revenueData&&revenueData.length>0?revenueData:[]
    var barChartData = [];
    actualData.map(function (data) {
      var cData = {}
      cData['value'] = data.prlValue?data.prlValue:null
      cData[data.prlEntityType] = data.prlValue
      let fromYear = data&&data.prlFromYear?data.prlFromYear:0
      let toYear = data&&data.prlToYear?data.prlToYear:0
      cData['year'] = Number(fromYear)+'-'+Number(toYear)
      barChartData.push(cData)
    })
    this.setState({prlData:barChartData})
  }

  getReviewOfCompany(response){
    let reviewData = response&&response.reviewOfCompanyChart?response.reviewOfCompanyChart:[]
    var actualData = reviewData&&reviewData.length>0?reviewData:[]

    var barChartData = [];
    actualData.map(function (data) {
      var cData = {}
      cData['rating'] = data.rofValue
      cData['year'] = data.rofYear
      barChartData.push(cData)
    })
    this.setState({reviewData:barChartData})
  }

  getEmployeeBreakUpDepartment(response){
    let companyData = response&&response.employeeBreakupDepartmentChart?response.employeeBreakupDepartmentChart:[]
    var actualData = companyData&&companyData.length>0?companyData:[]
    var barChartData = [];
    actualData.map(function (data) {
      var cData = {}
      cData['department'] = data&&data.ebdDepartmentName?data.ebdDepartmentName:""
      cData['employmentNumber'] = data&&data.ebdNumberOfEmployment?data.ebdNumberOfEmployment:""
      barChartData.push(cData)
    })
    this.setState({empBreakUpData:barChartData})
  }

  selectedGraph(){
    this.setState({"graphSelected" :  true})
    $('.last-item').removeClass('menunone');
    //this.props.backClickHandler()
  }

  getPortfolioInstitutionChartDetails(details,tabName){
    let data = this.state.startupPortfolio;
    data[tabName] = details;
    this.props.getChartDetails(details,tabName);
  }

  render(){
    var width = 450,
      height = 400,
      margins = {left: 100, right: 100, top: 50, bottom: 50},
      employmentDataTitle = "Bar Chart with tooltip",
      showXAxis = true,
      showYAxis = true,
      employmentDataChartSeries = [
        {
          field: 'number',
          name: 'Employment Of Company',


        }
      ],
      employmentDataX = function(d) {
        return d.year;
      },
      employmentDataXLabel = "Year",
      employmentDataYLabel = "Value",

      prlTitle = "Bar Group Chart with Tooltip",
      prlChartSeries = [
        {
          field:"Profit",
          name:"Profit"
        },
        {
          field:"Revenue",
          name:"Revenue"
        },
        {
          field:"Liability",
          name:"Liability"
        }
      ],
      prlX = function(d) {
        return d.year;
      },
      prlY = function(d) {
        return d / 100;
      },

      xScale = 'ordinal',
      yTicks = [1, "%"],
      prlXLabel = "Profit, Revenue & Liability",
      prlYLabel = "Value",

      reviewTitle = "Review of Company",
      reviewChartSeries = [
        {
          field: 'rating',
          name: 'Review of the company',
          color: '#ff7f0e'
        }
      ],
      reviewXLabel = "Year",
      reviewYLabel = "Value",
      reviewX = function(d) {
        return d.year;
      },
      reviewY = function(d) {
        return d;
      },

      title = "Pie Chart With Tooltip",
      // value accessor
      value = function(d) {
        return d && +d.employmentNumber;
      },
      // name accessor
      name = function(d) {
        return d && d.department;
      };
    let chartSeries = []
    _.map(this.state.empBreakUpData, function (details,idx) {
      chartSeries.push({"field" : details.department, "name":details.department})
    });

    /* chartSeries = [
     {
     "field":"Management",
     "name":"Management"
     },
     {
     "field":"Finance",
     "name":"Finance"
     },
     {
     "field":"Development",
     "name":"Development"
     },
     {
     "field":"Support",
     "name":"Support"
     }
     ]*/
    return(
      <div>

        {this.state.graphSelected===false?(<div>
          <h2>Charts</h2>
            <div className="main_wrap_scroll">

                {/*
                 <div className="ml_btn">
                 <a className="save_btn" onClick={this.selectedGraph.bind(this)}>Edit</a>
                 </div>
                 */}

                <div className="col-md-6">
                  <div className="chart_bg">
                    <a  onClick={this.selectedGraph.bind(this)}>Edit</a>
                    <MlBarChart
                      title= {employmentDataTitle}
                      data= {this.state.employmentData}
                      width= {width}
                      height= {height}
                      xScale= {xScale}
                      xLabel = {employmentDataXLabel}
                      yLabel = {employmentDataYLabel}
                      chartSeries = {employmentDataChartSeries}
                      showXAxis= {showXAxis}
                      showYAxis= {showYAxis}
                    />
                    <MlNoDataContainer dataType={'Array'} data={this.state.employmentData||[]} parentClassName="chart_msg" content={<span>There is no data to be <br />represented <br />here as of now</span>} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="chart_bg">
                    <a  onClick={this.selectedGraph.bind(this)}>Edit</a>
                    <BarGroupTooltip
                      title= {prlTitle}
                      data= {this.state.prlData}
                      width= {width}
                      height= {height}
                      chartSeries = {prlChartSeries}
                      xScale= {xScale}
                      x= {prlX}
                      y={prlY}
                      xLabel = {prlXLabel}
                      yLabel = {prlYLabel}
                      showXAxis= {showXAxis}
                      showYAxis= {showYAxis}
                    />
                    <MlNoDataContainer dataType={'Array'} data={this.state.prlData?this.state.prlData:[]} parentClassName="chart_msg" content={<span>There is no data to be <br />represented <br />here as of now</span>} />
                  </div>
                </div>
                <br className="brclear"/>
                <div className="col-md-6">
                  <div className="chart_bg">
                    <a  onClick={this.selectedGraph.bind(this)}>Edit</a>
                    <LineTooltip
                      title= {reviewTitle}
                      data= {this.state.reviewData}
                      width= {width}
                      height= {height}
                      margins= {margins}
                      chartSeries= {reviewChartSeries}
                      xScale= {xScale}
                      x= {reviewX}
                      y={reviewY}
                      xLabel = {reviewXLabel}
                      yLabel = {reviewYLabel}
                    />
                    <MlNoDataContainer dataType={'Array'} data={this.state.reviewData?this.state.reviewData:[]} parentClassName="chart_msg" content={<span>There is no data to be <br />represented <br />here as of now</span>} />
                  </div></div>

                <div className="col-md-6">
                  <div className="chart_bg">
                    <a  onClick={this.selectedGraph.bind(this)}>Edit</a>
                    <p className="text-center">Employee breakup at Department level</p>
                    <PieTooltip
                      title= {title}
                      data= {this.state.empBreakUpData}
                      width= {width}
                      height= {height}
                      chartSeries= {chartSeries}
                      value = {value}
                      name = {name}
                    />
                    <MlNoDataContainer dataType={'Array'} data={this.state.empBreakUpData?this.state.empBreakUpData:[]} parentClassName="chart_msg" content={<span>There is no data to be <br />represented <br />here as of now</span>} />
                  </div></div>
            </div>
          </div>
          /*<MlLineChart
           title= {reviewTitle}
           data= {this.state.reviewData}
           width= {width}
           height= {height}
           margins= {margins}
           chartSeries= {reviewChartSeries}
           x= {reviewX}
           xScale= {xScale}
           />
           <MlPieChart
           title= {title}
           data= {this.state.empBreakUpData}
           width= {width}
           height= {height}
           chartSeries= {chartSeries}
           value = {value}
           name = {name}
           />*/
        ):(<div>{

          <MlInstitutionChart getPortfolioInstitutionChartDetails={this.getPortfolioInstitutionChartDetails.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} startupChartsDetails={this.state.startupCharts} isApp={this.props.isApp}></MlInstitutionChart> }</div>)
        }

      </div>
    )
  }
}

MlInstitutionEditChart.contextTypes = {
  institutionPortfolio: PropTypes.object,
};

