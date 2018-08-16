/**
 * Created by vishwadeep on 10/6/17.
 */
import React, {Component} from "react";
import {findProcessSetupActionHandler} from "../actions/findProcessSetupAction";
import {fetchLikePortfolioActionHandler} from '../actions/fetchLikePortfolio';
import Tabs from 'react-responsive-tabs';
import MlAppInvestmentItem from './MlAppInvestmentItem';
import NoDataList from '../../../commons/components/noData/noDataList';
import MlLoader from '../../../commons/components/loader/loader'

export default class MlAppInvestment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      portfolio:[]
    };
    this.findProcessSetup.bind(this);
    this.fetchPortfolio = this.fetchPortfolio.bind(this);
    return this;
  }

  componentWillMount() {
    this.fetchPortfolio();
    const resp = this.findProcessSetup();
    return resp;
  }

  async fetchPortfolio(){
    const response = await fetchLikePortfolioActionHandler('portfolio');
    if(response){
      let result = JSON.parse(response);
      console.log("result", result);
      this.setState({
        portfolio: result
      });
    }

  }

  async findProcessSetup() {
    const response = await findProcessSetupActionHandler();
    this.setState({loading: false, data: response});
  }

  render() {
    const that = this;

    let data = this.state.data && this.state.data.processSteps && this.state.data.processSteps.length > 0 ? this.state.data.processSteps : [];
    console.log("this.state.data", this.state.data);
    const MlTabs = data.filter(function (stage) {
      return stage.isActive;
    }).map(function (stage, id) {
      console.log(stage, 'stage');
      return {
          name: stage.stageName,
          stage: stage.stage,
          tabContent: <MlAppInvestmentItem fetchPortfolio={that.fetchPortfolio}  stages={data} portfolio={that.state.portfolio} account={that.state.account} currentStage={stage} />
        }
    });

    function getTabs() {
     // console.log("MlTabs", MlTabs);
      return MlTabs.map(MlTab => ({
        tabClassName: 'horizon-item', // Optional
        panelClassName: 'panel1', // Optional
        title: MlTab.name,
        getContent: () => MlTab.tabContent,
      }));
    }

    const App = () => <Tabs items={getTabs()} />;
    const showLoader=this.state.loading;
    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (
          <div className="app_main_wrap">
            <div className="app_padding_wrap">
              <div className="col-md-12">
                {MlTabs.length ? <App/> : <NoDataList moduleName="Investments"/>}
              </div>
            </div>
          </div>)
        }
        </div>
    )
  }
}
