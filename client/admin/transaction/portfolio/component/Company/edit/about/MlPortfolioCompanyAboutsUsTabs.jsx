
import React from "react";
import {render} from "react-dom";
import MlCompanyAboutUs from "./MlCompanyAboutUs";
import MlCompanyRating from "./MlCompanyRating";
import MlCompanyClients from "./MlCompanyClients";
import MlCompanySP from "./MlCompanySP";
import MlCompanyInformation from "./MlCompanyInformation";
import MlTabComponent from "../../../../../../../commons/components/tabcomponent/MlTabComponent";
import {client} from '../../../../../../core/apolloConnection'
import {appClient} from '../../../../../../../app/core/appConnection'

export default class MlPortfolioCompanyAboutsUsTabs extends React.Component{
  constructor(props){
    super(props)
    this.state =  {tabs: [], portfolioAboutUs:{},portfolioClients:[],
                    portfolioSP:{}, portfolioInfo:{}, portfolioRating:{}, admin: true,activeTab:"About Us",
                    client:client}
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
        $('.first-item').addClass('menunone');
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
    let path = FlowRouter._current.path;
    if (path.indexOf("app") != -1){
      this.setState({admin: false, client: appClient})
    }
  }

  getTabComponents(){
    let tabs = [
      // {tabClassName: 'tab back_icon fa fa-hand-o-left', panelClassName: 'panel', title:""},
      {tabClassName: 'tab', panelClassName: 'panel', title:"About Us",name:"About Us", component:<MlCompanyAboutUs client={client} isAdmin={true} key="1"  getAboutUs={this.getAboutUs.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} aboutUsDetails={this.props.aboutUsDetails&&this.props.aboutUsDetails.aboutUs} tabName="aboutUs"/> },
      {tabClassName: 'tab', panelClassName: 'panel', title:"Rating" ,name:"Rating" , component:<MlCompanyRating key="2" getRating={this.getRating.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} ratingDetails={this.props.aboutUsDetails&&this.props.aboutUsDetails.rating} tabName="rating"/>},
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Client",
        name: "Client",
        component: <MlCompanyClients client={client} isAdmin={true} key="3" getClients={this.getClients.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId} tabName={"clients"}
                                     clientsDetails={this.props.aboutUsDetails && this.props.aboutUsDetails.clients}/>
      },
      {tabClassName: 'tab', panelClassName: 'panel', title:"Services & Products" ,
        name: "Services And Products", component:<MlCompanySP key="4"  getServiceProducts={this.getServiceProducts.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} serviceProductsDetails={this.props.aboutUsDetails&&this.props.aboutUsDetails.serviceProducts} tabName="serviceProducts" />},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Information",name:"Information", component:<MlCompanyInformation  key="5" getInfo={this.getInfo.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} informationDetails={this.props.aboutUsDetails&&this.props.aboutUsDetails.information} tabName="information"/>},
    ]
    return tabs;
  }

  /**
   * @Note : need to check the use of maintaining state in this file
   * seems there is no use to maintain state in this file
   * */
  getAboutUs(details, privateKey){
    let data = this.state.portfolioAboutUs;
    data=details;
    this.setState({portfolioAboutUs : data})
    let updateItem = _.omit(details, 'logo');
    updateItem = _.omit(updateItem, 'privateFields');
    this.props.getPortfolioAboutUsDetails(updateItem,"aboutUs", privateKey);
  }
  getClients(details, privateKey, requiredFields){
    let data = this.state.portfolioClients;
    data = details;
    this.setState({portfolioClients : data})
    this.props.getPortfolioAboutUsDetails(data,"clients", privateKey, requiredFields);
  }
  getServiceProducts(details, privateKey){
    let data = this.state.portfolioSP;
    data = details;
    this.setState({portfolioSP : data})
    this.props.getPortfolioAboutUsDetails(data,"serviceProducts", privateKey);
  }
  getInfo(details, privateKey){
    let data = this.state.portfolioInfo;
    data = details;
    this.setState({portfolioInfo : data})
    this.props.getPortfolioAboutUsDetails(data,"information", privateKey);
  }

  getRating(details, privateKey){
    let data = this.state.portfolioRating;
    data = details;
    this.setState({portfolioRating : data})
    this.props.getPortfolioAboutUsDetails(data,"rating", privateKey);
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
        key:tab.name,
        name:tab.name,
        getContent: () => tab.component
      }));
    }

    let AllTabs =getTabs() ||[];
    // if(admin){
    //   AllTabs.forEach(function(v){ delete v.key });
    // }
    let activeTab = FlowRouter.getQueryParam('subtab');
    if(activeTab){
      this.setState({activeTab,tabs:AllTabs,admin});
    }else
    this.setState({tabs:AllTabs,admin});
    /**UI changes for back button*/  //+tab.tabClassName?tab.tabClassName:""
  }
  updateTab(index){
    let subtab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ subtab });
  }

  render(){
    let tabs = this.state.tabs;
    // if(this.state.admin){
    //   if(this.props.activeTab){
    //     let index = tabs.findIndex(i => i.name === this.props.activeTab);
    //     return <MlTabComponent tabs={tabs}   selectedTabKey={index||0} backClickHandler={this.props.getState}/>
    //   }else
    //   return <MlTabComponent tabs={tabs} backClickHandler={this.props.getState}/>
    // }
    // else{
      let activeTab =  this.props.activeTab || this.state.activeTab;
      return <MlTabComponent tabs={tabs}
                             selectedTabKey={activeTab}
                             onChange={this.updateTab}
                             backClickHandler={this.props.getState}
                             type="subtab" mkey="title"
      />
    // }
  }
}

