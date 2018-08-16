import React from "react";
import MlInstitutionAboutUs from "./MlInstitutionAboutUs";
import MlInstitutionRating from "./MlInstitutionRating";
import MlInstitutionClients from "./MlInstitutionClients";
import MlInstitutionInformation from "./MlInstitutionInformation";
import MlInstitutionSP from "./MlInstitutionSP";
import MlTabComponent from "../../../../../../../commons/components/tabcomponent/MlTabComponent";
import {client} from '../../../../../../core/apolloConnection'
import {appClient} from '../../../../../../../app/core/appConnection'
import MlInstitutionEditTabs from '../MlInstitutionEditTabs'

export default class MlInstitutionTab extends React.Component{
  constructor(props){
    super(props)
    this.state =  {tabs: [], portfolioInstitutionAboutUs:{}, portfolioInstitutionAssets:[],portfolioInstitutionClients:[],
                    portfolioInstitutionSP:{}, portfolioInstitutionInfo:{},portfolioInstitutionBranches:[],
                    portfolioInstitutionTechnologies:[],portfolioInstitutionLegal:{}, portfolioInstitutionRating:{}, admin: true,
                    client:client,activeTab:"About Us"}
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
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About Us",
        name: "About Us",
        component: <MlInstitutionAboutUs client={client} tabName={"aboutUs"} isAdmin={true} key="1" getInstitutionAboutUs={this.getInstitutionAboutUs.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} aboutUsDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.aboutUs} />
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Rating",
        name: "Rating",
        component: <MlInstitutionRating key="2" tabName={"rating"} getInstitutionRating={this.getInstitutionRating.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} ratingDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.rating} />
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Client",
        name: "Client",
        component: <MlInstitutionClients client={client} isAdmin={true} key="3"
                                         getInstitutionClients={this.getInstitutionClients.bind(this)}
                                         portfolioDetailsId={this.props.portfolioDetailsId} tabName={"clients"}
                                         clientsDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.clients}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Services & Products",
        name: "Services And Products",
        component: <MlInstitutionSP key="4" tabName={"serviceProducts"} getInstitutionSP={this.getInstitutionServiceProducts.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} serviceProductsDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.serviceProducts} />
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Information",
        name: "Information",
        component: <MlInstitutionInformation key="5" tabName={"information"} getInstitutionInfo={this.getInstitutionInfo.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} informationDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.information} />
      },
    ]
    return tabs;
  }

  /**
   * @Note : need to check the use of maintaining state in this file
   * seems there is no use to maintain state in this file
   * */
  getInstitutionAboutUs(details, privateKey){
    let data = this.state.portfolioInstitutionAboutUs;
    data=details;
    this.setState({portfolioInstitutionAboutUs : data})
    let updateItem = _.omit(details, 'logo');
    this.props.getPortfolioInstitutionAboutUsDetails(updateItem,"aboutUs",privateKey);
  }

  getInstitutionClients(details, privateKey, requiredFields) {
    let data = this.state.portfolioInstitutionClients;
    data = details;
    // this.setState({portfolioInstitutionClients : data})
    this.props.getPortfolioInstitutionAboutUsDetails(data, "clients", privateKey, requiredFields);
  }

  getInstitutionServiceProducts(details,privateKey){
    let data = this.state.portfolioInstitutionSP;
    data = details;
    // this.setState({portfolioInstitutionSP : data})
    this.props.getPortfolioInstitutionAboutUsDetails(data,"serviceProducts",privateKey);
  }

  getInstitutionInfo(details,privateKey){
    let data = this.state.portfolioInstitutionInfo;
    data = details;
    // this.setState({portfolioInstitutionInfo : data})
    this.props.getPortfolioInstitutionAboutUsDetails(data,"information",privateKey);
  }

  getInstitutionRating(details,privateKey){
    let data = this.state.portfolioInstitutionRating;
    data = details;
    // this.setState({portfolioInstitutionRating : data})
    this.props.getPortfolioInstitutionAboutUsDetails(data,"rating",privateKey);
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
        key:tab.name ,
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
    //     return <MlTabComponent tabs={tabs}   selectedTabKey={index||0} backClickHandler={this.props.getInstitutionState}/>
    //   }else
    //   return <MlTabComponent tabs={tabs} backClickHandler={this.props.getInstitutionState}/>
    // }
    // else{
      let activeTab =  this.props.activeTab || this.state.activeTab;
      return <MlTabComponent tabs={tabs}
                             selectedTabKey={activeTab}
                             onChange={this.updateTab}
                             backClickHandler={this.props.getInstitutionState}
                             type="subtab" mkey="title"
      />
    }
  // }
}

