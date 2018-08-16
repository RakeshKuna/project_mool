import React from "react";
import MlCompanyEvolution from "./MlCompanyEvolution";
import MlCompanyPolicy from "./MlCompanyPolicy";
import MlCompanyAchivements from "./MlCompanyAchivements";
import MlTabComponent from "../../../../../../../commons/components/tabcomponent/MlTabComponent";
import {client} from '../../../../../../core/apolloConnection'
import {appClient} from '../../../../../../../app/core/appConnection'
import MlCompanyCSRReports from './MlCompanyCSRReports'

export default class MlCompanyCSREditTabs extends React.Component{
  constructor(props){
    super(props)
    this.state =  {
      tabs: [],
      portfolioCSR:{},
      evolution:{},
      achivements:[],
      policy:{},
      admin: true,
      activeTab:'Evolution'
    }
    ;
  }

  /**
   * handling different condition for app and admin
   * */
  componentDidMount(){
    var props = this.props
    setTimeout(function(){
      if(!props.isApp) {
        $('div[role="tab"]').each(function (index) {
          var test = $(this).text();
          $(this).empty();
          $(this).html('<div class="moolya_btn moolya_btn_in">' + test + '</div>');
        });
        $('.initialized').addClass('menunone');
        $('.RRT__tabs').addClass('horizon-swiper');
        $('.RRT__tab').addClass('horizon-item');
        $('.RRT__panel').addClass('nomargintop');
        $('.RRT__panel .RRT__panel').removeClass('nomargintop');
        $('.horizon-swiper').horizonSwiper();
      }else {
        $('.RRT__tabs').addClass('menunone');
        $('.RRT__container .RRT__container .RRT__tabs').removeClass('menunone');
      }
    },10);
    // let path = FlowRouter._current.path;
    // if (path.indexOf("app") != -1){
    //   this.setState({admin: false, client: appClient})
    // }
  }
  setBackTab(e) {
    this.props.backClickHandler(this.getCompanyCSRs.bind(this))
  }
  getCompanyCSRs() {
    this.props.backClickHandler();
    $('.RRT__tabs div:first-of-type').click();
  }

  getTabComponents(){
    let tabs = [
      {tabClassName: 'tab', panelClassName: 'panel', title:"Evolution", component:<MlCompanyEvolution client={client} isAdmin={true} key="1"  getEvolution={this.getEvolution.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} tabName="evolution"/> },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Achivements",
        component: <MlCompanyAchivements key="2" getAchivements={this.getAchivements.bind(this)} tabName={"achievements"} client={client}
                                         portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {tabClassName: 'tab', panelClassName: 'panel', title:"Reports", component:<MlCompanyCSRReports client={client} isAdmin={true} key="4" getReports={this.getReports.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} />},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Our Policy", component:<MlCompanyPolicy client={client} isAdmin={true} key="3" getPolicy={this.getPolicy.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} tabName="policy" />},
    ]
    return tabs;
  }

  getEvolution(details, privateKey){
    let data = this.state.evolution;
    data = details;
    this.setState({evolution : data})
    this.props.getCSRDetails(data,"evolution", privateKey);

  }
  getAchivements(details, privateKey, requiredFields){
    let data = this.state.achivements;
    data=details;
    this.setState({achivements : data})
    this.props.getCSRDetails(data,"achievements", privateKey, requiredFields);
  }
  getPolicy(details, privateKey){
    let data = this.state.listOfIncubators;
    data = details;
    this.setState({policy : data})
    this.props.getCSRDetails(data,"policy", privateKey);
  }
  getReports(details){
    let data = this.state.reports;
    data = details;
    this.setState({reports : data})
    this.props.getCSRDetails(data,"reports",null);
  }

  componentWillMount()
  {
    let admin=true;
    let path = FlowRouter._current.path;
    if (path.indexOf("app") != -1){
      admin = false;
    }
    let tabs = this.getTabComponents();
    function getTabs() {
      return tabs.map(tab => ({
        tabClassName: 'moolya_btn', // Optional
        panelClassName: 'panel1', // Optional
        title: tab.title,
        key:tab.title,
        getContent: () => tab.component
      }));
    }
    let AllTabs =getTabs() ||[];
    // if(admin){
    //   AllTabs.forEach(function(v){ delete v.key });
    // }
    let activeTab = FlowRouter.getQueryParam('subtab');
    if(activeTab){
      this.setState({activeTab:activeTab,tabs:AllTabs, admin: admin});
    }else
    this.setState({tabs:AllTabs, admin: admin});

    /**UI changes for back button*/  //+tab.tabClassName?tab.tabClassName:""
    this.setBackTab()
  }

  updateTab(index){
    let subtab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ subtab });
  }

  render(){
    let tabs = this.state.tabs;
    // if(this.state.admin){
    //   return <MlTabComponent tabs={tabs} backClickHandler={this.props.backClickHandler}/>
    // }
    // else{
      return <MlTabComponent tabs={tabs}
                             selectedTabKey={this.state.activeTab}
                             onChange={this.updateTab}
                             backClickHandler={this.props.backClickHandler}
                             type="subtab" mkey="title"
      />
    // }
  }
}

