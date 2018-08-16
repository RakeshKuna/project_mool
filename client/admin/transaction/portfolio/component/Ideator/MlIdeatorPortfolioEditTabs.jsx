import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import MlTabComponent from "../../../../../commons/components/tabcomponent/MlTabComponent";
import MlIdeatorDetails from "../Ideator/MlIdeatorDetails";
import MlIdeatorProblemsAndSolutions from "../Ideator/MlIdeatorProblemsAndSolutions";
import MlIdeatorAudience from "../Ideator/MlIdeatorAudience";
import MlIdeatorStrategyAndPlanning from "../Ideator/MlIdeatorStrategyAndPlanning";
import MlIdeatorIntellectualPlanningAndTrademark from "../Ideator/MlIdeatorIntellectualPlanningAndTrademark";
import MlIdeatorLookingFor from "../Ideator/MlIdeatorLookingFor";
import MlIdeatorIdeas from '../Ideator/MlIdeatorIdeas';
import PortfolioLibrary from '../../../../../commons/components/portfolioLibrary/PortfolioLibrary';
import { client } from '../../../../core/apolloConnection';

export default class MlIdeatorPortfolioEditTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {tabs: [], ideatorPortfolio: {}, idea: {}, portfolioKeys: {privateKeys:[], removePrivateKeys:[],activeTab:'Ideas'}};
    this.getIdeatorDetails.bind(this);
    this.getProblemSolution.bind(this)
    this.getChildContext.bind(this)
  }

  getChildContext() {
    return {
      ideatorPortfolio: this.state.ideatorPortfolio,
      idea: this.state.idea,
      portfolioKeys: this.state.portfolioKeys
    }
  }

  componentDidMount() {
    setTimeout(function () {
      $('div[role="tab"]').each(function (index) {
        var test = $(this).text();
        $(this).empty();
        $(this).html('<div class="moolya_btn moolya_btn_in">' + test + '</div>');
      });
      $('.RRT__tabs').addClass('horizon-swiper');
      $('.RRT__tab').addClass('horizon-item');
      $('.horizon-swiper').horizonSwiper();
    }, 300);
  }

  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Ideas",
        component: <MlIdeatorIdeas tabName="ideas" key="2" getIdeas={this.getIdeas.bind(this)}
                                   portfolioDetailsId={this.props.portfolioDetailsId} ideaId={this.props.ideaId} client={client}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Ideator",
        component: <MlIdeatorDetails key="1" tabName="portfolioIdeatorDetails" client={client} isAdmin={true}
                                     getIdeatorDetails={this.getIdeatorDetails.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Problems and Solutions",
        component: <MlIdeatorProblemsAndSolutions tabName="problemSolution" client={client} isAdmin={true}
                                                  key="3" getProblemSolution={this.getProblemSolution.bind(this)}
                                                  portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Audience",
        component: <MlIdeatorAudience key="4" client={client} tabName="audience" isAdmin={true}
                                      getAudience={this.getAudience.bind(this)}
                                      portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        component: <PortfolioLibrary client={client} isAdmin={true} tabName="Library" key="5"
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Strategy and Planning",
        component: <MlIdeatorStrategyAndPlanning key="6" tabName="strategyAndPlanning"
                                                 getStrategyAndPlanning={this.getStrategyAndPlanning.bind(this)}
                                                 portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Intellectual Property And Trademarks",
        component: <MlIdeatorIntellectualPlanningAndTrademark key="7" tabName="intellectualPlanning"
                                                              getIntellectualPlanning={this.getIntellectualPlanning.bind(this)}
                                                              portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        component: <MlIdeatorLookingFor key="8" getLookingFor={this.getLookingFor.bind(this)} tabName="lookingFor"
                                        portfolioDetailsId={this.props.portfolioDetailsId}/>
      }
    ]
    return tabs;
  }

  getIdeatorDetails(details, privateKey, requiredFields) {
    let data = this.state.ideatorPortfolio;
    data['portfolioIdeatorDetails'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privateKey, requiredFields);
  }

  getIdeas(details, privateKey, requiredFields) {
    var data = this.state.idea;
    data = details;
    this.setState({idea: data})
    let updateItem = _.omit(data, 'ideaImage');
    this.props.getIdeatorIdeaDetails(updateItem, privateKey, requiredFields);
  }

  getProblemSolution(details, privateKey) {
    let data = this.state.ideatorPortfolio;
    data['problemSolution'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privateKey);
  }

  getStrategyAndPlanning(details, privateKey) {
    let data = this.state.ideatorPortfolio;
    data['strategyAndPlanning'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privateKey);
  }

  getIntellectualPlanning(details, privateKey) {
    let data = this.state.ideatorPortfolio;
    data['intellectualPlanning'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privateKey);
  }

  getAudience(details, privateKey) {
    let data = this.state.ideatorPortfolio;
    data['audience'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privateKey);
  }

  getLookingFor(details, privateKey) {
    let data = this.state.ideatorPortfolio;
    data['lookingFor'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privateKey);
  }

  componentWillMount() {
    let tabs = this.getTabComponents();

    function getTabs() {
      return tabs.map(tab => ({
        tabClassName: 'moolya_btn', // Optional
        panelClassName: 'panel1', // Optional
        title: tab.title,
        key: tab.title,
        getContent: () => tab.component
      }));
    }

    this.setState({tabs: getTabs() || []});
  }

  getAllPrivateKeys(privateKeys, removePrivateKeys) {
    let obj = {
      privateKeys:privateKeys,
      removePrivateKeys:removePrivateKeys
    }
    this.setState({portfolioKeys: obj});
    return obj
  }

  componentWillReceiveProps(newProps) {
    console.log('newProps', newProps);
    if (newProps) {
      const resp = this.getAllPrivateKeys(newProps.privateKeys, newProps.removePrivateKeys);
      return resp
    }
  }
  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }

  render() {
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="title"/>
  }
}
MlIdeatorPortfolioEditTabs.childContextTypes = {
  ideatorPortfolio: PropTypes.object,
  idea: PropTypes.object,
  portfolioKeys: PropTypes.object
};
