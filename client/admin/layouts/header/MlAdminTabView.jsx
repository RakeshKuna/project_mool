/**
 * Updated by: vishwadeep.kapoor
 * @Note: config added for the menu to be shown on the UI or not 
 * value [isMenu]: boolean
 */
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import dynamicLinkHandler from './actions/dynamicRoutesHandler.js';
export default class MlTabView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // tabOptions: props.tabOptions,
      // linkField: props.linkField,
      // nameField: props.nameField,
    }
    return this;
  }

  componentDidMount(){
    var mySwiper = new Swiper('.swiper-menu',{
      speed: 400,
      spaceBetween:30,
      slidesPerView:'auto',
      mousewheelControl:true
    });


    $(document).ready(()=>{
      $('.moolya_btn_in').click(function(e){
        let transaction = $('.swiping_filters').css('transform');
        if($('.swiping_filters')[0] && $('.swiping_filters')[0].childNodes && $('.swiping_filters')[0].childNodes[0]){
          transaction = JSON.stringify({transaction:transaction,name:$('.swiping_filters')[0].childNodes[0].innerText});
          localStorage.setItem('transaction',transaction);
        }
      });
    });

    let transaction =localStorage.getItem('transaction');

    try{
     if(transaction)
       transaction = JSON.parse(transaction);
    }catch(e){
      transaction = '';
    }

    if(transaction) {
      if($('.swiping_filters')[0] && $('.swiping_filters')[0].childNodes && $('.swiping_filters')[0].childNodes[0]
        && $('.swiping_filters')[0].childNodes[0].innerText && transaction.name === $('.swiping_filters')[0].childNodes[0].innerText){
        setTimeout(function () {
          $('.swiping_filters').css("transform",transaction.transaction);
        }, 500);
      }else
        localStorage.setItem('transaction','');

    }
  }

  render() {
    let path = FlowRouter.current().route.name;
    let params = FlowRouter.current().params;
    let queryParams = FlowRouter.current().queryParams;
    let menuConfig = this.props.tabOptions||[];
    let menu, tabOptions;

    menu = find(path, menuConfig);

    function find(uniqueId, menus) {
      var i = 0, found;

      for (; i < menus.length; i++) {
        if (menus[i].uniqueId === uniqueId) {
          return menus[i];
        } else if (_.isArray(menus[i].subMenu)) {
          found = find(uniqueId, menus[i].subMenu);
          if (found) {
            return found;
          }
        }
      }
    }

    if (menu != undefined) {
      let subMenuHide=menu.hideSubMenu;
      //if subMenu has subMenusId then we need to fetch the subMenus for that mapping Id
      const subMenusId=menu.subMenusId;
      const subMenuMappingId=menu.subMenuMappingId;
      if (subMenusId){
        menu = find(menu.subMenusId, menuConfig);
      }

      let tabMenu = [];
      if(!subMenuHide){
        tabMenu= menu.subMenu;
      }


      tabOptions = tabMenu.map(function (option,index) {
        const isShowMenu = option.isMenu === false ? false : true;
        let activeClass="";
        let disabledClass = "";
        if(option.uniqueId===path){
          activeClass = 'active_btn'
        }

        if(option.isDisabled){
          disabledClass = 'disabled_item'
        }

        if(subMenuMappingId&&subMenuMappingId===option.uniqueId){
          activeClass = 'active_btn'
        }

        let isDynamicLink=option.dynamicLink||false;
        let isDisabled = option.isDisabled || false;
        let menuLink=option.link;
        if(isDynamicLink){
          menuLink=dynamicLinkHandler(option.uniqueId,params,queryParams);
        }
        return (
          <li className={`swiper-slide ${disabledClass}`} key={index}>
            {
              isShowMenu ?
                <div className={`moolya_btn ${activeClass} `}
                  onClick={this.subMenuClick}><a href={menuLink}
                    className={"moolya_btn moolya_btn_in"}>  {option.name} </a></div>
                : <span></span>
            }
          </li>
        )
      });
    }

    return (
      <div className="swiper-container swiper-menu">
      <ul className="swiper-wrapper swiping_filters">
        {tabOptions}
      </ul>
      </div>
    )
  }
}





{/* <li key={index} className={`swiper-slide ${disabledClass}`}>
                <div className={`moolya_btn ${activeClass} `}
                  onClick={this.subMenuClick}><a href={menuLink}
                    className={"moolya_btn moolya_btn_in"}>  {option.name} </a></div>
              </li> */}
