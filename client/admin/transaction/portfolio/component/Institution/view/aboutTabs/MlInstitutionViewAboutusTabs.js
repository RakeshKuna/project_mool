/**
 * Created by Birendra on 21/8/17.
 */
import React from "react";
import MlInstitutionViewAbout from "./MlInstitutionViewAbout"
import MlInstitutionViewRating from "./MlInstitutionViewRating"
import MlInstitutionViewServicesAndProducts from "./MlInstitutionViewServicesAndProducts";
import MlInstitutionViewInformation from "./MlInstitutionViewInformation"
/**Routes need to be changed*/
import MlInstitutionViewClients from "./MlInstitutionViewClients";
import MlTabComponent from "../../../../../../../commons/components/tabcomponent/MlTabComponent";
import {client} from '../../../../../../../admin/core/apolloConnection'
import {appClient} from '../../../../../../../app/core/appConnection'

export default class MlInstitutionViewAboutusTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: [], admin: true,activeTab: "About Us",
      client: client
    }
    ;
  }

  /**
   * handling different condition for app and admin
   * */
  componentDidMount() {
    var props = this.props
    console.log(props)
    setTimeout(function () {
      if (!props.isApp) {
        $('div[role="tab"]').each(function (index) {
          var test = $(this).text();
          $(this).empty();
          $(this).html('<div class="moolya_btn moolya_btn_in">' + test + '</div>');
        });
        $('.last-item').addClass('menunone');
        $('.RRT__tabs').addClass('horizon-swiper');
        $('.RRT__tab').addClass('horizon-item');
        $('.RRT__panel').addClass('nomargintop');
        $('.RRT__panel .RRT__panel').removeClass('nomargintop');
        $('.horizon-swiper').horizonSwiper();
      } else {
        $('.RRT__tabs').addClass('menunone');
        $('.RRT__container .RRT__container .RRT__tabs').removeClass('menunone');
      }
    }, 10);
    let path = FlowRouter._current.path;
    if (path.indexOf("app") != -1) {
      this.setState({admin: false, client: appClient})
    }
  }

  /**
   * Giving data to all the tabs fetched from the internal "MlInstitutionViewAboutLanding"
   * */
  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About Us",
        name: "About Us",
        component: <MlInstitutionViewAbout client={client} isAdmin={true} key="1" tabName="aboutUs"
                                       portfolioDetailsId={this.props.portfolioDetailsId}
                                       getSelectedAnnotations={this.props.getSelectedAnnotations}
                                       aboutUsDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.aboutUs}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Rating",
        name: "Rating",
        component: <MlInstitutionViewRating key="2" portfolioDetailsId={this.props.portfolioDetailsId}
                                        getSelectedAnnotations={this.props.getSelectedAnnotations}
                                        ratingDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.rating}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Clients",
        name: "Clients",
        component: <MlInstitutionViewClients key="3" portfolioDetailsId={this.props.portfolioDetailsId} tabName="clients"
                                         getSelectedAnnotations={this.props.getSelectedAnnotations}
                                         clientsDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.clients}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Services & Products",
        name: "Services And Products",
        component: <MlInstitutionViewServicesAndProducts key="4" portfolioDetailsId={this.props.portfolioDetailsId} tabName="serviceProducts"
                                                     getSelectedAnnotations={this.props.getSelectedAnnotations}
                                                     serviceProductsDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.serviceProducts}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Information",
        name: "Information",
        component: <MlInstitutionViewInformation key="5" portfolioDetailsId={this.props.portfolioDetailsId} tabName="information"
                                             getSelectedAnnotations={this.props.getSelectedAnnotations}
                                             informationDetails={this.props.institutionAboutUsDetails && this.props.institutionAboutUsDetails.information}/>
      }
    ]
    return tabs;
  }

  componentWillMount() {
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
        key: tab.name,
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

  render() {
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

