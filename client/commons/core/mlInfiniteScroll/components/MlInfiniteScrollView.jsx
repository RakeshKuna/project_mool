/** ************************************************************
 * Date: 13 Jul, 2017
 * Programmer: Pankaj <pankajkumar.jatav@raksan.in>
 * Description : Infinite scroll main view presentation layer
 * JavaScript file MlInfiniteScrollView.js
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React, {Component} from 'react';
import ScrollArea from 'react-scrollbar';

export default class MlInfiniteScrollView extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props){
    super(props);
  }

  /**
   * @todo :: need to make the dynamic with the dynamic content, don't use the dependency on the URL.
   */
  componentDidMount() {
    var WinHeight = $(window).height();
    $('.infinite_scroll').height(WinHeight - (70 + $('.app_header').outerHeight(true)));
    //replace with props content
    setTimeout(function(){
    const url = window.location.pathname;
    const comType = url.substring(url.lastIndexOf('/')+1);
    let PageTitle = "";
    if(comType == "company"){
      PageTitle = "Companies";
    }else if(comType == "ideator"){
      PageTitle = "Ideators";
    }else if(comType == "startup"){
      PageTitle = "Startups";
    }else if(comType == "funder"){
      PageTitle = "Investors";
    }else if(comType == "serviceProvider"){
      PageTitle = "Service Providers";
    }else if(comType == "institution"){
      PageTitle = "Institutions";
    }else if(comType == "investor"){
      PageTitle = "Investors";
    }
    $("#pageTitle").text(PageTitle);
  },200);
  //replace with props content
  }

  render() {
    const {data, viewComponent}= this.props;
    let pConfig=_.extend(this.props.config);
    let ListComponent =React.cloneElement(viewComponent,{data:data, config:pConfig});
    return (
      <div>
      <div className="col-md-12"><h2 id="pageTitle"></h2></div>
      <br className="brclear"/>
      <div className="infinite_scroll ideators_list">
        <ScrollArea
        speed={0.8}
        className="infinite_scroll"
        smoothScrolling={true}
        default={true}
        >
          {ListComponent}
        </ScrollArea>
      </div>
      </div>
      )
  }
}

