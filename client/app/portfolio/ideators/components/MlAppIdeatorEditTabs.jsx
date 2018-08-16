import React, {Component, PropTypes}  from "react";
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
var FontAwesome = require('react-fontawesome');
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import MlIdeatorDetails from '../../../../admin/transaction/portfolio/component/Ideator/MlIdeatorDetails'
import MlIdeatorProblemsAndSolutions from '../../../../admin/transaction/portfolio/component/Ideator/MlIdeatorProblemsAndSolutions'
import MlIdeatorAudience from '../../../../admin/transaction/portfolio/component/Ideator/MlIdeatorAudience'
import MlIdeatorStrategyAndPlanning from '../../../../admin/transaction/portfolio/component/Ideator/MlIdeatorStrategyAndPlanning'
import MlIdeatorLookingFor from '../../../../admin/transaction/portfolio/component/Ideator/MlIdeatorLookingFor'
import MlIdeatorIntellectualPlanningAndTrademark from '../../../../admin/transaction/portfolio/component/Ideator/MlIdeatorIntellectualPlanningAndTrademark'
import MlIdeatorIdeas from '../../../../admin/transaction/portfolio/component/Ideator/MlIdeatorIdeas'
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary';
import {appClient} from '../../../core/appConnection'
import InteractionsCounter from '../../../commons/components/InteractionsCounter'
import {updatePortfolioActionHandler} from '../../../../admin/transaction/portfolio/actions/updatePortfolioDetails';

// import MlAppIdeatorIdeas from './MlAppIdeatorIdeas'

import 'react-responsive-tabs/styles.css'


export default class MlAppIdeatorEditTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: [],
      activeTab:'Ideas',
      ideatorPortfolio: {},
      ideatorId: this.props.config, portfolioKeys: {privateKeys: [], removePrivateKeys: []}
    };
    this.getIdeatorDetails.bind(this);
    this.getProblemSolution.bind(this)
    this.getChildContext.bind(this)
    // this.getSelectedAnnotation.bind(this);
  }

  getChildContext() {
    return {
      ideatorPortfolio: this.state.ideatorPortfolio,
      idea: this.state.idea,
      portfolioKeys: this.state.portfolioKeys
    }
  }

  componentDidMount() {
  }

  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Ideas",
        component: <MlIdeatorIdeas key="2" getIdeas={this.getIdeas.bind(this)} tabName="ideas"  client={appClient}
                                   portfolioDetailsId={this.props.portfolioDetailsId} ideaId={this.props.ideaId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Ideator",
        component: <MlIdeatorDetails key="1" isAdmin={false} client={appClient} tabName="portfolioIdeatorDetails"
                                     portfolioDetailsId={this.props.portfolioDetailsId}
                                     getIdeatorDetails={this.getIdeatorDetails.bind(this)}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Problems and Solutions",
        component: <MlIdeatorProblemsAndSolutions isAdmin={false} client={appClient} key="2" tabName="problemSolution"
                                                  portfolioDetailsId={this.props.portfolioDetailsId}
                                                  getProblemSolution={this.getProblemSolution.bind(this)}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Audience",
        component: <MlIdeatorAudience key="3" isAdmin={false} client={appClient} tabName="audience"
                                      portfolioDetailsId={this.props.portfolioDetailsId}
                                      getAudience={this.getAudience.bind(this)}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        component: <PortfolioLibrary key="4" client={appClient} isAdmin={false}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Strategy and Plans",
        component: <MlIdeatorStrategyAndPlanning key="5" portfolioDetailsId={this.props.portfolioDetailsId}
                                                 tabName="strategyAndPlanning"
                                                 getStrategyAndPlanning={this.getStrategyAndPlanning.bind(this)}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Intellectual Property And Trademarks",
        component: <MlIdeatorIntellectualPlanningAndTrademark key="6" portfolioDetailsId={this.props.portfolioDetailsId}
                                                              tabName="intellectualPlanning"
                                                              getIntellectualPlanning={this.getIntellectualPlanning.bind(this)}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        component: <MlIdeatorLookingFor key="7" portfolioDetailsId={this.props.portfolioDetailsId} tabName="lookingFor"
                                        getLookingFor={this.getLookingFor.bind(this)}/>
      },
    ]
    return tabs;
  }

  getIdeatorDetails(details, privatekey, requiredFields) {
    let data = this.state.ideatorPortfolio;
    data['portfolioIdeatorDetails'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privatekey, requiredFields);
  }

  getIdeas(details, privatekey, requiredFields) {
    let data = this.state.idea;
    data = details;
    this.setState({idea: data})
    let updateItem = _.omit(data, 'ideaImage');
    this.props.getIdeatorIdeaDetails(updateItem, privatekey, requiredFields);
  }

  getProblemSolution(details, privatekey) {
    let data = this.state.ideatorPortfolio;
    data['problemSolution'] = details;
    this.setState({ideatorPortfolio: data}, function () {
      this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privatekey);
    })

  }

  getStrategyAndPlanning(details, privatekey) {
    let data = this.state.ideatorPortfolio;
    data['strategyAndPlanning'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privatekey);
  }

  getIntellectualPlanning(details, privatekey) {
    let data = this.state.ideatorPortfolio;
    data['intellectualPlanning'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privatekey);
  }

  getAudience(details, privatekey) {
    let data = this.state.ideatorPortfolio;
    let updateItem = _.omit(details, 'logo');
    data['audience'] = updateItem;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privatekey);
  }

  getLookingFor(details, privatekey) {
    let data = this.state.ideatorPortfolio;
    data['lookingFor'] = details;
    this.setState({ideatorPortfolio: data})
    this.props.getPortfolioDetails({ideatorPortfolio: this.state.ideatorPortfolio}, privatekey);
  }

  getAllPrivateKeys(privateKeys, removePrivateKeys) {
    let obj = {
      privateKeys: privateKeys,
      removePrivateKeys: removePrivateKeys
    }
    this.setState({portfolioKeys: obj});
    return obj
  }

  componentWillReceiveProps(newProps) {
    if (newProps) {
      const resp = this.getAllPrivateKeys(newProps.privateKeys, newProps.removePrivateKeys);
      return resp
    }
  }

  componentWillMount() {
    let tabs = this.getTabComponents();

    function getTabs() {
      return tabs.map(tab => ({
        tabClassName: 'horizon-item', // Optional
        panelClassName: 'panel1', // Optional
        title: tab.title,
        key: tab.title,
        getContent: () => tab.component
      }));
    }
    let activeTab = FlowRouter.getQueryParam('tab');
    if(activeTab){
      this.setState({activeTab});
    }
    this.setState({tabs: getTabs() || []});
  }
  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }
  render() {
    let tabs = this.state.tabs;
    return (
      <div className="col-md-12 nopadding">
        <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="title"/>
      </div>
    )
    // return <MlTabComponent tabs={tabs}/>
  }
}
MlAppIdeatorEditTabs.childContextTypes = {
  ideatorPortfolio: PropTypes.object,
  idea: PropTypes.object,
  portfolioKeys: PropTypes.object
};
